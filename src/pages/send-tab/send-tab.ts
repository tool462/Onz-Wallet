import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, Select } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import * as Big from 'big.js';

import { AccountDataProvider } from '../../providers/account-data/account-data';

@IonicPage()
@Component({
  selector: 'page-send-tab',
  templateUrl: 'send-tab.html',
})
export class SendTabPage {
  @ViewChild(Select) select: Select;

  private sendForm : FormGroup;
  recipient: string = '';
  amount: number = 0;
  status: number;
  disableSend: boolean = false;
  resultTxt: string = '';
  secondPass: string;
  accountHasSecondPass: boolean = false;
  contacts: object[];
  wasAccountLogin: boolean;
  password: string;
  fingerAvailable: boolean = false;
  guest: boolean = false;
  passwordType: string = 'password';

  constructor(public navCtrl: NavController, public accountData: AccountDataProvider, public navParams: NavParams, public viewCtrl: ViewController, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, private faio: FingerprintAIO) {
  	this.sendForm = this.formBuilder.group({
      recipientForm: ['', Validators.required],
      amountForm: ['', Validators.required],
      secondForm: [''],
      passwordForm: ['']
    });
    if (navParams.get('address')) {
      this.recipient = navParams.get('address');
    }
    this.accountData.getAccount().then((account) => {
	  	if (account['account'] && account['account']['secondPublicKey'] != null){
	  		this.accountHasSecondPass = true;
	  	}
	  });

    this.wasAccountLogin = this.accountData.wasAccountLogin();
  }

  ionViewDidLoad() {
  	this.guest = this.accountData.isGuestLogin();
  	 this.faio.isAvailable().then((available) => {
	    if (available == 'OK' || available == 'Available') {
	      this.fingerAvailable = true;
	    } else {
	      this.fingerAvailable = false;
	    }
	  });
    this.loadContacts();
  }

  onSend() {
    if (this.accountData.convertPasswordToAccount(this.password) == this.accountData.getAccountID()) {
    	this.disableSend = true;
      let amountBig = new Big(this.amount);
      let convertedAmount = new Big(amountBig.times(100000000));
      this.resultTxt = `Attempting to send ${this.recipient} ${amountBig}ONZ`;
      let password;
      if (this.wasAccountLogin){
      	password = this.password;
      }
      this.accountData.sendOnz(this.recipient, convertedAmount, this.secondPass, password).then((result) => { console.log(result);
    		if (result['success'] == false) {
    			this.resultTxt = result['message'];
    			this.disableSend = false;
    			this.status = -1;
    		} else {
    			this.status = 1;
    			this.resultTxt = "Sending Onz";
    		}
  	  });
      this.status = 0;
    } else {
      this.resultTxt = "Incorrect Passphrase";
      this.status = -1;
    }
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.recipient = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  togglePassword() {
  	if (this.passwordType == 'password') {
  		this.passwordType = 'text';
  	} else {
  		this.passwordType = 'password';
  	}
  }

  showFingerprint() {
    this.faio.show({
      clientId: 'Onz-Tool',
      clientSecret: this.accountData.getFingerSecret(), //Only necessary for Android
      disableBackup: false  //Only for Android(optional)
    })
    .then((result: any) => { 
    	this.password = this.accountData.getSavedPassword();
    })
    .catch((error: any) => console.log(error));
  }

  openBarcodeScannerPassword(password: string) {
  	this.barcodeScanner.scan().then((barcodeData) => {
      if (password == "password"){
      	this.password = barcodeData['text'];
      } else {
      	this.secondPass = barcodeData['text'];
      }
    }, (err) => {
        // An error occurred
    });
  }

  openContacts() {
    this.select.open();
  }

  loadContacts() {
    this.accountData.getContacts().then((currentContacts) => {
      if (currentContacts != null) {
        this.contacts = currentContacts;
      } else {
        this.contacts = [{ name:'No Saved Contacts',account:'' }];
      }
    });
  }

}
