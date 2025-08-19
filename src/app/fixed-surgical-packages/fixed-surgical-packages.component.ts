import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FixedpackagesService } from '../fixedpackages.service';

@Component({
  selector: 'app-fixed-surgical-packages',
  templateUrl: './fixed-surgical-packages.component.html',
  styleUrls: ['./fixed-surgical-packages.component.css']
})
export class FixedSurgicalPackagesComponent {
  locations: string[] = ['All Packages', 'Kothapet', 'Kukatpally', 'Nampally', 'Vizag', 'Kurnool'];
  selected: string = 'All Packages';
  surgicalPackages: { [key: string]: any[] } = {};
  packages: any[] = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private fixedPackagesService: FixedpackagesService
  ) { }

  ngOnInit(): void {
    this.getFixedSurgicalJsonData();
  }

  getFixedSurgicalJsonData() {
    this.fixedPackagesService.getAllHealthPackagesDetails().subscribe(
      (res: any) => {
        console.log(res, 'API response...');
        // ✅ Extract the first object inside `data` array
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.surgicalPackages = res.data[0];
          this.updatePackages(); // show all packages on load
        } else {
          console.error('Unexpected API structure:', res);
        }
      },
      (error) => {
        console.error('Failed to fetch packages:', error);
      }
    );
  }


  updatePackages(): void {
    if (this.selected === 'All Packages') {
      this.packages = Object.keys(this.surgicalPackages)
        .filter(key => key !== '_id' && key !== 'package_includes' && key !== 'faqs')
        .map(key => this.surgicalPackages[key])
        .flat();
    } else {
      this.packages = this.surgicalPackages[this.selected] || [];
    }

    console.log(this.packages, 'Final packages after filtering');
  }

  selectLocation(location: string) {
    this.selected = location;
    this.updatePackages();
  }

  viewPackageDetails(obj: any) {
    console.log(obj,this.selected, 'view obj.. selected');
    this.router.navigate(['/fixed-surgery-details'], {
      queryParams: {
        location: this.selected,
        selected_package: JSON.stringify(obj) // ✅ Serialize object
      }
    });
  }

}
