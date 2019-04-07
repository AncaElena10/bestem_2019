import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userID = ""
  accessToken = ""
  userType = null
  showModal: boolean = false

  @ViewChild('triggerButton') triggerButton: ElementRef;

  constructor(public _router: Router) { }

  ngOnInit() {
    this.userID = localStorage.getItem("userID")
    this.accessToken = localStorage.getItem("accessToken")
    // this.userType = localStorage.getItem("userType")

    // if (this.userID != null && this.userType == null) {
    //   let el: HTMLElement = this.triggerButton.nativeElement as HTMLElement;
    //   el.click();
    // }
  }

  // chooseVolunteer() {
  //   this.userType = "volunteer"
  //   // localStorage.setItem("userType", this.userType)

  //   this._router.navigateByUrl('/user-profile');
  // }

  // chooseCollector() {
  //   this.userType = "collector"
  //   // localStorage.setItem("userType", this.userType)

  //   this._router.navigateByUrl('/user-profile');
  // }
}
