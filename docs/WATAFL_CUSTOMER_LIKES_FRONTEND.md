# Watafl — Customer Likes (Frontend Guide)

دليل الفرونت بعد **توحيد الإعجابات**.  
كل عمليات الـ like / unlike بقت على endpoint واحد، والـ endpoints القديمة **اتشالت**.

**Auth:** `Authorization: Bearer {customer_token}`  
**Base:** `/api/customer`

---

## Breaking change

| قبل (اتشال) | بعد (المستخدم دلوقتي) |
|-------------|------------------------|
| `POST /customer/companies/{id}/like` | `POST /customer/likes` |
| `DELETE /customer/companies/{id}/like` | `DELETE /customer/likes` |
| `POST /customer/companies/{company}/products/{id}/like` | `POST /customer/likes` |
| `DELETE /customer/companies/{company}/products/{id}/like` | `DELETE /customer/likes` |
| `POST /customer/products/catalog/{id}/like` | `POST /customer/likes` |
| `DELETE /customer/products/catalog/{id}/like` | `DELETE /customer/likes` |
| `GET /customer/likes` | زي ما هو (قائمة الإعجابات) |

حدّث كل أزرار القلب في التطبيق عشان تبعت الـ body الموحد بدل الـ URL القديمة.

---

## Endpoints

| Method | Path | الوظيفة |
|--------|------|---------|
| `POST` | `/api/customer/likes` | إضافة إعجاب |
| `DELETE` | `/api/customer/likes` | إلغاء إعجاب |
| `GET` | `/api/customer/likes` | قائمة إعجابات العميل (منتجات + شركات) |

> التقييمات **مش** ضمن التوحيد ده. لسه:  
> `POST/DELETE /api/customer/companies/{company}/rating`

---

## Body الموحّد (POST و DELETE)

```json
{
  "type": "company | company_product | catalog_product",
  "id": 1,
  "company_id": 5
}
```

| `type` | معنى `id` | `company_id` |
|--------|-----------|--------------|
| `company` | رقم الشركة | مش مطلوب |
| `company_product` | رقم منتج الشركة (`company_products.id`) | **مطلوب** |
| `catalog_product` | رقم منتج الكاتلوج (`supplier_products.id`) | مش مطلوب |

- `DELETE` يقبل نفس الحقول في **JSON body** أو **query string** (لو العميل مش بيبعت body مع DELETE).
- مثال query:  
  `DELETE /api/customer/likes?type=catalog_product&id=5`

---

## أمثلة طلبات

### 1) إعجاب بشركة

```http
POST /api/customer/likes
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "type": "company",
  "id": 1
}
```

**201:**

```json
{
  "message": "تم تسجيل الإعجاب بنجاح",
  "data": {
    "type": "company",
    "company": {
      "id": 1,
      "name": "...",
      "likes_count": 12,
      "is_liked": true,
      "average_rating": 4.5,
      "ratings_count": 3
    }
  }
}
```

### 2) إعجاب بمنتج شركة

```http
POST /api/customer/likes
Content-Type: application/json

{
  "type": "company_product",
  "id": 10,
  "company_id": 1
}
```

**201:**

```json
{
  "message": "تم تسجيل الإعجاب بالمنتج بنجاح",
  "data": {
    "type": "company_product",
    "product": {
      "id": 10,
      "source": "company",
      "name": "...",
      "likes_count": 1,
      "is_liked": true
    }
  }
}
```

### 3) إعجاب بمنتج كاتلوج (مورد / واتفل)

```http
POST /api/customer/likes
Content-Type: application/json

{
  "type": "catalog_product",
  "id": 5
}
```

**201:**

```json
{
  "message": "تم تسجيل الإعجاب بالمنتج بنجاح",
  "data": {
    "type": "catalog_product",
    "product": {
      "id": 5,
      "name": "...",
      "likes_count": 1,
      "is_liked": true
    }
  }
}
```

### 4) إلغاء الإعجاب

نفس الـ body بالظبط مع `DELETE /api/customer/likes` → **200** و `is_liked: false` / عدد الإعجابات محدّث.

---

## قائمة الإعجابات

```http
GET /api/customer/likes
```

### Query (اختياري)

