import { Component } from '@angular/core';
import { CanonicalService } from '../services/canonical.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-our-empanelment',
  templateUrl: './our-empanelment.component.html',
  styleUrls: ['./our-empanelment.component.css']
})
export class OurEmpanelmentComponent {
  logos = [
    'medi_asist.svg', 'care.svg', 'chola_ms.svg', 'digit.svg',
    'eriscon.svg', 'eva.svg', 'hdfc.svg', 'health_india.svg',
    'health_tpa.svg', 'helth_welth.svg', 'heriatge_insurance.svg', 'md_india.svg',
    'medsave.svg', 'national_insurance.svg', 'niva_health.svg', 'safe_way_insurance.svg',
    'sbi_general.svg', 'start_personal_caring.svg', 'tata_aig.svg',
    'the_new_india.svg', 'vipul_medcorp_insurance.svg', 'icici_lombard_insurance.svg', 'iffco_tikko.svg',
    'magma_hma.svg', 'manipal_cigna.svg', 'royal_sunsaram_insurance.svg', 'united_india_insurance.svg',
    'All Insurance Logos For Website_Medvantage.svg', 'good_health.svg', 'paramount_health.svg', 'raksha_health.svg', 'vidal_health_insurence_logo.svg',
    'vipul_medicorp.svg', 'aditya_birla.svg', 'future_cenerali.svg', 'genins_india_insurance.svg', 'libarty_health_insurance.svg', 'oriental_insurance.svg', 'park_mediclaim.svg', 'phpl_behind.svg', 'relaince_general_insurance.svg', 'univeral_sompo.svg', 'NFC_logo.png'
  ];

  constructor(private titleService: Title, private metaService: Meta, private canonicalService: CanonicalService) { }
  ngOnInit(): void {
    this.setSEOTags();
  }

  private setSEOTags(): void {
    this.titleService.setTitle('ESIC & CGHS Empanelled Hospitals in Kukatpally, Hyderabad');
    this.metaService.updateTag({
      name: 'description',
      content: 'Find OMNI Hospitals, the ESIC and CGHS empanelled hospital in Kukatpally, Hyderabad. Get hassle-free, cashless treatment under major government schemes.'
    });
    this.canonicalService.setCanonicalUrl('/');
  }

}
