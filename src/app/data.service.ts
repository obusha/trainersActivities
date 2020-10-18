const trainerList = [
  {id: 0, lastName: "Иванов", firstName: "Иван", patronymic: "Иванович", post: "Старший тренер"},
  {id: 1, lastName: "Петров", firstName: "Петр", patronymic: "Петрович", post: "Младший тренер"}
];

const trainerPriceList = [
  {id:0, trainerId: 0, price: 1000},
  {id:1, trainerId: 1, price: 2000}
]

const  trainingSessionList = [
  {id: 0, name: "Фулбади", trainerId: 1, time: '12:30:00', date: "01.04.2020", trainingTime: 2},
  {id: 1, name: "Фулбади", trainerId: 0, time: '14:30:00', date: "01.02.2020", trainingTime: 2},
  {id: 2, name: "Расстяжка", trainerId: 0, time: '14:30:00', date: "01.05.2020", trainingTime: 1},
  {id: 3, name: "Индивидуальная тренировка", trainerId: 1, time: '16:30:00', date: "01.01.2020", trainingTime: 2}
];

export class DataService {

  getTrainerList(): any[] {
    return trainerList;
  }

  getTrainerSessions(trainerId: number): any[] {
    return trainingSessionList.filter((session)=> session['trainerId'] == trainerId);
  }

  getTrainerPrice(trainerId: number): number{
    return trainerPriceList.filter((price)=> price['trainerId'] == trainerId)[0]['price'];
  }
}
