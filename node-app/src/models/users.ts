export interface UsersAttributes {
	_id?: string;

	key?: string;
	code?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	active?: boolean;

	updatedAt?: Date;
	createdAt?: Date;
}

export default function userModel(mongoose) {
	const userSchema = mongoose.Schema(
		{
			key: {
				type: String,
				required: true,
			},
			code: {
				type: String,
				required: true,
			},

			firstName: {
				type: String,
			},
			lastName: {
				type: String,
			},
			email: {
				type: String,
			},
			phone: {
				type: String,
			},
			active: {
				type: Boolean,
				default: true,
			},

			updatedAt: {
				type: Date,
				default: new Date(),
			},
			createdAt: {
				type: Date,
				default: new Date(),
			},
		},
		{ collation: { locale: 'en', strength: 2 } }
	);

	userSchema.index({ active: 1, createdAt: -1 });

	return {
		name: 'users',
		model: mongoose.model('users', userSchema),
	};
}
