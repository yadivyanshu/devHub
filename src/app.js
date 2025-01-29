const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');


const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User created successfully");
    }catch(err) {
        res.status(400).send("Error while creating user " + err.message);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    }catch(err) {
        res.status(400).send("Error while getting users " + err.message);
    }
});

app.patch('/users', async (req, res) => {
    const userId = req.body.id;
    const data = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: 'after', runValidators: true});
        res.send(updatedUser);
    }catch(err) {
        res.status(400).send("Error while updating user " + err.message);
    }
});

app.delete('/users', async (req, res) => {
    const userId = req.body.id;
    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err) {
        res.status(400).send("Error while deleting user " + err.message);
    }
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