import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface TrainerPrice {
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

export interface ClubInfo {
  trainerList: Trainer[];
  trainingSessionList: TrainingSession[];
}

@Injectable()
export class DataService {

  constructor(private http: HttpClient) {}

  getData(datesTraining: string[], startDate: Date, endDate: Date, trainerId?: string): Observable<ClubInfo> {
    let requestsForPeriod: Observable<any>[] = [];
    for (let date of datesTraining) {
      requestsForPeriod.push(this.http.post(environment.api_url, {ClubId: environment.clubId, BaseDate: date}));
    }
    return forkJoin(requestsForPeriod)
      .pipe(map(response => this.getResult(response, startDate, endDate, trainerId)))
  }

  getResult(response: any[], startDate: Date, endDate: Date, trainerId?: string): ClubInfo {
    console.log('type', typeof response)
    let trainerList: Trainer[] = [];
    let trainingSessionList: TrainingSession[] = [];
    for (let res of response) {
        let clubTrainingSessionList = res.result.classes;
      for (let trainingSession of clubTrainingSessionList) {
        if (trainingSession.coach && (trainingSession.numberOfVisits > 0)) {
          let trainingStartTime = new Date(trainingSession.startTime)
          if (trainingStartTime >= startDate && trainingStartTime <= endDate) {
            if (trainerId) {
              if (trainerId == trainingSession.coach.id) {
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
            else {
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
    }
    if (!trainerId) {
      trainerList = trainerList.filter((trainer, index, self) =>
        index === self.findIndex((id) => (id.trainerId === trainer.trainerId)))
    }
    return { trainerList, trainingSessionList }
  }
}
