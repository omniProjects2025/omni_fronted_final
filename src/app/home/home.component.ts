import { Component, ViewChild, ElementRef, Renderer2, HostListener, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
register();
declare var $: any;

import 'owl.carousel';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersService } from '../users.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('owlCarousel', { static: false }) owlCarousel!: ElementRef;
  @ViewChild('patientowlCarousel', { static: false }) patientowlCarousel!: ElementRef;
  @ViewChild('blogCarousel', { static: false }) blogCarousel!: ElementRef;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  readMoreVisible = false;
  banner_one_text = 'Best Multispeciality Hospitals in Andhra Pradesh, Telangana';
  carouselInitialized = false;
  spanizedHeading: string[] = [];
  spanizedParagraph: string[] = [];
  showFullText = false;

  videoPlayed: boolean = false;
  sanitizedVideoUrl!: SafeResourceUrl;

  private swiperInitialized = false;
  active_button = 0;
  isMobile = false;
  title = 'Omni_project';
  activeIndex = 0;
  direction_icon: boolean = false;
  depertment_icon: boolean = false;
  showMore: boolean = false;
  showmoreactive_one: boolean = false;
  startIndex = 0;
  currentIndex = 0;
  currentBlogIndex = 0;
  totalItems: number = 0;
  prevBtn!: HTMLElement | null;
  nextBtn!: HTMLElement | null;
  carousel!: HTMLElement | null;
  slidesPerView = 3;

  breakpointsJson = JSON.stringify({
    0: { slidesPerView: 1.1 },
    480: { slidesPerView: 1.5 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  });

  canSlidePrev = false;
  canSlideNext = true;
  swiperInstance: any;
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
      id: 7, dep_name: 'Nephrology & Urology', img: "assets/our_specialities_new/Nephrology_Urology.svg"
    },
    { id: 8, dep_name: 'Obstetrics & Gynaecology', img: "assets/our_specialities_new/Gynaecology.svg" },
    { id: 9, dep_name: 'Paediatrics', img: "assets/our_specialities_new/Paediatrics.svg" },
    { id: 10, dep_name: 'Pulmonology', img: "assets/our_specialities_new/Pulmonology.svg" },
    { id: 11, dep_name: 'Psychiatry', img: "assets/our_specialities_new/Psychiatry.svg" },
    { id: 12, dep_name: 'Orthopedics & Sports Medicine', img: "assets/our_specialities_new/Orthopedic.svg" },
    {
      id: 13, dep_name: 'Vascular Surgery', img: "assets/our_specialities_new/vascular.svg"
    }
  ]

  awards = [
    { img: 'assets/images/awards/award1.png' },
    { img: 'assets/images/awards/award2.png' },
    { img: 'assets/images/awards/award3.png' },
    { img: 'assets/images/awards/award4.png' },
    { img: 'assets/images/awards/award5.png' },
    { img: 'assets/images/awards/award6.png' }
  ];

  selectedIndex: number = 0;
  counters = [
    { id: 1, img: 'why_choose_hospitals.svg', label: 'Hospitals', target: 6, value: 0 },
    { id: 2, img: 'hospital_beds.svg', label: 'Beds', target: 1200, value: 0 },
    { id: 3, img: 'why_choose_doctors.svg', label: 'Doctors', target: 200, value: 0 },
    { id: 4, img: 'pharmacy.svg', label: 'Pharmacy', target: 6, value: 0 }
  ];
  shortText = 'OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care.';
  fullText = 'OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care. Omni hospitals is Owned by the healthcare division of incor group. OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care. Omni hospitals is Owned by the healthcare division of incor group.';

  why_choose_omni = [
    { title: 'Hospitals', value: '6+', img: 'assets/icons/hospitals.svg' },
    { title: 'Beds', value: '750+', img: 'assets/icons/beds.svg' },
    { title: 'Doctors', value: '450+', img: 'assets/icons/doctors.svg' },
    { title: 'Pharmacies', value: '10+', img: 'assets/icons/pharmacies.svg' }
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


  hoveredCard = '';

  testimonials = [
    {
      name: "Kanakamma",
      text: "Rapid Recovery After Total Knee Replacement (TKR) Surgery by Dr. Ranjith",
      date: "Jun 5, 2025",
      videoPlayed: false,
      thumbnailUrl: 'pSc6uKMEBo8',
      videoUrl: "https://youtu.be/pSc6uKMEBo8?si=WWYcawWnMmSgiNHN"
    },
    {
      name: "Vijaya Laxmi",
      text: "Miraculous Recovery After Total Knee Replacement Surgery",
      date: "May 3, 2025",
      videoPlayed: false,
      thumbnailUrl: 'bxB3DoF2oYM',
      videoUrl: "https://youtu.be/bxB3DoF2oYM?si=iBRTW5Sfxp1aEGrd"
    },
    {
      name: "Koteshwar Rao",
      text: "This platform helped me a lot in my career growth. The services provided are top-notch...",
      date: "Apr 15, 2025",
      videoPlayed: false,
      thumbnailUrl: 'dwNxv9xVl08',
      videoUrl: "https://youtu.be/dwNxv9xVl08?si=X4qBKD_7aJfQKxQG"
    },
    {
      name: "Diva Prasad",
      text: " From Near Death to Recovery | A Story of Hope and Healing",
      date: "Apr 12, 2025",
      videoPlayed: false,
      thumbnailUrl: 'CM_y3X06Nkc',
      videoUrl: " https://youtu.be/CM_y3X06Nkc?si=83cR8ryQYPfB8Qd-"
    },
    {
      name: "Ranjith Kumar Yadav",
      text: " A Remarkable Accident Recovery",
      date: "Oct 24, 2024",
      videoPlayed: false,
      thumbnailUrl: 'wuR_fkYqn2o',
      videoUrl: " https://youtu.be/wuR_fkYqn2o?si=3eHUMIi5A-fc7Wkj"
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

  totalBlogSlides = this.blogs.length;
  groupedTestimonials: any[][] = [];
  totalSlides = this.testimonials.length;

  omni_mail_id = 'info@omnihospitals.in'

  depertments = [
    {
      id: 1, d_name: 'What is Lorem Ipsum?', d_description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", img: 'https://img.freepik.com/free-photo/men-with-protection-masks-visiting-hospital-clinic-checking-appointment-respecting-social-distance-waiting-room-global-pandemic_482257-2002.jpg?ga=GA1.1.900482830.1739181171&semt=ais_hybrid'
    },
    {
      id: 2, d_name: 'What is Lorem Ipsum?', d_description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", img: 'https://img.freepik.com/free-photo/men-with-protection-masks-visiting-hospital-clinic-checking-appointment-respecting-social-distance-waiting-room-global-pandemic_482257-2002.jpg?ga=GA1.1.900482830.1739181171&semt=ais_hybrid'
    },
    {
      id: 3, d_name: 'What is Lorem Ipsum?', d_description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", img: 'https://img.freepik.com/free-photo/men-with-protection-masks-visiting-hospital-clinic-checking-appointment-respecting-social-distance-waiting-room-global-pandemic_482257-2002.jpg?ga=GA1.1.900482830.1739181171&semt=ais_hybrid'
    },
    {
      id: 4, d_name: 'What is Lorem Ipsum?', d_description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", img: 'https://img.freepik.com/free-photo/men-with-protection-masks-visiting-hospital-clinic-checking-appointment-respecting-social-distance-waiting-room-global-pandemic_482257-2002.jpg?ga=GA1.1.900482830.1739181171&semt=ais_hybrid'
    },
    {
      id: 5, d_name: 'What is Lorem Ipsum?', d_description: ' OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care. Omni hospitals is owned by the healthcare division of Incor group.', img: 'https://img.freepik.com/free-photo/men-with-protection-masks-visiting-hospital-clinic-checking-appointment-respecting-social-distance-waiting-room-global-pandemic_482257-2002.jpg?ga=GA1.1.900482830.1739181171&semt=ais_hybrid'
    },
    {
      id: 6, d_name: 'What is Lorem Ipsum?', d_description: ' OMNI hospitals was established with an intention of being a comprehensive & cost-effective chain of hospitals that provides super-specialty services with warmth and care. Omni hospitals is owned by the healthcare division of Incor group.', img: 'https://img.freepik.com/free-photo/men-with-protection-masks-visiting-hospital-clinic-checking-appointment-respecting-social-distance-waiting-room-global-pandemic_482257-2002.jpg?ga=GA1.1.900482830.1739181171&semt=ais_hybrid'
    }
  ]

  owlInstance: any;

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

  images = [
    { src: 'assets/owl1.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl2.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl3.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl4.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl4.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl4.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl4.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
    { src: 'assets/owl4.jpg', title: 'MRI', description: 'Lorem Ipsum is simply dummy text of the printing industry.' },
  ];

  slides = [
    {
      img: 'assets/mri1.jpg',
      title: 'MRI',
      desc: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy...',
    },
    {
      img: 'assets/mri2.jpg',
      title: 'MRI',
      desc: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy...',
    },
    {
      img: 'assets/mri3.jpg',
      title: 'MRI',
      desc: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy...',
    },
    {
      img: 'assets/mri4.jpg',
      title: 'MRI',
      desc: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy...',
    },
  ];
  index = 0;

  formData = {
    name: '',
    phone: '',
    email: ''
  };
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router: Router, private renderer: Renderer2, private cdr: ChangeDetectorRef, private UsersService: UsersService) {

  }

  ngOnInit(): void {
    this.spanizedHeading = this.banner_one_text.split('');
    this.onBackendIntigration()
    this.onUserDetails()
    this.getUsers();
    this.updateSlidesPerView();
    window.addEventListener('resize', this.updateSlidesPerView.bind(this));
    register();
  }

  async onBackendIntigration() {
    const data = {
      firstName: 'gp',
      lastName: 'chat',
      emailId: 'chat@gmail.com',
      password: 'bpoil@123',
      age: 25,
      phoneNumber: '123456789',
      gender: 'male',
    };
    try {
      const result1 = await firstValueFrom(
        this.http.post('http://localhost:3000/signup', data, {
          withCredentials: true
        })
      );
      console.log('API Success:', result1);
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  async onUserDetails() {
    try {
      const result2 = await firstValueFrom(
        this.http.get('http://localhost:3000/getusers', {
          withCredentials: true
        })
      );
      console.log('All users Success:', result2);
    } catch (error) {

    }
  }

  ngAfterViewInit() {
    this.observeCounters();
    this.bannerImagesSlides();
    this.blogsSlide();
    this.owl();
    this.testowl();
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeIndex']) {
      if (this.activeIndex === 2 && !this.swiperInitialized) {
        setTimeout(() => {
          this.initSwiper(true);
          this.swiperInitialized = true;
        }, 200);
      } else {
        this.swiperInitialized = false;
      }
    }
  }

  ngAfterViewChecked() {
    if (this.activeIndex === 2 && this.swiperContainer?.nativeElement?.swiper) {
      const swiper = this.swiperContainer.nativeElement.swiper;
      this.updateArrowStates(swiper);
    }

  }

  toggleReadMore(): void {
    this.showMore = !this.showMore;
  }
  ReadMore() {
    this.showmoreactive_one = !this.showmoreactive_one
  }
  ourSpecialities(index: any) {
    this.active_button = index;
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


  updateCarousel(direction: 'next' | 'prev') {
    if (direction === 'prev' && this.index > 0) {
      this.index--;
    } else if (direction === 'next' && this.index < this.depertments.length - 1) {
      this.index++;
    }
  }

  getTransform() {
    return `translateX(-${this.index * 100}%)`;
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
  locationToggle(num: number) {
    if (num == 1) {
      this.direction_icon = !this.direction_icon
    }
    else {
      this.depertment_icon = !this.depertment_icon
    }
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
    this.router.navigate(['/second-opinion']).then(success => {
      if (success) {
        console.log('Navigation to Second Opinion successful');
      } else {
        console.log('Navigation failed');
      }
    }).catch(error => console.error('Navigation error:', error));
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    $(this.owlCarousel.nativeElement).trigger('to.owl.carousel', [index, 300]);
  }

  goToBlogSlide(index: number) {
    this.currentBlogIndex = index;
    $(this.blogCarousel.nativeElement).trigger('to.owl.carousel', [index, 300]);
  }

  prev() {
    $('#owl-demo').trigger('prev.owl.carousel');
  }

  next() {
    $('#owl-demo').trigger('next.owl.carousel');
  }

  updateNavButtons() {
    const carousel = $('#owl-demo');
    $('#prevBtn').toggle(!carousel.find('.owl-item:first').hasClass('active'));
    $('#nextBtn').toggle(!carousel.find('.owl-item:last').hasClass('active'));
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


  goToDetails(speciality: string) {
    this.router.navigate(['/our-specialities-details'], {
      queryParams: {
        selected_speciality: speciality
      }
    });
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
    this.cdr.detectChanges();
  }

  bannerImagesSlides() {
    $('.banner-slider').owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
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

  onVideoPlay(index: number): void {
    // Stop carousel autoplay when video starts
    this.owlInstance.trigger('stop.owl.autoplay');
    
    // Stop all other videos when one starts playing
    this.testimonials.forEach((testimonial, idx) => {
      if (idx !== index) {
        testimonial.videoPlayed = false;
      }
    });
  }

  onVideoPauseOrEnd(index: number): void {
    // Resume carousel autoplay when video stops
    this.owlInstance.trigger('play.owl.autoplay', [3000]);
  }


  routeToLocation(location: string, selected_image: string) {
    const modalElement = document.getElementById('locationModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    setTimeout(() => {
      this.router.navigate(['/our-branches'], {
        queryParams: {
          selected_location: location,
          selected_image: selected_image
        }
      });
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

  getUsers() {
    this.UsersService.getAllUsers().subscribe(
      res => {
        console.log('All Users:', res);
      },
      err => {
        console.error('Error:', err);
      }
    );
  }


  toggleFaq(index: number) {
    this.faqs.forEach((faq, i) => faq.expanded = i === index ? !faq.expanded : false);
  }

  onSubmit(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((field: string) => form.controls[field].markAsTouched());
      return;
    }

    const lastSubmission = localStorage.getItem('homeContactLastSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      if (
        name === (this.formData.name || '').trim() &&
        phone === (this.formData.phone || '').trim() &&
        Date.now() - time < thirtyMinutes
      ) {
        alert('You already submitted this enquiry within the last 30 minutes.');
        return;
      }
    }

    const payload = [
      { Attribute: 'FirstName', Value: this.formData.name },
      { Attribute: 'Phone', Value: this.formData.phone },
      { Attribute: 'EmailAddress', Value: this.formData.email },
      { Attribute: 'Source', Value: 'Website - Home Contact Form' }
    ];

    const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
    const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
    const api_url_base = 'https://api-in21.leadsquared.com/v2/';
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } }).subscribe({
      next: () => {
        alert('Your enquiry has been submitted successfully!');
        localStorage.setItem('homeContactLastSubmission', JSON.stringify({
          name: (this.formData.name || '').trim(),
          phone: (this.formData.phone || '').trim(),
          time: Date.now()
        }));
        this.formData = { name: '', phone: '', email: '' } as any;
        this.router.navigate(['/thank-you']);
      },
      error: (err) => {
        console.error('LeadSquared Error:', err);
        alert('There was a problem submitting your enquiry.');
      }
    });
  }
}