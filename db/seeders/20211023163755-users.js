'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users',
        [
            {
                id: 'bc4369c4-437e-46c3-8e12-99dfa3d7b47f',
                name: 'Michael Scott',
                username: 'michael.scott',
                password: 'VLsjfKLPFXg1Yv3EGVyze9rwG+for5cLXTRZUVBz7vk=',
                email: 'mscott@dundermifflin.com',
                role: 'Manager',
                created_at: new Date(),
            },
            {
                id: '5fd27724-f24d-4d75-971e-8ddb20d7c516',
                name: 'Karen Filippelli',
                username: 'karen.filippelli',
                password: 'zmyHEia/w4qg4Ad32N06Z3GCriCYGfI6w+JzQMkvkD8=',
                email: 'kfilippelli@dundermifflin.com',
                role: 'Manager',
                created_at: new Date(),
            },
            {
                id: '7d3ba767-9ea6-4461-b1b1-79e845aef66e',
                name: 'James Halpert',
                username: 'jim.halpert',
                password: 'FbKiRs79MkkYY43cibN8mCNS441yAp+ZGsHqoVcrKjM=',
                email: 'jhalpert@dundermifflin.com',
                role: 'Technician',
                created_at: new Date(),
            },
            {
                id: 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2',
                name: 'Dwight K. Schrute',
                username: 'dwight.schrute',
                password: 'GzdOXsSVFJId+MyHfyZu4BOIH9yad9kz9lMsuvY9FUU=',
                email: 'dschrute@dundermifflin.com',
                role: 'Technician',
                created_at: new Date(),
            },
            {
                id: 'bba8772b-2e30-4db7-bd89-bb8e5bfdbbe1',
                name: 'Andrew Bernard',
                username: 'andy.bernard',
                password: 'Y7kZg+hZePdeq+qUaZ3Lp1OZ/F0lXM94+KQtKqPN4to=',
                email: 'abernard@dundermifflin.com',
                role: 'Technician',
                created_at: new Date(),
            }
        ], {}),
    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
