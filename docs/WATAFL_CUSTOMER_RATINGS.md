# Watafl — تقييم الشركات (من ناحية العميل)

مرجع سريع لفريق الفرونت: التقييمات في التطبيق تخص **الشركة فقط**، مش المنتجات.

**Base:** `/api`  
**Auth:** `Authorization: Bearer {{customer_token}}`  
**Header:** `Accept: application/json`

---

## الفكرة

| موجود؟ | النوع |
|--------|--------|
| نعم | تقييم **شركة** (نجوم 1–5 + تعليق اختياري) |
| لا | تقييم **منتج** (الحقول في الكتالوج placeholders فقط) |

- كل عميل له **تقييم واحد** لكل شركة (إنشاء أو تعديل بنفس الـ endpoint).
- الملخص يظهر في قائمة/صفحة الشركة: `average_rating` / `ratings_count` / `my_rating`.
- قائمة التقييمات التفصيلية تظهر في صفحة الشركة العامة داخل `ratings[]`.

---

## شاشات الفرونت المقترحة

1. **بطاقة / قائمة شركات**  
   اعرض `average_rating` + `ratings_count`.  
   لو فيه توكن عميل: اعرض حالة `my_rating` (هل قيّم قبل كده؟).

2. **صفحة شركة** `GET /public/companies/{id}`  
   - ملخص: `average_rating`, `ratings_count`, `my_rating`  
   - قائمة: `ratings[]` (الأحدث أولًا)  
   - زر/فورم تقييم للعميل المسجّل

3. **فورم التقييم**  
   - نجوم إلزامي 1–5  
   - تعليق اختياري  
   - زر حذف لو `my_rating` موجود

---

## Endpoints العميل

### إضافة أو تعديل تقييم

```http
POST /api/customer/companies/{company_id}/rating
```

```json
{
  "rating": 5,
  "comment": "خدمة ممتازة"
}
```

| Field | مطلوب | قواعد |
|-------|--------|--------|
| `rating` | ✓ | integer من 1 إلى 5 |
| `comment` | — | string، max 1000 |

- لو العميل قيّم قبل كده → **يتحدث** نفس التقييم (`updateOrCreate`).
- لو بعتّ `comment` فاضي/null حسب الـ request: الحقل بيتحدث فقط لو المفتاح موجود في الـ body.

**نجاح 200:**

```json
{
  "message": "تم حفظ التقييم بنجاح",
  "data": {
    "id": 12,
    "name": "شركة النور",
    "likes_count": 45,
    "ratings_count": 19,
    "average_rating": 4.6,
    "is_liked": false,
    "my_rating": 5
  }
}
```

استخدم `data` لتحديث الـ UI فورًا (متوسط + تقييمي).

---

### حذف تقييمي

```http
DELETE /api/customer/companies/{company_id}/rating
```

بدون body.

**نجاح 200:** رسالة + `data` شركة محدّثة (`my_rating: null`).  
**422:** لو مفيش تقييم سابق → `"لم تقيّم هذه الشركة من قبل"`.

---

## القراءة (عرض بدون كتابة)

هذه بدون auth إلزامي، لكن **التوكن اختياري** عشان `my_rating` / `is_liked`:

### قائمة شركات

```http
GET /api/public/companies?governorate_id=1
```

كل شركة فيها تقريبًا:

```ts
{
  ratings_count: number;
  average_rating: number | null;  // تقريب لمنزلة عشرية
  my_rating?: number | null;      // يظهر مع Bearer customer
}
```

### صفحة الشركة (فيها القائمة التفصيلية)

```http
GET /api/public/companies/{company_id}
```

```ts
{
  ratings_count: number;
  average_rating: number | null;
  my_rating?: number | null;
  ratings: Array<{
    id: number;
    rating: number;           // 1–5
    comment: string | null;
    customer: {
      id: number;
      full_name: string | null;
    } | null;
    created_at: string;
    updated_at: string;
  }>;
}
```

- `ratings` مرتبة من الأحدث للأقدم.  
- مفيش رقم تليفون أو إيميل العميل في العرض العام.  
- لو مفيش تقييمات: `ratings: []` و `average_rating: null` و `ratings_count: 0`.

---

## سلوك الـ UI المقترح

| حالة | ماذا تعرض؟ |
|------|-------------|
| زائر (بدون login) | متوسط + العدد + قائمة `ratings` — بدون فورم |
| مسجّل و `my_rating == null` | فورم «قيّم الشركة» |
| مسجّل و `my_rating` موجود | نجومه الحالية + إمكانية تعديل (نفس POST) أو حذف |
| بعد POST/DELETE | حدّث من `response.data` مباشرة |

---

## أخطاء مهمة

| HTTP | معنى |
|------|------|
| 401 | لازم customer token للكتابة |
| 404 | الشركة غير متاحة / غير نشطة |
| 422 | validation (نجوم خارج 1–5) أو حذف بدون تقييم سابق |

---

## ملاحظات سريعة

1. **مفيش تقييم منتجات** — تجاهل `average_rating` على `/public/products` كـ feature حالي (placeholder).  
2. التقييم مش مربوط بإكمال طلب — أي عميل مسجّل يقدر يقيّم شركة ظاهرة.  
3. الإعجاب بالشركة منفصل عن التقييم:  
   `POST/DELETE /customer/companies/{id}/like`

---

## Checklist تست فرونت

- [ ] صفحة شركة تظهر `average_rating` + `ratings_count` + `ratings[]`  
- [ ] مع توكن: يظهر `my_rating`  
- [ ] POST تقييم جديد → يتحدث الملخص  
- [ ] POST تاني بنفس الشركة → تعديل مش تكرار صف  
- [ ] DELETE → `my_rating` يبقى null والقائمة تتحدث بعد refresh  
- [ ] زائر يشوف القائمة بدون ما يقدر يبعت تقييم
