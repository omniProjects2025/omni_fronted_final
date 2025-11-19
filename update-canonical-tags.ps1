# PowerShell script to automatically update all Angular components with canonical tags
# Run this script from the project root directory

Write-Host "🚀 Starting canonical tags update script..." -ForegroundColor Green
Write-Host ""

# Configuration
$ComponentsDir = ".\src\app"
$ExcludedDirs = @("services", "base", "config", "interceptors", "pipes", "utils", "styles", "smartbot", "privacy-policy")
$ExcludedFiles = @("app.component.ts", "app.module.ts", "app-routing.module.ts", "common-pages.module.ts", "custom-route-reuse-strategy.ts")

# SEO Configuration
$SEOConfig = @{
    "home" = @{
        title = "OMNI Hospitals - Best Multispecialty Hospital in Hyderabad | Expert Medical Care"
        description = "OMNI Hospitals - Leading multispecialty hospital in Hyderabad offering expert medical care across cardiology, orthopedics, neurology, and more. Book your appointment today."
        keywords = "OMNI hospitals, multispecialty hospital Hyderabad, cardiology, orthopedics, neurology, nephrology, best hospital Hyderabad, medical care Andhra Pradesh, Telangana"
        canonicalPath = "/"
    }
    "about-us" = @{
        title = "About Us - OMNI Hospitals | Leading Healthcare Provider in Hyderabad"
        description = "Learn OMNI Hospitals' mission, vision, and commitment to delivering world-class healthcare services. We operate in multiple locations across AP and Telangana."
        keywords = "about OMNI hospitals, healthcare provider Hyderabad, hospital mission vision, medical excellence, Andhra Pradesh Telangana healthcare"
        canonicalPath = "/about-us"
    }
    "our-specialities" = @{
        title = "Our Specialities - OMNI Hospitals | Best Multispecialty Hospital in Hyderabad"
        description = "Discover comprehensive medical specialties at OMNI Hospitals. From cardiology to orthopedics, we offer expert care across multiple locations in Andhra Pradesh and Telangana."
        keywords = "medical specialties, cardiology, orthopedics, neurology, nephrology, OMNI hospitals, Hyderabad, Andhra Pradesh, Telangana"
        canonicalPath = "/our-specialities"
    }
    "our-specialities-details" = @{
        title = "Speciality Details - OMNI Hospitals | Expert Medical Specialists"
        description = "Detailed information about our medical specialties and expert doctors at OMNI Hospitals. Comprehensive care across multiple medical disciplines."
        keywords = "medical specialty details, expert doctors, specialist care, OMNI hospitals specialties"
        canonicalPath = "/our-specialities-details"
    }
    "doctors" = @{
        title = "Find the best doctor at OMNI Hospitals"
        description = "Find the best doctor at OMNI Hospitals. Search experienced specialists in Cardiology, Orthopedics, Neurology, and more across all our hospital locations."
        keywords = "OMNI doctors, medical professionals, expert physicians, specialist doctors Hyderabad, healthcare team"
        canonicalPath = "/doctors"
    }
    "doctor-details" = @{
        title = "Doctor Profile - OMNI Hospitals | Expert Medical Specialist"
        description = "Detailed profile of our expert medical specialist at OMNI Hospitals. Qualifications, experience, and areas of expertise."
        keywords = "doctor profile, medical specialist, physician details, OMNI hospitals doctor"
        canonicalPath = "/doctor-details"
    }
    "our-branches" = @{
        title = "Our Branches - OMNI Hospitals | Multiple Locations Across Andhra Pradesh & Telangana"
        description = "Find OMNI Hospitals branches across multiple locations in Andhra Pradesh and Telangana. Convenient healthcare access near you."
        keywords = "OMNI hospitals branches, hospital locations, Andhra Pradesh hospitals, Telangana hospitals, healthcare locations"
        canonicalPath = "/our-branches"
    }
    "health-checkup" = @{
        title = "Health Checkup Packages - OMNI Hospitals | Comprehensive Medical Screening"
        description = "Comprehensive health checkup packages at OMNI Hospitals. Preventive healthcare screening for early detection and better health outcomes."
        keywords = "health checkup packages, medical screening, preventive healthcare, comprehensive health check, OMNI hospitals"
        canonicalPath = "/health-checkup"
    }
    "package-details" = @{
        title = "Health Package Details - OMNI Hospitals | Detailed Medical Screening Packages"
        description = "Detailed information about our health checkup packages and medical screening services at OMNI Hospitals."
        keywords = "health package details, medical screening packages, health checkup details, OMNI hospitals packages"
        canonicalPath = "/package-details"
    }
    "fixed-surgical-packages" = @{
        title = "Fixed Surgical Packages - OMNI Hospitals | Transparent Pricing for Surgeries"
        description = "Transparent fixed surgical packages at OMNI Hospitals. No hidden costs, comprehensive surgical care with clear pricing."
        keywords = "fixed surgical packages, transparent pricing, surgical costs, OMNI hospitals surgery packages"
        canonicalPath = "/fixed-surgical-packages"
    }
    "fixed-surgery-details" = @{
        title = "Surgery Details - OMNI Hospitals | Detailed Surgical Package Information"
        description = "Detailed information about our fixed surgical packages and procedures at OMNI Hospitals."
        keywords = "surgery details, surgical package information, surgical procedures, OMNI hospitals surgery"
        canonicalPath = "/fixed-surgery-details"
    }
    "second-opinion" = @{
        title = "Second Opinion - OMNI Hospitals | Expert Medical Second Opinion Service"
        description = "Get expert second opinion from our medical specialists at OMNI Hospitals. Professional medical consultation for better healthcare decisions."
        keywords = "second opinion, medical consultation, expert opinion, healthcare second opinion, OMNI hospitals"
        canonicalPath = "/second-opinion"
    }
    "key-surgeries" = @{
        title = "Key Surgeries - OMNI Hospitals | Advanced Surgical Procedures"
        description = "Advanced surgical procedures and key surgeries performed at OMNI Hospitals by expert surgeons."
        keywords = "key surgeries, advanced surgical procedures, expert surgeons, OMNI hospitals surgery"
        canonicalPath = "/key-surgeries"
    }
    "patient-care" = @{
        title = "Patient Care - OMNI Hospitals | Comprehensive Patient Services"
        description = "Comprehensive patient care services at OMNI Hospitals. From admission to discharge, we ensure the best patient experience."
        keywords = "patient care, patient services, healthcare experience, OMNI hospitals patient care"
        canonicalPath = "/patient-care"
    }
    "book-an-appointment" = @{
        title = "Book Appointment - OMNI Hospitals | Schedule Your Medical Consultation"
        description = "Book your medical appointment with expert doctors at OMNI Hospitals. Easy online appointment booking for quality healthcare."
        keywords = "book appointment, medical consultation booking, doctor appointment, OMNI hospitals appointment"
        canonicalPath = "/book-an-appointment"
    }
    "technologies" = @{
        title = "Medical Technologies - OMNI Hospitals | Advanced Healthcare Technology"
        description = "Advanced medical technologies and state-of-the-art equipment at OMNI Hospitals for superior healthcare delivery."
        keywords = "medical technologies, advanced healthcare technology, medical equipment, OMNI hospitals technology"
        canonicalPath = "/technologies"
    }
    "technologies-details" = @{
        title = "Technology Details - OMNI Hospitals | Detailed Medical Technology Information"
        description = "Detailed information about our advanced medical technologies and equipment at OMNI Hospitals."
        keywords = "technology details, medical technology information, advanced equipment, OMNI hospitals tech"
        canonicalPath = "/technologies-details"
    }
    "news-media" = @{
        title = "News & Media - OMNI Hospitals | Latest Healthcare News & Updates"
        description = "Latest news, media coverage, and healthcare updates from OMNI Hospitals. Stay informed about our medical achievements and services."
        keywords = "OMNI hospitals news, healthcare news, medical updates, hospital media coverage"
        canonicalPath = "/news-media"
    }
    "news-media-details" = @{
        title = "News Details - OMNI Hospitals | Detailed News & Media Information"
        description = "Detailed news and media information from OMNI Hospitals."
        keywords = "news details, media information, OMNI hospitals news details"
        canonicalPath = "/news-media-details"
    }
    "blogs" = @{
        title = "Health Blogs - OMNI Hospitals | Expert Medical Articles & Health Tips"
        description = "Expert medical articles, health tips, and healthcare insights from OMNI Hospitals medical professionals."
        keywords = "health blogs, medical articles, health tips, healthcare insights, OMNI hospitals blog"
        canonicalPath = "/blogs"
    }
    "blogs-details" = @{
        title = "Blog Details - OMNI Hospitals | Detailed Medical Articles"
        description = "Detailed medical articles and health information from OMNI Hospitals."
        keywords = "blog details, medical articles details, health information, OMNI hospitals blog details"
        canonicalPath = "/blogs-details"
    }
    "blogs-details-data" = @{
        title = "Blog Data - OMNI Hospitals | Medical Blog Information"
        description = "Medical blog data and information from OMNI Hospitals."
        keywords = "blog data, medical blog information, OMNI hospitals blog data"
        canonicalPath = "/blogs-details-data"
    }
    "board-members" = @{
        title = "Board Members - OMNI Hospitals | Leadership Team & Medical Directors"
        description = "Meet our board members and leadership team at OMNI Hospitals. Experienced medical professionals leading healthcare excellence."
        keywords = "board members, leadership team, medical directors, OMNI hospitals leadership"
        canonicalPath = "/board-members"
    }
    "careers" = @{
        title = "Careers - OMNI Hospitals | Join Our Healthcare Team"
        description = "Join our healthcare team at OMNI Hospitals. Career opportunities for medical professionals and healthcare staff."
        keywords = "OMNI hospitals careers, healthcare jobs, medical careers, hospital employment"
        canonicalPath = "/careers"
    }
    "our-empanelment" = @{
        title = "Our Empanelment - OMNI Hospitals | Insurance & Corporate Partnerships"
        description = "Insurance empanelment and corporate partnerships at OMNI Hospitals. Comprehensive healthcare coverage options."
        keywords = "insurance empanelment, corporate partnerships, healthcare coverage, OMNI hospitals empanelment"
        canonicalPath = "/our-empanelment"
    }
    "contact-us" = @{
        title = "Contact Us - OMNI Hospitals | Get in Touch for Healthcare Services"
        description = "Contact OMNI Hospitals for healthcare services, appointments, and inquiries. Multiple ways to reach our medical team."
        keywords = "contact OMNI hospitals, healthcare contact, hospital inquiry, medical services contact"
        canonicalPath = "/contact-us"
    }
    "feedback" = @{
        title = "Feedback - OMNI Hospitals | Share Your Healthcare Experience"
        description = "Share your feedback and healthcare experience with OMNI Hospitals. Help us improve our medical services."
        keywords = "OMNI hospitals feedback, healthcare feedback, patient experience, medical service feedback"
        canonicalPath = "/feedback"
    }
    "privacy-polocy" = @{
        title = "Privacy Policy - OMNI Hospitals | Patient Privacy & Data Protection"
        description = "Privacy policy and data protection information for patients at OMNI Hospitals."
        keywords = "privacy policy, data protection, patient privacy, OMNI hospitals privacy"
        canonicalPath = "/privacy-polocy"
    }
    "terms-conditions" = @{
        title = "Terms & Conditions - OMNI Hospitals | Healthcare Service Terms"
        description = "Terms and conditions for healthcare services at OMNI Hospitals."
        keywords = "terms conditions, healthcare service terms, OMNI hospitals terms"
        canonicalPath = "/terms-conditions"
    }
    "thank-you" = @{
        title = "Thank You - OMNI Hospitals | Appreciation for Choosing Our Healthcare"
        description = "Thank you for choosing OMNI Hospitals for your healthcare needs."
        keywords = "thank you, OMNI hospitals appreciation, healthcare gratitude"
        canonicalPath = "/thank-you"
    }
}

