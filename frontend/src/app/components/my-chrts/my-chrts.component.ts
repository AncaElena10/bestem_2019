import { Component, OnInit } from '@angular/core';
import { UploadFilesService } from 'app/services/upload-files.service';

@Component({
  selector: 'app-my-chrts',
  templateUrl: './my-chrts.component.html',
  styleUrls: ['./my-chrts.component.css']
})
export class MyChrtsComponent implements OnInit {

  piechart
  barchart
  column1
  column2

  constructor(private fileUploadService: UploadFilesService) {
  }

  ngOnInit() {
    this.getChestii()
  }

  list = []
  levels = []
  people = []

  getChestii() {
    this.fileUploadService.getAllChestii().subscribe((res) => {
      this.extractAll(res)
    })
    this.fileUploadService.getAllLevels().subscribe((res) => {
      this.extractLevels(res)
    })
  }

  extractAll(res) {
    this.list = res

    this.piechart = {
      title: 'Status of cleaning process',
      type: 'PieChart',
      columnNames: ['Places', 'Percentage'],
      data: [
        ['Clean', (res.clean * 100) / res.total],
        ['Dirty', (res.dirty * 100) / res.total],
      ],
      roles: []
    }
  }

  extractLevels(res) {
    this.levels = res

    this.barchart = {
      title: 'Status of pollution',
      type: 'BarChart',
      columnNames: ['Level', 'Number of places'],
      data: [
        ['Low', res.low],
        ['Medium', res.medium],
        ['High', res.high],
      ],
      roles: []
    }
  }
}
