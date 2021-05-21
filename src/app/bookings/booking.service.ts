import { PlacesService } from './../places/places.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookingData {
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient, private placeService: PlacesService) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: BookingData }>(
          `${environment.firebaseOrigin}/bookings.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
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
                resData[key].placeImage
              )
            );
          }
        }
        return bookings;
        //return []; test no places returned
      }),
      tap((bookings) => {
        this._bookings.next(bookings);
      })
    );
  }

  foundBooking(id: string) {
    let updateBooking: Booking[];
    let fetchedToken
    return this.authService.token.pipe(take(1), switchMap(token => {
      fetchedToken = token;
      return this.bookings;
    }),
      take(1),
      switchMap((bookings) => {
        if (!bookings || bookings.length <= 0) {
          return this.fetchBookings();
        } else {
          return of(bookings);
        }
      }),
      switchMap((bookings) => {
        const updateBookingIndex = bookings.findIndex((p) => p.id === id);
        updateBooking = [...bookings];
        const oldBooking = updateBooking[updateBookingIndex];
        updateBooking[updateBookingIndex] = new Booking(
          oldBooking.id,
          oldBooking.placeId,
          oldBooking.userId,
          oldBooking.placeTitle,
          oldBooking.placeImage,
          true
        );
        this.placeService.foundPlace(oldBooking.placeId).subscribe();
        return this.http.put(
          `${environment.firebaseOrigin}/bookings/${id}.json?auth=${fetchedToken}`,
          {...updateBooking[updateBookingIndex], id: null }
        );
      }),
      tap((respData) => {
        this._bookings.next(updateBooking);
      })
    );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
  ) {
    let generatedId: string;
    let newBooking: Booking;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeTitle,
          placeImage
        );
        return this.http.post<{ name: string }>(
          `${environment.firebaseOrigin}/bookings.json?auth=${token}`,
          {
            ...newBooking,
            id: null,
          }
        );
      }),
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
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
          .delete(
            `${environment.firebaseOrigin}/bookings/${id}.json?auth=${token}`
          )
      }),
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          this._bookings.next(bookings.filter((b) => b.id !== id));
        })
      );
  }
}
