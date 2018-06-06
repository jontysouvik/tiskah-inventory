import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userObservable: Observable<firebase.User>;
  public logInStatus: boolean;
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.userObservable = this._firebaseAuth.authState;
    this.userObservable.subscribe(
      (user) => {
        if (user) {
          // this.userDetails = user;
          // console.log('authState Changed');
          this.logInStatus = true;
          this.router.navigate(['items']);
        } else {
          this.logInStatus = false;
          this.router.navigate(['/']);
        }
        console.log('event emmiter fired');
        // this.userChangeEvent.emit(this.userDetails);
      }
    );
   }

  singInWithEmailAndPassword(email, password) {
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }
  signOut() {
    this._firebaseAuth.auth.signOut();
    console.log('signOut');
  }
}
