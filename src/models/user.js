const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const userSchema = new schema({
    firstName: {type: String, required: true, trim: true, minlength: 3, maxLength: 50},
    lastName: {type: String, trim: true, maxLength: 50},   
    email: {type: String, required: true, unique: true, lowercase: true, trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    age: {type: Number, min: 18}, 
    gender: {type: String, 
        validate(value) {
            if(!["male", "female", "other"].includes(value.toLowerCase())) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {type: String, default: 'https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png'},
    about: {type: String, maxLength: 500},
    skills: {type: [String], 
        validate(value) {
            if(value.length > 50) {
                throw new Error("At Max 50 skills are allowed");
            }
        }
    },
},
{
    timestamps: true
});

userSchema.methods.getJwt = async function() {  // Arrow function will not work here
    const user = this;
    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    return token;
};

userSchema.methods.validatePassword = async function(inputPassword) {
    const hashedPassword = this.password;
    const isMatched = await bcrypt.compare(inputPassword, hashedPassword);
    return isMatched;
};

const User = mongoose.model('User', userSchema);
module.exports = User;