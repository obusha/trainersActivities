import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {TrainersPageComponent} from './trainersPage/trainersPage.component';
import {TrainerDetailPageComponent} from './trainerDetailPage/trainerDetailPage.component';
import {DataService} from './data.service';
import {StorageService} from './storage.service';



const appRoutes: Routes = [
  {
    path: '', component: TrainersPageComponent
  },
  {path: 'details/:id', component: TrainerDetailPageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    TrainersPageComponent,
    TrainerDetailPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule, ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [DataService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
