const express = require('express')

const app = express()

const cors = require('cors')

const userRoutes =require('./routes/Users')

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser');

const sequelize = require('./model/defineDB')

const  dotenv =require('dotenv');

const userController = require('../server/controller/Usercontroller')

dotenv.config();

app.use(cors())

app.use(bodyParser.json())

app.use(cookieParser());

app.use(userRoutes) 

app.use(userController.handleInvalidRoutes);

sequelize
  .sync()
  .then((result) => {
    console.log('Success====>');
    app.listen(process.env.PORT,()=>console.log("Server is running....."))
})
.catch((err) => {
    console.log('Error=> ', err);
});