| Param | Default | الوصف |
|-------|---------|--------|
| `source` | — | فلتر المنتجات: `company` أو `catalog` |
| `products_page` | 1 | صفحة المنتجات |
| `products_per_page` | 15 | حجم صفحة المنتجات (max 50) |
| `companies_page` | 1 | صفحة الشركات |
| `companies_per_page` | 15 | حجم صفحة الشركات (max 50) |

### Response 200

```json
{
  "data": {
    "products": [
      {
        "liked_at": "2026-07-29 12:00:00",
        "source": "catalog",
        "product": { "id": 5, "name": "...", "is_liked": true, "likes_count": 1 }
      },
      {
        "liked_at": "2026-07-29 11:00:00",
        "source": "company",
        "product": { "id": 10, "source": "company", "is_liked": true }
      }
    ],
    "companies": [
      {
        "liked_at": "2026-07-29 10:00:00",
        "company": { "id": 1, "name": "...", "is_liked": true, "likes_count": 12 }
      }
    ]
  },
  "meta": {
    "products": {
      "total": 2,
      "current_page": 1,
      "last_page": 1,
      "per_page": 15
    },
    "companies": {
      "total": 1,
      "current_page": 1,
      "last_page": 1,
      "per_page": 15
    }
  }
}
```

- `data.products[].source`: `"company"` = منتج شركة، `"catalog"` = منتج كاتلوج.
- لو مفيش إعجابات: `products: []` و `companies: []` مع `meta.*.total = 0` (مش error).

---

## أخطاء شائعة

| Status | متى |
|--------|-----|
| `401` | مفيش Bearer / توكن باطل |
| `403` | التوكن مش عميل (`customer_only`) أو حساب موقوف |
| `404` | شركة/منتج غير متاح |
| `422` | أعجب قبل كده / لم يعجب من قبل / validation (`type` غلط أو `company_id` ناقص) |

---

## توجيه للفرونت (Flutter / Web)

### دالة موحّدة

```ts
type LikeType = 'company' | 'company_product' | 'catalog_product';

async function setLike(params: {
  type: LikeType;
  id: number;
  companyId?: number;
  liked: boolean; // true = POST, false = DELETE
}) {
  const body: Record<string, number | string> = {
    type: params.type,
    id: params.id,
  };
  if (params.type === 'company_product') {
    body.company_id = params.companyId!;
  }

  const method = params.liked ? 'POST' : 'DELETE';
  const res = await api.request('/customer/likes', { method, body });
  return res.data; // { type, company? } أو { type, product? }
}
```

### منين تجيب `type` في الـ UI؟

| مكان الشاشة | `type` |
|-------------|--------|
| بطاقة/تفاصيل شركة | `company` |
| منتج داخل متجر شركة (`source=company` أو من `/companies/{id}/products`) | `company_product` + `company_id` |
| منتج من كتالوج واتفل (`/products` أو `/products/{id}`) | `catalog_product` |

### بعد نجاح الـ like/unlike

1. حدّث `is_liked` و `likes_count` من `data.company` أو `data.product` في الـ response.
2. أو اعمل optimistic UI وبعدين reconcile من الـ response.
3. شاشة «إعجاباتي» → `GET /customer/likes` (منتجات + شركات مع pagination منفصل).

### عرض `is_liked` في القوائم العامة

لو العميل مسجّل وباعت التوكن على مسارات `/public/*` أو `/customer/*` اللي بترجع منتجات/شركات، الحقول دي بتظهر جاهزة:

- `is_liked`
- `likes_count`

محتاج توكن عميل، مش شركة/أدمن.

---

## Checklist ترحيل الفرونت

- [ ] استبدال كل استدعاءات `.../like` القديمة بـ `POST/DELETE /customer/likes`
- [ ] تمرير `type` + `id` (+ `company_id` لمنتج الشركة)
- [ ] قراءة الـ response من `data.product` أو `data.company` (مش `data` مباشرة كمنتج)
- [ ] شاشة Favorites تستخدم `GET /customer/likes` وتفرّق `source: company|catalog`
- [ ] معالجة `422` تكرار الإعجاب بدون crash
- [ ] التقييمات لسه على `/companies/{id}/rating` (مش likes)

---

## ملاحظة نشر

السيرفر لازم يتحدّث بالكود الجديد قبل ما الفرونت يعتمد الـ endpoints الموحدة.  
لو لسه endpoints قديمة شغالة على production، الفرونت الموحد هيرجع 404 لحد ما يعملوا deploy.