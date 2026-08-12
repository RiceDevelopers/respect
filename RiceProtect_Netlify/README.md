# Rice Protect — Netlify Edition

هذه النسخة جاهزة للنشر على Netlify، والـ FiveM resource موجود داخل `resources/[rice]/rice_protect`.

## 1) قاعدة البيانات
أنشئ PostgreSQL database (مثل Neon) وانسخ Connection String.

## 2) Netlify Environment Variables
من: Project configuration → Environment variables

أضف:
- `DATABASE_URL` = PostgreSQL connection string (اختياري إذا Netlify Database يوفر `NETLIFY_DB_URL`)
- `NETLIFY_DB_URL` = يستخدم تلقائيًا من Netlify Database إذا كان متاحًا
- `OWNER_USER` = اسم دخول المالك
- `OWNER_PASSWORD` = كلمة مرور قوية وطويلة
- `SESSION_SECRET` = قيمة عشوائية بطول 32+ حرف
- `SESSION_HOURS` = `12`
- `HEARTBEAT_OFFLINE_SECONDS` = `600`
- `WEBHOOK_CRITICAL`, `WEBHOOK_WARNING`, `WEBHOOK_INFO` = اختيارية

## 3) النشر
ارفع هذا المجلد/المشروع إلى Netlify. إعداد `netlify.toml` جاهز: publish=`public`, functions=`netlify/functions`.

بعد النشر افتح رابط Netlify وسجل الدخول بـ OWNER_USER / OWNER_PASSWORD.

## 4) FiveM
انسخ `resources/[rice]/rice_protect` إلى resources في سيرفرك.
في `config.lua`:

```lua
Config.License = {
    Enabled = true,
    Endpoint = 'https://YOUR-SITE.netlify.app/v1/heartbeat',
    Key = 'RICE-KEY-FROM-PANEL',
    HeartbeatSeconds = 300,
    FailClosed = true,
    GraceSeconds = 900
}
```

ثم أضف الموارد التي تريد التحكم بها إلى `Config.ProtectedResources` وشغّل `rice_protect`.

## ملاحظة أمنية
لا تضع `DATABASE_URL` أو `NETLIFY_DB_URL` أو `SESSION_SECRET` أو كلمة مرور المالك داخل FiveM أو JavaScript في `public`. تبقى فقط كـ Netlify Environment Variables.
