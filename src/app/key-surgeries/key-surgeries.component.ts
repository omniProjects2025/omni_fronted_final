import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

interface Surgery {
  name: string;
  description: string;
  icon?: string;
}

interface Department {
  name: string;
  surgeries: Surgery[];
  color: string;
  icon: string;
}

@Component({
  selector: 'app-key-surgeries',
  templateUrl: './key-surgeries.component.html',
  styleUrls: ['./key-surgeries.component.css']
})
export class KeySurgeriesComponent implements OnInit {
  selectedDepartment: string = 'Orthopedics';
  filteredSurgeries: Surgery[] = [];
  showAppointmentModal = false;
  
  appointmentForm!: FormGroup;

  departments: Department[] = [
    {
      name: 'Orthopedics',
      color: '#8B5CF6',
      icon: '🦴',
      surgeries: [
        {
          name: 'Total Hip Replacement (THR)',
          description: 'Total Hip Replacement (THR) is a surgical procedure performed to replace a damaged or diseased hip joint with an artificial implant. It is recommended for patients suffering from advanced arthritis, hip fractures, avascular necrosis, or severe joint degeneration that causes persistent pain and limits mobility. During the surgery, the damaged bone and cartilage are carefully removed and replaced with prosthetic components designed to mimic the natural hip joint. This procedure not only reduces pain but also helps restore smooth movement and improves overall quality of life. With advancements in surgical techniques and minimally invasive approaches, recovery has become faster and more effective. Physiotherapy plays a vital role in strengthening muscles and regaining mobility after surgery. THR is considered one of the most successful orthopedic surgeries, with long-term outcomes that allow patients to walk, climb stairs, and resume an active lifestyle without discomfort.'
        },
        {
          name: 'Total Knee Replacement (TKR)',
          description: 'Total Knee Replacement (TKR) is a highly effective surgical procedure for patients experiencing severe knee pain and stiffness caused by advanced osteoarthritis, rheumatoid arthritis, or post-traumatic injuries. In this surgery, the damaged surfaces of the knee joint are replaced with specially designed artificial implants made of metal and high-grade plastics. These prosthetics mimic the natural joint, allowing smoother movement and better weight-bearing capacity. TKR helps patients regain mobility, reduce pain, and return to everyday activities with improved comfort. Advanced techniques like computer-assisted navigation and minimally invasive procedures ensure greater precision and quicker recovery. Post-surgery rehabilitation, including physiotherapy and guided exercises, is crucial to restoring strength, flexibility, and balance. The surgery has a very high success rate, with most patients experiencing long-term relief and improved quality of life. For those struggling with chronic knee pain that affects daily living, TKR provides a reliable and lasting solution.'
        },
        {
          name: 'Developmental Dysplasia of the Hip (DDH)',
          description: 'Developmental Dysplasia of the Hip (DDH) is a childhood condition where the hip joint does not develop properly, leading to instability or dislocation. If left untreated, it can cause long-term walking difficulties, pain, and early arthritis. Diagnosis is usually made in infants or young children through clinical examination and imaging tests. In mild cases, braces or harnesses may be used to guide the hip into proper alignment. However, when conservative treatments fail, surgical intervention becomes necessary. Surgery aims to realign the hip joint, stabilize it, and allow normal growth and function. Techniques may include open or closed reduction procedures, soft tissue release, or bone corrections depending on the severity of the condition. Timely treatment ensures children can grow with healthy hip function, preventing disability in later life. With expert pediatric orthopedic care, DDH correction allows children to walk normally, remain active, and avoid long-term complications.'
        },
        {
          name: 'Arthroscopic ACL Reconstruction',
          description: 'Arthroscopic ACL Reconstruction is a modern surgical procedure performed to treat a torn anterior cruciate ligament (ACL) in the knee. The ACL is a key ligament that stabilizes the knee joint, and injuries are most common in athletes or active individuals. A torn ACL can cause instability, pain, and difficulty performing daily or sports activities. The reconstruction procedure is done arthroscopically using small incisions, where the damaged ligament is replaced with a tendon graft taken from the patient or a donor. This minimally invasive technique reduces scarring, blood loss, and recovery time compared to traditional surgery. Post-surgery, patients undergo structured physiotherapy to restore mobility, strength, and knee stability. With proper care, most individuals can return to sports and active lifestyles within months. ACL reconstruction is one of the most effective procedures to prevent long-term knee problems and protect the joint from further damage.'
        },
        {
          name: 'Meniscal Repair',
          description: 'Meniscal Repair is a surgical procedure performed to treat tears in the meniscus, which is a crucial cartilage structure in the knee that acts as a cushion between the thighbone and shinbone. Meniscus tears are common sports injuries and can lead to pain, swelling, stiffness, and instability if left untreated. Unlike meniscectomy, which removes the damaged tissue, meniscal repair focuses on preserving the natural cartilage by stitching the torn edges together. This approach helps maintain long-term knee function and prevents early-onset arthritis. The surgery is usually performed arthroscopically through small incisions, ensuring quicker recovery, minimal scarring, and less postoperative discomfort. Post-surgery, patients undergo physiotherapy to restore strength, stability, and mobility in the joint. Successful meniscal repair allows patients, particularly athletes, to return to sports and daily activities with improved knee function. It is a preferred option for younger and active individuals where tissue healing potential is higher.'
        },
        {
          name: 'Slipped Capital Femoral Epiphysis (SCFE)',
          description: 'Slipped Capital Femoral Epiphysis (SCFE) is a hip condition seen in adolescents, where the head of the femur slips off the neck at the growth plate. It is a serious orthopedic problem that can cause hip pain, knee pain, stiffness, and difficulty walking. SCFE requires immediate medical attention, as untreated cases can lead to long-term deformity, arthritis, and disability. The surgical treatment usually involves inserting screws or pins to stabilize the femoral head and prevent further slipping. In severe cases, corrective osteotomies may be required. Early diagnosis and surgical intervention are key to preventing complications and preserving hip function. Post-surgery rehabilitation focuses on strengthening muscles, improving joint stability, and restoring mobility. With timely treatment, most children can recover well and resume normal activities. SCFE surgery plays a crucial role in ensuring proper hip development and preventing lifelong disability associated with this condition.'
        },
        {
          name: 'Paediatric Trauma',
          description: 'Pediatric Trauma surgery deals with injuries sustained by children in accidents, falls, or sports-related activities. Since children\'s bones and tissues are still growing, trauma care requires specialized expertise to ensure proper healing and avoid long-term complications. Common pediatric trauma cases include fractures, dislocations, head injuries, and soft tissue damage. Surgical intervention is necessary in complex or severe injuries where bones need to be realigned, stabilized with implants, or repaired through minimally invasive techniques. Pediatric orthopedic surgeons use child-friendly approaches to ensure minimal scarring, faster recovery, and preservation of growth potential in the bones. Postoperative care includes physiotherapy, nutritional support, and close monitoring to ensure normal growth and development. The goal of pediatric trauma surgery is not just to repair the injury but also to restore full function, allowing children to return to their normal activities without limitations. Early and expert care ensures the best long-term outcomes.'
        },
        {
          name: 'CTEV – Posterio Medial Soft Tissue Release',
          description: 'Congenital Talipes Equinovarus (CTEV), commonly known as clubfoot, is a congenital deformity where a baby\'s foot is twisted inward or downward. While many cases are treated successfully using casting techniques like the Ponseti method, severe or resistant cases require surgical correction. Posterio Medial Soft Tissue Release (PMSTR) is a surgical procedure performed to correct the deformity by releasing and lengthening tight tendons, ligaments, and soft tissues around the ankle and foot. This surgery helps realign the foot into a functional, plantigrade position, allowing the child to walk normally. The procedure is typically performed in early childhood to ensure proper growth and development. Post-surgery, casting and bracing are often required to maintain correction, along with physiotherapy to strengthen muscles and improve mobility. With proper care, children undergoing PMSTR achieve significant improvement in foot function, mobility, and appearance, enabling them to lead active, normal lives.'
        },
        {
          name: 'Deformity Corrections (Epiphysiodesis, Corrective Osteotomies, Perthes Disease)',
          description: 'Deformity Corrections in orthopedics involve specialized surgeries to treat bone and joint abnormalities in children and adolescents. Conditions such as limb length discrepancies, angular deformities, or hip disorders like Perthes disease may require surgical intervention for proper alignment and function. Epiphysiodesis is performed to control bone growth and correct length differences by selectively closing a growth plate. Corrective Osteotomies involve cutting and realigning bones to restore normal shape and function, often used for angular deformities. Perthes Disease surgery focuses on preserving the femoral head and ensuring the hip joint develops properly, preventing long-term arthritis or disability. These surgeries require advanced planning, precision, and expertise in pediatric orthopedics. Postoperative care involves physiotherapy, bracing, and regular monitoring to ensure successful correction and healthy bone growth. Deformity correction procedures not only restore proper limb alignment and mobility but also greatly improve the child\'s quality of life. Perthes Disease surgery focuses on preserving the femoral head and ensuring the hip joint develops properly, preventing long-term arthritis or disability. These surgeries require advanced planning, precision, and expertise in pediatric orthopedics. Postoperative care involves physiotherapy, bracing, and regular monitoring to ensure successful correction and healthy bone growth. Deformity correction procedures not only restore proper limb alignment and mobility but also greatly improve the child\'s quality of life.'
        }
      ]
    },
    {
      name: 'Plastic Surgery',
      color: '#EC4899',
      icon: '✨',
      surgeries: [
        {
          name: 'Acute Burns Management',
          description: 'Acute burns management focuses on immediate and comprehensive care for patients who sustain fresh burn injuries. Treatment involves wound cleaning, fluid resuscitation, pain management, and infection prevention to stabilize the patient and minimize complications. Plastic surgeons use advanced dressings, temporary skin substitutes, and surgical interventions like skin grafting when necessary. Early management reduces the risk of deep scarring, contractures, and functional loss. Critical care support is also provided in severe burns affecting major body areas. Rehabilitation begins early to restore mobility and improve recovery outcomes. The goal of acute burns management is to save lives, preserve function, and ensure long-term healing with minimal deformity.'
        },
        {
          name: 'Chronic Burns Management & Advanced Wound Care',
          description: 'Chronic burns and non-healing wounds require specialized long-term care to improve function and appearance. Plastic surgeons address complications like hypertrophic scars, contractures, and keloids through surgical release, grafting, and flap reconstruction. Advanced wound care techniques, including vacuum-assisted closure (VAC), hyperbaric oxygen therapy, and biological dressings, are used to accelerate healing. Laser therapy and cosmetic procedures help reduce scar visibility and improve skin texture. Functional rehabilitation ensures restored mobility in affected joints and limbs. Psychological counseling is also a vital part of care, helping patients cope with trauma and social reintegration. The aim is to restore both function and aesthetics, enhancing quality of life.'
        },
        {
          name: 'Diabetic Foot',
          description: 'Diabetic foot management in plastic surgery is focused on treating non-healing ulcers, infections, and tissue loss caused by diabetes-related complications. Early intervention includes debridement of dead tissue, advanced dressings, and infection control to promote healing. Microvascular surgery and reconstructive techniques are used in severe cases to restore blood flow and cover exposed structures. Limb salvage procedures prevent amputations and preserve function. Multidisciplinary care ensures blood sugar control, vascular assessment, and wound management. Patient education plays a key role in preventing recurrence through proper foot care practices. With timely and advanced treatment, diabetic foot management reduces complications and improves patient outcomes.'
        },
        {
          name: 'Facial Trauma',
          description: 'Facial trauma surgeries address injuries caused by accidents, falls, or assaults that affect facial bones and soft tissues. These injuries can involve fractures of the nose, jaw, cheekbones, and orbital bones, along with lacerations and tissue loss. Plastic surgeons use advanced fixation techniques, microsurgery, and reconstruction methods to restore both function and aesthetics. The goal is to ensure proper bite, speech, vision, and facial symmetry. Early intervention helps prevent long-term deformities and functional impairments. Scar minimization and cosmetic refinements are often incorporated into treatment. Facial trauma care blends life-saving interventions with aesthetic reconstruction to achieve natural and lasting results.'
        },
        {
          name: 'Microvascular Reconstruction Surgeries',
          description: 'Microvascular reconstruction involves transferring tissue, skin, muscle, or bone from one part of the body to another using microsurgery. It is commonly performed in cases of cancer resections, trauma, chronic wounds, or congenital defects. Surgeons use specialized techniques to connect tiny blood vessels under a microscope, ensuring proper blood supply to transplanted tissue. These procedures restore form and function in complex defects of the face, limbs, or trunk. Success rates are high when performed in specialized centers with advanced technology. Rehabilitation helps patients regain mobility, speech, or appearance, depending on the reconstruction site. Microvascular surgery plays a vital role in modern plastic and reconstructive care.'
        },
        {
          name: 'Congenital Birth Defects (Cleft Lip, Cleft Palate, Hand & Ear Deformities)',
          description: 'Plastic surgery plays a transformative role in correcting congenital birth defects such as cleft lip, cleft palate, hand deformities, and ear malformations. These surgeries not only restore normal appearance but also improve essential functions like speech, feeding, and hearing. Cleft repair involves precise closure techniques to create natural contours of the lip and palate. Hand and ear deformities are treated with reconstructive and microsurgical approaches to restore mobility and shape. Early surgical intervention, often in infancy or early childhood, ensures proper development and psychosocial confidence. Multidisciplinary care with speech therapy and orthodontics enhances overall outcomes. These procedures significantly improve quality of life by combining function with aesthetics.'
        },
        {
          name: 'Gynecomastia, Rhinoplasty & Facial Scar Surgeries',
          description: 'Plastic surgeons offer corrective procedures for cosmetic and functional concerns such as gynecomastia, rhinoplasty, and facial scar revisions. Gynecomastia surgery removes excess breast tissue in men, restoring a masculine chest contour. Rhinoplasty reshapes the nose for aesthetic improvement or breathing correction. Facial scar surgeries improve the appearance of scars caused by acne, trauma, or burns using excision, laser therapy, and skin resurfacing. These procedures are performed with precision to enhance both confidence and natural facial harmony. Minimally invasive techniques ensure quicker recovery and minimal scarring. Each treatment plan is personalized to suit individual needs. Together, these surgeries address functional issues while enhancing appearance.'
        },
        {
          name: 'Breast Surgeries (Reduction & Augmentation)',
          description: 'Breast surgeries in plastic surgery include both reduction and augmentation procedures to improve comfort, function, and aesthetics. Breast reduction helps women with overly large breasts that cause pain, posture problems, or self-consciousness by removing excess tissue and reshaping the breasts. Breast augmentation uses implants or fat transfer to enhance breast size, shape, and symmetry, often after weight loss, pregnancy, or mastectomy. Both procedures are tailored to patient goals, ensuring natural-looking results and improved confidence. Advanced surgical techniques prioritize safety, minimal scarring, and faster recovery. Beyond aesthetics, breast surgeries enhance physical comfort, emotional well-being, and quality of life.'
        }
      ]
    },
    {
      name: 'Cardiology',
      color: '#EF4444',
      icon: '❤️',
      surgeries: [
        {
          name: 'Implantable Cardioverter – Defibrillator (ICD)',
          description: 'An Implantable Cardioverter–Defibrillator (ICD) is a life-saving device used for patients at risk of sudden cardiac arrest due to irregular heart rhythms. It continuously monitors the heart\'s electrical activity and delivers a controlled shock if dangerous arrhythmias occur. The device is implanted under the skin, near the chest, with leads connected to the heart. ICDs help prevent sudden death in patients with heart failure, ventricular tachycardia, or ventricular fibrillation. The procedure is minimally invasive and performed under local or general anesthesia. Post-implantation, regular monitoring ensures device effectiveness and patient safety. ICD therapy significantly reduces the risk of life-threatening cardiac events.'
        },
        {
          name: 'Permanent Pacemaker Implantation (PPI)',
          description: 'A Permanent Pacemaker Implantation (PPI) is performed to regulate abnormal heart rhythms, particularly slow heartbeats (bradycardia). The pacemaker is a small device placed under the skin of the chest, with leads connected to the heart to provide electrical impulses. This ensures a steady and adequate heart rate, improving blood flow and preventing symptoms like fatigue, dizziness, or fainting. Modern pacemakers are advanced, programmable, and tailored to individual patient needs. The implantation is safe, with most patients resuming normal activities quickly. Regular follow-ups are required to check battery life and device performance. PPI greatly enhances the quality of life in patients with rhythm disorders.'
        },
        {
          name: 'Coronary Angiogram',
          description: 'A Coronary Angiogram is a diagnostic procedure used to visualize the coronary arteries and assess blood flow to the heart. It involves injecting a contrast dye through a catheter inserted into the blood vessels, usually via the wrist or groin. X-ray imaging then reveals blockages, narrowing, or abnormalities in the arteries. This test is crucial for diagnosing coronary artery disease, chest pain causes, or evaluating heart function before surgery. It is a minimally invasive procedure with a short recovery time. Results guide further treatment, including medication, angioplasty, or surgery. A coronary angiogram is the gold standard for accurate heart artery evaluation.'
        },
        {
          name: 'Angioplasty',
          description: 'Angioplasty is a minimally invasive procedure used to open narrowed or blocked coronary arteries, restoring normal blood flow to the heart. During the procedure, a small balloon is inserted through a catheter and inflated at the blockage site to widen the artery. In most cases, a stent (mesh tube) is placed to keep the artery open long-term. Angioplasty relieves chest pain (angina), improves heart function, and reduces the risk of a heart attack. It is often performed after a coronary angiogram identifies blockages. Recovery is quick, with patients resuming normal activities within days. Angioplasty plays a vital role in modern heart disease management.'
        },
        {
          name: 'PTCA / Staged PTCA',
          description: 'Percutaneous Transluminal Coronary Angioplasty (PTCA) is a specialized procedure to treat narrowed or blocked coronary arteries. In cases where multiple blockages exist, staged PTCA is performed in planned sessions to reduce risk and ensure better outcomes. A balloon-tipped catheter is inserted to open blocked arteries, often followed by stent placement for long-term results. This treatment improves blood supply, reduces chest pain, and prevents heart attacks. Staged PTCA allows careful management of complex heart disease by treating blockages step by step. It is a safe and effective alternative to bypass surgery in selected patients. Regular follow-ups help maintain heart health post-procedure.'
        }
      ]
    },
    {
      name: 'Neuro Intervention',
      color: '#3B82F6',
      icon: '🧠',
      surgeries: [
        {
          name: 'Embolizations, Coiling, Flow Diverter',
          description: 'Embolization, coiling, and flow diverter procedures are advanced neuro-interventional techniques used to treat aneurysms and abnormal blood vessels in the brain. These minimally invasive approaches involve inserting catheters through small incisions, guided precisely to the affected vessels. In coiling, platinum coils are placed inside an aneurysm to block blood flow and prevent rupture. Flow diverters are stent-like devices that redirect blood flow away from the aneurysm, encouraging healing of the vessel wall. Embolization uses specialized materials to seal abnormal vessels or control bleeding. These techniques offer faster recovery, reduced surgical risks, and effective long-term outcomes. They are often life-saving procedures for patients with high-risk aneurysms or vascular malformations.'
        },
        {
          name: 'Thrombectomy',
          description: 'Thrombectomy is a highly advanced neuro-interventional procedure used to treat ischemic strokes caused by a blood clot blocking a major brain artery. Time is critical in stroke care, and this minimally invasive treatment is designed to restore blood flow rapidly and reduce brain damage. During the procedure, a thin catheter is inserted through an artery in the groin or wrist and carefully guided to the site of the clot. Specialized devices are then used to capture and remove the clot, allowing oxygen-rich blood to reach the brain again. When performed within the recommended time window, thrombectomy can significantly improve survival rates and reduce the risk of long-term disability. This procedure has transformed stroke management, offering hope for patients who previously faced severe neurological damage. At specialized centers, expert teams ensure fast diagnosis, precise treatment, and comprehensive rehabilitation to help patients regain independence after a stroke.'
        }
      ]
    },
    {
      name: 'Vascular Surgery',
      color: '#10B981',
      icon: '🩸',
      surgeries: [
        {
          name: 'Arterial Embolizations',
          description: 'Arterial embolization is a minimally invasive procedure used to intentionally block or restrict blood flow to a specific artery. This technique is often used to stop internal bleeding, reduce the size of tumors before surgical removal, or to treat certain vascular malformations. During the procedure, a vascular surgeon inserts a small catheter into an artery, guiding it to the target vessel using real-time imaging. Once in place, tiny particles, coils, or a liquid embolic agent are released to block the blood vessel. Arterial embolizations are a safe and effective way to manage a variety of conditions, often avoiding the need for more invasive open surgery.'
        },
        {
          name: 'Tumour Embolizations',
          description: 'Tumour embolization is a highly specialized procedure designed to cut off the blood supply to a tumor, causing it to shrink or slow its growth. This is particularly useful for highly vascular tumors, such as those in the liver, kidney, or brain. By starving the tumor of oxygen and nutrients, this procedure can make it easier to remove surgically or can be used as a standalone treatment to reduce tumor size. Our skilled interventional radiologists and vascular surgeons use precise catheter-based techniques to deliver embolic agents directly to the tumor\'s feeding arteries, preserving healthy surrounding tissue.'
        },
        {
          name: 'Foam Sclerotherapy',
          description: 'Foam sclerotherapy is a popular and effective treatment for varicose veins. During this procedure, a special sclerosant solution is mixed with air to create a foam, which is then injected directly into the varicose vein. The foam displaces blood inside the vein and coats the vessel walls, causing them to collapse and seal shut. The body then naturally absorbs the treated vein over time, and blood flow is redirected to healthier veins. Foam sclerotherapy is a minimally invasive, in-office procedure that offers an excellent cosmetic result with minimal discomfort and a quick recovery, making it a preferred choice for many patients.'
        },
        {
          name: 'Endovenous Laser Therapy (EVLT)',
          description: 'Endovenous Laser Therapy (EVLT) is a state-of-the-art, minimally invasive procedure used to treat varicose veins and chronic venous insufficiency. It provides an excellent alternative to traditional vein stripping surgery. During the procedure, a thin laser fiber is inserted into the affected vein through a small incision. The laser emits energy that heats and collapses the vein walls, causing the vein to close and seal shut. The body then naturally reroutes blood flow to healthier veins. EVLT is a quick and highly effective procedure performed on an outpatient basis, offering minimal pain, no scarring, and a fast recovery, allowing patients to return to their normal activities almost immediately.'
        }
      ]
    },
    {
      name: 'ENT',
      color: '#F59E0B',
      icon: '👂',
      surgeries: [
        {
          name: 'Functional Endoscopic Sinus Surgery (FESS)',
          description: 'Functional Endoscopic Sinus Surgery (FESS) is a minimally invasive procedure used to treat chronic sinus infections, nasal blockages, and breathing difficulties. Using an endoscope, surgeons access the sinus passages through the nostrils without external cuts. This approach helps clear obstructions, improve drainage, and restore normal sinus function. Patients experience reduced symptoms such as nasal congestion, headaches, and frequent infections. FESS is considered safe, precise, and effective, often resulting in quicker recovery and long-term relief from sinus problems.'
        },
        {
          name: 'Adenoidectomy',
          description: 'Adenoidectomy is the surgical removal of enlarged adenoids, small glands located at the back of the nose. Enlarged adenoids can cause breathing difficulties, snoring, ear infections, and recurrent sore throats. The procedure is performed through the mouth, without external incisions, making it minimally invasive. Adenoidectomy is especially common in children, helping improve airflow, reduce infections, and enhance overall quality of life. Recovery is usually quick, and patients can return to normal activities within a few days.'
        },
        {
          name: 'Mastoidectomy',
          description: 'Mastoidectomy is a surgical procedure performed to remove infected air cells from the mastoid bone, located behind the ear. It is usually recommended when chronic ear infections or cholesteatoma (abnormal skin growth) cause hearing loss, drainage, or pain. The surgery helps eliminate infection, prevent complications, and improve ear health. Depending on the severity, the surgeon may perform a simple or modified radical mastoidectomy. Post-surgery, patients often experience significant relief, better ear function, and reduced risk of recurrent infections.'
        },
        {
          name: 'Deviated Nasal Septum (DNS) Surgery / Septoplasty',
          description: 'DNS surgery, also called septoplasty, corrects a deviated nasal septum – a condition where the thin wall between nasal passages is displaced. A deviated septum can cause nasal obstruction, snoring, breathing issues, and recurrent sinus infections. The surgery involves straightening the septum to improve airflow and restore normal nasal function. Septoplasty is performed internally without visible scars and typically has a quick recovery. It provides long-lasting relief, better breathing, and improved quality of life for patients.'
        },
        {
          name: 'Tonsillectomy',
          description: 'Tonsillectomy is the surgical removal of the tonsils, which are small glands located at the back of the throat. It is commonly recommended for patients with recurrent tonsillitis, obstructive sleep apnea, difficulty swallowing, or chronic throat infections. The procedure is performed under general anesthesia and is safe and effective. Removing the tonsils helps prevent repeated infections, reduces sore throats, and improves breathing during sleep. Recovery usually takes one to two weeks, with long-term benefits for overall health.'
        },
        {
          name: 'Nasal Polypectomy',
          description: 'Nasal Polypectomy is a procedure to remove soft, painless growths called nasal polyps that develop in the lining of the nasal passages or sinuses. Polyps can cause nasal blockage, a reduced sense of smell, breathing problems, and frequent sinus infections. The surgery is performed using an endoscope for precision and minimal discomfort. By removing polyps, airflow improves, sinus infections decrease, and patients experience long-lasting relief from congestion and breathing issues. It is a safe and effective treatment option.'
        }
      ]
    },
    {
      name: 'Urology',
      color: '#8B5CF6',
      icon: '🔬',
      surgeries: [
        {
          name: 'Transurethral Resection of Prostate (TURP)',
          description: 'Transurethral Resection of the Prostate (TURP) is a gold-standard surgical procedure performed to treat urinary problems caused by an enlarged prostate, medically known as Benign Prostatic Hyperplasia (BPH). During the procedure, a special instrument called a resectoscope is inserted through the urethra, eliminating the need for external cuts. Excess prostate tissue that obstructs the urinary pathway is carefully removed to restore normal urine flow. TURP helps relieve symptoms such as frequent urination, urgency, incomplete bladder emptying, painful urination, and a weak urine stream. It significantly improves quality of life by reducing complications such as bladder infections and kidney damage, which are common if BPH is left untreated. The surgery is safe, effective, and widely practiced, with patients typically experiencing noticeable improvement within a short recovery period. TURP continues to be one of the most reliable and successful treatments for prostate enlargement worldwide.'
        },
        {
          name: 'Percutaneous Nephrolithotomy (PCNL)',
          description: 'Percutaneous Nephrolithotomy (PCNL) is an advanced minimally invasive surgery designed to remove large or complex kidney stones that cannot be treated through medication or simpler procedures. During PCNL, a small incision is made in the back to create a direct passage into the kidney. A nephroscope is then inserted, allowing the surgeon to locate and remove or break down the stones using laser or ultrasound energy. This approach avoids the need for open surgery while ensuring effective clearance of stones that may cause severe pain, recurrent urinary tract infections, or kidney damage if left untreated. PCNL is particularly beneficial for patients with stones larger than 2 cm, staghorn calculi, or stones resistant to other treatments. With advanced imaging guidance and modern surgical tools, the procedure is safe and highly effective. Patients generally recover quickly, experience relief from symptoms, and regain kidney function with minimal hospital stay.'
        },
        {
          name: 'DJ Stenting & DJ Stent Removal',
          description: 'DJ Stenting, also known as Double J Stent placement, is a urological procedure performed to relieve obstruction in the urinary tract and ensure smooth urine flow from the kidney to the bladder. It is commonly recommended for conditions such as kidney stones, ureteric strictures, tumors, or post-surgical swelling that block urine passage. The stent is a soft, flexible tube with curled ends that prevent migration and allow continuous drainage, protecting the kidneys from damage. Placement is done using minimally invasive endoscopic techniques, requiring no external incision. Once the underlying condition is treated or the obstruction resolves, DJ Stent Removal is performed as a simple daycare procedure, ensuring normal urinary function. Timely removal is crucial to avoid discomfort, infection, or encrustation. Both procedures are safe, effective, and play a vital role in preventing complications, protecting kidney health, and offering quick recovery with minimal hospital stay.'
        },
        {
          name: 'Urethroplasty',
          description: 'Urethroplasty is a specialized reconstructive surgery performed to treat urethral strictures, a condition where the urethra becomes narrowed due to scarring, injury, infection, or previous surgery. This narrowing obstructs urine flow, leading to painful urination, urinary retention, infections, or even kidney damage if left untreated. Urethroplasty provides a permanent solution by surgically removing the scarred segment or reconstructing the urethra using healthy tissue from surrounding areas, such as the buccal mucosa (inner cheek). Unlike temporary treatments like dilation or internal urethrotomy, urethroplasty offers long-term success with high cure rates. The surgery is tailored to the length and location of the stricture, ensuring restoration of normal urinary function. Recovery involves short hospitalization and catheter support until healing is complete. With advanced techniques and experienced surgeons, urethroplasty is a safe and highly effective procedure that greatly improves quality of life by relieving symptoms and preventing recurrent urinary problems.'
        },
        {
          name: 'Retrograde Intra-Renal Surgery (RIRS)',
          description: 'Retrograde Intra-Renal Surgery (RIRS) is a state-of-the-art, minimally invasive procedure used to treat kidney stones. Unlike traditional open surgery or percutaneous nephrolithotomy, RIRS involves no external incisions. This advanced technique is performed by guiding a flexible ureteroscope, a thin, lighted tube, through the natural urinary tract: the urethra, bladder, and ureter, directly into the kidney. Once the ureteroscope reaches the kidney, the surgeon can precisely locate and treat stones of various sizes and locations. A laser, typically a Holmium YAG laser, is passed through the scope to fragment the stones into tiny dust-like particles that are easily flushed out of the body in urine. This procedure is highly effective for stones that are difficult to reach with other methods, offering a safe and precise solution.'
        }
      ]
    },
    {
      name: 'Obstetrics and Gynaecology',
      color: '#EC4899',
      icon: '👶',
      surgeries: [
        {
          name: 'LSCS (Lower Segment Cesarean Section)',
          description: 'A Lower Segment Cesarean Section (LSCS) is a surgical procedure to deliver a baby through an incision in the mother\'s abdomen and uterus. This procedure is a vital and common practice in modern obstetrics, performed when a vaginal delivery would pose a risk to the mother or baby. Reasons for an LSCS can range from fetal distress, a baby in a breech or transverse position, or a mother\'s previous C-section. Our skilled surgical team ensures this procedure is performed with the utmost care and precision, focusing on the safety and well-being of both mother and child. We\'re equipped with state-of-the-art facilities to handle both planned and emergency cesarean sections, providing a controlled and sterile environment for a positive birth outcome. While it is a major surgery, advancements in medical care have made LSCS a highly safe procedure, with mothers typically experiencing a quick recovery and a safe arrival for their baby.'
        },
        {
          name: 'Normal Vaginal Deliveries',
          description: 'A Normal Vaginal Delivery (NVD) is the natural and most common method of childbirth. Our dedicated team of obstetricians, nurses, and support staff provides continuous, compassionate care throughout the labor and delivery process. We champion natural childbirth, guiding and empowering mothers every step of the way. This method of delivery offers numerous benefits for both mother and baby, including a faster recovery and shorter hospital stay for the mother, as well as a more natural transition for the baby as they pass through the birth canal. We focus on creating a supportive, safe, and empowering birth environment, utilizing medical intervention only when medically necessary. Our goal is to ensure a safe and memorable birthing experience for every family.'
        },
        {
          name: 'Vulval and Vaginal Abscess Drainage',
          description: 'A Vulval and Vaginal Abscess Drainage is a minor surgical procedure performed to treat a painful, pus-filled infection in the vulval or vaginal areas. These abscesses can form when a gland or hair follicle becomes blocked and infected, causing significant discomfort, swelling, and pain. The procedure is quick, effective, and provides immediate relief. It involves making a small incision in the abscess to allow the pus to drain completely. The area is then carefully cleaned to ensure the infection is fully resolved. This simple and safe procedure prevents the infection from worsening or spreading and promotes rapid healing. Patients can expect a swift recovery with minimal downtime, allowing them to quickly return to their normal daily activities without discomfort.'
        },
        {
          name: 'Laparoscopic Hysterectomy',
          description: 'A Laparoscopic Hysterectomy is a modern, minimally invasive procedure to remove the uterus. This advanced surgical technique has revolutionized gynecological surgery by offering a less invasive alternative to traditional open surgery. The procedure is performed through several small, keyhole incisions in the abdomen. A thin, lighted tube with a camera, called a laparoscope, is inserted through one incision, providing the surgeon with a clear, magnified view of the pelvic organs on a monitor. Specialized instruments are then used through the other incisions to carefully detach and remove the uterus. This method results in significantly less pain, minimal scarring, a shorter hospital stay, and a much faster recovery time, allowing patients to get back on their feet sooner.'
        },
        {
          name: 'Open TAH + BSO Tubectomy',
          description: 'An Open TAH (Total Abdominal Hysterectomy) + BSO (Bilateral Salpingo-Oophorectomy) is a comprehensive surgical procedure performed through a single, larger incision in the lower abdomen. This traditional, yet highly effective, approach is typically recommended for more complex gynecological conditions, such as large uterine fibroids, severe endometriosis, or cancer, where a minimally invasive approach may not be suitable. The surgery involves the removal of the uterus, both fallopian tubes, and both ovaries. This procedure allows the surgeon to address multiple issues in one operation, providing a definitive solution for various medical conditions. Often, it is also paired with a tubectomy (permanent sterilization), offering a lasting solution for family planning.'
        },
        {
          name: 'D&C (Dilation and Curettage)',
          description: 'A D&C, or Dilation and Curettage, is a common gynecological procedure used for both diagnostic and therapeutic purposes. It involves two primary steps: first, the cervix is gently dilated (opened), and then a special instrument called a curette is used to carefully scrape tissue from the inner lining of the uterus. This procedure can be performed to diagnose the cause of abnormal uterine bleeding, screen for uterine cancer, or to remove remaining tissue after a miscarriage or abortion. A D&C is typically a quick procedure performed under anesthesia, providing valuable diagnostic information and relief from painful or prolonged symptoms. It is a fundamental procedure that our gynecological specialists perform with precision and care.'
        },
        {
          name: 'Diagnostic Laparoscopic Sterilization',
          description: 'Diagnostic Laparoscopic Sterilization is a highly effective, permanent method of contraception. This minimally invasive procedure is performed with a laparoscope, a thin, lighted camera inserted through a small incision near the navel. This allows the surgeon to clearly view the pelvic organs. The fallopian tubes are then either sealed or blocked with clips, bands, or by cauterizing them, which prevents eggs from traveling to the uterus. This surgical method is a reliable and safe option for women who are certain they do not want future pregnancies. The laparoscopic approach ensures minimal scarring, a short recovery period, and a very high rate of success, making it a popular choice for permanent birth control.'
        },
        {
          name: 'MTP (Medical Termination of Pregnancy)',
          description: 'MTP, or Medical Termination of Pregnancy, is a safe and legal procedure for ending a pregnancy. Our hospital provides these services with the utmost care, confidentiality, and medical expertise. The procedure can be performed using medication or through a minor surgical procedure, depending on the stage of pregnancy and other medical factors. Our compassionate and experienced gynecological team ensures that the procedure is carried out safely and professionally, prioritizing the patient\'s physical and emotional well-being. We offer a safe and supportive environment for women seeking this service, with comprehensive medical consultation to guide them through the process.'
        },
        {
          name: 'IUCD Insertions for Contraception',
          description: 'IUCD stands for Intrauterine Contraceptive Device, and it is a highly effective, long-lasting, and reversible form of birth control. The insertion of an IUCD is a quick, outpatient procedure performed by a gynecologist. A small, T-shaped device is carefully placed directly into the uterus, where it can prevent pregnancy for several years. This method offers a convenient and reliable solution for family planning, as it does not require any daily maintenance. Our team provides expert consultation to help you choose the right type of IUCD for your needs and ensures a comfortable and safe insertion process.'
        }
      ]
    },
    {
      name: 'General Surgery',
      color: '#10B981',
      icon: '⚕️',
      surgeries: [
        {
          name: 'Advanced Laparoscopic Surgeries',
          description: 'Our hospital specializes in Advanced Laparoscopic Surgeries, which are modern, minimally invasive procedures. Unlike traditional open surgery that requires a large incision, these surgeries are performed through several small, "keyhole" incisions. A laparoscope, a thin instrument with a camera, provides the surgeon with a magnified view of the internal organs on a screen. This allows for precise and delicate operations. The benefits of this advanced approach are significant: patients experience less pain, have a reduced risk of infection, and enjoy a much faster recovery time with minimal scarring. We use this technique for a wide range of procedures, ensuring excellent outcomes with less disruption to your life.'
        },
        {
          name: 'Bariatric Surgeries',
          description: 'Bariatric Surgeries are a series of life-changing procedures for individuals struggling with severe obesity. These surgeries work by altering the digestive system to help patients achieve significant and sustainable weight loss. Our team offers various procedures, including gastric bypass and sleeve gastrectomy, tailored to each patient\'s unique needs. Beyond weight loss, bariatric surgery can lead to the resolution or significant improvement of obesity-related health conditions such as type 2 diabetes, high blood pressure, and sleep apnea. These surgeries are a crucial step toward a healthier life and are performed with the highest standards of safety and care.'
        },
        {
          name: 'Upper Gastrointestinal Surgeries',
          description: 'Our surgeons are highly skilled in performing complex Upper Gastrointestinal Surgeries to treat diseases of the esophagus, stomach, and small intestine. These conditions can include tumors, ulcers, and reflux disease. We use a combination of advanced open and minimally invasive laparoscopic techniques to address these issues with precision. Our goal is to alleviate symptoms, improve organ function, and enhance the patient\'s overall quality of life. From routine procedures to complex resections, our team provides comprehensive care, ensuring each patient receives a tailored treatment plan for the best possible outcome.'
        },
        {
          name: 'Colorectal Surgeries',
          description: 'Our Colorectal Surgeries focus on the diagnosis and treatment of conditions affecting the colon, rectum, and anus. We offer a full spectrum of procedures for diseases such as colon and rectal cancer, inflammatory bowel disease (Crohn\'s disease and ulcerative colitis), and diverticulitis. Our surgeons are proficient in both open and minimally invasive laparoscopic techniques to perform colectomies (removal of part of the colon) and other complex procedures. We are committed to providing personalized care, using the latest advancements to minimize recovery time and improve long-term prognosis for our patients.'
        },
        {
          name: 'Biliary and Pancreatic Surgeries',
          description: 'We specialize in advanced Biliary and Pancreatic Surgeries to treat diseases of the liver, gallbladder, bile ducts, and pancreas. Conditions we address include gallstones, pancreatitis, and tumors in these organs. Our surgeons utilize both traditional open and sophisticated laparoscopic techniques, such as a cholecystectomy for gallbladder removal, to provide effective solutions. These complex procedures require a high level of expertise, and our team is committed to delivering precise, safe, and compassionate care. Our goal is to restore normal function and improve the quality of life for patients with these challenging conditions.'
        },
        {
          name: 'Giant Hernia Surgery (ACST, TAR)',
          description: 'Giant Hernia Surgery is a specialized and highly complex procedure designed to repair large and difficult-to-treat hernias. These hernias are often recurrent, very large, or located in challenging areas, and they may not be suitable for standard repair. Our surgeons are experts in advanced techniques like ACST (Anterior Component Separation with Transversus Abdominis Release) and TAR (Transversus Abdominis Release). These procedures involve carefully separating muscle layers to provide enough tissue to close the abdominal wall defect without tension. This approach offers a robust and durable repair, significantly reducing the risk of recurrence and improving the patient\'s long-term quality of life.'
        },
        {
          name: 'Anorectal Surgery',
          description: 'Our Anorectal Surgery services provide specialized treatment for a wide range of conditions affecting the anus and rectum. Our compassionate and experienced team understands the sensitive nature of these issues, offering a confidential environment and effective care. We address common and complex problems, including hemorrhoids, anal fissures, fistulas, and pilonidal sinus. Using both traditional and cutting-edge techniques, we aim to provide lasting relief from pain, bleeding, and discomfort. Our approach is tailored to each patient, focusing on a comfortable and speedy recovery so you can return to your normal life.'
        },
        {
          name: 'Piles Surgery',
          description: 'Piles, also known as hemorrhoids, are a common and often painful condition. Our hospital offers a variety of surgical options for treating piles, from minimally invasive procedures to traditional hemorrhoidectomy. The choice of surgery depends on the severity of the condition. Our surgeons are experts in providing effective, lasting relief from the pain, itching, and bleeding associated with hemorrhoids. We prioritize patient comfort and a swift recovery, helping you get back to your daily routine without the burden of this condition.'
        },
        {
          name: 'Anal Fissure',
          description: 'An Anal Fissure is a small tear in the lining of the anus that can cause significant pain and bleeding, especially during bowel movements. While many fissures can heal with non-surgical treatment, chronic or persistent cases often require surgical intervention. Our specialists are proficient in procedures such as a lateral internal sphincterotomy, which is a highly effective way to relieve muscle spasms and promote healing. This procedure is a quick and straightforward solution that offers long-term relief from a painful and recurring condition.'
        },
        {
          name: 'Anal Fistula',
          description: 'An Anal Fistula is a small tunnel that develops between the end of the bowel and the skin near the anus, often as a result of an infection. This condition can be painful and lead to persistent drainage. Our surgeons are experts in treating anal fistulas with a range of techniques aimed at closing the tunnel and preventing recurrence while preserving the anal sphincter muscle. We use both traditional methods and advanced approaches to ensure a successful outcome, providing patients with lasting relief and improved quality of life.'
        },
        {
          name: 'Pilonidal Sinus (EPSIT, Laser, Flaps)',
          description: 'A Pilonidal Sinus is a small tunnel or tract in the skin, typically located at the top of the buttocks, that can become infected. Our hospital offers a variety of advanced and minimally invasive treatments for this condition. We are proficient in innovative techniques such as EPSIT (Endoscopic Pilonidal Sinus Treatment), which uses an endoscope to clean the sinus tract, and laser ablation, which seals the tract with laser energy. For more complex cases, we also perform flaps, a type of reconstructive surgery to remove the sinus and close the wound with a healthy tissue flap. These advanced methods lead to less pain, faster healing, and a lower risk of recurrence.'
        }
      ]
    },
    {
      name: 'Neuro Surgery',
      color: '#3B82F6',
      icon: '🧠',
      surgeries: [
        {
          name: 'Craniotomy',
          description: 'A Craniotomy is a surgical procedure to temporarily remove a piece of the skull bone to access the brain. This is often the first step in treating various brain conditions, including tumors, aneurysms, blood clots, or skull fractures. The surgeon carefully removes a "bone flap" and, after the procedure on the brain is complete, replaces it and secures it in place. While this is a major surgery, advancements in technology have made it much safer and more precise. The procedure allows surgeons to remove tumors, clip aneurysms, or relieve pressure on the brain. A craniotomy is a critical intervention that can significantly improve or save a patient\'s life by addressing the underlying neurological issue.'
        },
        {
          name: 'Keyhole Surgeries',
          description: 'Keyhole Surgery in neurosurgery refers to a set of minimally invasive techniques that allow surgeons to operate on the brain through very small incisions or natural openings like the nostrils. This approach is named for the small, precise opening it creates, much like a keyhole. This method often involves the use of high-definition cameras and specialized instruments to navigate delicate brain structures with minimal disruption to surrounding tissue. Benefits include less pain, reduced blood loss, minimal scarring, and a much faster recovery time compared to traditional open craniotomies. It is often used for conditions such as pituitary tumors, certain types of brain tumors, and aneurysms.'
        },
        {
          name: 'Minimally Invasive Spine Surgery',
          description: 'Minimally Invasive Spine Surgery (MISS) is a modern approach to treating a variety of spinal conditions, including herniated discs, spinal stenosis, and tumors. Unlike traditional open spine surgery, which requires a large incision and significant muscle cutting, MISS uses small incisions and specialized tools to access the spine. The surgeon works through a small tube-like retractor that gently pushes muscles aside rather than cutting them. This results in less blood loss, reduced muscle damage, less post-operative pain, and a much shorter hospital stay. MISS allows for a faster recovery, helping patients return to their normal activities sooner.'
        }
      ]
    },
    {
      name: 'Gastroenterology',
      color: '#F59E0B',
      icon: '🫀',
      surgeries: [
        {
          name: 'Endoscopy',
          description: 'An endoscopy is a minimally invasive procedure that uses an endoscope—a flexible, lighted tube with a camera—to visually examine the upper part of your digestive system, which includes the esophagus, stomach, and the beginning of the small intestine. This procedure is used to diagnose and sometimes treat a wide range of conditions, such as ulcers, gastritis, celiac disease, and gastroesophageal reflux disease (GERD). During the procedure, the gastroenterologist can also perform a biopsy (taking a small tissue sample), or remove polyps. An endoscopy is a safe and effective way to get a direct view of the digestive tract without requiring major surgery, helping to identify and address issues with minimal discomfort and a quick recovery.'
        },
        {
          name: 'Colonoscopy',
          description: 'A colonoscopy is a vital diagnostic and screening procedure that examines the entire length of the large intestine (colon) and rectum. It uses a thin, flexible tube called a colonoscope, which has a camera on its tip, to view the intestinal lining. This procedure is the gold standard for detecting early signs of colorectal cancer, such as polyps, which can be removed during the same procedure. A colonoscopy can also help diagnose other conditions like inflammatory bowel disease (Crohn\'s disease or ulcerative colitis), diverticulosis, and bleeding in the colon. It is a highly effective way to prevent colorectal cancer and manage various intestinal conditions with a high degree of accuracy.'
        },
        {
          name: 'EVL Banding',
          description: 'EVL (Esophageal Variceal Ligation) banding is a specific endoscopic procedure used to treat enlarged veins in the esophagus, known as esophageal varices. These enlarged veins are often a complication of severe liver disease and can be at risk of rupturing and cause life-threatening bleeding. During the procedure, a gastroenterologist uses an endoscope to place small rubber bands directly onto the varices. The bands effectively cut off blood flow to the veins, causing them to shrink and eventually fall off. This procedure is highly effective in preventing active bleeding and is a crucial, life-saving intervention for patients with advanced liver disease.'
        },
        {
          name: 'ERCP (Endoscopic Retrograde Cholangiopancreatography)',
          description: 'ERCP (Endoscopic Retrograde Cholangiopancreatography) is an advanced endoscopic procedure that combines endoscopy with X-ray imaging to diagnose and treat problems in the bile ducts, gallbladder, and pancreas. During the procedure, a special endoscope is guided through the stomach to the small intestine. A thin tube is then inserted into the bile or pancreatic ducts, and a contrast dye is injected to make the ducts visible on an X-ray. This allows the doctor to identify blockages, gallstones, tumors, or other abnormalities. The procedure is also therapeutic, as it allows for the removal of gallstones, placement of stents, or drainage of blocked ducts without the need for open surgery.'
        }
      ]
    }
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    window.scrollTo(0, 0);
    this.initializeForm();
  }

