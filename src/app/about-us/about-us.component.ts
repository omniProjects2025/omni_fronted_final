import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';
declare var $: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  @ViewChild('boardCarousel', { static: false }) boardCarousel!: ElementRef;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check the current route to determine which view to show
    const currentUrl = this.router.url;
    if (currentUrl.includes('/leadership-team')) {
      this.selected_team = 2;
    } else {
      this.selected_team = 1;
    }
    this.setSEOTags();
  }

  private setSEOTags(): void {
    if (this.selected_team === 2) {
      // SEO tags for Leadership Team page
      this.titleService.setTitle('Leadership Team - OMNI Hospitals | Executive Management');
      this.metaService.updateTag({ 
        name: 'description', 
        content: 'Meet the leadership team at OMNI Hospitals - our Group CEO, Chief Growth Officer, and Chief Financial Officer driving healthcare excellence.' 
      });
      this.metaService.updateTag({ 
        name: 'keywords', 
        content: 'OMNI hospitals leadership, healthcare executives, hospital management team, Group CEO, CFO, CGO' 
      });
      this.canonicalService.setCanonicalUrl('/about-us/leadership-team');
    } else {
      // SEO tags for main About Us page
      this.titleService.setTitle('About Us - OMNI Hospitals | Leading Healthcare Provider in Hyderabad');
      this.metaService.updateTag({ 
        name: 'description', 
        content: 'Learn about OMNI Hospitals - our mission, vision, and commitment to providing world-class healthcare services across multiple locations in Andhra Pradesh and Telangana.' 
      });
      this.metaService.updateTag({ 
        name: 'keywords', 
        content: 'about OMNI hospitals, healthcare provider Hyderabad, hospital mission vision, medical excellence, Andhra Pradesh Telangana healthcare' 
      });
      this.canonicalService.setCanonicalUrl('/about-us');
    }
  }

  selectedIndex: number = 0;
  selected_team = 1;
  about_chairman = [
    {
      id: 1, title: 'Chairman Message',
    },
    {
      id: 2, title: 'About Chairman',
    }
  ]
  boardMembers = [
    { name: 'Dr M Goutham Reddy', image: 'assets/about_us/dr_goutham_reddy.jpg', label: 'Medical Director' },
    { name: 'Dr E Venkat Ramana Reddy', image: 'assets/about_us/dr_venkat_ramana_reddy.jpg', label: 'Medical Director' },
    { name: 'Dr Y Sandeep Reddy', image: 'assets/about_us/dr.y.sandeep_reddy.jpg', label: 'Medical Director' },
    { name: 'Dr Radha Krishna', image: 'assets/about_us/dr_radha_krishna.jpg', label: 'Medical Director' },
    { name: 'Dr Ved Prakash', image: 'assets/about_us/dr_ved_prakash.jpg', label: 'Medical Director' },
    { name: 'Dr Raghava Dutt M', image: 'assets/about_us/dr_raghava_dutt_mulukutla.jpg', label: 'Medical Director' },
    { name: 'Dr Udai Prakash', image: 'assets/about_us/dr_udai_prakash.jpg', label: 'Medical Director' }
  ];
  managementteam = [
    {
      id: 1, label: 'Board Members'
    },
    {
      id: 2, label: 'Leadership Team'
    }
  ]
  leadershipTeam = [
    {
      name: 'Dr. Durgesh Shiva',
      designation: 'Group Chief Executive Officer',
      img: 'assets/about_us/ceo.png',
      description: `Dr. Durgesh Shiva is a seasoned healthcare professional with over 20 years of vast experience in spanning operations, strategic planning, and business growth in leading healthcare institutions. His expertise in profit and loss management, consultant recruitment and operational excellence has positioned him as a trusted leader in the healthcare sector, dedicated to improving patient outcomes and expanding access to quality care.`
    },
    {
      name: 'Dr. Aloke Chandra Mullick',
      designation: 'Group Chief Growth Officer',
      img: 'assets/about_us/alloc.svg',
      description: `Dr. Aloke Chandra is a seasoned healthcare leader with global experience. Dr. Aloke Mullick drives strategic growth and transformation at Omni Hospitals. Passionate about healthcare technology, he founded India’s first standalone EHR company and advises several HealthTech firms. A frequent international speaker and certified Heartfulness Meditation Trainer, he brings clarity, purpose, and innovation to everything he does.`
    },
    {
      name: 'Ankit Shah',
      designation: 'Group Chief Financial Officer',
      img: 'assets/about_us/anki_shah.svg',
      description: `Mr. Shah is an accomplished finance and strategy leader with over 20 years of experience across healthcare, life sciences, biotech, and infrastructure. His expertise includes risk management, investment planning, and strategic business development. He has held leadership roles at Alexandria Real Estate Equities Inc. and Ernst & Young. A Chartered Accountant (ICAI), Mr. Shah leads Omni’s financial strategy and governance.`
    }
  ];
  ngAfterViewInit(): void {
    setTimeout(() => this.initBoardCarousel(), 0);
  }


  initBoardCarousel() {
    const board = $(this.boardCarousel.nativeElement);
    board.owlCarousel({
      loop: true,
      margin: 20,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      smartSpeed: 700,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      responsive: {
        0: { items: 1 },
        576: { items: 2 },
        768: { items: 3 },
        992: { items: 4 }
      }
    });
  }


  selectChairman(index: number) {
    this.selectedIndex = index
  }

  selectedTeam(index: number) {
    this.selected_team = index;
    if (index === 2) {
      // Navigate to leadership-team URL
      this.router.navigate(['/about-us/leadership-team']);
    } else {
      // Navigate to main about-us page
      this.router.navigate(['/about-us']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetSelectedTeam() {
    this.selected_team = 1;
    // Navigate back to main about-us page
    this.router.navigate(['/about-us']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


