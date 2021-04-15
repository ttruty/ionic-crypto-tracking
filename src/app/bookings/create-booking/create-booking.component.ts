import { Place } from './../../places/place.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('bookingForm', { static: true }) bookingForm: FormGroup;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableFrom);

    if (this.selectedMode === 'random'){
      this.startDate = new Date(
        availableFrom.getTime() +
        Math.random() * (
          availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime()
          )
        ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
        Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()
      )).toISOString();
    }


    this.bookingForm = new FormGroup({
      firstName : new FormControl(null, {
        updateOn: 'blur',
      }),
      lastName : new FormControl(null, {
        updateOn: 'blur',
      }),
      guestNumber: new FormControl(null, {
        updateOn: 'blur',
      }),
      endDate : new FormControl(this.endDate ),
      startDate : new FormControl(this.startDate)
    });
  }

  onCancel() {this.modalCtrl.dismiss(null, 'cancel')}

  onBookPlace(){
    console.log(this.bookingForm)
    this.modalCtrl.dismiss({
      firstName: this.bookingForm.value.firstName,
      lastName: this.bookingForm.value.lastName,
      guestNumber: this.bookingForm.value.guestNumber,
      startDate: this.bookingForm.value.startDate,
      endDate: this.bookingForm.value.endDate
    }, 'confirm')
  }



  datesValid() {
    return this.endDate > this.startDate;
  }

}
