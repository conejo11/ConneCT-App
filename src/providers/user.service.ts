import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Ct } from '../pages/user/ct.model';
import { User } from '../pages/user/user.model';
import { Answer } from '../pages/questions/answer.model';
import { AuthService } from './auth.service'

@Injectable()
export class UserService {

  listOfCTs$: AngularFireList<any[]>;

  constructor(
    public db: AngularFireDatabase,
    public authService: AuthService,
  ) {}

  // updateNickname: Every time the nickname needs to be updated
  updateNickname(nick:string) {
    return new Promise(resolve =>
      this.getUser().then((_user) => {
        this.db.object(`/${_user.uidCT}/users/${_user.id}`)
          .update({nickname: nick});
        resolve();
      })
    )
  }

  updateLevel(level:string) {
    return  new Promise(resolve =>
      this.getUser().then((_user) => {
        this.db.object(`/${_user.uidCT}/users/${_user.id}`)
          .update({nivel: level});
        resolve();
      })
    )
  }

  updateIcon(icone:string){
    return new Promise(resolve =>
      this.getUser().then((_user) => {
        this.db.object(`/${_user.uidCT}/users/${_user.id}`)
          .update({usericon: icone});
        resolve();
      })
    )
  }

  updateTelephone(newTelephone:string) {
    return new Promise(resolve =>
      this.getUser().then((_user) => {
          this.db.object(`/${_user.uidCT}/users/${_user.id}`)
            .update({telephone: newTelephone});
        resolve();
      })
    )
  }

  updateOtherTelephone(newTelephone:string) {
    return new Promise(resolve =>
      this.getUser().then((_user) => {
          this.db.object(`/${_user.uidCT}/users/${_user.id}`)
            .update({telephoneOther: newTelephone});
        resolve();
      })
    )
  }

  setRanking(quantity: number) {
    this.getUser().then((_user) => {
      quantity += _user.gamification[0]['quantity'];
      this.db.object(`/${_user.uidCT}/users/${_user.id}/gamification/0/quantity`).set(quantity);
      this.db.object(`/rankingGlobal/${_user.id}`).update({quantity: quantity, username: _user.name});
    })
  }

  setQuestionAnswered(_questionsAnwered: Answer[]): Promise<any> {
    return new Promise(resolve =>
      this.getUser().then((_user) => {
        for (let i in _questionsAnwered)
          this.db.object(`/${_user.uidCT}/users/${_user.id}/questions/${_questionsAnwered[i].questionID}`)
            .update({isActive: false});
        resolve();
      })
    )
  }

  getQuantityPointsRanking(): Promise<number> {
    return new Promise(resolve =>
      this.getUser().then(_user => {
        this.db.object(`/rankingGlobal/${_user.id}`).valueChanges().subscribe(quantityObject => resolve(quantityObject['quantity']));
      }));
  }

  getPositionRanking(): Promise<number> {
    let position: number = 1;
    return new Promise(resolve =>
      this.authService.getUID().then(_uidDQ => {
        this.db.list(`/rankingGlobal`).valueChanges().subscribe(_listDQs => {
          this.getQuantityPointsRanking().then(quantity => {
            _listDQs.forEach(_DQ => {
              if(_uidDQ === _DQ['$key']) {}
              else {
                if(_DQ['quantity'] <= quantity)
                  position++;
              }
            })
            if (position === 1)
              position = 0;
            resolve(Math.trunc((position/_listDQs.length)*100));
          })
        });
      })
    )
  }

  getUser(): Promise<User> {
    return new Promise(resolve => {
        this.authService.getUID().then(_uidDQ => {
        return _uidDQ;
      }).then((_uidDQ: any) => {
        this.listOfCTs$ = this.db.list(`/`);
        this.listOfCTs$.valueChanges().subscribe(_CTs => {
          _CTs.forEach(_DQs => {
            if(_DQs['users'] != undefined)
              if (_DQs['users'][_uidDQ] != undefined)
                resolve(_DQs['users'][_uidDQ]);
          })
        })
      })
    });
  }

  getCT(): Promise<Ct> {
    return new Promise(resolve => {
      this.authService.getUID().then(_uidDQ => {
        return _uidDQ;
      }).then((_uidDQ: any) => {
        this.listOfCTs$ = this.db.list(`/`);
        this.listOfCTs$.valueChanges().subscribe(_CTs => {
          _CTs.forEach(_DQs => {
            if(_DQs['users'] != undefined)
              if (_DQs['users'][_uidDQ] != undefined)
                resolve(_DQs['data']);
          })
        })
      })
    });
  }

  getFirstAnswer(): Promise<string> {
    return new Promise(resolve => {
      this.getUser().then((_user) => {
        this.db.list(`/${_user.uidCT}/users/${_user.id}/answers/0`)
          .valueChanges()
      })
    });
  }

  pushAnswers(answers: Answer[]) {
    this.getUser().then((_user) => {
      answers.forEach((answer:Answer) => {
        // answer.date = answer.date.getTime()
        // answer.date = str(answer.date)
        this.db.list(`/${_user.uidCT}/users/${_user.id}/answers/${answer.questionID}/`).push(answer);
      })
    })
  }
}
