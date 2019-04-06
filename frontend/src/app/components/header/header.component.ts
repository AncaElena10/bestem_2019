import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userID = ""

  constructor() { }

  ngOnInit() {
    this.userID = localStorage.getItem('userID')
  }

  logout() {
    localStorage.clear()
    window.location.reload()
  }
}
