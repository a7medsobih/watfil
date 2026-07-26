# Watfil Backend API Guide — دليل الفرونت والعميل

هذا الملف هو مرجع عملي لفريق الـ Frontend وللعميل لفهم كل الـ endpoints الموجودة حاليًا في Backend مشروع Watfil، مع تقسيمها حسب الدور، وشرح السيناريوهات، وقواعد البيزنس، وأمثلة للـ payloads.

> آخر تحديث: توحيد الدليل مع الكود الحالي — تصفح منتجات واتفل (Catalog Browse)، بروفايل الشركة (About/Gallery/Services/Team)، طلبات انضمام الشركات، المدونة، المواعيد، التنازل، الإعلانات، Perks، إحالة الطلبات، إحصائيات اللوحة، والإعجابات/التقييمات.

---

## 1. قواعد عامة لكل الـ API

### Base URL

كل المسارات تبدأ بـ:

```text
/api
```

مثال:

```text
GET /api/public/companies
```

### Authentication

المشروع يستخدم Laravel Sanctum.

بعد تسجيل الدخول، كل endpoint محمي يحتاج header:

```http
Authorization: Bearer <token>
Accept: application/json
```

### الأدوار الموجودة

- `Public`: لا يحتاج تسجيل دخول.
- `Customer`: عميل المنصة.
- `Company`: شركة/متجر.
- `Super Admin`: إدارة المنصة.

### شكل الاستجابة العام

