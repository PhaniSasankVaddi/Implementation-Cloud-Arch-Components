var userModel = require('../models/user_model');
var planModel = require('../models/plan_model');
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

app.post('/signin', function(req,res,next){
    userModel.findOne({'email':req.body.email},(error,doc) =>{
        if(doc){
            if(doc.isValid(req.body.password)){
                let webToken = jwt.sign({email:doc.email},'secretkey',{expiresIn : '1h'});
                return res.status(200).json(webToken);
            }else{
                return res.status(403).json({message:'Invalid Credentials'});
            }
        }
        else{
            return res.status(510).json({message:'Admin NotFound'});
        }
    })
    
});

app.get('/findvms',tokenVerification,function(req,res,next){
    planModel.find({'username':token_decoded.email,'active_ind':true},(error,vms)=>{
        if(error){
            return res.status(400).json({message:'Error while fetching the Virtual Machines'});
        }else if(!vms){
            return res.status(201).json({message:'No VMs are created'});
        }else{
            return res.status(200).send(vms);
        }
    });
});
    
app.post('/start',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.body.vm_name,'active_ind':true},(error,user)=>{
        if(user){
            if(user.start_ind == true){
                return res.status(200).json({message:'Server is already started'});
            }else{
                var vm_info = new planModel({
                    username:token_decoded.email,
                    vm_name:user.vm_name,
                    plan: user.plan,
                    active_ind:true,
                    start_ind:true,
                    t_start: Date.now()
                });

                let promise = vm_info.save();

                promise.then(function(doc){
                    planModel.updateOne({'username':token_decoded.email,'vm_name':req.body.vm_name,'active_ind':true},
                    {$set:{'active_ind':false}},
                    {upsert:true},(error1) =>{
                    if(error1){
                        return res.status(401).json({message:'Error while starting the server'});
                    }else{
                        return res.status(200).send(vm_info);
                    }
                });
                });

                promise.catch(function(error2){
                    return res.status(401).json({message:'Error while creating the new instance for start server'});
                })
                
            }
            
        }else{
            return res.status(400).json({message:'Error occured while starting the server'});
        }
    });
});

app.post('/stop',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.body.vm_name,'active_ind':true},(error,plan)=>{
        if(plan){
            if(plan.start_ind == false){
                return res.status(200).json({message:'Server is already stopped'});
            }else{
                planModel.updateOne({'username':token_decoded.email,'vm_name':req.body.vm_name,'active_ind':true},
                {$set:{'start_ind':false, 't_end':Date.now(),'duration':Date.now()-plan.t_start,
                        'cost':plan.price*(Date.now()-plan.t_start)}},
                {upsert:true},(error1) =>{
                    if(error1){
                        return res.status(401).json({message:'Error while stopping the server'});
                    }else{
                        return res.send(plan);
                    }
                });
            }
        }else{
            return res.status(400).json({message:'Error occured while stopping the server'});
        }
    });
});

app.post('/changeplan',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.body.vm_name, 'active_ind': true},(error,vm)=>{
        if(vm){
            planModel.updateOne({'vm_name':req.body.vm_name,'username':token_decoded.email,'plan':req.body.oldplan,'active_ind':true},
            {$set:{'active_ind':false,'t_end':Date.now(),'duration':Date.now()-vm.t_start, 'cost':vm.price*(Date.now()-vm.t_start)}},
            {upsert:true},(error1)=>{
            if(error1){
                return res.status(401).json({message:'Error while upgrading the VM'});
            }else{
                var newPlanVM = new planModel({
                    username: token_decoded.email,
                    vm_name: req.body.vm_name,
                    plan: req.body.newplan,
                    active_ind:true,
                    start_ind:true,
                    t_start: Date.now(),
                    price: req.body.newplan=="basic"?5:req.body.newplan=="large"?10:req.body.newplan=="ultra"?15:5
                });
                    
                let promise = newPlanVM.save();
                promise.then(function(doc){
                    return res.status(200).send(newPlanVM);
                });
                    
                promise.catch(function(error){
                    return res.status(400).json({message:'Error after upgrading the VM'})
                });
                    
            }
        });
        }else{
            return res.status(400).json({message:'Error while upgrading the VM'});
        }
    });
});

app.post('/create',tokenVerification, function(req,res,next){
    console.log(req);
    planModel.find({$and:[{'username':token_decoded.email}, {'vm_name':req.body.vm_name}]},(error,vm)=>{
        if(vm.length !=0){
            return res.status(400).json({message:'Virtual Machine exists with this name. Please choose a different name'})
        }else{
            console.log('this is the req ', req);
            var plan = new planModel({
                username :token_decoded.email,
                vm_name :req.body.vm_name,
                plan :req.body.plan,
                active_ind :true,
                start_ind :true,
                t_start:Date.now(),
                duration :0,
                price: req.body.plan=="basic"?5:req.body.plan=="large"?10:req.body.plan=="ultra"?15:5,
                cost: 0
            });
            
            let promise = plan.save();
            
            promise.then(function(vm){
                return res.status(200).send(plan);
            });
            
            promise.catch(function(error){
                return res.status(400).json({message:'Error while creating VM'});
            });
        }
    });
});

app.post('/delete',tokenVerification, function(req,res,next){
    planModel.find({'username':token_decoded.email,'vm_name':req.body.vm_name},(error,vm)=>{
        if(vm){
            planModel.deleteMany({'username':token_decoded.email,'vm_name':req.body.vm_name},(error1)=>{
                if(error1){
                    return res.status(400).json({message:'Error while deleting the VM'});
                }else{
                    return res.status(200).json({message:'VM deleted successfully'});
                }
            })
        }else{
          return res.status(400).json({message:'Error while deleting the VM'}) 
        }
    })
});

var token_decoded = '';
function tokenVerification(req,res,next){
    let token = req.headers.authorization;
    jwt.verify(token,'secretkey',function(error,tokenData){
        if(error){
            return res.status(400).json({message:'Request Unauthorizied'});
        }
        if(tokenData){
          console.log(tokenData);
            token_decoded = tokenData;
            next();
        }
    });
}
 
}