import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userID = ""

  fbLogin: boolean = false
  normalLogin: boolean = false

  first_name = ""
  last_name = ""
  full_name = ""

  constructor() { }

  ngOnInit() {
    this.userID = localStorage.getItem('userID')
    if (this.userID != null) {
      if (this.userID === 'loggedIn') {
        this.fbLogin = false
        this.normalLogin = true
      } else {
        this.fbLogin = true
        this.normalLogin = false
      }
    } else {
      this.fbLogin = false
      this.normalLogin = false
    }

    this.first_name = localStorage.getItem("first_name")
    this.last_name = localStorage.getItem("last_name")
    this.full_name = this.first_name + " " + this.last_name
  }

  logout() {
    localStorage.clear()
    window.location.reload()
  }
}
