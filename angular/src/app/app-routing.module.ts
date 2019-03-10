import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlansComponent } from './plans/plans.component';
import { VmsComponent } from './vms/vms.component';

const routes: Routes = [
{
  path:'', component: DashboardComponent
},
{
  path:'plans', component: PlansComponent  
},
{
  path:'vms', component: VmsComponent
},
{
  path:'auth', loadChildren: './auth/auth.module#AuthModule'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
