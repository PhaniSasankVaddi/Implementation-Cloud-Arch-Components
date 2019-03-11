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

  constructor(private router : Router,private appservice: AppService) { }

  ngOnInit() {
    if(!localStorage.getItem('jwt')){
      this.router.navigate(['/auth/login']);
    }else{
      this.appservice.getRequest('/findvms').subscribe((data:any)=>{
        if(data){
          this.vmachines.push(data);
        }
      })
    }
    
  }

  createVM(){
    let vmjson = {
      'vm_name':this.vm_name,
      'plan':this.plan
    }
    console.log(this.vm_name);
    console.log(this.plan);
    // this.appservice.postRequest('/create',vmjson).subscribe((data:any)=>{
    //   if(data){
    //     this.vmachines.push(data);
    //   }
    // })
    this.appservice.postVM(vmjson)
    .subscribe((data: any) => {
      if(data != 0 || null) {
        this.vmachines.push(data);
      }
    });
  }

}