# Function to check if component already has canonical tags
function Test-HasCanonicalTags {
    param([string]$Content)
    
    return ($Content -match "CanonicalService") -and 
           ($Content -match "setCanonicalUrl") -and 
           ($Content -match "Title") -and 
           ($Content -match "Meta")
}

# Function to add imports
function Add-Imports {
    param([string]$Content)
    
    $newContent = $Content
    
    # Add Title and Meta imports if not present
    if ($newContent -notmatch "Title, Meta") {
        if ($newContent -match "from '@angular/platform-browser'") {
            # Already has platform-browser import, add to it
            if ($newContent -notmatch "Title") {
                $newContent = $newContent -replace "from '@angular/platform-browser'", "from '@angular/platform-browser'"
            }
        } else {
            # Add new import
            $lastImport = ($newContent | Select-String "import.*from.*['`"];" | Select-Object -Last 1).Line
            if ($lastImport) {
                $newImports = "`nimport { Title, Meta } from '@angular/platform-browser';`nimport { CanonicalService } from '../services/canonical.service';"
                $newContent = $newContent -replace [regex]::Escape($lastImport), "$lastImport$newImports"
            }
        }
    }
    
    return $newContent
}

# Function to add OnInit interface
function Add-OnInitInterface {
    param([string]$Content)
    
    $newContent = $Content
    
    if ($newContent -notmatch "OnInit") {
        # Add OnInit to imports
        $newContent = $newContent -replace "import { Component", "import { Component, OnInit"
        
        # Add OnInit to class declaration
        $classMatch = $newContent | Select-String "export class \w+Component[^{]*{" | Select-Object -First 1
        if ($classMatch) {
            $classDeclaration = $classMatch.Line
            if ($classDeclaration -notmatch "OnInit") {
                $newClassDeclaration = $classDeclaration -replace "Component", "Component implements OnInit"
                $newContent = $newContent -replace [regex]::Escape($classDeclaration), $newClassDeclaration
            }
        }
    }
    
    return $newContent
}

