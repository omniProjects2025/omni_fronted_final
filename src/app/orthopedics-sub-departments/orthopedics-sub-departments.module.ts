import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Import the single reusable component
import { OrthopedicsSubDepartmentComponent } from './orthopedics-sub-department.component';

// Import service
import { OrthopedicsSubDepartmentsService } from './orthopedics-sub-departments.service';

// Import SharedModule for Header and Footer components
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: OrthopedicsSubDepartmentComponent
  }
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    OrthopedicsSubDepartmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    OrthopedicsSubDepartmentsService
  ],
  exports: [
    OrthopedicsSubDepartmentComponent
  ]
})
export class OrthopedicsSubDepartmentsModule { }

