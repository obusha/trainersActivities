import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../data.service';
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

  trainerSessions: any[];
  price: number;
  sessionPrice: number;
  sum: number;
  id: string;
  idSession: number;
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

  addPrice(price: number, trainerId: string) {
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

  addFocusAltPrice(sessionId: number, sessionDate: Date) {
    this.idSession = sessionId;
    this.dateSession = sessionDate;
    console.log(this.idSession);
    this.focusAltPrice = true;
    setTimeout(() => {
      this.inputAltPrice.nativeElement.focus();
    }, 0);
  }

  addFocusPrice() {
    this.focusPrice = true;
    setTimeout(() => {
      this.inputPrice.nativeElement.focus();
    }, 0);
  }

  addFocusName() {
    this.focusName = true;
    setTimeout(() => {
      this.inputName.nativeElement.focus();
    }, 0);
  }

  setStartDate(newDate) {
    // let newStartData = new Date(newDate);
    this.startDate = new Date(newDate);
    // this.storageService.setStartDate(newStartData.getTime());
    this.storageService.clearData();
    this.updateTrainingSessionList(this.startDate, this.storageService.getEndDate());

  }

  setEndDate(newDate) {
    this.endDate = new Date(newDate);
    this.endDate.setHours(23, 59, 0, 0);
    // this.storageService.setEndDate(newEndDate.getTime());
    this.storageService.clearData();
    this.updateTrainingSessionList(this.storageService.getStartDate(), this.endDate);
  }

  updateTrainingSessionList(startDate: Date, endDate: Date) {
    this.trainerSessions = this.storageService.getTrainerSessions(this.id);

    if (this.trainerSessions.length == 0) {
      let datesTraining = this.storageService.findDatesWorkPeriod(startDate, endDate);
      this.apiSubscription = this.dataService.getData(datesTraining, startDate, endDate).subscribe((res: any) => {
        this.storageService.setClubTrainingSession(res);
        this.trainerSessions = this.storageService.getTrainerSessions(this.id);
        this.price = this.storageService.getTrainerPrice(this.id);
        this.tempPrice = this.price;
        this.sum = this.storageService.getTrainerIncome(this.id);
      });

    }
    else {
      this.price = this.storageService.getTrainerPrice(this.id)
      this.tempPrice = this.price;
      this.sum = this.storageService.getTrainerIncome(this.id);
    }

  }
  editTrainerName(id:string, name: string) {
    if (name) {
      this.storageService.setNewNameTrainer(id, name);
    }
    this.focusName = false;
  }

  addAltPrice(sessionId: string, dateTrainingSession: Date, altPrice: number, trainerId: string) {
    if (altPrice >= 0) {
      this.storageService.addAlternativePrice(sessionId, dateTrainingSession, altPrice);
      this.sum = this.storageService.getTrainerIncome(trainerId);
    }
    this.focusAltPrice = false;
  }
}
