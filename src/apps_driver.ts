import {AppBinding, AppCallRequest, AppCallResponse, AppContext, AppExpand} from 'types/apps';

export enum AppBindingLocation {
    POST_MENU = 'post_menu',
    COMMAND = 'command',
    CHANNEL_HEADER = 'channel_header',
    APP_BAR = 'app_bar',
}

export type BaseHandler<ReturnValue, Dependencies, Context, OtherArg=any> = (callRequest: AppCallRequest<Context>, dependencies: Dependencies, otherArg?: OtherArg) => (Promise<ReturnValue> | ReturnValue);

export type MakeBinding<D, Context=any> = BaseHandler<AppBinding, D, Context, string[]>;

export type CallHandler<D, Context=any, Response=any> = BaseHandler<Response, D, Context>;
export type ShouldShowBindings<D, BindingsContext=any> = BaseHandler<boolean, D, BindingsContext>;
export type GetLabel<D, E=any> = BaseHandler<string, D, E>;

export interface Bindable<D> {
    location: AppBindingLocation | string;
    shouldShow: ShouldShowBindings<D>;
    makeBinding: MakeBinding<D>;
    getLabel?: GetLabel<D>;
    endpoint?: string;
    handler?: CallHandler<D>;

    parentInstance?: Bindable<D>;
    childInstances?: Bindable<D>[];
}

export interface BindableConstructor<D, Context> {
    new (registrar: BindingsRegistrar<D, Context>, deps: D): Bindable<D>;
}

type BindingsHandler<D, BindingsContext> = BaseHandler<AppCallResponse<AppBinding[]>, D, BindingsContext>;

export class BindingsRegistrar<D, BindingsContext> {
    private bindables: Array<Bindable<D>> = [];
    private commands: Array<Bindable<D>> = [];
    private handlers: {[endpoint: string]: CallHandler<D>} = {};
    commandBindable: Bindable<D>;

    constructor(private expressRoute: string, private deps: D) {
        this.commandBindable = new CommandBindable(this, deps);
    }

    getBindables = () => this.bindables;

    handleBindings: BindingsHandler<D, BindingsContext> = async (req, deps) => {
        const command: AppBinding = {
            app_id: req.context.app_id!,
            label: '',
            location: '/' + AppBindingLocation.COMMAND,
        }

        const checkShouldShow = async (parent: AppBinding, child: Bindable<D>, locations: string[]) => {
            return Promise.resolve(child.shouldShow(req, deps)).then(async should => {
                if (!should) {
                    return;
                }

                const binding = await Promise.resolve(child.makeBinding(req, deps, locations));
                parent.bindings = parent.bindings || [];
                parent.bindings.push(binding);

                if (child.childInstances) {
                    const promises = child.childInstances.map((child2) => checkShouldShow(binding, child2, [...locations, binding.location!]));
                    await Promise.all(promises);
                }
            });
        }

        const promises = this.commands.map(child => checkShouldShow(command, child, [command.location!]));
        await Promise.all(promises);

        return {
            type: 'ok',
            data: [
                command,
            ],
        }
    }

    addBinding = (Parent?: BindableConstructor<D, BindingsContext>) => (Bind: BindableConstructor<D, BindingsContext>) => {
        const bindable = new Bind(this, this.deps);
        if (Parent) {
            let parent = this.bindables.find(b => b instanceof Parent);
            if (!parent && this.commandBindable instanceof Parent) {
                parent = this.commandBindable;
            }

            if (parent) {
                parent.childInstances = parent.childInstances || [];
                parent.childInstances.push(bindable);
                bindable.parentInstance = parent;
            }
        }

        this.bindables.push(bindable);

        const staticChildren = (Bind as unknown as StaticBindable<D, BindingsContext>).staticChildren;
        if (staticChildren) {
            staticChildren.forEach((child) => this.addBinding(Bind)(child));
        }

        if (bindable.handler && !bindable.endpoint) {
            const locations = getParentLocations(bindable);
            bindable.endpoint = locations.join('/');
        }

        console.log(bindable.endpoint)
        return bindable;
    }

    addCommand = (Bind: BindableConstructor<D, BindingsContext>) => {
        const bindable = this.addBinding(CommandBindable)(Bind);

        this.commands.push(bindable);
    }
}

type StaticBindable<D, Context> = {
    staticChildren: BindableConstructor<D, Context>[];
    staticParent?: BindableConstructor<D, Context>;
};

export abstract class BaseBindable<D, BindingsContext> {
    abstract location: string;
    label?: string;
    parentInstance?: Bindable<D>;
    childInstances: Bindable<D>[] = [];
    parent?: BindableConstructor<D, BindingsContext>;
    children: BindableConstructor<D, BindingsContext>[] = [];
    getLabel?: GetLabel<D, BindingsContext>;
    endpoint?: string;
    handler?: CallHandler<D>;
    expand?: AppExpand;

    constructor(private registrar: BindingsRegistrar<D, BindingsContext>, deps: D) {}

    makeBinding: MakeBinding<D, BindingsContext> = async (req, deps): Promise<AppBinding> => {
        let label = this.label || this.location;
        if (this.getLabel) {
            label = await Promise.resolve(this.getLabel(req, deps));
        }

        const binding: AppBinding = {
            app_id: req.context.app_id!,
            location: this.location,
            label,
        };

        if (this.handler && this.endpoint) {
            binding.submit = {
                path: this.endpoint,
                expand: this.expand,
            }
        }

        return binding;
    }

    shouldShow: ShouldShowBindings<D> = (req, deps) => {
        return true;
    }

    static add<D=any, BindingsContext=any>(Parent?: BindableConstructor<D, BindingsContext>) {
        return (BindableClass: BindableConstructor<D, BindingsContext>) => {
            BaseBindable.implementAddBinding(BindableClass);

            if (Parent) {
                const parent = (Parent as unknown as StaticBindable<D, BindingsContext>);
                parent.staticChildren = parent.staticChildren || [];
                parent.staticChildren.push(BindableClass);

                const child = (BindableClass as unknown as StaticBindable<D, BindingsContext>);
                child.staticParent = Parent;
            }
        }
    }

    static makeBindable<D=any, BindingsContext=any>(Parent?: BindableConstructor<D, BindingsContext>) {
        return (BindableClass: BindableConstructor<D, BindingsContext>) => {
            BaseBindable.implementAddBinding(BindableClass);
        }
    }

    static implementAddBinding<D, BindingsContext>(Bind: BindableConstructor<D, BindingsContext>) {
        (Bind as any).Class = Bind;
        const bind = Bind as any;

        const oldAddBinding = bind.add;
        bind.add = () => (Bind2: BindableConstructor<D, BindingsContext>) => {
            return oldAddBinding(bind)(Bind2);
        };

        return Bind;
    }
}

const getParentLocations = <D>(b: Bindable<D>): string[] => {
    let locations: string[] = [];
    if (b.parentInstance) {
        locations = getParentLocations(b.parentInstance)
    }

    locations.push(b.location)
    return locations;
}

class CommandBindable extends BaseBindable<any, any> {
    location = '/command';
}
