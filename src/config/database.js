const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://divycic1:div@cluster0.gwxvg.mongodb.net/devhubdb");
};

module.exports = connectDB;