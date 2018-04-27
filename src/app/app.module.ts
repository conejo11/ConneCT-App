import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import * as firebase from 'firebase/app';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GamificationPage } from '../pages/gamification/gamification';
import { QuestionsPage } from '../pages/questions/questions';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { UserPage } from '../pages/user/user';
import { AuthService } from '../providers/auth.service';
import { UserService } from '../providers/user.service';
import { AlertService } from "../providers/alert.service";
import { EditTelephoneComponent } from '../components/edit-telephone/edit-telephone';

export const firebaseConfig = {
  apiKey: "AIzaSyAL-OyrHkTqw4j4sgcapSnFKi0wFc61dNo",
  authDomain: "connect-48f5c.firebaseapp.com",
  databaseURL: "https://connect-48f5c.firebaseio.com",
  projectId: "connect-48f5c",
  storageBucket: "connect-48f5c.appspot.com",
  messagingSenderId: "882656858836"
}

@NgModule({
  declarations: [
    GamificationPage,
    HomePage,
    MyApp,
    QuestionsPage,
    UserPage,
    TabsNavigationPage,
    EditTelephoneComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    GamificationPage,
    HomePage,
    MyApp,
    QuestionsPage,
    UserPage,
    TabsNavigationPage,
    EditTelephoneComponent
  ],
  providers: [AuthService,{provide: ErrorHandler, useClass: IonicErrorHandler},UserService,AlertService]
})
export class AppModule {}
