import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { SecondOpinionComponent } from './second-opinion/second-opinion.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HealthCheckupComponent } from './health-checkup/health-checkup.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { OurSpecialitiesComponent } from './our-specialities/our-specialities.component';
import { OurSpecialitiesDetailsComponent } from './our-specialities-details/our-specialities-details.component';
import { TechnologiesComponent } from './technologies/technologies.component';
import { NewsMediaComponent } from './news-media/news-media.component';
import { BlogsComponent } from './blogs/blogs.component';
import { TechnologiesDetailsComponent } from './technologies-details/technologies-details.component';
import { OurBranchesComponent } from './our-branches/our-branches.component';
import { CareersComponent } from './careers/careers.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { NewsMediaDetailsComponent } from './news-media-details/news-media-details.component';
import { BookAnAppointmentComponent } from './book-an-appointment/book-an-appointment.component';
import { BoardMembersComponent } from './board-members/board-members.component';
import { FixedSurgicalPackagesComponent } from './fixed-surgical-packages/fixed-surgical-packages.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { FixedSurgeryDetailsComponent } from './fixed-surgery-details/fixed-surgery-details.component';
import { OurEmpanelmentComponent } from './our-empanelment/our-empanelment.component';
import { BlogDetailsDataComponent } from './blog-details-data/blog-details-data.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PatientCareComponent } from './patient-care/patient-care.component';
import { PrivacyPolocyComponent } from './privacy-polocy/privacy-polocy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { KeySurgeriesComponent } from './key-surgeries/key-surgeries.component';
import { TotalKneeReplacementComponent } from './total-knee-replacement/total-knee-replacement.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'get-a-second-opinion', component: SecondOpinionComponent },
  { path: 'about-us/leadership-team', component: AboutUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'health-checkup', component: HealthCheckupComponent },
  { path: 'package-details', component: PackageDetailsComponent },
  
  // New SEO-friendly routes - Order matters! Static routes MUST come before parameterized routes
  
  // Cardiology routes - Order matters!
  // 1. Location-specific routes (most specific first)
  { path: 'specialities/cardiology/kukatpally', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/cardiology/vizag', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/cardiology/kothapet', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/cardiology/nampally', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/cardiology/kurnool', component: OurSpecialitiesDetailsComponent },
  
  // 2. Sub-department detail pages (for slugs like treatment-for-heart-failure-in-kukatpally)
  // This route must come after location-specific routes but handles other paths
  { path: 'specialities/cardiology/:slug', loadChildren: () => import('./cardiology-sub-departments/cardiology-sub-departments.module').then(m => m.CardiologySubDepartmentsModule) },
  
  // 3. Base cardiology route (without location/slug - shows Kukatpally by default)
  { path: 'specialities/cardiology', component: OurSpecialitiesDetailsComponent },
  
  // Orthopedics routes - Order matters!
  // 1. Location-specific routes (most specific first)
  { path: 'specialities/orthopedics/kukatpally', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/orthopedics/vizag', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/orthopedics/kothapet', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/orthopedics/nampally', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/orthopedics/kurnool', component: OurSpecialitiesDetailsComponent },
  
  // 2. Sub-department detail pages (for slugs like total-knee-replacement-in-kukatpally)
  // This route must come after location-specific routes but handles other paths
  { 
    path: 'specialities/orthopedics/:slug', 
    loadChildren: () => import('./orthopedics-sub-departments/orthopedics-sub-departments.module').then(m => m.OrthopedicsSubDepartmentsModule)
  },
  
  // 3. Base orthopedics route (without location/slug - shows Kukatpally by default)
  { path: 'specialities/orthopedics', component: OurSpecialitiesDetailsComponent },
  
  // Specialities base route (first visit - no location in URL, defaults to Kukatpally)
  { path: 'specialities', component: OurSpecialitiesComponent },
  
  // Location-specific routes (when location is clicked)
  { path: 'specialities/kukatpally', component: OurSpecialitiesComponent },
  { path: 'specialities/vizag', component: OurSpecialitiesComponent },
  { path: 'specialities/kothapet', component: OurSpecialitiesComponent },
  { path: 'specialities/nampally', component: OurSpecialitiesComponent },
  { path: 'specialities/kurnool', component: OurSpecialitiesComponent },
  
  // Parameterized routes - these come after static routes to avoid conflicts
  { path: 'specialities/:speciality/:location', component: OurSpecialitiesDetailsComponent },
  { path: 'specialities/:speciality', component: OurSpecialitiesDetailsComponent },
  
  // Old routes with redirects for backward compatibility
  { path: 'our-specialities', component: OurSpecialitiesComponent },
  { path: 'our-specialities-details', component: OurSpecialitiesDetailsComponent },
  { path: 'our-specialities-details/:department', component: OurSpecialitiesDetailsComponent },
  
  { path: 'technologies', component: TechnologiesComponent },
  { path: 'news-media', component: NewsMediaComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'blogs/:slug', component: BlogDetailsDataComponent },
  { path: 'technologies-details', component: TechnologiesDetailsComponent },
  { path: 'locations', component: OurBranchesComponent },
  { path: 'locations/:location', component: OurBranchesComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'blogs-details', component: BlogDetailsComponent },
  { path: 'blogs-details-data', component: BlogDetailsDataComponent },
  { path: 'news-media-details', component: NewsMediaDetailsComponent },
  { path: 'book-an-appointment', component: BookAnAppointmentComponent },
  { path: 'board-members', component: BoardMembersComponent },
  { path: 'fixed-surgical-packages', component: FixedSurgicalPackagesComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'doctor-details', component: DoctorDetailsComponent },
  { path: 'doctor-details/:doctor', component: DoctorDetailsComponent },
  { path: 'fixed-surgery-details', component: FixedSurgeryDetailsComponent },
  { path: 'our-empanelment', component: OurEmpanelmentComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'patient-care', component: PatientCareComponent },
  { path: 'privacy-polocy', component: PrivacyPolocyComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'key-surgeries', component:KeySurgeriesComponent},
  { path: 'total-knee-replacement-surgery-kukatpally-hyderabad', component: TotalKneeReplacementComponent },
  { path: '**', component: NotFoundComponent }, // 👈 Show 404 page here
];

@NgModule({
  imports: [
    AngularCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TotalKneeReplacementComponent
  ],
  providers: [DatePipe]
})
export class CommonPagesModule { }
