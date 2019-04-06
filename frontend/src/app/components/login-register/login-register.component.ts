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

  username = ""
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
        localStorage.setItem("accessToken", this.accessToken)
        // if (response.status === 'connected') {
        //   this._zone.run(() => {
        //     this._router.navigate(['./user-profile']);
        //   });
        // }
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
      'client_id': '7WkaQO17zCixjI6USBHboxeU0mQARhFq5a3JF9h2',
      'grant_type': 'password',
      'password': this.password,
      'username': this.username,
      'client_secret': 'qg0dgqUDftplLFMh682hK20jDPXXBlmYiSvqTsO5cdlY4y1XUZGX86EHgMNMwuUthg4Ng8mw0t77Hbb3r1u3XjHHDpfXxajYzamwfjyZNMojiCoIMQLwQDa2o4BwKnR6'
    }

    // console.log(this.loginObject)

    this.apiService.login(this.loginObject).subscribe((res) => {
      // console.log(res)
      this.extractUserInfo()
      window.location.reload()
    })
  }

  extractUserInfo() {
    localStorage.setItem('userID', 'loggedIn')
  }

  registerAsUser() {
    this.registerUserObject = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'username': this.username,
      'password': this.password,
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
      'username': this.username,
      'password': this.password,
      'type': 'admin'
    }

    this.apiService.register(this.registerUserObject).subscribe((res) => {
      console.log(res)
      // window.location.reload()
    })
  }

  emptyFields() {
    this.username = ""
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
