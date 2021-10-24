'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tasks', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING(36),
                defaultValue: Sequelize.UUIDV4,
            },
            summary: {
                type: Sequelize.STRING(2500),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM,
                values: ['Waiting', 'WIP', 'Done'],
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            end_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            user_id: {
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Tasks');
    }
};