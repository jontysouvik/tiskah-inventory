import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
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
  slectedFiles: FileList;
  file: File;
  imgsrc: Observable<string | null>;
  uploadPercent;
  images: string[] = [];
  imageNames: string[] = [];
  constructor(private afs: AngularFirestore, private afst: AngularFireStorage) { }

  ngOnInit() {
  }
  onAdd() {
    const date = new Date();
    const time = date.getTime().toString();
    this.afs.collection('items').doc(time).set({
      'id': this.slectedItem.id,
      'name': this.slectedItem.name,
      'price': this.slectedItem.price,
      'stock': this.slectedItem.stock,
      'timestamp': time.toString(),
      'images': this.imageNames
    }).then(() => {
      alert('Added Success Fully');
      this.slectedItem = new Item();
      this.images = [];
    }).catch((error) => {
      alert(error);
    });
  }
  chooseFiles(event) {
    this.slectedFiles = event.target.files;
    this.images.push('../../../../assets/loading.gif');
    if (this.slectedFiles.item(0)) {
      this.uploadPic();
    }
  }
  uploadPic() {
    const file = this.slectedFiles.item(0);
    const date = new Date();
    const time = date.getTime().toString();
    const fileName = 'IMG' + time + '.jpg';
    const fileRef = this.afst.ref(fileName);
    this.afst.upload(fileName, file).then((data) => {
      fileRef.getDownloadURL().toPromise().then((url) => {
        this.imageNames.push(fileName);
        this.images.splice(this.images.length - 1, 1);
        this.images.push(url);
      });
    });
  }
}
