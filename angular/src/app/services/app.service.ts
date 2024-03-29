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

  baseUrl = "https://cc-lab2-pvaddi.c9users.io:8080";

  constructor(private http : HttpClient) { 
  }

  postRequest(route,itemjson){
    return this.http.post(this.baseUrl+route,itemjson,httpOptions);
  }

  getRequest(route){
      return this.http.get(this.baseUrl+route,httpOptions);  
  }
}

