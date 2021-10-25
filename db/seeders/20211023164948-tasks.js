'use strict';

const { v4: uuidv4 } = require('uuid');
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Tasks',
    [
        {
            id: '29caeca9-0fde-4de9-9a32-f470ca3795ca',
            summary: 'Task 01-01',
            status: 'Done',
            created_at: new Date(2021,1,1,10,23,11),
            updated_at: new Date(2021,1,3,10,23,59),
            end_at: new Date(2021,1,3,10,23,45),
            user_id: '7d3ba767-9ea6-4461-b1b1-79e845aef66e'
        },
        {
            id: 'a4f853f3-4f81-427d-a772-f8da27872881',
            summary: 'Task 02-01',
            status: 'WIP',
            created_at: new Date(2021,1,4,9,23,53),
            updated_at: new Date(2021,1,5,15,23,21),
            user_id: '7d3ba767-9ea6-4461-b1b1-79e845aef66e'
        },
        {
            id: '648a03e1-8664-4c3a-88a6-ded58103c19c',
            summary: 'Task 01-02',
            status: 'Done',
            created_at: new Date(2021,0,4,10,23,33),
            updated_at: new Date(2021,0,5,10,23,31),
            end_at: new Date(2021,0,5,10,23,22),
            user_id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2'
        },
        {
            id: '7327547d-31db-412f-af57-82b65c76c09f',
            summary: 'Task 02-02',
            status: 'WIP',
            created_at: new Date(2021,0,5,8,23,55),
            updated_at: new Date(2021,0,6,16,23,25),
            user_id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2'
        },
        {
            id: 'd198a72b-c407-492e-9415-e0c535c3d299',
            summary: 'Task 03-02',
            status: 'Waiting',
            created_at: new Date(2021,0,6,15,21,43),
            user_id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2'
        },
        {
            id: 'd71b4793-8037-4f8d-95bf-3ed237aab87a',
            summary: 'Task 01-03',
            status: 'Waiting',
            created_at: new Date(2021,3,6,10,11,12),
            user_id: 'bba8772b-2e30-4db7-bd89-bb8e5bfdbbe1'
        },
        {
            id: 'c6eaec1e-8d9a-43b1-bf0e-46cf692747b9',
            summary: 'Task 02-03',
            status: 'Waiting',
            created_at: new Date(2021,3,6,13,31,41),
            user_id: 'bba8772b-2e30-4db7-bd89-bb8e5bfdbbe1'
        },
    ], {}),
    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Tasks', null, {})
};
