'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';

import { baseConfig } from '../config';

const databaseInstance: Array<any> = [];

export function setup() {
	if (databaseInstance['mongo']) {
		return databaseInstance['mongo'];
	}

	const basename = path.basename(__filename);
	const env = process.env.NODE_ENV || 'local';
	const db = {};

	const config = baseConfig.database[env];

	if (env !== 'production') {
		mongoose.set('debug', true);
	}

	if (mongoose.connection.readyState === 0) {
		mongoose.set('useCreateIndex', true);
		mongoose.set('useFindAndModify', false);
		mongoose.connect(
			`mongodb://${config['username']}:${config['password']}@${config['host']}:${config['port']}/${config['database']}`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		mongoose.connection.on('connected', (err) => {
			if (err) {
				console.error('mongo connection error:', err);
			} else {
				console.log('mongo connection success');
			}
		});
		mongoose.connection.on('error', console.error.bind(console, 'mongo connection error:'));
	}

	fs.readdirSync(__dirname)
		.filter((file) => {
			return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
		})
		.forEach((file) => {
			const model = require(path.join(__dirname, file)).default(mongoose);

			db[model.name] = model.model;
		});

	databaseInstance['mongo'] = db;
	return db;
}