القوائم غالبًا ترجع:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "current_page": 1,
    "last_page": 1,
    "per_page": 15
  }
}
```

عمليات الإنشاء/التعديل غالبًا ترجع:

```json
{
  "message": "تمت العملية بنجاح",
  "data": {}
}
```

### الأخطاء المهمة للفرونت

- `401`: غير مسجل دخول أو token غير صحيح.
- `403`: مسجل دخول لكن لا يملك صلاحية الدور أو المورد.
- `404`: المورد غير موجود أو غير متاح.
- `422`: خطأ validation أو حالة business غير مسموحة.

### الملفات Upload

أي endpoint يقبل صور أو إثبات دفع يجب إرساله كـ:

```http
Content-Type: multipart/form-data
```

---

## 2. Public APIs — واجهات عامة بدون تسجيل دخول

هذه endpoints يستخدمها الموقع العام قبل تسجيل الدخول أو مع customer token اختياري في بعض الحالات لعرض حالة الإعجاب/التقييم.

### 2.1 المحافظات

```http
GET /api/public/governorates
```

يرجع المحافظات المتاحة.

سيناريوهات الفرونت:

- تحميل قائمة المحافظات في الفلاتر.
- استخدامها في تسجيل العميل أو إنشاء الشركة من لوحة الأدمن.

---

### 2.2 المدن

```http
GET /api/public/cities
```

Query params:

```text
governorate_id?: integer
is_active?: boolean
```

الاستخدام:

- تحميل المدن التابعة لمحافظة.
- الفلاتر في الواجهة العامة.

Business rules:

- المدن غير النشطة لا يجب اعتبارها متاحة في تجربة المستخدم.

---

### 2.3 عدد الشركات حسب المدينة

```http
GET /api/public/cities/company-counts
```

يرجع أعداد الشركات حسب المدن.

الاستخدام:

- عرض عدد الشركات المتاحة بجانب كل مدينة.
- يساعد العميل في معرفة المناطق التي عليها تغطية.

---

### 2.3ب إحصائيات الموقع العامة

```http
GET /api/public/statistics
```

يرجع أعداد عامة للـ homepage / about:

```json
{
  "data": {
    "products_count": 120,
    "companies_count": 45,
    "verified_ratings_count": 890,
    "governorates_count": 27
  }
}
```

- `products_count`: منتجات واتفل الظاهرة (مورد + شركة مؤهلة).
- `companies_count`: شركات نشطة وظاهرة بالمحفظة.
- `verified_ratings_count`: تقييمات العملاء الموثقة.
- `governorates_count`: عدد المحافظات.

---

### 2.4 أنواع المنتجات

```http
GET /api/public/product-types
```

يرجع أنواع المنتجات مثل فلاتر، أجهزة، إلخ حسب الموجود في النظام.

---

### 2.5 الأقسام

```http
GET /api/public/categories
```

Query params:

```text
product_type_id?: integer
parent_category_id?: integer|null
search?: string
per_page?: integer
```

الاستخدام:

- بناء شجرة الأقسام.
- فلترة المنتجات حسب القسم.

---

### 2.6 Lookups الصيانة

```http
GET /api/public/maintenance/lookups
```

يرجع الاختيارات الثابتة المستخدمة في نموذج طلب الصيانة، مثل:

- أنواع أنظمة التنقية.
- أنواع المشاكل الرئيسية.
- أنواع الأعطال.

---

### 2.7 قائمة الشركات العامة

```http
GET /api/public/companies
```

Query params:

```text
governorate_id: integer|required_without:city_id
city_id?: integer
```

Response يحتوي على:

- بيانات الشركة.
- المحافظة.
- التغطية.
- عدد الإعجابات.
- عدد التقييمات.
- متوسط التقييم.
- `is_liked` و `my_rating` إذا كان الطلب مرسلًا بـ customer token.

Business rules:

- الشركة يجب أن تكون `is_active = true`.
- بعد Module 5: إذا كان `hide_when_wallet_below_min = true` ورصيد الشركة أقل من `wallet_min_balance` فلن تظهر في القائمة العامة.
- النتائج تختلف حسب المحافظة/المدينة والتغطية الجغرافية.

سيناريوهات الفرونت:

- صفحة اختيار الشركة حسب المحافظة والمدينة.
- عرض empty state إذا لم توجد شركات.
- عرض متوسط التقييم وعدد الإعجابات.

أخطاء متوقعة:

- `422` لو لم يتم إرسال `governorate_id` ولا `city_id`.

---

### 2.8 تفاصيل شركة

```http
GET /api/public/companies/{company}
```

بالإضافة للحقول العادية (بيانات الشركة، التغطية، likes/ratings summary)، صفحة التفاصيل ترجع أقسام البروفايل والمتجر:

```text
about: string|null
gallery: { id, url, sort_order }[]     // فارغ لو أقل من صورتين؛ أقصى 4 للعرض
services: { id, title, description, icon, sort_order }[]
team: { id, name, role, photo, sort_order }[]
products_count: number
products: PublicStoreProduct[]         // منتجات الشركة + الكتالوج مع تقسيط + perks
ratings: {                             // قائمة تقييمات العملاء (الأحدث أولًا)
  id, rating, comment,
  customer: { id, full_name }|null,
  created_at, updated_at
}[]
```

كل عنصر في `products` يشمل:

- `source`: `company` | `catalog`
- `has_installment` + `installment_plans`
- `has_perks` + `perks`
- السعر، الصورة، الصنف، المورد (للكتالوج)، `likes_count`

ملخص التقييم موجود أصلًا في `average_rating` / `ratings_count` / `my_rating`.

Business rules:

- لو الشركة غير نشطة يرجع `404`.
- بعد Module 5، لو الشركة مخفية بسبب حد المحفظة يرجع `404`.
- قائمة الشركات `/public/companies` **لا** ترجع أقسام البروفايل والمنتجات والتقييمات التفصيلية — فقط صفحة التفاصيل.

الاستخدام:

- صفحة هوية الشركة: نبذة، معرض، خدمات، فريق.
- عرض منتجات المتجر والتقييمات التفصيلية في نفس الصفحة.

---

### 2.9 منتجات شركة عامة

```http
GET /api/public/companies/{company}/products
```

Query params:

```text
category_id?: integer
parent_category_id?: integer
product_type?: string
product_type_id?: integer
number_of_stages?: integer
page?: integer
```

يرجع منتجات الشركة الخاصة + المنتجات المستوردة من كتالوج الموردين.

كل عنصر يحتوي غالبًا على:

- `id`
- `source`: إما `company` أو `catalog`
- `name`
- `description`
- `image`
- `cash_price`
- `has_installment`
- `installment_plans`
- `has_perks`
- `perks`: مميزات المنتج التي أضافتها هذه الشركة تحديدًا (مقيّدة بالشركة والنشطة فقط)
- `likes_count` (لمنتجات الشركة الخاصة)
- `is_liked` (إذا وُجد customer token)
- `category`
- `supplier` للمنتجات المستوردة

كل عنصر داخل `perks` يحتوي على:

- `id`
- `title`
- `description`
- `type`: أحد `maintenance`, `support`, `installation`, `warranty`, `gift`, `other` أو `null`
- `icon`
- `sort_order`
- `perk_preset_id`: مرجع الميزة الجاهزة إن وُجد أو `null` للميزة الحرة

Business rules:

- الشركة يجب أن تكون نشطة.
- المنتج يجب أن يكون نشطًا.
- المنتجات المستوردة من المورد تظهر فقط إذا كانت فعالة.
- المميزات دائمًا مقيّدة بالشركة المعروضة؛ نفس منتج المورد قد تظهر له مميزات مختلفة عند شركة أخرى.

سيناريوهات الفرونت:

- صفحة منتجات المتجر.
- الفلترة حسب نوع المنتج/القسم/عدد المراحل.
- إظهار badge أن المنتج متاح بالتقسيط إذا `has_installment = true`.
- إظهار قائمة المميزات (صيانة دورية، دعم 24 ساعة، تركيب مجاني...) إذا `has_perks = true`.
- زر إعجاب للمنتج مع `likes_count` / `is_liked`.

---

### 2.10 خطط تقسيط منتج شركة

```http
GET /api/public/companies/{company}/products/{companyProduct}/installment-plans
```

يرجع:

- بيانات المنتج.
- `plans`: خطط التقسيط المتاحة.

Business rules:

- الشركة يجب أن تكون نشطة.
- المنتج يجب أن يكون تابعًا للشركة ونشطًا.
- لو المنتج لا يتبع الشركة أو غير نشط يرجع `404`.

---

### 2.11 التحقق من كود إحالة

```http
GET /api/public/referrals/validate
```

Query params:

```text
code: string
```

Response:

```json
{
  "data": {
    "valid": true,
    "referrer_name": "اسم صاحب الإحالة"
  }
}
```

الاستخدام في الفرونت:

- عند فتح رابط تسجيل يحتوي `?ref=CODE` يمكن التحقق من الكود قبل عرض رسالة "تم تطبيق كود الإحالة".
- لو `valid = false` لا ترسل الكود مع التسجيل.

---

### 2.12 فتحات المواعيد المتاحة لشركة

```http
GET /api/public/companies/{company}/appointment-slots
```

Query params:

```text
date: YYYY-MM-DD   (مطلوب)
```

Response:

```json
{
  "data": [
    {
      "starts_at": "2026-07-10 10:00:00",
      "ends_at": "2026-07-10 11:00:00",
      "available": true
    }
  ]
}
```

سيناريوهات الفرونت:

- عرض تقويم حجز موعد قبل `POST /api/customer/appointments`.
- يعتمد على جدول عمل الشركة + الاستثناءات + الحجوزات الحالية.
- مدة الفتحة الافتراضية: `appointments.slot_duration_minutes` (60 دقيقة).

---

### 2.13 تفاصيل منتج شركة

```http
GET /api/public/companies/{company}/products/{companyProduct}
```

Response (حقول رئيسية):

```json
{
  "data": {
    "id": 12,
    "source": "company",
    "name": "فلتر 7 مراحل",
    "sku": "WF-001",
    "description": "...",
    "image": "https://...",
    "original_price": 6000,
    "cash_price": 5000,
    "is_on_sale": true,
    "stock_status": "in_stock",
    "is_available": true,
    "views_count": 42,
    "likes_count": 8,
    "is_liked": false,
    "has_installment": true,
    "installment_plans": [],
    "has_perks": true,
    "perks": [
      {
        "id": 1,
        "title": "تركيب مجاني",
        "description": "تركيب المنتج مجانًا داخل المحافظة",
        "type": "installation",
        "icon": "wrench",
        "sort_order": 1,
        "perk_preset_id": 3
      }
    ],
    "category": { "id": 3, "name_ar": "..." },
    "supplier": null,
    "created_at": "2026-06-01 12:00:00"
  }
}
```

Business rules:

- الشركة يجب أن تكون `is_active`.
- المنتج يجب أن يكون تابعًا للشركة و`isPubliclyVisible()`.
- منتجات الكتالوج (`source=catalog`) تظهر في القائمة العامة لكن لا يوجد `show` منفصل لها حاليًا.
- `is_liked` يظهر عند وجود customer token.

---

### 2.14 سجل التصفح (Browsing)

#### 2.14.1 تسجيل مشاهدة منتج

```http
POST /api/public/browsing/products/view
```

Auth: اختياري — `customer token` أو `session_key` للزائر.

Body:

```json
{
  "company_id": 5,
  "product_source": "company",
  "product_id": 12,
  "session_key": "abc123"
}
```

`product_source`: `company` | `catalog`

Response:

```json
{
  "message": "تم تسجيل المشاهدة",
  "data": {
    "duplicate_session": false,
    "views_count": 43
  }
}
```

#### 2.14.2 تسجيل زيارة متجر

```http
POST /api/public/browsing/stores/visit
```

Body:

```json
{
  "company_id": 5,
  "session_key": "abc123"
}
```

#### 2.14.3 آخر المنتجات المشاهدة

```http
GET /api/public/browsing/recent-products
```

Query:

```text
session_key?: string   (مطلوب للزائر بدون token)
limit?: integer        (افتراضي 20)
```

#### 2.14.4 آخر المتاجر المزارة

```http
GET /api/public/browsing/recent-stores
```

Query: نفس `recent-products`.

Business rules:

- بدون customer token: `session_key` **مطلوب** (max 64 حرف).
- مع customer token: يُربط السجل بالعميل ولا يحتاج `session_key`.
- `session_key` يمنع تكرار المشاهدة غير المنطقي في نفس الجلسة.

---

### 2.15 إعلانات عامة (Ad Slots)

#### 2.15.1 إعلانات الصفحة الرئيسية

```http
GET /api/public/ads/homepage
```

#### 2.15.2 إعلانات محافظة

```http
GET /api/public/ads/governorates/{governorate}
```

#### 2.15.3 إعلانات مدينة

```http
GET /api/public/ads/cities/{city}
```

Response (لكل حجز نشط اليوم):

```json
{
  "data": [
    {
      "booking_id": 88,
      "position": 1,
      "company": { "id": 5, "name": "شركة المياه" },
      "campaign": {
        "id": 10,
        "title": "عرض صيفي",
        "image": "https://...",
        "target_url": "https://example.com",
        "tracking_code": "AD-XYZ123"
      }
    }
  ]
}
```

#### 2.15.4 تسجيل مشاهدة إعلان

```http
POST /api/public/ads/impressions
```

Body:

```json
{
  "ad_campaign_id": 10,
  "ad_booking_id": 88,
  "ad_zone_id": 3,
  "session_key": "abc123"
}
```

#### 2.15.5 تتبع النقر (Redirect)

```http
GET /api/public/ads/track/{trackingCode}?booking_id=88&zone_id=3&session_key=abc&utm_source=...
```

Response: HTTP 302 redirect إلى `target_url` مع UTM params + `click_id`.

Business rules:

- إذا لا توجد zone نشطة: `data: []`.
- المراكز المتاحة: positions `1`, `2`, `3`.
- الفرونت يعرض الإعلان ثم يسجّل impression، ويستخدم `tracking_code` للنقرات.

---

### 2.16 بنر محافظة

```http
GET /api/public/banners/governorates/{governorate}
```

Response:

```json
{
  "data": {
    "image": "https://...",
    "title": "بنر ترويجي",
    "target_url": "https://...",
    "tracking_code": "BNR-ABC",
    "company": { "id": 5, "name": "شركة المياه" }
  }
}
```

أو `"data": null` إذا لا يوجد حجز نشط اليوم.

---

### 2.17 تصفح منتجات واتفل (Catalog Browse)

منتجات الموردين الظاهرة عبر شركات مؤهلة — بدون تسجيل دخول.

#### 2.17.1 قائمة منتجات واتفل

```http
GET /api/public/products
```

Query params:

```text
governorate_id?: integer
city_id?: integer
category_id?: integer
parent_category_id?: integer
product_type_id?: integer
product_type?: string
search?: string              // اسم / SKU / وصف / اسم الشركة البيّاعة
min_price?: number
max_price?: number           // يجب ≥ min_price إن وُجد الاثنان
page?: integer
per_page?: integer           // افتراضي 15، أقصى 50
```

شروط الظهور:

1. المنتج `active` و`stock_quantity > 0`.
2. شركة واحدة على الأقل في الكتالوج وتحقق شروط الظهور (`is_active` + محفظة).
3. مع `governorate_id`: الشركة تغطي المحافظة (HQ أو coverage).

حقول مهمة في العنصر:

- `offering_companies_count`
- `has_installment`: دائمًا `false` هنا — التقسيط يظهر عند عرض الشركة.
- `installment_plans`: دائمًا `[]` — راجع §2.17.3.
- `likes_count` / `is_liked` (مع customer token)
- `is_wishlisted` / `is_in_compare` / `average_rating` / `ratings_count`: placeholders حاليًا

#### 2.17.2 تفاصيل منتج واتفل

```http
GET /api/public/products/{supplierProduct}?governorate_id=&city_id=
```

`404` لو المنتج غير ظاهر أو لا توجد شركة مؤهلة حسب الفلاتر.

#### 2.17.3 الشركات اللي بتوفّر المنتج (+ عرض كل شركة)

```http
GET /api/public/products/{supplierProduct}/companies?governorate_id={id}
```


| Query               | مطلوب | وصف      |
| ------------------- | ----- | -------- |
| `governorate_id`    | ✓     | المحافظة |
| `city_id`           | —     | مدينة    |
| `page` / `per_page` | —     | ترقيم    |


كل عنصر:

```text
company: PublicCompany
product: {
  ...حقول المنتج,
  has_installment, installment_plans,   // خاص بهذه الشركة
  has_perks, perks                      // خاص بهذه الشركة
}
```

**مهم:** التقسيط والمميزات **لكل شركة لوحدها** على نفس منتج المورد — مش من المنتج العام.

#### 2.17.4 منتجات متشابهة

```http
GET /api/public/products/{supplierProduct}/similar?governorate_id=&company_id=&page=&per_page=
GET /api/public/companies/{company}/products/similar?source=company|catalog&product_id=&governorate_id=
```

`priority_rank`: `1` نفس الشركة → `2` شركات نفس المحافظة → `3` باقي الشركات.

سيناريو الفرونت المقترح:

1. `GET /public/governorates` (+ statistics اختيارًا)
2. `GET /public/products?governorate_id=…`
3. `GET /public/products/{id}`
4. `GET /public/products/{id}/companies?governorate_id=…`
5. اختيار شركة → متجر الشركة أو تفاصيل العرض

---

### 2.18 طلب انضمام شركة (Company Join Request)

نموذج عام لشركات جديدة تطلب الانضمام لواتفل — بدون Auth. الأدمن يراجع الطلب لاحقًا (§5.41).

```http
POST /api/public/company-join-requests
```

Body:

```json
{
  "company_name": "شركة النور",
  "tax_number": "TAX-JOIN-001",
  "governorate_id": 1,
  "contact_name": "أحمد محمد",
  "phone": "01000000001",
  "email": "join@example.com",
  "notes": "نرغب في الانضمام"
}
```


| Field            | مطلوب | قواعد                                                |
| ---------------- | ----- | ---------------------------------------------------- |
| `company_name`   | ✓     | max 255                                              |
| `tax_number`     | ✓     | فريد بين الشركات القائمة + لا يتكرر في طلب `pending` |
| `governorate_id` | ✓     | موجود في المحافظات                                   |
| `contact_name`   | ✓     | max 255                                              |
| `phone`          | ✓     | لا يتكرر في طلب `pending`                            |
| `email`          | ✓     | email صالح                                           |
| `notes`          | —     | max 1000                                             |


Response `201`:

```json
{
  "message": "تم استلام طلب الانضمام بنجاح، وسيتواصل معكم فريق واتفل قريبًا",
  "data": {
    "id": 1,
    "company_name": "شركة النور",
    "tax_number": "TAX-JOIN-001",
    "governorate_id": 1,
    "governorate": { "id": 1, "name_ar": "القاهرة", "name_en": "Cairo" },
    "contact_name": "أحمد محمد",
    "phone": "01000000001",
    "email": "join@example.com",
    "notes": "نرغب في الانضمام",
    "status": "pending",
    "admin_notes": null,
    "processed_at": null,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

Status values: `pending` | `processed`

Business rules:

- لا ينشئ حساب شركة تلقائيًا — الطلب للمراجعة اليدوية من السوبر أدمن.
- `422` عند تكرار رقم ضريبي لشركة موجودة أو طلب معلّق، أو هاتف معلّق.

الاستخدام:

- صفحة «انضم كشركة» / Join Us في الموقع العام.

---

## 3. Customer APIs — واجهات العميل

كل المسارات تحت:

```text
/api/customer
```

ما عدا تسجيل الدخول والتسجيل وOTP، باقي المسارات تحتاج customer token.

---

### 3.1 تسجيل عميل مباشر

```http
POST /api/customer/register
```

Body:

```json
{
  "phone": "01000000000",
  "password": "password123",
  "password_confirmation": "password123",
  "full_name": "اسم العميل",
  "governorate_id": 1,
  "referral_code": "A1B2C3D4"
}
```

Response:

- `token`
- `customer`

Business rules:

- رقم الهاتف فريد.
- كلمة المرور لا تقل عن 8 أحرف.
- `referral_code` اختياري، ولو تم إرساله يجب أن يكون كود إحالة موجود.

---

### 3.2 فحص رقم الهاتف

```http
POST /api/customer/auth/check-phone
```

Body:

```json
{
  "phone": "01000000000"
}
```

Response:

```json
{
  "exists": true
}
```

الاستخدام:

- تحديد هل العميل جديد أم موجود قبل إكمال التسجيل.

---

### 3.3 تسجيل دخول عميل

```http
POST /api/customer/login
```

Body:

```json
{
  "phone": "01000000000",
  "password": "password123"
}
```

سيناريوهات:

- نجاح: يرجع token وبيانات العميل.
- بيانات خاطئة: `422`.
- حساب موقوف: `403`.

---

### 3.4 طلب OTP للتسجيل

```http
POST /api/customer/register/request-otp
```

Body:

```json
{
  "phone": "01000000000"
}
```

في وضع debug يرجع `debug_otp`.

---

### 3.5 تأكيد التسجيل بـ OTP

```http
POST /api/customer/register/verify
```

Body:

```json
{
  "phone": "01000000000",
  "otp": "123456",
  "name": "اسم العميل",
  "password": "password123",
  "password_confirmation": "password123",
  "governorate_id": 1,
  "referral_code": "A1B2C3D4"
}
```

Business rules:

- OTP صحيح وغير منتهي.
- الهاتف فريد.
- `referral_code` اختياري ويتم حفظه على الحساب الجديد كإحالة `pending`.

---

### 3.6 تسجيل الخروج

```http
POST /api/customer/logout
```

يحذف الـ current token.

---

### 3.7 بيانات العميل الحالي

```http
GET /api/customer/me
```

يرجع بيانات العميل والبروفايل والمحافظة.

---

### 3.8 تعديل بروفايل العميل

```http
PATCH /api/customer/profile
```

Body يدعم حقول البروفايل مثل:

```json
{
  "full_name": "اسم العميل",
  "governorate_id": 1
}
```

---

### 3.9 قائمة طلبات العميل

```http
GET /api/customer/orders
```

Query params:

```text
status?: pending|processing|completed|cancelled
company_id?: integer
from?: date
to?: date
per_page?: integer
```

Business rules:

- العميل يرى طلباته فقط.
- لا يرى طلبات عملاء آخرين.

---

### 3.10 إنشاء طلب من العميل

```http
POST /api/customer/orders
```

Body:

```json
{
  "company_id": 1,
  "payment_type": "cash",
  "items": [
    {
      "company_product_id": 10,
      "quantity": 1
    }
  ],
  "discount": 0,
  "governorate_id": 1,
  "notes": "ملاحظات العميل",
  "idempotency_key": "unique-order-key",
  "source": {
    "channel": "direct",
    "reference_type": null,
    "reference_id": null,
    "metadata": {}
  }
}
```

للدفع بالتقسيط:

```json
{
  "company_id": 1,
  "payment_type": "installment",
  "items": [
    {
      "company_product_id": 10,
      "quantity": 1
    }
  ],
  "installment_plan": {
    "months": 12,
    "down_payment": 500,
    "installment_amount": 250
  },
  "idempotency_key": "unique-installment-order-key"
}
```

Business rules:

- الشركة يجب أن تكون نشطة.
- العميل يجب أن يكون مرتبطًا بالشركة.
- الطلب بالتقسيط يدعم منتجًا واحدًا فقط.
- لا يمكن إرسال `installment_plan` مع `payment_type = cash`.
- يتم حفظ snapshot للمنتج والسعر داخل `order_items`.
- عند تكرار نفس `idempotency_key` يرجع نفس الطلب ولا ينشئ طلبًا جديدًا.

---

### 3.11 تفاصيل طلب العميل

```http
GET /api/customer/orders/{order}
```

يرجع:

- حالة الطلب.
- المنتجات.
- الشركة.
- المصدر.
- سجل الحالة.

Business rules:

- العميل يرى الطلب إذا كان مالكه فقط.

---

### 3.12 طلبات الصيانة للعميل

```http
GET /api/customer/maintenance-requests
```

يرجع طلبات الصيانة الخاصة بالعميل فقط.

---

### 3.13 إنشاء طلب صيانة

```http
POST /api/customer/maintenance-requests
```

Content-Type:

```text
multipart/form-data
```

Body:

```json
{
  "company_id": 1,
  "full_name": "اسم العميل",
  "phone": "01000000000",
  "governorate_id": 1,
  "city": "مدينة نصر",
  "area": "الحي السابع",
  "address_details": "تفاصيل العنوان",
  "device_details": "فلتر 7 مراحل",
  "purification_system": "reverse_osmosis",
  "stages_count": 7,
  "last_stage_change_dates": {
    "stage_1": "2026-01-01"
  },
  "primary_problem_type": "leak",
  "malfunction_type": "weak_water",
  "notes": "ملاحظات"
}
```

يدعم ملف:

```text
image?: jpg|jpeg|png|webp
```

Business rules:

- الشركة يجب أن تكون نشطة.
- الطلب يبدأ بحالة `pending`.
- العميل يرى طلباته فقط.

---

### 3.14 تفاصيل طلب صيانة

```http
GET /api/customer/maintenance-requests/{maintenanceRequest}
```

Business rules:

- العميل لا يرى إلا طلب الصيانة التابع له.

---

### 3.15 إعجاب شركة

```http
POST /api/customer/companies/{company}/like
```

Business rules:

- الشركة يجب أن تكون نشطة.
- لا يمكن تكرار الإعجاب.
- لو العميل أعجب مسبقًا يرجع `422`.

---

### 3.16 إزالة إعجاب شركة

```http
DELETE /api/customer/companies/{company}/like
```

Business rules:

- لو لم يكن هناك إعجاب سابق يرجع `422`.

---

### 3.17 تقييم شركة

```http
POST /api/customer/companies/{company}/rating
```

Body:

```json
{
  "rating": 5,
  "comment": "خدمة ممتازة"
}
```

Business rules الحالية:

- التقييم الحالي مرتبط بالشركة والعميل، وليس بالطلب.
- لو قيّم العميل نفس الشركة مرة أخرى يتم تحديث التقييم القديم.
- هذا ليس تنفيذ BE-20 الكامل الخاص بالتقييم بعد الطلب المكتمل.

---

### 3.18 حذف تقييم شركة

```http
DELETE /api/customer/companies/{company}/rating
```

Business rules:

- لو لم يوجد تقييم سابق يرجع `422`.

---

### 3.18ب إعجاب منتج شركة

```http
POST   /api/customer/companies/{company}/products/{companyProduct}/like
DELETE /api/customer/companies/{company}/products/{companyProduct}/like
```

Business rules:

- المنتج يجب أن يكون تابعًا للشركة وظاهرًا للعامة.
- لا يمكن تكرار الإعجاب؛ لو موجود مسبقًا يرجع `422`.
- `likes_count` و`is_liked` يظهران في منتجات المتجر العامة عند وجود customer token.

سيناريوهات الفرونت:

- زر قلب على بطاقة المنتج أو صفحة التفاصيل.

---

### 3.18ج إعجاب منتج واتفل (Supplier) + قائمة إعجابات العميل

```http
POST   /api/customer/products/catalog/{supplierProduct}/like
DELETE /api/customer/products/catalog/{supplierProduct}/like
GET    /api/customer/likes/products?source=company|catalog&page=1&per_page=15
```

Business rules:

- يعمل على منتجات الـ suppliers الظاهرة (`active` + مخزون).
- لا يمكن تكرار الإعجاب؛ لو موجود مسبقًا يرجع `422`.
- `GET /customer/likes/products` يجمع إعجابات منتجات الشركة + منتجات واتفل.
- في `GET /public/products` و`GET /public/products/{id}` يظهر `likes_count` و`is_liked` (مع customer token).

كل like يُخزَّن في جدول موحّد `product_likes` (polymorphic).

سيناريوهات الفرونت:

- زر إعجاب على كتالوج واتفل.
- صفحة «إعجاباتي» عبر `GET /customer/likes/products`.

---

### 3.19 صفحة إحالات العميل

```http
GET /api/customer/referrals
```

يرجع:

```json
{
  "data": {
    "code": "A1B2C3D4",
    "link": "https://watfil.com/register?ref=A1B2C3D4",
    "stats": {
      "successful": 2,
      "pending": 1,
      "total_points_earned": 100
    },
    "referrals": [
      {
        "id": 1,
        "status": "rewarded",
        "referred_customer_id": 20,
        "first_completed_order_id": 44,
        "points_awarded": 50,
        "rewarded_at": "2026-06-25 12:00:00"
      }
    ]
  }
}
```

استخدامات FE-26:

- عرض كود الإحالة من `data.code`.
- زر نسخ الرابط يستخدم `data.link`.
- مشاركة واتساب:

```text
https://wa.me/?text={encodeURIComponent(data.link)}
```

- الإحالات الناجحة من `data.stats.successful`.
- الإحالات المعلقة من `data.stats.pending`.
- النقاط المكتسبة من `data.stats.total_points_earned`.

Business rules:

- لو العميل ليس لديه كود إحالة، يتم توليده تلقائيًا عند أول طلب للـ endpoint.
- الإحالة تبدأ `pending` بعد تسجيل مستخدم جديد بالكود.
- تتحول إلى `rewarded` بعد أول طلب مكتمل للمستخدم المُحال.

---

### 3.20 تفاصيل إحالة واحدة

```http
GET /api/customer/referrals/{customerReferral}
```

Business rules:

- العميل لا يرى إلا الإحالات التي هو صاحبها.
- لو حاول فتح إحالة لا تخصه يرجع `403`.

---

### 3.21 محفظة النقاط

```http
GET /api/customer/points/wallet
```

Auth: customer token

Response:

```json
{
  "data": {
    "customer_id": 20,
    "balance": 350,
    "pending_balance": 0,
    "updated_at": "2026-07-07 12:00:00"
  }
}
```

---

### 3.22 دفتر نقاط العميل

```http
GET /api/customer/points/ledger
```

Query params:

```text
type?: string        (category: registration_bonus|purchase_reward|referral_reward|redemption_hold|admin_adjustment|...)
status?: string      (posted|pending|...)
from?: date
to?: date
per_page?: integer   (افتراضي 15)
```

Response item:

```json
{
  "id": 101,
  "direction": "credit",
  "status": "posted",
  "category": "referral_reward",
  "points": 50,
  "balance_before": 300,
  "balance_after": 350,
  "description": "مكافأة إحالة",
  "meta": {},
  "created_at": "2026-06-25 12:00:00"
}
```

---

### 3.23 طرق كسب النقاط

```http
GET /api/customer/points/earning-methods
```

Response:

```json
{
  "data": [
    {
      "key": "registration_bonus_points",
      "value": 100,
      "description": "نقاط التسجيل"
    },
    {
      "key": "purchase_points_per_currency",
      "value": 1,
      "description": "نقاط لكل جنيه"
    }
  ]
}
```

---

### 3.24 كتالوج المكافآت (الهدايا)

```http
GET /api/customer/rewards
GET /api/customer/rewards/{reward}
```

Query (للقائمة):

```text
company_id?: integer
governorate_id?: integer
city_id?: integer
per_page?: integer
```

Response item:

```json
{
  "id": 3,
  "name": "فلتر هدية",
  "description": "...",
  "image": "https://...",
  "points_cost": 500,
  "stock_quantity": 10,
  "is_active": true,
  "is_available": true,
  "company": { "id": 5, "name": "..." },
  "governorate": { "id": 1, "name_ar": "القاهرة" },
  "city": null
}
```

Business rules: تُعرض فقط الهدايا `is_active=true` و`stock_quantity > 0`.

---

### 3.25 استبدال النقاط

```http
GET   /api/customer/points/redemptions
POST  /api/customer/points/redemptions
GET   /api/customer/points/redemptions/{pointsRedemption}
PATCH /api/customer/points/redemptions/{pointsRedemption}/cancel
```

Create body:

```json
{
  "reward_id": 3,
  "quantity": 1,
  "delivery_notes": "التوصيل للمنزل",
  "idempotency_key": "red-001"
}
```

Cancel body (اختياري):

```json
{
  "reason": "غيرت رأيي"
}
```

Status flow:

```text
pending → approved → delivering → completed
pending → rejected (إرجاع نقاط + مخزون)
pending → cancelled (من العميل — قبل المراجعة فقط)
```

Business rules:

- عند الإنشاء: خصم نقاط (`redemption_hold`) + تقليل `stock_quantity`.
- العميل لا يستطيع الإلغاء بعد خروج الطلب من `pending`.
- `idempotency_key` يمنع التكرار.

---

### 3.26 سجل التصفح للعميل المسجّل

```http
GET /api/customer/browsing/recent-products
GET /api/customer/browsing/recent-stores
```

Auth: customer token

Query:

```text
limit?: integer   (افتراضي 20)
```

نفس شكل الاستجابة في §2.14 لكن مربوط بـ `customer_id` (بدون `session_key`).

---

### 3.27 طلبات تنازل العميل (Handover)

```http
GET  /api/customer/handovers
POST /api/customer/handovers
GET  /api/customer/handovers/{handover}
POST /api/customer/handovers/{handover}/cancel
```

Create body:

```json
{
  "from_company_id": 5,
  "reason": "خدمة غير مرضية"
}
```

Response:

```json
{
  "id": 1,
  "status": "pending_grace",
  "reason": "خدمة غير مرضية",
  "grace_ends_at": "2026-07-10 12:00:00",
  "from_company": { "id": 5, "name": "..." },
  "to_company": null,
  "compensation_amount": null,
  "created_at": "2026-07-07 12:00:00"
}
```

Status flow:

```text
pending_grace (72 ساعة) → eligible (سوق التنازل)
pending_grace → resolved (الشركة الحالية حلّت المشكلة)
pending_grace|eligible → cancelled (العميل)
eligible → completed (شركة أخرى قبلت + دفع تعويض)
```

Business rules:

- العميل يجب أن يكون مرتبطًا بالشركة (`from_company_id`).
- طلب تنازل مفتوح واحد فقط لكل عميل.
- مهلة السماح: `finance.handover_grace_hours` (افتراضي 72).

---

### 3.28 المواعيد (Appointments)

```http
GET  /api/customer/appointments
POST /api/customer/appointments
GET  /api/customer/appointments/{appointment}
POST /api/customer/appointments/{appointment}/cancel
POST /api/customer/appointments/{appointment}/accept-reschedule
```

Create body:

```json
{
  "company_id": 5,
  "starts_at": "2026-07-10 10:00:00",
  "customer_notes": "أحتاج صيانة",
  "idempotency_key": "appt-001"
}
```

`idempotency_key` **مطلوب**.

Cancel body:

```json
{
  "reason": "لن أتمكن من الحضور"
}
```

`accept-reschedule`: بدون body — فقط عندما `status=reschedule_proposed`.

Status values:

```text
pending → confirmed | rejected | reschedule_proposed → confirmed | cancelled | completed
```

Response shape:

```json
{
  "id": 15,
  "status": "reschedule_proposed",
  "starts_at": "2026-07-10 10:00:00",
  "ends_at": "2026-07-10 11:00:00",
  "customer_notes": "أحتاج صيانة",
  "company_response": "اقتراح موعد جديد",
  "proposed_starts_at": "2026-07-11 14:00:00",
  "proposed_ends_at": "2026-07-11 15:00:00",
  "confirmed_at": null,
  "company": { "id": 5, "name": "...", "governorate": { "id": 1, "name_ar": "..." } }
}
```

سيناريو الفرونت:

1. `GET appointment-slots?date=` → اختيار وقت
2. `POST appointments` مع `idempotency_key`
3. متابعة الحالة + قبول إعادة الجدولة إن لزم

---

### 3.29 إحالة الطلبات للعميل (Order Referrals)

```http
GET /api/customer/order-referrals
GET /api/customer/order-referrals/{orderReferral}
```

يعرض إحالات الطلبات المرتبطة بالعميل (عندما شركة تعرض طلبه لشركات أخرى في سوق الإحالات).

Status values:

```text
listed | accepted | cancelled
```

Business rules:

- العميل يرى الإحالات الخاصة به فقط.
- إنشاء/قبول/سحب الإحالة من واجهات الشركة (§4.38).

---

## 4. Company APIs — واجهات الشركة

كل المسارات تحت:

```text
/api/company
```

ما عدا login، كل endpoints تحتاج company token.

---

### 4.1 تسجيل دخول الشركة

```http
POST /api/company/login
```

Body:

```json
{
  "tax_number": "123456789",
  "password": "password123"
}
```

سيناريوهات:

- نجاح: يرجع `token` وبيانات الشركة.
- بيانات خاطئة: `422`.
- شركة موقوفة: `403`.

---

### 4.2 تسجيل خروج الشركة

```http
POST /api/company/logout
```

---

### 4.3 بيانات الشركة الحالية

```http
GET /api/company/me
```

---

### 4.3ب إحصائيات لوحة الشركة

```http
GET /api/company/dashboard/statistics
```

Query params (اختياري):

```text
from?: date
to?: date
```

يرجع إحصائيات الشركة المصادَق عليها فقط:

- `wallet`: الرصيد وحدود التنبيه
- `orders`: عدّادات الحالات + `revenue_total` + `average_order_value`
- `products`: منتجات خاصة نشطة/إجمالي + عدد كتالوج الموردين
- `customers`: إجمالي/نشط/غير نشط
- `appointments`: عدّادات الحالات
- `handovers.outgoing`: طلبات التنازل الصادرة عن الشركة حسب الحالة
- `handovers.acquired`: العملاء الذين استحوذت عليهم الشركة
- `order_referrals`: إحالاتها الصادرة + المقبولة من السوق
- `views_count`

استخدام فرونت: شاشة Dashboard للشركة (KPIs).

---

### 4.3ج بروفايل الشركة (Company Profile)

إدارة هوية الشركة: نبذة، معرض صور، خدمات، وفريق العمل.

```http
GET  /api/company/profile
POST /api/company/profile
POST /api/company/profile/gallery
POST /api/company/profile/gallery/replace
DELETE /api/company/profile/gallery/{galleryImage}
POST /api/company/profile/services
POST /api/company/profile/services/{service}
DELETE /api/company/profile/services/{service}
POST /api/company/profile/team
POST /api/company/profile/team/{teamMember}
DELETE /api/company/profile/team/{teamMember}
```

#### تحديث النبذة / اللوجو

```http
POST /api/company/profile
Content-Type: multipart/form-data
```


| Field   | نوع                        |
| ------- | -------------------------- |
| `about` | string (اختياري، max 5000) |
| `logo`  | image (اختياري)            |


#### معرض الصور

- `POST gallery`: إضافة صورة واحدة (`image` + `sort_order?`) — حد أقصى **4**.
- `POST gallery/replace`: استبدال المعرض كاملًا — `images[]` بحد أدنى **2** وأقصى **4**.
- `DELETE gallery/{id}`: حذف صورة.

للعرض العام يظهر المعرض فقط إذا كان فيه صورتان على الأقل (§2.8).

#### الخدمات

```json
{
  "title": "تركيب وصيانة",
  "description": "تركيب فلاتر المياه",
  "icon": "wrench",
  "sort_order": 1
}
```

#### فريق العمل

`multipart`: `name`, `role?`, `photo?`, `sort_order?`

Response البروفايل يتضمن:

```text
id, name, logo, about, gallery, services, team, governorate,
gallery_count, gallery_is_complete   // true لو 2–4 صور
```

سيناريو الفرونت:

1. `GET /company/profile` → املأ الفورم
2. حدّث النبذة/اللوجو → `POST /company/profile`
3. ارفع 2–4 صور → `gallery` أو `gallery/replace`
4. أضف خدمات + فريق
5. العميل يشوف النتيجة في `GET /public/companies/{id}`

---

### 4.4 منتجات الشركة

```http
GET /api/company/products?search=فلتر&status=active&category_id=23&page=1&per_page=15
```

يرجع منتجات الشركة الخاصة بها مع خطط التقسيط والقسم والمميزات (`perks`) و`likes_count`.

---

### 4.5 إنشاء منتج شركة

```http
POST /api/company/products
```

Content-Type:

```text
multipart/form-data
```

Body:

```json
{
  "name": "فلتر مياه",
  "description": "وصف المنتج",
  "cash_price": 5000,
  "category_id": 1,
  "is_active": true,
  "installment_plans": [
    {
      "months": 12,
      "down_payment": 500,
      "installment_amount": 450
    }
  ]
}
```

ملف:

```text
image?: jpg|jpeg|png|webp max 2MB
```

Business rules:

- المنتج يتبع الشركة صاحبة الـ token.
- يمكن إنشاء خطط تقسيط مع المنتج.
- شهور التقسيط يجب أن تكون ضمن القيم المسموحة في النظام.

---

### 4.6 تفاصيل منتج شركة

```http
GET /api/company/products/{companyProduct}
```

Business rules:

- الشركة لا ترى إلا منتجاتها.
- لو حاولت رؤية منتج شركة أخرى يرجع `403`.

---

### 4.7 تعديل منتج شركة

```http
POST /api/company/products/{companyProduct}
```

نفس حقول الإنشاء لكن كلها اختيارية.

ملاحظة مهمة:

- إذا تم إرسال `installment_plans` يتم استبدال الخطط القديمة بالكامل بالقائمة الجديدة.

---

### 4.8 حذف منتج شركة

```http
DELETE /api/company/products/{companyProduct}
```

Business rules:

- الشركة لا تحذف إلا منتجاتها.
- الحذف الحالي فعلي وليس soft hide.

---

### 4.9 كتالوج الموردين المتاح للشركة

```http
GET /api/company/catalog/available
```

Query params:

```text
supplier_id?: integer
```

Business rules:

- يرجع منتجات الموردين النشطة فقط.

---

### 4.10 كتالوج الشركة المستورد

```http
GET /api/company/catalog/mine
```

يرجع منتجات الموردين التي أضافتها الشركة لمتجرها.

---

### 4.11 إضافة منتجات مورد للمتجر

```http
POST /api/company/catalog/add
```

Body:

```json
{
  "product_ids": [1, 2, 3]
}
```

Business rules:

- يتم إضافة المنتجات النشطة فقط.
- لا يتم تكرار المنتج إذا كان موجودًا بالفعل.

---

### 4.12 إزالة منتجات مورد من المتجر

```http
POST /api/company/catalog/remove
```

Body:

```json
{
  "product_ids": [1, 2]
}
```

ملاحظة للفرونت:

- هذا هو endpoint الإزالة الوحيد (واحد أو أكثر).
- لإزالة منتج واحد: `"product_ids": [1]`.
- تم إلغاء `DELETE /api/company/catalog/{supplierProduct}`.

---

### 4.13 إضافة منتج مورد واحد للمتجر

```http
POST /api/company/catalog/{supplierProduct}
```

Body الحالي في الكود:

```json
{
  "supplier_product_id": 1
}
```

ملاحظة للفرونت:

- يوجد أيضًا id في path، لكن controller يعتمد على `supplier_product_id` من body.
- الأفضل استخدام endpoint الجماعي `/catalog/add` لتجنب الالتباس.

---

### 4.15 سجل حركات محفظة الشركة

```http
GET /api/company/wallet/transactions
```

Query params:

```text
direction?: credit|debit
category?: string
from?: date
to?: date
per_page?: integer
```

Categories مهمة:

- `top_up`: شحن محفظة معتمد.
- `commission`: خصم عمولة.
- `commission_reversal`: إرجاع عمولة.
- `manual_adjustment`: تصحيح إداري.
- `manual_set_balance`: تعيين رصيد إداري.
- `withdrawal_hold`: حجز رصيد طلب سحب.
- `withdrawal_release`: إرجاع رصيد طلب سحب مرفوض.

Business rules:

- الشركة ترى حركات محفظتها فقط.
- كل حركة تحتوي على الرصيد قبل وبعد العملية.

---

### 4.16 طلبات شحن محفظة الشركة

```http
GET /api/company/wallet/topups
```

Query params:

```text
status?: pending|approved|rejected
per_page?: integer
```

---

### 4.17 إنشاء طلب شحن محفظة

```http
POST /api/company/wallet/topups
```

Content-Type:

```text
multipart/form-data
```

Body:

```json
{
  "amount": 1000,
  "transfer_method": "bank_transfer",
  "transfer_reference": "BANK-REF-123",
  "transfer_notes": "تم التحويل من حساب الشركة",
  "idempotency_key": "topup-unique-key"
}
```

ملف:

```text
proof?: jpg|jpeg|png|pdf max 5MB
```

Business rules:

- إنشاء الطلب لا يغير رصيد المحفظة.
- الرصيد يتغير فقط بعد اعتماد السوبر أدمن.
- `idempotency_key` يمنع تكرار نفس طلب الشحن.

سيناريوهات:

- `pending`: الطلب قيد المراجعة.
- `approved`: تمت إضافة الرصيد.
- `rejected`: لم تتم إضافة الرصيد، ويظهر سبب الرفض.

---

### 4.18 طلب سحب من المحفظة

```http
POST /api/company/wallet/withdrawals
```

Body:

```json
{
  "amount": 200,
  "idempotency_key": "withdrawal-key"
}
```

Business rules:

- الحد الأدنى الافتراضي للسحب `100` أو حسب config.
- عند إنشاء طلب السحب يتم خصم/حجز المبلغ فورًا بحركة `withdrawal_hold`.
- لو رفض الأدمن الطلب يرجع الرصيد بحركة `withdrawal_release`.
- `idempotency_key` يمنع تكرار حجز الرصيد.

---

### 4.19 عملاء الشركة

```http
GET /api/company/customers
```

Query params:

```text
status?: string
search?: string
per_page?: integer
```

يعرض العملاء المرتبطين بالشركة.

---

### 4.20 طلبات الشركة

```http
GET /api/company/orders
```

Query params:

```text
status?: pending|processing|completed|cancelled
customer_id?: integer
from?: date
to?: date
per_page?: integer
```

Business rules:

- الشركة ترى طلباتها فقط.

---

### 4.21 إنشاء طلب من الشركة

```http
POST /api/company/orders
```

Body:

```json
{
  "customer_id": 1,
  "payment_type": "cash",
  "items": [
    {
      "company_product_id": 10,
      "quantity": 1
    }
  ],
  "discount": 0,
  "governorate_id": 1,
  "notes": "تم إنشاء الطلب من الشركة",
  "idempotency_key": "company-order-key"
}
```

Business rules:

- الطلب يتبع الشركة صاحبة الـ token.
- العميل يجب أن يكون مرتبطًا بالشركة.
- نفس قواعد إنشاء طلب العميل تنطبق هنا.

---

### 4.22 تفاصيل طلب الشركة

```http
GET /api/company/orders/{order}
```

Business rules:

- الشركة لا ترى إلا طلباتها.

---

### 4.23 تغيير حالة طلب

```http
PATCH /api/company/orders/{order}/status
```

Body:

```json
{
  "status": "processing",
  "note": "تم قبول الطلب",
  "cancellation_reason": null
}
```

الحالات الحالية:

- `pending`
- `processing`
- `completed`
- `cancelled`

الانتقالات المسموحة:

- `pending` إلى `processing` أو `cancelled`.
- `processing` إلى `completed` أو `cancelled`.
- `completed` لا ينتقل لحالة أخرى.
- `cancelled` لا ينتقل لحالة أخرى.

Business rules:

- عند الانتقال إلى `completed` يتم خصم العمولة من محفظة الشركة.
- بعد Module 5، قاعدة العمولة قد تكون عامة أو خاصة بالشركة أو القسم.
- إذا رصيد المحفظة غير كافٍ لخصم العمولة، يفشل الانتقال برسالة رصيد غير كافٍ.
- عند الإلغاء، يتم عكس العمولة إذا كان هناك عمولة posted مرتبطة بنفس الطلب.
- عند الإلغاء يجب إرسال `cancellation_reason`.

---

### 4.24 جدول مواعيد الشركة

```http
GET    /api/company/appointment-schedule/working-hours
PUT    /api/company/appointment-schedule/working-hours
GET    /api/company/appointment-schedule/exceptions
POST   /api/company/appointment-schedule/exceptions
DELETE /api/company/appointment-schedule/exceptions/{exception}
```

PUT working-hours body:

```json
{
  "hours": [
    {
      "day_of_week": 0,
      "start_time": "09:00",
      "end_time": "17:00",
      "is_active": true
    }
  ]
}
```

`day_of_week`: 0=الأحد … 6=السبت

POST exception body:

```json
{
  "exception_date": "2026-07-15",
  "type": "closed",
  "reason": "إجازة"
}
```

أو `type: "custom_hours"` مع `start_time` + `end_time` (مطلوبان).

---

### 4.25 مواعيد الشركة

```http
GET   /api/company/appointments
GET   /api/company/appointments/{appointment}
PATCH /api/company/appointments/{appointment}/respond
POST  /api/company/appointments/{appointment}/cancel
```

Query (للقائمة):

```text
status?: string
date?: date
per_page?: integer
```

`respond` body:

```json
{
  "action": "confirm"
}
```

```json
{
  "action": "reject",
  "message": "الموعد غير متاح"
}
```

```json
{
  "action": "propose_reschedule",
  "proposed_starts_at": "2026-07-11 14:00:00",
  "message": "اقتراح موعد بديل"
}
```

`action`: `confirm` | `reject` | `propose_reschedule`

Cancel body:

```json
{
  "reason": "إغلاق مبكر"
}
```

---

### 4.26 تنازل العملاء — طلبات واردة

```http
GET /api/company/handovers/incoming
```

يعرض طلبات `pending_grace` حيث الشركة = `from_company` (الشركة الحالية للعميل).

Query: `per_page`

Response يحتوي أيضًا على `stats` لكل طلبات التنازل الصادرة عن الشركة:

```json
{
  "data": [],
  "stats": {
    "total": 10,
    "pending_grace": 3,
    "resolved": 4,
    "eligible": 1,
    "completed": 2,
    "cancelled": 0
  },
  "meta": { "total": 3, "current_page": 1, "last_page": 1, "per_page": 15 }
}
```


| الحقل           | المعنى                                      |
| --------------- | ------------------------------------------- |
| `total`         | إجمالي طلبات النقل على الشركة               |
| `pending_grace` | لسه في فترة السماح (اللي ظاهرين في القائمة) |
| `resolved`      | الشركة حلّتها                               |
| `eligible`      | دخلت سوق التنازل                            |
| `completed`     | شركة أخرى قبلت الاستحواذ                    |
| `cancelled`     | العميل ألغى                                 |


---

### 4.27 سوق التنازل (Marketplace)

```http
GET /api/company/handovers/marketplace
```

يعرض طلبات `eligible` من شركات أخرى (بعد انتهاء مهلة 72 ساعة).

---

### 4.28 رد الشركة الحالية على طلب تنازل

```http
PATCH /api/company/handovers/{handover}/respond
```

Body:

```json
{
  "action": "resolve",
  "message": "تم حل المشكلة مع العميل"
}
```

```json
{
  "action": "note",
  "message": "نتواصل مع العميل"
}
```

`action`: `resolve` | `note`

Business rules:

- فقط أثناء `pending_grace` ومن `from_company` فقط.
- `resolve` يغلق الطلب ويمنع دخوله سوق التنازل.

---

### 4.29 قبول استحواذ عميل (تنازل)

```http
POST /api/company/handovers/{handover}/accept
```

Body:

```json
{
  "compensation_amount": 500.00,
  "idempotency_key": "ho-accept-001"
}
```

Business rules:

- فقط عندما `status=eligible`.
- يخصم `compensation_amount` من محفظة الشركة المستحوذة.
- يُحوّل العميل للشركة المستحوذة.

---

### 4.30 إعلانات الشركة (Ads)

```http
GET  /api/company/ads/zones
GET  /api/company/ads/availability
GET  /api/company/ads/bookings
POST /api/company/ads/bookings
GET  /api/company/ads/campaigns
POST /api/company/ads/campaigns
GET  /api/company/ads/campaigns/{adCampaign}
POST /api/company/ads/campaigns/{adCampaign}
GET  /api/company/ads/campaigns/{adCampaign}/stats
```

Availability query:

```text
ad_zone_id: integer (مطلوب)
from: date (>= today)
to: date (>= from)
```

Create campaign body:

```json
{
  "title": "عرض صيفي",
  "image": "https://cdn.../ad.jpg",
  "target_url": "https://example.com/offer",
  "utm_source": "watfil",
  "utm_medium": "banner",
  "utm_campaign": "summer",
  "commission_type": "percentage",
  "commission_amount": 5,
  "status": "active"
}
```

Create booking body:

```json
{
  "ad_zone_id": 3,
  "position": 1,
  "dates": ["2026-07-10", "2026-07-11"],
  "ad_campaign_id": 10,
  "idempotency_key": "ad-book-001"
}
```

`position`: `1` | `2` | `3`

Business rules:

- الحجز يخصم من محفظة الشركة.
- الحملة يجب أن تكون تابعة للشركة.
- `stats` يرجع impressions/clicks للحملة.

---

### 4.31 بنرات الشركة (Banners)

```http
GET  /api/company/banners/availability
GET  /api/company/banners/bookings
POST /api/company/banners/bookings
GET  /api/company/banners/campaigns
POST /api/company/banners/campaigns
GET  /api/company/banners/campaigns/{bannerCampaign}
POST /api/company/banners/campaigns/{bannerCampaign}
```

Create banner campaign:

```json
{
  "title": "بنر ترويجي",
  "image": "https://cdn.../banner.jpg",
  "target_url": "https://example.com",
  "status": "active"
}
```

Create booking:

```json
{
  "banner_zone_id": 2,
  "dates": ["2026-07-10"],
  "banner_campaign_id": 5,
  "idempotency_key": "bnr-001"
}
```

---

### 4.32 إعلانات القائمة (Listing Ads)

```http
GET  /api/company/listing-ads/availability
GET  /api/company/listing-ads/bookings
POST /api/company/listing-ads/bookings
```

Create booking:

```json
{
  "listing_ad_zone_id": 1,
  "position": 2,
  "dates": ["2026-07-10", "2026-07-11"],
  "idempotency_key": "list-001"
}
```

ملاحظة: لا يوجد campaigns منفصلة — الحجز يرفع الشركة في قائمة الشركات حسب المحافظة.

---

### 4.33 مسارات شحن المحفظة البديلة (alias)

نفس وظيفة §4.16 و§4.17:

```http
GET  /api/company/wallet/top-up-requests
GET  /api/company/wallet/top-up-requests/{walletTopUpRequest}
POST /api/company/wallet/top-up-requests
```

`show` يرجع إضافيًا `audit_log[]` مع `action`, `note`, `metadata`.

---

### 4.34 قائمة المميزات الجاهزة للشركة

```http
GET /api/company/perk-presets
```

يرجع قائمة المميزات الجاهزة النشطة التي أنشأها السوبر أدمن، لتختار منها الشركة عند إضافة ميزة لمنتج.

كل عنصر: `id`, `title`, `description`, `type`, `icon`, `sort_order`.

Business rules:

- يرجع المميزات الجاهزة النشطة فقط.
- الاختيار اختياري؛ يمكن إضافة ميزة حرة بدون preset.

---

### 4.35 مميزات منتجات الشركة الخاصة

```http
GET /api/company/products/{companyProduct}/perks
POST /api/company/products/{companyProduct}/perks
POST /api/company/products/{companyProduct}/perks/{productPerk}
DELETE /api/company/products/{companyProduct}/perks/{productPerk}
```

Create body (من ميزة جاهزة):

```json
{
  "perk_preset_id": 2
}
```

Create body (ميزة حرة):

```json
{
  "title": "صيانة دورية كل 3 شهور",
  "description": "زيارات صيانة مجانية للفلتر كل ثلاثة أشهر",
  "type": "maintenance",
  "icon": "wrench",
  "is_active": true,
  "sort_order": 1
}
```

Business rules:

- الشركة تدير مميزات منتجاتها فقط؛ منتج شركة أخرى يرجع `403`.
- `title` مطلوب إذا لم يتم إرسال `perk_preset_id`.
- عند إرسال `perk_preset_id` يتم نسخ بيانات الميزة الجاهزة (snapshot) مع الاحتفاظ بالمرجع.
- `type`: `maintenance` | `support` | `installation` | `warranty` | `gift` | `other`.
- بدون مراجعة؛ الميزة النشطة تظهر للعميل مباشرة في المتجر العام.

---

### 4.36 مميزات منتجات الكتالوج (منتجات الموردين)

```http
GET /api/company/catalog/{supplierProduct}/perks
POST /api/company/catalog/{supplierProduct}/perks
POST /api/company/catalog/{supplierProduct}/perks/{productPerk}
DELETE /api/company/catalog/{supplierProduct}/perks/{productPerk}
```

نفس الـ body وقواعد §4.35، بشرط أن المنتج مضاف في كتالوج الشركة. المميزات مقيّدة بالشركة على نفس منتج المورد.

---

### 4.37 تفاعل العملاء مع الشركة (Engagement)

```http
GET /api/company/engagement/likes
GET /api/company/engagement/ratings
GET /api/company/engagement/products
GET /api/company/engagement/products/{companyProduct}/likes
GET /api/company/engagement/products/{companyProduct}/orders
```

Query شائع: `search`, `per_page`.

الاستخدام:

- قائمة العملاء الذين أعجبوا بالشركة أو قيّموها.
- ملخص إعجابات المنتجات.
- تفاصيل إعجابات منتج معيّن وطلبات هذا المنتج.

---

### 4.38 إحالة الطلبات بين الشركات (Order Referrals)

```http
GET  /api/company/order-referrals/mine
GET  /api/company/order-referrals/marketplace
POST /api/company/order-referrals
GET  /api/company/order-referrals/{orderReferral}
POST /api/company/order-referrals/{orderReferral}/accept
POST /api/company/order-referrals/{orderReferral}/withdraw
```

Create body:

```json
{
  "order_id": 120,
  "commission_amount": 150.00,
  "reason": "العميل خارج نطاق التغطية"
}
```

Accept body:

```json
{
  "idempotency_key": "or-accept-001"
}
```

Status: `listed` | `accepted` | `cancelled`

Business rules:

- الشركة تعرض طلبًا في السوق (`listed`) مع عمولة.
- شركات أخرى ترى السوق وتقبل (`accept`) — يُنشأ طلب جديد ويُحوَّل التعويض.
- الشركة الأصلية يمكنها سحب الإحالة (`withdraw`) طالما ما زالت `listed`.
- حدود العمولة من `finance.order_referral_min_commission` / `order_referral_max_commission`.

---

## 5. Super Admin APIs — واجهات السوبر أدمن

كل المسارات تحت:

```text
/api/super-admin
```

ما عدا login، كل endpoints تحتاج super admin token.

---

### 5.1 تسجيل دخول السوبر أدمن

```http
POST /api/super-admin/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

### 5.2 تسجيل خروج السوبر أدمن

```http
POST /api/super-admin/logout
```

---

### 5.3 بيانات السوبر أدمن الحالي

```http
GET /api/super-admin/me
```

---

### 5.4 المحافظات

```http
GET /api/super-admin/governorates
```

ملاحظة business:

- المحافظات حاليًا read-only من seeders، ولا يوجد CRUD كامل للمحافظات في الكود الحالي.

---

### 5.5 المدن

```http
GET /api/super-admin/cities
POST /api/super-admin/cities
GET /api/super-admin/cities/{city}
POST /api/super-admin/cities/{city}
DELETE /api/super-admin/cities/{city}
```

Create body:

```json
{
  "governorate_id": 1,
  "name_ar": "مدينة نصر",
  "name_en": "Nasr City",
  "is_active": true
}
```

List query:

```text
governorate_id?: integer
is_active?: boolean
search?: string
per_page?: integer
```

Business rules:

- اسم المدينة العربي فريد داخل نفس المحافظة.
- لا يمكن حذف مدينة مرتبطة بتغطية شركات.

---

### 5.6 أنواع المنتجات

```http
GET /api/super-admin/product-types
POST /api/super-admin/product-types
GET /api/super-admin/product-types/{productType}
POST /api/super-admin/product-types/{productType}
DELETE /api/super-admin/product-types/{productType}
```

Create body:

```json
{
  "name": "filters",
  "name_ar": "فلاتر"
}
```

Business rules:

- `name` فريد.
- لا يمكن حذف نوع منتج مرتبط بأقسام.

---

### 5.7 الأقسام

```http
GET /api/super-admin/categories
POST /api/super-admin/categories
GET /api/super-admin/categories/{category}
POST /api/super-admin/categories/{category}
DELETE /api/super-admin/categories/{category}
```

Create body:

```json
{
  "name": "فلاتر 7 مراحل",
  "parent_category_id": null,
  "product_type_id": 1,
  "number_of_stages": 7
}
```

List query:

```text
product_type_id?: integer
parent_category_id?: integer|null
search?: string
per_page?: integer
```

Business rules:

- لا يمكن جعل القسم أبًا لنفسه.
- لا يمكن إنشاء حلقة داخل شجرة الأقسام.
- لا يمكن حذف قسم له أقسام فرعية.
- لا يمكن حذف قسم مرتبط بمنتجات شركة أو منتجات مورد.

---

### 5.8 الشركات

```http
GET /api/super-admin/companies
POST /api/super-admin/companies
GET /api/super-admin/companies/{company}
POST /api/super-admin/companies/{company}
DELETE /api/super-admin/companies/{company}
PATCH /api/super-admin/companies/{company}/toggle-status
```

Create body:

```json
{
  "name": "شركة المياه",
  "tax_number": "123456789",
  "password": "password123",
  "governorate_id": 1,
  "is_active": true
}
```

ملف:

```text
logo?: jpg|jpeg|png|webp max 2MB
```

Business rules:

- `tax_number` فريد.
- تعطيل الشركة يمنع تسجيل دخولها ويمنع ظهورها في public.
- حذف الشركة يحذف الملف الخاص بالشعار لو موجود.

---

### 5.9 تغطية الشركة

```http
GET /api/super-admin/companies/{company}/coverage
PUT /api/super-admin/companies/{company}/coverage
```

Update body:

```json
{
  "coverage": [
    {
      "governorate_id": 1,
      "city_id": 10
    }
  ]
}
```

Business rules:

- الحد الأقصى الحالي للتغطية يعتمد على `UpdateCompanyCoverageRequest::MAX_CITY_COVERAGE`.
- التحديث يستبدل التغطية القديمة بالكامل.
- `city_id` اختياري في الكود، لكن للفلترة الدقيقة يفضل إرساله.

---

### 5.10 تفاصيل محفظة شركة

```http
GET /api/super-admin/companies/{company}/wallet
```

يرجع:

- رصيد المحفظة.
- حد المحفظة الأدنى.
- حد التحذير.
- هل الشركة مخفية عند انخفاض الرصيد.
- آخر 5 معاملات.
- `wallet_below_minimum`.
- `wallet_near_minimum`.

---

### 5.11 تعيين رصيد محفظة شركة

```http
PATCH /api/super-admin/companies/{company}/wallet
```

Body:

```json
{
  "wallet_balance": 5000,
  "reason": "تصحيح رصيد"
}
```

Business rules:

- لا يتم تعديل الرصيد مباشرة؛ يتم إنشاء حركة ledger بالفرق.
- category المستخدمة: `manual_set_balance`.

---

### 5.12 إضافة/خصم يدوي من محفظة شركة

```http
POST /api/super-admin/companies/{company}/wallet/adjust
```

Body:

```json
{
  "amount": 100,
  "type": "credit",
  "reason": "تعويض إداري",
  "idempotency_key": "admin-adjust-key"
}
```

Business rules:

- `type = credit` يضيف رصيدًا.
- `type = debit` يخصم رصيدًا.
- لا يمكن أن يصبح الرصيد سالبًا.
- `idempotency_key` يمنع تكرار نفس الحركة.
- category المستخدمة: `manual_adjustment`.

---

### 5.13 إعدادات حد المحفظة

```http
PATCH /api/super-admin/companies/{company}/wallet/settings
```

Body:

```json
{
  "wallet_min_balance": 100,
  "wallet_warning_balance": 150,
  "hide_when_wallet_below_min": true
}
```

Business rules:

- إذا `hide_when_wallet_below_min = true` ورصيد الشركة أقل من `wallet_min_balance`، الشركة لا تظهر في public listing.
- `wallet_warning_balance` يستخدم كتنبيه للفرونت في لوحة الشركة/الأدمن.

---

### 5.14 معاملات محفظة شركة

```http
GET /api/super-admin/companies/{company}/wallet/transactions
```

Query params:

```text
direction?: credit|debit
category?: string
per_page?: integer
```

---

### 5.15 قواعد العمولات

```http
GET /api/super-admin/finance/commission-rules
POST /api/super-admin/finance/commission-rules
PATCH /api/super-admin/finance/commission-rules/{commissionRule}
```

Create body:

```json
{
  "name": "عمولة عامة على الطلبات",
  "trigger": "order_completed",
  "company_id": null,
  "category_id": null,
  "calculation_type": "percentage",
  "amount": 10,
  "priority": 100,
  "is_active": true,
  "starts_at": null,
  "ends_at": null,
  "metadata": {
    "exempt_sources": ["referral"]
  }
}
```

أنواع العمولة:

- `percentage`: نسبة من إجمالي الطلب.
- `fixed`: مبلغ ثابت.

نطاقات العمولة:

- عامة: `company_id = null`, `category_id = null`.
- خاصة بشركة: `company_id = <id>`.
- خاصة بقسم: `category_id = <id>`.
- خاصة بشركة وقسم: الاثنين معًا.

Business rules:

- عند اكتمال الطلب، النظام يختار القاعدة الأكثر تخصيصًا.
- الشركة + القسم تكسب على القاعدة العامة.
- `metadata.exempt_sources` يعفي مصادر معينة مثل `referral`.
- لو الرصيد غير كافٍ لخصم العمولة يفشل إكمال الطلب.

---

### 5.16 ملخص العمولات

```http
GET /api/super-admin/finance/commissions/summary
```

Query params:

```text
from?: date
to?: date
```

يرجع:

- عدد أحداث العمولة.
- إجمالي قيمة الطلبات.
- إجمالي العمولات.
- صافي المبالغ.
- تجميع العمولات حسب الشركة.

---

### 5.17 طلبات شحن المحافظ

```http
GET /api/super-admin/finance/wallet-topup-requests
```

Query params:

```text
company_id?: integer
status?: pending|approved|rejected
per_page?: integer
```

---

### 5.18 اعتماد طلب شحن محفظة

```http
PATCH /api/super-admin/finance/wallet-topup-requests/{walletTopupRequest}/approve
```

Body:

```json
{
  "note": "تم التحقق من التحويل"
}
```

Business rules:

- الطلب يجب أن يكون `pending`.
- عند الاعتماد فقط يتم إضافة الرصيد للشركة.
- يتم إنشاء ledger transaction category = `top_up`.
- لا يمكن اعتماد نفس الطلب مرتين.

---

### 5.19 رفض طلب شحن محفظة

```http
PATCH /api/super-admin/finance/wallet-topup-requests/{walletTopupRequest}/reject
```

Body:

```json
{
  "reason": "إثبات الدفع غير واضح",
  "note": "يرجى إعادة رفع الإثبات"
}
```

Business rules:

- الطلب يجب أن يكون `pending`.
- لا يتم تعديل الرصيد.
- يظهر سبب الرفض للشركة.

---

### 5.20 طلبات السحب

```http
GET /api/super-admin/finance/withdrawal-requests
PATCH /api/super-admin/finance/withdrawal-requests/{withdrawalRequest}/approve
PATCH /api/super-admin/finance/withdrawal-requests/{withdrawalRequest}/reject
PATCH /api/super-admin/finance/withdrawal-requests/{withdrawalRequest}/pay
```

Approve body:

```json
{
  "note": "تمت الموافقة"
}
```

Reject body:

```json
{
  "reason": "بيانات غير مكتملة",
  "note": "ملاحظة داخلية"
}
```

Pay body:

```json
{
  "payout_reference": "BANK-PAYOUT-123",
  "note": "تم التحويل"
}
```

Business rules:

- الشركة تنشئ طلب السحب من حسابها.
- عند إنشاء الطلب يتم حجز الرصيد.
- الرفض يرجع الرصيد.
- الدفع يتطلب أن يكون الطلب approved.

---

### 5.21 الموردون

```http
GET /api/super-admin/suppliers
POST /api/super-admin/suppliers
GET /api/super-admin/suppliers/{supplier}
POST /api/super-admin/suppliers/{supplier}
DELETE /api/super-admin/suppliers/{supplier}
```

Create body:

```json
{
  "name": "اسم المورد",
  "description": "وصف المورد"
}
```

ملف:

```text
logo?: jpg|jpeg|png|webp max 2MB
```

---

### 5.22 منتجات الموردين

```http
GET /api/super-admin/supplier-products
POST /api/super-admin/supplier-products
GET /api/super-admin/supplier-products/{supplierProduct}
POST /api/super-admin/supplier-products/{supplierProduct}
DELETE /api/super-admin/supplier-products/{supplierProduct}
PATCH /api/super-admin/supplier-products/{supplierProduct}/toggle-status
```

Create body:

```json
{
  "name": "منتج مورد",
  "description": "وصف",
  "cash_price": 5000,
  "supplier_id": 1,
  "category_id": 1,
  "is_active": true,
  "installment_plans": [
    {
      "months": 12,
      "down_payment": 500,
      "installment_amount": 450
    }
  ]
}
```

ملف:

```text
image?: jpg|jpeg|png|webp max 2MB
```

Business rules:

- تعطيل منتج مورد يمنعه من الظهور في كتالوج المنتجات المتاحة للشركات.
- خطط التقسيط تستبدل بالكامل عند إرسال `installment_plans` في التعديل.

---

### 5.23 مراقبة الطلبات

```http
GET /api/super-admin/orders
GET /api/super-admin/orders/{order}
```

Query params للقائمة:

```text
status?: pending|processing|completed|cancelled
company_id?: integer
customer_id?: integer
from?: date
to?: date
per_page?: integer
```

Business rules:

- السوبر أدمن يراقب كل الطلبات.
- لا يوجد endpoint حالي لتغيير حالة الطلب من السوبر أدمن؛ تغيير الحالة من الشركة.

---

### 5.24 تقارير الإحالات

```http
GET /api/super-admin/referrals
GET /api/super-admin/referrals/summary
```

Query params لقائمة الإحالات:

```text
status?: pending|rewarded|invalid
referrer_customer_id?: integer
referred_customer_id?: integer
from?: date
to?: date
per_page?: integer
```

Response لقائمة الإحالات:

```json
{
  "data": [
    {
      "id": 1,
      "status": "rewarded",
      "referrer_customer_id": 10,
      "referred_customer_id": 20,
      "first_completed_order_id": 44,
      "points_awarded": 50,
      "rewarded_at": "2026-06-25 12:00:00"
    }
  ],
  "meta": {
    "total": 1,
    "current_page": 1,
    "last_page": 1,
    "per_page": 15
  }
}
```

Response للملخص:

```json
{
  "data": {
    "total": 10,
    "pending": 4,
    "rewarded": 5,
    "invalid": 1,
    "points_awarded": 250
  }
}
```

Business rules:

- `pending`: مستخدم جديد سجل بكود إحالة ولم يكمل أول طلب بعد.
- `rewarded`: أول طلب للمستخدم المُحال اكتمل وتم منح النقاط لصاحب الإحالة.
- `invalid`: تم اكتشاف أن أول طلب مكتمل ليس مؤهلًا للمكافأة.

---

### 5.25 إحصائيات لوحة التحكم

```http
GET /api/super-admin/dashboard/statistics
```

Query params:

```text
from?: date
to?: date
governorate_id?: integer
company_id?: integer
months?: integer   (افتراضي 12)
```

يرجع:

- `filters`
- `kpis` (orders, revenue, platform, companies, customers, suppliers, blog, appointments, maintenance_requests)
- `period`
- `monthly_sales`

---

### 5.26 إدارة العملاء

```http
GET   /api/super-admin/customers
GET   /api/super-admin/customers/{customer}
PATCH /api/super-admin/customers/{customer}/risk-flag
```

Query (index):

```text
is_active?: boolean
search?: string   (هاتف/إيميل/اسم/كود إحالة)
per_page?: integer
```

Show response (حقول رئيسية):

```json
{
  "id": 20,
  "phone": "01000000000",
  "email": "user@example.com",
  "is_active": true,
  "referral_code": "A1B2C3D4",
  "profile": { "full_name": "...", "risk_flag": false },
  "points_wallet": { "balance": 350, "pending_balance": 0 },
  "received_referral": { "status": "rewarded", "points_awarded": 50 },
  "companies": [{ "id": 5, "name": "...", "status": "active", "linked_at": "..." }],
  "stats": {
    "orders_count": 3,
    "sent_referrals_count": 2,
    "points_redemptions_count": 1
  }
}
```

Risk flag body:

```json
{
  "risk_flag": true
}
```

---

### 5.27 إعدادات النقاط

```http
GET   /api/super-admin/points/settings
PATCH /api/super-admin/points/settings
```

PATCH body:

```json
{
  "registration_bonus_points": 100,
  "purchase_points_per_currency": 1,
  "purchase_currency_unit": 100,
  "require_review_before_order_points": false,
  "referral_reward_points": 50
}
```

---

### 5.28 محفظة ودفتر نقاط عميل (أدمن)

```http
GET  /api/super-admin/customers/{customer}/points/wallet
GET  /api/super-admin/customers/{customer}/points/ledger
POST /api/super-admin/customers/{customer}/points/adjust
```

Adjust body:

```json
{
  "direction": "credit",
  "points": 100,
  "reason": "تعويض عن شكوى",
  "idempotency_key": "adj-001"
}
```

`direction`: `credit` | `debit`

---

### 5.29 إدارة كتالوج المكافآت

```http
GET    /api/super-admin/rewards
POST   /api/super-admin/rewards
GET    /api/super-admin/rewards/{reward}
POST   /api/super-admin/rewards/{reward}
DELETE /api/super-admin/rewards/{reward}
PATCH  /api/super-admin/rewards/{reward}/toggle-status
```

Create body (multipart):

```json
{
  "name": "فلتر هدية",
  "description": "...",
  "points_cost": 500,
  "stock_quantity": 20,
  "company_id": 5,
  "governorate_id": 1,
  "city_id": null,
  "is_active": true
}
```

ملف:

```text
image?: jpg|jpeg|png|webp max 2MB
```

Business rules: لا يمكن حذف هدية لها طلبات استبدال — استخدم `toggle-status`.

---

### 5.30 مراجعة طلبات استبدال النقاط

```http
GET   /api/super-admin/points/redemptions
GET   /api/super-admin/points/redemptions/{pointsRedemption}
PATCH /api/super-admin/points/redemptions/{pointsRedemption}/approve
PATCH /api/super-admin/points/redemptions/{pointsRedemption}/reject
PATCH /api/super-admin/points/redemptions/{pointsRedemption}/status
PATCH /api/super-admin/points/redemptions/{pointsRedemption}/cancel
```

Query:

```text
customer_id?: integer
reward_id?: integer
status?: string
per_page?: integer
```

Reject body:

```json
{
  "reason": "الهدية غير متوفرة"
}
```

Update status body:

```json
{
  "status": "delivering"
}
```

أو `"completed"`

Admin flow:

```text
pending → approve → delivering → completed
pending → reject (إرجاع نقاط + مخزون)
أي حالة مفتوحة → cancel (admin override)
```

---

### 5.31 مناطق وحجوزات الإعلانات (Ad Zones)

```http
GET   /api/super-admin/ads/zones
POST  /api/super-admin/ads/zones
GET   /api/super-admin/ads/zones/{adZone}
PUT   /api/super-admin/ads/zones/{adZone}/slot-prices
GET   /api/super-admin/ads/bookings
PATCH /api/super-admin/ads/bookings/{adBooking}/cancel
```

Create zone body:

```json
{
  "scope": "governorate",
  "governorate_id": 1,
  "city_id": null,
  "is_active": true
}
```

`scope`: `homepage` | `governorate` | `city`

Update slot prices:

```json
{
  "prices": [
    { "position": 1, "price_per_day": 200 },
    { "position": 2, "price_per_day": 150 },
    { "position": 3, "price_per_day": 100 }
  ]
}
```

Bookings query:

```text
status?: string
company_id?: integer
ad_zone_id?: integer
from?: date
to?: date
per_page?: integer
```

---

### 5.32 مناطق وحجوزات البنرات

```http
GET   /api/super-admin/banners/zones
POST  /api/super-admin/banners/zones
GET   /api/super-admin/banners/zones/{bannerZone}
PUT   /api/super-admin/banners/zones/{bannerZone}/slot-prices
GET   /api/super-admin/banners/bookings
PATCH /api/super-admin/banners/bookings/{bannerBooking}/cancel
```

Create zone:

```json
{
  "governorate_id": 1,
  "is_active": true
}
```

محافظة واحدة لكل zone.

---

### 5.33 مناطق وحجوزات إعلانات القائمة (Listing Ads)

```http
GET   /api/super-admin/listing-ads/zones
POST  /api/super-admin/listing-ads/zones
GET   /api/super-admin/listing-ads/zones/{listingAdZone}
PUT   /api/super-admin/listing-ads/zones/{listingAdZone}/slot-prices
GET   /api/super-admin/listing-ads/bookings
PATCH /api/super-admin/listing-ads/bookings/{listingAdBooking}/cancel
```

نفس نمط البنرات — zone لكل محافظة، positions 1–3.

---

### 5.34 مراقبة طلبات التنازل

```http
GET /api/super-admin/handovers
GET /api/super-admin/handovers/{handover}
```

Query:

```text
status?: string
company_id?: integer   (from أو to)
per_page?: integer
```

Show includes: `events`, `debit_transaction_id`, `credit_transaction_id`

---

### 5.35 متابعة المواعيد (أدمن)

```http
GET /api/super-admin/appointments
GET /api/super-admin/appointments/{appointment}
```

Query:

```text
status?: string
company_id?: integer
customer_id?: integer
date_from?: date
date_to?: date
per_page?: integer
```

---

### 5.36 تقرير المعاملات المالية — ملخص

```http
GET /api/super-admin/finance/wallet-transactions/summary
```

Query params:

```text
from?: date
to?: date
governorate_id?: integer
company_id?: integer
direction?: credit|debit
category?: string
type?: commission|withdrawal|subscription|deposit|ad|handover|other
status?: completed|processing
```

الاستجابة فيها:

- `totals`
- `sources` (جاهزة لكروت النسب: عمولات/اشتراكات/إعلانات وبنرات/تنازل...)
- `by_category`

---

### 5.37 تقرير المعاملات المالية — جدول

```http
GET /api/super-admin/finance/wallet-transactions
```

نفس فلاتر §5.36 + `per_page`.

حقول UI المهمة في كل صف:

- `transaction_number` (مثل `TRX-1001`)
- `company_name`
- `type`, `type_label_ar`
- `amount` (signed — سالب للخصم، موجب للإضافة)
- `currency_label_ar`
- `status`, `status_label_ar`
- `reference` (مثل `ORD-`, `WDR-`, `TOP-`, `SUB-`)
- `date`

---

### 5.38 alias طلبات الشحن

نفس وظيفة §5.17–5.19:

```http
GET   /api/super-admin/finance/top-up-requests
PATCH /api/super-admin/finance/top-up-requests/{walletTopUpRequest}/approve
PATCH /api/super-admin/finance/top-up-requests/{walletTopUpRequest}/reject
```

---

### 5.39 إدارة المميزات الجاهزة (Perk Presets)

```http
GET /api/super-admin/perk-presets
POST /api/super-admin/perk-presets
GET /api/super-admin/perk-presets/{perkPreset}
POST /api/super-admin/perk-presets/{perkPreset}
DELETE /api/super-admin/perk-presets/{perkPreset}
PATCH /api/super-admin/perk-presets/{perkPreset}/toggle-status
```

Query params للقائمة:

```text
is_active?: boolean
type?: maintenance|support|installation|warranty|gift|other
per_page?: integer
```

Create/Update body:

```json
{
  "title": "دعم فني 24 ساعة",
  "description": "خدمة عملاء ودعم فني على مدار الساعة",
  "type": "support",
  "icon": "headset",
  "is_active": true,
  "sort_order": 1
}
```

Business rules:

- قائمة جاهزة تختار منها الشركات عند إضافة ميزة لمنتج.
- إيقاف الميزة الجاهزة يخفيها من قائمة الاختيار، ولا يؤثر على المميزات المضافة سابقًا للمنتجات (snapshot).

---

### 5.40 مراقبة إحالة الطلبات

```http
GET /api/super-admin/order-referrals
GET /api/super-admin/order-referrals/{orderReferral}
```

عرض ومراقبة إحالات الطلبات بين الشركات (listed / accepted / cancelled).

---

### 5.41 طلبات انضمام الشركات

```http
GET   /api/super-admin/company-join-requests
GET   /api/super-admin/company-join-requests/{companyJoinRequest}
PATCH /api/super-admin/company-join-requests/{companyJoinRequest}/mark-processed
```

Query params للقائمة:

```text
status?: pending|processed
q?: string          // بحث في اسم الشركة / الرقم الضريبي / الهاتف / الإيميل / اسم المسؤول
page?: integer
per_page?: integer  // أقصى 100
```

Mark processed body:

```json
{
  "admin_notes": "تم إنشاء الحساب يدويًا"
}
```

`admin_notes` اختياري (max 1000).

Business rules:

- الطلب العام يُنشأ من §2.18 بحالة `pending`.
- `mark-processed` يعلّم الطلب `processed` ويسجّل `processed_by` + `processed_at`.
- لا ينشئ حساب شركة تلقائيًا من هذا الـ endpoint — إنشاء الشركة يدويًا عبر §5.8 ثم تعليم الطلب كمعالَج.
- إعادة `mark-processed` على طلب غير `pending` → `422`.

Response العنصر يشمل: بيانات الطلب + `governorate` + `processor` (عند التحميل) + `admin_notes` + `processed_at`.

---

## 6. سيناريوهات Business كاملة مهمة

### 6.1 دورة الطلب والعمولة

1. العميل أو الشركة ينشئ طلبًا.
2. الطلب يبدأ `pending`.
3. الشركة تغيره إلى `processing`.
4. الشركة تغيره إلى `completed`.
5. عند `completed`:
  - يتم اختيار قاعدة العمولة المناسبة.
  - يتم خصم العمولة من محفظة الشركة.
  - يتم إنشاء `commission_event`.
  - يتم إنشاء `wallet_transaction` category = `commission`.
6. لو رصيد الشركة غير كافٍ:
  - يفشل تغيير الحالة إلى completed.
  - يجب على الشركة شحن المحفظة أو على الأدمن تعديل الرصيد.

---

### 6.2 دورة طلب شحن المحفظة

1. الشركة تنشئ طلب شحن عبر `/api/company/wallet/topups`.
2. الطلب يظهر `pending`.
3. السوبر أدمن يراجع بيانات التحويل وإثبات الدفع.
4. إذا تم الاعتماد:
  - يتحول الطلب إلى `approved`.
  - يتم إضافة الرصيد.
  - يتم إنشاء ledger movement category = `top_up`.
5. إذا تم الرفض:
  - يتحول الطلب إلى `rejected`.
  - لا يتغير الرصيد.
  - يظهر `rejection_reason` للشركة.

---

### 6.3 حد المحفظة وظهور الشركة

1. السوبر أدمن يحدد:
  - `wallet_min_balance`.
  - `wallet_warning_balance`.
  - `hide_when_wallet_below_min`.
2. لو رصيد الشركة أقل من `wallet_warning_balance`:
  - يظهر `wallet_near_minimum = true`.
  - الفرونت يعرض تنبيه.
3. لو رصيد الشركة أقل من `wallet_min_balance` و `hide_when_wallet_below_min = true`:
  - الشركة لا تظهر في `/api/public/companies`.
  - تفاصيل الشركة العامة ترجع `404`.
4. بعد الشحن وعودة الرصيد فوق الحد:
  - الشركة تظهر تلقائيًا بدون تدخل إضافي.

---

### 6.4 إدارة تغطية الشركة

1. السوبر أدمن يفتح تغطية الشركة.
2. يرسل قائمة المحافظات/المدن.
3. النظام يستبدل التغطية القديمة بالجديدة.
4. public company listing يستخدم التغطية للفلترة حسب المحافظة والمدينة.

---

### 6.5 منتجات الشركة والكتالوج

الشركة لديها مصدران للمنتجات:

- منتجات أنشأتها بنفسها من `/api/company/products`.
- منتجات موردين مضافة إلى كتالوجها من `/api/company/catalog/add`.

في الواجهة العامة:

- endpoint `/api/public/companies/{company}/products` يدمج المصدرين.
- حقل `source` يوضح مصدر المنتج.

---

### 6.6 دورة الإحالة والنقاط

1. العميل الحالي يفتح صفحة الإحالات:

```http
GET /api/customer/referrals
```

1. الفرونت يعرض:
  - `code` ككود الإحالة.
  - `link` كرابط قابل للنسخ والمشاركة.
  - `stats.pending` و`stats.successful`.
  - `stats.total_points_earned`.
2. المستخدم الجديد يفتح رابط مثل:

```text
https://watfil.com/register?ref=A1B2C3D4
```

1. الفرونت يحفظ `ref` مؤقتًا، ويمكن التحقق منه:

```http
GET /api/public/referrals/validate?code=A1B2C3D4
```

1. عند التسجيل، يرسل الفرونت:

```json
{
  "referral_code": "A1B2C3D4"
}
```

مع باقي بيانات التسجيل.

1. النظام ينشئ سجل إحالة `pending`.
2. عندما يكمل المستخدم المُحال أول طلب (`completed`):
  - النظام يمنح صاحب الإحالة نقاط `referral_reward_points`.
  - تتحول الإحالة إلى `rewarded`.
  - يتم حفظ `first_completed_order_id`.

Business rules:

- لا يمكن استخدام كود إحالة غير موجود.
- لا يمكن تكرار الإحالة لنفس المستخدم الجديد.
- المكافأة تُمنح مرة واحدة فقط لأول طلب مكتمل.
- نقاط الإحالة تظهر في محفظة النقاط كحركة `referral_reward`.

---

### 6.7 دورة حجز موعد

1. العميل يفتح صفحة الشركة ويختار تاريخًا.
2. `GET /api/public/companies/{company}/appointment-slots?date=` لعرض الأوقات المتاحة.
3. `POST /api/customer/appointments` مع `idempotency_key`.
4. الشركة ترد عبر `PATCH /api/company/appointments/{id}/respond`.
5. إذا `propose_reschedule`: العميل يقبل عبر `POST .../accept-reschedule`.

---

### 6.8 دورة استبدال النقاط

1. العميل يتصفح `GET /api/customer/rewards`.
2. ينشئ طلب استبدال `POST /api/customer/points/redemptions`.
3. النقاط تُخصم فورًا (`redemption_hold`) والمخزون يقل.
4. السوبر أدمن يراجع: `approve` → `delivering` → `completed`.
5. عند `reject` أو `cancel`: تُرجع النقاط والمخزون.

---

### 6.9 دورة تنازل عميل (Handover)

1. العميل ينشئ `POST /api/customer/handovers` — تبدأ مهلة 72 ساعة (`pending_grace`).
2. الشركة الحالية ترد `PATCH /api/company/handovers/{id}/respond` (resolve أو note).
3. إذا لم تُحل المشكلة: بعد 72 ساعة → `eligible` في سوق التنازل.
4. شركة أخرى تقبل `POST /api/company/handovers/{id}/accept` مع `compensation_amount`.
5. يُخصم التعويض من محفظة الشركة المستحوذة ويُنقل العميل.

---

### 6.10 دورة حجز إعلان

1. الشركة تستعرض `GET /api/company/ads/zones`.
2. تتحقق من التوفر `GET /api/company/ads/availability`.
3. تنشئ حملة `POST /api/company/ads/campaigns`.
4. تحجز مواقع `POST /api/company/ads/bookings` — يُخصم من المحفظة.
5. الواجهة العامة تعرض الإعلانات عبر `/api/public/ads/...`.
6. الفرونت يسجّل impressions ويستخدم `track/{trackingCode}` للنقرات.

---

### 6.11 دورة التصفح الأخير

1. عند فتح منتج: `POST /api/public/browsing/products/view` (مع `session_key` للزائر).
2. عند فتح متجر: `POST /api/public/browsing/stores/visit`.
3. الصفحة الرئيسية تعرض `GET /api/public/browsing/recent-products` و`recent-stores`.
4. للعميل المسجّل: نفس البيانات من `/api/customer/browsing/...` بدون `session_key`.

---

### 6.12 دورة مميزات المنتجات (Perks)

1. السوبر أدمن ينشئ قائمة مميزات جاهزة من `/api/super-admin/perk-presets`.
2. الشركة تجلب القائمة من `/api/company/perk-presets`.
3. تضيف ميزة لمنتج خاص أو منتج كتالوج (من preset أو حرة).
4. الميزة النشطة تظهر مباشرة للعميل في `/api/public/companies/{company}/products` عبر `has_perks` و`perks`.
5. نفس منتج المورد قد يظهر بمميزات مختلفة عند شركات مختلفة (company-scoped).

---

### 6.13 دورة إحالة طلب بين شركات

1. الشركة أ تعرض طلبًا: `POST /api/company/order-referrals` مع `order_id` و`commission_amount`.
2. الطلب يظهر في `GET /api/company/order-referrals/marketplace` للشركات الأخرى.
3. الشركة ب تقبل: `POST .../accept` مع `idempotency_key`.
4. يُنشأ طلب جديد ويُحوَّل التعويض حسب قواعد المحفظة.
5. يمكن للشركة أ سحب الإحالة طالما الحالة `listed`.
6. العميل يتابع عبر `/api/customer/order-referrals`.

---

### 6.14 دورة تصفح منتجات واتفل

1. اختيار محافظة: `GET /api/public/governorates` (+ `GET /api/public/statistics` للـ homepage).
2. قائمة المنتجات: `GET /api/public/products?governorate_id=…` مع فلاتر اختيارية.
3. تفاصيل المنتج: `GET /api/public/products/{id}`.
4. مقارنة عروض الشركات: `GET /api/public/products/{id}/companies?governorate_id=…` — هنا يظهر التقسيط والـ perks لكل شركة.
5. اختيار شركة → متجرها أو صفحة هويتها `/public/companies/{id}`.

---

### 6.15 دورة بروفايل الشركة

1. الشركة تفتح `GET /api/company/profile`.
2. تحديث النبذة/اللوجو ثم المعرض (2–4 صور) والخدمات والفريق.
3. العميل يرى النتيجة في `GET /api/public/companies/{id}` مع `products` و`ratings`.

---

### 6.16 دورة طلب انضمام شركة

1. زائر يملأ نموذج الانضمام: `POST /api/public/company-join-requests`.
2. الطلب يُحفظ `pending`.
3. السوبر أدمن يراجع: `GET /api/super-admin/company-join-requests?status=pending`.
4. بعد إنشاء الحساب يدويًا (§5.8): `PATCH .../mark-processed` مع `admin_notes` اختياري.

---

## 7. ملاحظات مهمة وحدود التنفيذ الحالي

هذه نقاط يجب أن يعرفها الفرونت والعميل:

- المحافظات حاليًا read-only وليست CRUD كامل.
- حالات الطلب الحالية: `pending`, `processing`, `completed`, `cancelled`.
- التقييم الحالي للشركة غير مربوط بطلب مكتمل.
- نظام الإحالات موجود؛ إشعارات الإحالة ليست موجودة لأن notification center غير منفذ بعد.
- نظام النقاط والمكافآت والاستبدال موجود بالكامل (§3.21–3.25 و§5.27–5.30).
- مميزات المنتجات (Perks) موجودة بالكامل (§4.34–4.36 و§5.39 و§2.9).
- إحالة الطلبات بين الشركات موجودة (§3.29 و§4.38 و§5.40).
- تصفح منتجات واتفل موجود (§2.17 و§6.14) — التقسيط على مستوى عرض الشركة وليس قائمة الكتالوج العامة.
- بروفايل الشركة (about/gallery/services/team) موجود (§4.3ج و§2.8 و§6.15).
- طلبات انضمام الشركات موجودة (§2.18 و§5.41 و§6.16) — بدون إنشاء حساب تلقائي.
- إحصائيات لوحة الشركة: `GET /api/company/dashboard/statistics` (§4.3ب).
- إحصائيات الموقع العامة: `GET /api/public/statistics` (§2.3ب).
- إزالة منتج من كتالوج الشركة عبر `POST /catalog/remove` فقط (لا يوجد DELETE مفرد).
- لا يوجد notification center كامل؛ أي إشعار يظهر من خلال حالة الطلب/الرد وليس notification داخلي.
- لا يوجد Frontend-specific cart API؛ إنشاء الطلب يتم مباشرة من items.
- لا يوجد API مقارنة منتجات حاليًا (`is_in_compare` placeholder في الكتالوج).
- لا توجد دورة طلب تقسيط كاملة بالمستندات والعرض النهائي؛ الموجود هو خطط تقسيط على المنتج وsnapshot داخل الطلب.
- منتجات الكتالوج في قائمة واتفل لا تحمل خطط تقسيط؛ الخطط تظهر في `/products/{id}/companies` ومتجر الشركة.
- مسارات `wallet/topups` و`wallet/top-up-requests` متطابقة (alias) — استخدم واحدًا بشكل ثابت في الفرونت.
- مسارات `finance/wallet-topup-requests` و`finance/top-up-requests` متطابقة (alias) في السوبر أدمن.

---

## 8. Checklist للفرونت عند التكامل

- حفظ token منفصل لكل role وعدم خلط customer/company/admin tokens.
- إرسال `Accept: application/json` دائمًا.
- استخدام `multipart/form-data` مع الصور وإثباتات الدفع.
- استخدام `idempotency_key` في العمليات المالية والطلبات لتجنب التكرار.
- التعامل مع `422` كخطأ validation/business وليس crash.
- إظهار empty states للقوائم.
- إظهار رسائل واضحة عند إخفاء شركة بسبب المحفظة أو تعطيل الشركة.
- في لوحة الشركة، عرض تنبيه إذا `wallet_near_minimum = true`.
- في إكمال الطلب، توقع فشل بسبب رصيد المحفظة غير كافٍ للعمولة.
- في التسجيل، إذا كان الرابط يحتوي `?ref=` احفظ الكود وأرسله كـ `referral_code`.
- في صفحة الإحالات، استخدم `GET /api/customer/referrals` كمصدر واحد للكود والرابط والإحصائيات.
- للزائر: احفظ `session_key` في localStorage واستخدمه في browsing وads impressions.
- في حجز المواعيد: استخدم `appointment-slots` قبل الإنشاء و`idempotency_key` عند الحجز.
- في التنازل: اعرض `grace_ends_at` countdown للعميل والشركة الحالية.
- في الإعلانات: سجّل impression عند العرض واستخدم redirect link للنقر.
- في استبدال النقاط: اعرض `pending_balance` من محفظة النقاط أثناء المراجعة.
- في المميزات: اعرض `has_perks`/`perks` في المتجر العام، ووفّر UI للشركة للاختيار من presets أو إدخال حر.
- في Dashboard الشركة: استخدم `/api/company/dashboard/statistics` كمصدر KPIs واحد.
- في إعجابات المنتج: استخدم `POST/DELETE .../products/{id}/like` وحدّث `likes_count`/`is_liked` محليًا.
- في إحالة الطلبات: افصل شاشات `mine` و`marketplace`، واستخدم `idempotency_key` عند القبول.
- في تصفح واتفل: مرّر `governorate_id` مبكرًا؛ و`governorate_id` إجباري فقط في `/products/{id}/companies`.
- في بروفايل الشركة: ارفع صورتين على الأقل قبل الاعتماد على ظهور المعرض للعامة.
- في طلب الانضمام: تعامل مع `422` لتكرار الرقم الضريبي/الهاتف، وأظهر رسالة النجاح بعد `201`.

---

## 9. فهرس سريع للموديولات الجديدة

هذا القسم مرجع سريع. التفاصيل الكاملة موجودة في الأقسام الرئيسية أعلاه.


| الموديول                             | الأقسام التفصيلية     |
| ------------------------------------ | --------------------- |
| Public Blog + SEO                    | §9.1 (أدناه) + §2     |
| Public Site Statistics               | §2.3ب                 |
| Public Catalog Browse                | §2.17                 |
| Public Company Join Request          | §2.18                 |
| Public Browsing + Product Show       | §2.13 – §2.14         |
| Public Ads + Banners                 | §2.15 – §2.16         |
| Product Perks (عام)                  | §2.9 + §2.13 + §2.17  |
| Customer Points & Rewards            | §3.21 – §3.25         |
| Customer Product Likes               | §3.18ب – §3.18ج       |
| Customer Handovers                   | §3.27                 |
| Customer Appointments                | §3.28 + §2.12         |
| Customer Order Referrals             | §3.29                 |
| Company Dashboard Stats              | §4.3ب                 |
| Company Profile                      | §4.3ج + §2.8          |
| Company Schedule + Appointments      | §4.24 – §4.25         |
| Company Handovers                    | §4.26 – §4.29         |
| Company Ads / Banners / Listing      | §4.30 – §4.32         |
| Company Perks                        | §4.34 – §4.36         |
| Company Engagement                   | §4.37                 |
| Company Order Referrals              | §4.38                 |
| Super Admin Customers + Points       | §5.26 – §5.30         |
| Super Admin Ad Zones                 | §5.31 – §5.33         |
| Super Admin Handovers + Appointments | §5.34 – §5.35         |
| Super Admin Perk Presets             | §5.39                 |
| Super Admin Order Referrals          | §5.40                 |
| Super Admin Company Join Requests    | §5.41                 |
| Dashboard + Finance Report           | §5.25 + §5.36 – §5.37 |
| Business سيناريوهات                  | §6.7 – §6.16          |


### 9.1 Public Blog + SEO APIs

#### 9.1.1 تصنيفات ووسوم المدونة العامة

```http
GET /api/public/blog/categories
GET /api/public/blog/tags
```

استخدام فرونت:

- صفحة المدونة الرئيسية: tabs/filters للتصنيفات والوسوم.
- شجرة التصنيفات تدعم `parent_id` في `categories`.

---

#### 9.1.2 قائمة مقالات المدونة العامة

```http
GET /api/public/blog/articles
```

أهم Query Params:

- `blog_category_id`
- `category_slug`
- `tag_slug`
- `search`
- `company_id`
- `product_id`
- `category_id`
- `per_page`

Business intent:

- دعم فلترة المقالات حسب المحتوى أو الارتباط التجاري (شركة/منتج/قسم).
- دعم SEO pages حسب slug + search داخل المقالات.

---

#### 9.1.3 تفاصيل مقال + مقالات الشركة

```http
GET /api/public/blog/articles/{slug}
GET /api/public/companies/{company}/blog-articles
```

استخدام فرونت:

- صفحة تفاصيل المقال تعتمد على `slug`.
- صفحة تفاصيل الشركة يمكنها إظهار مقالات مرتبطة بالشركة.

---

#### 9.1.4 Analytics للمدونة (مشاهدات ونقرات)

```http
POST /api/public/blog/articles/{slug}/views
POST /api/public/blog/articles/{slug}/links/{link}/clicks
```

مهم:

- endpoint المشاهدات يدعم `session_key` لمنع التكرار غير المنطقي.
- endpoint النقرات يسجل CTR للروابط المرتبطة بالمقال.

---

#### 9.1.5 Sitemap + Redirect Resolve

```http
GET /api/public/sitemap.xml
GET /api/public/redirects/resolve?path=/old-path
```

استخدام فرونت:

- عند فتح slug قديم، الفرونت يقدر يعمل resolve قبل 404.
- `sitemap.xml` جاهز لربط SEO crawler/robots.

---

### 9.2 Super Admin Blog Management APIs

#### 9.2.1 إدارة تصنيفات المدونة

```http
GET    /api/super-admin/blog/categories
POST   /api/super-admin/blog/categories
GET    /api/super-admin/blog/categories/{blogCategory}
POST   /api/super-admin/blog/categories/{blogCategory}
DELETE /api/super-admin/blog/categories/{blogCategory}
```

---

#### 9.2.2 إدارة الوسوم

```http
GET    /api/super-admin/blog/tags
POST   /api/super-admin/blog/tags
GET    /api/super-admin/blog/tags/{blogTag}
POST   /api/super-admin/blog/tags/{blogTag}
DELETE /api/super-admin/blog/tags/{blogTag}
```

---

#### 9.2.3 إدارة المقالات

```http
GET    /api/super-admin/blog/articles
POST   /api/super-admin/blog/articles
GET    /api/super-admin/blog/articles/{blogArticle}
POST   /api/super-admin/blog/articles/{blogArticle}
PATCH  /api/super-admin/blog/articles/{blogArticle}/status
DELETE /api/super-admin/blog/articles/{blogArticle}
```

أهم فلاتر القائمة:

- `status`
- `blog_category_id`
- `tag_id`
- `author_id`
- `search`
- `per_page`

Business rules:

- lifecycle للمقال: مسودة/مجدول/منشور/مخفي.
- دعم رفع صور المقال و OG image.
- دعم slug مخصص وSEO metadata.

---

#### 9.2.4 إدارة Redirects

```http
GET    /api/super-admin/redirects
POST   /api/super-admin/redirects
GET    /api/super-admin/redirects/{urlRedirect}
POST   /api/super-admin/redirects/{urlRedirect}
DELETE /api/super-admin/redirects/{urlRedirect}
```

أهم Query Params للقائمة:

- `is_active`
- `search`
- `per_page`

مهم للفرونت:

- في لوحة SEO، وفر UI لإدارة `from_path`, `to_path`, `status_code`.
- بعد أي تعديل redirect، الـ sitemap cache بيتم تحديثه backend.

---

### 9.3–9.5 موديولات موثّقة في الأقسام الرئيسية

التفاصيل الكاملة (payloads + business rules) موجودة في:

- **المواعيد:** §3.28 (عميل) + §4.24–4.25 (شركة) + §5.35 (أدمن) + §2.12 (فتحات المواعيد)
- **Dashboard سوبر أدمن:** §5.25
- **Dashboard شركة:** §4.3ب
- **تقرير المعاملات المالية:** §5.36–5.37
- **النقاط والمكافآت:** §3.21–3.25 + §5.27–5.30
- **التنازل (Handover):** §3.27 + §4.26–4.29 + §5.34
- **الإعلانات والبنرات:** §2.15–2.16 + §4.30–4.32 + §5.31–5.33
- **التصفح:** §2.14 + §3.26
- **مميزات المنتجات (Perks):** §2.9 + §4.34–4.36 + §5.39 + §6.12
- **إحالة الطلبات:** §3.29 + §4.38 + §5.40 + §6.13
- **تصفح منتجات واتفل:** §2.17 + §6.14
- **بروفايل الشركة:** §4.3ج + §2.8 + §6.15
- **طلبات انضمام الشركات:** §2.18 + §5.41 + §6.16
- **Engagement الشركة:** §4.37 + §3.15–3.18ج

---

### 9.6 ملاحظات تكامل إضافية للفرونت بعد التحديثات

- في لوحة السوبر أدمن، يفضل فصل Dashboard إلى:
  - tab KPIs (من `dashboard/statistics`)
  - tab Finance Analytics (من `wallet-transactions/summary` + `wallet-transactions`)
- في لوحة الشركة: استخدم `/api/company/dashboard/statistics` كمصدر KPIs.
- في المدونة:
  - استخدم `slug` كرابط أساسي دائم.
  - عند 404 لمقال قديم، جرّب `redirects/resolve` قبل عرض صفحة غير موجود.
- في المواعيد:
  - اعمل polling أو refresh دوري لقائمة المواعيد للشركة أثناء اليوم التشغيلي.
  - عند `propose_reschedule`، واجهة العميل لازم تعرض action واضح لقبول الموعد المقترح.
- في التنازل: اعرض countdown لـ `grace_ends_at`، واستخدم `stats` من `handovers/incoming` لكروت الإحصاء.
- في الإعلانات: سجّل impression عند العرض واستخدم redirect link للنقر.
- في استبدال النقاط: اعرض `pending_balance` من محفظة النقاط أثناء المراجعة.
- في المميزات: اعرض `has_perks`/`perks` في المتجر، ووفّر UI اختيار preset أو إدخال حر للشركة.
- في إحالة الطلبات: افصل `mine` و`marketplace`، و`idempotency_key` عند القبول.
- في تصفح واتفل: لا تعتمد على `has_installment` من قائمة `/public/products` — اجلب العروض من `/companies`.
- في بروفايل الشركة: `gallery_is_complete` مفيد لتنبيه الشركة قبل النشر العام.
- في طلبات الانضمام: شاشة أدمن بفلتر `status=pending` + بحث `q`، ثم mark-processed بعد إنشاء الحساب يدويًا.
- للزائر: احفظ `session_key` في localStorage واستخدمه في browsing وads impressions.
- لو الواجهة تعتمد على ترتيب قديم لنسب المعاملات، اعتمد على `sources` بدل تجميع يدوي.

