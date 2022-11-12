import supertest from 'supertest';

import manifest from '../manifest/manifest';
import {AppDependencies} from '../app_dependencies';
import {getExpressApp} from '../express_app';
import {testDependencies} from '../tests/test_utils';

describe('manifest', () => {
    const deps = testDependencies;
    const app = getExpressApp(deps);

    describe('manifest.json', () => {
        it('should use return the manifest', async () => {
            await supertest(app).get('/app/manifest.json')
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(manifest);
            });
        });
    });
});
