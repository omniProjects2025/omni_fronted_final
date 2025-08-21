import { Component } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { OurSpecialitiesService } from '../our-specialities/our-specialities.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-our-specialities-details',
  templateUrl: './our-specialities-details.component.html',
  styleUrls: ['./our-specialities-details.component.css']
})
export class OurSpecialitiesDetailsComponent {
  specialties: any[] = [];
  selectedDepartment: any = {};
  selected_dep: string = '';
  departmentName: string = '';
  enquiry = {
    fullName: '',
    phoneNumber: '',
    emailId: ''
  };
  locations = [
    { id: 'kukkatpally', name: 'Kukkatpally' },
    { id: 'Nampally', name: 'UDAI OMNI - Nampally' },
    { id: 'kothapet', name: 'Kothapet' },
    { id: 'vizag', name: 'Vizag' },
    { id: 'Giggles-vizag', name: 'Giggles Vizag' },
    { id: 'kurnool', name: 'Kurnool' }
  ];
  doctors = [
    // Cardiology
    { name: 'Dr Pramod Kumar Rao', designation: 'Sr. Consultant - Cardiology', department: 'Cardiology', image: 'assets/images/cardiology_doctor.png', location: 'kukkatpally' },
    { name: 'Dr Anjali Mehra', designation: 'Consultant - Cardiology', department: 'Cardiology', image: 'assets/images/cardiology_doctor.png', location: 'Nampally' },
    { name: 'Dr Ravi Sharma', designation: 'Sr. Consultant - Cardiology', department: 'Cardiology', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },
    { name: 'Dr Sunita Reddy', designation: 'Cardiologist', department: 'Cardiology', image: 'assets/images/cardiology_doctor.png', location: 'kurnool' },
    { name: 'Dr Rajeev Menon', designation: 'Sr. Consultant - Cardiology', department: 'Cardiology', image: 'assets/images/cardiology_doctor.png', location: 'Giggles-vizag' },
    { name: 'Dr Ayesha Khan', designation: 'Cardiologist', department: 'Cardiology', image: 'assets/images/cardiology_doctor.png', location: 'kothapet' },

    // ENT
    { name: 'Dr Sandeep Roy', designation: 'ENT Surgeon', department: 'ENT', image: 'assets/images/cardiology_doctor.png', location: 'kukkatpally' },
    { name: 'Dr Pooja Iyer', designation: 'Consultant - ENT', department: 'ENT', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },
    { name: 'Dr Nishant Rao', designation: 'Sr. ENT Specialist', department: 'ENT', image: 'assets/images/cardiology_doctor.png', location: 'Nampally' },

    // General Medicine
    { name: 'Dr Veena Desai', designation: 'General Physician', department: 'General Medicine', image: 'assets/images/cardiology_doctor.png', location: 'kothapet' },
    { name: 'Dr Mahesh Rathi', designation: 'Sr. Consultant - General Medicine', department: 'General Medicine', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },
    { name: 'Dr Lakshmi Rao', designation: 'Consultant - General Medicine', department: 'General Medicine', image: 'assets/images/cardiology_doctor.png', location: 'kurnool' },

    // General Surgery
    { name: 'Dr Amit Bhargava', designation: 'General Surgeon', department: 'General Surgery', image: 'assets/images/cardiology_doctor.png', location: 'Giggles-vizag' },
    { name: 'Dr Neelima Sharma', designation: 'Sr. Consultant - General Surgery', department: 'General Surgery', image: 'assets/images/cardiology_doctor.png', location: 'Nampally' },

    // Gastroenterology
    { name: 'Dr Farhan Qureshi', designation: 'Gastroenterologist', department: 'Gastroenterology', image: 'assets/images/cardiology_doctor.png', location: 'kukkatpally' },
    { name: 'Dr Sheetal Agarwal', designation: 'Sr. Consultant - Gastroenterology', department: 'Gastroenterology', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },

    // Neurology
    { name: 'Dr Kavitha Menon', designation: 'Neurologist', department: 'Neurology', image: 'assets/images/cardiology_doctor.png', location: 'kothapet' },
    { name: 'Dr Ramesh Chandra', designation: 'Sr. Consultant - Neurology', department: 'Neurology', image: 'assets/images/cardiology_doctor.png', location: 'kurnool' },

    // Nephrology & Urology
    { name: 'Dr Sanjay Naik', designation: 'Urologist', department: 'Nephrology & Urology', image: 'assets/images/cardiology_doctor.png', location: 'kukkatpally' },
    { name: 'Dr Aruna Patil', designation: 'Nephrologist', department: 'Nephrology & Urology', image: 'assets/images/cardiology_doctor.png', location: 'Nampally' },

    // Obstetrics & Gynaecology
    { name: 'Dr Swathi Rao', designation: 'Gynaecologist', department: 'Obstetrics & Gynaecology', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },
    { name: 'Dr Meera Shah', designation: 'Consultant - Obstetrics', department: 'Obstetrics & Gynaecology', image: 'assets/images/cardiology_doctor.png', location: 'Giggles-vizag' },

    // Paediatrics
    { name: 'Dr Rekha Iyer', designation: 'Child Specialist', department: 'Paediatrics', image: 'assets/images/cardiology_doctor.png', location: 'kothapet' },
    { name: 'Dr Joseph Mathew', designation: 'Sr. Consultant - Paediatrics', department: 'Paediatrics', image: 'assets/images/cardiology_doctor.png', location: 'kukkatpally' },

    // Pulmonology
    { name: 'Dr Niharika Das', designation: 'Pulmonologist', department: 'Pulmonology', image: 'assets/images/cardiology_doctor.png', location: 'kurnool' },
    { name: 'Dr Vijay Singh', designation: 'Consultant - Pulmonology', department: 'Pulmonology', image: 'assets/images/cardiology_doctor.png', location: 'Nampally' },

    // Psychiatry
    { name: 'Dr Shruti Kaur', designation: 'Psychiatrist', department: 'Psychiatry', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },
    { name: 'Dr Rohit Das', designation: 'Sr. Consultant - Psychiatry', department: 'Psychiatry', image: 'assets/images/cardiology_doctor.png', location: 'kothapet' },

    // Orthopaedics & Sports Medicine
    { name: 'Dr Ashok Verma', designation: 'Orthopaedic Surgeon', department: 'Osthopaedics & Sports Medicine', image: 'assets/images/cardiology_doctor.png', location: 'kukkatpally' },
    { name: 'Dr Sneha Menon', designation: 'Consultant - Sports Medicine', department: 'Osthopaedics & Sports Medicine', image: 'assets/images/cardiology_doctor.png', location: 'Giggles-vizag' },

    // Vascular Surgery
    { name: 'Dr Mohit Chawla', designation: 'Vascular Surgeon', department: 'Vascular Surgery', image: 'assets/images/cardiology_doctor.png', location: 'vizag' },
    { name: 'Dr Nisha Rao', designation: 'Consultant - Vascular Surgery', department: 'Vascular Surgery', image: 'assets/images/cardiology_doctor.png', location: 'Nampally' }
  ];


