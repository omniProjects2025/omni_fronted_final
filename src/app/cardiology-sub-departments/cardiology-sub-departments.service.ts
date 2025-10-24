import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardiologySubDepartmentsService {
  
  private cardiologyData: any = null;
  
  constructor(private http: HttpClient) {}
  
  // Load data from JSON file
  private loadCardiologyData(): Observable<any> {
    if (this.cardiologyData) {
      return of(this.cardiologyData);
    }
    
    return this.http.get('assets/data/cardiology-sub-departments.json').pipe(
      map(data => {
        this.cardiologyData = data;
        return data;
      }),
      catchError(error => {
        console.error('Error loading cardiology data:', error);
        // Fallback to hardcoded data if JSON fails
        return of(this.getHardcodedData());
      })
    );
  }
  
  // Get sub-department by slug
  getSubDepartmentBySlug(slug: string): any {
    if (this.cardiologyData) {
      return this.cardiologyData.sub_departments.find((dept: any) => dept.slug === slug);
    }
    return null;
  }
  
  // Get sub-department by name (for backward compatibility)
  getSubDepartmentByName(name: string): any {
    if (this.cardiologyData) {
      return this.cardiologyData.sub_departments.find((dept: any) => dept.name === name);
    }
    return null;
  }
  
  // Get all sub-departments
  getAllSubDepartments(): Observable<any[]> {
    return this.loadCardiologyData().pipe(
      map(data => data.sub_departments || [])
    );
  }
  
  // Initialize data (call this in app component or module)
  initializeData(): Observable<any> {
    return this.loadCardiologyData();
  }
  
  // Fallback hardcoded data
  private getHardcodedData() {
    return {
    "speciality": "Cardiology",
    "location": "Kukatpally",
    "sub_departments": [
      {
          "slug": "treatment-for-heart-failure-in-kukatpally",
        "name": "Heart Failure",
        "url": "/specialities/cardiology/treatment-for-heart-failure-in-kukatpally",
        "meta_title": "Heart Failure Treatment in Kukatpally | Omni Hospitals",
        "meta_description": "Get advanced Heart Failure Treatment at OMNI Hospitals Kukatpally. Specialized diagnosis and personalized care for congestive and chronic diastolic heart failure (Medications, ICDs, CRT).",
        "canonical_url": "https://omnihospitals.in/specialities/cardiology/treatment-for-heart-failure-in-kukatpally/",
          "image": "assets/our_specialities_new/heart_failure.jpg",
        "content": {
          "h1": "Heart Failure Treatment in Hyderabad",
          "intro": "Heart failure is a condition where the heart cannot pump enough blood to meet the body's needs. It often develops over time due to conditions like high blood pressure, coronary artery disease, or previous heart attacks that weaken the heart muscle. At OMNI Hospitals, our expert heart failure doctors provide advanced diagnosis, effective congestive heart failure treatment, and long-term management plans for patients with chronic or acute heart failure, including chronic diastolic heart failure.",
          "sections": [
            {
              "h2": "Common Causes of Heart Failure",
              "description": "Heart failure may result from several heart and systemic conditions:",
              "subsections": [
                {
                  "h3": "Coronary Artery Disease (CAD)",
                  "description": "Narrowed or blocked arteries reduce blood supply to the heart."
                },
                {
                  "h3": "Congenital Heart Defects",
                  "description": "Structural issues present from birth."
                },
                {
                  "h3": "Heart Attack",
                  "description": "Damage from a past attack can impair heart function."
                },
                {
                  "h3": "Cardiomyopathy",
                  "description": "Weakened heart muscles due to infections, alcohol, genetics, or drug abuse."
                },
                {
                  "h3": "Other Conditions",
                  "description": "Hypertension, diabetes, kidney disease, thyroid disorders, and valve disease."
                }
              ]
            },
            {
              "h2": "Congestive Heart Failure Symptoms to Watch For",
              "description": "Early recognition of heart failure symptoms is essential for timely treatment. Key signs include:",
              "list": [
                "Shortness of breath (during activity or at rest)",
                "Fatigue and weakness",
                "Swelling in feet or ankles (pedal edema)",
                "Nocturnal coughing or breathing difficulty (PND)",
                "Frequent urination at night",
                "Chest pain or pressure",
                "Loss of appetite, indigestion",
                "Dizziness or giddiness",
                "Persistent dry cough"
              ]
            }
          ],
          "faqs": [
            {
                "question": "What is the difference between heart failure and a heart attack?",
                "answer": "A heart attack is a sudden event where blood flow to the heart is blocked, causing immediate damage. Heart failure is a chronic condition where the heart gradually becomes weaker and cannot pump blood effectively."
              },
              {
                "question": "Can heart failure be cured?",
                "answer": "While heart failure cannot be completely cured, it can be effectively managed with proper treatment, lifestyle changes, and medications. Many patients live long, active lives with appropriate care."
            }
          ]
        }
      },
      {
          "slug": "best-hospital-for-angiography-in-hyderabad",
        "name": "Coronary Angiogram",
        "url": "/specialities/cardiology/best-hospital-for-angiography-in-hyderabad",
          "meta_title": "Best Hospital for Angiography in Hyderabad | OMNI Hospitals",
          "meta_description": "Get advanced coronary angiography at OMNI Hospitals Hyderabad. Expert cardiologists perform safe and accurate heart imaging procedures for precise diagnosis of coronary artery disease.",
        "canonical_url": "https://omnihospitals.in/specialities/cardiology/best-hospital-for-angiography-in-hyderabad/",
          "image": "assets/our_specialities_new/angiogram.jpg",
        "content": {
            "h1": "Coronary Angiography in Hyderabad",
            "intro": "Coronary angiography is a specialized imaging procedure that provides detailed pictures of your heart's blood vessels. At OMNI Hospitals, our expert cardiologists use advanced technology to perform safe and accurate coronary angiograms, helping diagnose coronary artery disease and plan appropriate treatment strategies.",
          "sections": [
            {
                "h2": "What is Coronary Angiography?",
                "description": "Coronary angiography is a diagnostic procedure that uses X-ray imaging to examine the coronary arteries that supply blood to your heart muscle.",
                "subsections": [
                  {
                    "h3": "Purpose",
                    "description": "To identify blockages, narrowing, or other abnormalities in the coronary arteries"
                  },
                  {
                    "h3": "Procedure",
                    "description": "A thin catheter is inserted through a blood vessel and guided to the heart, where contrast dye is injected to make arteries visible on X-ray"
                  },
                  {
                    "h3": "Duration",
                    "description": "Typically takes 30-60 minutes, with additional time for preparation and recovery"
                  }
                ]
              }
            ],
            "faqs": [
              {
                "question": "Is coronary angiography painful?",
                "answer": "Most patients experience minimal discomfort. You'll receive local anesthesia at the insertion site, and the procedure itself is generally not painful."
              },
              {
                "question": "How long does recovery take?",
                "answer": "Most patients can return to normal activities within 24-48 hours. You'll need to avoid heavy lifting and strenuous exercise for a few days."
            }
          ]
        }
      },
      {
          "slug": "best-hospital-for-angioplasty-in-hyderabad",
        "name": "Angioplasty",
        "url": "/specialities/cardiology/best-hospital-for-angioplasty-in-hyderabad",
          "meta_title": "Best Hospital for Angioplasty in Hyderabad | OMNI Hospitals",
          "meta_description": "Expert angioplasty procedures at OMNI Hospitals Hyderabad. Advanced coronary angioplasty with stenting performed by experienced interventional cardiologists for blocked heart arteries.",
        "canonical_url": "https://omnihospitals.in/specialities/cardiology/best-hospital-for-angioplasty-in-hyderabad/",
          "image": "assets/our_specialities_new/angioplasty.jpg",
        "content": {
          "h1": "Coronary Angioplasty in Hyderabad",
            "intro": "Coronary angioplasty is a minimally invasive procedure used to open blocked or narrowed coronary arteries. At OMNI Hospitals, our experienced interventional cardiologists perform advanced angioplasty procedures with stenting to restore blood flow to your heart and improve your quality of life.",
          "sections": [
            {
                "h2": "What is Coronary Angioplasty?",
                "description": "Angioplasty is a procedure that opens blocked coronary arteries using a balloon and often a stent to keep the artery open.",
              "subsections": [
                {
                    "h3": "Balloon Angioplasty",
                    "description": "A deflated balloon is inserted and inflated to compress plaque against the artery wall"
                  },
                  {
                    "h3": "Stent Placement",
                    "description": "A small mesh tube (stent) is often placed to keep the artery open after balloon inflation"
                  },
                  {
                    "h3": "Drug-Eluting Stents",
                    "description": "Special stents that release medication to prevent re-narrowing of the artery"
                  }
                ]
              }
            ],
            "faqs": [
              {
                "question": "How long does angioplasty take?",
                "answer": "The procedure typically takes 1-2 hours, depending on the number of arteries being treated. You'll spend additional time in recovery."
              },
              {
                "question": "Will I need to stay in the hospital?",
                "answer": "Most patients stay overnight for monitoring. Some may go home the same day if it's a simple procedure and they're doing well."
            }
          ]
        }
      },
      {
          "slug": "hospital-for-permanent-pacemaker-implantation-in-kukatpally",
          "name": "Permanent Pacemaker Implantation",
        "url": "/specialities/cardiology/hospital-for-permanent-pacemaker-implantation-in-kukatpally",
          "meta_title": "Permanent Pacemaker Implantation in Kukatpally | OMNI Hospitals",
          "meta_description": "Expert permanent pacemaker implantation at OMNI Hospitals Kukatpally. Advanced cardiac pacing devices implanted by experienced electrophysiologists for heart rhythm disorders.",
        "canonical_url": "https://omnihospitals.in/specialities/cardiology/hospital-for-permanent-pacemaker-implantation-in-kukatpally/",
          "image": "assets/our_specialities_new/permanent_pacemaker_implantation.jpg",
        "content": {
            "h1": "Permanent Pacemaker Implantation in Hyderabad",
            "intro": "A permanent pacemaker is a small electronic device that helps regulate your heart's rhythm when it beats too slowly or irregularly. At OMNI Hospitals, our expert electrophysiologists perform advanced pacemaker implantation procedures to restore normal heart rhythm and improve your quality of life.",
          "sections": [
            {
                "h2": "What is a Permanent Pacemaker?",
                "description": "A pacemaker is a small device that monitors your heart rhythm and sends electrical signals to maintain a normal heartbeat.",
              "subsections": [
                {
                    "h3": "Components",
                    "description": "Generator (battery and computer) and leads (thin wires) that connect to your heart"
                  },
                  {
                    "h3": "Function",
                    "description": "Monitors heart rhythm and delivers electrical impulses when needed"
                  },
                  {
                    "h3": "Types",
                    "description": "Single-chamber, dual-chamber, and biventricular pacemakers for different conditions"
                  }
                ]
              }
            ],
            "faqs": [
              {
                "question": "How long does pacemaker implantation take?",
                "answer": "The procedure typically takes 1-2 hours, depending on the type of pacemaker and complexity of the case."
              },
              {
                "question": "Will I feel the pacemaker working?",
                "answer": "Most people don't feel the pacemaker working. You may feel your heart beating normally, but the electrical impulses are usually not noticeable."
            }
          ]
        }
      },
      {
          "slug": "best-hospital-for-bypass-surgery-in-hyderabad",
        "name": "Bypass Surgery",
        "url": "/specialities/cardiology/best-hospital-for-bypass-surgery-in-hyderabad",
          "meta_title": "Best Hospital for Bypass Surgery in Hyderabad | OMNI Hospitals",
          "meta_description": "Expert coronary artery bypass surgery at OMNI Hospitals Hyderabad. Advanced CABG procedures performed by experienced cardiac surgeons for severe coronary artery disease.",
        "canonical_url": "https://omnihospitals.in/specialities/cardiology/best-hospital-for-bypass-surgery-in-hyderabad/",
          "image": "assets/our_specialities_new/bypass_surgery.jpg",
        "content": {
            "h1": "Coronary Artery Bypass Surgery in Hyderabad",
            "intro": "Coronary artery bypass surgery (CABG) is a major heart surgery that creates new pathways for blood to flow around blocked coronary arteries. At OMNI Hospitals, our experienced cardiac surgeons perform advanced bypass procedures using the latest techniques to restore blood flow to your heart and improve your quality of life.",
          "sections": [
            {
                "h2": "What is Coronary Artery Bypass Surgery?",
                "description": "CABG surgery creates new routes for blood to reach your heart muscle by bypassing blocked or narrowed coronary arteries.",
                "subsections": [
                  {
                    "h3": "Purpose",
                    "description": "To restore blood flow to the heart muscle when arteries are severely blocked"
                  },
                  {
                    "h3": "Graft Materials",
                    "description": "Uses blood vessels from other parts of your body (chest, leg, or arm) as bypass grafts"
                  },
                  {
                    "h3": "Procedure Types",
                    "description": "Traditional open-heart surgery or minimally invasive techniques"
                  }
                ]
            }
          ],
          "faqs": [
            {
                "question": "How long does bypass surgery take?",
                "answer": "The surgery typically takes 3-6 hours, depending on the number of bypasses needed and complexity of the case."
              },
              {
                "question": "What is the recovery time after bypass surgery?",
                "answer": "Most patients stay in the hospital for 5-7 days and can return to normal activities within 6-8 weeks, with gradual progression."
            }
          ]
        }
      }
    ]
  };
  }
}