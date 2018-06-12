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
  filterType: string;
  itemButtonlist: any[] = [
    { title: 'All', filter: 'all' },
    { title: 'Earrings', filter: 'earrings' },
    { title: 'Neck piece', filter: 'neckpiece' },
    { title: 'Bracelet', filter: 'bracelet' },
    { title: 'Other', filter: 'other' }];
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.itemsCol = this.afs.collection('items');
    this.items = this.itemsCol.valueChanges();
    this.filterType = 'all';
  }
  setFilter(filter) {
    this.filterType = filter;
  }
  filterItemType(item: Item) {
    let retVal: boolean;
    switch (this.filterType) {
      case 'earrings':
        {
          if (item.id.substring(0, 1).toLowerCase() === 'e') {
            retVal = true;
          } else {
            retVal = false;
          }
        }
        break;
      case 'neckpiece':
        {
          if (item.id.substring(0, 1).toLowerCase() === 'n') {
            retVal = true;
          } else {
            retVal = false;
          }
        }
        break;
      case 'bracelet':
        {
          if (item.id.substring(0, 1).toLowerCase() === 'b') {
            retVal = true;
          } else {
            retVal = false;
          }
        }
        break;
      case 'other':
        {
          if (item.id.substring(0, 1).toLowerCase() !== 'e' &&
            item.id.substring(0, 1).toLowerCase() !== 'n' &&
            item.id.substring(0, 1).toLowerCase() !== 'b') {
            retVal = true;
          } else {
            retVal = false;
          }
        }
        break;
      case 'all':
        {
          retVal = true;
        }
        break;
    }
    return retVal;
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
  onDelete(item: Item) {
    this.afs.collection('items').doc(item.timestamp).delete().then(() => {
      alert('Deleted Successfully');
    }).catch((error) => {
      alert(error);
    });
  }
}