  searchName = '';
  selectedLocation = '';
  filteredDoctors = [...this.doctors];
  // Active content driven by pretty URL (dept/item)
  activeTitle: string = '';
  activeContent: string = '';

  // Map from slug to department name and optional item descriptions
  private deptSlugToName: Record<string, string> = {
    'emergency-critical-care': 'Emergency & Critical Care',
    'orthopaedics': 'Osthopaedics & Sports Medicine',
    'obstetrics-gynaecology': 'Obstetrics & Gynaecology',
    'physiotherapy': 'Physiotherapy',
    'paediatrics': 'Paediatrics',
    'neonatology': 'Neonatology',
    'cardiology': 'Cardiology',
    'pulmonology': 'Pulmonology',
    'vascular-surgery': 'Vascular Surgery',
    'gastroenterology': 'Gastroenterology',
    'nephrology': 'Nephrology & Urology',
    'urology': 'Nephrology & Urology',
    'neurology': 'Neurology',
    'general-surgery': 'General Surgery',
    'spine-surgery': 'Spine Surgery',
    'ent': 'ENT',
    'general-medicine': 'General Medicine',
    'diabetes-endocrinology': 'Diabetes and Endocrinology',
    'dermatology': 'Dermatology',
    'cosmetology': 'Cosmetology',
    'maxillofacial-surgery': 'Maxillofacial Surgery',
    'psychiatry': 'Psychiatry',
    'neurosurgery': 'Neuro Surgery',
    'oncology': 'Oncology'
  };

  // Reverse map for name -> slug (case-insensitive compare when looking up)
  private nameToDeptSlug: Record<string, string> = Object.entries(this.deptSlugToName).reduce((acc: Record<string, string>, [slug, name]) => {
    acc[name.toLowerCase()] = slug;
    return acc;
  }, {});

