const express = require('express');
const connectDB = require('./config/database');
const app = express();

app.use("/test", (req, res) => {
    res.send('Hello World');
});



connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log(err);
    });