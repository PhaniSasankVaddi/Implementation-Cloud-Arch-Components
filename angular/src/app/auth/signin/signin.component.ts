import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  
  login:boolean;
  loginMsg;
  model: any = {};

  constructor(private authservice : AuthService,
              private router : Router) { }

  ngOnInit() {
  }
  
  onSubmit() {
    let userjson = {
      'email':this.model.email,
      'password':this.model.password
    }
    this.authservice.login("/user/signin",userjson,this.model.radio);
    this.login = true;
    this.loginMsg = this.authservice.info;
    this.router.navigate(['/plans']);
  }

}
