import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, ActionSheetController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController) { }

  place: Place;
  private placesSub: Subscription;

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe( place => {
        this.place = place;
      })
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onBookPlace() {
    this.actionSheetCtrl.create({
      header: "Choose an Action",
      buttons: [{
        text: 'Select Date',
        handler: () => {
          this.openBookingModel('select');
        }
      },
      {
        text: 'Random Date',
        handler: () => {
          this.openBookingModel('random');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    }).then(
      actionSheetEl => {
        actionSheetEl.present();
      }
    )
  }

  openBookingModel(mode: 'select' | 'random') {
    console.log(mode);

    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode}}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);

      if (resultData.role === "confirm") {
        console.log('BOOKED!');
      }
    })
  }

}
