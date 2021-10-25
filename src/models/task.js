'use strict';
module.exports = (sequelize, DataTypes) => {
	const Task = sequelize.define('Task', {
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV1,
		},
		summary: {
			type: DataTypes.STRING(2500),
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM,
			values: ['Waiting', 'WIP', 'Done'],
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		end_at: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {});
	Task.associate = function (models) {
		Task.belongsTo(models.User,
			{ foreignKey: 'user_id', as: 'user' });
	};
	return Task;
};