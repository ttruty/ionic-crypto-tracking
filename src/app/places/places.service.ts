import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
    [
      new Place('p1', 'Chicago Apartment', 'Edgewater gem, with a porch', 'https://images1.apartments.com/i2/Mel4Hm5GU_A13jVZId0JNlaZaYgQpTgCahWJI-5laEc/117/elevate-chicago-il-primary-photo.jpg', 950, new Date('2021-01-01'), new Date('2024-12-31'), 'xyz'),
      new Place('p2', 'Minnesota Apartment', 'St Paul, Duplex', 'https://assets3.thrillist.com/v1/image/1703071/414x310/crop;jpeg_quality=65.jpg', 1100, new Date('2021-01-01'), new Date('2024-12-31'), "abc"),
      new Place('p3', 'Minnesota Apartment', 'St Paul, Duplex', 'https://assets3.thrillist.com/v1/image/1703071/414x310/crop;jpeg_quality=65.jpg', 1100, new Date('2021-01-01'), new Date('2024-12-31'), "xyz"),
    ]
  );

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(
      take(1), map (
      places => {
        return {...places.find(p => p.id === id)};
      }
    ));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lower_Manhattan_skyline_-_June_2017.jpg/800px-Lower_Manhattan_skyline_-_June_2017.jpg",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    // add new place with rxjs observables
    return this.places.pipe(take(1), delay(1000), tap(places => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  editPlace(id: string, title: string, description: string) {
    return this.places.pipe(
      take(1), delay(1000), tap(
      places => {
        const updatePlaceIndex = places.findIndex(p => p.id === id);
        const updatePlaces = [...places];
        const oldPlace = updatePlaces[updatePlaceIndex];
        updatePlaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageURL,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId);
        this._places.next(updatePlaces);
      }
    ));
  }
}
