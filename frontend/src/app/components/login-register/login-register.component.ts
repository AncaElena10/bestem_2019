import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';

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

  constructor(private apiService: ApiService) { }

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
