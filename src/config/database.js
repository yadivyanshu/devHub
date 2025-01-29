const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("");
};

module.exports = connectDB;