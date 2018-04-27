import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {

  constructor(public alertCtrl: AlertController) {}

  // Creates a alert window with two buttons
  createAlertYesNo(title, message, bt1_name, bt2_name, bt1_callback, bt2_callback){
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: bt1_name,
          handler: bt1_callback
        },
        {
          text: bt2_name,
          handler: bt2_callback
        }
      ]
    });

    confirm.present();
  }

  // Creates a text input window with custom button with a callback and a 'Cancelar' button
  createAlertInputs(title, message, btdone_name, btdone_callback, inputs){
    let confirm = this.alertCtrl.create({
      title: title,
      inputs: inputs,
      message: message,
      buttons: [
        {
          text: btdone_name,
          handler: btdone_callback
        },
        {
          text: 'Cancelar'
        }
      ]
    });

    confirm.present();
  }

  // A simple OK alert window
  createAlertOK(title, message, bt_callback) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: bt_callback
        }
      ]
    });

    confirm.present();
  }
}
