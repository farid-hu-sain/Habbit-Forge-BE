# 🎯 **ENDPOINT LIST - Habit Tracker API**

Berdasarkan schema kita, ini **prioritas endpoint** yang perlu dibuat:

## 📋 **ENDPOINT PRIORITAS (MVP)**

### **AUTHENTICATION** 🔐
```
POST    /api/auth/register     # Buat user baru + profile
POST    /api/auth/login        # Login user
POST    /api/auth/logout       # Logout (clear token)
GET     /api/auth/me           # Get current user data
```

### **PROFILE** 👤
```
GET     /api/profile           # Get user profile
PUT     /api/profile           # Update profile
```

### **CATEGORIES** 🗂️
```
GET     /api/categories        # Get semua kategori
GET     /api/categories/:id    # Get kategori detail
```

### **HABITS** 🎯 (CORE)
```
GET     /api/habits            # Get semua habits user
GET     /api/habits/:id        # Get habit detail + stats
POST    /api/habits            # Buat habit baru
PUT     /api/habits/:id        # Update habit
DELETE  /api/habits/:id        # Delete habit (soft delete)
PUT     /api/habits/:id/toggle # Toggle aktif/nonaktif
```

### **CHECK-INS** ✅ (CORE)
```
GET     /api/habits/:id/checkins  # Get check-in history habit
POST    /api/habits/:id/checkin   # Check-in hari ini
PUT     /api/checkins/:id         # Update check-in (note)
DELETE  /api/checkins/:id         # Delete check-in
```

### **DASHBOARD** 📊
```
GET     /api/dashboard          # Data dashboard
GET     /api/dashboard/today    # Habits untuk hari ini
GET     /api/dashboard/stats    # Statistik user
```

### **STREAK & STATS** 📈
```
GET     /api/habits/:id/streak  # Get streak data habit
GET     /api/stats/monthly      # Statistik bulanan
```

---

## 🚀 **URUTAN PENGEMBANGAN:**

### **PHASE 1 - BASIC AUTH & PROFILE** (Hari 1)
```
1. POST /api/auth/register
2. POST /api/auth/login  
3. GET  /api/auth/me
4. GET  /api/profile
5. PUT  /api/profile
```

### **PHASE 2 - HABIT MANAGEMENT** (Hari 2)
```
6. GET    /api/categories
7. GET    /api/habits
8. POST   /api/habits
9. PUT    /api/habits/:id
10. DELETE /api/habits/:id
```

### **PHASE 3 - CHECK-IN SYSTEM** (Hari 3)
```
11. POST   /api/habits/:id/checkin
12. GET    /api/habits/:id/checkins
13. DELETE /api/checkins/:id
```

### **PHASE 4 - DASHBOARD & STATS** (Hari 4)
```
14. GET /api/dashboard
15. GET /api/dashboard/today
16. GET /api/habits/:id/streak
```

---

## 📁 **FOLDER STRUCTURE:**
```
src/
├── controllers/
│   ├── auth.controller.ts
│   ├── profile.controller.ts
│   ├── habit.controller.ts
│   ├── checkin.controller.ts
│   └── dashboard.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── validate.middleware.ts
├── routes/
│   ├── auth.routes.ts
│   ├── profile.routes.ts
│   ├── habit.routes.ts
│   └── dashboard.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── habit.service.ts
│   └── streak.service.ts
├── utils/
│   ├── jwt.ts
│   └── validation.ts
└── app.ts
```