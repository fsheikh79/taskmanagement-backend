const Sequelize =require('sequelize')

const sequelize = require('../model/defineDB');

const  dotenv =require('dotenv');
dotenv.config();

// defining tasks schema 
const taskSchema = sequelize.define(process.env.DB_TABLE_NAME_2, {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    TaskDescription:{
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    paranoid: true // This enables soft deletion (paranoid mode)
})

module.exports= taskSchema;
