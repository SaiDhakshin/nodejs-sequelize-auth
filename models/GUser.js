const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const GUser = sequelize.define('guser',{
    id  : {
        type : Sequelize.STRING,
        allowNull : false,
        primaryKey : true
    },
    name : Sequelize.STRING,
    email : Sequelize.STRING
})

module.exports = GUser;