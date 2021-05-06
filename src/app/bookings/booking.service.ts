import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://ionic-air-bb-clone-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((resData) => {
          const bookings = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].placeTitle,
                  resData[key].placeImage,
                  resData[key].guestNumber,
                  resData[key].firstName,
                  resData[key].lastName,
                  new Date (resData[key].bookedFrom),
                  new Date (resData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
          //return []; test no places returned
        }),
        tap(bookings => {
          this._bookings.next(bookings);
        })
      );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lower_Manhattan_skyline_-_June_2017.jpg/800px-Lower_Manhattan_skyline_-_June_2017.jpg',
      guestNumber,
      firstName,
      lastName,
      dateFrom,
      dateTo
    );
    // return this.bookings.pipe(take(1), delay(1500), tap(bookings => {
    //   this._bookings.next(bookings.concat(newBooking));
    //   })
    // );
    return this.http
      .post<{ name: string }>(
        'https://ionic-air-bb-clone-default-rtdb.firebaseio.com/bookings.json',
        {
          ...newBooking,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }


  cancelBooking(id: string) {
    return this.http.delete(`https://ionic-air-bb-clone-default-rtdb.firebaseio.com/bookings/${id}.json`,
    ).pipe(switchMap(() => {
      return this.bookings;
    }),
    take(1),
    tap(bookings => {
      this._bookings.next(bookings.filter(b => b.id !== id));
    })
    );
  }
}
