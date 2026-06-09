export type LangType = 'uz' | 'ru' | 'en';

export const translations = {
  uz: {
    // Nav
    featuresNav: "Imkoniyatlar",
    useCasesNav: "Foydalanish",
    
    // Hero
    heroTitleLine1: "Havolalarni to'g'ridan-to'g'ri",
    heroTitleLine2: "Ilovalarda Ochish.",
    heroSubtitle: "Ijtimoiy tarmoq havolalarini in-app (ichki) brauzerlarni chetlab o'tib, telefoningizdagi rasmiy ilovada bir zumda ochuvchi aqlli yo'naltirish tizimi.",
    
    // Input
    placeholder: "Havolani joylashtiring (masalan, https://youtube.com/...)",
    exposeBtn: "Havolani yaratish",
    exposing: "Ulanmoqda...",
    
    // Errors
    errorUrlRequired: "Error: Havola kiritilishi shart.",
    errorInvalidUrl: "Error: Havola formati noto'g'ri.",
    errorNetwork: "Error: Tarmoq bilan ulanishda xatolik yuz berdi.",
    errorNotFound: "Error: So'ralgan qisqa havola serverdan topilmadi.",
    errorServerError: "Error: Baza bilan ulanish yo'qoldi. Qayta urinib ko'ring.",
    errorExpired: "Error: Bu havola muddati tugagan. Yangi havola yarating.",
    errorLimitReached: "Error: Bu havola bosish chekloviga yetdi. Yangi havola yarating.",
    
    // Terminal
    terminalTitle: "LINKJUMP EXPOSE CHIQISHI",
    termActive: "● faol",
    termConnection: "sqlite dvigateli orqali ulanish o'rnatildi",
    termCopyBtn: "Nusxa olish",
    termCopiedBtn: "✓ Nusxalandi!",
    termLabelTunnel: "Tunnel",
    termLabelPublic: "Public",
    termLabelTarget: "Target",
    termLabelPlatform: "Platform",
    
    // Features
    featuresHeader: "// Asosiy imkoniyatlar",
    featuresTitle: "Veb-brauzerlarni chetlab o'ting.",
    featuresSubtitle: "Tezroq yo'naltiring. Foydalanuvchilarni native ilovalarda ushlab qoling.",
    
    feature1Number: "// 01",
    feature1Title: "Universal Yo'naltirish",
    feature1Desc: "Maqsadli ilovalarni darhol ochish uchun Android intent va iOS URL sxemalarini ishga tushiradi.",
    
    feature2Number: "// 02",
    feature2Title: "Real-vaqtda Aniqlash",
    feature2Desc: "Ijtimoiy tarmoqlarni (YouTube, Instagram, TikTok, Twitter/X, Spotify va boshqalar) bir zumda aniqlaydi.",
    
    feature3Number: "// 03",
    feature3Title: "Minimalist va Tezkor",
    feature3Desc: "Kuzatuvchi kukilarsiz. Client-side ortiqcha yuklamalarsiz. Next.js da yozilgan yengil marshrutlash.",
    
    // Footer
    footer: "© 2026 LinkJump. Powered by JPRQ visual engine.",
    
    // Redirect Client Statuses
    redChecking: "Tizim muhitini tahlil qilish...",
    redDesktop: "Kompyuter aniqlandi. Darhol yo'naltirilmoqda...",
    redResolving: "Yo'naltirish adapterlari yuklanmoqda...",
    redRoutingDirect: "To'g'ridan-to'g'ri brauzer orqali yo'naltirilmoqda...",
    redLaunching: "Mobil ilova ishga tushirilmoqda...",
    redTimeout: "Ilovani ochib bo'lmadi. Brauzer orqali ochilmoqda...",
    redHandshake: "Ulanish yakunlandi. Havola ilovada ochildi.",
    redTitle: "LINKJUMP REDIRECT ENGINE v2",

    // Cheklov UI
    limitSectionTitle: "⚙️ Cheklovlar (ixtiyoriy)",
    limitMaxClicks: "Maks. bosish soni",
    limitMaxClicksPlaceholder: "masalan, 100",
    limitExpires: "Amal qilish muddati",
    limitNoLimit: "Cheksiz",
    limit1Hour: "1 soat",
    limit6Hours: "6 soat",
    limit24Hours: "24 soat",
    limit7Days: "7 kun",
    limit30Days: "30 kun",
    termLabelClicks: "Bosishlar",
    termLabelExpires: "Muddati",
    termUnlimited: "cheksiz",
    termNever: "muddatsiz"
  },
  ru: {
    // Nav
    featuresNav: "Возможности",
    useCasesNav: "Применение",
    
    // Hero
    heroTitleLine1: "Туннелирование ссылок",
    heroTitleLine2: "в нативные приложения.",
    heroSubtitle: "Умная система перенаправления, обходящая встроенные браузеры. Без сложных настроек. Мгновенно открывает ссылки в нативном приложении.",
    
    // Input
    placeholder: "Вставьте ссылку (например, https://youtube.com/...)",
    exposeBtn: "Создать ссылку",
    exposing: "Подключение...",
    
    // Errors
    errorUrlRequired: "Error: Требуется ввести ссылку.",
    errorInvalidUrl: "Error: Неверный формат ссылки.",
    errorNetwork: "Error: Ошибка сетевого соединения.",
    errorNotFound: "Error: Запрошенная короткая ссылка не найдена на сервере.",
    errorServerError: "Error: Соединение с базой данных потеряно. Попробуйте снова.",
    errorExpired: "Error: Срок действия этой ссылки истёк. Создайте новую.",
    errorLimitReached: "Error: Лимит переходов для этой ссылки исчерпан. Создайте новую.",
    
    // Terminal
    terminalTitle: "ВЫВОД LINKJUMP EXPOSE",
    termActive: "● активен",
    termConnection: "установлено соединение через sqlite engine",
    termCopyBtn: "Копировать",
    termCopiedBtn: "✓ Скопировано!",
    termLabelTunnel: "Туннель",
    termLabelPublic: "Public",
    termLabelTarget: "Target",
    termLabelPlatform: "Platform",
    
    // Features
    featuresHeader: "// Основные функции",
    featuresTitle: "Обходите веб-просмотры.",
    featuresSubtitle: "Перенаправляйте быстрее. Удерживайте пользователей в нативных приложениях.",
    
    feature1Number: "// 01",
    feature1Title: "Универсальный редирект",
    feature1Desc: "Запускает схемы Android intent и iOS URL для мгновенного открытия целевых приложений.",
    
    feature2Number: "// 02",
    feature2Title: "Определение в реальном времени",
    feature2Desc: "Мгновенно определяет платформы соцсетей (YouTube, Instagram, TikTok, Twitter/X, Spotify и др.).",
    
    feature3Number: "// 03",
    feature3Title: "Минимализм и скорость",
    feature3Desc: "Без отслеживающих файлов cookie. Без избыточной клиентской нагрузки. Легкий роутинг на Next.js.",
    
    // Footer
    footer: "© 2026 LinkJump. На базе визуального движка JPRQ.",
    
    // Redirect Client Statuses
    redChecking: "Анализ системного окружения...",
    redDesktop: "Обнаружен компьютер. Мгновенное перенаправление...",
    redResolving: "Загрузка адаптеров перенаправления...",
    redRoutingDirect: "Перенаправление через прямой браузерный шлюз...",
    redLaunching: "Запуск нативного приложения...",
    redTimeout: "Не удалось открыть приложение. Открытие в браузере...",
    redHandshake: "Соединение завершено. Ссылка открыта в приложении.",
    redTitle: "LINKJUMP REDIRECT ENGINE v2",

    // Ограничения UI
    limitSectionTitle: "⚙️ Ограничения (необязательно)",
    limitMaxClicks: "Макс. кликов",
    limitMaxClicksPlaceholder: "напр. 100",
    limitExpires: "Срок действия",
    limitNoLimit: "Без ограничений",
    limit1Hour: "1 час",
    limit6Hours: "6 часов",
    limit24Hours: "24 часа",
    limit7Days: "7 дней",
    limit30Days: "30 дней",
    termLabelClicks: "Клики",
    termLabelExpires: "Срок",
    termUnlimited: "безлимитно",
    termNever: "бессрочно"
  },
  en: {
    // Nav
    featuresNav: "Features",
    useCasesNav: "Use cases",
    
    // Hero
    heroTitleLine1: "Ship Tunnels to",
    heroTitleLine2: "Native Apps.",
    heroSubtitle: "The smart link routing engine that bypasses in-app browsers. No setup rituals. Just a public URL that loads instantly in the native app.",
    
    // Input
    placeholder: "Paste URL (e.g. https://youtube.com/...)",
    exposeBtn: "Expose URL",
    exposing: "Tunneling...",
    
    // Errors
    errorUrlRequired: "Error: Target URL required.",
    errorInvalidUrl: "Error: Invalid URL format.",
    errorNetwork: "Error: Network connection handshake failed.",
    errorNotFound: "Error: Requested short link not found on server.",
    errorServerError: "Error: Database connection lost. Try again.",
    errorExpired: "Error: This link has expired. Create a new one.",
    errorLimitReached: "Error: This link has reached its click limit. Create a new one.",
    
    // Terminal
    terminalTitle: "LINKJUMP OUTPUT",
    termActive: "● active",
    termConnection: "connection established via sqlite engine",
    termCopyBtn: "Copy URL",
    termCopiedBtn: "✓ Copied!",
    termLabelTunnel: "Tunnel",
    termLabelPublic: "Public",
    termLabelTarget: "Target",
    termLabelPlatform: "Platform",
    
    // Features
    featuresHeader: "// Core features",
    featuresTitle: "Bypass webviews.",
    featuresSubtitle: "Redirect faster. Keep users in native apps.",
    
    feature1Number: "// 01",
    feature1Title: "Universal Redirect",
    feature1Desc: "Automatically triggers native Android intent and iOS URL schemes to open target apps instantly.",
    
    feature2Number: "// 02",
    feature2Title: "Realtime Detection",
    feature2Desc: "Identifies social platforms on the fly (YouTube, Instagram, TikTok, Twitter/X, Spotify and more).",
    
    feature3Number: "// 03",
    feature3Title: "Minimalist & Fast",
    feature3Desc: "No tracking cookies. Zero client-side bloat. Lightweight routing written in Next.js.",
    
    // Footer
    footer: "© 2026 LinkJump. Powered by JPRQ visual engine.",
    
    // Redirect Client Statuses
    redChecking: "Analyzing system environment...",
    redDesktop: "Desktop environment detected. Secure routing instantly...",
    redResolving: "Resolving redirect adapters...",
    redRoutingDirect: "Routing via direct browser gateway...",
    redLaunching: "Exposing local environment to native application...",
    redTimeout: "App launch timeout. Falling back to browser gateway...",
    redHandshake: "Handshake completed. Tunnel open inside native app.",
    redTitle: "LINKJUMP REDIRECT ENGINE v2",

    // Limits UI
    limitSectionTitle: "⚙️ Limits (optional)",
    limitMaxClicks: "Max clicks",
    limitMaxClicksPlaceholder: "e.g. 100",
    limitExpires: "Expires after",
    limitNoLimit: "Unlimited",
    limit1Hour: "1 hour",
    limit6Hours: "6 hours",
    limit24Hours: "24 hours",
    limit7Days: "7 days",
    limit30Days: "30 days",
    termLabelClicks: "Clicks",
    termLabelExpires: "Expires",
    termUnlimited: "unlimited",
    termNever: "never"
  }
};
