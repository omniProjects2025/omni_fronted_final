import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.css']
})
export class TechnologiesComponent {

  technologies = [
    {
      id: 1,
      title: 'CT Scan',
      short_desc: 'At OMNI Hospitals, we use advanced CT scan technology to provide fast, accurate and safe diagnostic imaging.....',
      description: 'At OMNI Hospitals, we use advanced CT scan technology to provide fast, accurate and safe diagnostic imaging. Our system delivers clear, detailed images that help our doctors detect and treat a wide range of conditions with precision. Located at our Kukatpally branch, the CT scan facility is fully approved and certified by the Atomic Energy Regulatory Board (AERB), Government of India, ensuring the highest level of radiation safety and compliance. We strictly follow all national safety protocols to give our patients trustworthy, high-quality care in a comfortable and secure environment.',
      short_img: 'assets/technologies/ct_scan_tech.jpg',
      img_main: 'assets/technologies/ct_scan_main.jpg',
      image: 'assets/technologies/ct_scan_details.jpg'
    },
    {
      id: 2,
      title: 'Ultrasound (Sonography)',
      short_desc: 'Ultrasound is commonly used to assess the abdomen, pelvis, kidneys, liver, thyroid, and during pregnancy....',
      description: 'Ultrasound is commonly used to assess the abdomen, pelvis, kidneys, liver, thyroid, and during pregnancy. It helps in detecting gallstones, cysts, tumors, fluid collection, and other abnormalities. Since it does not use radiation, it is ideal for both adults and children, and especially safe for pregnant women. Our experienced sonologists ensure accurate scans with timely reports for better diagnosis.... and treatment. At OMNI Hospitals, an ultrasound (USG) scan is a safe, painless imaging procedure that uses high-frequency sound waves to create real-time images of the body’s internal organs. A water-based gel is applied to the skin over the area to be examined, and a handheld device called a transducer is moved gently over the skin. The gel helps transmit sound waves efficiently and ensures clearer images.',
      short_img: 'assets/technologies/Technologies_Ultrasound.jpg',
      img_main: 'assets/technologies/ultra_sound_main.jpg',
      image: 'assets/technologies/ultasound_detais.jpg'
    },
    {
      id: 3,
      title: 'Cathlab',
      short_desc: 'Cath Lab (Cardiac Catheterization Laboratory) is a specialized facility where minimally invasive procedures are performed to diagnose....',
      description: 'Cath Lab (Cardiac Catheterization Laboratory) is a specialized facility where minimally invasive procedures are performed to diagnose and treat heart conditions. In a Cath Lab, doctors insert a thin, flexible tube (catheter) through a blood vessel, usually in the arm or groin, to reach the heart. This helps in visualizing the heart’s arteries, valves, and chambers using real-time imaging. Cath Lab procedures are essential for detecting blocked arteries, heart defects, valve problems, and overall heart function. It is commonly used for angiograms, angioplasty, and stent placements. With advanced equipment and experienced cardiologists, our Cath Lab ensures safe, accurate, and life-saving cardiac care with faster recovery and minimal discomfort.',
      short_img: 'assets/technologies/technologies_Cathlab.jpg',
      img_main: 'assets/technologies/cathlab_main.jpg',
      image: 'assets/technologies/cathlab_details.jpg'
    },
    {
      id: 4,
      title: 'Dialysis',
      short_desc: 'At OMNI Hospitals, we offer advanced dialysis care for patients with chronic kidney disease or kidney failure....',
      description: 'At OMNI Hospitals, we offer advanced dialysis care for patients with chronic kidney disease or kidney failure. Dialysis is a procedure that removes waste, excess fluids, and toxins from the blood when the kidneys are no longer able to function effectively. During the process, a dialysis machine filters the blood through a special membrane and returns the clean blood back to the body. Our Dialysis Unit is equipped with modern machines and follows strict infection control protocols to ensure patient safety and comfort. Supervised by experienced nephrologists and trained technicians, we offer both hemodialysis and peritoneal dialysis, tailored to each patient’s medical needs. Regular dialysis helps patients feel better, maintain balance in the body, and improve quality of life.',
      short_img: 'assets/technologies/Technologies_Dialysis.jpg',
      img_main: 'assets/technologies/dialysis_main.jpg',
      image: 'assets/technologies/dialysis_details.jpg'
    },
    {
      id: 5,
      title: 'Incubator',
      short_desc: 'At OMNI Hospitals, our neonatal incubators provide a safe, temperature-controlled environment for newborns....',
      description: 'At OMNI Hospitals, our neonatal incubators provide a safe, temperature-controlled environment for newborns who need extra support after birth, especially premature babies or those with low birth weight, infections, or breathing difficulties. An incubator helps regulate the baby’s body temperature, humidity, and oxygen levels, mimicking conditions of the womb to aid proper growth and development. It also protects the baby from infections and external disturbances during their most vulnerable days. Our NICU is equipped with advanced incubator systems, and every baby is closely monitored by a team of skilled neonatologists and neonatal nurses to ensure round-the-clock expert care.',
      short_img: 'assets/technologies/Technologies_Incubater.jpg',
      img_main: 'assets/technologies/incubator_main.jpg',
      image: 'assets/technologies/incubator_details.jpg'
    },
    {
      id: 6,
      title: 'Modular OT',
      short_desc: 'At OMNI Hospitals, our Operation Theatres (OTs) are designed with cutting-edge technology to ensure safe, sterile, and efficient....',
      description: 'At OMNI Hospitals, our Operation Theatres (OTs) are designed with cutting-edge technology to ensure safe, sterile, and efficient surgical care. Each OT is equipped with advanced surgical instruments, anesthesia systems, and real-time monitoring to support a wide range of procedures from general surgery to complex specialties like neurosurgery, orthopedics, and cardiac care. Our OTs are modular and infection-controlled, built with HEPA filtration and positive pressure airflow systems to maintain a sterile environment. Every surgery is performed by experienced surgeons, supported by trained anesthetists and nursing staff, ensuring precision, safety, and optimal outcomes for every patient.',
      short_img: 'assets/technologies/ot.jpg',
      img_main: 'assets/technologies/modular_ot_main.jpg',
      image: 'assets/technologies/ot_details.jpg'
    }
  ];

  constructor(private router: Router) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onClickTechnologies(obj: any) {
    console.log(obj, 'selected obj...');
    this.router.navigate(['/technologies-details'], {
      queryParams: {
        selected_tech: JSON.stringify(obj)
      }
    });
  }

}
