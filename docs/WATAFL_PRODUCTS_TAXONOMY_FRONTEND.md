# Watafl — دليل الفرونت: المنتجات والتصنيف (Taxonomy)

كل ما يخص **إنشاء وعرض المنتجات** للأدمن والشركة والعميل، مع  
`product_type` / `product_type_id` / `parent_category_id` / `category_id`.

**Base URL:** `/api`

**مرجع تصفح العميل:** [`WATAFL_CATALOG_BROWSE.md`](./WATAFL_CATALOG_BROWSE.md)

---

## 1) المفاهيم (مهم جدًا)

```
product_type          ← نوع كبير (فلاتر / …)
  └── parent category ← قسم رئيسي (منزلي)
        └── category  ← قسم دقيق (7 مراحل)  ← المنتج يتسجل هنا فقط
```

| حقل في الـ API | معناه | يُرسل عند الـ Create؟ |
|----------------|--------|------------------------|
| `product_type_id` | رقم نوع المنتج | **لا** على المنتج — على الـ category فقط |
| `product_type` | اسم النوع نصيًا (مثل `filters`) | **لا** — للقراءة/الفلتر |
| `parent_category_id` | القسم الأب | **لا** على المنتج — للفلتر أو عند إنشاء category |
| `category_id` | الصنف اللي المنتج مربوط بيه | **نعم** — ده الوحيد على Create المنتج |

> **قاعدة ذهبية:** عند إنشاء/تعديل منتج (أدمن أو شركة) ابعت **`category_id` فقط**.  
> `product_type` و `parent_category` بيتحسبوا من الصنف تلقائي في الـ response.

---

## 2) شكل المنتج في الـ Response (عرض)

أي قائمة/تفاصيل منتجات عامة بقت ترجع الحقول دي **flat** على المنتج:

```json
{
  "id": 42,
  "name": "فلتر 7 مراحل",
  "cash_price": 3999,
  "category_id": 10,
  "parent_category_id": 2,
  "product_type_id": 1,
  "product_type": "filters",
  "category": {
    "id": 10,
    "name": "7 مراحل",
    "parent_category_id": 2,
    "product_type_id": 1,
    "number_of_stages": 7,
    "product_type": {
      "id": 1,
      "name": "filters",
      "name_ar": "فلاتر"
    }
  }
}
```

استخدم الـ flat للفلاتر والـ chips في الـ UI؛ و `category` لو محتاج تفاصيل أكتر.

---

## 3) Lookups (قبل أي Create أو Filter)

تشتغل للـ Admin / Company / Customer (Public بدون auth):

| Method | Path | استخدام |
|--------|------|---------|
| `GET` | `/public/product-types` | قائمة الأنواع |
| `GET` | `/public/categories` | الأصناف |

### Query لـ categories
| Param | معنى |
|-------|------|
| `product_type_id` | أصناف نوع معيّن |
| `parent_category_id` | أبناء قسم معيّن؛ لو فاضي/`0`/`null` → الجذور فقط |
| `number_of_stages` | فلتر بعدد المراحل (فلاتر) |

### Response types
```json
{ "data": [{ "id": 1, "name": "filters", "name_ar": "فلاتر" }] }
```

### Response categories
```json
{
  "data": [{
    "id": 10,
    "name": "7 مراحل",
    "parent_category_id": 2,
    "product_type_id": 1,
    "number_of_stages": 7,
    "product_type": { "id": 1, "name": "filters", "name_ar": "فلاتر" }
  }]
}
```

### فلو UI مقترح لاختيار التصنيف (Create)
1. اختَر **نوع** → `GET /public/product-types`
2. اختَر **قسم رئيسي** → `GET /public/categories?product_type_id={id}` (بدون parent أو parent=null للجذور)
3. اختَر **قسم فرعي** (لو فيه) → `GET /public/categories?parent_category_id={parentId}`
4. احفظ على المنتج: **`category_id` = آخر اختيار** (الفرعي إن وُجد، وإلا الرئيسي)

---

## 4) أدمن (Super Admin)

Auth: `Bearer` من `POST /super-admin/login`

