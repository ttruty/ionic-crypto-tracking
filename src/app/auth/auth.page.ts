import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, AuthResponseData } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public loginForm: FormGroup;
  isLoading = false;
  isLogin = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
    ) {
      this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit() {
  }

  onSwitchAthMode() {
    this.isLogin = !this.isLogin;
  }

  showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication Failed',
      message: message,
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present()
    })

  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authenticate(email, password)
    this.loginForm.reset();
  }

  authenticate(email:string, password:string) {
    this.isLoading = true;
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'})
    .then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLogin){
        authObs = this.authService.login(email, password);
      }
      else {
        authObs = this.authService.signup(email, password);
      }
      authObs.subscribe( resData => {
        console.log(resData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, errorRes => {
        loadingEl.dismiss();
        const code = errorRes.error.error.message;
        let message = "Could not sign up"
        if (code === 'EMAIL_EXISTS')
        {
          message = "This email exists already"
        }
        else if (code === 'EMAIL_NOT_FOUND')
        {
          message = "Email not found"
        }
        else if (code === 'INVALID_PASSWORD')
        {
          message = "Password is incorrect"
        }
        this.showAlert(message);
      })
    });
  }

}
