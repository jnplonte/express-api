import { Helper } from '../app/services/helper/helper.service';
import { ApiResponse } from '../app/services/api-response/api-response.service';
import { Mongo } from '../app/services/mongo/mongo.service';

import { Users } from '../app/v1/core/users/users.component';

export function setup(app, config, models) {
	const response = new ApiResponse(),
		helper = new Helper(config);
	const mongo = new Mongo(config);

	app.version('v1/core', (appCore) => {
		appCore.use((req, res, next) => {
			res.startTime = new Date().getTime();
			if (
				typeof req.headers === 'undefined' ||
				helper.isEmpty(req.headers[config.secretKey]) ||
				req.headers[config.secretKey] !== config.secretKeyHash
			) {
				return response.failed(res, 'token', '', 401);
			}

			mongo
				.getOne(models.users, {
					active: true,
					key: (req.headers['user-key'] || '') as string,
				})
				.then((user) => {
					if (!user || helper.isEmptyObject(user)) {
						return response.failed(res, 'token', '', 401);
					}

					req.userData = user;
					req.models = models;

					if (!req.models) {
						return response.failed(res, 'model', '', 500);
					}

					next();
				})
				.catch((error) => {
					return response.failed(res, 'token', '', 401);
				});
		});

		new Users(appCore, response, helper, mongo);
	});

	return app;
}
