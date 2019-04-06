import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from 'app/services/upload-files.service';

@Component({
  selector: 'app-my-chrts',
  templateUrl: './my-chrts.component.html',
  styleUrls: ['./my-chrts.component.css']
})
export class MyChrtsComponent implements OnInit {

  constructor(private fileUploadService: UploadFilesService) { }

  ngOnInit() {
  }

  list = []

  getChestii() {
    this.fileUploadService.getAllChestii().subscribe((res) => {
      this.extractAll(res)
    })
  }

  extractAll(res) {
    this.list = res

    console.log(res)
  }

}
