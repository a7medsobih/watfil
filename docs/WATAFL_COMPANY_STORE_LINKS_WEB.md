# Watafl — Company Store Share Links (Web)

دليل مطوّر الويب لصفحة مشاركة متجر الشركة على `watafl.com`.

**Base API:** `/api`  
**Route الصفحة:** `/store/{tax_number}`  
**مرجع عام:** [`WATAFL_COMPANY_STORE_LINKS.md`](./WATAFL_COMPANY_STORE_LINKS.md)  
**تطبيق الموبايل المكمّل:** [`WATAFL_COMPANY_STORE_LINKS_FLUTTER.md`](./WATAFL_COMPANY_STORE_LINKS_FLUTTER.md)

---

## إيه دورك؟

| أنت (Web) | Flutter |
|-----------|---------|
| صفحة `https://watafl.com/store/{tax}` | يفتح شاشة Store لو التطبيق مثبت |
| `GET /public/store/{tax}` + عرض الهوية | يقرأ `company_id` من deep link / App Link |
| محاولة فتح `deep_link` ثم زر Play Store | يحمّل المتجر من Public company APIs |

فحص «التطبيق مثبت؟» **عندك على الفرونت** (timeout / visibility) — مفيش endpoint من السيرفر لكده.

---

## الصفحة المطلوبة

```
https://watafl.com/store/{tax_number}
```

مثال: `https://watafl.com/store/TAX-SEED-001`

`tax_number` يجي من الـ path (decode لو محتاج).

---

## الحالات عندك

### الحالة 1 — فتح اللينك (البداية دائمًا)

```
User → /store/TAX-SEED-001
     → GET /api/public/store/TAX-SEED-001
```

| نتيجة | UI |
|-------|-----|
| **200** | كمّل الحالة 2 / 3 |
| **404** | «المتجر غير متاح» (شركة موقوفة / مخفية بالمحفظة / مش موجودة) |
| Network error | Retry |

**Endpoint الوحيد المطلوب للصفحة:**

`GET /api/public/store/{taxNumber}` — بدون Auth

```json
{
  "data": {
    "company_id": 12,
    "tax_number": "TAX-SEED-001",
    "name": "شركة النور",
    "logo": "https://...",
    "about": "...",
    "identity_images": ["https://...", "https://...", "https://..."],
    "web_url": "https://watafl.com/store/TAX-SEED-001",
    "deep_link": "watafl://store?company_id=12&tax_number=TAX-SEED-001",
    "android_store_url": "https://play.google.com/store/apps/details?id=com.watfil.client",
    "play_store_url": "https://play.google.com/store/apps/details?id=com.watfil.client"
  }
}
```

اعرض من الـ payload:
- `name` + `logo`
- `identity_images` (0–3 صور)
- `about` (اختياري)
- زر تحميل → `play_store_url` (نفس قيمة `android_store_url`)

---

### الحالة 2 — حاول تفتح التطبيق (بعد الـ 200)

فور نجاح الـ API:

1. حاول فتح `data.deep_link`  
   مثال: `watafl://store?company_id=12&tax_number=TAX-SEED-001`  
   (`window.location.href = deep_link` أو Intent على Android WebView إن وُجد)
2. ابدأ timer **~1500ms**
3. لو الصفحة لسه ظاهرة بعد الـ timeout (المستخدم ما راحش للتطبيق):
   - اعتبر إن التطبيق مش مثبت / ما اتفتحش
   - أبرز زر «حمّل من Google Play» → `data.play_store_url`
4. لو التطبيق اتفتح: المستخدم بيسيب التاب؛ الصفحة تفضل شغّالة كـ fallback لو رجع.

```text
API 200
  → try deep_link
  → wait ~1.5s
      → still visible? → show Play Store CTA
      → left page?    → app took over (Flutter حالة B)
```

**مهم:** متستناش رد من السيرفر عن التثبيت. الـ visibility / blur / `document.hidden` هي الإشارة.

---

### الحالة 3 — التطبيق مثبت + App Links (ممكن تعدّي عليك)

لو المستخدم على Android والـ App Link مضبوط، النظام ممكن يفتح التطبيق مباشرة من  
`https://watafl.com/store/{tax}` **من غير ما يعدّي على صفحتك**.

