import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {StorageService} from '../storage.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'trainers-app',
  templateUrl: './trainersPage.component.html',
  styleUrls: ['./trainersPage.component.scss'],
  providers: [DataService]
})

export class TrainersPageComponent implements OnInit, OnDestroy {
  trainers: any;
  error: any;
  noDataFlag: boolean;
  startDate: Date;
  endDate: Date;
  private apiSubscription: Subscription;
  constructor(private dataService: DataService, private storageService: StorageService) {
    this.noDataFlag = false;
  }

  ngOnInit(){
    this.startDate = this.storageService.getStartDate();
    this.endDate = this.storageService.getEndDate();
    this.updateTrainersInfo(this.startDate, this.endDate);
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  setStartDate(newDate: string): void {
    this.startDate = new Date(newDate);
    this.storageService.setStartDate(this.startDate.getTime());
    this.storageService.clearData();
    this.updateTrainersInfo(this.startDate, this.storageService.getEndDate());
  }

  setEndDate(newDate: string): void {
    this.endDate = new Date(newDate);
    this.endDate.setHours(23, 59, 0, 0);
    this.storageService.setEndDate(this.endDate.getTime());
    this.storageService.clearData();
    this.updateTrainersInfo(this.storageService.getStartDate(), this.endDate);
  }


  updateTrainersInfo(startDate: Date, endDate: Date): void {
    // this.storageService.clearData();
    this.noDataFlag = false;
    this.trainers = this.storageService.getTrainerList();
    if (this.trainers.length == 0) {
      let datesTraining = this.storageService.findDatesWorkPeriod(startDate, endDate);
      this.apiSubscription = this.dataService.getData(datesTraining, startDate, endDate).subscribe((res: any) => {
        this.storageService.setClubTrainingSession(res);
        this.trainers = this.storageService.getTrainerList();
        this.noDataFlag = (this.trainers.length == 0);
      }, error => {this.error = error.message; alert('Ошибка при получении данных с сервера! Обратитесь к Вашему системному администратору.')});
    }
  }
}
