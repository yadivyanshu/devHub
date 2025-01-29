const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: {type: String, required: true, trim: true, minlength: 3, maxLength: 50},
    lastName: {type: String, trim: true, minlength: 3, maxLength: 50},   
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: String,
    age: {type: Number, min: 18}, 
    gender: {type: String, 
        validate(value) {
            if(!["male", "female", "other"].includes(value.toLowerCase())) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {type: String, default: 'https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png'},
    about: String,
    skills: [String],
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;