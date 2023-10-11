const dotenv = require('dotenv');

const jwt = require('jsonwebtoken')

dotenv.config();

const jwtkey = process.env.SECRET_KEY

const authentication = async (req, res, next) => {

    try {
        const token = req.headers.authorization

        // let cookieparseValue = JSON.parse(req.cookies.Token)

        //         const token = cookieparseValue.token
        
        if (token) {
            jwt.verify(token, jwtkey)
            // res.render('autheniticationmsg',{ Message: "You are loggined " })
            next()
        }
        else {
            return res.status(401).json({ message: "Unauthorized" });
        }

    } catch (error) {
        res.status(500).json({ message: "Please Login " });
    }
}

module.exports = authentication;