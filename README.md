# برج العرب للاستشارات الهندسية - Burj Al Arab Engineering Consultancy

تطبيق كامل (Full-Stack) لموقع مكتب برج العرب للاستشارات الهندسية، مبني بـ React + Vite (الواجهة الأمامية) و Node.js + Express + MongoDB (الواجهة الخلفية).

## 🚀 التقنيات المستخدمة

### الواجهة الأمامية (Frontend)
- **React 18** + **Vite**
- **React Router DOM** للتنقل
- **Axios** للتواصل مع API
- **Lucide React** للأيقونات
- **Tailwind CSS** لتنسيق واجهة لوحة الإدارة
- **CSS Variables** للتصميم المتجاوب
- **RTL** دعم كامل للغة العربية

### الواجهة الخلفية (Backend)
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** (قاعدة البيانات)
- **JWT** للمصادقة
- **bcryptjs** لتشفير كلمات المرور
- **Multer** لرفع الصور
- **express-validator** للتحقق من البيانات
- **helmet** و **cors** و **express-rate-limit** للأمان

## 📁 هيكل المشروع

```
burj-al-arab/
├── public/                   # الملفات الثابتة (صور المشاريع والمقالات)
├── src/                      # الواجهة الأمامية (React + Vite)
│   ├── components/           # المكونات المشتركة
│   ├── pages/                # الصفحات العامة
│   │   └── admin/            # صفحات لوحة الإدارة
│   ├── services/             # طبقة API
│   ├── context/              # React Context (Auth)
│   ├── hooks/                # Custom Hooks
│   ├── App.jsx
│   ├── App.css
│   ├── index.css             # توجيهات Tailwind CSS
│   └── main.jsx
├── backend/                  # Node.js + Express Backend
│   ├── config/               # إعدادات قاعدة البيانات
│   ├── controllers/          # منطق الأعمال
│   ├── middleware/           # Middlewares (auth, upload, error)
│   ├── models/               # Mongoose Models
│   ├── routes/               # API Routes
│   ├── utils/                # دوال مساعدة
│   ├── uploads/              # مجلد الصور المرفوعة
│   ├── scripts/              # سكريبتات التعبئة
│   ├── server.js             # نقطة الدخول
│   ├── package.json
│   └── .env
├── tailwind.config.js        # إعدادات Tailwind CSS
├── package.json              # Root package.json
└── README.md
```

## ⚙️ متطلبات التشغيل

- **Node.js** 18+
- **MongoDB Atlas** (أو MongoDB محلي)
- **npm** أو **yarn**

## 🔧 التثبيت والتشغيل

### 1. استنساخ المشروع وتثبيت التبعيات

```bash
# تثبيت جميع التبعيات (الواجهة الأمامية + الخلفية)
npm run install:all
```

### 2. إعداد متغيرات البيئة

قم بنسخ ملف `.env.example` إلى `.env` في مجلد `backend` وتعديل القيم:

```bash
cp backend/.env.example backend/.env
```

**متغيرات البيئة المطلوبة:**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/burj-al-arab?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123456
```

### 3. إنشاء حساب المدير (Admin)

```bash
npm run seed:admin
```

### 4. تشغيل بيئة التطوير

```bash
# تشغيل الواجهة الأمامية والخلفية معاً
npm run dev
```

أو تشغيل كل منهما بشكل منفصل:

```bash
# Terminal 1 - الواجهة الخلفية
npm run dev:backend

# Terminal 2 - الواجهة الأمامية
npm run dev:frontend
```

### 5. الوصول للتطبيق

- **الواجهة الأمامية:** http://localhost:5173
- **الواجهة الخلفية (API):** http://localhost:5000/api
- **لوحة الإدارة:** http://localhost:5173/admin/login

## 🔐 بيانات الدخول الافتراضية للإدارة

- **البريد الإلكتروني:** admin@example.com
- **كلمة المرور:** Admin@123456

> ⚠️ **مهم:** غير كلمة المرور فور أول دخول عبر صفحة المستخدمين في لوحة الإدارة.

## 📚 نقاط نهاية API (API Endpoints)

### المصادقة (Authentication)
| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/api/auth/login` | تسجيل دخول المدير |
| GET | `/api/auth/me` | الحصول على المستخدم الحالي |
| POST | `/api/auth/logout` | تسجيل الخروج |

