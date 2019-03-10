var userModel = require('../models/user_model');
var jwt = require('jsonwebtoken');

module.exports = function(app){
    app.post('/signup',function(req,res,next){
  userModel.findOne({'email': req.body.email},(error,doc) =>{
    if(doc){
      return res.json({message:'Email id is already registered'});
    }else{
      var user = new userModel({
      email: req.body.email,
      username: req.body.username,
      password: userModel.hashPassword(req.body.password),
      active_ind: "Y",
      creation_dt: Date.now()
  });

  let promise = user.save();

  promise.then(function(doc){
    return res.status(201).json({message:'Registration Successful'});
  })

  promise.catch(function(error){
    return res.status(501).json({message: 'Error while registering user.'})
  })
    }
  })
    
});


 
}