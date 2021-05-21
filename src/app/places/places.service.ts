import { environment } from 'src/environments/environment';
import { PlaceLocation } from './location.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, switchMap } from 'rxjs/operators';

interface PlaceData {
  description: string;
  imageURL: string;
  title: string;
  userId: string;
  location: PlaceLocation;
}

// new Place(
//   'p1',
//   'Chicago Apartment',
//   'Edgewater gem, with a porch',
//   'https://images1.apartments.com/i2/Mel4Hm5GU_A13jVZId0JNlaZaYgQpTgCahWJI-5laEc/117/elevate-chicago-il-primary-photo.jpg',
//   950,
//   new Date('2021-01-01'),
//   new Date('2024-12-31'),
//   'xyz'
// ),
// new Place(
//   'p2',
//   'Minnesota Apartment',
//   'St Paul, Duplex',
//   'https://assets3.thrillist.com/v1/image/1703071/414x310/crop;jpeg_quality=65.jpg',
//   1100,
//   new Date('2021-01-01'),
//   new Date('2024-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'Minnesota Apartment',
//   'St Paul, Duplex',
//   'https://assets3.thrillist.com/v1/image/1703071/414x310/crop;jpeg_quality=65.jpg',
//   1100,
//   new Date('2021-01-01'),
//   new Date('2024-12-31'),
//   'xyz'
// ),

@Injectable({
  providedIn: 'root',
})

export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlace(id: string) {
    return this.authService.token.pipe(take(1),
      switchMap((token) => {
        return this.http.get<PlaceData>(
          `${environment.firebaseOrigin}/offered-places/${id}.json?auth=${token}`
        );
      }),
      map((placeData) => {
        return new Place(
          id,
          placeData.title,
          placeData.description,
          placeData.imageURL,
          placeData.userId,
          placeData.location
        );
      })
    );
  }

  fetchPlaces() {
    return this.authService.token.pipe(take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: PlaceData }>(
          `${environment.firebaseOrigin}/offered-places.json?auth=${token}`
        );
      }),
      map((resData) => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageURL,
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return places;
        //return []; test no places returned
      }),
      tap((places) => {
        this._places.next(places);
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    return this.authService.token.pipe(take(1),switchMap(token => {
      uploadData.append('image', image);
      return this.http.post<{ imageUrl: string; imagePage: string }>(
        'https://us-central1-crypto-cryptids.cloudfunctions.net/storeImage',
        uploadData, {headers: {Authorization: 'Bearer ' + token}}
      );
    }))

  }

  addPlace(
    title: string,
    description: string,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No user found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          fetchedUserId,
          location
        );
        return this.http.post<{ name: string }>(
          `${environment.firebaseOrigin}/offered-places.json?auth=${token}`,
          {
            ...newPlace,
            id: null,
          }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // add new place with rxjs observables
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  editPlace(id: string, title: string, description: string) {
    let updatePlaces: Place[];
    let fetchedToken
    return this.authService.token.pipe(take(1), switchMap(token => {
      fetchedToken = token;
      return this.places;
    }),
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex((p) => p.id === id);
        updatePlaces = [...places];
        const oldPlace = updatePlaces[updatePlaceIndex];
        updatePlaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageURL,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `${environment.firebaseOrigin}/offered-places/${id}.json?auth=${fetchedToken}`,
          { ...updatePlaces[updatePlaceIndex], id: null }
        );
      }),
      tap((respData) => {
        this._places.next(updatePlaces);
      })
    );
  }
}