  private itemSlugToContent: Record<string, string> = {
    // Physiotherapy examples
    'ultrasonic-therapy': 'Ultrasonic Therapy uses ultrasound waves to promote healing, reduce inflammation, and relieve pain. Typical sessions last 5–10 minutes on the affected area.',
    'laser-therapy': 'Laser Therapy delivers low-level laser light to reduce pain and inflammation and accelerate tissue repair.',
    'cryotherapy': 'Cryotherapy applies cold to decrease pain, swelling, and muscle spasm in acute injuries.',
    // Cardiology examples
    'angioplasty': 'Angioplasty is a procedure to open narrowed or blocked coronary arteries and restore blood flow to the heart.',
    'pacemaker': 'Pacemaker implantation helps maintain adequate heart rhythm in bradyarrhythmias.',
    // Orthopaedics examples
    'knee-osteoarthritis': 'Comprehensive management of knee osteoarthritis including conservative and surgical options.',
    'acl-reconstruction': 'ACL reconstruction restores knee stability after ligament rupture using arthroscopic techniques.',
  };

  subDepartments: Array<{ title: string; slug: string; wpUrl: string; summary: string } > = [];
  activeItemSlug: string = '';
  activeWpUrl: string = '';

  // Map department slug -> sub-departments (with wordpress URLs)
  private subDeptMap: Record<string, Array<{ title: string; slug: string; wpUrl: string; summary: string }>> = {
    'orthopaedics': [
      { title: 'Knee Osteoarthritis', slug: 'knee-osteoarthritis', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/knee-osteoarthritis/', summary: 'Evaluation and management of degenerative knee joint pain and stiffness.' },
      { title: 'Sciatica', slug: 'sciatica', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/sciatica/', summary: 'Diagnosis and treatment of radiating leg pain from lumbar nerve compression.' },
      { title: 'Arthritis of the hip', slug: 'arthritis-of-the-hip', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/arthritis-of-the-hip/', summary: 'Comprehensive care for hip osteoarthritis and inflammatory arthritis.' },
      { title: 'Polytrauma', slug: 'polytrauma', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/polytrauma/', summary: 'Coordinated management of multiple traumatic injuries.' },
      { title: 'ACL Reconstruction', slug: 'acl-reconstruction', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/acl-reconstruction/', summary: 'Arthroscopic reconstruction to restore knee stability after ACL tear.' },
      { title: 'Arthroscopy', slug: 'arthroscopy', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/arthroscopy/', summary: 'Minimally invasive joint procedures for diagnosis and treatment.' },
      { title: 'Hip Replacement', slug: 'hip-replacement', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/hip-replacement-surgery/', summary: 'Total or partial hip arthroplasty for end-stage hip disease.' },
      { title: 'Knee Replacement', slug: 'knee-replacement', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/knee-replacement/', summary: 'Knee arthroplasty to relieve pain and improve function.' },
      { title: 'Sports Injury', slug: 'sports-injury', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/sports-injury/', summary: 'Injury prevention, diagnosis and treatment for athletes.' },
      { title: 'Robotic Joint Replacement Surgeries', slug: 'robotic-joint-replacement-surgeries', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/robotic-joint-replacement-surgeries/', summary: 'Robot-assisted precision joint replacement.' },
      { title: 'Cuff repair', slug: 'cuff-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/cuff-repair/', summary: 'Rotator cuff repair to restore shoulder strength and function.' },
      { title: 'Bankarts repair', slug: 'bankarts-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/bankart-repair/', summary: 'Surgical stabilization for recurrent shoulder dislocation.' },
      { title: 'Subacromial decompression', slug: 'subacromial-decompression', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/subacromial-decompression/', summary: 'Relief of shoulder impingement symptoms.' },
      { title: 'Bicep tenotomy', slug: 'bicep-tenotomy', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/biceps-tenotomy/', summary: 'Procedure for biceps tendon-related shoulder pain.' },
      { title: 'SLAP repair', slug: 'slap-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/slap-repair/', summary: 'Repair of superior labrum anterior-posterior tears.' },
      { title: 'Subacromial decompression for adhesive capsulitis', slug: 'subacromial-decompression-adhesive-capsulitis', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/subacromial-decompression-for-adhesive-capsulitis-frozen-shoulder/', summary: 'Procedure for frozen shoulder with impingement.' },
      { title: 'Anterior Cruciate Ligament(ACL)', slug: 'anterior-cruciate-ligament-acl', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/anterior-cruciate-ligament-acl/', summary: 'ACL injury evaluation and treatment options.' },
      { title: 'Posterior Cruciate Ligament(PCL)', slug: 'posterior-cruciate-ligament-pcl', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/posterior-cruciate-ligament-pcl/', summary: 'PCL injury care and reconstruction.' },
      { title: 'Medial Collateral Ligament Repair', slug: 'medial-collateral-ligament-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/medial-collateral-ligament-repair/', summary: 'Stabilization of MCL injuries.' },
      { title: 'Lateral Collateral Ligament Repair', slug: 'lateral-collateral-ligament-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/lateral-collateral-ligament-lcl-repair/', summary: 'Treatment for LCL instability.' },
      { title: 'Posterior Lateral Corner Repair', slug: 'posterior-lateral-corner-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/posterolateral-corner-repair/', summary: 'PLC complex reconstruction for knee stability.' },
      { title: 'Meniscal Repair', slug: 'meniscal-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/meniscal-repair/', summary: 'Meniscus-preserving techniques for tears.' },
      { title: 'Meniscal Repair vs Meniscectomy', slug: 'meniscal-repair-vs-meniscectomy', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/meniscal-repair-vs-meniscectomy/', summary: 'Decision-making between repair and removal.' },
      { title: 'Medial Patellofemoral Ligament Repair', slug: 'medial-patellofemoral-ligament-repair', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/medial-patellofemoral-ligament-repair/', summary: 'MPFL reconstruction for patellar instability.' },
      { title: 'Triceps Insertional Tendinitis', slug: 'triceps-insertional-tendinitis', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/triceps-insertional-tendinitis/', summary: 'Care for elbow extensor tendon pain.' },
      { title: 'Golfer Elbow', slug: 'golfers-elbow', wpUrl: 'https://omnihospitals.in/our-departments/orthopaedics/golfers-elbow/', summary: 'Medial epicondylitis management.' },
    ],
    'obstetrics-gynaecology': [
      { title: 'IVF', slug: 'ivf', wpUrl: 'https://omnihospitals.in/our-departments/obstetrics-gynaecology/ivf/', summary: 'Assisted reproductive technology for infertility.' },
      { title: 'High Risk Pregnancy', slug: 'high-risk-pregnancy', wpUrl: 'https://omnihospitals.in/our-departments/obstetrics-gynaecology/high-risk-pregnancy/', summary: 'Specialized care for high-risk pregnancies.' },
      { title: 'Hysterectomy', slug: 'hysterectomy', wpUrl: 'https://omnihospitals.in/our-departments/obstetrics-gynaecology/hysterectomy/', summary: 'Surgical removal of the uterus for various conditions.' },
      { title: 'Colporrhaphy', slug: 'colporrhaphy', wpUrl: 'https://omnihospitals.in/our-departments/obstetrics-gynaecology/colporrhaphy/', summary: 'Pelvic floor repair for prolapse.' },
      { title: 'Ovarian Cysts', slug: 'ovarian-cysts', wpUrl: 'https://omnihospitals.in/our-departments/obstetrics-gynaecology/ovarian-cysts/', summary: 'Evaluation and management of ovarian cysts.' },
    ],
    'physiotherapy': [
      { title: 'Advanced Pain Relief Therapies', slug: 'advanced-pain-relief-therapies', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/advanced-pain-relief-therapies/', summary: 'Multimodal therapies tailored for pain relief.' },
      { title: 'Combination Therapy', slug: 'combination-therapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/combination-therapy/', summary: 'Combined modalities for improved outcomes.' },
      { title: 'Cryotherapy', slug: 'cryotherapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/cryotherapy/', summary: 'Cold therapy to reduce pain and swelling.' },
      { title: 'Thermo Therapy', slug: 'thermo-therapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/thermo-therapy/', summary: 'Heat therapy to relax muscles and improve blood flow.' },
      { title: 'Ultrasonic Therapy', slug: 'ultrasonic-therapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/ultrasonic-therapy/', summary: 'Sound waves to accelerate healing and reduce pain.' },
      { title: 'Laser Therapy', slug: 'laser-therapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/laser-therapy/', summary: 'Low-level laser for tissue repair and pain reduction.' },
      { title: 'Dry Kneedling', slug: 'dry-needling', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/dry-needling/', summary: 'Trigger point therapy using fine needles.' },
      { title: 'Cupping Therapy', slug: 'cupping-therapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/cupping-therapy/', summary: 'Negative pressure therapy for pain and tightness.' },
      { title: 'Tapping Therapy', slug: 'tapping-therapy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/tapping-therapy/', summary: 'Kinesio taping for support and pain relief.' },
      { title: 'Chiropractic', slug: 'chiropractic', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/chiropractic/', summary: 'Manual adjustments for joint alignment.' },
      { title: 'Joint mobilization', slug: 'joint-mobilization', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/joint-mobilisation/', summary: 'Graded joint techniques to restore range of motion.' },
      { title: 'Soft tissue mobilization', slug: 'soft-tissue-mobilization', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/soft-tissue-mobilisation/', summary: 'Manual therapy for muscle and fascia.' },
      { title: 'Stroke Rehabilitation', slug: 'stroke-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/stroke-rehabilitation/', summary: 'Neuro-rehab to regain function after stroke.' },
      { title: "Parkinson's Rehabilitation", slug: 'parkinsons-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/parkinsons-rehabilitation/', summary: 'Movement training for Parkinson’s disease.' },
      { title: 'Spinal Cord injury Rehabilitation', slug: 'spinal-cord-injury-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/spinal-cord-injury-rehabilitation/', summary: 'Rehab programs after spinal cord injury.' },
      { title: 'Gullion Berry Syndrome', slug: 'guillain-barre-syndrome', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/guillain-barre-syndrome/', summary: 'Physiotherapy for GBS recovery.' },
      { title: 'TBI- Traumatic Brain Injury', slug: 'traumatic-brain-injury', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/traumatic-brain-injury/', summary: 'Cognitive and motor rehab after TBI.' },
      { title: 'Sports injury Rehabilitation', slug: 'sports-injury-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/sports-injury-rehabilitation/', summary: 'Return-to-sport protocols after injury.' },
      { title: 'Post Operation joint Rehabilitation', slug: 'post-operation-joint-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/post-operation-joint-rehabilitation/', summary: 'Structured post-op rehab plans for joints.' },
      { title: 'Injury Prevention Traning', slug: 'injury-prevention-training', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/injury-prevention-training/', summary: 'Movement screening and conditioning to prevent injuries.' },
      { title: 'Fitness and Weight management training', slug: 'fitness-weight-management-training', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/fitness-weight-management-training/', summary: 'Supervised programs for fitness and weight goals.' },
      { title: 'Post CABG Rehabilitation', slug: 'post-cabg-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/post-cabg-rehabilitation/', summary: 'Cardiac rehab after bypass surgery.' },
      { title: 'Myocardial Infraction', slug: 'myocardial-infarction', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/myocardial-infarction/', summary: 'Early mobilization and rehab after heart attack.' },
      { title: 'Post Heart Transplantation Rehab', slug: 'post-heart-transplantation-rehab', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/post-heart-transplantation-rehab/', summary: 'Tailored rehab for heart transplant recipients.' },
      { title: 'Post Heart failure Rehab', slug: 'post-heart-failure-rehab', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/post-heart-failure-rehab/', summary: 'Exercise-based program for heart failure.' },
      { title: 'Major Pulmonary Surgeries', slug: 'major-pulmonary-surgeries', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/major-pulmonary-surgeries/', summary: 'Respiratory physiotherapy post lung surgeries.' },
      { title: 'Development Delay', slug: 'development-delay', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/development-delay/', summary: 'Pediatric developmental therapy.' },
      { title: 'Cerebral Palsy', slug: 'cerebral-palsy', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/cerebral-palsy/', summary: 'Comprehensive CP rehabilitation.' },
      { title: 'Injury Rehabilition', slug: 'injury-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/injury-rehabilitation/', summary: 'Rehab for musculoskeletal injuries.' },
      { title: 'Geriatric Rehabilition', slug: 'geriatric-rehabilitation', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/geriatric-rehabilitation/', summary: 'Programs focused on older adults.' },
      { title: 'Musculo Skeletol Disorders', slug: 'musculoskeletal-disorders', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/musculoskeletal-disorders/', summary: 'Physiotherapy management of MSDs.' },
      { title: 'Balance and Gait Tranining', slug: 'balance-and-gait-training', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/balance-and-gait-training/', summary: 'Fall prevention and gait training.' },
      { title: 'Posture Correction', slug: 'posture-correction', wpUrl: 'https://omnihospitals.in/our-departments/physiotherapy/posture-correction/', summary: 'Ergonomics and posture re-education.' },
    ],
    'cardiology': [
      { title: 'Heart Failure', slug: 'heart-failure', wpUrl: 'https://omnihospitals.in/our-departments/cardiology/heart-failure/', summary: 'Diagnosis and management of heart failure.' },
      { title: 'Angiogram', slug: 'angiogram', wpUrl: 'https://omnihospitals.in/our-departments/cardiology/coronary-angiogram/', summary: 'Imaging test to visualize coronary arteries.' },
      { title: 'Angioplasty', slug: 'angioplasty', wpUrl: 'https://omnihospitals.in/our-departments/cardiology/angioplasty/', summary: 'Procedure to open narrowed arteries.' },
      { title: 'Pacemaker', slug: 'pacemaker', wpUrl: 'https://omnihospitals.in/our-departments/cardiology/permanent-pacemaker-implantation-ppi/', summary: 'Device to maintain heart rhythm.' },
    ],
    'pulmonology': [
      { title: 'Asthma', slug: 'asthma', wpUrl: 'https://omnihospitals.in/our-departments/pulmonology/asthma/', summary: 'Chronic airway inflammation care.' },
      { title: 'Pneumonia', slug: 'pneumonia', wpUrl: 'https://omnihospitals.in/our-departments/pulmonology/pneumonia/', summary: 'Infection of the lungs treatment.' },
      { title: 'Snoring', slug: 'snoring', wpUrl: 'https://omnihospitals.in/our-departments/pulmonology/snoring/', summary: 'Assessment and treatment for snoring.' },
      { title: 'Sleep Apnea Treatment', slug: 'sleep-apnea-treatment', wpUrl: 'https://omnihospitals.in/our-departments/pulmonology/sleep-apnea-treatment/', summary: 'OSA screening and therapy.' },
      { title: 'Respiratory Treatment', slug: 'respiratory-treatment', wpUrl: 'https://omnihospitals.in/our-departments/pulmonology/respiratory-diseases-treatment/', summary: 'Comprehensive respiratory disease care.' },
    ],
    'gastroenterology': [
      { title: 'Appendectomy', slug: 'appendectomy', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/appendectomy/', summary: 'Surgical removal of the appendix.' },
      { title: 'Cholecystectomy', slug: 'cholecystectomy', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/cholecystectomy/', summary: 'Gallbladder removal surgery.' },
      { title: 'Whipple Procedure', slug: 'whipple-procedure', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/whipple-procedure/', summary: 'Pancreaticoduodenectomy for select cancers.' },
      { title: 'Polypectomy', slug: 'polypectomy', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/polypectomy/', summary: 'Endoscopic removal of polyps.' },
      { title: 'Hernia Repair Surgery', slug: 'hernia-repair-surgery', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/hernia-repair-surgery/', summary: 'Repair of abdominal wall hernias.' },
      { title: 'Esophagectomy', slug: 'esophagectomy', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/esophagectomy/', summary: 'Partial or total removal of the esophagus.' },
      { title: 'Bariatric Surgery', slug: 'bariatric-surgery', wpUrl: 'https://omnihospitals.in/our-departments/gastroenterology/bariatric-surgery/', summary: 'Weight-loss surgery for obesity.' },
    ],
    'nephrology': [
      { title: 'Chronic Kidney Disease', slug: 'chronic-kidney-disease', wpUrl: 'https://omnihospitals.in/our-departments/nephrology/chronic-kidney-disease/', summary: 'Long-term management of kidney dysfunction.' },
      { title: 'Dialysis', slug: 'dialysis', wpUrl: 'https://omnihospitals.in/our-departments/nephrology/dialysis/', summary: 'Renal replacement therapy options.' },
      { title: 'Kidney Transplants', slug: 'kidney-transplants', wpUrl: 'https://omnihospitals.in/our-departments/nephrology/kidney-transplants/', summary: 'Transplant evaluation and aftercare.' },
      { title: 'Kidney stones', slug: 'kidney-stones', wpUrl: 'https://omnihospitals.in/our-departments/nephrology/kidney-stones/', summary: 'Treatment for renal calculi.' },
    ],
    'urology': [
      { title: 'Urology', slug: 'urology', wpUrl: 'https://omnihospitals.in/our-departments/urology/', summary: 'Comprehensive urologic care.' },
      { title: 'Urinary Incontinence', slug: 'urinary-incontinence', wpUrl: 'https://omnihospitals.in/our-departments/urology/urinary-incontinence/', summary: 'Evaluation and treatment of leakage.' },
    ],
    'neurology': [
      { title: 'Epilepsy', slug: 'epilepsy-seizures', wpUrl: 'https://omnihospitals.in/our-departments/neurology/epilepsy-seizures/', summary: 'Seizure diagnosis and management.' },
      { title: 'Neuroplastic surgery', slug: 'neuroplastic-surgery', wpUrl: 'https://omnihospitals.in/our-departments/neurology/neuroplastic-surgery/', summary: 'Surgical care for neurological conditions.' },
      { title: 'Stroke', slug: 'stroke', wpUrl: 'https://omnihospitals.in/our-departments/neurology/stroke/', summary: 'Acute stroke care and rehabilitation.' },
      { title: 'Migraine', slug: 'migraine', wpUrl: 'https://omnihospitals.in/our-departments/neurology/migraine/', summary: 'Headache clinic for migraine relief.' },
      { title: 'Parkinsons', slug: 'parkinsons', wpUrl: 'https://omnihospitals.in/our-departments/neurology/parkinsons/', summary: 'Comprehensive Parkinson’s management.' },
      { title: 'Alzheimers', slug: 'alzheimers', wpUrl: 'https://omnihospitals.in/our-departments/neurology/alzheimers/', summary: 'Memory clinic and dementia care.' },
      { title: 'Multiple sclerosis', slug: 'multiple-sclerosis', wpUrl: 'https://omnihospitals.in/our-departments/neurology/multiple-sclerosis/', summary: 'Disease-modifying therapies and support.' },
    ],
    'general-surgery': [
      { title: 'Anal Fistula Open', slug: 'anal-fistula-open', wpUrl: 'https://omnihospitals.in/our-departments/general-surgery/anal-fistula-open/', summary: 'Surgical treatment for anal fistula.' },
      { title: 'Cleft Lip and Palette', slug: 'cleft-lip-and-palette', wpUrl: 'https://omnihospitals.in/our-departments/general-surgery/cleft-lip-and-palate/', summary: 'Repair of cleft lip and palate.' },
    ],
    'spine-surgery': [
      { title: 'Disectomy', slug: 'discectomy', wpUrl: 'https://omnihospitals.in/our-departments/spine-surgery/discectomy/', summary: 'Removal of herniated disc material.' },
      { title: 'Spinal Fusion- Lumber', slug: 'spinal-fusion-lumbar', wpUrl: 'https://omnihospitals.in/our-departments/spine-surgery/spinal-fusion-lumber/', summary: 'Lumbar fusion for stability.' },
      { title: 'Spinal Fusion- Thoraic', slug: 'spinal-fusion-thoracic', wpUrl: 'https://omnihospitals.in/our-departments/spine-surgery/spinal-fusion-thoraic/', summary: 'Thoracic fusion procedures.' },
    ],
    'ent': [
      { title: 'ENT', slug: 'ent', wpUrl: 'https://omnihospitals.in/our-departments/ent/', summary: 'Comprehensive ENT services.' },
      { title: 'Cochlear Implant', slug: 'cochlear-implant', wpUrl: 'https://omnihospitals.in/our-departments/ent/cochlear-implant/', summary: 'Hearing restoration with implants.' },
      { title: 'Adenoidectomy', slug: 'adenoidectomy', wpUrl: 'https://omnihospitals.in/our-departments/ent/adenoidectomy/', summary: 'Removal of enlarged adenoids.' },
      { title: 'Microscopic Ear Surgery', slug: 'microscopic-ear-surgery', wpUrl: 'https://omnihospitals.in/our-departments/ent/microscopic-ear-surgery/', summary: 'Ear surgeries under microscope.' },
      { title: 'Rhinoplasty', slug: 'rhinoplasty', wpUrl: 'https://omnihospitals.in/our-departments/ent/rhinoplasty/', summary: 'Nasal reshaping surgery.' },
      { title: 'Speech Therapy', slug: 'speech-therapy', wpUrl: 'https://omnihospitals.in/our-departments/ent/speech-therapy/', summary: 'Therapy for speech and language disorders.' },
      { title: 'Tonsillectomy', slug: 'tonsillectomy', wpUrl: 'https://omnihospitals.in/our-departments/ent/tonsillectomy/', summary: 'Tonsil removal for recurrent infections.' },
      { title: 'Surgery For Snoring', slug: 'surgery-for-snoring', wpUrl: 'https://omnihospitals.in/our-departments/ent/surgery-for-snoring/', summary: 'Surgical options for obstructive snoring.' },
    ],
  };
  public activatedRoute!: ActivatedRoute;
  currentDeptSlug: string = '';

  constructor(private activated_routes: ActivatedRoute, private specialitiesService: OurSpecialitiesService, private http: HttpClient, private router: Router
  ) {
    this.activatedRoute = activated_routes;
    this.activatedRoutesData();
    this.bindRouteParams();
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.getAllSpecialities();
  }

  activatedRoutesData() {
    this.activated_routes.queryParams.subscribe(params => {
      console.log(params, 'params....');
      this.departmentName = params['selected_speciality'] || 'N/A';
      if (this.specialties?.length) {
        this.setSelectedDepartmentByName(this.departmentName);
      }

      this.selected_dep = this.selectedDepartment._id || '';
      this.departmentName = this.selectedDepartment.name || 'N/A';

      console.log(this.departmentName, 'departmentName...');
      // When navigated via query param, bind sub-departments for this department
      if (this.departmentName) {
        const slug = this.nameToDeptSlug[this.departmentName.toLowerCase()] || this.departmentName.trim().toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
        this.currentDeptSlug = slug;
        this.subDepartments = this.subDeptMap[slug] || [];
        // Default to first sub-department when available and none selected
        if (!this.activeItemSlug && this.subDepartments.length) {
          const first = this.subDepartments[0];
          this.activeItemSlug = first.slug;
          this.activeTitle = first.title;
          this.activeContent = this.itemSlugToContent[this.activeItemSlug] || '';
          this.activeWpUrl = first.wpUrl;
        }
      }
      this.filterDoctors();
    });
  }

  private bindRouteParams() {
    this.activated_routes.paramMap.subscribe((params: ParamMap) => {
      const deptSlug = params.get('dept');
      const itemSlug = params.get('item');
      if (!deptSlug && !itemSlug) {
        return;
      }
      this.currentDeptSlug = deptSlug || '';
      const name = deptSlug ? (this.deptSlugToName[deptSlug] || '') : '';
      if (name) {
        this.departmentName = name;
        if (this.specialties?.length) {
          this.setSelectedDepartmentByName(this.departmentName);
        }
        // build side bar sub-departments for this department
        this.subDepartments = this.subDeptMap[deptSlug!] || [];
      }
      this.activeItemSlug = itemSlug || '';
      // If no item provided, default to first sub-department (if any)
      if (!this.activeItemSlug && this.subDepartments.length) {
        this.activeItemSlug = this.subDepartments[0].slug;
      }
      this.activeTitle = this.activeItemSlug
        ? this.activeItemSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : '';
      this.activeContent = this.activeItemSlug ? (this.itemSlugToContent[this.activeItemSlug] || '') : '';
      const match = (this.subDepartments || []).find(s => s.slug === this.activeItemSlug);
      this.activeWpUrl = match?.wpUrl || '';
      this.filterDoctors();
    });
  }

  getActiveSummary(): string {
    if (!this.activeItemSlug) return '';
    const found = (this.subDepartments || []).find(s => s.slug === this.activeItemSlug);
    return found?.summary || '';
  }

  setSelectedDepartmentByName(name: string) {
    const matched = this.specialties.find(dep => dep.name?.toLowerCase() === name?.toLowerCase());
    this.selectedDepartment = matched || {};
    this.selected_dep = matched?._id || '';
    console.log(this.selectedDepartment, 'matched department...');
    this.filterDoctors();
  }


  get filteredDepartments(): any[] {
    return this.selectedDepartment && Object.keys(this.selectedDepartment).length
      ? [this.selectedDepartment]
      : [];
  }

  getDepartmentName(): string {
    return this.selectedDepartment?.name || '';
  }



  filterDoctors(): void {
    const name = this.searchName.trim().toLowerCase();
    const location = this.selectedLocation;
    const department = this.departmentName.trim().toLowerCase();

    let tempDoctors = [...this.doctors];

    if (department) {
      tempDoctors = tempDoctors.filter(doctor =>
        doctor.department.toLowerCase() === department
      );
    }

    this.filteredDoctors = tempDoctors.filter(doctor => {
      const matchName = !name || doctor.name.toLowerCase().includes(name);
      const matchLocation = !location || doctor.location === location;
      return matchName && matchLocation;
    });
  }

  getAllSpecialities() {
    this.specialitiesService.getAllSpecialities().subscribe(
      res => {
        this.specialties = res?.SpecialtyData || [];
        this.activatedRoutesData();
      },
      err => {
        console.error('Error:', err);
      }
    );
  }

  submitEnquiry() {
    if (!this.enquiry.fullName.trim()) {
      alert('Full Name is required.');
      return;
    }
    if (!this.enquiry.phoneNumber.trim()) {
      alert('Phone Number is required.');
      return;
    }

    const lastSubmission = localStorage.getItem('lastEnquiry');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      if (
        name === this.enquiry.fullName.trim() &&
        phone === this.enquiry.phoneNumber.trim() &&
        Date.now() - time < thirtyMinutes
      ) {
        alert('You already submitted this enquiry within the last 30 minutes.');
        return;
      }
    }

    const payload = [
      { Attribute: 'FirstName', Value: this.enquiry.fullName },
      { Attribute: 'Phone', Value: this.enquiry.phoneNumber },
      { Attribute: 'EmailAddress', Value: this.enquiry.emailId },
      { Attribute: 'mx_Department', Value: this.getDepartmentName() },
      { Attribute: 'Source', Value: 'Website - Enquiry Form From Speciality' }
    ];

    const accessKey = 'u$r56afea08b32d556818ad1a5f69f0e7f0';
    const secretKey = '8d7f86d677dadaba209b4dead3cfcc4ab019031b';
    const api_url_base = 'https://api-in21.leadsquared.com/v2/';
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (res) => {
          console.log('LeadSquared Enquiry Success:', res);
          alert('Your enquiry has been submitted successfully!');

          localStorage.setItem('lastEnquiry', JSON.stringify({
            name: this.enquiry.fullName.trim(),
            phone: this.enquiry.phoneNumber.trim(),
            time: Date.now()
          }));

          this.enquiry = { fullName: '', phoneNumber: '', emailId: '' };
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('LeadSquared Error:', err);
          alert('There was a problem submitting your enquiry.');
        }
      });
  }
}