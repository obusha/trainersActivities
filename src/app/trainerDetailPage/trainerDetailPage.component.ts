import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'details-app',
  templateUrl: './trainerDetailPage.component.html',
  styleUrls: ['./trainerDetailPage.component.scss'],
  providers: [DataService]
})

export class TrainerDetailPageComponent implements OnInit {
  @ViewChild('inputPrice') inputAltPrice: ElementRef;

  trainerSessions: any[];
  price: number;
  sessionPrice: number;
  sum: number;
  id: number;
  idSession: number;
  trainerName: string;
  altPrice: number;
  focus: boolean = false;

  private subscription: Subscription;
  private querySubscription: Subscription;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.subscription = route.params.subscribe(params => this.id = params['id']);
    this.querySubscription = route.queryParams.subscribe((queryParam: any) => {
      this.trainerName = queryParam['trainerName'];
    });
  }

  ngOnInit() {
    this.sum = 0;
    this.trainerSessions = this.dataService.getTrainerSessions(this.id);
    this.price = this.dataService.getTrainerPrice(this.id)[0]['price'];
    this.sum = this.dataService.getTrainerIncome(this.id);
  }

  addFocus(sessionId: number) {
    this.idSession = sessionId;
    console.log(this.idSession);
    this.focus = true;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.inputAltPrice.nativeElement.focus();
    }, 0);
  }


  addAltPrice(sessionId: number, altPrice: number, trainerId: number) {
    if (altPrice >= 0) {
      this.dataService.addAlternativePrice(sessionId, altPrice);
      this.sum = this.dataService.getTrainerIncome(trainerId);
    }
    this.focus = false;
  }
}
