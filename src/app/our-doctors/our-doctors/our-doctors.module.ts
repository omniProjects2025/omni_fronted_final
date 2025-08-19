import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OurDoctorsComponent } from '../our-doctors.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: OurDoctorsComponent }
    ])
  ]
})
export class OurDoctorsModule { }
