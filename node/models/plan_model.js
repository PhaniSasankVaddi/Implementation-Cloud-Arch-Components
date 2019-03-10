var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
    username: {type:String},
    vm_name: {type:String},
    plan: {type:String},
    active_ind: {type:Boolean},
    start_ind: {type:Boolean},
    t_start: {type:Date},
    t_end: {type:Date},
    duration: {type:Number},
    cost: {type:Number}
});

module.exports = mongoose.model('PlanUsage',planSchema);