import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";

@Injectable({ providedIn: 'root'})
export class BookingService {
  private _bookings: Booking[] = [
    {
      id: 'xyx',
      placeId: 'p1',
      placeTitle: 'Chicago Apartment',
      guestNumber: 2,
      userId: 'abc'
    }
  ]

  get bookings() {
    return [...this._bookings];
  }
}
