import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'second-opinion', component: SecondOpinionComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'health-checkup', component: HealthCheckupComponent },
  { path: 'package-details', component: PackageDetailsComponent },
  { path: 'our-specialities', component: OurSpecialitiesComponent },
  { path: 'our-specialities-details', component: OurSpecialitiesDetailsComponent },
  { path: 'technologies', component: TechnologiesComponent },
  { path: 'news-media', component: NewsMediaComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'technologies-details', component: TechnologiesDetailsComponent },
  { path: 'our-branches', component: OurBranchesComponent },
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
  { path: 'fixed-surgery-details', component: FixedSurgeryDetailsComponent },
  { path: 'our-empanelment', component: OurEmpanelmentComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'patient-care', component: PatientCareComponent },

  { path: '**', component: NotFoundComponent }, // 👈 Show 404 page here
];

@NgModule({
  imports: [
    AngularCommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class CommonPagesModule { }
