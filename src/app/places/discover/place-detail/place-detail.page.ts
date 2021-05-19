import { switchMap, take } from 'rxjs/operators';
import { MapModalComponent } from './../../../shared/map-modal/map-modal.component';
import { BookingService } from './../../../bookings/booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
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
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router) { }

  place: Place;
  isBookable = false;
  private placesSub: Subscription;
  isLoading = false;

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(take(1), switchMap(userId => {
        if (!userId){
          throw new Error('Found no user Id')
        }
        fetchedUserId = userId;
        return this.placesService.getPlace(paramMap.get('placeId'));
      })).subscribe( place => {
        this.place = place;
        this.isBookable = place.userId !== fetchedUserId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error Occurred',
          message: 'Could not load place',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/places/tabs/discover']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      })
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onShowFullMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.place.location.lat, lng: this.place.location.lng},
      selectable: false,
      closeButtonText: 'Close',
      title: this.place.location.address
    }
  })
     .then(
      modalEl => {
        modalEl.present();
      }
    )
  }

  onBookPlace() {
    this.loadingCtrl.create({
      message: 'Booking Place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.addBooking(
        this.place.id,
        this.place.title,
        this.place.imageURL
      ).subscribe(() => {
        loadingEl.dismiss();
      });
    })
  }

}
