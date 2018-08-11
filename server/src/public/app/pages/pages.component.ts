import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MENU_ITEMS } from './pages-menu';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <!-- <nb-menu [items]="menu"></nb-menu> -->
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = MENU_ITEMS;
  constructor(private authService: NbAuthService, private router: Router) {
  }

  ngOnInit() {
    // this.authService.isAuthenticated().subscribe((isLoggedIn) => {
    //   if (!isLoggedIn) this.router.navigate(['/auth']);
    // });
  }
}
