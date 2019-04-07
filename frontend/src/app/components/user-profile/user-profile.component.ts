/// <reference types="@types/googlemaps" />
declare var require: any;

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

  currentIcon: any

  markerInEvent: boolean = false

  bounds_: any

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
    this.fileUploadService.getTrashPoints().subscribe((res) => {
      // console.log(res)
      this.extractTrashMarkers(res)
    })

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        this.zoom = 14;
        this.currentIcon = {
          url: require("./icons/current.png"),
          scaledSize: {
            width: 60,
            height: 70,
          }
        }
      });
    }

    this.form = this.formBuilder.group({
      profile: ['']
    });
  }

  markersLoaded: boolean = false

  extractTrashMarkers(res) {
    for (let i = 0; i < res.length; i++) {
      res[i].x_coord = Number(res[i].x_coord)
      res[i].y_coord = Number(res[i].y_coord)
    }

    this.markersList = res
    this.markersLoaded = true

    console.log(this.markersList)

    this.editMarkers()
  }

  editMarkers() {
    for (let i = 0; i < this.markersList.length; i++) {
      if (this.markersList[i].pollution_level == 'Low') {
        this.markersList[i].icon = {
          url: require("./icons/yellow.png"),
          scaledSize: {
            width: 25,
            height: 40,
          }
        }
      } else if (this.markersList[i].pollution_level == 'Medium') {
        this.markersList[i].icon = {
          url: require("./icons/orange.png"),
          scaledSize: {
            width: 25,
            height: 40,
          }
        }
      } else if (this.markersList[i].pollution_level == 'High') {
        this.markersList[i].icon = {
          url: require("./icons/red.png"),
          scaledSize: {
            width: 25,
            height: 40,
          }
        }
      }

      if (this.markersList[i].event != null) {
        this.markersList[i].icon = {
          url: require("./icons/gray.png"),
          scaledSize: {
            width: 25,
            height: 40,
          }
        }
      }

      if (this.markersList[i].event != null) {
        this.markersList[i].taken = true
      } else {
        this.markersList[i].taken = false
      }
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

  saveTrashPoint() {
    this.fileUploadService.upload(this.formData).subscribe((res) => {
      // console.log(res)
      window.location.reload()
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
    this.formData.append('picture', this.form.get('profile').value)
    this.formData.append('lat', this.objectToSend.lat)
    this.formData.append('lng', this.objectToSend.lng)
    this.formData.append('level', this.objectToSend.level)

    console.log("submited")
  }

  //////////// EVENT /////////////
  newEvent: boolean = false
  name = ""
  ids = []
  extra = ""
  date = ""
  total_person = ""
  address = ""

  objectEvent = {}

  addNewEvent() {
    this.newEvent = true
  }

  doneEvent() {
    this.newEvent = false
    window.location.reload()
  }

  addMarkerToEvent(id_to_be_added) {
    this.ids.push(id_to_be_added)
  }

  saveEvent() {
    this.objectEvent = {
      'name': this.name,
      'ids': this.ids,
      'extra': this.extra,
      'date': new Date(this.date),
      'total_person': this.total_person,
      'address': this.address
    }

    this.fileUploadService.sendEvent(this.objectEvent).subscribe((res) => {
      console.log(res)
    })
  }

  obj

  checkMarkersInBounds(bounds) {
    this.bounds_ = bounds
    this.obj = {
      'latA': bounds.ma.j,
      'latC': bounds.ma.l,
      'longB': bounds.ga.j,
      'longD': bounds.ga.l,
    }
  }

  share() {
    const options: UIParams = {
      method: 'share',
      href: 'https://www.facebook.com/UnusualAnimalsGY/photos/basw.AbqEBIk0SetpzMUMYOMPxOMNLYH2_KOfSFO8MuWApKmIcFd-D6UtLVAH5fGPL5QoQ_tZopi0l1jPzuzQPlnyn1XlF1sqjnZ8w5aOno2m-4yeSkZNcBjO7WZflFAmsjeLdg4ymToejsCJw4OqRHicSVc1.650285995430912.2297307886967395.373391796586885.2831229810283840.589890468176362.842151259470490/650285995430912/?type=1&opaqueCursor=Abob75r1SmPmbvCDL6dO8BsRsQhfKoTdcQoIdB_1RfBLJoFw1oqXZzc2WdKNWod7zTzNMewedxPKxBEt8NLJl1uIxBe5blNXCDcrZ-q9-eG5b7F54srjfXEAuOkNCKYix8LhT_7IZ4odwPGljvZnfPgUlDEo2HF74I51rX0TMR7VfHdmDbWfuKomHTf51Z_UcGexGSUANS-zv14OboHUwJXAsd2PtpEVKuevrbCkEHmEEGOKWxY72XhcFK1j_MwQA5XHGCuGe5Q4cMf7H8Gd2cFiRTqA5uwRY97s05dDvM29Uywij-niEjxhcSVDUhH1QcODly4VsvRr5NktkyS9uudhHatvnn0V9jndcRyhHBTwrxe3IisBDWveg9EQqdhD2w0ppJco6OOEW4ugZjtGaQ_deagC_3Rk5tnNoF-zwKy-l9hlC_4XLHd9TjlJ12VYED842nM8932QlNlVgweH59jmDN0yu6YbBqAABqPDWKxt2cKJLJowWiAAsKg_-l0q0c-5hvdM-qu-fSrzegOTmd3dpOaYHf5U9TuByVYq60NePo5gzr5kSgUg049hd4FDVdETkgsz3gvyp2QGPVA07dRYHL-pgP_ljcy2eqbTkSEyZ8p115Yt20kRT_8tzbf1DZ3QpxUZ-L0qVu4zRQhPhOLm9qJM_VvbqYf448mDfJMppR2Rr1BZ5ry6x-7rDZoT3b0H7AQ_c8T2ABkTVvovBODjwRNziEcbd2kkhLw2A4ldjFL7Fqemp_Nv14vcfBMQKfABlG4Z9DokWVtVSmq_-Qwc&theater'
    };

    this.fb.ui(options)
      .then((res: UIResponse) => {
        console.log('Got the users profile', res);
      })
      .catch((error: any) => console.error(error));
  }
}
