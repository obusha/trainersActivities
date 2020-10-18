import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'trainers-app',
  template: `<div>
    <table>
      <tr>
        <th>Тренер</th>
        <th>Должность</th>
      </tr>
      <tr *ngFor="let trainer of trainers">
        <td>
          <a [routerLink]="['details', trainer['id']]"
             [queryParams]="{'trainerName': trainer['lastName'].concat(' ', trainer['firstName'],' ',trainer['patronymic'])}">
            {{trainer['lastName']}} {{trainer['firstName']}} {{trainer['patronymic']}}
          </a>
        </td>
        <td>{{trainer['post']}}</td>
      </tr>
    </table>
  </div>`,
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
