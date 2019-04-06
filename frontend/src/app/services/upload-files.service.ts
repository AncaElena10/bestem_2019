import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '../../../node_modules/@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  constructor(private http: HttpClient) { }

  getTrashPoints() {
    return this.http.get('/')
  }

  DJANGO_SERVER: string = "http://40.121.66.13:8080";

  public upload(formData) {
    console.log(formData)

    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('access_token_alex')
    })
    return this.http.post<any>('http://40.121.66.13:8080/api/trashpoints/create_trashpoint/', formData, { headers: headers });
  }
}
