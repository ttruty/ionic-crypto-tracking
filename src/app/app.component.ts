import { Subscription } from 'rxjs';
import { Plugins, Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  private prevAuthState = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,)
    {
      this.initializeApp();
    }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
  ngOnInit(): void {
    this.sub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.prevAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.prevAuthState = isAuth;
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    })
  }

  onLogout() {
    console.log("Logout");
    this.authService.logout();

  }
}
