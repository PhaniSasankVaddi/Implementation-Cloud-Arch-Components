var express = require('express');
var router = express.Router();
var planModel = require('../models/plan_model');
var jwt = require('jsonwebtoken');

router.get('/findvms',tokenVerification,function(req,res,next){
    planModel.findAll({'username':token_decoded.email,'active_ind':true},(error,vms)=>{
        if(error){
            return res.status(400).json({message:'Error while fetching the Virtual Machines'});
        }else if(!vms){
            return res.status(201).json({message:'No VMs are created'});
        }else{
            return res.status(200).send(vms);
        }
    })
})

router.post('/start',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.vm_name,'active_ind':true},(error,user)=>{
        if(user){
            if(user.start_ind == true){
                return res.status(200).json({message:'Server is already started'});
            }else{
                planModel.updateOne({'username':token_decoded.email,'vm_name':req.vm_name,'active_ind':true},
                {$set:{'start_ind':true,'t_start':new Date()}},
                {upsert:true},(error1) =>{
                    if(error1){
                        return res.status(401).json({message:'Error while starting the server'});
                    }else{
                        return res.status(200).json({message:'Server started successfully'});
                    }
                })
            }
            
        }else{
            return res.status(400).json({message:'Error occured while starting the server'});
        }
    })
});

router.post('/stop',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.vm_name,'active_ind':true},(error,plan)=>{
        if(plan){
            if(plan.start_ind == false){
                return res.status(200).json({message:'Server is already stopped'});
            }else{
                planModel.updateOne({'username':token_decoded.email,'vm_name':req.vm_name,'active_ind':true},
                {$set:{'start_ind':false, 't_end':new Date()}},
                {upsert:true},(error1) =>{
                    if(error1){
                        return res.status(401).json({message:'Error while stopping the server'});
                    }else{
                        return res.send(plan);
                    }
                })
            }
        }else{
            return res.status(400).json({message:'Error occured while stopping the server'});
        }
    })
});

router.post('/upgrade',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.vm_name, 'active_ind': true},(error,vm)=>{
        if(vm){
            planModel.updateOne({'username':token_decoded.email,'vm_name':req.vm_name, 'active_ind':true},
            {$set:{'active_ind':false}},
            {upsert:true},(error1)=>{
                if(error1){
                    return res.status(401).json({message:'Error while upgrading the VM'});
                }else{
                    var plan = new planModel({
                        username: token_decoded.email,
                        vm_name: req.vm_name,
                        plan: req.upgrade_plan,
                        active_ind:true,
                        start_ind:true,
                        t_start: Date.now()
                    });
                    
                    let promise = plan.save();
                    promise.then(function(doc){
                        return res.status(200).json({message:'VM plan upgraded successfully'});
                    })
                    
                    promise.catch(function(error){
                        return res.status(400).json({message:'Error after upgrading the VM'})
                    })
                    
                }
            })
        }else{
            return res.status(400).json({message:'Error while upgrading the VM'});
        }
    })
})

router.post('/create',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.vm_name},(error,vm)=>{
        if(vm){
            return res.status(400).json({message:'Virtual Machine exists with this name. Please choose a different name'})
        }else{
            var plan = new planModel({
                username :token_decoded.email,
                vm_name :req.vm_name,
                plan :req.plan,
                active_ind :true,
                start_ind :false,
            });
            
            let promise = plan.save();
            
            promise.then(function(vm){
                return res.status(200).json({message:'Virtual Machine created successfully. Please start it.'});
            })
            
            promise.catch(function(error){
                return res.status(400).json({message:'Error while creating VM'});
            })
        }
    })
});

router.post('/delete',tokenVerification, function(req,res,next){
    planModel.findOne({'username':token_decoded.email,'vm_name':req.vm_name,'active_ind':true},(error,vm)=>{
        if(vm){
            planModel.updateOne({'username':token_decoded.email,'vm_name':req.vm_name,'active_ind':true},
            {$set:{'start_ind':false,'active_ind':false}},
            {upsert:true},(error1)=>{
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
    })
}


module.exports = router;