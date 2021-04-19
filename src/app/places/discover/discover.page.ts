import { Place } from './../place.model';
import { PlacesService } from './../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listLoadedPlaces: Place[];
  private placesSub: Subscription;


  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.listLoadedPlaces = this.loadedPlaces.slice(1);
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

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

}
