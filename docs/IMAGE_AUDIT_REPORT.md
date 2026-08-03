# Image Audit Report — جرد مواضع الصور المرفوعة (API)

> تاريخ الجرد: 2026-08-03  
> النطاق: `components/` + `features/*/components` — صور مصدرها API (لوحة الشركة أو Super Admin)، وليست من `@/assets` الثابتة.  
> لا يتضمن هذا التقرير أي تعديل تصميم — جرد وتوثيق فقط.  
> المرجع البزنسي: [`FRONTEND_ENDPOINTS_BUSINESS_GUIDE_AR 10.md`](./FRONTEND_ENDPOINTS_BUSINESS_GUIDE_AR%2010.md)  
> SSOT البرمجي: [`lib/constants/image-specs.js`](../lib/constants/image-specs.js)

---

## ملخص المصادر

| المصدر | المعنى | أمثلة |
|--------|--------|--------|
| **شركة** | تُرفع من لوحة الشركة | صور هوية المتجر، منتجات الشركة الخاصة، صور الفريق |
| **سوبر أدمن** | تُرفع من لوحة Super Admin | لوجو الشركة، Billboards، منتجات الموردين/الكتالوج، صور المدونة |
| **شركة أو سوبر أدمن** | نفس موضع العرض؛ الأصل حسب `product.source` | ثمنيل المنتج في الكروت/الهيرو/السلة |

---

## جدول الجرد

| موضع الصورة | المصدر (شركة/سوبر أدمن) | تظهر في | الأبعاد الحالية المعروضة | object-fit |
|-------------|-------------------------|---------|---------------------------|------------|
| Product Card Thumbnail | شركة أو سوبر أدمن | `ProductCard` — الرئيسية، `/products`، التصنيفات، متجر الشركة، مشابهة، المفضلة | `aspect-square` (fluid) + HTML hint 900×900 | cover |
| Product Gallery Main | شركة أو سوبر أدمن | `ProductHero` — تفاصيل منتج كتالوج / عرض شركة | `aspect-4/3` داخل عمود ~18–20rem (`max-w-sm` على الموبايل) | cover |
| Product Hero Seller Logo | سوبر أدمن | `ProductHero` (وضع الشركة) | `size-10` → `sm:size-12` (40→48px) | cover |
| Recent Product Card Thumbnail | شركة أو سوبر أدمن | `RecentProductCard` — شوهد مؤخرًا | `aspect-square` | cover |
| Cart Item Thumbnail | شركة أو سوبر أدمن | `CartItemRow` داخل MiniCart | `size-16` (64×64) | cover |
| Checkout Item Thumbnail | شركة أو سوبر أدمن | `CheckoutSummary` — `/checkout` | `size-14` (56×56) | cover |
| Company Card Cover (Logo كبانر) | سوبر أدمن | `CompanyCard` — الرئيسية، `/companies`، مفضلة الشركات | `h-44` × عرض الكارد بالكامل (176px ارتفاع) | cover |
| Company Logo | سوبر أدمن | `CompanyInfoCard` — متجر الشركة | `size-20` → `sm:size-24` (80→96px) | cover |
| Offering Company Logo | سوبر أدمن | `ProductOfferingCompanyCard` — قائمة العارضين | `size-12` (48×48) | cover |
| Recent Store Card Cover | سوبر أدمن | `RecentStoreCard` — متاجر شوهدت مؤخرًا | `h-36` → `sm:h-40` × عرض كامل | cover |
| Mini Cart Company Logo | سوبر أدمن | `MiniCart` | `size-10` (40×40) | cover |
| Checkout Company Logo | سوبر أدمن | `CheckoutSummary` | `size-11` (44×44) | cover |
| Cart Conflict Company Logo | سوبر أدمن | `CartCompanyConflictDialog` (حالي + جديد) | `size-10` (40×40) | cover |
| Navbar Campaign Brand Logo | سوبر أدمن | `NavbarBrand` عند تفعيل برند الشركة / Campaign | `size-8` → `sm:size-9` (HTML 36×36) | cover |
| Campaign Footer Brand Logo | سوبر أدمن | `CampaignFooter` | `size-8` (HTML 36×36) | cover |
| Store Share Identity Logo | سوبر أدمن | `StoreSharePage` — `/store/[taxNumber]` | `size-14` → `sm:size-16` | **contain** |
| Billboard Hero Slide | سوبر أدمن | `CompanyHeroGallery` عبر `buildHeroSlides` (kind=billboard) | `h-[240→340→440→500px]` × عرض كامل | cover |
| Company Cover Banner / Gallery | شركة | `CompanyHeroGallery` (kind=gallery) — بديل عند غياب Billboards / وضع الحملة | نفس أبعاد Billboard أعلاه | cover |
| Store Share Hero Banner | شركة | `StoreShareHero` — صور الهوية | `h-[240→340→420px]` × عرض كامل | cover |
| Team Member Photo | شركة | `TeamMemberCard` — تبويب الفريق | `aspect-[4/5]` (fluid) | cover |
| Blog Card Thumbnail | سوبر أدمن | `BlogCard` — الرئيسية + `/blog` | `aspect-[3/4]` بعرض 88→104px | cover |
| Blog Featured Card Thumbnail | سوبر أدمن | `BlogFeaturedCard` — `/blog` | `aspect-[3/4]` بعرض حتى 200px | cover |
| Blog Cover | سوبر أدمن | `BlogArticlePage` — `/blog/[slug]` | `aspect-[2/1] w-full` داخل `max-w-4xl` | cover |
| Blog Sidebar Related Thumbnail | سوبر أدمن | `BlogArticleSidebar` | `h-16 w-20` (80×64) | cover |
| Blog Author Avatar | سوبر أدمن | `BlogArticlePage` | Avatar `size-6` (24×24) | cover |
| Blog Article Body Images | سوبر أدمن | HTML داخل `BlogArticleContent` | `max-width:100%; height:auto` | **غير محدد** ⚠️ |

