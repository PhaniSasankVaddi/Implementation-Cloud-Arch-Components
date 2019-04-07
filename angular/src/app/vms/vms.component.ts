import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-vms',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.scss']
})
export class VmsComponent implements OnInit {
  
  vmachines:any = [];
  grandtotal = 0;
  
    vm_name: String;
    plan: String;
    price = 0;
    usagePeriod = 0;
    total_duration = 0;
    
  constructor(private router : Router,private appservice: AppService) { }

  ngOnInit() {
    if(!localStorage.getItem('jwt')){
      this.router.navigate(['/auth/login']);
    }else{
      this.appservice.getRequest('/findvms').subscribe((data:any)=>{
        if(data){
          this.vmachines = [];
          data.forEach(element => {
            this.vmachines.push(element);
          });
        }
      });
    }
    
  }

  startVM(virtual_machine){
    let vmjson = {
      'vm_name':virtual_machine,
    }
    this.appservice.postRequest('/start',vmjson).subscribe((data:any)=>{

      if(data){
          this.ngOnInit();
      }
    })
  }

  stopVM(virtual_machine){
    let vmjson = {
      'vm_name':virtual_machine,
    }
    this.appservice.postRequest('/stop',vmjson).subscribe((data:any)=>{
      if(data){
          this.ngOnInit();
      }
    })
  }
  createVM(){
    let vmjson = {
      'vm_name':this.vm_name,
      'plan':this.plan
    }
    this.appservice.postRequest('/create',vmjson).subscribe((data:any)=>{
      if(data){
        this.ngOnInit();
      }
    })
    
  }
  deleteVM(vmachine){
    let vmjson = {
      'vm_name':vmachine
    }
    this.appservice.postRequest('/delete',vmjson).subscribe((data:any)=>{
      if(data){
        this.ngOnInit();
      }
    })
  }

  upgradeVM(vmachine,plan){

    switch(plan){
      case "basic":
      this.changePlan(vmachine,plan,"large");
      break;

      case "large":
      this.changePlan(vmachine,plan,"ultra");
      break;

      case "ultra":
      default:

    }
  }
    
  downgradeVM(vmachine,plan){

    switch(plan){
      case "ultra":
      this.changePlan(vmachine,plan,"large");
      break;

      case "large":
      this.changePlan(vmachine,plan,"basic");
      break;

      case "basic":
      default:
    }
  }

  changePlan(vmachine,oldPlan,newPlan){
    let vmjson = {
      'vm_name':vmachine,
      'oldplan':oldPlan,
      'newplan':newPlan
    }
    this.appservice.postRequest('/changeplan',vmjson).subscribe((data:any)=>{
      if(data){
        this.ngOnInit();
      }
    })
  }
  
  calFare(vmachine){
    let vmjson = {
      'vm_name':vmachine
    }
    this.appservice.postRequest('/getfare',vmjson).subscribe((data:any)=>{
      if(data){
        data.forEach(element => {
          this.price = this.price+element.cost;
          this.usagePeriod = this.usagePeriod+element.duration;
        });
      }
    });
  
  }

}