import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Item } from '../../../models/Item';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  itemsCol: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  slectedItem: Item = new Item();
  // id: string;
  // name: string;
  // price: number;
  // stock: number;
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.itemsCol = this.afs.collection('items');
    this.items = this.itemsCol.valueChanges();
  }

}
