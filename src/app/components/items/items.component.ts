import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Item } from '../../models/Item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  selectedItem: Item = new Item();
  public isShowAdd = false;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (!this.auth.logInStatus) {
      this.router.navigate(['/']);
    }
  }
  logOut() {
    this.auth.signOut();
  }
}
