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
  email = ""
  phone = ""
  role = ""

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
      'client_id': '9Ekjd1tdFfUeVcwtv5ls4cSC0Urkm8njyMLXZ8LP',
      'grant_type': 'password',
      'password': this.password,
      'username': this.username,
      'client_secret': 'xR6Ev9u5vo2XFoNNZZ35HkLDEha3U0UhMhaEBNGsyehAGgSMcbbqCIuKSVu21XmrNTrUqeZZjGxHsz0OxvDFjbfHeBm0Iwi26BPuMGzE0VQYetRrfoitcq2ATE2HR9Oc'
    }

    // console.log(this.loginObject)

    this.apiService.login(this.loginObject).subscribe((res) => {
      this.extractUserInfo(res)

      this.apiService.getUserInfo().subscribe((res2) => {
        this.extractCurrentUserInfo(res2)
        window.location.reload()
      })
    })
  }

  extractCurrentUserInfo(res) {
    localStorage.setItem('userID_nr', res.id)
    localStorage.setItem('first_name', res.first_name)
    localStorage.setItem('last_name', res.last_name)
    localStorage.setItem('username', res.username)
    localStorage.setItem('role', res.role)
  }

  extractUserInfo(res) {
    localStorage.setItem('userID', 'loggedIn')
    localStorage.setItem('access_token_alex', res.access_token)
  }

  registerAsUser() {
    this.registerUserObject = {
      'firstName': this.firstname,
      'lastName': this.lastname,
      'username': this.username,
      'password': this.password,
      'type': 'admin',
      'email': this.email,
      'phone': this.phone,
      'role': this.role
    }


    console.log(this.registerUserObject)

    this.apiService.register(this.registerUserObject).subscribe((res) => {
      console.log(res)
      localStorage.setItem("role", this.role)
      window.location.reload()
    })
  }

  chooseVolunteer() {
    this.role = "Volunteer"
  }

  chooseCollector() {
    this.role = "Collector"
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
