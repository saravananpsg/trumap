import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NbAuthModule } from '@nebular/auth';
import {
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
} from '@nebular/theme';

import { NbSecurityModule } from '@nebular/security';
import { UiScrollModule } from 'ngx-ui-scroll';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgPipesModule } from 'ngx-pipes';
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { SocketIoModule } from 'ngx-socket-io';

import {
  LoginComponent,
  RequestPasswordComponent,
  ResetPasswordComponent,
  DatepickerRangeComponent,
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  ThemeSwitcherComponent,
  DownloadModalComponent,
  ToolbarComponent,
  LegendComponent,
  ListingComponent,
  ListingFilterComponent,
  ListingTileComponent,
  ChatComponent,
  ChatMessageComponent,
} from './components';
import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe, ListingPipe } from './pipes';
import {
  SampleLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, UiScrollModule,
  VirtualScrollModule, LazyLoadImageModule, PerfectScrollbarModule, NgPipesModule,
  NgxAutoScrollModule];

const NB_MODULES = [
  NbAuthModule,
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NgbModule,
  NbSecurityModule, // *nbIsGranted directive
];

const COMPONENTS = [
  LoginComponent,
  RequestPasswordComponent,
  ResetPasswordComponent,
  ThemeSwitcherComponent,
  DatepickerRangeComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  SampleLayoutComponent,
  DownloadModalComponent,
  ToolbarComponent,
  LegendComponent,
  ListingComponent,
  ListingFilterComponent,
  ListingTileComponent,
  ChatComponent,
  ChatMessageComponent,
];

const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  ListingPipe
];

const entryComponents = [DownloadModalComponent];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    },
    [ DEFAULT_THEME, COSMIC_THEME ],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES, RouterModule],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [ ...COMPONENTS, ...PIPES],
  entryComponents: entryComponents,
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}
