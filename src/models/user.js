const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    age: Number,
    gender: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;