### 4.1 إدارة الأنواع
| Method | Path |
|--------|------|
| `GET` | `/super-admin/product-types` |
| `POST` | `/super-admin/product-types` |
| `GET` | `/super-admin/product-types/{id}` |
| `POST` | `/super-admin/product-types/{id}` |
| `DELETE` | `/super-admin/product-types/{id}` |

Create body:
```json
{ "name": "filters", "name_ar": "فلاتر" }
```

### 4.2 إدارة الأصناف
| Method | Path |
|--------|------|
| `GET` | `/super-admin/categories?product_type_id=&parent_category_id=&search=&per_page=50` |
| `POST` | `/super-admin/categories` |
| `GET` | `/super-admin/categories/{id}` |
| `POST` | `/super-admin/categories/{id}` |
| `DELETE` | `/super-admin/categories/{id}` |

Create body:
```json
{
  "name": "7 مراحل",
  "product_type_id": 1,
  "parent_category_id": 2,
  "number_of_stages": 7
}
```

- قسم رئيسي: `parent_category_id` = `null` أو `0`
- قسم فرعي: حط `parent_category_id` بتاع الأب
- مينفعش تحذف صنف عليه منتجات أو أبناء

### 4.3 إنشاء منتج واتفل (Supplier Product)
| Method | Path |
|--------|------|
| `GET` | `/super-admin/supplier-products` |
| `POST` | `/super-admin/supplier-products` |
| `POST` | `/super-admin/supplier-products/{id}` |
| `DELETE` / toggle | حسب الروتس الموجودة |

**Create = multipart**

| Field | مطلوب | ملاحظات |
|-------|--------|---------|
| `name` | نعم | |
| `sku` | نعم | |
| `cash_price` | نعم | |
| `stock_quantity` | نعم | |
| `supplier_id` | نعم | |
| `category_id` | مستحسن | **التصنيف الوحيد** |
| `description` | لا | |
| `original_price` | لا | |
| `image` | لا | jpg/png/webp |
| `status` | لا | `active` / `hidden` / … |

**متبعتش** `product_type_id` أو `parent_category_id` في الـ body.

فلاتر قائمة الأدمن للمنتجات: `supplier_id`, `status`, `category_id`, `product_type_id`

---

## 5) شركة (Company)

Auth: `Bearer` من `POST /company/login`

### 5.1 Lookups
نفس Public:
- `GET /public/product-types`
- `GET /public/categories?...`

### 5.2 منتج خاص بالشركة
| Method | Path |
|--------|------|
| `GET` | `/company/products` |
| `POST` | `/company/products` |
| `POST` | `/company/products/{id}` |
| `DELETE` | `/company/products/{id}` |

**Create = multipart**

| Field | مطلوب |
|-------|--------|
| `name` | نعم |
| `sku` | نعم |
| `cash_price` | نعم |
| `stock_quantity` | نعم |
| `category_id` | مستحسن |
| `description` / `image` / `original_price` | لا |
| `installment_plans` | لا (array أو JSON string) |

تاني: التصنيف = **`category_id` فقط**.

Response فيه flat:
`category_id`, `parent_category_id`, `product_type_id`, `product_type`

### 5.3 إضافة من كتالوج واتفل
| Method | Path | Body |
|--------|------|------|
| `GET` | `/company/catalog/available` | — |
| `GET` | `/company/catalog/mine` | — |
| `POST` | `/company/catalog/add` | `{ "product_ids": [1,2] }` |
| `POST` | `/company/catalog/{supplierProduct}` | `{ "supplier_product_id": 1 }` |
| `POST` | `/company/catalog/remove` | `{ "product_ids": [1] }` |

**مفيش اختيار category هنا** — التصنيف جاي من منتج واتفل الأصلي ويظهر في الـ response.

### 5.4 مميزات / تقسيط (مرتبطة بالمنتج مش بالتصنيف)
- `GET /company/perk-presets` ثم `POST .../products/{id}/perks` أو `.../catalog/{id}/perks`
- تقسيط: مع إنشاء المنتج أو endpoints التقسيط الخاصة بالكتالوج

---

## 6) عميل / زائر (Customer & Public)

بدون auth (إلا `is_liked` لو Bearer customer).

