import { Injectable } from '@angular/core';
import{HttpClient}  from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(
    private http:HttpClient
  ) { }


methodtocallService():any{
  return this.http.get(`https://jsonplaceholder.typicode.com/todos/100`) 
}

}
