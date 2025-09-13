# OMNI Hospitals - API Endpoints Mapping

## 🔄 Updated Configuration

Based on your requirements, the API endpoints have been configured to use your own servers instead of external render.com URLs.

## 📍 Environment-Based API URLs

### 🔧 Development Environment
**Base URL**: `http://localhost:3000`

| Service | Endpoint | Full URL |
|---------|----------|----------|
| **Specialties** | `/getspecialty` | `http://localhost:3000/getspecialty` |
| **Doctors** | `/getdoctors` | `http://localhost:3000/getdoctors` |
| **Health Packages** | `/gethealthpackages` | `http://localhost:3000/gethealthpackages` |
| **Fixed Surgery Packages** | `/getfixedsurgicalpackages` | `http://localhost:3000/getfixedsurgicalpackages` |
| **Users** | `/getusers`, `/signup`, `/getuserbyid` | `http://localhost:3000/*` |

### 🚀 Production Environment
**Base URL**: `http://api.omni-hospitals.in:3000`

| Service | Endpoint | Full URL |
|---------|----------|----------|
| **Specialties** | `/getspecialty` | `http://api.omni-hospitals.in:3000/getspecialty` |
| **Doctors** | `/getdoctors` | `http://api.omni-hospitals.in:3000/getdoctors` |
| **Health Packages** | `/gethealthpackages` | `http://api.omni-hospitals.in:3000/gethealthpackages` |
| **Fixed Surgery Packages** | `/getfixedsurgicalpackages` | `http://api.omni-hospitals.in:3000/getfixedsurgicalpackages` |
| **Users** | `/getusers`, `/signup`, `/getuserbyid` | `http://api.omni-hospitals.in:3000/*` |

## 🔗 External APIs (Unchanged)

| Service | URL | Purpose |
|---------|-----|---------|
| **Blog API** | `https://omniservicebackend.onrender.com` | Blog content |
| **LeadSquared** | `https://api-in21.leadsquared.com/v2/` | Form submissions |

## 📋 Services Mapping

### ✅ Updated to Use Your API
- `SpecialitiesService` → `environment.specialtiesApiUrl`
- `DoctorDetailsService` → `environment.omniApiUrl`
- `HealthPackageService` → `environment.omniApiUrl`
- `FixedPackagesService` → `environment.omniApiUrl`
- `UsersService` → `environment.blogApiUrl` (keeping external for now)

### 🔄 Environment Switching

**For Development:**
```bash
ng serve
# Uses http://localhost:3000 for all your APIs
```

**For Production:**
```bash
ng build --configuration production
# Uses http://api.omni-hospitals.in:3000 for all your APIs
```

## 🎯 Expected API Response Format

Based on the search results, your `/getspecialty` endpoint should return:

```json
{
  "message": "I have got all specialty",
  "SpecialtyData": [{
    "Kukatpally": [
      {
        "name": "Cardiology",
        "icon": "assets/our_specialities/Cardio_blue.svg",
        "description": "The Department of Cardiology...",
        "meta_title": "Best Cardiology Hospital...",
        "meta_description": "OMNI Hospitals is a leading..."
      }
    ],
    "Kothapet": [...],
    "Nampally": [...],
    "Vizag": [...],
    "Kurnool": [...]
  }]
}
```

## ⚡ Benefits of This Setup

1. **Local Development**: All APIs point to your local server at `localhost:3000`
2. **Production Ready**: All APIs point to your production server at `api.omni-hospitals.in:3000`
3. **Consistent**: Same codebase works for both environments
4. **Easy Switching**: Just change the build configuration
5. **Your Control**: All main APIs use your own servers

## 🚀 Ready to Use

Your application will now:
- ✅ Use `localhost:3000` in development
- ✅ Use `api.omni-hospitals.in:3000` in production
- ✅ Automatically switch based on build configuration
- ✅ No more dependency on render.com for core APIs

**Note**: Make sure your backend server at `http://api.omni-hospitals.in:3000` has the `/getspecialty` endpoint implemented with the same response format as shown in the search results.



