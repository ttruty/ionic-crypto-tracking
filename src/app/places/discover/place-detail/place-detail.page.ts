import { BookingService } from './../../../bookings/booking.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

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
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService) { }

  place: Place;
  isBookable = false;
  private placesSub: Subscription;

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe( place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
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
        this.loadingCtrl.create({
          message: 'Booking Place...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageURL,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        })
      }
    });
  }

}
