'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING(36),
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING(90),
                allowNull: false
            },
            username: {
                type: Sequelize.STRING(40),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(80),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['Manager', 'Technician'],
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};