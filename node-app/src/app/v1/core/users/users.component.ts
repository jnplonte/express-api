import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class Users extends CoreMiddleware {
	constructor(app, private response, private helper, private mongo) {
		super(app);
	}

	get services() {
		return {
			'GET /users': 'all',
			'GET /user/:id': 'get',
			'POST /users': 'post',
			'PUT /user/:id': 'put',
			'DELETE /user/:id': 'delete',
		};
	}

	/**
	 * @api {get} /core/users get all user
	 * @apiVersion 1.0.0
	 * @apiName all
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get all user
	 *
	 * @apiParam {String} [query] filter query Ex. ?query=key:value
	 * @apiParam {Number} [limit=10] data limit Ex. ?limit=1
	 * @apiParam {Number} [page=1] page number Ex. ?page=1
	 */
	all(req: Request, res: Response): void {
		const whereData = {};

		return this.mongo
			.getAll(req.models.users, whereData, req.query)
			.then((users: any) => {
				const { data, pagination } = users || { data: [], pagination: {} };
				return this.response.success(res, 'get', data || [], pagination);
			})
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {get} /core/user/:id get user
	 * @apiVersion 1.0.0
	 * @apiName get
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get user
	 *
	 * @apiParam (url segment) {String} id user id
	 * @apiParam (url parameter) {String} key key search Ex. ?key=name
	 */
	get(req: Request, res: Response): void {
		const whereData = {
			[(req.query.key || '_id') as string]: req.params.id as string,
		};

		return this.mongo
			.getOne(req.models.users, whereData)
			.then((user: UsersAttributes) => this.response.success(res, 'get', user || {}))
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {post} /core/users insert user
	 * @apiVersion 1.0.0
	 * @apiName post
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 * @apiDescription insert user
	 *
	 * @apiParam (body) {String} code user code
	 * @apiParam (body) {String} firstName first name
	 * @apiParam (body) {String} lastName last name
	 * @apiParam (body) {String} email unique email address
	 * @apiParam (body) {String} phone unique phone number
	 */
	post(req: Request, res: Response): void {
		const reqParameters = ['code', 'firstName', 'lastName', 'email'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data = this.autoFillPostInformation(req.body, {});

		return this.mongo
			.post(req.models.users, data)
			.then((user: UsersAttributes) => this.response.success(res, 'post', user))
			.catch((error) => this.response.failed(res, 'post', error));
	}

	/**
	 * @api {put} /core/user/:id update user
	 * @apiVersion 1.0.0
	 * @apiName put
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 * @apiDescription update user
	 *
	 * @apiParam (url segment) {String} id user id
	 * @apiParam (body) {String} [code] user code
	 * @apiParam (body) {String} [firstName] first name
	 * @apiParam (body) {String} [lastName] last name
	 * @apiParam (body) {String} [email] unique email address
	 * @apiParam (body) {String} [phone] unique phone number
	 * @apiParam (body) {Boolean} [active] is active user
	 */
	put(req: Request, res: Response): void {
		const whereData = {
			_id: req.params.id as string,
		};

		const data = this.autoFillPutInformation(req.body, {});

		return this.mongo
			.update(req.models.users, whereData, data)
			.then((user: UsersAttributes) => this.response.success(res, 'put', user))
			.catch((error) => this.response.failed(res, 'put', error));
	}

	/**
	 * @api {delete} /core/user/:id delete user
	 * @apiVersion 1.0.0
	 * @apiName delete
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 * @apiDescription delete user
	 *
	 * @apiParam (url segment) {String} id user id
	 * @apiParam (url parameter) {Boolean} force is force delete Ex. ?force=true
	 */
	delete(req: Request, res: Response): void {
		const whereData = {
			_id: req.params.id as string,
		};

		const force: boolean = req.query.force && req.query.force === 'true' ? true : false;

		if (force) {
			return this.mongo
				.delete(req.models.users, whereData)
				.then((user: UsersAttributes) => this.response.success(res, 'delete', user))
				.catch((error) => this.response.failed(res, 'delete', error));
		} else {
			const data = { active: false };
			return this.mongo
				.update(req.models.users, whereData, data)
				.then((user: UsersAttributes) => this.response.success(res, 'delete', user))
				.catch((error) => this.response.failed(res, 'delete', error));
		}
	}

	protected autoFillPostInformation(data: object = {}, authData: object = {}): object {
		data['active'] = true;
		data['key'] = this.helper.generateRandomString(50);

		data['createdAt'] = new Date();
		data['updatedAt'] = new Date();

		return data;
	}
}
