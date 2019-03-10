import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  
  model: any = {};
  signup:boolean;
  signupMsg;

  constructor(private authservice : AuthService,
              private router : Router) { }

  ngOnInit() {
  }
  
  confirmPassword(){
    if(this.model.password ==this.model.cnfpassword){
      return false;
    }else{
      return true;
    }
  }
  
  onSubmit() {
    let userInfo = {
      'email':this.model.email,
      'password':this.model.password,
      'username':this.model.username
    }
    this.authservice.userRegistration("/user/signup",userInfo);
    this.signup = true;
    this.signupMsg = this.authservice.info;
    this.router.navigate(['/auth/login']);
  }

}
