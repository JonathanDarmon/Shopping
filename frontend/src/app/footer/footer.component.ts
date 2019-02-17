import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  date = new Date();
  todayYear = this.date.getFullYear();
  todayMonth = this.date.getMonth() + 1;
  todayDate = this.date.getDate();

  creatorName = 'Yonatan Darmon';
  constructor() { }

  ngOnInit() {
  }

}
