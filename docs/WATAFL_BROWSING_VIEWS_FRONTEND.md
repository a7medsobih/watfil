# Watafl — Browsing & Views (Frontend Guide)

دليل الفرونت لـ **سجل التصفح** وعدادات المشاهدة `views_count` (شركات + منتجات).

**Base:** `/api`  
**مرجع إضافي في الدليل العام:** §2.14 و §3.26 في `docs/api/FRONTEND_ENDPOINTS_BUSINESS_GUIDE_AR.md`

---

## الفكرة باختصار

| الحدث | Endpoint | إيه بيزيد؟ |
|-------|----------|------------|
| فتح صفحة متجر / شركة | `POST /public/browsing/stores/visit` | `companies.views_count` |
| فتح منتج داخل متجر | `POST /public/browsing/products/view` | `views_count` للمنتج |
| عرض «شوهد مؤخرًا» | `GET .../browsing/recent-*` | لا يزيد شيء (قراءة فقط) |

`GET /public/companies/{id}` وموارد المنتجات **تعرض** `views_count` فقط — **مش** بتزوّده تلقائيًا. الفرونت لازم ينادي browsing صراحة.

---

## الهوية: زائر vs عميل

| الحالة | المطلوب |
|--------|---------|
| زائر (Guest) | `session_key` string (max 64) — احفظه في `localStorage` |
| عميل مسجّل | `Authorization: Bearer {customer_token}` — `session_key` اختياري/غير مطلوب |

قواعد عامة:

- بدون توكن عميل: `session_key` **مطلوب** في كل browsing endpoints تحت `/public`.
- مع توكن عميل صحيح: السجل يتربط بـ `customer_id`.
- نفس العميل أو نفس الجلسة **ما تزودش** العداد مرتين لنفس الشركة/المنتج؛ التكرار يحدّث الوقت فقط ويرجع `duplicate_session: true`.

اقتراح توليد `session_key`:

```ts
function getSessionKey(): string {
  const key = 'watfil_browse_session';
  let v = localStorage.getItem(key);
  if (!v) {
    v = crypto.randomUUID().replace(/-/g, '').slice(0, 32); // ≤ 64
    localStorage.setItem(key, v);
  }
  return v;
}
```

---

## 1) تسجيل زيارة متجر (Company views)

```http
POST /api/public/browsing/stores/visit
Accept: application/json
Content-Type: application/json
Authorization: Bearer {customer_token}   # اختياري
```

### Body

```json
{
  "company_id": 5,
  "session_key": "abc123def456"
}
```

| Field | Rules |
|-------|--------|
| `company_id` | required, موجود في `companies` |
| `session_key` | مطلوب للزائر؛ nullable مع customer token؛ max 64 |

### Response 200

```json
{
  "message": "تم تسجيل الزيارة",
  "data": {
    "views_count": 120,
    "last_visited_at": "2026-08-02 12:00:00",
    "duplicate_session": false
  }
}
```

- أول زيارة: `duplicate_session: false` و`companies.views_count++`
- تكرار: `duplicate_session: true` — يحدّث `last_visited_at` فقط
- شركة غير نشطة / مخفية بالمحفظة → validation error على `company_id`

### متى تناديها؟

- عند دخول صفحة تفاصيل الشركة / المتجر (`GET /public/companies/{id}` أو ما يعادلها).
- مرة واحدة لكل دخول صفحة (مش في كل re-render).
- استخدم `data.views_count` لتحديث الـ UI فورًا لو حابب.

---

## 2) تسجيل مشاهدة منتج (Product views)

```http
POST /api/public/browsing/products/view
Accept: application/json
Content-Type: application/json
Authorization: Bearer {customer_token}   # اختياري
```

### Body

```json
{
  "company_id": 5,
  "product_source": "company",
  "product_id": 12,
  "session_key": "abc123def456"
}
```

| Field | Rules |
|-------|--------|
| `company_id` | required — متجر السياق اللي المنتج اتفرج عليه منه |
| `product_source` | `company` \| `catalog` |
| `product_id` | required — ID منتج الشركة أو منتج المورد حسب المصدر |
| `session_key` | مطلوب للزائر |

### Response 200

```json
{
  "message": "تم تسجيل المشاهدة",
  "data": {
    "views_count": 43,
    "last_viewed_at": "2026-08-02 12:05:00",
    "duplicate_session": false
  }
}
```

- `product_source = company` → يزيد `company_products.views_count`
- `product_source = catalog` → يزيد `supplier_products.views_count` (عرض الشركة لهذا المنتج)
- التكرار لنفس (عميل/جلسة + شركة + مصدر + منتج) ما يزودش العداد

### متى تناديها؟

- عند فتح تفاصيل منتج داخل سياق متجر شركة.
- لو المنتج من الكتالوج ومعروض عبر شركة: `product_source: "catalog"`.

---

## 3) آخر المنتجات المشاهدة

### للزائر / عام

```http
GET /api/public/browsing/recent-products?session_key=abc123&limit=20
```

### للعميل المسجّل

