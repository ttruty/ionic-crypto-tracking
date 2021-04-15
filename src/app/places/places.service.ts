import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1', 'Chicago Apartment', 'Edgewater gem, with a porch', 'https://images1.apartments.com/i2/Mel4Hm5GU_A13jVZId0JNlaZaYgQpTgCahWJI-5laEc/117/elevate-chicago-il-primary-photo.jpg', 950, new Date('2021-01-01'), new Date('2024-12-31')),
    new Place('p2', 'Minnesota Apartment', 'St Paul, Duplex', 'https://assets3.thrillist.com/v1/image/1703071/414x310/crop;jpeg_quality=65.jpg', 1100, new Date('2021-01-01'), new Date('2024-12-31')),
  ];

  get places() {
    return [... this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(p=>p.id === id)};
  }
}