# Function to add constructor
function Add-Constructor {
    param([string]$Content, [string]$ComponentName)
    
    $newContent = $Content
    
    # Check if constructor already exists
    if ($newContent -match "constructor\s*\(") {
        # Add services to existing constructor
        $constructorMatch = $newContent | Select-String "constructor\s*\([^)]*\)\s*{" | Select-Object -First 1
        if ($constructorMatch) {
            $constructor = $constructorMatch.Line
            if ($constructor -notmatch "CanonicalService") {
                # Add services to constructor parameters
                $newConstructor = $constructor -replace "\) \{", "),`n    private titleService: Title,`n    private metaService: Meta,`n    private canonicalService: CanonicalService`n  ) {"
                $newContent = $newContent -replace [regex]::Escape($constructor), $newConstructor
            }
        }
    } else {
        # Add new constructor
        $classMatch = $newContent | Select-String "export class \w+Component[^{]*{" | Select-Object -First 1
        if ($classMatch) {
            $classDeclaration = $classMatch.Line
            $constructor = "`n  constructor(`n    private titleService: Title,`n    private metaService: Meta,`n    private canonicalService: CanonicalService`n  ) {}"
            $newContent = $newContent -replace [regex]::Escape($classDeclaration), "$classDeclaration$constructor"
        }
    }
    
    return $newContent
}

