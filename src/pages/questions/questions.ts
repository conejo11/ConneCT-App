import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';

import { Answer } from './answer.model';
import { User } from '../user/user.model';
import { Question } from './question.model';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})
export class QuestionsPage implements OnInit {

  questions: Question[] = [];
  answers: Answer[] = [];
  user: User;
  activedIcon: number[] = [];
  isFlagActive: Array<boolean> = new Array<boolean>(20).fill(true);
  numberQuestionsDesactived: number = 0;
  loading: Loading;
  loadingFlag: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private userService: UserService
  ) { }

  doRefresh(refresher?) {
    this.updateQuestions().then(() => refresher.complete());
  }

  getQuantityAnswered() {
    this.questions.forEach((_question:Question) => {
      if(!_question.isActive)
        this.numberQuestionsDesactived++;
    })
  }

  ngOnInit() {
    this.updateQuestions();
  }

  updatePage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  updateQuestions(): Promise<any> {
    this.loading = this.showLoading();
    return new Promise((resolve) => {
      this.numberQuestionsDesactived = 0;
      this.userService.getUser().then(_user => {
        this.questions = _user.questions;
        this.getQuantityAnswered();
        this.loadingFlag = true;
        this.loading.dismiss();
        resolve();
      });
    });
  }

  sendAnwers(questionID: number, answersNumber: number) {
    let date = new Date();
    this.activedIcon[questionID] = answersNumber;
    this.isFlagActive[questionID] = false;
    this.answers[questionID] = {questionID, answersNumber, date};
  }

  sendNotification() {
    let dateMoment = new Date();
    LocalNotifications.schedule({
      id: 1,
      title: 'Marque Gols!',
      text: 'Seu time precisa de você! Responda as perguntas e marque gols!',
      every:  'day',
      at: dateMoment.getMinutes() - 1,
    });
    }

  confirmAnswers() {
    let quantityAnwersRanking: number = 0;
    for (let i in this.questions)
      if(this.answers[i] != undefined)
        quantityAnwersRanking++;
    if(this.answers.length > 0) {
      return new Promise((resolve) => {
        this.userService.pushAnswers(this.answers);
        this.questionAnwered(this.answers);
        this.userService.setRanking(quantityAnwersRanking*5);
        this.alertDescription(
          "Respostas enviadas",
          `Você ganhou ${quantityAnwersRanking*5} pontos`,
          "no ranking");
        this.updatePage();
        this.sendNotification();
        this.answers = [];
        this.activedIcon = [];
        this.isFlagActive.fill(true);
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Nenhuma resposta escolhida',
        buttons: [
          'Fechar'
        ]
      });
      alert.present();
    }
  }

  questionAnwered(_questionsAnwered: Answer[]) {
    this.userService.setQuestionAnswered(_questionsAnwered);
  }

  alertDescription(title:string, description?: string, answers?: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: `${description}<br>${answers}`,
      buttons: [
        'Fechar'
      ]
    });
    alert.present();
  }

  private showLoading(): Loading {
  let loading: Loading = this.loadingCtrl.create({
      content: "Por favor aguarde... Baixando as questões."
    });
    loading.present();
    return loading;
  }

}
