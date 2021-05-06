import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    console.log(this.isLoading)
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
      console.log(this.isLoading)
    });

  }


  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId: string){
    console.log('Edit item' + offerId);
  }
  onDelete(offerId) {
    console.log('Delete Item' + offerId);
  }

}
