import * as dbConfig from './database-config.json';
import * as apiConfig from './api-config.json';

export const baseConfig = {
	name: 'expressapi',
	logo: 'https://via.placeholder.com/50',
	poweredBy: 'express api',
	secretKey: 'x-node-api-key',
	secretKeyHash: 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn',
	getQueryLimit: 10,

	database: dbConfig,
	api: apiConfig,
};
