import { Question } from '../questions/question.model';
import { Gamification } from '../gamification/gamification.model';
import { Answer } from '../questions/answer.model';

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public nickname: string,
    public nivel: string,
    public usericon: string,
    public password: string,
    public telephone: number,
    public telephoneOther: number,
    public gender: string,
    public birthday: string,
    public uidCT: string,
    public questions?: Question[],
    public answers?: Answer[],
    public gamification?: Gamification
    ) {
  }
}
