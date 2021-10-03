const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const Admin = sequelize.define('admin',{
    id  : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name : Sequelize.STRING,
    email : Sequelize.STRING,
    password: Sequelize.STRING
})

module.exports = Admin;