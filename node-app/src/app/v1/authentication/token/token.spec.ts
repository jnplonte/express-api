import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';

describe('token component', () => {
	it('should get token', (done) => {
		supertest(app)
			.post('/v1/auth/token?test=true')
			.set('x-node-api-key', 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn')
			.send({
				key: 'Lrzu8gKFu3Q9346pEgcE4eFBrFYsE95JS6Zsgecu6LFYa7yr2D',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data['_id']).to.not.be.null;

				done();
			});
	});
});
