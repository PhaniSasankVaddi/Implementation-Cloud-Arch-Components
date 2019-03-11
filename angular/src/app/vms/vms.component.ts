import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-vms',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.scss']
})
export class VmsComponent implements OnInit {
  
  vmachines:any = [];
  grandtotal = 0;
  
 vmName1_create;planPref_basic;planPref_large;planPref_ultra;

  constructor(private appservice: AppService) { }

  ngOnInit() {
    //Need to fetch the VMs on load
    
  }

}
