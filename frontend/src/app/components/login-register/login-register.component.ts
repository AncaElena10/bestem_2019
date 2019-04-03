import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  login() {
    this.loginObject = {
      'email': this.email,
      'password': this.password
    }

    // console.log(this.loginObject)
  }

  registerAsUser() {
    this.registerUserObject = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password
    }

    // console.log(this.registerUserObject)
  }

  registerAsAdmin() {
    this.registerAdminObject = {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password
    }

    // console.log(this.registerAdminObject)
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
