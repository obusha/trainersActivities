import {Injectable} from '@angular/core';
import {ClubInfo, Trainer, TrainerPrice, TrainingSession} from './data.service';

@Injectable()

export class StorageService {

  private clubTrainingSession: { trainerList: Trainer[], trainingSessionList: TrainingSession[]};
  private startDate: Date;
  private endDate: Date;
  private listTrainerPrice: TrainerPrice[];

  constructor() {
    this.clubTrainingSession = {trainerList: [],  trainingSessionList: []};
    this.listTrainerPrice = [];
    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(0);
    endDate.setHours(23, 59, 0, 0);
    startDate.setMonth(endDate.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  setStartDate(newTime: number): void {
    this.startDate.setTime(newTime);
  }

  setEndDate(newTime: number): void {
    this.endDate.setTime(newTime);
  }


  setClubTrainingSession(clubTrainingSession: ClubInfo): void {
    this.clubTrainingSession = {trainerList: clubTrainingSession.trainerList, trainingSessionList: clubTrainingSession.trainingSessionList};
    if (this.listTrainerPrice.length == 0) {
      this.setAllTrainerPrice();
    }
  }

  getTrainerList(): Trainer[] {
    return this.clubTrainingSession.trainerList
      .sort((prev: Trainer, next: Trainer) => {
      if (prev.trainerName < next.trainerName) {
        return -1;
      }
      if (prev.trainerName > next.trainerName) {
        return 1;
      }
      return 0;
    })
  }

  getTrainerSessions(trainerId: string): TrainingSession[] {
    return this.clubTrainingSession.trainingSessionList.filter((session: TrainingSession) => session.trainerId == trainerId)
      .sort((prev: TrainingSession, next: TrainingSession) => {
      if (prev.date < next.date) {
        return -1;
      }
      if (prev.date > next.date) {
        return 1;
      }
      return 0;
    });
  }

  setAllTrainerPrice(): void {
    for (let trainer of this.clubTrainingSession.trainerList) {
      this.listTrainerPrice.push({trainerId: trainer.trainerId, price: 0});
    }
  }

  setTrainerPrice(trainerId: string, newPrice: number): void {
    this.listTrainerPrice.forEach((elem: TrainerPrice) => {
      if (elem.trainerId == trainerId) {
        elem.price = +newPrice.toFixed(2);
      }
    })
  }

  getTrainerPrice(trainerId: string): number {
    let trainerPrice = this.listTrainerPrice.filter((price: TrainerPrice) => price.trainerId == trainerId);
      return trainerPrice[0].price;
  }

  setNewNameTrainer(trainerId: string, newName: string): void {
    this.clubTrainingSession.trainerList.forEach((trainer: Trainer) => {
      if (trainer.trainerId == trainerId) {
        trainer.trainerName = newName.trim();
      }
    })
  }

  findDatesWorkPeriod(startDate: Date, endDate: Date): string[] {
    let tempDate: Date = new Date(endDate);
    let day: number = tempDate.getDay();
    if (day != 0) {
      tempDate.setDate(tempDate.getDate() + (7 - day));
    }
    let datesTraining: string[] = [];
    while (tempDate > startDate) {
      datesTraining.push(tempDate.toISOString());
      tempDate.setDate(tempDate.getDate() - 7);
    }
    return datesTraining;
  }

  // getTrainerIncome(trainerId: string): number {
  //   let sum: number = 0;
  //   let price: number = this.getTrainerPrice(trainerId);
  //   let trainerSessions: TrainingSession[] = this.getTrainerSessions(trainerId);
  //   for (let session of trainerSessions) {
  //     let session_price: number = session.altPrice ? session.altPrice : price;
  //     sum += session.trainingTime / 60 * session_price;
  //   }
  //   return sum;
  // }

  addAlternativePrice(trainingSessionId: string, dateTrainingSession: Date, altPrice: number): void {
    this.clubTrainingSession.trainingSessionList.forEach((trainingSession: TrainingSession) => {
      if (trainingSession.id == trainingSessionId && trainingSession.date == dateTrainingSession) {
        trainingSession.altPrice = altPrice;
      }
    })
  }

  clearData() {
    this.clubTrainingSession.trainerList.length = 0;
    this.clubTrainingSession.trainingSessionList.length = 0;
  }
}
