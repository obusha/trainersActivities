import { Component } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { DataService } from './data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'details-app',
  template: `<div>
    <div>
      <a routerLink=''>К списку тренеров</a>
    </div>
    <div>
      <h2>Тренер {{trainerName}}</h2>
    </div>
    <div>
        <p>Заработок тренера: {{sum}} руб.&#8399;</p>
    </div>
    <div>
      <table>
        <tr>
          <th>Проведенные тренировки</th>
          <th>Продолжительность, час</th>
          <th>Дата</th>
          <th>Время</th>
        </tr>
        <tr *ngFor="let session of trainerSessions">
          <td>{{session['name']}}</td>
          <td>{{session['trainingTime']}}</td>
          <td>{{session['date']}}</td>
          <td>{{session['time']}}</td>
        </tr>
      </table>
    </div>
  </div>
    `,
  styleUrls: ['./trainerDetailPage.component.scss'],
  providers: [DataService]
})
export class TrainerDetailPageComponent {
  trainerSessions: any[];
  price: number;
  sum: number;
  id: number;
  trainerName: string;
  private subscription: Subscription;
  private querySubscription: Subscription;
  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.subscription = route.params.subscribe(params=>this.id=params['id']);
    this.querySubscription = route.queryParams.subscribe((queryParam: any) => {
      this.trainerName = queryParam['trainerName'];
    })
      }

  ngOnInit(){
    this.sum = 0;
    this.trainerSessions = this.dataService.getTrainerSessions(this.id);
    this.price = this.dataService.getTrainerPrice(this.id);
    for (let session of this.trainerSessions)
    {
      this.sum += session['trainingTime'];
    }
    this.sum *= this.price;
  }
}
