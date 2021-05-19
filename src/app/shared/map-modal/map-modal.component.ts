import { environment } from './../../../environments/environment';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() center = { lat: 41.43, lng: -123.70 };
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickListener: any;
  googleMaps: any;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
    ) { }

    @ViewChild('map') mapElementRef: ElementRef;

    ngOnDestroy(): void {
      if (this.clickListener)
      {
        this.googleMaps.event.removeListener(this.clickListener);
      }
    }

    ngAfterViewInit(): void {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 16
      });

      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      if (this.selectable)
      {
        this.clickListener = map.addListener('click', event => {
          const selectedCoord = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.modalCtrl.dismiss(selectedCoord);
        });
      } else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: 'Place Location'
        });
        marker.setMap(map);
      }
    }).catch(err => {
      console.log(err)
    })
  }

  ngOnInit() {

  }

  onCancel() {
    this.modalCtrl.dismiss()
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      //TODO: set at env variable!!
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsAPIKey
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps)
        } else {
          reject('Google maps SDK not available.');
        }
      }
    })
  }

}
