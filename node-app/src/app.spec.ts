import * as supertest from 'supertest';
import { baseConfig } from './config';

import app from './app';

describe('application start', () => {
	before((done) => {
		const env = process.env.NODE_ENV || 'local';

		app.listen(process.env.PORT || baseConfig.api[env].port, (error) => {
			if (error) {
				return done(error);
			}

			done();
		});
	});

	it('should show the documentation page', (done) => {
		supertest(app)
			.get('/documentation')
			.expect('Content-Type', /html/)
			.expect(301, function (err, res) {
				if (err) {
					return done(err);
				}

				done();
			});
	});
});
