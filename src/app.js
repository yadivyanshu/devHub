const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');


const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    try {
        await user.save();
        res.send("User created successfully");
    }catch(err) {
        res.status(400).send("Error while creating user " + err.message);
    }
});

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