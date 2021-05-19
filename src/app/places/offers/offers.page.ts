import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listLoadedPlaces: Place[];
  releventPlaces: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.authService.userId.pipe(take(1)).subscribe(userId => {
        const isShown = place => place.userId === userId;
        this.releventPlaces = this.loadedPlaces.filter(isShown);
        this.listLoadedPlaces = this.releventPlaces.slice(1);
      })
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
