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
  @ViewChild('inputName') inputName: ElementRef;

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
  focusPrice: boolean = false;
  focusName: boolean = false;
  startDate: Date;
  endDate: Date;
  tempPrice: number;



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
    this.sum = 0;
    this.tempPrice = 0.00;
    this.startDate = this.storageService.getStartDate();
    this.endDate = this.storageService.getEndDate();
    this.updateTrainingSessionList(this.startDate, this.endDate);

    // this.price = this.storageService.getTrainerPrice(this.id)
    // this.price = this.dataService.getTrainerPrice(this.id)[0]['price'];
    // this.sum = this.storageService.getTrainerIncome(this.id);
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
    if (price && price >= 0) {
      this.storageService.setTrainerPrice(trainerId, price);
      this.price = this.storageService.getTrainerPrice(trainerId);
      this.sum = this.storageService.getTrainerIncome(trainerId);
    }
    this.tempPrice = this.price;
    this.focusPrice = false;
  }

  clearInput() {
    if (this.tempPrice == 0) {
      this.tempPrice = null;
    }
  }

  addFocusAltPrice(sessionId: string, sessionDate: Date): void {
    this.idSession = sessionId;
    this.dateSession = sessionDate;
    this.focusAltPrice = true;
    setTimeout(() => {
      this.inputAltPrice.nativeElement.focus();
    }, 0);
  }

  addFocusPrice(): void {
    this.focusPrice = true;
    setTimeout(() => {
      this.inputPrice.nativeElement.focus();
    }, 0);
  }

  addFocusName(): void  {
    this.focusName = true;
    setTimeout(() => {
      this.inputName.nativeElement.focus();
    }, 0);
  }

  setStartDate(newDate: string): void  {
    this.startDate = new Date(newDate);
    console.log('1',this.trainerSessions)
    this.trainerSessions.length = 0;
    console.log('2', this.trainerSessions)
    // this.storageService.clearData();
    this.updateTrainingSessionList(this.startDate, this.storageService.getEndDate(), this.id);

  }

  setEndDate(newDate: string): void  {
    this.endDate = new Date(newDate);
    this.endDate.setHours(23, 59, 0, 0);
    // this.storageService.clearData();
    this.updateTrainingSessionList(this.storageService.getStartDate(), this.endDate, this.id);
  }

  updateTrainingSessionList(startDate: Date, endDate: Date, trainerId?: string): void {
    let trainerSessions = this.storageService.getTrainerSessions(this.id);
    let datesTraining = this.storageService.findDatesWorkPeriod(startDate, endDate);
    if (trainerId) {
      this.apiSubscription = this.dataService.getDataForOneTrainer(datesTraining, startDate, endDate, trainerId)
        .subscribe((res: TrainingSession[]) => {
        this.trainerSessions = res;
          this.price = this.storageService.getTrainerPrice(this.id);
          this.tempPrice = this.price;
          this.sum = this.storageService.getTrainerIncome(this.id);
      })
    }
    else
      if (trainerSessions.length == 0) {
        this.apiSubscription = this.dataService.getData(datesTraining, startDate, endDate).subscribe((res: any) => {
          this.storageService.setClubTrainingSession(res);
          this.trainerSessions = this.storageService.getTrainerSessions(this.id);
          this.price = this.storageService.getTrainerPrice(this.id);
          this.tempPrice = this.price;
          this.sum = this.storageService.getTrainerIncome(this.id);
        });
      }
      else {
        this.trainerSessions = trainerSessions;
        this.price = this.storageService.getTrainerPrice(this.id)
        this.tempPrice = this.price;
        this.sum = this.storageService.getTrainerIncome(this.id);
    }
  }

  editTrainerName(id:string, name: string): void {
    if (name) {
      this.storageService.setNewNameTrainer(id, name);
      this.trainerName = name;
    }
    this.focusName = false;
  }

  addAltPrice(sessionId: string, dateTrainingSession: Date, altPrice: number, trainerId: string): void {
    if (altPrice >= 0) {
      this.storageService.addAlternativePrice(sessionId, dateTrainingSession, altPrice);
      this.sum = this.storageService.getTrainerIncome(trainerId);
    }
    this.focusAltPrice = false;
  }
}
