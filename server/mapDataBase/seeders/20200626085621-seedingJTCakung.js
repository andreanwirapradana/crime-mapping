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
    name: 'Cakung',
    city: 'Jakarta Timur',
    mapName: 'cakung',
    population: 105649,
    homicide: 1,
    assault: 12,
    harassment: 5,
    abduction: 0,
    robbery: 47,
    theft: 68,
    drugs: 11,
    fraudulency: 0,
    anarchism: 0,
    status: 'warning',
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
