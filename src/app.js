const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

app.use('/', authRouter);   
app.use('/', profileRouter);

// app.patch('/users/:userId', async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//         const ALLOWED_UPDATES = ['photoUrl', 'gender', 'age', 'about', 'skills'];
//         const isUpdatedAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
//         if(!isUpdatedAllowed) {
//             return res.status(400).send("Invalid updates");
//         }

//         const updatedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: 'after', runValidators: true});
//         res.send(updatedUser);
//     }catch(err) {
//         res.status(400).send("Error while updating user " + err.message);
//     }
// });

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