### طلبات الاستشارة (Consultations)
| Method | Endpoint | الوصف | صلاحيات |
|--------|----------|-------|----------|
| POST | `/api/consultations` | إنشاء طلب استشارة جديد | عام |
| GET | `/api/consultations` | جلب جميع الطلبات (مع ترقيم الصفحات) | مدير |
| GET | `/api/consultations/:id` | جلب طلب بواسطة المعرف | مدير |
| PATCH | `/api/consultations/:id/status` | تحديث حالة الطلب | مدير |
| PATCH | `/api/consultations/:id/notes` | إضافة ملاحظات إدارية | مدير |
| DELETE | `/api/consultations/:id` | حذف طلب | مدير |

### المشاريع (Projects)
| Method | Endpoint | الوصف | صلاحيات |
|--------|----------|-------|----------|
| GET | `/api/projects` | جلب المشاريع المنشورة (مع ترقيم وفلاتر) | عام |
| GET | `/api/projects/:slug` | جلب مشروع بواسطة الـ slug | عام |
| POST | `/api/projects` | إنشاء مشروع جديد | محرر/مدير |
| GET | `/api/projects/admin/all` | جلب جميع المشاريع (للإدارة) | محرر/مدير |
| GET | `/api/projects/admin/:id` | جلب مشروع بواسطة المعرف | محرر/مدير |
| PATCH | `/api/projects/:id` | تحديث مشروع | محرر/مدير |
| DELETE | `/api/projects/:id` | حذف مشروع | محرر/مدير |
| PATCH | `/api/projects/:id/publish` | نشر/إلغاء نشر مشروع | محرر/مدير |

### المقالات (Articles)
| Method | Endpoint | الوصف | صلاحيات |
|--------|----------|-------|----------|
| GET | `/api/articles` | جلب المقالات المنشورة (مع ترقيم وفلاتر) | عام |
| GET | `/api/articles/:slug` | جلب مقال بواسطة الـ slug | عام |
| POST | `/api/articles` | إنشاء مقال جديد | محرر/مدير |
| GET | `/api/articles/admin/all` | جلب جميع المقالات (للإدارة) | محرر/مدير |
| GET | `/api/articles/admin/:id` | جلب مقال بواسطة المعرف | محرر/مدير |
| PATCH | `/api/articles/:id` | تحديث مقال | محرر/مدير |
| DELETE | `/api/articles/:id` | حذف مقال | محرر/مدير |
| PATCH | `/api/articles/:id/publish` | نشر/إلغاء نشر مقال | محرر/مدير |

### المستخدمون (Users) - للمدير فقط
| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/users` | جلب جميع المستخدمين |
| POST | `/api/users` | إنشاء مستخدم جديد |
| PATCH | `/api/users/:id` | تحديث مستخدم |
| PATCH | `/api/users/:id/password` | تغيير كلمة المرور |
| DELETE | `/api/users/:id` | حذف مستخدم |

### فحص الصحة (Health Check)
| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/health` | التحقق من حالة API |

## 🎨 المميزات الرئيسية

### الموقع العام (Public Website)
- ✅ الصفحة الرئيسية مع مشاريع مميزة من قاعدة البيانات
- ✅ صفحة الخدمات (ثابتة - معلوماتية)
- ✅ صفحة المشاريع مع ترقيم الصفحات وفلترة حسب التصنيف
- ✅ صفحة تفاصيل المشروع مع صور ومعلومات كاملة
- ✅ صفحة المقالات مع ترقيم وفلترة
- ✅ صفحة تفاصيل المقال مع محتوى كامل
- ✅ صفحة "من نحن" مع الإحصائيات والفريق
- ✅ نموذج حجز استشارة متصل بقاعدة البيانات
- ✅ تصميم متجاوب (Responsive) ويدعم RTL
- ✅ حالات التحميل والخطأ والخلو من البيانات

