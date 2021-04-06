import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';
import { Users } from './users.component';

import { Helper } from './../../../../app/services/helper/helper.service';
import { baseConfig } from './../../../../config';

const authKey: string = 'Lrzu8gKFu3Q9346pEgcE4eFBrFYsE95JS6Zsgecu6LFYa7yr2D';
let testName: string = '';

describe('users component', () => {
	let application: any;

	before((done) => {
		application = new Users('sandbox', null, new Helper(baseConfig), null);

		done();
	});

	it('should have the basic method', (done) => {
		expect(application.autoFillPostInformation).to.exist;
		expect(application.autoFillPostInformation).to.be.a('function');
		expect(application.autoFillPutInformation).to.exist;
		expect(application.autoFillPutInformation).to.be.a('function');

		done();
	});

	it('should get all user', (done) => {
		supertest(app)
			.get('/v1/core/users?test=true')
			.set('x-node-api-key', 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn')
			.set('user-key', authKey)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('Array');
				expect(res.body.data).to.have.lengthOf.above(1);

				done();
			});
	});

	it('should create user', (done) => {
		supertest(app)
			.post('/v1/core/users?test=true')
			.set('x-node-api-key', 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn')
			.set('user-key', authKey)
			.send({
				code: 'ABC',
				firstName: 'john',
				lastName: 'paul',
				email: 'email@gmail.com',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				testName = res.body.data['_id'] || '';
				expect(res.body.status).to.equal('success');

				done();
			});
	});

	it('should get user', (done) => {
		supertest(app)
			.get(`/v1/core/user/${testName}?test=true`)
			.set('x-node-api-key', 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn')
			.set('user-key', authKey)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('Object');

				done();
			});
	});

	it('should update user', (done) => {
		supertest(app)
			.put(`/v1/core/user/${testName}?test=true`)
			.set('x-node-api-key', 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn')
			.set('user-key', authKey)
			.send({
				firstName: 'test-update',
				lastName: 'test-update',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');

				done();
			});
	});

	it('should delete user', (done) => {
		supertest(app)
			.delete(`/v1/core/user/${testName}?force=true&test=true`)
			.set('x-node-api-key', 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn')
			.set('user-key', authKey)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');

				done();
			});
	});
});
