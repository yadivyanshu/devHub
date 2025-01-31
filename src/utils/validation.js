
const validateEditProfileData = (req) => {
    const data = req.body;
    const ALLOWED_UPDATES = ['firstName', 'lastName', 'email', 'photoUrl', 'gender', 'age', 'about', 'skills'];
    const isUpdateAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
    return isUpdateAllowed;
};

module.exports = { validateEditProfileData };