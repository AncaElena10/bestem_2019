/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UploadFilesService } from 'app/services/upload-files.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { concat } from 'rxjs';

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

  objectToSend = { 'lat': '', 'lng': '', 'level': '', 'picture': {} }
  fileToUpload: File = null;

  markersList = []

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;

  openedWindow: number = 0

  @ViewChild('triggerButtonTrash') triggerButtonTrash: ElementRef;
  map_: any

  constructor(private fileUploadService: UploadFilesService) { }

  ngOnInit() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        this.zoom = 13;
      });
    }
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

  saveUser() {
    let files = this.getFiles();
    this.objectToSend.picture = files[0]

    console.log(this.objectToSend)

    this.placeMarker()
  }

  openWindow(id) {
    this.openedWindow = id
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id
  }
}
