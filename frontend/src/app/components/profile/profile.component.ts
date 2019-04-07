import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = ""
  create_user
  gameList = []
  first_name = ""

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.username = localStorage.getItem("username")
    this.first_name = localStorage.getItem("first_name")
    this.sendGame()
  }


  sendGame() {
    this.create_user = {
      'username': this.username
    }
    this.apiService.getGamification(this.create_user).subscribe((res) => {
      this.extractGame(res)
    })
  }

  extractGame(res) {
    console.log(res)
    this.gameList = res
  }

}
