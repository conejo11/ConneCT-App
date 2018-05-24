import { Component, OnInit  } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Gamification } from './gamification.model';
import { UserService } from '../../providers/user.service';
import { User } from '../user/user.model';
import {AlertService} from "../../providers/alert.service";

@Component({
  selector: 'page-gamification',
  templateUrl: 'gamification.html'
})
export class GamificationPage implements OnInit {

  ranking: Gamification;
  ribbonsCareers: Gamification[] = [];
  ribbonsTopScore: Gamification[] = [];
  positionRanking: number;
  daysCurrent: number = 0;
  heightTrophys: number = 40;
  userNickname: string;
  userLevel: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private userService: UserService,
              public alertService: AlertService) {
  }

  ngOnInit() {
    this.getGamificatios();
  }

  onLoad(img) {
    this.heightTrophys += img.height;
  }

  // Send the nickname to the DB, and then refreshes the local app.
  requestChangeNickname(nick){
    this.userService.updateNickname(nick).then(() => this.getGamificatios());
  }

  requestUpdateLevel(level){
    this.userService.updateLevel(level).then(() => this.getGamificatios());
  }

  getGamificatios(): Promise<any> {
    return new Promise(resolve =>{
      this.userService.getUser().then((DQ:User) => {
        this.ranking = DQ.gamification[0];
        for (let i = 0; i <= 5; i++)
          this.ribbonsCareers[i] = DQ.gamification[i+1];

        for (let i = 0; i <= 1; i++)
          this.ribbonsTopScore[i] = DQ.gamification[i+7];

        this.daysCurrent = DQ.gamification[9]['quantity'];
        this.userNickname = DQ.nickname;
        this.userLevel = DQ.nivel;
        this.onContentLoaded();
        this.onLoadedContent()
      });
      this.userService.getPositionRanking().then((position: number) => this.positionRanking = position);
      resolve();
    });
  }

  checkNicknameIsValid(nick): boolean {
    return !(nick == "" || nick.replace(/\s/g,'') == "");
  }

  getLevel(ptos) {
    let lvl = 'Pelada na Rua';
    if(ptos >= 0 && ptos < 150){
      lvl = 'Pelada na Rua';
    }
    if(ptos > 150 && ptos < 200){
      lvl = 'Campeonato da Cidade';
    }
    if(ptos > 200 && ptos < 350){
      lvl = 'Campeonato Estadual';
    }
    if(ptos > 350 && ptos < 450){
      lvl = 'Campeonato Brasileiro';
    }
    if(ptos > 450 && ptos < 550){
      lvl = 'Libertadores';
    }
    if(ptos > 550 && ptos < 650){
      lvl = 'Liga Europa';
    }
    if(ptos > 650 && ptos < 750){
      lvl = 'Liga dos Campeões';
    }
    if(ptos > 750 && ptos < 850){
      lvl = 'Copa das Confederações';
    }
    if(ptos > 850 && ptos < 950){
      lvl = 'Olimpíadas';
    }
    if(ptos > 950 && ptos < 1100){
      lvl = 'Copa do Mundo';
    }
    return lvl;
  }

  onLoadedContent() {
    this.userService.getUser().then((user) => {
      if(user.nivel === undefined) {
        let niveu = '1'
        this.requestUpdateLevel(niveu);
      }
      let oldLevel = user.nivel;
      let rk = user.gamification[0];
      let gols = rk.quantity;
      let newLevel = this.getLevel(gols);

      if (oldLevel != newLevel){
        this.requestUpdateLevel(newLevel);
        this.alertService.createAlertOK('Passou de nível!', "Parabéns " + user.nickname + "! Você agora está jogando o campeonato: <br> <br>" + newLevel + ". <br> <br> Continue marcando gols para ser promovido!", () => {})
      }
    })
  }

  // Each time the getGamifications is finished, this function is called
  onContentLoaded() {
    this.userService.getUser().then((user) => {
      if (user.nickname === undefined) {
        let criar_nick = (data) => {
          this.alertService.createAlertInputs('Criar Apelido', 'Por favor, digite o seu apelido no campo abaixo:', 'Criar!', (data) => {
            // AQUI VAMOS CRIAR NO BD
            let nick = data[0];

            this.requestChangeNickname(nick);
            this.alertService.createAlertOK('Apelido criado', "Parabéns! Seu apelido " + nick + " foi criado!", () => {})

          }, ['apelido'])
        };

        let nao_criar_nick = (data) =>{

          this.alertService.createAlertOK('Criar Apelido', "Seu apelido será \"Jogador\". Você poderá mudar depois quando quiser.", () => {})
        };
        this.alertService.createAlertYesNo("Criar Apelido", "O nosso sistema agora possui a função de apelidos!\nDeseja criar um agora?", "Sim", "Não", criar_nick, nao_criar_nick)
      }
    })
  }

  // Every time the 'Mudar Apelido' is pressed
  onNicknamePressed(skipAsk = false) {
    let alterar_nick = () => {
      this.alertService.createAlertInputs('Alterar apelido', 'Por favor, digite o seu novo apelido no campo abaixo:', 'Alterar!', (data) => {

        let nick = data[0];

        if (!this.checkNicknameIsValid(nick)){
            this.alertService.createAlertOK("Alterar apelido", "O apelido não pode ser vazio!", () => {
              this.onNicknamePressed(true);
            });

        return;
      }

        // Push the changes to the DataBase
        let old_nick = this.userNickname;
        this.requestChangeNickname(nick);
        this.alertService.createAlertOK('Apelido criado', "Parabéns! Seu apelido \"" + old_nick + "\" foi alterado para \"" + nick + "\"!", () => {})

      }, ['apelido'])
    };

    let nao_alterar_nick = () => {};

    if (!skipAsk) {
      this.alertService.createAlertYesNo("Alterar apelido", "Deseja alterar seu apelido?", "Sim", "Não", alterar_nick, nao_alterar_nick)
    } else {
      alterar_nick();
    }
  }

  doRefresh(refresher) {
    this.getGamificatios().then(() => refresher.complete());
  }

  alertDescription(title:string, description?: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: description,
      buttons: [
        'Fechar'
      ]
    });
    alert.present();
  }

  getStyleImgTrophy() {
    return {
      '-webkit-clip-path': `inset(0px ${100-(this.daysCurrent/365*100)}% 0px 0px)`,
      'clip-path': `inset(0px ${100-(this.daysCurrent/365*100)}% 0px 0px)`,
      'float': 'right'}
  }

  getStyleImgRanking() {
    return {
      '-webkit-clip-path': `inset(${100-this.positionRanking}% 0px 0px 0px)`,
      'clip-path': `inset(${100-this.positionRanking}% 0px 0px 0px)`,
      'float': 'right'}
  }
}
