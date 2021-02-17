const trainerList = [
  {id: 0, lastName: 'Иванов', firstName: 'Иван', patronymic: 'Иванович', post: 'Старший тренер'},
  {id: 1, lastName: 'Петров', firstName: 'Петр', patronymic: 'Петрович', post: 'Младший тренер'}
];

let trainerPriceList = [
  {id: 0, trainerId: 0, price: 1000},
  {id: 1, trainerId: 1, price: 2000}
];

const trainingSessionList = [
  {id: 0, name: 'Фулбади', trainerId: 1, time: '12:30:00', date: '01.04.2020', trainingTime: 2, altPrice: null},
  {id: 1, name: 'Фулбади', trainerId: 0, time: '14:30:00', date: '01.02.2020', trainingTime: 2, altPrice: null},
  {id: 2, name: 'Расстяжка', trainerId: 0, time: '14:30:00', date: '01.05.2020', trainingTime: 1, altPrice: null},
  {id: 3, name: 'Индивидуальная тренировка', trainerId: 1, time: '16:30:00', date: '01.01.2020', trainingTime: 2, altPrice: null}
];

export class DataService {

  getTrainerList(): any[] {
    return trainerList;
  }

  getTrainerSessions(trainerId: number): any[] {
    return trainingSessionList.filter((session) => session['trainerId'] == trainerId);
  }

  getTrainerPrice(trainerId: number): any[] {
    return trainerPriceList.filter((price) => price['trainerId'] == trainerId);
  }

  getTrainerIncome(trainerId: number): number {
    let sum: number = 0;
    let price: number = this.getTrainerPrice(trainerId)[0]['price'];
    let trainerSessions: any[] = this.getTrainerSessions(trainerId);
    for (let session of trainerSessions) {
      let session_price = session['altPrice'] ? session['altPrice'] : price;
      sum += session['trainingTime'] * session_price;
    }
    return sum;
  }

  addAlternativePrice(trainingSessionId: number, altPrice: number): void {
    trainingSessionList[trainingSessionId]['altPrice'] = altPrice;
  }
}