```http
GET /api/customer/browsing/recent-products?limit=20
Authorization: Bearer {customer_token}
```

| Query | Default | Notes |
|-------|---------|--------|
| `session_key` | — | مطلوب على `/public` بدون توكن |
| `limit` | 20 | min 1, max 50 |

### Response 200

```json
{
  "data": [
    {
      "company": {
        "id": 5,
        "name": "...",
        "logo": "https://..."
      },
      "product": {
        "id": 12,
        "source": "company",
        "name": "...",
        "image": "https://...",
        "cash_price": 2500,
        "views_count": 43
      },
      "last_viewed_at": "2026-08-02 12:05:00"
    }
  ]
}
```

(شكل `product`/`company` حسب الـ resource الحالي — استخدم الحقول اللي ترجع فعليًا من الـ API.)

---

## 4) آخر المتاجر المزارة

### للزائر / عام

```http
GET /api/public/browsing/recent-stores?session_key=abc123&limit=20
```

### للعميل المسجّل

```http
GET /api/customer/browsing/recent-stores?limit=20
Authorization: Bearer {customer_token}
```

### Response 200

```json
{
  "data": [
    {
      "company": {
        "id": 5,
        "name": "...",
        "logo": "https://...",
        "views_count": 120,
        "governorate": { "id": 1, "name_ar": "...", "name_en": "..." }
      },
      "last_visited_at": "2026-08-02 12:00:00"
    }
  ]
}
```

---

## أين يظهر `views_count` (عرض فقط)

| Endpoint / Resource | الحقل |
|---------------------|--------|
| `GET /public/companies/{id}` وقوائم الشركات (`PublicCompanyResource`) | `views_count` للشركة |
| بطاقات/تفاصيل منتجات المتجر والكتالوج | `views_count` للمنتج |
| Dashboard الشركة (داخلي) | قد يعرض `views_count` للشركة |

إحصائيات أخرى على الشركة (مش من browsing):

- `likes_count`, `ratings_count`, `average_rating`
- `customers_count`, `orders_count`

---

## فهرس الـ Endpoints

| Method | Path | Auth | الوظيفة |
|--------|------|------|---------|
| `POST` | `/api/public/browsing/stores/visit` | اختياري + session | زيادة مشاهدات الشركة |
| `POST` | `/api/public/browsing/products/view` | اختياري + session | زيادة مشاهدات المنتج |
| `GET` | `/api/public/browsing/recent-products` | اختياري + session | آخر منتجات |
| `GET` | `/api/public/browsing/recent-stores` | اختياري + session | آخر متاجر |
| `GET` | `/api/customer/browsing/recent-products` | Customer Bearer | آخر منتجات للعميل |
| `GET` | `/api/customer/browsing/recent-stores` | Customer Bearer | آخر متاجر للعميل |

---

## تدفق تكامل مقترح

```text
1) App start → تأكد من وجود session_key في localStorage
2) Open company page
     → GET /public/companies/{id}          (اعرض views_count)
     → POST /public/browsing/stores/visit  (سجّل زيارة)
3) Open product detail in store context
     → POST /public/browsing/products/view
4) Home / "Recently viewed"
     → Guest: GET /public/browsing/recent-*?session_key=
     → Logged-in: GET /customer/browsing/recent-*
5) بعد login: استخدم مسارات /customer للقراءة؛ التسجيل يستمر بـ Bearer
```

---

## دمج جلسة الزائر بعد Login / Register

عند `POST /customer/login` أو التسجيل، ابعت نفس `session_key` في الـ body (لو موجود).

الـ backend يعمل merge لتاريخ التصفح من الجلسة → حساب العميل (`mergeSessionToCustomer`).

بعدها:

- اعرض «مؤخرًا» من `/api/customer/browsing/...`
- ممكن تحتفظ بـ `session_key` في localStorage لإعلانات/impressions لو محتاج

---

## أخطاء شائعة

| Status | السبب |
|--------|--------|
| `422` | ناقص `session_key` للزائر / `company_id` غلط / `product_source` مش `company\|catalog` |
| `422` | الشركة غير متاحة (زيارة متجر) |
| `401/403` | توكن غلط على مسارات `/customer/browsing/*` |

---

## Checklist فرونت

- [ ] توليد وحفظ `session_key` للزائر
- [ ] نادِ `stores/visit` مرة عند دخول صفحة الشركة
- [ ] نادِ `products/view` مرة عند دخول تفاصيل المنتج (مع `product_source` الصحيح)
- [ ] لا تعتمد على `GET` الشركة/المنتج لزيادة العداد
- [ ] حدّث الـ UI من `data.views_count` بعد POST لو تحتاج رقم فوري
- [ ] شاشة «مؤخرًا»: `/public` للزائر و`/customer` بعد الدخول
- [ ] تعامل مع `duplicate_session: true` كنجاح عادي (مش error)
- [ ] ابعت `session_key` مع login/register لدمج سجل الزائر
- [ ] نفس `session_key` يُستخدم أيضًا مع إعلانات impressions لو مطلوب في المشروع
