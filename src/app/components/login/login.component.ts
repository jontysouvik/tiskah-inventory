import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email;
  public password;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  signIn() {
    this.auth.singInWithEmailAndPassword(this.email, this.password);
  }
}
