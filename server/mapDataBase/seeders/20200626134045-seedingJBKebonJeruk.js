'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Districts', [{
    name: 'Kebon Jeruk',
    city: 'Jakarta Barat',
    mapName: 'kebonJeruk',
    population: 190665,
    homicide: 0,
    assault: 0,
    harassment: 1,
    abduction: 0,
    robbery: 2,
    theft: 241,
    drugs: 1,
    fraudulency: 0,
    anarchism: 0,
    status: 'dangerous',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Districts', null, {});
  }
};