ده طبيعي. صفحتك تفضل مطلوبة لـ:
- Desktop
- أجهزة بدون التطبيق
- أجهزة بدون App Links مفعّلة
- iOS (لحد ما Universal Links / App Store يتظبطوا)

---

### الحالة 4 — Desktop / متصفح عادي

نفس الحالة 1 + 2:
- الـ deep link غالبًا هيفشل → بعد 1.5s اعرض Play Store
- المحتوى (`identity_images`) هو القيمة الأساسية للزائر

---

### الحالة 5 — iOS (حاليًا)

- نفس الفلو
- `play_store_url` دلوقتي Play Store (Android)
- لما يتوفر App Store link من الـ backend، استخدمه لنفس الزر على iOS (أو حقل منفصل لاحقًا)

---

## منطق مقترح للصفحة (pseudo)

```ts
async function onStorePage(taxNumber: string) {
  const res = await fetch(`/api/public/store/${encodeURIComponent(taxNumber)}`);
  if (res.status === 404) return showNotAvailable();
  const { data } = await res.json();

  renderIdentity({
    name: data.name,
    logo: data.logo,
    about: data.about,
    images: data.identity_images ?? [],
  });

  // حاول فتح التطبيق
  const start = Date.now();
  window.location.href = data.deep_link;

  setTimeout(() => {
    // لو الصفحة لسه في الـ foreground
    if (!document.hidden) {
      showPlayStoreButton(data.play_store_url);
    }
  }, 1500);
}
```

---

## لوحة الشركة (رفع صور الهوية) — Web dashboard منفصل

لو بتشتغل على لوحة الشركة (Bearer **company**)، مش صفحة المشاركة العامة:

| Method | Endpoint | وصف |
|--------|----------|-----|
| `GET` | `/api/company/identity-images` | قائمة |
| `POST` | `/api/company/identity-images` | صورة واحدة — `multipart: image` — يرفض عند 3 |
| `POST` | `/api/company/identity-images/replace` | استبدال — `images[]` (1–3) |
| `DELETE` | `/api/company/identity-images/{id}` | حذف |

```json
{ "id": 1, "url": "https://...", "sort_order": 1 }
```

الصور دي هي اللي تظهر في `identity_images` على صفحة `/store/{tax}`.

---

## الربط مع Flutter (عقد مشترك)

| عقد | قيمة |
|-----|------|
| لينك المشاركة العام | `https://watafl.com/store/{tax_number}` |
| Deep link | `watafl://store?company_id={id}&tax_number={tax}` |
| Play Store | من `play_store_url` في الـ API |
| Package | `com.watfil.client` |

| مين بيعمل إيه | |
|----------------|--|
| Web يستدعي | `GET /public/store/{tax}` ثم يحاول `deep_link` |
| Flutter يستقبل | scheme أو App Link → Store بـ `company_id` |
| Flutter بعد الفتح | `GET /public/companies/{id}` (+ products) — **مش مسؤوليتك على صفحة المشاركة** |

ما تحتاجش على صفحة `/store/...` تستدعي:
- `/public/companies/{id}`
- `/public/companies/{id}/products`

دول للتطبيق (أو صفحات ويب أخرى لو بنيت كتالوج كامل لاحقًا).

---

## Checklist Web

### صفحة المشاركة `/store/[tax]`
- [x] Route ديناميكي من `tax_number`
- [x] `GET /api/public/store/{tax}`
- [x] UI للهوية: logo + حتى 3 صور + about
- [x] محاولة `deep_link` فور التحميل
- [x] بعد ~1.5s + الصفحة ظاهرة → CTA لـ `play_store_url`
- [x] حالة 404 واضحة
- [x] SEO/OG اختياري (اسم الشركة + صورة)

### لوحة الشركة (إن وُجدت عندك)
- [ ] CRUD صور الهوية (حد 3)
- [ ] عرض لينك المشاركة: `https://watafl.com/store/{tax_number}` للنسخ

### مع الموبايل / DevOps
- [ ] Digital Asset Links لـ App Links (مع Flutter)
- [ ] (لاحقًا) `apple-app-site-association`

---

## خارج نطاقك

- منطق شاشة الـ Store داخل التطبيق (Flutter)
- Deferred deep link بعد التثبيت من الـ Store (Branch/Firebase لاحقًا)
