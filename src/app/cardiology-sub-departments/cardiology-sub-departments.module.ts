import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Import the single reusable component
import { CardiologySubDepartmentComponent } from './cardiology-sub-department.component';

// Import service
import { CardiologySubDepartmentsService } from './cardiology-sub-departments.service';

// Import Header and Footer components
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

const routes: Routes = [
  {
    path: '',
    component: CardiologySubDepartmentComponent
  }
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    CardiologySubDepartmentComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    CardiologySubDepartmentsService
  ],
  exports: [
    CardiologySubDepartmentComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class CardiologySubDepartmentsModule { }