# Function to add ngOnInit and SEO methods
function Add-SEOMethods {
    param([string]$Content, [string]$ComponentName)
    
    $seoData = $SEOConfig[$ComponentName]
    if (-not $seoData) {
        Write-Host "⚠️  No SEO data found for component: $ComponentName" -ForegroundColor Yellow
        return $Content
    }

    $newContent = $Content

    # Check if ngOnInit already exists
    if ($newContent -notmatch "ngOnInit\(\)") {
        $ngOnInit = "`n  ngOnInit(): void {`n    this.setSEOTags();`n  }"
        
        # Add after constructor
        $constructorMatch = $newContent | Select-String "constructor\s*\([^)]*\)\s*{\s*}" | Select-Object -First 1
        if ($constructorMatch) {
            $constructor = $constructorMatch.Line
            $newContent = $newContent -replace [regex]::Escape($constructor), "$constructor$ngOnInit"
        }
    }

    # Add setSEOTags method
    if ($newContent -notmatch "setSEOTags\(\)") {
        $setSEOTags = @"
`n  private setSEOTags(): void {
    this.titleService.setTitle('$($seoData.title)');
    this.metaService.updateTag({ 
      name: 'description', 
      content: '$($seoData.description)' 
    });
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: '$($seoData.keywords)' 
    });
    this.canonicalService.setCanonicalUrl('$($seoData.canonicalPath)');
  }
"@
        
        # Add before the last closing brace
        $lastBraceIndex = $newContent.LastIndexOf('}')
        if ($lastBraceIndex -ne -1) {
            $newContent = $newContent.Substring(0, $lastBraceIndex) + $setSEOTags + "`n" + $newContent.Substring($lastBraceIndex)
        }
    }

    return $newContent
}

