const usersData = require('../model/defineDB')

const UsersSchema = require('../schema/UserSchema')

const TaskSchema = require('../schema/TaskSchema')

const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt')

const dotenv = require('dotenv');

const saltRound = 6

dotenv.config();

const jwtkey = process.env.SECRET_KEY

const jwt = require('jsonwebtoken')

// Error handling middleware for invalid routes
exports.handleInvalidRoutes = (req, res) => {
  res.status(404).json({ message: "Url Not Found" });
};

// register a user
exports.register = async (req, res) => {
  const { Username, Email, Password } = req.body
  
  const error = validationResult(req);
  // try {

  if (error.isEmpty()) {
    const checkExistanceUser = await UsersSchema.findOne({ where: { Email } })
    if (checkExistanceUser) {
      return res.json({status:409, message: 'Please Login you are already registered' });
    }
    else {
      const hash = bcrypt.hashSync(Password, saltRound);
      const addUsers = await UsersSchema.create({ ...req.body, Password: hash })
      return res.status(201).json({status:201, message: 'User registered successfully' });
    }
  }
  else {
    return res.status(400).json({ errors: error.array() });
  }

  // }
  // catch (error) {
  //   res.status(500).json({ message: 'Internal Server Error' });
  // }

}

//login 
exports.login = async (req, res) => {
// console.log("login",req.body)
  try {
    const { Email, Password } = req.body;
    const error = validationResult(req);
    if (error.isEmpty()) {
      const checkExistanceUser = await UsersSchema.findOne({ where: { Email } })

      if (checkExistanceUser === null) {
        return res.json({status:409, message: 'No user found,Please Register' });
      } else {
        await UsersSchema.findAll({ where: { Email: Email } }).then(result => {
          const Email = result[0].Email
          const DBPass = result[0].Password
          const comparePass = bcrypt.compareSync(Password, DBPass)

          const tokenData = {
            Email: Email,
          };

          if (comparePass) {
            const Id = result[0].Id
            jwt.sign(tokenData, jwtkey, ((err, token) => {
              const objectCookie = {
                token: token,
                Id: Id,
              }
              let stringValues = JSON.stringify(objectCookie)
              // res.cookie('Token', stringValues, { httpOnly: true });
              return res.status(200).json({status:200, message: 'Login successfull',token:token });
            }))

          }
          else {
            return res.json({ status:401,error: 'Unauthorized', message: 'Invalid password. Please try again.' });
          }
        }).catch(err => {
          res.status(500).json({ message: 'Login error' })
        })
      }
    }
    else {
      return res.status(400).json({ errors: error.array() });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

//logout
exports.logout = async (req, res) => {
  try {
      res.clearCookie("Token");
      return res.status(201).json({ message: 'Logout successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// add task
exports.addTask = async (req, res) => {
  console.log("===>",req.body.TaskDescription)
  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const addTasks = await TaskSchema.create({ Title: req.body.Title, TaskDescription: req.body.TaskDescription })
      return res.status(201).json({status:201, message: 'Task is added successfully' })
    }
    else {
      return res.status(400).json({ errors: error.array() });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }

}

//get all task
exports.getalltask = async (req, res) => {
  try {

    const taskList = await TaskSchema.findAll()

    if (taskList.length == 0) {
      return res.status(201).json({ message: 'No Task available' })
    } else {
      return res.status(201).json({ taskList: taskList })
    }
    // return res.status(201).json({ message: 'Task is added successfully' })

  }
  catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

//get single  task with id
exports.getsingletask = async (req, res) => {

  try {

    const singleTask = await TaskSchema.findOne({
      where: {
        Id: req.params.Id
      }
    })
    if (singleTask == null) {
      return res.status(201).json({ message: 'No Task available' })
    }
    else {
      return res.status(201).json({ singleTask: singleTask })
    }

  }
  catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

//update task 
exports.updateTask = async (req, res) => {

  try {
    const error = validationResult(req);
    if (error.isEmpty()) {
      const updateTaskbyId = await TaskSchema.update(req.body,
        {
          where: {
            Id: req.params.Id
          }
        })
      if (updateTaskbyId == null) {
        return res.status(201).json({status:201, message: 'No Task available' })
      }
      else {
        return res.status(201).json({ status:201,updateTaskbyId: updateTaskbyId })
      }
    }
    else {
      return res.status(400).json({ errors: error.array() });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}


//delete task (soft delete used paranoid in it )
exports.deleteTask = async (req, res) => {
  try {

  let deleteData = await TaskSchema.destroy({
    where: {
      Id: req.params.Id
    }
  })
  if (deleteData == null) {
    return res.status(201).json({status:201, message: 'No Task available' })
  }
  else {
    return res.status(201).json({ status:201,deleteData: deleteData })
  }
  }
  catch (error) {
     return res.json({ Message: "Error in deleting Task" })
  }

}
