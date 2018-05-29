import { Question } from '../questions/question.model';
import { Gamification } from '../gamification/gamification.model';
import { Answer } from '../questions/answer.model';

export class Ct {
  constructor(
    public adress: string,
    public email: string,
    public id: string,
    public password: string,
    public telephone: string,
    public username: string,
    ) {
  }
}