### 6.1 فلاتر الشجرة قبل القائمة
1. `GET /public/product-types`
2. `GET /public/categories?product_type_id=`
3. `GET /public/categories?parent_category_id=` (فرعي)

### 6.2 قائمة منتجات واتفل
```
GET /public/products
  ?governorate_id=
  &city_id=
  &product_type_id=          // أو product_type=filters
  &parent_category_id=
  &category_id=
  &search=
  &min_price=
  &max_price=
  &page=1
  &per_page=15
```

كل عنصر في `data[]` فيه flat taxonomy أعلاه.

### 6.3 تفاصيل + شركات
| Method | Path | ملاحظة |
|--------|------|--------|
| `GET` | `/public/products/{id}` | تفاصيل الكتالوج |
| `GET` | `/public/products/{id}/companies?governorate_id=` | شركات + عرض كل شركة؛ `product` فيه flat taxonomy |
| `GET` | `/public/products/{id}/similar` | متشابهات |

### 6.4 متجر شركة
| Method | Path |
|--------|------|
| `GET` | `/public/companies/{id}` | بروفايل + `products[]` |
| `GET` | `/public/companies/{id}/products` | فلاتر: `category_id`, `parent_category_id`, `product_type_id` / `product_type`, `number_of_stages` |
| `GET` | `/public/companies/{id}/product-details?source=company\|catalog&product_id=` | تفاصيل منتج في الستور |

---

## 7) Checklist فرونت (متتنساش)

### أدمن — شاشات
- [ ] CRUD أنواع المنتجات
- [ ] CRUD أصناف (نوع + أب اختياري + مراحل)
- [ ] Create منتج واتفل: اختيار تصنيف متدرج → إرسال `category_id`
- [ ] قائمة منتجات: فلتر بـ `category_id` و `product_type_id`
- [ ] عرض: اقرأ flat fields من الـ response

### شركة — شاشات
- [ ] Create منتج خاص: نفس اختيار التصنيف → `category_id`
- [ ] إضافة من كتالوج واتفل (بدون تغيير category)
- [ ] عرض منتجاتي / كتالوجي بالحقول الـ flat
- [ ] Perks + تقسيط بعد إنشاء/إرفاق المنتج

### عميل / ويب عامة
- [ ] شجرة فلاتر: type → parent → category
- [ ] قائمة `/public/products` بكل query filters
- [ ] بطاقة المنتج تعرض/تستخدم `category_id` + `parent_category_id` + `product_type_id` / `product_type`
- [ ] تفاصيل → شركات المحافظة → متجر الشركة
- [ ] `source` + `product_id` في product-details

### أخطاء شائعة
| غلط | الصح |
|-----|------|
| إرسال `product_type_id` في Create المنتج | ابعت `category_id` فقط |
| فلتر بـ parent ونسيت إنه يشمل الأبناء | `parent_category_id` = الأب + فروعه |
| توقع تقسيط على `/public/products` | التقسيط عند `/products/{id}/companies` أو ستور الشركة |
| نسيان `governorate_id` في شركات المنتج | مطلوب في `/products/{id}/companies` |

---

## 8) ملخص سريع حسب الدور

| دور | Create taxonomy | Display fields |
|-----|-----------------|----------------|
| **أدمن** | يعمل Type + Category؛ على المنتج `category_id` | list/show فيها flat |
| **شركة** | تختار Category جاهز → `category_id`؛ الكتالوج موروث | flat على منتجاتها والكتالوج |
| **عميل** | لا ينشئ | يفلتر ويعرض بالـ 4 حقول |

---

## 9) مثال End-to-end

```text
أدمن:
  POST /super-admin/product-types          { name, name_ar }
  POST /super-admin/categories             { name, product_type_id, parent_category_id? }
  POST /super-admin/supplier-products      multipart + category_id

شركة:
  GET  /public/categories?product_type_id=1
  POST /company/products                   multipart + category_id
  أو POST /company/catalog/add             { product_ids }  ← category من واتفل

عميل:
  GET /public/product-types
  GET /public/categories?product_type_id=1
  GET /public/products?governorate_id=1&category_id=10
  → كل منتج فيه category_id + parent_category_id + product_type_id + product_type
```
