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
  
  model:any = {};

  constructor(private router : Router,private appservice: AppService) { }

  ngOnInit() {
    if(!localStorage.getItem('jwt')){
      this.router.navigate(['/auth/login']);
    }else{
      
    }
    
  }

  createVM(){
    let vmjson = {
      'vm_name':this.model.vm_name,
      'plan':this.model.plan,
    }
    this.appservice.postRequest('/create',vmjson).subscribe((data:any)=>{
      
    })
  }

}
