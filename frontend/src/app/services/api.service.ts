import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(object) {
    return this.http.post("http://40.121.66.13:8080/auth/token", object)
  }

  register(object) {
    return this.http.post("http://40.121.66.13:8080/api/user/register/", object)
  }

  sendToken(object) {
    return this.http.post("/", object)
  }

  getUserInfo() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.get("http://40.121.66.13:8080/api/user/get_user_info/", { headers: headers })
  }
}
