import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

export interface TrainerPrice {
  // id: string;
  trainerId: string;
  price: number;
}

export interface Trainer {
  trainerId: string;
  trainerName: string;
}

export interface TrainingSession {
  id: string;
  name: string;
  trainerId: string;
  date: Date;
  trainingTime: number;
  numberOfVisits: number;
  altPrice: number;
}

@Injectable()
export class DataService {

  data: any;
  constructor(private http: HttpClient) {

  }

  getData(datesTraining: string[], startDate: Date, endDate: Date){
    let requestsForPEriod = []
    for (let date of datesTraining) {
      requestsForPEriod.push(this.http.post(environment.api_url, {ClubId: environment.clubId,
        BaseDate: date}));
    }
    return forkJoin(requestsForPEriod)
      .pipe(map(response => this.getResult(response, startDate, endDate)))
  }

  getResult(response, startDate, endDate) {
    console.log(response)
    let trainerList: Trainer[] = [];
    let trainingSessionList: TrainingSession[] = [];
    for (let res of response) {
        let clubTrainingSessionList = res.result.classes;
      for (let trainingSession of clubTrainingSessionList) {
        if (trainingSession.coach && (trainingSession.numberOfVisits > 0)) {
          let trainingStartTime = new Date(trainingSession.startTime)
          if (trainingStartTime >= startDate && trainingStartTime <= endDate){
            trainerList.push({trainerId: trainingSession.coach.id, trainerName: trainingSession.coach.name });
            trainingSessionList.push( {
              id: trainingSession.course.id,
              name: trainingSession.course.name,
              trainerId: trainingSession.coach.id,
              date: trainingStartTime,
              trainingTime: (trainingSession.duration),
              numberOfVisits: trainingSession.numberOfVisits,
              altPrice: null
            })
          }
        }
      }

    }
    trainerList = trainerList.filter((trainer, index, self) =>
      index === self.findIndex((id) => (id.trainerId === trainer.trainerId)))
    return { trainerList, trainingSessionList }
  }
}
