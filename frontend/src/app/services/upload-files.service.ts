import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '../../../node_modules/@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  constructor(private http: HttpClient) { }

  //   postFile(fileToUpload: File): Observable<boolean> {
  //     const endpoint = 'your-destination-ur';
  //     const formData: FormData = new FormData();
  //     formData.append('fileKey', fileToUpload, fileToUpload.name);
  //     return this.http
  //       .post("/", formData)
  //       .map(() => { return true; })
  //       .catch((e) => this.handleError(e));
  // }

  public upload(formData) {
    console.log(formData)
    // return this.http.post<any>('/', formData);
  }
}
