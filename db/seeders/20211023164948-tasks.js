'use strict';

const { v4: uuidv4 } = require('uuid');
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Tasks',
    [
        {
            id: uuidv4(),
            summary: 'Task 01-01',
            status: 'Done',
            created_at: new Date(2021,1,1,10,23,11),
            updated_at: new Date(2021,1,3,10,23,59),
            end_at: new Date(2021,1,3,10,23,45),
            user_id: '7d3ba767-9ea6-4461-b1b1-79e845aef66e'
        },
        {
            id: uuidv4(),
            summary: 'Task 02-01',
            status: 'WIP',
            created_at: new Date(2021,1,4,9,23,53),
            updated_at: new Date(2021,1,5,15,23,21),
            user_id: '7d3ba767-9ea6-4461-b1b1-79e845aef66e'
        },
        {
            id: uuidv4(),
            summary: 'Task 01-02',
            status: 'Done',
            created_at: new Date(2021,0,4,10,23,33),
            updated_at: new Date(2021,0,5,10,23,31),
            end_at: new Date(2021,0,5,10,23,22),
            user_id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2'
        },
        {
            id: uuidv4(),
            summary: 'Task 02-02',
            status: 'WIP',
            created_at: new Date(2021,0,5,8,23,55),
            updated_at: new Date(2021,0,6,16,23,25),
            user_id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2'
        },
        {
            id: uuidv4(),
            summary: 'Task 03-02',
            status: 'Waiting',
            created_at: new Date(2021,0,6,15,21,43),
            user_id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2'
        },
        {
            id: uuidv4(),
            summary: 'Task 01-03',
            status: 'Waiting',
            created_at: new Date(2021,3,6,10,11,12),
            user_id: 'bba8772b-2e30-4db7-bd89-bb8e5bfdbbe1'
        },
        {
            id: uuidv4(),
            summary: 'Task 02-03',
            status: 'Waiting',
            created_at: new Date(2021,3,6,13,31,41),
            user_id: 'bba8772b-2e30-4db7-bd89-bb8e5bfdbbe1'
        },
    ], {}),
    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Tasks', null, {})
};
