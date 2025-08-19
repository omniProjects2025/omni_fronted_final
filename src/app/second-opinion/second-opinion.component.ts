import { Component } from '@angular/core';

@Component({
  selector: 'app-second-opinion',
  templateUrl: './second-opinion.component.html',
  styleUrls: ['./second-opinion.component.css']
})
export class SecondOpinionComponent {
  counters = [
    { id: 1, img: 'branches_counter.svg', label: 'Hospitals', target: 6, value: 0 },
    { id: 2, img: 'beds_counter.svg', label: 'Beds', target: 1200, value: 0 },
    { id: 3, img: 'doctor_counter.svg', label: 'Doctors', target: 200, value: 0 },
    { id: 4, img: 'pharmacy_counter.svg', label: 'Pharmacy', target: 6, value: 0 }
  ];

  ngAfterViewInit(): void {
    this.observeCounters();
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
}