---

## استنتاج المصادر من الـ Endpoints

| نوع الصورة | Endpoint الإدارة | المصدر |
|------------|------------------|--------|
| لوجو الشركة | `POST /api/super-admin/companies` (+ update) — ملف `logo` (§5.8) | سوبر أدمن |
| Billboards | `/api/super-admin/billboards` (§10.4) → عرض عام §2.21 | سوبر أدمن |
| صور هوية المتجر | `/api/company/identity-images` (§10.5) → مشاركة §2.22 + gallery في المتجر | شركة |
| منتج شركة خاص | `POST /api/company/products` — ملف `image` (§4.5) | شركة |
| منتج كتالوج/مورد | `POST /api/super-admin/supplier-products` — ملف `image` (§5.22) | سوبر أدمن |
| مقال مدونة / غلاف / صور الجسم | `/api/super-admin/blog/articles` (§9.2.3) | سوبر أدمن |
| صور الفريق | ضمن payload تفاصيل الشركة العامة (`team`) — لا يوجد endpoint رفع صريح في الدليل | شركة (استنتاج) |

---

## ملاحظات مشاكل (بدون إصلاح في هذه المرحلة)

1. **Blog body images** — لا يوجد `object-fit`؛ الاعتماد على الحجم Intrinsic فقط (`.article-content img`).
2. **Company Card يستخدم اللوجو كغلاف بانر** (`h-44` + `object-cover`) — نفس أصل اللوجو يُعرض أيضًا كمربع صغير في مواضع أخرى؛ نسب العرض مختلفة جدًا.
3. **MediaImage** يفرض افتراضيًا `h-full w-full object-cover`؛ الاستثناء الوحيد حاليًا هو `STORE_SHARE_IDENTITY_LOGO` (`object-contain`).
4. **لا يوجد عرض حالي** لبانرات المحافظات (`GET /api/public/banners/...`) ولا لصور تصنيفات المنتجات في الفرونت (CategoryCard أيقونات فقط).
5. **Compare UI** معطّل (`COMPARE_UI_ENABLED = false`) — لا مواضع صور نشطة.
6. **Avatar العميل** في Navbar/MobileDrawer يعرض `user.avatar` إن وُجد، لكنه خارج نطاق رفع الشركة/السوبر أدمن (غير مدرج في `image-specs.js`).

---

## مستبعد عن عمد (أصول ثابتة)

| المكوّن | السبب |
|---------|--------|
| `HeroCarousel` | صور من `@/assets/carousel/*` |
| `Footer` / `DownloadAppSection` | لوجو واتفل الثابت + أيقونات المتاجر |
| `CategoryCard` | Lucide icons فقط |
| `NavbarBrand` (وضع واتفل الافتراضي) | `@/assets/watfil-logo.png` |
| Favicon في StoreShare CTA | `/favicon.ico` |

---

## الخطوات التالية المقترحة (خارج نطاق هذه المرحلة)

- اعتماد أبعاد رفع موصى بها لكل مفتاح في `IMAGE_SPECS` (upload targets منفصلة عن display sizes).
- توحيد نسب اللوجو بين بطاقة الشركة (غلاف) ومواضع الـ avatar.
- إضافة `object-fit` لصور جسم المقال إن لزم.
