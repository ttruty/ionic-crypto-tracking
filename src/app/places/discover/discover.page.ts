import { take, tap } from 'rxjs/operators';
import { Place } from './../place.model';
import { PlacesService } from './../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listLoadedPlaces: Place[];
  releventPlaces: Place[];
  private placesSub: Subscription;
  private filter = 'all';
  isLoading = false;


  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.segmentChanged(this.filter);
      this.releventPlaces = this.loadedPlaces.reverse();
      console.log(this.releventPlaces)
      this.listLoadedPlaces = this.releventPlaces.slice(1);
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  // reload the places whenever on enter the discover page
  // ionViewDidEnter() {
  //   this.loadedPlaces = this.placesService.places;
  //   this.listLoadedPlaces = this.loadedPlaces.slice(1);
  // }

  segmentChanged(filter: any) {
    if (filter.detail){
      filter = filter.detail.value;
    } else {
      filter = this.filter
    }
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      const isShown = place => filter === 'all' || place.userId !== userId;
      this.releventPlaces = this.loadedPlaces.filter(isShown).reverse();
      this.filter = filter;
      this.listLoadedPlaces = this.releventPlaces.slice(1);
    })
  }

}
