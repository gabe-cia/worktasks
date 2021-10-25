(function() {

	'use strict';
	module.exports = (sequelize, DataTypes) => {
		const User = sequelize.define('User', {
			id: {
				type: DataTypes.UUIDV4,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV1,
			},
			name: {
				type: DataTypes.STRING(90),
				allowNull: false
			},
			username: {
				type: DataTypes.STRING(40),
				allowNull: false
			},
			password: {
				type: DataTypes.STRING(80),
				allowNull: false
			},
			email: {
				type: DataTypes.STRING(50),
				allowNull: false
			},
			role: {
				type: DataTypes.ENUM,
				values: ['Manager', 'Technician'],
				allowNull: false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false
			}
		}, {});
		User.associate = function (models) {
			User.hasOne(models.Task,
				{ foreignKey: 'user_id', as: 'tasks' });
		};
		return User;
	};
})();