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
export class AppService {

  baseUrl = "http://localhost:3400";

  constructor(private http : HttpClient) { 
  }

  postRequest(route,itemjson){
    return this.http.post(this.baseUrl+route,itemjson,httpOptions);
  }

  getRequest(route){
    if(localStorage.getItem('jwt')){
      return this.http.get(this.baseUrl+route,httpOptions);
    }else{
      return this.http.get(this.baseUrl+route);
    }
    
  }
}
