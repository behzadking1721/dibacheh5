import { Book, UserStats, BookReview } from '../types';

export const initialUserStats: UserStats = {
  streakDays: 4,
  lastReadDate: new Date().toISOString().split('T')[0],
  dailyGoalMinutes: 15,
  todayMinutesRead: 8,
  monthlyChallengeGoal: 4,
  completedBooksThisMonth: 2,
  xpPoints: 340,
  level: 3,
};

export const sampleReviews: Record<number, BookReview[]> = {
  1: [
    {
      id: 'rev-1-1',
      bookId: 1,
      userName: 'سارا کاظمی',
      rating: 5,
      comment: 'خلاصه فوق‌العاده کاربردی بود! قانون ۲ دقیقه و بهتر شدن ۱ درصدی در کار روزانه‌ام معجزه کرد. حتماً پیشنهاد می‌کنم.',
      createdAt: '۳ روز پیش',
      likesCount: 14,
      isLiked: false,
    },
    {
      id: 'rev-1-2',
      bookId: 1,
      userName: 'امیرحسین رضایی',
      rating: 5,
      comment: 'بهترین کتابی که در زمینه تغییر هویت و ساخت عادات پایدار نوشته شده. دسته‌بندی فصل‌ها در این اپ خیلی تمیز و راحته.',
      createdAt: '۱ هفته پیش',
      likesCount: 9,
      isLiked: true,
    }
  ],
  2: [
    {
      id: 'rev-2-1',
      bookId: 2,
      userName: 'دکتر مهران علوی',
      rating: 5,
      comment: 'تحلیل سیستم ۱ و ۲ ذهن انسان بی‌نظیره. متوجه شدم چقدر در خریدهای روزمره دچار سوگیری لنگراندازی می‌شدم.',
      createdAt: '۵ روز پیش',
      likesCount: 8,
      isLiked: false,
    }
  ],
  3: [
    {
      id: 'rev-3-1',
      bookId: 3,
      userName: 'نیلوفر سپهری',
      rating: 4,
      comment: 'برای کسانی که دچار نشخوار فکری و اضطراب آینده هستند، خواندن این خلاصه آرامش عجیبی به همراه داره.',
      createdAt: '۲ هفته پیش',
      likesCount: 11,
      isLiked: false,
    }
  ],
  4: [
    {
      id: 'rev-4-1',
      bookId: 4,
      userName: 'پویا شمس',
      rating: 5,
      comment: 'فرآیند ۵ مرحله‌ای ری دالیو برای حل چالش‌های استارتاپی ما واقعاً راه‌گشا بود.',
      createdAt: '۴ روز پیش',
      likesCount: 6,
      isLiked: false,
    }
  ],
  5: [
    {
      id: 'rev-5-1',
      bookId: 5,
      userName: 'فرزانه مرادی',
      rating: 5,
      comment: 'این کتاب فراتر از یک مطالعه معمولیه، درسی برای زندگی و معنابخشی به رنج‌هاست. تکان‌دهنده و امیدبخش.',
      createdAt: '۱ روز پیش',
      likesCount: 23,
      isLiked: true,
    }
  ],
  6: [
    {
      id: 'rev-6-1',
      bookId: 6,
      userName: 'کامران رستمی',
      rating: 5,
      comment: 'در دنیای اعلان‌های مداوم اینستاگرام و پیام‌رسان‌ها، این کتاب یک بیدارباش واقعی بود.',
      createdAt: '۶ روز پیش',
      likesCount: 17,
      isLiked: false,
    }
  ],
  7: [
    {
      id: 'rev-7-1',
      bookId: 7,
      userName: 'الهام سعیدی',
      rating: 5,
      comment: 'دیدگاه هراری درباره تکامل گونه انسان و قدرت ساختن افسانه‌ها ذهن رو باز می‌کنه.',
      createdAt: '۲ روز پیش',
      likesCount: 19,
      isLiked: true,
    }
  ],
  8: [
    {
      id: 'rev-8-1',
      bookId: 8,
      userName: 'محمدرضا تاجیک',
      rating: 5,
      comment: 'فرمول اثر مرکب در ترکیب با عادات روزانه بهترین مکمل برای مدیریت مالی و موفقیت شخصیه.',
      createdAt: '۳ روز پیش',
      likesCount: 12,
      isLiked: false,
    }
  ],
  9: [
    {
      id: 'rev-9-1',
      bookId: 9,
      userName: 'زهرا مهدوی',
      rating: 4,
      comment: 'فرمول ۲۰-۲۰-۲۰ صبحگاهی انرژی کل روزم رو عوض کرده.',
      createdAt: '۴ روز پیش',
      likesCount: 7,
      isLiked: false,
    }
  ]
};

