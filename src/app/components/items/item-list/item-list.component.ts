import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  filterType: number;
  @Output() itemSelected = new EventEmitter();
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.itemsCol = this.afs.collection('items');
    this.items = this.itemsCol.valueChanges();
    this.filterType = 1;
  }
  filter(item: Item) {
    // let retVal: boolean;
    // switch (this.filterType) {
    //   case 1:
    //     {
    //       if (parseInt(item.stock.toString(), 10) > 0) {
    //         retVal = true;
    //       } else {
    //         retVal = false;
    //       }
    //     }
    //     break;
    // }
    return true;
  }
  setEdit(item: Item) {
    console.log(item);
    // this.items.forEach((list) => console.log(list));
    item.isEdit = true;
  }
  onEdit(item: Item) {
    item.isEdit = false;
    this.afs.collection('items').doc(item.timestamp).set({
      'id': item.id,
      'name': item.name,
      'price': item.price,
      'stock': item.stock,
      'timestamp': item.timestamp.toString()
    });
  }
}
