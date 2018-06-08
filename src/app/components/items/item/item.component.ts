import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Item } from '../../../models/Item';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itemsCol: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  slectedItem: Item = new Item();
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
  }
  onAdd() {
    const date = new Date();
    let time = date.getTime().toString();
    if (this.slectedItem.timestamp) {
      time = this.slectedItem.timestamp;
    }
    this.afs.collection('items').doc(time).set({
      'id': this.slectedItem.id,
      'name': this.slectedItem.name,
      'price': this.slectedItem.price,
      'stock': this.slectedItem.stock,
      'timestamp': time.toString()
    });
  }
  itemSelected(item: Item) {
    console.log(item, 'Item Component');
    this.slectedItem = item;
  }
}
