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

  getRequestsForPeriod(datesTraining: string[]): Observable<any>[] {
    let requestsForPeriod: Observable<any>[] = [];
    for (let date of datesTraining) {
      requestsForPeriod.push(this.http.post(environment.api_url, {ClubId: environment.clubId, BaseDate: date}));
    }
    return requestsForPeriod
  }

  getData(datesTraining: string[], startDate: Date, endDate: Date): Observable<ClubInfo> {
    return forkJoin(this.getRequestsForPeriod(datesTraining))
      .pipe(map(response => this.getResult(response, startDate, endDate)))

  }

  getDataForOneTrainer(datesTraining: string[], startDate: Date, endDate: Date, trainerId: string): Observable<TrainingSession[]> {
    return forkJoin(this.getRequestsForPeriod(datesTraining))
      .pipe(map(response => this.getResultForOneTrainer(response, startDate, endDate, trainerId)))
  }

  getResultForOneTrainer(response: any[], startDate: Date, endDate: Date, trainerId: string): TrainingSession[] {
    let trainingSessionList: TrainingSession[] = [];
    for (let res of response) {
      for (let trainingSession of res.result.classes) {
        if (trainingSession.coach && trainerId == trainingSession.coach.id && (trainingSession.numberOfVisits > 0)) {
          let trainingStartTime = new Date(trainingSession.startTime)
          if (trainingStartTime >= startDate && trainingStartTime <= endDate) {
            trainingSessionList.push({
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
    return trainingSessionList.sort((prev: TrainingSession, next: TrainingSession) => {
      if (prev.date < next.date) {
        return -1;
      }
      if (prev.date > next.date) {
        return 1;
      }
      return 0;
    });
  }

  getResult(response: any[], startDate: Date, endDate: Date): ClubInfo {
    let trainerList: Trainer[] = [];
    let trainingSessionList: TrainingSession[] = [];
    for (let res of response) {
      for (let trainingSession of res.result.classes) {
        if (trainingSession.coach && (trainingSession.numberOfVisits > 0)) {
          let trainingStartTime = new Date(trainingSession.startTime)
          if (trainingStartTime >= startDate && trainingStartTime <= endDate) {
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
