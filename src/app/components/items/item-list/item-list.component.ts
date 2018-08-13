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
  selectedItem: Item = null;
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
    this.selectedItem = item;
  }
  onEdit(fromCode?: boolean) {
    if (!fromCode) {
      this.selectedItem.isEdit = false;
    }
    this.afs.collection('items').doc(this.selectedItem.timestamp).set({
      'id': this.selectedItem.id,
      'name': this.selectedItem.name,
      'price': this.selectedItem.price,
      'stock': this.selectedItem.stock,
      'timestamp': this.selectedItem.timestamp.toString(),
      'images': this.selectedItem.images
    });
  }
  onDelete() {
    for (let index = 0; index < this.selectedItem.images.length; index++) {
      const name = this.selectedItem.images[index];
      const fileRef = this.storage.ref(name);
      fileRef.delete();
    }
    this.afs.collection('items').doc(this.selectedItem.timestamp).delete().then(() => {
      alert('Deleted Successfully');
    }).catch((error) => {
      alert(error);
    });
  }
  onCancel() {
    this.selectedItem.isEdit = false;
    this.selectedItem = null;
  }
  getDownloadUrl(img, name) {
    img.src = '../../../../assets/loading.gif';
    const ref = this.storage.ref(name);
    ref.getDownloadURL().toPromise().then((url) => {
      img.src = url;
    });
  }
  deleteImage(img, name) {
    if (img.src.toString().indexOf('delete') > -1) {
      this.getDownloadUrl(img, name);
    } else {
      this.selectedItem.images.splice(this.selectedItem.images.length - 1, 1);
      const fileRef = this.storage.ref(name);
      fileRef.delete().toPromise().then(() => {
        this.onEdit(true);
      });
    }

  }
  chooseFiles(event) {
    this.slectedFiles = event.target.files;
    if (this.slectedFiles.item(0)) {
      this.uploadPic();
    }
  }
  uploadPic() {
    const file = this.slectedFiles.item(0);
    const date = new Date();
    const time = date.getTime().toString();
    const fileName = 'IMG' + time + '.jpg';
    const fileRef = this.storage.ref(fileName);
    this.storage.upload(fileName, file).then((data) => {
      fileRef.getDownloadURL().toPromise().then((url) => {
        if (!this.selectedItem.images) {
          this.selectedItem.images = [];
        }
        this.selectedItem.images.push(fileName);
        this.onEdit(true);
      });
    });
  }
}
