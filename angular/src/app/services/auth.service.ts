import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': localStorage.getItem('jwt')
  }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  baseUrl = "https://cc-lab2-pvaddi.c9users.io:8081";
  successInd: boolean;
  info;

  constructor(private http : HttpClient) { }
  
  userRegistration(route, userInfo){
    this.http.post(this.baseUrl+route,userInfo).subscribe((data:any) =>{
      if(data){
        this.successInd = true;
        this.info = data.message;
      }else{
        this.successInd = false;
        this.info  = "Error occured while registration";
      }
    });
  }
  
  login(route,credentials, loginPref){
      return this.http.post(this.baseUrl+route,credentials).subscribe((data:any) =>{
        this.info = data.message;
        if(data){
          this.successInd = true;
          localStorage.setItem('jwt',data);
        }else{
          this.successInd = false;
        }
      });
  }
}
