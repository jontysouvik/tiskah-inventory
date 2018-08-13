import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemComponent } from './components/items/item/item.component';
import { ItemListComponent } from './components/items/item-list/item-list.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

const config = {
  apiKey: 'AIzaSyDsM5D-igywBeKby4nCi8nnOJ2Sh4BULTs',
  authDomain: 'tiskahinventory.firebaseapp.com',
  databaseURL: 'https://tiskahinventory.firebaseio.com',
  projectId: 'tiskahinventory',
  storageBucket: 'tiskahinventory.appspot.com',
  messagingSenderId: '21765455320'
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemsComponent,
    ItemComponent,
    ItemListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
