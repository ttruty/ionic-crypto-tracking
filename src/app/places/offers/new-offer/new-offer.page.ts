import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from './../../location.model';
import { LoadingController } from '@ionic/angular';
import { PlacesService } from './../../places.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placeService: PlacesService,
    private router: Router,
    private loaderCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
        title : new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        description : new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)]
        }),
        location: new FormControl(null, {
          validators: [Validators.required]
        }),
        image: new FormControl(null)
    })
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({location: location})
  }

  onImagePicked(imageData: string){
    let imageFile;
    if (typeof imageData === 'string') {
      try{
        imageFile =  base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg')
      } catch(error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({image: imageFile});
  }

  onCreateOffer() {
    console.log(this.form.value || !this.form.get('image').value);
    if (!this.form.valid) {
      return;
    }
    this.loaderCtrl.create({
      message: 'Creating cryptid hunt...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placeService.uploadImage(this.form.get('image').value).pipe(switchMap(uploadResponse => {
        return this.placeService.addPlace(
          this.form.value.title,
          this.form.value.description,
          this.form.value.location,
          uploadResponse.imageUrl
        );
      }))
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers'])
      }) ;
    });
  }

}
