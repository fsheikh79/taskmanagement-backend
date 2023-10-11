const Sequelize =require('sequelize')

const sequelize = require('../model/defineDB');

const  dotenv =require('dotenv');
dotenv.config();

// defining users schema 
const userSchema = sequelize.define(process.env.DB_TABLE_NAME_1, {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    Password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports= userSchema;

