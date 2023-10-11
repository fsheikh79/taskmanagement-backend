const Sequelize = require('sequelize')
const  dotenv =require('dotenv');
dotenv.config();
const connSequelizeDB = new Sequelize(process.env.DATABASE_NAME, process.env.USER_DB, process.env.PASSWORD_DB, {
    host: process.env.SERVER,
    dialect: process.env.DB_DIALECT,
})

module.exports = connSequelizeDB 
