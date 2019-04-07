import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '../../../node_modules/@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  constructor(private http: HttpClient) { }

  getTrashPoints() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.get('http://40.121.66.13:8080/api/trashpoints/get_trashpoints/', { headers: headers })
  }

  upload(formData) {
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.post<any>('http://40.121.66.13:8080/api/trashpoints/create_trashpoint/', formData, { headers: headers });
  }

  sendEvent(object) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.post<any>('http://40.121.66.13:8080/api/events/create_event/', object, { headers: headers })
  }

  getAllEvents() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.get('http://40.121.66.13:8080/api/events/list_events/', { headers: headers })
  }

  getAllChestii() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.get('http://40.121.66.13:8080/api/events/list_events/', { headers: headers })
  }

  joinEvent(object) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.post("http://40.121.66.13:8080/api/events/join_event/", object, { headers: headers })
  }

  closeEvent(object) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.post("http://40.121.66.13:8080/api/events/close_event/", object, { headers: headers })
  }
}
