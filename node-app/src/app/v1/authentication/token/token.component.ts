import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from '../../../../models/users';

export class Token extends CoreMiddleware {
	constructor(app, private response, private helper, private mongo) {
		super(app);
	}

	get services() {
		return {
			'POST /token': 'token',
		};
	}

	/**
	* @api {post} /auth/token fetch user information
	* @apiVersion 1.0.0
	* @apiName post-token
	* @apiGroup AUTHENTICATION
	* @apiPermission all
	* @apiDescription fetch user information via token

	* @apiParam (body) {String} key user key
	 */
	token(req: Request, res: Response): void {
		const reqParameters: string[] = ['key'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const whereData = {
			key: req.body.key,
		};

		return this.mongo
			.getOne(req.models.users, whereData)
			.then((user: UsersAttributes) => this.response.success(res, 'get', user || {}))
			.catch((error) => this.response.failed(res, 'get', error));
	}
}
