/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UploadFilesService } from 'app/services/upload-files.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { concat } from 'rxjs';
import { UtilsService } from 'app/services/utils.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  // latitude:  Number = 44.426765
  // longitude: Number = 26.102537

  lat: Number
  lng: Number
  zoom: Number

  poluation_level = ['Select level', 'Low', 'Medium', 'High']
  selectedLevel = this.poluation_level[0];

  objectToSend = { 'lat': '', 'lng': '', 'level': '' }
  fileToUpload: File = null;

  markersList = []

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;

  openedWindow: number = 0

  @ViewChild('triggerButtonTrash') triggerButtonTrash: ElementRef;
  map_: any

  //////
  @ViewChild('fileInput') fileInput: ElementRef;
  form: FormGroup;
  loading: boolean = false;

  constructor(private fileUploadService: UploadFilesService, private formBuilder: FormBuilder, private fb: FacebookService) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      avatar: null
    });
  }

  ngOnInit() {
    // this.fileUploadService.getTrashPoints().subscribe((res) => {
    //   this.extractTrashMarkers(res)
    // })

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        this.zoom = 13;
      });
    }

    this.form = this.formBuilder.group({
      profile: ['']
    });
  }

  extractTrashMarkers(res) {
    // this.markersList
    console.log(res)
  }

  // on map click
  locateTrash(event) {
    this.objectToSend.lat = event.coords.lat
    this.objectToSend.lng = event.coords.lng

    // click modal button
    let el: HTMLElement = this.triggerButtonTrash.nativeElement as HTMLElement
    el.click()
  }

  mapReady(event) {
    this.map_ = event
  }

  placeMarker() {
    var self = this
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(Number(this.objectToSend.lat), Number(this.objectToSend.lng)),
      map: self.map_
    });
    this.markersList.push(marker)
  }

  selectLevel() {
    this.objectToSend.level = this.selectedLevel
  }

  fileOverBase(event): void {
    this.hasBaseDropZoneOver = event;
  }

  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  saveTrashPoint() {
    console.log("aici?")

    this.fileUploadService.upload(this.formData).subscribe((res) => {
      console.log(res)
    })

    this.placeMarker()
  }

  openWindow(id) {
    this.openedWindow = id
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id
  }


  // ////////////////////////
  response;
  imageURL;



  onChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('profile').setValue(file);
    }
  }

  formData = new FormData()

  onSubmit() {
    console.log(this.objectToSend)

    this.formData.append('picture', this.form.get('profile').value)
    this.formData.append('lat', this.objectToSend.lat)
    this.formData.append('lng', this.objectToSend.lng)
    this.formData.append('level', this.objectToSend.level)

    console.log("submited")

    // this.objectToSend.picture = formData
  }
}
