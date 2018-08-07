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
      'timestamp': time.toString()
    }).then(() => {
      alert('Added Success Fully');
      this.slectedItem = new Item();
    }).catch((error) => {
      alert(error);
    });
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
    const fileRef = this.afst.ref(fileName);
    const uploadTask = this.afst.upload(fileName, file).then((data) => {
      console.log(data);
      this.imgsrc = fileRef.getDownloadURL();
    });
  }
}
