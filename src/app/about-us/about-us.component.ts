import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  @ViewChild('boardCarousel', { static: false }) boardCarousel!: ElementRef;

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
      img: 'assets/about_us/ceo.png',
      description: `Dr. Aloke Chandra is a seasoned healthcare leader with global experience. Dr. Aloke Mullick drives strategic growth and transformation at Omni Hospitals. Passionate about healthcare technology, he founded India’s first standalone EHR company and advises several HealthTech firms. A frequent international speaker and certified Heartfulness Meditation Trainer, he brings clarity, purpose, and innovation to everything he does.`
    },
    {
      name: 'Ankit Shah',
      designation: 'Group Chief Financial Officer',
      img: 'assets/about_us/ceo.png',
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
    this.selected_team = index
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetSelectedTeam() {
    this.selected_team = 1
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


