import {Injectable} from '@angular/core';
import {Trainer, TrainerPrice, TrainingSession} from './data.service';

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
    endDate.setHours(23, 59, 0, 0)
    startDate.setMonth(endDate.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  getStartDate(){
    return this.startDate;
  }

  getEndDate() {
    return this.endDate;
  }

  setStartDate(newTime: number) {
    this.startDate.setTime(newTime);
  }

  setEndDate(newTime: number) {
    this.endDate.setTime(newTime);
  }


  setClubTrainingSession(clubTrainingSession: {trainerList: Trainer[], trainingSessionList: TrainingSession[]}) {
    this.clubTrainingSession = {trainerList: clubTrainingSession.trainerList, trainingSessionList: clubTrainingSession.trainingSessionList};
    if (this.listTrainerPrice.length == 0) {
      this.setAllTrainerPrice()
    }
  }

  getTrainerList() {
    return this.clubTrainingSession.trainerList.sort((prev, next) => {
      if (prev.trainerName < next.trainerName) {
        return -1;
      }
      if (prev.trainerName > next.trainerName) {
        return 1;
      }
      return 0;
    })
  }

  getTrainerSessions(trainerId: string): any[] {
    return this.clubTrainingSession.trainingSessionList.filter((session) => session.trainerId == trainerId).sort((prev, next) => {
      if (prev.date < next.date) {
        return -1;
      }
      if (prev.date > next.date) {
        return 1;
      }
      return 0;
    });
  }

  setAllTrainerPrice() {
    // this.listTrainerPrice = trainerPriceList;
    for (let trainer of this.clubTrainingSession.trainerList) {
      this.listTrainerPrice.push({trainerId: trainer.trainerId, price: 0})
    }
  }

  setTrainerPrice(trainerId: string, newPrice: number) {
    this.listTrainerPrice.forEach(elem => {
      if (elem.trainerId == trainerId) {
        elem.price = newPrice;
      }
    })
  }


  getTrainerPrice(trainerId: string): number {
    let trainerPrice = this.listTrainerPrice.filter((price) => price.trainerId == trainerId);
    console.log('price',trainerPrice[0].price)
      return trainerPrice[0].price;
  }

  setNewNameTrainer(trainerId: string, newName: string) {
    this.clubTrainingSession.trainerList.forEach(trainer => {
      if (trainer.trainerId == trainerId) {
        trainer.trainerName = newName;
      }
    })
  }

  findDatesWorkPeriod(startDate: Date, endDate: Date) {
    let tempDate = new Date(endDate);
    let day = tempDate.getDay()
    if (day != 0) {
      tempDate.setDate(tempDate.getDate() + (7 - day))
    }
    let datesTraining = []
    while (tempDate > startDate) {
      datesTraining.push(tempDate.toISOString())
      tempDate.setDate(tempDate.getDate() - 7)
    }
    return datesTraining
  }

  getTrainerIncome(trainerId: string): number {
    let sum: number = 0;
    let price: number = this.getTrainerPrice(trainerId);
    let trainerSessions: any[] = this.getTrainerSessions(trainerId);
    for (let session of trainerSessions) {
      let session_price = session.altPrice ? session.altPrice : price;
      sum += session.trainingTime / 60 * session_price;
    }
    return sum;
  }

  addAlternativePrice(trainingSessionId: string, dateTrainingSession: Date, altPrice: number): void {
    this.clubTrainingSession.trainingSessionList.forEach(trainingSession => {
      if (trainingSession.id == trainingSessionId && trainingSession.date == dateTrainingSession) {
        trainingSession.altPrice = altPrice;
      }
    })
    // trainingSessionList[trainingSessionId]['altPrice'] = altPrice;
  }

  clearData() {
    this.clubTrainingSession.trainerList.length = 0;
    this.clubTrainingSession.trainingSessionList.length = 0;
  }
}
