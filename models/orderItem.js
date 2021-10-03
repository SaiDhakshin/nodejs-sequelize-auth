const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const orderItem = sequelize.define("orderItem",{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    quantity : Sequelize.INTEGER
})

module.exports = orderItem;