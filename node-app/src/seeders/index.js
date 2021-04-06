const { Seeder } = require('mongo-seeding');
const path = require('path');

const config = {
	username: 'admin',
	password: 'johnpaul',
	database: 'testDB',
	host: '192.168.1.111',
	dialect: 'mongo',
	port: 27018,
};

const mongoURL = `mongodb://${config['username']}:${config['password']}@${config['host']}:${config['port']}/${config['database']}`;

const seederConfig = {
	database: mongoURL,
	dropDatabase: true,
	dropCollections: true,
};

const seeder = new Seeder(seederConfig);
const collections = seeder.readCollectionsFromPath(path.resolve('./src/seeders'), {
	extensions: ['ts'],
	transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
});

seeder
	.import(collections)
	.then(() => {
		console.log('Success');
	})
	.catch((err) => {
		console.log('Error', err);
	});
