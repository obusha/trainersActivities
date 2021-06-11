import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService, TrainingSession} from '../data.service';
import {Subscription} from 'rxjs';
import {StorageService} from '../storage.service';

@Component({
  selector: 'details-app',
  templateUrl: './trainerDetailPage.component.html',
  styleUrls: ['./trainerDetailPage.component.scss'],
  providers: [DataService]
})

export class TrainerDetailPageComponent implements OnInit, OnDestroy {

  @ViewChild('inputAltPrice') inputAltPrice: ElementRef;
  @ViewChild('inputPrice') inputPrice: ElementRef;

  trainerSessions: TrainingSession[];
  price: number;
  sessionPrice: number;
  sum: number;
  id: string;
  idSession: string;
  dateSession: Date;
  trainerName: string;
  altPrice: number;
  focusAltPrice: boolean = false;
  startDate: Date;
  endDate: Date;
  dateNow: number;
  error: any;
  loadDataFlag: boolean;
  noDataFlag: boolean;
  widthName: string;
  widthPrice: string;



  private subscription: Subscription;
  private querySubscription: Subscription;
  private apiSubscription: Subscription;

  constructor(private storageService: StorageService, private dataService: DataService, private route: ActivatedRoute) {
    this.subscription = route.params.subscribe(params => this.id = params['id']);
    this.querySubscription = route.queryParams.subscribe((queryParam: any) => {
      this.trainerName = queryParam['trainerName'];
    });
  }

  ngOnInit() {
    this.noDataFlag = false;
    this.loadDataFlag = true;
    this.dateNow = Date.now();
    this.sum = 0;
    this.price = 0.00;
    this.startDate = this.storageService.getStartDate();
    this.endDate = this.storageService.getEndDate();
    this.updateTrainingSessionList(this.startDate, this.endDate);
    this.widthName = ((this.trainerName.length + 2) * 11) + 'px';
    this.widthPrice = (this.price.toFixed(2).length + 1) * 8 + 'px';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }

  }

  addPrice(price: number, trainerId: string): void {
    if (price && price >= 0 && price <= 10000) {
      this.storageService.setTrainerPrice(trainerId, +price);
      this.price = this.storageService.getTrainerPrice(trainerId);
      this.sum = this.getTrainerIncome(trainerId, this.trainerSessions);
      this.widthPrice = (this.price.toFixed(2).length + 1) * 8 + 'px';
    }
    else {
      alert("Ставка должа быть положительным числом в диапазоне от 0 до 10000.")
    }
    this.inputPrice.nativeElement.value = this.price
  }

  addFocusAltPrice(sessionId: string, sessionDate: Date): void {
    this.idSession = sessionId;
    this.dateSession = sessionDate;
    this.focusAltPrice = true;
    setTimeout(() => {
      this.inputAltPrice.nativeElement.focus();
    }, 0);
  }

  setStartDate(newDate: string): void  {
    let date: Date = new Date(newDate);
    let minDate: Date = new Date('2000-01-01');
    if (date.getTime() > minDate.getTime() && date.getTime() < this.dateNow) {
      this.startDate = new Date(date);
      this.trainerSessions.length = 0;
      this.updateTrainingSessionList(this.startDate, this.storageService.getEndDate(), this.id);
    }
  }

  setEndDate(newDate: string): void  {
    let date: Date = new Date(newDate);
    let minDate: Date = new Date('2000-01-01');
    if (date.getTime() > minDate.getTime() && date.getTime() < this.dateNow) {
      this.endDate = new Date(date);
      this.endDate.setHours(23, 59, 0, 0);
      this.updateTrainingSessionList(this.storageService.getStartDate(), this.endDate, this.id);
    }

  }

  updateTrainingSessionList(startDate: Date, endDate: Date, trainerId?: string): void {
    let trainerSessions = this.storageService.getTrainerSessions(this.id);

    this.noDataFlag = false;

    let datesTraining = this.storageService.findDatesWorkPeriod(startDate, endDate);
    if (trainerId) {
      this.loadDataFlag = true;
      this.apiSubscription = this.dataService.getDataForOneTrainer(datesTraining, startDate, endDate, trainerId)
        .subscribe((res: TrainingSession[]) => {
        this.trainerSessions = res;
          this.price = this.storageService.getTrainerPrice(this.id);
          this.sum = this.getTrainerIncome(this.id, this.trainerSessions);
          this.noDataFlag = (this.trainerSessions.length == 0);
          this.loadDataFlag = false;
      }, error => {this.error = error.message})
    }
    else
      if (trainerSessions.length == 0) {
        this.loadDataFlag = true;
        this.apiSubscription = this.dataService.getData(datesTraining, startDate, endDate).subscribe((res: any) => {
          this.storageService.setClubTrainingSession(res);
          this.trainerSessions = this.storageService.getTrainerSessions(this.id);
          this.noDataFlag = (this.trainerSessions.length == 0);
          this.price = this.storageService.getTrainerPrice(this.id);
          this.sum = this.getTrainerIncome(this.id, this.trainerSessions);
          this.loadDataFlag = false;
        }, error => {this.error = error.message});
      }
      else {
        this.trainerSessions = trainerSessions;
        this.price = this.storageService.getTrainerPrice(this.id)
        this.sum = this.getTrainerIncome(this.id, this.trainerSessions);
        this.loadDataFlag = false;
    }
  }

  editTrainerName(id:string, name: string): void {
    if (name && /^[A-Za-zА-Яа-яЁё\s\-]+$/.test(name)) {
      this.storageService.setNewNameTrainer(id, name.trim());
      this.trainerName = name.trim();
      this.widthName = ((this.trainerName.length + 2) * 11) + 'px';
    }
    else {
      alert("Некорректное имя тренера")
      this.trainerName = this.storageService.getTrainerName(id)
    }
  }

  addAltPrice(sessionId: string, dateTrainingSession: Date, altPrice: number, trainerId: string): void {
    if (altPrice && altPrice >= 0 && altPrice <= 10000 && /[0-9]/) {
      this.storageService.addAlternativePrice(sessionId, dateTrainingSession, +altPrice);
      this.sum = this.getTrainerIncome(trainerId, this.trainerSessions);
    }
    else {
      alert("Стоимость должа быть положительным числом в диапазоне от 0 до 10000.")
    }
    this.focusAltPrice = false;

  }

  getTrainerIncome(trainerId: string, trainingSession: TrainingSession[]): number {
    let sum: number = 0;
    let price: number = this.storageService.getTrainerPrice(trainerId);
    for (let session of trainingSession) {
      let session_price: number = session.altPrice ? session.altPrice : (price * session.trainingTime / 60);
      sum += session_price;
    }
    return sum;
  }
}
