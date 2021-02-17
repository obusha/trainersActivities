import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'trainers-app',
  templateUrl: './trainersPage.component.html',
  styleUrls: ['./trainersPage.component.scss'],
  providers: [DataService]
})

export class TrainersPageComponent{
  trainers: any[];

  constructor(private dataService: DataService) {}

  ngOnInit(){
    this.trainers = this.dataService.getTrainerList();
  }
}
