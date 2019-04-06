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
  }

  logout() {
    localStorage.clear()
    window.location.reload()
  }
}
