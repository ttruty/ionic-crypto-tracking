import { Place } from './../../places/place.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  bookingForm: FormGroup;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController,  public formBuilder: FormBuilder) {
    this.bookingForm = this.formBuilder.group({
      first_Name : new FormControl(null, {
        validators: [Validators.required]
      }),
      last_Name : new FormControl(null, {
        validators: [Validators.required]
      }),
      guest_Number: new FormControl(null, {
        validators: [Validators.required]
      }),
      end_Date : new FormControl(null, {
        validators: [Validators.required]
      }),
      start_Date : new FormControl(null, {
        validators: [Validators.required]
      })
    });
    // this.bookingForm.valueChanges.subscribe(obs => {
    //   console.log("Changes");
    // })
  }

  ngOnInit() {
  }

  onCancel() {this.modalCtrl.dismiss(null, 'cancel')}

  onSubmit() {
    console.log(this.bookingForm.value);
  }

  onBookPlace(){
    // console.log(this.bookingForm.value);
    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.bookingForm.value.first_Name,
        lastName: this.bookingForm.value.last_Name,
        guestNumber: +this.bookingForm.value.guest_Number,
        startDate: new Date(this.bookingForm.value.start_Date),
        endDate: new Date(this.bookingForm.value.end_Date)
      }
    }, 'confirm')
  }



  datesValid() {
    const start = new Date(this.bookingForm.value.start_Date);
    const end = new Date(this.bookingForm.value.end_Date);
    return end > start;
  }

}
