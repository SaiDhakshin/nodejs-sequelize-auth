const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const Product = sequelize.define('product',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    title : Sequelize.STRING,
    price : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    imageUrl : {
        type : Sequelize.STRING,
        allowNull : false
    },
    description : {
        type: Sequelize.STRING,
        // allowNull : false
    }
})

module.exports = Product;