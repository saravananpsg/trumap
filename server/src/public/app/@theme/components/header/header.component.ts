import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { AuthLocalStorage } from '../../../providers/auth/auth.local.storage.service';
import { urlBase64Decode } from '@nebular/auth/helpers';
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any = {};

  userMenu = [{ title: 'Log out', link: '/auth/logout' }];
  headertabs: any[] = [
    {
      title: 'Dashboard',
      route: '/pages/dashboards',
    },
    {
      title: 'Guide',
      route: '/pages/help',
    },
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private authService: NbAuthService,
              private authLocalStorage: AuthLocalStorage) {
  }

  ngOnInit() {

      /*this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {

          if (token.isValid()) {
            this.user = token.getPayload();
            this.authLocalStorage.set(token.toString());
          }
      });*/
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  selectTab(tab: any) {
    this.router.navigate([tab.route]);
  }
}
