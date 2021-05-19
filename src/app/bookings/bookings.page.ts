import { Router } from '@angular/router';
import { BookingService } from './booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private router: Router) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.bookingSub){
      this.bookingSub.unsubscribe();
    }
  }

  onSelectHunt(booking) {
    console.log("Hunt Selected", booking)
    this.router.navigateByUrl("/places/tabs/discover/" + booking.placeId)
  }


  onCancelBooking(bookingId: string, slidingEl: IonItemSliding){
    slidingEl.close();
    this.loadingCtrl.create({
      message: 'Cancelling...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingSub = this.bookingService.cancelBooking(bookingId).subscribe(() =>
      {
        loadingEl.dismiss();
      });
    });
  }

  segmentChanged(filter: any) {
    filter = filter.detail.value;
    console.log("Segment Changed", filter)
  }

}
