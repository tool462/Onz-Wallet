import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the EditContactModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

const ADDRESS_CHECK: RegExp = /^ONZ[0-9a-zA-Z]{30,40}/;

@IonicPage()
@Component({
  selector: 'page-edit-contact-modal',
  templateUrl: 'edit-contact-modal.html',
})
export class EditContactModalPage {
  account: string;
  startingAccount: string;
  type: string;
  name: string;
  title: string;
  buttonText: string;
  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner) {
    this.name = navParams.get('name');
    this.account = navParams.get('account');
    this.startingAccount = navParams.get('account');
    this.type = navParams.get('type');
    if (this.type == 'new') {
      this.title = 'Add Contact';
      this.buttonText = 'Add';
    } else {
      this.title = 'Edit Contact';
      this.buttonText = 'Edit';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditContactModalPage');
  }

  editContact(){
    if (this.account == null || this.account == '') {
      this.message = "Account is required."
    } else if (!ADDRESS_CHECK.test(this.account)) {
      this.message = "Invalid Account."
    } else {
      if (this.title == 'Edit Contact') {
        this.accountData.editContact(this.name,this.account).then(() => {
          this.viewCtrl.dismiss();
        });
      } else {
        this.accountData.addContact(this.name,this.account).then(() => {
          this.viewCtrl.dismiss();
        });
      }
    }
  }

  openBarcodeScannerConModal() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.account = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
