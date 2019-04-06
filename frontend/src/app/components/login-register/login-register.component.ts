import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from 'app/services/api.service';
// import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent, InitParams } from 'ngx-facebook';
import { Router } from '@angular/router';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';

var FB: any

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  email = ""
  password = ""
  password_confirmation = ""
  firstname = ""
  lastname = ""

  loginObject = {}
  registerUserObject = {}
  registerAdminObject = {}

  userID = ""
  accessToken = ""

  constructor(private apiService: ApiService, private fb: FacebookService, public _router: Router, public _zone: NgZone, private socialAuthService: AuthService) {
    console.log('Initializing Facebook');
    let initParams: InitParams = {
      appId: '139336530185484',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }

  loginWithFacebook(): void {
    this.fb.login()
      .then((response: LoginResponse) => {
        console.log(response)
        this.userID = response.authResponse.userID
        this.accessToken = response.authResponse.accessToken
        localStorage.setItem("userID", this.userID)
        if (response.status === 'connected') {
          this._router.navigateByUrl('/user-profile');
        }
      })
      .catch((error: any) => console.error(error));

    // this._router.navigateByUrl('/user-profile');
  }

  sendToken() {
    var obj = {
      'accessToken': this.accessToken
    }

    this.apiService.sendToken(obj).subscribe((res) => {
      console.log(res)
    })
  }

  ngOnInit() {

  }

  login() {
    this.loginObject = {
      'email': this.email,
      'password': this.password
    }

    // console.log(this.loginObject)

    this.apiService.login(this.loginObject).subscribe((res) => {
      console.log(res)
      this.extractUserInfo(res)
      // window.location.reload()
    })
  }

  extractUserInfo(res) {
    localStorage.setItem('id', res.id)
    localStorage.setItem('email', res.email)
  }

  registerAsUser() {
    this.registerUserObject = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password,
      'type': 'user',
    }

    // console.log(this.registerUserObject)

    this.apiService.register(this.registerUserObject).subscribe((res) => {
      console.log(res)
      // window.location.reload()
    })
  }

  registerAsAdmin() {
    this.registerAdminObject = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password,
      'type': 'admin'
    }

    // console.log(this.registerAdminObject)


    this.apiService.register(this.registerUserObject).subscribe((res) => {
      console.log(res)
      // window.location.reload()
    })
  }

  emptyFields() {
    this.email = ""
    this.password = ""
    this.password_confirmation = ""
    this.firstname = ""
    this.lastname = ""

    this.passwordError = false
  }

  passwordError: boolean = false

  onPasswordEnter(event) {
    if (event.target.value != this.password_confirmation) {
      this.passwordError = true
    } else {
      this.passwordError = false
    }
  }

  onPasswordConfirmEnter(event) {
    if (event.target.value != this.password) {
      this.passwordError = true
    } else {
      this.passwordError = false
    }
  }
}
