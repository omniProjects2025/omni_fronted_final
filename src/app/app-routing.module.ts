import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   // { path: 'home', component: HomeComponent },
//   { path: 'home', component: HomeComponent },
//   { path: 'our-doctors', component: OurDoctorsComponent },
//   { path: 'second-opinion', component: SecondOpinionComponent },
//   { path: 'about-us', component: AboutUsComponent },
//   { path: 'health-checkup', component: HealthCheckupComponent },
//   { path: 'package-details', component: PackageDetailsComponent },
//   { path: 'our-specialities', component: OurSpecialitiesComponent },
//   { path: 'our-specialities-details', component: OurSpecialitiesDetailsComponent },
//   { path: 'technologies', component: TechnologiesComponent },
//   { path: 'news-media', component: NewsMediaComponent },
//   { path: 'blogs', component: BlogsComponent },
//   { path: 'technologies-details', component: TechnologiesDetailsComponent },
//   { path: 'our-branches', component: OurBranchesComponent },
//   { path: 'careers', component: CareersComponent },
//   { path: 'feedback', component: FeedbackComponent },
//   { path: 'blogs-details', component: BlogDetailsComponent },
//   { path: 'news-media-details', component: NewsMediaDetailsComponent },
//   { path: 'book-an-appointment', component: BookAnAppointmentComponent },
//   { path: 'board-members', component: BoardMembersComponent },
//   { path: 'fixed-surgical-packages', component: FixedSurgicalPackagesComponent},
//   { path: 'contact-us', component: ContactUsComponent},
//   { path: 'doctor-details', component: DoctorDetailsComponent},
//   { path: 'fixed-surgery-details', component: FixedSurgeryDetailsComponent},
//   { path: 'our-empanelment', component: OurEmpanelmentComponent},
//   { path: 'thank-you', component: ThankYouComponent},
//   { path: '**', redirectTo: 'home', pathMatch: 'full' },
// ];


 const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
{
  path: 'our-doctors',
  loadChildren: () => import('./our-doctors/our-doctors/our-doctors.module').then(m => m.OurDoctorsModule)
},

  {
    path: '',
    loadChildren: () =>
      import('./common-pages.module').then(m => m.CommonPagesModule)
  },
 
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled', 
  scrollOffset: [0, 0],
  preloadingStrategy: PreloadAllModules,
  initialNavigation: 'enabledBlocking'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
