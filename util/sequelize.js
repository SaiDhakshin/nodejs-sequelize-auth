const Sequelize = require('sequelize');


// const sequelize = new Sequelize('authuser','saidhakshin','qmpzfgh4563',{
//     dialect: 'postgres',
//     host : 'localhost',
//     storage : './session.postgres',
//     dialectOptions: {
//       supportBigNumbers: true
//     }
// })

const sequelize = new Sequelize(process.env.DATABASE_URL,{
  ssl : true,
  dialect: 'postgres',
  storage : './session.postgres',
  dialectOptions: {
    supportBigNumbers: true
  }
})

try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;