### لوحة الإدارة (Admin Dashboard)
- ✅ تسجيل دخول محمي بـ JWT
- ✅ لوحة تحكم بإحصائيات مباشرة
- ✅ إدارة طلبات الاستشارة (عرض، تحديث الحالة، ملاحظات، حذف)
- ✅ إدارة المشاريع (إضافة، تعديل، حذف، نشر، تمييز، رفع صور)
- ✅ إدارة المقالات (إضافة، تعديل، حذف، نشر، رفع صور)
- ✅ إدارة المستخدمين (إضافة، تعديل، تعطيل، تغيير الأدوار)
- ✅ رفع صور مع التحقق من النوع والحجم
- ✅ ترقيم الصفحات، البحث، والفلترة
- ✅ تصميم متجاوب مع شريط جانبي قابل للطي على الموبايل
- ✅ حماية المسارات (Frontend + Backend)

## 🛡️ الأمان

- **Helmet.js** لرؤوس HTTP آمنة
- **CORS** محدود بنطاق الواجهة الأمامية فقط
- **Rate Limiting** على تسجيل الدخول ونموذج الاستشارة
- **JWT** مع انتهاء صلاحية (7 أيام)
- **bcrypt** لتشفير كلمات المرور (12 جولات)
- **التحقق من المدخلات** في الواجهة الأمامية والخلفية
- **حماية رفع الملفات** (أنواع وأحجام محددة)
- **متغيرات البيئة** للمعلومات الحساسة
- **التحقق من الصلاحيات** في كل نقطة نهاية محمية

## 📦 النشر (Deployment)

### الواجهة الأمامية (Frontend)
- **Vercel** / **Netlify**
- بناء: `npm run build`
- مجلد النشر: `dist`

### الواجهة الخلفية (Backend)
- **Render** / **Railway** / **VPS**
- متغيرات البيئة مطلوبة
- قاعدة البيانات: **MongoDB Atlas**

### قاعدة البيانات
- **MongoDB Atlas** (موصى به للإنتاج)
- إنشاء مستخدم قاعدة بيانات بصلاحيات قراءة/كتابة

### تخزين الصور (للإنتاج)
استبدال التخزين المحلي بـ:
- **Cloudinary**
- **AWS S3**
- **Firebase Storage**

يتم ذلك بتعديل `uploadMiddleware.js` و `server.js` فقط.

## 🗂️ نماذج قاعدة البيانات (Database Schema)

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'manager' | 'editor',
  isActive: Boolean,
  createdAt, updatedAt
}
```

### Consultation
```javascript
{
  name: String,
  phone: String,
  email: String,
  projectType: Enum,
  details: String,
  status: Enum ['new', 'contacted', 'in_progress', 'completed', 'cancelled'],
  adminNotes: String,
  createdAt, updatedAt
}
```

### Project
```javascript
{
  title: String,
  slug: String (unique),
  category: String,
  description: String,
  fullDescription: String,
  image: String,
  location: String,
  year: Number,
  services: [String],
  featured: Boolean,
  isPublished: Boolean,
  createdAt, updatedAt
}
```

### Article
```javascript
{
  title: String,
  slug: String (unique),
  category: String,
  excerpt: String,
  content: String,
  image: String,
  author: String,
  isPublished: Boolean,
  publishedAt: Date,
  createdAt, updatedAt
}
```

## 📝 سكريبتات متاحة

```bash
# تشغيل بيئة التطوير (Frontend + Backend)
npm run dev

# تشغيل الواجهة الأمامية فقط
npm run dev:frontend

# تشغيل الواجهة الخلفية فقط
npm run dev:backend

# بناء الواجهة الأمامية للإنتاج
npm run build

# إنشاء حساب المدير
npm run seed:admin

# تعبئة البيانات التجريبية
npm run seed

# تثبيت جميع التبعيات
npm run install:all
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- **الموقع:** برج العرب للاستشارات الهندسية
- **البريد:** ebda3.arch@gmail.com
- **الهاتف:** +966 50 233 1197
- **الموقع:** الخبر - المنطقة الشرقية