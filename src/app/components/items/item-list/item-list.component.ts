import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Item } from '../../../models/Item';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  itemsCol: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  filterType: string;
  onlyShowInStockItems = true;
  itemButtonlist: any[] = [
    { title: 'All', filter: 'all' },
    { title: 'Earrings', filter: 'earrings' },
    { title: 'Neck piece', filter: 'neckpiece' },
    { title: 'Bracelet', filter: 'bracelet' },
    { title: 'Other', filter: 'other' }];
  slectedFiles: FileList;
  file: File;
  imgsrc: Observable<string | null>;
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

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
    if (this.onlyShowInStockItems && !item.isEdit) {
      if (item.stock <= 0) {
        return false;
      }
    }
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
    item.isEdit = true;
  }
  onEdit(item: Item, fromCode?: boolean) {
    if (!fromCode) {
      item.isEdit = false;
    }
    this.afs.collection('items').doc(item.timestamp).set({
      'id': item.id,
      'name': item.name,
      'price': item.price,
      'stock': item.stock,
      'timestamp': item.timestamp.toString(),
      'images': item.images ? item.images : []
    });
  }
  onDelete(item: Item) {
    for (let index = 0; index < item.images.length; index++) {
      const name = item.images[index];
      const fileRef = this.storage.ref(name);
      fileRef.delete();
    }
    this.afs.collection('items').doc(item.timestamp).delete().then(() => {
      alert('Deleted Successfully');
    }).catch((error) => {
      alert(error);
    });
  }
  onCancel(item: Item) {
    item.isEdit = false;
  }
  getDownloadUrl(img, name) {
    img.src = '../../../../assets/loading.gif';
    const ref = this.storage.ref(name);
    ref.getDownloadURL().toPromise().then((url) => {
      img.src = url;
    });
  }
  deleteImage(img, name, item) {
    if (img.src.toString().indexOf('delete') > -1) {
      this.getDownloadUrl(img, name);
    } else {
      item.images.splice(item.images.length - 1, 1);
      const fileRef = this.storage.ref(name);
      fileRef.delete().toPromise().then(() => {
        this.onEdit(item, true);
      });
    }

  }
  chooseFiles(event, item) {
    this.slectedFiles = event.target.files;
    if (this.slectedFiles.item(0)) {
      this.uploadPic(item);
    }
  }
  uploadPic(item) {
    const file = this.slectedFiles.item(0);
    const date = new Date();
    const time = date.getTime().toString();
    const fileName = 'IMG' + time + '.jpg';
    const fileRef = this.storage.ref(fileName);
    this.storage.upload(fileName, file).then((data) => {
      fileRef.getDownloadURL().toPromise().then((url) => {
        if (!item.images) {
          item.images = [];
        }
        item.images.push(fileName);
        this.onEdit(item, true);
      });
    });
  }
}
