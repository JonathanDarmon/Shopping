import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'SlotMachine';
  @Input() username: string;
  @Input() cash: number;
  @Input() userLogged: boolean;
  @Input() result: string;
  constructor() {}

  array1 = ['p', 4, 3];

  array2 = [
    {0: 1, 1: 1, 2: 1},
    {0: 3, 1: 2, 2: 1},
    {0: 'p', 1: 2, 2: 4},
    {0: 'r', 1: 2, 2: 2},
    {0: 'h', 1: 2, 2: 1}
  ];

  log(x) {
    const user = {
      username: x.value,
      cash: 100,
      userLogged: true
    };

    this.cash = user.cash;
    this.username = user.username;
    this.userLogged = user.userLogged;
    localStorage.setItem('username', user.username);
    localStorage.setItem('currentCash', user.cash.toString());
    localStorage.setItem('userLogged', user.userLogged.toString());
    console.log(user);

  }

  spinning () {

    if (this.cash === 0) {
      alert('Not enough cash!');

    } else {
      this.cash = this.cash - 10;
      localStorage.setItem('currentCash', this.cash.toString());

      for (let index = 0; index < this.array2.length; index++) {
        const element = this.array2[index];

        const sortArray1 = this.array1.sort().join();
        const result = this.array2.some(obj => Object.values(obj).sort().join() === sortArray1);
        console.log(result);
        if (result === true) {
          this.cash = this.cash + 20;
          localStorage.setItem('currentCash', this.cash.toString());
          return this.result = 'Congratulations you\'ve won!';

        } else {
          this.result = 'You have lost';
        }
      }
    }
  }


  ngOnInit() {
    const userLogged = localStorage.getItem('userLogged');
    console.log(userLogged);

    if (userLogged === 'true') {
      this.username = localStorage.getItem('username');
      this.cash = Number(localStorage.getItem('currentCash'));
      this.userLogged = true;

    } else {
      console.log('Isn\'t logged ');
      this.userLogged = false;
    }
  }
}
