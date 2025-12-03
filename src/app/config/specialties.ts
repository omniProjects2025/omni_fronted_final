export const specialtiesMap: { [location: string]: string[] } = {
  Kothapet: [
    'Orthopedics', 'Cardiology', 'Neurology', 'Gastroenterology', 'General Surgery', 'General Medicine', 'Obstetrics and Gynecology', 'Emergency and Critical Care', 'Dermatology', 'Microbiology', 'Nephrology', 'Neonatology', 'Pathology', 'Plastic Surgery', 'Pulmonology', 'Radiology', 'Urology', 'ENT'
  ],
  Kukatpally: [
    'Orthopedics', 'Cardiology', 'Neurology', 'Emergency and Critical Care', 'General Medicine', 'Gastroenterology', 'Obstetrics and Gynecology', 'Urology', 'Dermatology', 'Psychiatry', 'Pulmonology', 'Oncology', 'Nephrology', 'Plastic Surgery', 'ENT', 'General Surgery'
  ],
  'Udai Omni': [
    'Orthopedics', 'Cardiology', 'General Medicine', 'Plastic Surgery', 'Oncology', 'General Surgery', 'Nephrology'
  ],
  Vizag: [
    'Orthopedics', 'Neurology', 'Cardiology', 'General Surgery', 'Obstetrics and Gynecology', 'Emergency and Critical Care', 'Pediatrics', 'Neonatology'
  ],
  Kurnool: [
    'Cardiology', 'Urology'
  ]
};

export const allDepartments: string[] = Array.from(
  new Set(Object.values(specialtiesMap).flat())
).sort();

export function getDepartmentsFor(location: string): string[] {
  if (!location) return [];
  const foundKey = Object.keys(specialtiesMap).find(k => k.toLowerCase() === location.toLowerCase());
  return foundKey ? specialtiesMap[foundKey] : [];
}
