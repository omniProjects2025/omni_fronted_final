import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent {
 constructor(private router: Router){
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // or just: window.scrollTo(0, 0);
    }
  });
  }
  goToHome() {
    this.router.navigate(['/home']).then(success => {
      if (success) {
        console.log('Navigation to home page successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }
}

