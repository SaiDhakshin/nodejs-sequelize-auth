
const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const Cart = sequelize.define('cart',{
    id: {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }
})




module.exports = Cart;