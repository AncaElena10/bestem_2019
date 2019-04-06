import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(object) {
    return this.http.post("/login", object)
  }

  register(object) {
    return this.http.post("/register", object)
  }

  sendToken(object) {
    return this.http.post("/", object)
  }
}