  ngOnInit() {
    this.setDefaultMetaTags();
    this.filterSurgeries();
  }

  initializeForm() {
    this.appointmentForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emailId: [''],
      location: ['', Validators.required],
      department: [''],
      message: ['']
    });
  }

  private setDefaultMetaTags() {
    this.titleService.setTitle('Key Surgeries - OMNI Hospitals | Expert Surgical Care');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Explore comprehensive surgical procedures at OMNI Hospitals. From orthopedics to cardiology, our expert surgeons provide advanced surgical care across multiple specialties.' 
    });
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'key surgeries, surgical procedures, orthopedics, cardiology, neurosurgery, urology, OMNI hospitals, Hyderabad, surgical care' 
    });
  }

  selectDepartment(departmentName: string) {
    this.selectedDepartment = departmentName;
    this.filterSurgeries();
    this.updateMetaTagsForDepartment(departmentName);
  }

  private filterSurgeries() {
    const selectedDept = this.departments.find(dept => dept.name === this.selectedDepartment);
    this.filteredSurgeries = selectedDept ? selectedDept.surgeries : [];
  }

  private updateMetaTagsForDepartment(department: string) {
    const dept = this.departments.find(d => d.name === department);
    if (dept) {
      const surgeryNames = dept.surgeries.map(s => s.name).join(', ');
      this.titleService.setTitle(`${department} Surgeries - OMNI Hospitals | Expert Surgical Care`);
      this.metaService.updateTag({ 
        name: 'description', 
        content: `Expert ${department.toLowerCase()} surgical procedures at OMNI Hospitals: ${surgeryNames}. Book your consultation today.` 
      });
      this.metaService.updateTag({ 
        name: 'keywords', 
        content: `${department.toLowerCase()}, surgical procedures, ${surgeryNames}, OMNI hospitals, expert surgeons` 
      });
    }
  }

  getDepartmentColor(departmentName: string): string {
    const dept = this.departments.find(d => d.name === departmentName);
    return dept ? dept.color : '#8B5CF6';
  }

  getDepartmentIcon(departmentName: string): string {
    const dept = this.departments.find(d => d.name === departmentName);
    return dept ? dept.icon : '⚕️';
  }

  trackBySurgery(index: number, surgery: Surgery): string {
    return surgery.name;
  }

  // Appointment Modal Methods
  openAppointmentModal() {
    this.showAppointmentModal = true;
  }

  closeAppointmentModal() {
    this.showAppointmentModal = false;
  }

  submitAppointmentForm() {
    if (this.appointmentForm.invalid) {
      this.notification.error('Please fill in all required fields.');
      return;
    }

    const formData = this.appointmentForm.value;

    // Prevent duplicate submission for 30 minutes
    const lastSubmission = localStorage.getItem('lastSubmission');
    if (lastSubmission) {
      const { name, phone, time } = JSON.parse(lastSubmission);
      const thirtyMinutes = 30 * 60 * 1000;
      const now = Date.now();

      if (
        name === formData.fullName.trim() &&
        phone === formData.phoneNumber.trim() &&
        now - time < thirtyMinutes
      ) {
        this.notification.info('You have already submitted a request with this name and phone number in the last 30 minutes.');
        return;
      }
    }

    const payload = [
      { Attribute: "FirstName", Value: formData.fullName },
      { Attribute: "Phone", Value: formData.phoneNumber },
      { Attribute: "EmailAddress", Value: formData.emailId },
      { Attribute: "mx_City", Value: formData.location },
      { Attribute: "mx_Department", Value: formData.department },
      { Attribute: "Description", Value: formData.message },
      { Attribute: "Source", Value: "Website - Key Surgeries" }
    ];

    const accessKey = environment.leadsquared.accessKey;
    const secretKey = environment.leadsquared.secretKey;
    const api_url_base = environment.leadsquared.baseUrl;
    const url = `${api_url_base}LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

    this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (res) => {
          console.log('LeadSquared Success:', res);
          // alert('Your appointment request has been submitted successfully!');

          // Save last submission info for 30-minute check
          localStorage.setItem('lastSubmission', JSON.stringify({
            name: formData.fullName.trim(),
            phone: formData.phoneNumber.trim(),
            time: Date.now()
          }));

          // Reset form and close modal
          this.appointmentForm.reset();
          this.closeAppointmentModal();
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('LeadSquared Error:', err);
          this.notification.error('There was a problem submitting your request.');
        }
      });
  }

  goToDoctors() {
    this.router.navigate(['/our-doctors']);
  }
}
