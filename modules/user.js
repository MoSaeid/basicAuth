const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
})

// userSchema.statics.findAndValidate = async function(email, password) {
//     const foundUser = await this.findOne({ email });
//     if(! foundUser){
//         return false;
//     }
//     const isValid = bcrypt.compare(password, foundUser.password);
//     if(! isValid){
//         return false;
//     }else{
//         return isValid;
//     }
// }

module.exports = mongoose.model('User', userSchema);