import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthSession } from './providers/auth/auth.session.service';
@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private afs: AngularFirestore, private authSession: AuthSession) {
  }

  ngOnInit() {
    this.authSession.query().subscribe(() => {});
  }
}
