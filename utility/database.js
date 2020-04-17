const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-app', 'root', 'f@tm@0401', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;