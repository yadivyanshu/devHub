const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).send("Unauthorized");
        }
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
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