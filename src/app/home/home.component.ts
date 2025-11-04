import { Component, ViewChild, ElementRef, Renderer2, HostListener, ChangeDetectorRef, SimpleChanges, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { DomSanitizer, SafeResourceUrl, Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import 'owl.carousel';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { VideoStateService } from '../services/video-state.service';
import { CanonicalService } from '../services/canonical.service';
import { toUrlFriendly } from '../utils/url-helper.util';
import { environment } from '../../environments/environment';
register();
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private videoSubscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    this.videoSubscription.unsubscribe();
    // Ensure all videos are stopped when leaving this component
    this.videoStateService.stopAllVideos();
  }

  // Video management methods
  playTestimonialVideo(idx: number): void {
    const testimonial = this.testimonials[idx];
    if (!testimonial) return;

    // Ensure no other videos are playing before starting this one
    this.videoStateService.stopAllVideos();

    const videoId = this.extractVideoId(testimonial.videoUrl);
    this.videoStateService.setCurrentlyPlayingVideo(videoId);
  }

  private extractVideoId(url: string): string {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : url;
  }

  private updateVideoStates(currentVideoId: string | null): void {
    // The isVideoPlaying() method will handle the UI state
    // No need to force change detection here as it's handled by the subscription
  }

  isVideoPlaying(idx: number): boolean {
    const testimonial = this.testimonials[idx];
    if (!testimonial) return false;

    const videoId = this.extractVideoId(testimonial.videoUrl);
    return this.videoStateService.getCurrentlyPlayingVideo() === videoId;
  }

  @ViewChild('owlCarousel', { static: false }) owlCarousel!: ElementRef;
  @ViewChild('patientowlCarousel', { static: false }) patientowlCarousel!: ElementRef;
  @ViewChild('blogCarousel', { static: false }) blogCarousel!: ElementRef;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  showFullText = false;
  active_button = 0;
  isMobile = false;
  currentBlogIndex = 0;
  slidesPerView = 3;

  breakpointsJson = JSON.stringify({
    0: { slidesPerView: 1.1 },
    480: { slidesPerView: 1.5 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  });

  canSlidePrev = false;
  canSlideNext = true;
  owlInstance: any;

  get totalBlogSlides(): number {
    return this.blogs.length;
  }

  specialities = [
    {
      id: 1, spe_name: 'Our Specialities'
    },
    {
      id: 2, spe_name: 'Key Surgeries'
    }
  ]

  faqs = [
    {
      question: 'How do preventive health check-ups help?',
      answer: `Preventive check-ups assist in early detection of diseases, risk assessment, and timely intervention, helping reduce long-term complications and healthcare costs.`,
      expanded: true
    },
    { question: 'Are emergency services available 24/7 in Omni Hospitals?', answer: 'Yes, we are equipped with round-the-clock emergency services, including trauma care, intensive care units, and emergency surgeries.', expanded: false },
    { question: 'How to Find the Best Hospital in Hyderabad?', answer: 'To find the best hospital in Hyderabad, consider factors like medical specialties offered, reputation of doctors, quality certifications (e.g., NABH), emergency response time, and patient feedback. A multispecialty hospital offering round-the-clock services is often a preferred choice.', expanded: false },
    { question: 'How to Know If a Hospital Visit Is Necessary?', answer: 'A hospital visit is necessary when symptoms are sudden, severe, or unmanageable at home. Warning signs include high or persistent fever, difficulty breathing, chest pain, loss of consciousness, severe abdominal pain, sudden weakness or numbness, uncontrolled bleeding, or injuries from falls or accidents.', expanded: false },
  ];
  our_specialities = [
    { id: 1, dep_name: 'Cardiology', img: "assets/our_specialities_new/Cardio_gray.svg" },
    { id: 2, dep_name: 'ENT', img: "assets/our_specialities_new/ENT.svg" },
    { id: 3, dep_name: 'General Medicine', img: "assets/our_specialities_new/general_medicine.svg" },
    { id: 4, dep_name: 'General Surgery', img: "assets/our_specialities_new/General_Surgery.svg" },
    { id: 5, dep_name: 'Gastroenterology', img: "assets/our_specialities_new/Gastro.svg" },
    { id: 6, dep_name: 'Neurology', img: "assets/our_specialities_new/brain.svg" },
    {
      id: 7, dep_name: 'Nephrology', img: "assets/our_specialities_new/Nephrology_Urology.svg"
    },
    { id: 8, dep_name: 'Obstetrics & Gynaecology', img: "assets/our_specialities_new/Gynaecology.svg" },
    // { id: 9, dep_name: 'Paediatrics', img: "assets/our_specialities_new/Paediatrics.svg" },
    { id: 9, dep_name: 'Pulmonology', img: "assets/our_specialities_new/Pulmonology.svg" },
    { id: 10, dep_name: 'Psychiatry', img: "assets/our_specialities_new/Psychiatry.svg" },
    { id: 11, dep_name: 'Orthopedics', img: "assets/our_specialities_new/Orthopedic.svg" },
  ]

  awards = [
    { img: 'assets/images/awards/award1.png' },
    { img: 'assets/images/awards/award2.png' },
    { img: 'assets/images/awards/award3.png' },
    { img: 'assets/images/awards/award4.png' },
    { img: 'assets/images/awards/award5.png' },
    { img: 'assets/images/awards/award6.png' }
  ];

  fullText = 'OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care. Omni hospitals is Owned by the healthcare division of incor group. OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care. Omni hospitals is Owned by the healthcare division of incor group.';

  why_choose_omni = [
    { title: 'Hospitals', value: '6', img: 'assets/icons/hospitals.svg' },
    { title: 'Beds', value: '800+', img: 'assets/icons/beds.svg' },
    { title: 'Doctors', value: '450+', img: 'assets/icons/doctors.svg' },
    { title: 'Pharmacies', value: '6', img: 'assets/icons/pharmacies.svg' }
  ];

  technologies = [
    { id: 1, img: 'assets/technologies/ct_scan_tech.jpg', label: 'CT Scan', short_desc: 'At OMNI Hospitals, we use advanced CT scan technology to provide fast, accurate and safe diagnostic imaging...' },
    { id: 2, img: 'assets/technologies/Technologies_Ultrasound.jpg', label: 'Ultra Sound', short_desc: 'Ultrasound is commonly used to assess the abdomen, pelvis, kidneys, liver, thyroid, and during pregnancy...' },
    { id: 3, img: 'assets/technologies/technologies_Cathlab.jpg', label: 'Cathlab', short_desc: 'Cath Lab (Cardiac Catheterization Laboratory) is a specialized facility where minimally invasive procedures..' },
    { id: 4, img: 'assets/technologies/Technologies_Dialysis.jpg', label: 'Dialysis', short_desc: 'At OMNI Hospitals, we offer advanced dialysis care for patients with chronic kidney disease or kidney failure...' },
    { id: 5, img: 'assets/technologies/Technologies_Incubater.jpg', label: 'Incubator', short_desc: 'At OMNI Hospitals, our neonatal incubators provide a safe, temperature-controlled environment for newborns who need...' },
    { id: 6, img: 'assets/technologies/ot.jpg', label: 'Modular OT', short_desc: 'At OMNI Hospitals, our Operation Theatres (OTs) are designed with cutting-edge technology to ensure safe, sterile, and efficient..' }
  ];

  userTestimonials = [
    {
      name: "Nandini Yadav",
      location: "Kukatpally",
      image: "assets/technologies/women_dummy_profile.svg",
      text: "I'm admitted under dr. Vinay Kumar.  I had a great experience at omni hospital kukatpally."
    },
    {
      name: "anand kumar",
      location: "Kukatpally",
      image: "assets/technologies/men_dummy_profile.svg",
      text: "Myself anand Kumar came for here gastric problem since past 2yrs am suffering liver problem also Dr.saidulu sir seen my case nd done endoscopy is very simple manner Nd team also very good Thanks u sir"
    },
    {
      name: 'Raji Reddy',
      location: 'Kukatpally',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'I have consulted dr vinay kumar he was very nice and patient during examination thanks to omni hospitals'
    },
    {
      name: 'Anasuya Kummari',
      location: 'Kukatpally',
      image: 'assets/technologies/women_dummy_profile.svg',
      text: 'Dr Praneeth Reddy consolation is very comfortable for me thank you omni'
    },
    {
      name: 'Srihari Patnaik',
      location: 'Kukatpally',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'Last 5yrs Iam consulted DR nagavender rao .his treatment was good.Good facility and treatment.'
    },
    {
      name: 'Ambica M',
      location: 'Kukatpally',
      image: 'assets/technologies/women_dummy_profile.svg',
      text: 'All over service is amazing and my consultant doctor neelima mam is amazing doctor im fully satisfied'
    },
    {
      name: 'sruthi spandana',
      location: 'Kukatpally',
      image: 'assets/technologies/women_dummy_profile.svg',
      text: 'Dr. Avinash Sir treatment is Very Good Hospital Services are VERY EXCELLENT'
    },
    {
      name: 'Kalyan Kalyan',
      location: 'OMNI Vizag',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'Dr. Avinash Sir treatment is Very Good Hospital Services are VERY EXCELLENT'
    },
    {
      name: 'Rongali Swathi',
      location: 'Vizag',
      image: 'assets/technologies/women_dummy_profile.svg',
      text: 'Excellent experience in terms of hospital, nursing care, service is very good maintenance was top.Truly appreciated'
    },
    {
      name: 'RAVI KUMAR BANGARI',
      location: 'Vizag',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'Iam very happy with treatment Dr. Subramanyam sir cardiologist and Dr. Satish sir'
    },
    {
      name: 'lakshman Reddy',
      location: 'Kukatpally',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'Excellent services the nursing staffs doctors and management staff is excellent they are very supportive overall Iam fully satisfied'
    },
    {
      name: 'ravindar fca',
      location: 'Kothapet',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'Excellant service is provided by DR ANUD IN DIALYSIS DEPT DURING DIALYSIS WHILE I WAS HAVING CRAMPS PROBLEM. ...M RAVINDAR KUMAR'
    },
    {
      name: 'Shobha Rani',
      location: 'Kothapet',
      image: 'assets/technologies/women_dummy_profile.svg',
      text: 'I had a nose surgery in omni hospital kothapet, and was extremely impressed with the care we received'
    },
    {
      name: 'Nandikonda Rajeshwar',
      location: 'Kothapet',
      image: 'assets/technologies/men_dummy_profile.svg',
      text: 'I had surgery in this hospital,excellent hospitality and good response for every moment'
    }
  ];


  testimonials = [

    {
      name: "Kanakamma",
      text: "Rapid Recovery After Total Knee Replacement (TKR) Surgery by Dr. Ranjith",
      date: "Jun 5, 2025",
      videoPlayed: false,
      thumbnailUrl: 'pSc6uKMEBo8',
      videoUrl: "https://www.youtube.com/embed/pSc6uKMEBo8"
    },
    {
      name: "Vijaya Laxmi",
      text: "Miraculous Recovery After Total Knee Replacement Surgery",
      date: "May 3, 2025",
      videoPlayed: false,
      thumbnailUrl: 'bxB3DoF2oYM',
      videoUrl: "https://www.youtube.com/embed/bxB3DoF2oYM"
    },
    {
      name: "Koteshwar Rao",
      text: "This platform helped me a lot in my career growth. The services provided are top-notch...",
      date: "Apr 15, 2025",
      videoPlayed: false,
      thumbnailUrl: 'dwNxv9xVl08',
      videoUrl: "https://www.youtube.com/embed/dwNxv9xVl08"
    },
    {
      name: "Diva Prasad",
      text: " From Near Death to Recovery | A Story of Hope and Healing",
      date: "Apr 12, 2025",
      videoPlayed: false,
      thumbnailUrl: 'CM_y3X06Nkc',
      videoUrl: "https://www.youtube.com/embed/CM_y3X06Nkc"
    },
    {
      name: "Ranjith Kumar Yadav",
      text: " A Remarkable Accident Recovery",
      date: "Oct 24, 2024",
      videoPlayed: false,
      thumbnailUrl: 'wuR_fkYqn2o',
      videoUrl: "https://www.youtube.com/embed/wuR_fkYqn2o"
    }
  ];

  blogs = [
    {
      image: "assets/blogs_main/total_knee_replacement_banner_home.jpeg",
      title: "How Total Knee Replacement Surgery Improves Quality of Life",
      description: "Constant knee pain can make daily life feel like a struggle. Every day tasks like walking...",
      date: "June 4, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/impact_air_pollution_on.jpg",
      title: "The Impact of Air Pollution on Lung Health",
      description: "Air pollution isn’t just an environmental concern, it’s a serious threat to your health...",
      date: "May 27, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/Stress-and-Heart-Health.jpg",
      title: "Stress and Heart Health: Understanding the Connection...",
      description: "Stress is a common part of normal life, it is something that you cannot inherently...",
      date: "May 13, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/gi_bleeding_.jpg",
      title: "Managing Gastrointestinal Bleeding: Surgical & Non-Surgical Approaches",
      description: "Gastrointestinal (GI) bleeding is a serious medical condition that can occur anywhere...",
      date: "April 30, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/step_by_step_chronic_kidney_disease.jpeg",
      title: "Step-by-Step Guide to Managing Chronic Kidney Disease (CKD)",
      description: "Chronic Kidney Disease (CKD) is a progressive condition where the kidneys gradually...",
      date: "March 3, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/the_science_behind.jpg",
      title: "The Science Behind Sleep and Brain Health",
      description: "Sleep is not just time for the body to rest, it is actually a vital aspect of brain...",
      date: "January 20, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/common_summer_skin_problems.jpg",
      title: "Common Summer Skin Problems and How to Prevent Them",
      description: "When the temperature rises, so do the chances of developing skin issues. Summer...",
      date: "May 7, 2025",
      link: "#"
    },
    {
      image: "assets/blogs_main/summer_heat.jpg",
      title: "The Management of Chronic Illness During Summer Heat",
      description: "Summer is typically viewed as the season of rest, relaxation, and enjoyment...",
      date: "May 9, 2025",
      link: "#"
    }
  ];


  locations_details = [
    {
      id: 1, location_name: 'Kothapet', img: 'omni_kothapet.png'
    },
    {
      id: 2, location_name: 'Kukatpally', img: 'omni_kukatpally.png'
    },
    {
      id: 3, location_name: 'UDAI OMNI - Nampally', img: 'udai_omni.png'
    },
    {
      id: 4, location_name: 'Vizag', img: 'omni_vizag.png'
    },
    {
      id: 5, location_name: 'Giggles Vizag', img: 'giggles_vizag_building.png'
    },
    {
      id: 6, location_name: 'Kurnool', img: 'kurnool_location.png'
    }
  ]


  formData = {
    name: '',
    phone: '',
    email: ''
  };

  // Appointment Modal Form Data
  appointmentFormData = {
    fullName: '',
    phoneNumber: '',
    email: '',
    location: '',
    department: '',
    message: ''
  };

  isSubmitting = false;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private UsersService: UsersService,
    private videoStateService: VideoStateService,
    private titleService: Title,
    private metaService: Meta,
    private canonicalService: CanonicalService
    ,
    private notification: NotificationService
  ) { }

  private resizeListener: (() => void) | undefined;
  private lastWindowWidth: number = window.innerWidth;

  private setSEOTags(): void {
    this.titleService.setTitle('OMNI Hospitals - Best Multispecialty Hospital in Hyderabad | Expert Medical Care');
    this.metaService.updateTag({
      name: 'description',
      content: 'OMNI Hospitals - Leading multispecialty hospital in Hyderabad offering expert medical care across cardiology, orthopedics, neurology, and more. Book your appointment today.'
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'OMNI hospitals, multispecialty hospital Hyderabad, cardiology, orthopedics, neurology, nephrology, best hospital Hyderabad, medical care Andhra Pradesh, Telangana'
    });
    this.canonicalService.setCanonicalUrl('/');
  }

  ngOnInit(): void {
    // Set SEO meta tags and canonical URL
    this.setSEOTags();

    // Stop any videos from other components when entering this component
    this.videoStateService.stopAllVideos();

    // Video states are managed by videoStateService, no local cleanup needed

    // Improved resize handling - distinguishes zoom from actual resize
    this.resizeListener = () => {
      this.handleResizeOrZoom();
    };
    window.addEventListener('resize', this.resizeListener);

    // Subscribe to video state changes
    this.videoSubscription = this.videoStateService.currentlyPlayingVideo$.subscribe(videoId => {
      this.updateVideoStates(videoId);
      this.cdr.markForCheck();
    });

    this.updateSlidesPerView();
    register();
  }


  ngAfterViewInit() {
    this.observeCounters();
    this.bannerImagesSlides();
    this.blogsSlide();
    this.owl();
    this.testowl();
    setTimeout(() => {
      this.initSwiper();
      this.cdr.markForCheck();
    }, 100);
  }


  ourSpecialities(index: any) {
    if (index === 1) {
      // Navigate to key-surgeries page
      this.router.navigate(['/key-surgeries']);
    } else {
      // Show Our Specialities section
      this.active_button = index;
      this.cdr.markForCheck();
    }
  }

  animateCounter(element: HTMLElement, target: number) {
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 20);

    function updateCounter() {
      start += step;
      if (start >= target) {
        element.innerText = target.toString() + '+';
      } else {
        element.innerText = Math.ceil(start).toString() + '+';
        requestAnimationFrame(updateCounter);
      }
    }
    updateCounter();
  }

  observeCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const target = parseInt(element.getAttribute('data-target') || '0', 10);
          this.animateCounter(element, target);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(counter => observer.observe(counter));
  }




  ourDoctorsDetails() {
    this.router.navigate(['/our-doctors']).then(success => {
      if (success) {
        console.log('Navigation to OurDoctorsComponent successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }
  healthCheckup() {
    this.router.navigate(['/health-checkup']).then(success => {
      if (success) {
        console.log('Navigation to Health Checkup successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }


  openSecondOpinion() {
    this.router.navigate(['/get-a-second-opinion']).then(success => {
      if (success) {
        console.log('Navigation to Second Opinion successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }


  goToBlogSlide(index: number) {
    this.currentBlogIndex = index;
    $(this.blogCarousel.nativeElement).trigger('to.owl.carousel', [index, 300]);
  }

  updateSlidesPerView(): void {
    const screenWidth = window.innerWidth;
    this.isMobile = screenWidth < 768;
    if (screenWidth < 768) {
      this.slidesPerView = 1;
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 4;
    }
  }

  private handleResizeOrZoom(): void {
    const currentWidth = window.innerWidth;

    // Check if it's a significant width change - actual resize
    if (Math.abs(currentWidth - this.lastWindowWidth) > 50) {
      // Significant width change - actual resize
      this.lastWindowWidth = currentWidth;
      this.videoStateService.stopAllVideos();
      this.updateSlidesPerView();
      this.cdr.markForCheck();
    }
    // Small changes are ignored to prevent unnecessary video stops
  }


  goToDetails(speciality: string) {
    const urlFriendlyName = toUrlFriendly(speciality);
    // Navigate to new URL format (without location defaults to showing all)
    this.router.navigate(['/specialities', urlFriendlyName]);
  }

  onClickTechno(technology: string) {
    this.router.navigate(['/technologies-details'], {
      queryParams: {
        selected_tech: technology
      }
    });
  }

  goToBlogDetails(blog_name: any) {
    this.router.navigate(['/blogs-details-data'], {
      queryParams: {
        blog_name: blog_name
      }
    });
  }

  initSwiper(reset: boolean = false) {
    const swiperEl: any = this.swiperContainer?.nativeElement;
    if (swiperEl && swiperEl.swiper) {
      const swiper = swiperEl.swiper;
      if (reset) swiper.slideTo(0, 0);
      this.updateArrowStates(swiper);
      swiper.update();
    }
  }

  swiperPrev() {
    const swiper = this.swiperContainer.nativeElement.swiper;
    swiper.slidePrev();
    this.updateArrowStates(swiper);
  }

  swiperNext() {
    const swiper = this.swiperContainer.nativeElement.swiper;
    swiper.slideNext();
    this.updateArrowStates(swiper);
  }

  updateArrowStates(swiper: any) {
    this.canSlidePrev = !swiper.isBeginning;
    this.canSlideNext = !swiper.isEnd;
    this.cdr.markForCheck();
  }

  bannerImagesSlides() {
    $('.banner-slider').owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      items: 1,
      responsive: {
        0: { items: 1 },
        768: { items: 1 },
        992: { items: 1 }
      }
    });
  }


  owl(): void {
    const owl = $(this.owlCarousel.nativeElement);
    this.owlInstance = owl.owlCarousel({
      loop: false, // Disabled loop to prevent double video issue during zoom
      margin: 20,
      nav: false,
      dots: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 1 }
      }
    });
  }


  testowl() {
    const owl = $(this.patientowlCarousel.nativeElement);
    $(this.patientowlCarousel.nativeElement).owlCarousel({
      loop: true,
      margin: 20,
      nav: false,
      dots: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 2 },
        1200: { items: 2 },
        1400: { items: 3 }
      }
    });
  }

  blogsSlide() {
    const blogs = $(this.blogCarousel.nativeElement);
    blogs.owlCarousel({
      loop: true,
      margin: 15,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });

    blogs.on('changed.owl.carousel', (event: any) => {
      let realIndex = event.item.index - event.relatedTarget._clones.length / 2;
      this.currentBlogIndex = (realIndex + this.totalBlogSlides) % this.totalBlogSlides;
    });
  }

  // Removed onVideoPlay method - using videoStateService instead


  trackByTestimonial(index: number, testimonial: any): string {
    return testimonial.name + testimonial.videoUrl;
  }

  trackByUserTestimonial(index: number, testimonial: any): string {
    return testimonial.name + testimonial.location;
  }

  trackBySpeciality(index: number, item: any): any {
    return item.dep_name;
  }

  trackByBlog(index: number, blog: any): string {
    return blog.title;
  }

  trackByTech(index: number, tech: any): number {
    return tech.id;
  }

  trackByWhyChoose(index: number, item: any): string {
    return item.title;
  }

  trackByAward(index: number, award: any): string {
    return award.img;
  }

  trackByLocation(index: number, location: any): number {
    return location.id;
  }

  trackByFaq(index: number, faq: any): number {
    return index;
  }

  routeToLocation(location: string, selected_image: string) {
    const modalElement = document.getElementById('locationModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    setTimeout(() => {
      // Convert location name to URL-friendly format
      const urlFriendlyName = location
        .toLowerCase()
        .replace(/&/g, 'and')  // Replace & with 'and'
        .replace(/\s+/g, '-')   // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      this.router.navigate(['/locations', urlFriendlyName]);
    }, 300);
  }
  goToFixedSurgical() {
    this.router.navigate(['/fixed-surgical-packages']).then(success => {
      if (success) {
        console.log('Navigation to technologies successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

  goToSpecialities() {
    this.router.navigate(['/specialities']).then(success => {
      if (success) {
        console.log('Navigation to technologies successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }


  toggleFaq(index: number) {
    this.faqs.forEach((faq, i) => faq.expanded = i === index ? !faq.expanded : false);
    this.cdr.markForCheck();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      this.notification.info('Please fill the required fields correctly.');
      this.cdr.markForCheck();
      return;
    }

    // Validate phone number (must be 10 digits)
    const phone = (this.formData.phone || '').toString().trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      this.notification.info('Please enter a valid 10 digit phone number.');
      return;
    }

    // Check for duplicate submission
    const lastSubmission = localStorage.getItem('homeContactLastSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      const now = Date.now();
      if (
        name === (this.formData.name || '').trim() &&
        phone === (this.formData.phone || '').trim() &&
        now - time < thirtyMinutes
      ) {
        this.notification.info('You already submitted this enquiry within the last 30 minutes.');
        return;
      }
    }

    const payload = [
      { Attribute: 'FirstName', Value: this.formData.name },
      { Attribute: 'Phone', Value: this.formData.phone },
      { Attribute: 'EmailAddress', Value: this.formData.email },
      { Attribute: 'Source', Value: 'Website - Website - Home Contact Form' }
    ];

    // LeadSquared API call (matching working pages)
    const url = `${environment.leadsquared.baseUrl}LeadManagement.svc/Lead.Capture?accessKey=${environment.leadsquared.accessKey}&secretKey=${environment.leadsquared.secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } }).subscribe({
      next: () => {
        // alert('Your enquiry has been submitted successfully!');
        localStorage.setItem('homeContactLastSubmission', JSON.stringify({
          name: (this.formData.name || '').trim(),
          phone: (this.formData.phone || '').trim(),
          time: Date.now()
        }));
        this.formData = { name: '', phone: '', email: '' } as any;
        this.cdr.markForCheck();
        this.router.navigate(['/thank-you']);
      },
      error: (err) => {
        console.error('LeadSquared Error:', err);
        this.notification.error('There was a problem submitting your enquiry.');
      }
    });
  }

  onSubmitAppointment(event: Event, form?: NgForm) {
    event.preventDefault();

    if (this.isSubmitting) return;

    // Use Angular's form validation
    if (form?.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      this.notification.info('Please fill the required fields correctly.');
      this.cdr.markForCheck();
      return;
    }

    // Validate phone number (must be 10 digits)
    const phone = (this.appointmentFormData.phoneNumber || '').toString().trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      this.notification.info('Please enter a valid 10 digit phone number.');
      return;
    }

    // Prevent duplicate submission for 30 minutes
    const lastSubmission = localStorage.getItem('appointmentLastSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      if (
        name === this.appointmentFormData.fullName.trim() &&
        phone === this.appointmentFormData.phoneNumber.trim() &&
        Date.now() - time < thirtyMinutes
      ) {
        this.notification.info('You have already submitted an appointment request with this name and phone number in the last 30 minutes.');
        return;
      }
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload = [
      { Attribute: "FirstName", Value: this.appointmentFormData.fullName },
      { Attribute: "Phone", Value: this.appointmentFormData.phoneNumber },
      { Attribute: "EmailAddress", Value: this.appointmentFormData.email },
      { Attribute: "mx_City", Value: this.appointmentFormData.location },
      { Attribute: "mx_Department", Value: this.appointmentFormData.department },
      { Attribute: "mx_Comments", Value: this.appointmentFormData.message },
      { Attribute: "Source", Value: "Website - Home Appointment Modal" }
    ];

    // LeadSquared API call (matching working pages)
    const url = `${environment.leadsquared.baseUrl}LeadManagement.svc/Lead.Capture?accessKey=${environment.leadsquared.accessKey}&secretKey=${environment.leadsquared.secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } }).subscribe({
      next: (res) => {
        console.log('LeadSquared Success:', res);
        // alert('Your appointment request has been submitted successfully!');

        // Save last submission info for 30-minute check
        localStorage.setItem('appointmentLastSubmission', JSON.stringify({
          name: this.appointmentFormData.fullName.trim(),
          phone: this.appointmentFormData.phoneNumber.trim(),
          time: Date.now()
        }));

        // Reset form
        this.appointmentFormData = {
          fullName: '',
          phoneNumber: '',
          email: '',
          location: '',
          department: '',
          message: ''
        };

        this.isSubmitting = false;

        // Close modal
        const modalElement = document.getElementById('appointmentModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }

        this.router.navigate(['/thank-you']);
      },
      error: (err) => {
        console.error('LeadSquared Error:', err);
        this.notification.error('There was a problem submitting your appointment request.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}