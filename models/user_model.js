var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    email : {type:String, required:[true,'Email id is required']},
    username: {type:String, required:[true,'Username is required']},
    password:{type:String, required:[true,'Password is required']},
    active_ind:{type:String, required:[true, 'Active Ind is required']},
    creation_dt:{type:Date}
});

userSchema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

userSchema.methods.isValid = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User',userSchema);