# Function to process a single component file
function Process-ComponentFile {
    param([string]$FilePath, [string]$ComponentName)
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        
        # Skip if already has canonical tags
        if (Test-HasCanonicalTags -Content $content) {
            Write-Host "✅ $ComponentName already has canonical tags" -ForegroundColor Green
            return
        }

        Write-Host "🔄 Processing $ComponentName..." -ForegroundColor Cyan

        # Add imports
        $content = Add-Imports -Content $content
        
        # Add OnInit interface
        $content = Add-OnInitInterface -Content $content
        
        # Add constructor
        $content = Add-Constructor -Content $content -ComponentName $ComponentName
        
        # Add SEO methods
        $content = Add-SEOMethods -Content $content -ComponentName $ComponentName

        # Write back to file
        Set-Content -Path $FilePath -Value $content -Encoding UTF8
        Write-Host "✅ Updated $ComponentName" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error processing $ComponentName`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to find all component directories
function Find-ComponentDirectories {
    param([string]$Dir)
    
    $components = @()
    
    try {
        $items = Get-ChildItem -Path $Dir -Directory
        
        foreach ($item in $items) {
            if ($ExcludedDirs -notcontains $item.Name) {
                # Check if it's a component directory (has .component.ts file)
                $componentFile = Join-Path $item.FullName "$($item.Name).component.ts"
                if (Test-Path $componentFile) {
                    $components += @{
                        Name = $item.Name
                        Path = $componentFile
                    }
                }
            }
        }
    } catch {
        Write-Host "Error reading directory $Dir`: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    return $components
}

# Main execution
function Main {
    $components = Find-ComponentDirectories -Dir $ComponentsDir
    
    Write-Host "Found $($components.Count) components to process:`n" -ForegroundColor Yellow
    
    $processedCount = 0
    $skippedCount = 0
    
    foreach ($component in $components) {
        if ($ExcludedFiles -contains "$($component.Name).component.ts") {
            Write-Host "⏭️  Skipping $($component.Name) (excluded)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        Process-ComponentFile -FilePath $component.Path -ComponentName $component.Name
        $processedCount++
    }
    
    Write-Host "`n📊 Summary:" -ForegroundColor Green
    Write-Host "✅ Processed: $processedCount components" -ForegroundColor Green
    Write-Host "⏭️  Skipped: $skippedCount components" -ForegroundColor Yellow
    Write-Host "`n🎉 Canonical tags update completed!" -ForegroundColor Green
}

# Run the script
Main
