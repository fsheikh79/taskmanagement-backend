const express = require('express')

const router = express.Router()

const userController = require('../controller/Usercontroller')

const { check } = require('express-validator')

const authentication = require('../middleware/auth')
//registeration of user 
router.post('/register',
    check('Username', "Please enter a valid username").trim().isLength({ min: 3, max: 12 }),
    check('Email', 'Please enter a valid Email ').isEmail(),
    check('Password', "Please enter a valid Password ").isStrongPassword({
        minLength: 8, minLowercase: 1, minUppercase: 1,
        minNumbers: 1, minSymbols: 1
    }),
    userController.register
)

//login of user
router.post('/login',
    check('Email', 'Please Enter a valid email').notEmpty().isEmail(),
    check('Password', "Please enter valid password").notEmpty(),
    userController.login
)

//logout
router.get("/logout",userController.logout)

//add task
router.post("/addtask",authentication,
    check('Title', "Please enter a valid Title").trim().isLength({ min: 3, max: 30 }),
    check('TaskDescription', 'Please enter a valid TaskDescription').trim().isLength({ min: 3, max: 100 }),
    userController.addTask
)

//get all task
router.get("/getalltask",authentication, userController.getalltask)

//get all task
router.get("/gettaskbyid/:Id", authentication, userController.getsingletask)

//get all task
router.put("/updateTask/:Id",authentication,
    check('Title', "Please enter a valid Title").trim().isLength({ min: 3, max: 30 }),
    check('TaskDescription', 'Please enter a valid TaskDescription').trim().isLength({ min: 3, max: 100 }),
    userController.updateTask)

//delete the  task 
router.delete("/deleteTask/:Id",authentication, userController.deleteTask)



module.exports = router;