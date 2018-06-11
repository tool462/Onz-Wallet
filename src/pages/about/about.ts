import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { SendModalPage } from '../send-modal/send-modal';

import { AccountDataProvider } from '../../providers/account-data/account-data';

declare var require: any;
const appVersion = require('../../../package.json').version;

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  version: string = appVersion;
  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  openModal(modal:string, tx:string = null) {
    if (modal == 'send') {
      let myModal = this.modalCtrl.create(SendModalPage, { address: 'ONZfmqwdNr6yxy4cZDkWc71oWyuUDnRJcEsd' });
      myModal.present();
    }
  }

}
