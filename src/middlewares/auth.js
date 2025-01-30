const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error("Invalid token !");
        }
        const decodedObj = jwt.verify(token, 'TempKey$123');
        const userId = decodedObj._id;
        const user = await User.findById(userId);
        if(!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("Error while authenticating user: " + err.message);
    }
};

module.exports = { userAuth };