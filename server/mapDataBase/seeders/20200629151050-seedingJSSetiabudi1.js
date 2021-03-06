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
    name: 'Setia Budi',
    city: 'Jakarta Selatan',
    mapName: 'setiabudi1',
    population: 140985,
    homicide: 0,
    assault: 0,
    harassment: 0,
    abduction: 0,
    robbery: 1,
    theft: 1,
    drugs: 4,
    fraudulency: 0,
    anarchism: 0,
    status: 'safe',
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
