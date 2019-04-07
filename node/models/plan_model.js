var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
    username: String,
    vm_name: String,
    plan: String,
    active_ind: Boolean,
    start_ind: Boolean,
    t_start:Date,
    t_end:Date,
    price:Number,
    duration:Number,
    cost:Number
});

module.exports = mongoose.model('planModel',planSchema);