import { Helper } from '../app/services/helper/helper.service';
import { ApiResponse } from '../app/services/api-response/api-response.service';
import { Mongo } from '../app/services/mongo/mongo.service';

import { Token } from '../app/v1/authentication/token/token.component';

export function setup(app, config, models) {
	const response = new ApiResponse(),
		helper = new Helper(config);
	const mongo = new Mongo(config);

	app.version('v1/auth', (appAuth) => {
		appAuth.use((req, res, next) => {
			res.startTime = new Date().getTime();
			if (
				typeof req.headers === 'undefined' ||
				helper.isEmpty(req.headers[config.secretKey]) ||
				req.headers[config.secretKey] !== config.secretKeyHash
			) {
				return response.failed(res, 'token', '', 401);
			}

			req.models = models;

			if (!req.models) {
				return response.failed(res, 'model', '', 500);
			}

			next();
		});

		new Token(appAuth, response, helper, mongo);
	});

	return app;
}