export const initialBooks: Book[] = [
  {
    id: 1,
    title: 'عادات اتمی',
    author: 'جیمز کلیر',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    accentColor: '#3B82F6',
    category: 'خودسازی',
    readTime: '۱۵ دقیقه',
    rating: 4.9,
    publishYear: 2018,
    isFavorite: true,
    isRead: false,
    isPurchased: true,
    isDownloaded: true,
    isWantToRead: true,
    isTrending: true,
    isEditorChoice: true,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 0.35,
    isBookOfDay: true,
    downloadsCount: 1420,
    epubUrl: 'https://example.com/books/atomic-habits.epub',
    summary: 'چگونه با ایجاد تغییرات کوچک و به‌ظاهر ناچیز در عادات روزمره، به دستاوردهای شگفت‌انگیز و پایدار برسیم.',
    keyPoints: [
      'تمرکز روی سیستم‌ها به جای اهداف کوتاه‌مدت',
      'قانون ۱٪ بهتر شدن هر روز و اثر مرکب عادات در گذر زمان',
      'چهار قانون طلایی تغییر رفتار: آشکار، جذاب، ساده و رضایت‌بخش',
      'طراحی بهینه محیط فیزیکی برای کاهش اصطکاک کارهای خوب'
    ],
    chapters: [
      {
        id: 1,
        title: 'فصل اول: قدرت شگفت‌انگیز عادات کوچک',
        content: `سرنوشت و موفقیت نهایی شما نتیجه‌ی تصمیمات لحظه‌ای بزرگ نیست، بلکه بازتاب عادات روزمره و انتخاب‌های به ظاهر بی‌اهمیت شماست. اگر هر روز فقط ۱ درصد بهتر شوید، در پایان یک سال ۳۷ برابر رشد خواهید کرد. برعکس، اگر هر روز ۱ درصد پسرفت کنید، تقریباً تمام توانمندی‌های خود را از دست خواهید داد.

عادات مانند بهره مرکب برای خودبهبودی عمل می‌کنند. در آغاز، تغییرات تقریباً نامحسوس هستند، اما با گذشت ماه‌ها و سال‌ها تفاوت عظیمی خلق می‌شود. چالش اصلی در آغاز این است که نتایج اولیه در پسِ «دره ناامیدی» پنهان می‌مانند؛ جایی که تلاش می‌کنید اما هنوز ثمره‌ای آشکار نمی‌بینید.`
      },
      {
        id: 2,
        title: 'فصل دوم: تغییر هویت به جای تغییر نتیجه',
        content: `بسیاری از مردم تلاش می‌کنند با تغییر نتایج (مانند کم کردن ۱۰ کیلوگرم وزن) رفتار خود را عوض کنند. اما پایدارترین تغییر، تغییری است که بر پایه‌ی هویت شکل می‌گیرد.

به جای اینکه بگویید «من در حال ترک سیگار هستم»، بگویید «من فردی سیگاری نیستم». هر کنش و عادتی که در طول روز انجام می‌دهید، در واقع رأیی است که به هویت آینده خود می‌دهید. اگر ۵ صفحه کتاب بخوانید، به هویت کتاب‌خوان بودن خود رأی داده‌اید.`
      },
      {
        id: 3,
        title: 'فصل سوم: چهار قانون طلایی تغییر رفتار',
        content: `برای ایجاد یک عادت جدید، از این چهار گام استفاده کنید:
۱. آن را آشکار کنید (نشانه): زمان، مکان و نشانه‌های محیطی را صریح مشخص کنید.
۲. آن را جذاب کنید (تمایل): انجام کار را با کارهایی که دوست دارید تلفیق کنید.
۳. آن را ساده کنید (پاسخ): مقاومت و اصطکاک شروع کار را کاهش دهید (قانون دو دقیقه).
۴. آن را رضایت‌بخش کنید (پاداش): پاداش‌های فوری و حسی برای خود در نظر بگیرید.`
      }
    ],
    reviews: sampleReviews[1],
  },
  {
    id: 2,
    title: 'فکر کردن سریع و آهسته',
    author: 'دانیل کانمن',
    cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=500&q=80',
    accentColor: '#10B981',
    category: 'روان‌شناسی',
    readTime: '۲۵ دقیقه',
    rating: 4.8,
    publishYear: 2011,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: true,
    isTrending: false,
    isEditorChoice: true,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 0,
    downloadsCount: 890,
    epubUrl: 'https://example.com/books/thinking-fast-slow.epub',
    summary: 'کانمن برنده نوبل اقتصاد، دو سیستم تفکر انسان را بررسی می‌کند: سیستم ۱ سریع و شهودی و سیستم ۲ آهسته و تحلیلی.',
    keyPoints: [
      'دو سیستم تفکر: سیستم ۱ (سریع و ناخودآگاه) و سیستم ۲ (آهسته و متمرکز)',
      'سوگیری‌های شناختی متداول مانند خطای لنگراندازی و در دسترس بودن',
      'اعتماد به نفس بیش از حد و توهم درک گذشته',
      'نظریه چشم‌انداز و واکنش نامتقارن به سود و زیان'
    ],
    chapters: [
      {
        id: 1,
        title: 'سیستم ۱ و سیستم ۲ در مغز',
        content: `ذهن انسان توسط دو بازیگر اصلی هدایت می‌شود:
سیستم ۱ به صورت خودکار و بسیار سریع، بدون تلاش یا با تلاشی ناچیز و بدون حس کنترل ارادی عمل می‌کند. مثلاً تشخیص خشم در چهره یک شخص یا پاسخ به ۲ ضرب‌در ۲.
سیستم ۲ نیازمند تخصیص توجه و تمرکز است. مانند حل یک مسئله ریاضی پیچیده یا پارک دوبل در کوچه‌ای باریک. سیستم ۲ کند و تنبل است و ترجیح می‌دهد کنترل را به سیستم ۱ واگذار کند.`
      },
      {
        id: 2,
        title: 'خطاهای شناختی و سوگیری‌ها',
        content: `یکی از بزرگ‌ترین خطاهای فکری «سوگیری لنگراندازی» است؛ جایی که ذهن انسان نخستین داده یا عدد دریافتی را مبنا قرار می‌دهد و قضاوت‌های بعدی را حول آن شکل می‌دهد. سوگیری دیگر «در دسترس بودن» است؛ ما احتمال وقوع حوادثی را که سریع‌تر به یاد می‌آوریم بسیار بالاتر از واقعیت ارزیابی می‌کنیم.`
      }
    ],
    reviews: sampleReviews[2],
  },
  {
    id: 3,
    title: 'قدرت الان',
    author: 'اکهارت تول',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80',
    accentColor: '#EF4444',
    category: 'معنویت',
    readTime: '۲۰ دقیقه',
    rating: 4.6,
    publishYear: 1999,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: false,
    isTrending: false,
    isEditorChoice: false,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 0,
    downloadsCount: 710,
    epubUrl: 'https://example.com/books/power-of-now.epub',
    summary: 'راهنمایی معنوی برای رهایی از اضطراب گذشته و آینده و درک آرامش شگرف حضور در لحظه حال.',
    keyPoints: [
      'زندگی واقعی فقط و فقط در لحظه «اکنون» جریان دارد',
      'شما افکار خود نیستید؛ شما ناظر و شاهدی بر افکار خود هستید',
      'درک جسم درونی و ارتباط با آگاهی نامحدود',
      'پذیرش و تسلیم فعال در برابر حقیقت آنچه هست'
    ],
    chapters: [
      {
        id: 1,
        title: 'تو ذهن خود نیستی',
        content: `بزرگ‌ترین مانع برای تجربه آرامش و روشنگری، این توهم است که شما همان ذهن و افکارتان هستید. این جریان بی‌وقفه نشخوار ذهنی انرژی روانی را تحلیل می‌برد. لحظه‌ای که بتوانید به عنوان یک تماشاگر بی‌طرف به نجوای ذهن خود گوش دهید، سطح جدیدی از آگاهی در وجود شما بیدار می‌شود.`
      },
      {
        id: 2,
        title: 'رهایی از زمان روانشناختی',
        content: `زمان گذشته به شما هویت خیالی می‌بخشد و آینده وعده نجات و رضایت می‌دهد؛ اما هر دوی این‌ها توهماتی ذهنی هستند. هیچ چیز تاکنون در گذشته اتفاق نیفتاده، بلکه در لحظه حال رخ داده است. تنها چیزی که واقعاً در اختیار دارید، همین اکنونِ بی‌پایان است.`
      }
    ],
    reviews: sampleReviews[3],
  },
  {
    id: 4,
    title: 'اصول',
    author: 'ری دالیو',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80',
    accentColor: '#8B5CF6',
    category: 'کسب‌وکار',
    readTime: '۳۰ دقیقه',
    rating: 4.7,
    publishYear: 2017,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: false,
    isTrending: false,
    isEditorChoice: true,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 0.9,
    downloadsCount: 650,
    epubUrl: 'https://example.com/books/principles.epub',
    summary: 'ری دالیو بنیان‌گذار بریج‌واتر، اصول زیستی و کاری خود در تصمیم‌گیری‌های پیچیده بازار و مدیریت سازمان را تشریح می‌کند.',
    keyPoints: [
      'شفافیت رادیکال و صداقت بی‌پرده در کار تیمی',
      'پذیرش واقعیت به عنوان مبنای تمام پیشرفت‌ها',
      'فرآیند ۵ مرحله‌ای رسیدن به خواسته‌ها در زندگی',
      'شایسته‌سالاری در ایده‌ها به جای اتکا به مقام و رتبه'
    ],
    chapters: [
      {
        id: 1,
        title: 'پذیرش واقعیت و برخورد با آن',
        content: `هیچ چیز مهم‌تر از درک نحوه عملکرد واقعیت و تطبیق با آن نیست. درد به علاوه تأمل و یادگیری مساوی است با پیشرفت. اشتباهات اجتناب‌ناپذیرند، اما تکرار کورکورانه اشتباهات نابخشودنی است. انسان‌های موفق کسانی هستند که مشتاقانه به دنبال کشف ضعف‌های خود می‌روند.`
      }
    ],
    reviews: sampleReviews[4],
  },
  {
    id: 5,
    title: 'انسان در جستجوی معنی',
    author: 'ویکتور فرانکل',
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=500&q=80',
    accentColor: '#D97706',
    category: 'روان‌شناسی',
    readTime: '۱۸ دقیقه',
    rating: 4.9,
    publishYear: 1946,
    isFavorite: true,
    isRead: true,
    isPurchased: true,
    isDownloaded: true,
    isWantToRead: false,
    isTrending: true,
    isEditorChoice: true,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 1.0,
    downloadsCount: 1850,
    epubUrl: 'https://example.com/books/mans-search-for-meaning.epub',
    summary: 'خاطرات فرانکل در اردوگاه‌های کار اجباری و چگونگی پیدا کردن معنای زندگی در دل تاریک‌ترین لحظات بشری.',
    keyPoints: [
      'هر کس چرایی برای زیستن داشته باشد، با هر چگونه‌ای خواهد ساخت',
      'آخرین آزادی انسان: انتخاب نگرش در هر شرایط مفروض',
      'معنا در کار خلاقانه، عشق ورزیدن و پذیرش شجاعانه رنج شکل می‌گیرد'
    ],
    chapters: [
      {
        id: 1,
        title: 'تجارب اردوگاه کار اجباری',
        content: `آنچه انسان را در اسارت زنده نگاه می‌داشت، توان بدنی صرف نبود، بلکه چشم‌اندازی به آینده و دلیلی برای ادامه حیات بود. وقتی همه چیز از انسان سلب می‌شود، تنها یک آزادی باقی می‌ماند: تصمیم‌گیری درباره اینکه چگونه نسبت به سرنوشت خود رفتار کند.`
      }
    ],
    reviews: sampleReviews[5],
  },
  {
    id: 6,
    title: 'کار عمیق',
    author: 'کال نیوپورت',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=500&q=80',
    accentColor: '#0EA5E9',
    category: 'کسب‌وکار',
    readTime: '۲۲ دقیقه',
    rating: 4.8,
    publishYear: 2016,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: true,
    isTrending: true,
    isEditorChoice: true,
    isClassic: false,
    isNew: false,
    price: 0,
    progress: 0,
    downloadsCount: 940,
    epubUrl: 'https://example.com/books/deep-work.epub',
    summary: 'راهنمایی برای تمرکز بدون حواس‌پرتی در دنیایی پر از شلوغی‌های دیجیتال و خلق ارزش‌های تکرارنشدنی.',
    keyPoints: [
      'کار عمیق مهارتی نادر و در عین حال فوق‌العاده ارزشمند است',
      'حواس‌پرتی‌های دیجیتال ساختار عصبی تمرکز را تخریب می‌کنند',
      'قوانین ۴ گانه: عمیق کار کردن، پذیرش کسالت، دوری از شبکه‌های اجتماعی و کاهش کارهای سطحی'
    ],
    chapters: [
      {
        id: 1,
        title: 'ایده کار عمیق و ارزش آن',
        content: `کار عمیق یعنی فعالیت‌های حرفه‌ای که در حالت تمرکز کامل و بدون حواس‌پرتی انجام می‌شوند و توانایی‌های شناختی شما را به نهایت می‌رسانند. این تلاش‌ها ارزش جدیدی می‌آفرینند، مهارت شما را بهبود می‌بخشند و تکرار آنها توسط دیگران دشوار است.`
      }
    ],
    reviews: sampleReviews[6],
  },
  {
    id: 7,
    title: 'انسان خردمند (Sapiens)',
    author: 'یووال نوح هراری',
    cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=500&q=80',
    accentColor: '#E11D48',
    category: 'تاریخ',
    readTime: '۲۸ دقیقه',
    rating: 4.9,
    publishYear: 2014,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: true,
    isTrending: true,
    isEditorChoice: true,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 0,
    downloadsCount: 2100,
    epubUrl: 'https://example.com/books/sapiens.epub',
    summary: 'روایت تاریخ مختصر بشر از پیدایش در آفریقا، انقلاب شناختی، انقلاب کشاورزی و ساختن امپراتوری‌ها تا عصر هوش مصنوعی.',
    keyPoints: [
      'انقلاب شناختی و قدرت یگانه هوموساپینس در باور به روایت‌ها و خیالات جمعی',
      'پول، دین و امپراتوری به عنوان بزرگ‌ترین نیروهای وحدت‌بخش تاریخ',
      'آیا انقلاب کشاورزی بزرگ‌ترین تله تاریخ بشر بود؟',
      'آینده گونه انسان و ادغام با فناوری و بیوتکنولوژی'
    ],
    chapters: [
      {
        id: 1,
        title: 'قدرت تخیل مشترک',
        content: `تنها دلیلی که انسان توانست در گروه‌های میلیونی با یکدیگر همکاری کند این بود که می‌توانست به چیزهایی که وجود عینی ندارند (مانند پول، شرکت‌ها، ملت‌ها و قوانین حقوقی) ایمان بیاورد. هیچ شامپانزه‌ای با وعده موز در بهشت موزش را به شامپانزه دیگر نمی‌دهد، اما انسان‌ها برای باورهای انتزاعی جان‌فشانی می‌کنند.`
      }
    ],
    reviews: sampleReviews[7],
  },
  {
    id: 8,
    title: 'اثر مرکب',
    author: 'دارن هاردی',
    cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=500&q=80',
    accentColor: '#16A34A',
    category: 'خودسازی',
    readTime: '۱۶ دقیقه',
    rating: 4.8,
    publishYear: 2010,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: false,
    isTrending: true,
    isEditorChoice: false,
    isClassic: true,
    isNew: false,
    price: 0,
    progress: 0,
    downloadsCount: 1650,
    epubUrl: 'https://example.com/books/compound-effect.epub',
    summary: 'سیستمی عملی برای رسیدن به اهداف بزرگ با تکیه بر تصمیمات هوشمندانه، کوچک و مداوم در طول زمان.',
    keyPoints: [
      'فرمول اثر مرکب: انتخاب‌های کوچک + ثبات قدم + زمان = تفاوت‌های چشمگیر',
      'هیچ راه میانبر یا کلید جادویی وجود ندارد؛ قدرت در کارهای روزمره پنهان است',
      'رهگیری و ثبت مکتوب رفتارهای روزانه برای تسلط بر ناخودآگاه',
      'تکانش بزرگ (Big Mo): سخت‌ترین بخش شروع است، سپس جریان شما را جلو می‌برد'
    ],
    chapters: [
      {
        id: 1,
        title: 'اثر مرکب در عمل',
        content: `شما هرگز متوجه یک تصمیم ساده مثل نخوردن یک دسر یا خواندن ۱۰ صفحه کتاب در یک روز نخواهید شد. اما بعد از ۲۷ یا ۳۱ ماه، تفاوت کسی که هر روز یک انتخاب هوشمندانه انجام داده با کسی که غفلت کرده، مانند فاصله زمین تا آسمان است.`
      }
    ],
    reviews: sampleReviews[8],
  },
  {
    id: 9,
    title: 'باشگاه ۵ صبحی‌ها',
    author: 'رابین شارما',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80',
    accentColor: '#F59E0B',
    category: 'خودسازی',
    readTime: '۱۷ دقیقه',
    rating: 4.6,
    publishYear: 2018,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: true,
    isTrending: false,
    isEditorChoice: false,
    isClassic: false,
    isNew: true,
    price: 0,
    progress: 0,
    downloadsCount: 820,
    epubUrl: 'https://example.com/books/5am-club.epub',
    summary: 'مالکیت صبح‌هایتان را به دست بگیرید تا زندگی‌تان متحول شود. فرمول ۲۰-۲۰-۲۰ برای ساعات آغازین روز.',
    keyPoints: [
      'ساعت پیروزی (۵ تا ۶ صبح) و ترشح دوپامین و سروتونین',
      'فرمول ۲۰-۲۰-۲۰: ۲۰ دقیقه ورزش سنگین، ۲۰ دقیقه تفکر و نیایش، ۲۰ دقیقه یادگیری',
      'حکومت بر چهار امپراتوری درونی: ذهن، قلب، جسم و روح',
      'قانون ۶۶ روز برای تثبیت عادات خارق‌العاده'
    ],
    chapters: [
      {
        id: 1,
        title: 'قانون ساعت پیروزی',
        content: `وقتی قبل از طلوع آفتاب بیدار می‌شوید، ذهن شما در آرام‌ترین و زلال‌ترین حالت خود است. در این ساعت دنیا هنوز در خواب است و هیچ حواس‌پرتی یا پیامی آرامش شما را مختل نمی‌کند. این زمان اختصاصی برای بازسازی توانمندی‌های درونی شماست.`
      }
    ],
    reviews: sampleReviews[9],
  },
  {
    id: 10,
    title: 'شجاعت بی‌علاقگی (جسارت دوست‌نداشته‌شدن)',
    author: 'ایچیرو کیشیمی',
    cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=500&q=80',
    accentColor: '#6366F1',
    category: 'فلسفه',
    readTime: '۲۴ دقیقه',
    rating: 4.8,
    publishYear: 2019,
    isFavorite: false,
    isRead: false,
    isPurchased: true,
    isDownloaded: false,
    isWantToRead: true,
    isTrending: true,
    isEditorChoice: true,
    isClassic: false,
    isNew: true,
    price: 0,
    progress: 0,
    downloadsCount: 1100,
    epubUrl: 'https://example.com/books/courage-to-be-disliked.epub',
    summary: 'گفتگوی عمیق میان یک فیلسوف و یک جوان بر پایه روان‌شناسی آلفرد آدلر درباره رهایی از قضاوت‌های دیگران و کشف آزادی واقعی.',
    keyPoints: [
      'جداسازی وظایف: تشخیص اینکه چه چیزی وظیفه شماست و چه چیزی وظیفه دیگران',
      'گذشته تعیین‌کننده آینده شما نیست؛ شما هدفمندانه به تجارب گذشته معنا می‌دهید',
      'تمام مشکلات بشر ریشه در روابط بین‌فردی دارد',
      'شجاعت معمولی بودن و زیستن در همین لحظه به مثابه رقصیدن'
    ],
    chapters: [
      {
        id: 1,
        title: 'تفکیک وظایف و رهایی',
        content: `شما برای برآورده کردن انتظارات دیگران زندگی نمی‌کنید و دیگران نیز برای برآورده کردن انتظارات شما زندگی نمی‌کنند. وقتی یاد بگیرید وظایف خود را از وظایف دیگران جدا کنید، بخش عظیمی از تعارضات، احساس گناه و سنگینی‌های روانی از دوش شما برداشته می‌شود.`
      }
    ],
    reviews: [
      {
        id: 'rev-10-1',
        bookId: 10,
        userName: 'آیدا کریمی',
        rating: 5,
        comment: 'دیدگاه آدلر درباره تفکیک وظایف دید من رو نسبت به انتظارات خانواده و دوستان کاملاً عوض کرد.',
        createdAt: '۲ روز پیش',
        likesCount: 15,
        isLiked: false,
      }
    ]
  }
];

export const categories = ['همه', 'خودسازی', 'روان‌شناسی', 'معنویت', 'کسب‌وکار', 'تاریخ', 'فلسفه'];
