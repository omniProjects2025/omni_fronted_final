import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { OurDoctorsComponent } from './our-doctors/our-doctors.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SecondOpinionComponent } from './second-opinion/second-opinion.component';
import { AboutUsComponent } from './about-us/about-us.component';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { HealthCheckupComponent } from './health-checkup/health-checkup.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OurSpecialitiesComponent } from './our-specialities/our-specialities.component';
import { OurSpecialitiesDetailsComponent } from './our-specialities-details/our-specialities-details.component';
import { TechnologiesComponent } from './technologies/technologies.component';
import { NewsMediaComponent } from './news-media/news-media.component';
import { BlogsComponent } from './blogs/blogs.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { SafePipe } from './safe.pipe';
import { TechnologiesDetailsComponent } from './technologies-details/technologies-details.component';
import { OurBranchesComponent } from './our-branches/our-branches.component';
import { CareersComponent } from './careers/careers.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { NewsMediaDetailsComponent } from './news-media-details/news-media-details.component';
import { BookAnAppointmentComponent } from './book-an-appointment/book-an-appointment.component';
// import { FixedSurgicalPackagesComponent } from './fixed-surgical-packages/fixed-surgical-packages.component';
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

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HeaderComponent,
    OurDoctorsComponent,
    HomeComponent,
    FooterComponent,
    SecondOpinionComponent,
    AboutUsComponent,
    HealthCheckupComponent,
    PackageDetailsComponent,
    OurSpecialitiesComponent,
    OurSpecialitiesDetailsComponent,
    TechnologiesComponent,
    NewsMediaComponent,
    BlogsComponent,
    VideoPlayerComponent,
    SafePipe,
    TechnologiesDetailsComponent,
    OurBranchesComponent,
    CareersComponent,
    FeedbackComponent,
    BlogDetailsComponent,
    BlogDetailsDataComponent,
    NewsMediaDetailsComponent,
    BookAnAppointmentComponent,
    // FixedSurgicalPackagesComponent,
    BoardMembersComponent,
    FixedSurgicalPackagesComponent,
    ContactUsComponent,
    DoctorDetailsComponent,
    ThankYouComponent,
    FixedSurgeryDetailsComponent,
    OurEmpanelmentComponent,
    NotFoundComponent,
    PatientCareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // CarouselModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    YouTubePlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
