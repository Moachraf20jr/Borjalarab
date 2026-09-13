import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import User from '../models/User.js'
import Project from '../models/Project.js'
import Article from '../models/Article.js'
import TeamMember from '../models/TeamMember.js'
import { generateUniqueSlug } from '../utils/slugify.js'
import dotenv from 'dotenv'

dotenv.config()

const sampleProjects = [
  {
    title: 'فيلا سكنية خاصة - حي الراكة',
    category: 'سكني',
    description: 'تصميم وإشراف كامل على فيلا فاخرة بمساحة 800م²، تجمع بين الطابع العصري والخصوصية العالية.',
    fullDescription: 'مشروع فيلا سكنية فاخرة تم تصميمها بعناية فائقة لتلبية احتياجات العائلة العصرية مع الحفاظ على الخصوصية العالية. تم استخدام أحدث التقنيات في التصميم الإنشائي والمعماري، مع مراعاة الاستدامة وكفاءة الطاقة.',
    location: 'الخبر - حي الراكة',
    year: 2024,
    services: ['التصميم المعماري', 'التصميم الإنشائي', 'الإشراف الكامل', 'إدارة المشروع'],
    image: '/images/projects/project-1.jpg',
    titleEn: 'Private Residential Villa - Al Rakah District',
    categoryEn: 'Residential',
    descriptionEn: 'Full design and supervision of a luxurious 800m² villa, combining a contemporary character with high privacy.',
    fullDescriptionEn: 'A luxury residential villa carefully designed to meet the needs of the modern family while maintaining high privacy. State-of-the-art structural and architectural design techniques were used, with focus on sustainability and energy efficiency.',
    locationEn: 'Al Khobar - Al Rakah District',
    servicesEn: ['Architectural Design', 'Structural Design', 'Full Supervision', 'Project Management'],
    featured: true,
    isPublished: true
  },
  {
    title: 'مبنى إداري حديث - كورنيش الخبر',
    category: 'إداري',
    description: 'مبنى مكاتب بارتفاع 8 طوابق، بتصميم مستدام وأنظمة ذكية لإدارة الطاقة.',
    fullDescription: 'مبنى إداري ذكي تم تصميمه بأعلى معايير الاستدامة، يضم أنظمة إدارة طاقة متطورة، إضاءة ذكية، وأنظمة تكييف عالية الكفاءة. الواجهات الزجاجية عالية الأداء توفر إضاءة طبيعية مع عزل حراري ممتاز.',
    location: 'الخبر - الكورنيش',
    year: 2024,
    services: ['التصميم المعماري', 'التصميم الإنشائي', 'النمذجة ثلاثية الأبعاد', 'إدارة المشروع'],
    image: '/images/projects/project-2.jpg',
    titleEn: 'Modern Office Building - Al Khobar Corniche',
    categoryEn: 'Administrative',
    descriptionEn: 'An 8-storey office building with sustainable design and smart energy management systems.',
    fullDescriptionEn: 'A smart office building designed to the highest sustainability standards, featuring advanced energy management systems, smart lighting, and high-efficiency air conditioning. High-performance glass facades provide natural light with excellent thermal insulation.',
    locationEn: 'Al Khobar - Corniche',
    servicesEn: ['Architectural Design', 'Structural Design', '3D Modeling', 'Project Management'],
    featured: true,
    isPublished: true
  },
  {
    title: 'مجمع تجاري متكامل - الظهران',
    category: 'تجاري',
    description: 'مجمع تجاري بمساحة 15,000م² يتضمن محلات، مطاعم، ومساحات ترفيهية بتصميم معاصر.',
    fullDescription: 'مجمع تجاري ضخم يخدم منطقة الظهران، صمم ليكون وجهة عائلية متكاملة تضم محلات تجارية متنوعة، مطاعم عالمية، ومساحات ترفيهية للأطفال. التصميم يراعي تدفق الزوار وسهولة الوصول.',
    location: 'الظهران',
    year: 2023,
    services: ['التصميم المعماري', 'التصميم الإنشائي', 'الإشراف الكامل', 'إدارة التكاليف'],
    image: '/images/projects/project-3.jpg',
    titleEn: 'Integrated Commercial Complex - Dhahran',
    categoryEn: 'Commercial',
    descriptionEn: 'A 15,000m² commercial complex including shops, restaurants, and entertainment areas with a contemporary design.',
    fullDescriptionEn: 'A large commercial complex serving the Dhahran area, designed as a complete family destination with diverse retail shops, international restaurants, and kids entertainment areas. The design considers visitor flow and ease of access.',
    locationEn: 'Dhahran',
    servicesEn: ['Architectural Design', 'Structural Design', 'Full Supervision', 'Cost Management'],
    featured: false,
    isPublished: true
  },
  {
    title: 'مشروع تطوير عمراني - الدمام',
    category: 'عمراني',
    description: 'مخطط شامل لتطوير منطقة سكنية بمساحة 500,000م² تشمل البنية التحتية والمرافق.',
    fullDescription: 'مخطط تطوير عمراني شامل لمنطقة سكنية جديدة، يشمل تصميم شبكات البنية التحتية (طرق، صرف، كهرباء، اتصالات)، توزيع المرافق الخدمية (مدارس، مساجد، حدائق، مراكز صحية)، ودراسات الأثر البيئي.',
    location: 'الدمام',
    year: 2023,
    services: ['التخطيط العمراني', 'تصميم البنية التحتية', 'دراسات الأثر البيئي', 'إدارة المشروع'],
    image: '/images/projects/project-4.jpg',
    titleEn: 'Urban Development Project - Dammam',
    categoryEn: 'Urban',
    descriptionEn: 'A comprehensive plan to develop a 500,000m² residential area including infrastructure and facilities.',
    fullDescriptionEn: 'A comprehensive urban development plan for a new residential area, including infrastructure networks design (roads, drainage, electricity, telecoms), service facilities distribution (schools, mosques, parks, health centers), and environmental impact studies.',
    locationEn: 'Dammam',
    servicesEn: ['Urban Planning', 'Infrastructure Design', 'Environmental Impact Studies', 'Project Management'],
    featured: false,
    isPublished: true
  },
  {
    title: 'مركز أعمال رئيسي - الجبيل',
    category: 'تجاري',
    description: 'برج مكاتب تجارية بارتفاع 12 طابقاً، بواجهات زجاجية عالية الأداء وأنظمة بناء ذكية.',
    fullDescription: 'برج مكاتب تجارية يعد معلماً بارزاً في الجبيل الصناعية، يتميز بواجهات زجاجية عالية الأداء، أنظمة بناء ذكية (BMS)، مواقف سيارات ذكية، ومساحات مكتبية مرنة تناسب الشركات الناشئة والكبيرة.',
    location: 'الجبيل الصناعية',
    year: 2024,
    services: ['التصميم المعماري', 'التصميم الإنشائي', 'النمذجة ثلاثية الأبعاد', 'الإشراف الكامل'],
    image: '/images/projects/project-5.jpg',
    titleEn: 'Major Business Center - Jubail',
    categoryEn: 'Commercial',
    descriptionEn: 'A 12-storey commercial office tower with high-performance glass facades and smart building systems.',
    fullDescriptionEn: 'A commercial office tower that is a landmark in Jubail Industrial City, featuring high-performance glass facades, smart building management systems (BMS), smart parking, and flexible office spaces suitable for startups and large companies.',
    locationEn: 'Jubail Industrial City',
    servicesEn: ['Architectural Design', 'Structural Design', '3D Modeling', 'Full Supervision'],
    featured: true,
    isPublished: true
  },
  {
    title: 'مجمع سكني فاخر - الخبر الشمالية',
    category: 'سكني',
    description: 'مجمع فلل وقصور بمساحة 200,000م² بتصميم يحترم البيئة المحلية ويوفر أعلى معايير الرفاهية.',
    fullDescription: 'مجمع سكني فاخر يضم فلل وقصور بتصاميم متنوعة تحترم الطراز المعماري المحلي مع لمسات عصرية. المشروع يشمل مرافق ترفيهية متكاملة (نادي رياضي، مسابح، ملاعب، مساحات خضراء)، وأنظمة أمنية متطورة.',
    location: 'الخبر الشمالية',
    year: 2022,
    services: ['التصميم المعماري', 'التخطيط العمراني', 'تصميم البنية التحتية', 'إدارة المشروع', 'الإشراف الكامل'],
    image: '/images/projects/project-6.jpg',
    titleEn: 'Luxury Residential Compound - North Al Khobar',
    categoryEn: 'Residential',
    descriptionEn: 'A 200,000m² compound of villas and palaces with a design that respects the local environment and provides the highest standards of luxury.',
    fullDescriptionEn: 'A luxury residential compound featuring villas and palaces with diverse designs that respect the local architectural style with contemporary touches. The project includes fully integrated leisure facilities (gym, pools, courts, green spaces) and advanced security systems.',
    locationEn: 'North Al Khobar',
    servicesEn: ['Architectural Design', 'Urban Planning', 'Infrastructure Design', 'Project Management', 'Full Supervision'],
    featured: false,
    isPublished: true
  }
]

const sampleArticles = [
  {
    title: 'كيف تبدأ مشروعاً هندسياً ناجحاً؟',
    category: 'إدارة المشاريع',
    excerpt: 'دليل شامل لخطوات تأسيس المشروع الهندسي من الفكرة إلى التسليم، مع نصائح لتجنب الأخطاء الشائعة.',
    content: `يعد بدء مشروع هندسي ناجح تحدياً يتطلب تخطيطاً دقيقاً وفهماً عميقاً لجميع المراحل. في هذا الدليل الشامل، نستعرض الخطوات الأساسية لتأسيس مشروع هندسي ناجح:

## 1. تحديد الأهداف والنطاق
قبل البدء، يجب تحديد أهداف المشروع بوضوح: ما الذي نريد تحقيقه؟ ما هي المخرجات المتوقعة؟ ما هي القيود (الميزانية، الوقت، الجودة)؟

## 2. دراسة الجدوى
دراسة جدوى شاملة تشمل:
- الجدوى الفنية: هل المشروع قابل للتنفيذ تقنياً؟
- الجدوى الاقتصادية: تحليل التكاليف والعوائد المتوقعة
- الجدوى القانونية: التراخيص واللوائح المنظمة
- الجدوى البيئية: الأثر البيئي والتخفيف منه

## 3. تشكيل الفريق
اختيار فريق عمل متكامل يشمل:
- مدير مشروع ذو خبرة
- مهندسين معماريين وإنشائيين
- استشاريين متخصصين
- فريق إشراف وتنفيذ

## 4. التصميم والتخطيط
مراحل التصميم:
- التصميم المفهومي
- التصميم الأولي
- التصميم التنفيذي التفصيلي
- مراجعة واعتماد المخططات

## 5. التراخيص والموافقات
الحصول على جميع التراخيص اللازمة من الجهات المختصة قبل البدء في التنفيذ.

## 6. التنفيذ والإشراف
متابعة دقيقة للجودة والالتزام بالمخططات والجدول الزمني.

## 7. التسليم والمتابعة
إجراءات التسليم الرسمي، فترة الضمان، والصيانة الدورية.

باتباع هذه الخطوات مع فريق محترف، يمكن تقليل المخاطر وضمان نجاح المشروع.`,
    author: 'مكتب برج العرب للاستشارات الهندسية',
    image: '/images/articles/article-1.jpg',
    titleEn: 'How to Start a Successful Engineering Project?',
    categoryEn: 'Project Management',
    excerptEn: 'A complete guide to the steps of establishing an engineering project from idea to delivery, with tips to avoid common mistakes.',
    contentEn: `Starting a successful engineering project is a challenge that requires careful planning and a deep understanding of all stages. Here are the essential steps:

## 1. Define Goals and Scope
Clearly define what the project must achieve, the expected deliverables, and the constraints (budget, time, quality).

## 2. Feasibility Study
A comprehensive study covering technical feasibility, economic analysis (costs and expected returns), legal requirements (licenses and regulations), and environmental impact.

## 3. Build the Team
Assemble a complete team: an experienced project manager, architects and structural engineers, specialized consultants, and a supervision and execution crew.

## 4. Design and Planning
Conceptual design, preliminary design, detailed shop drawings, and final review and approval of drawings.

## 5. Permits and Approvals
Obtain all necessary permits from the relevant authorities before construction begins.

## 6. Execution and Supervision
Careful quality follow-up and adherence to drawings and the time schedule.

## 7. Handover and Follow-up
Formal handover procedures, warranty period, and periodic maintenance.

Following these steps with a professional team reduces risk and ensures project success.`,
    authorEn: 'Burj Al Arab Engineering Consultancy Office',
    isPublished: true
  },
  {
    title: 'أهمية الإشراف الهندسي أثناء التنفيذ',
    category: 'الإشراف الهندسي',
    excerpt: 'لماذا يعد الإشراف الميداني المستمر عاملاً حاسماً في ضمان جودة التنفيذ ومطابقة المواصفات؟',
    content: `الإشراف الهندسي هو العين التي تراقب جودة التنفيذ في الموقع، وهو الخط الدفاعي الأخير لضمان مطابقة البناء للتصاميم والمواصفات المعتمدة.

## دور المشرف الهندسي:
1. **مطابقة التنفيذ للتصاميم**: التحقق من أن كل عنصر يتم تنفيذه وفق المخططات المعتمدة
2. **جودة المواد**: فحص واعتماد جميع المواد قبل استخدامها
3. **متابعة الجدول الزمني**: مراقبة تقدم العمل مقارنة بالبرنامج الزمني
4. **التقارير الدورية**: توثيق التقدم والمشاكل والحلول
5. **إدارة أوامر التغيير**: تقييم وتوثيق أي تغييرات مطلوبة

## عواقب غياب الإشراف:
- أخطاء إنشائية قد تهدد السلامة
- تكاليف إضافية لإصلاح الأخطاء
- تأخير في الجدول الزمني
- نزاعات قانونية محتملة

الإشراف المستمر ليس رفاهية، بل ضرورة لحماية الاستثمار وضمان سلامة المبنى.`,
    author: 'مكتب برج العرب للاستشارات الهندسية',
    image: '/images/articles/article-2.jpg',
    titleEn: 'The Importance of Engineering Supervision During Execution',
    categoryEn: 'Construction Supervision',
    excerptEn: 'Why continuous field supervision is a critical factor in ensuring execution quality and specification compliance.',
    contentEn: `Engineering supervision is the eye that monitors execution quality on site, and the last line of defence to ensure the building matches the approved designs and specifications.

## The role of the supervising engineer:
1. **Matching execution with designs**: verifying every element is executed according to approved drawings
2. **Material quality**: inspecting and approving all materials before use
3. **Time schedule follow-up**: monitoring progress against the programme
4. **Periodic reports**: documenting progress, problems and solutions
5. **Change order management**: assessing and documenting any required changes

## Consequences of missing supervision:
- Structural defects that may threaten safety
- Additional costs to fix errors
- Delays in the time schedule
- Potential legal disputes

Continuous supervision is not a luxury; it is a necessity to protect the investment and ensure building safety.`,
    authorEn: 'Burj Al Arab Engineering Consultancy Office',
    isPublished: true
  },
  {
    title: 'كيف تساعد المخططات التنفيذية في نجاح المشروع؟',
    category: 'التصاميم التنفيذية',
    excerpt: 'دور المخططات التفصيلية في تقليل أوامر التغيير وتسريع وتيرة التنفيذ في الموقع.',
    content: `المخططات التنفيذية (Shop Drawings) هي الجسر بين التصميم والتنفيذ، وهي الأداة الأساسية التي يترجم بها المهندس المعماري والإنشائي رؤيته إلى واقع ملموس في الموقع.

## ما هي المخططات التنفيذية؟
مخططات تفصيلية بمقاييس كبيرة تظهر:
- تفاصيل الوصلات الإنشائية
- تفاصيل التشطيبات
- مسارات التمديدات (كهرباء، ميكانيكا، سباكة)
- جداول الكميات والمواصفات
- تفاصيل الواجهات والعناصر المعمارية

## فوائدها:
1. **تقليل أوامر التغيير**: اكتشاف التعارضات قبل الوصول للموقع
2. **تسريع التنفيذ**: الوضوح التام يقلل استفسارات المقاول
3. **ضبط التكاليف**: كميات دقيقة تقلل الهدر
4. **تنسيق التخصصات**: منع تعارض الكهرباء مع الإنشائي وغيرها
5. **توثيق مرجعي**: مرجع للصيانة المستقبلية

الاستثمار في مخططات تنفيذية متقنة يوفر أضعاف تكلفتها خلال مرحلة البناء.`,
    author: 'مكتب برج العرب للاستشارات الهندسية',
    image: '/images/articles/article-3.jpg',
    titleEn: 'How Do Shop Drawings Contribute to Project Success?',
    categoryEn: 'Shop Drawings',
    excerptEn: 'The role of detailed drawings in reducing change orders and accelerating the site execution pace.',
    contentEn: `Shop drawings are the bridge between design and execution — the primary tool with which the architect and structural engineer translate their vision into tangible reality on site.

## What are shop drawings?
Large-scale detailed drawings showing:
- Structural connection details
- Finishing details
- Services routes (electrical, mechanical, plumbing)
- Quantity schedules and specifications
- Facade and architectural element details

## Benefits:
1. **Fewer change orders**: conflicts are discovered before reaching the site
2. **Faster execution**: complete clarity reduces contractor queries
3. **Cost control**: accurate quantities reduce waste
4. **Discipline coordination**: prevents clashes between electrical and structural works
5. **Reference documentation**: a reference for future maintenance

Investing in accurate shop drawings saves many times their cost during the construction phase.`,
    authorEn: 'Burj Al Arab Engineering Consultancy Office',
    isPublished: true
  },
  {
    title: 'إدارة التكاليف ودورها في المشاريع الهندسية',
    category: 'إدارة التكاليف',
    excerpt: 'استراتيجيات فعالة لضبط الميزانية وتجنب تجاوز التكاليف دون التأثير على الجودة.',
    content: `إدارة التكاليف هي علم وفن تحقيق التوازن بين الجودة والتكلفة والوقت. في المشاريع الهندسية، تجاوز الميزانية هو أحد أبرز مخاطر فشل المشروع.

## استراتيجيات إدارة التكاليف الفعالة:

### 1. التقدير الدقيق من البداية
- دراسات جدوى مفصلة
- تحليل أسعار السوق الحالية
- احتياطيات طوارئ مدروسة (5-10%)

### 2. نظام رصد التكاليف
- تتبع المصاريف أسبوعياً
- مقارنة الفعلي بالمخطط
- إنذارات مبكرة عند الانحراف

### 3. إدارة القيمة المكتسبة (EVM)
مؤشرات أداء تربط التكلفة بالإنجاز الحقيقي، لا بالإنفاق فقط.

### 4. هندسة القيمة
مراجعة التصميم للبحث عن بدائل أقل تكلفة بنفس الأداء.

### 5. إدارة العقود والمقاولين
- عقود واضحة بآليات تسعير التغييرات
- تقييم أداء المقاولين دورياً

الإدارة الجيدة للتكاليف لا تعني التقليل من الجودة، بل يعني إنفاق كل ريال في مكانه الصحيح.`,
    author: 'مكتب برج العرب للاستشارات الهندسية',
    image: '/images/articles/article-4.jpg',
    titleEn: 'Cost Management and Its Role in Engineering Projects',
    categoryEn: 'Cost Management',
    excerptEn: 'Effective strategies to control the budget and avoid cost overruns without affecting quality.',
    contentEn: `Cost management is the science and art of achieving balance between quality, cost, and time. In engineering projects, budget overrun is one of the most prominent project failure risks.

## Effective cost management strategies:

### 1. Accurate estimating from the start
- Detailed feasibility studies
- Analysis of current market prices
- Well-studied contingency reserves (5-10%)

### 2. Cost monitoring system
- Weekly expense tracking
- Comparing actual vs planned
- Early warnings on deviation

### 3. Earned Value Management (EVM)
Performance indicators that link cost to actual achievement, not just spending.

### 4. Value engineering
Design reviews to find lower-cost alternatives with the same performance.

### 5. Contract and contractor management
- Clear contracts with change pricing mechanisms
- Periodic contractor performance evaluation

Good cost management does not mean lower quality; it means spending every riyal in the right place.`,
    authorEn: 'Burj Al Arab Engineering Consultancy Office',
    isPublished: true
  },
  {
    title: 'التصميم المعماري بين الجمال والوظيفة',
    category: 'التصميم المعماري',
    excerpt: 'كيف نحقق التوازن بين الجمالية المعمارية والوظيفية العملية في المشاريع السكنية والتجارية.',
    content: `التصميم المعماري الناجح هو الذي يحقق التوازن الدقيق بين الشكل والوظيفة. كما قال لويس سوليفان: "الشكل يتبع الوظيفة"، لكن الوظيفة وحدها لا تصنع عمارة عظيمة.

## مبادئ التوازن:

### 1. فهم الاحتياجات الحقيقية
- دراسة نمط حياة المستخدمين
- تحليل تدفق الحركة في الفراغات
- مراعاة المرونة المستقبلية

### 2. الهوية المعمارية
- استلهام البيئة المحلية والتراث
- مواد محلية بتقنيات حديثة
- لغة بصرية متماسكة

### 3. الأداء البيئي
- استغلال الإضاءة الطبيعية
- تهوية طبيعية فعالة
- عزل حراري وصوتي متميز

### 4. الاقتصاد في التنفيذ
- تبسيط التفاصيل المعقدة
- توحيد المقاسات والوحدات
- مواد متوفرة محلياً

النتيجة: مبانٍ جميلة، عملية، مستدامة، وقابلة للصيانة.`,
    author: 'مكتب برج العرب للاستشارات الهندسية',
    image: '/images/articles/article-5.jpg',
    titleEn: 'Architectural Design Between Beauty and Function',
    categoryEn: 'Architectural Design',
    excerptEn: 'How to achieve balance between architectural aesthetics and practical functionality in residential and commercial projects.',
    contentEn: `Successful architectural design achieves a precise balance between form and function. As Louis Sullivan said: "Form follows function" — yet function alone does not make great architecture.

## Principles of balance:

### 1. Understanding real needs
- Studying users' lifestyles
- Analyzing movement flow within spaces
- Considering future flexibility

### 2. Architectural identity
- Deriving inspiration from local environment and heritage
- Local materials with modern techniques
- Coherent visual language

### 3. Environmental performance
- Exploiting natural lighting
- Effective natural ventilation
- Excellent thermal and acoustic insulation

### 4. Economy in execution
- Simplifying complex details
- Standardizing dimensions and units
- Locally available materials

The result: beautiful, functional, sustainable, and maintainable buildings.`,
    authorEn: 'Burj Al Arab Engineering Consultancy Office',
    isPublished: true
  },
  {
    title: 'مراحل تطوير المشروع الهندسي',
    category: 'مراحل المشروع',
    excerpt: 'عرض تفصيلي للمراحل الخمس الأساسية التي يمر بها أي مشروع هندسي ناجح من البداية للنهاية.',
    content: `كل مشروع هندسي ناجح يمر بمراحل محددة، وتجاهل أي مرحلة يؤدي لمشاكل لاحقة. إليك المراحل الخمس الأساسية:

## المرحلة 1: ما قبل التصميم (Pre-Design)
- دراسة الاحتياجات والأهداف
- دراسة الموقع والظروف المحيطة
- دراسة الجدوى الأولية
- تحديد الميزانية والجدول الزمني

## المرحلة 2: التصميم (Design)
- **التصميم المفهومي**: أفكار أولية ورسومات تقريبية
- **التصميم المطور**: تطوير الفكرة المختارة بتفاصيل أكثر
- **التصميم التنفيذي**: مخططات تفصيلية للتنفيذ
- **مراجعة واعتماد**: من الجهات المختصة والفريق

## المرحلة 3: ما قبل التنفيذ (Pre-Construction)
- طرح المناقصات واختيار المقاول
- توقيع العقود
- الحصول على التراخيص
- تجهيز الموقع

## المرحلة 4: التنفيذ (Construction)
- أعمال الحفر والتأسيس
- الهيكل الإنشائي
- أعمال الميكانيكا والكهرباء والسباكة
- التشطيبات الداخلية والخارجية
- الإشراف المستمر والجودة

## المرحلة 5: التسليم وما بعد (Post-Construction)
- الفحص النهائي والاستلام
- فترة الصيانة والضمان (عادة سنة)
- دليل التشغيل والصيانة
- تقييم أداء المشروع

كل مرحلة تبني على سابقتها، والتقصير في مرحلة يكلف أضعافاً في المراحل اللاحقة.`,
    author: 'مكتب برج العرب للاستشارات الهندسية',
    image: '/images/articles/article-6.jpg',
    titleEn: 'Stages of Developing an Engineering Project',
    categoryEn: 'Project Phases',
    excerptEn: 'A detailed overview of the five essential stages any successful engineering project passes through from start to finish.',
    contentEn: `Every successful engineering project passes through defined stages, and ignoring any stage leads to later problems. Here are the five essential stages:

## Stage 1: Pre-Design
- Needs and goals study
- Site and surrounding conditions study
- Preliminary feasibility study
- Defining budget and time schedule

## Stage 2: Design
- **Conceptual design**: initial ideas and sketches
- **Developed design**: developing the chosen idea with more detail
- **Shop drawings**: detailed execution drawings
- **Review and approval**: by authorities and the team

## Stage 3: Pre-Construction
- Tendering and contractor selection
- Signing contracts
- Obtaining permits
- Site preparation

## Stage 4: Construction
- Excavation and foundations
- Structural frame
- MEP works
- Interior and exterior finishes
- Continuous supervision and quality

## Stage 5: Handover and Beyond
- Final inspection and acceptance
- Maintenance and warranty period (usually one year)
- Operation and maintenance manual
- Project performance evaluation

Each stage builds on the previous one, and failure at any stage costs many times more in later ones.`,
    authorEn: 'Burj Al Arab Engineering Consultancy Office',
    isPublished: true
  }
]

const sampleTeam = [
  {
    name: 'المهندس الاستشاري الأول',
    nameEn: 'Lead Consultant Engineer',
    role: 'التصميم المعماري',
    roleEn: 'Architectural Design',
    bio: 'خبرة واسعة في إدارة المشاريع الكبرى وتطوير الحلول المعمارية المتكاملة.',
    bioEn: 'Extensive experience in managing major projects and developing integrated architectural solutions.',
    email: '',
    phone: '',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'المهندس الاستشاري الثاني',
    nameEn: 'Senior Structural Consultant',
    role: 'التصميم الإنشائي',
    roleEn: 'Structural Design',
    bio: 'متخصص في التصاميم الإنشائية والتحقق من كفاءة وسلامة المنشآت عالية الارتفاع.',
    bioEn: 'Specialized in structural designs and verifying the efficiency and safety of high-rise structures.',
    email: '',
    phone: '',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'المهندس الاستشاري الثالث',
    nameEn: 'Senior Supervision Engineer',
    role: 'الإشراف على التنفيذ',
    roleEn: 'Execution Supervision',
    bio: 'خبرة ميدانية في الإشراف على المشاريع السكنية والتجارية وضمان مطابقة التنفيذ للمخططات.',
    bioEn: 'Field experience in supervising residential and commercial projects and ensuring execution matches drawings.',
    email: '',
    phone: '',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'المهندس الاستشاري الرابع',
    nameEn: 'Project Management Consultant',
    role: 'إدارة المشاريع والتكاليف',
    roleEn: 'Project & Cost Management',
    bio: 'متخصص في التخطيط الزمني وإدارة التكاليف ودراسات الجدوى للمشاريع الهندسية.',
    bioEn: 'Specialized in time planning, cost management, and feasibility studies for engineering projects.',
    email: '',
    phone: '',
    sortOrder: 4,
    isActive: true
  }
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    await seedAdmin()
    await seedProjects()
    await seedArticles()
    await seedTeam()

    console.log('Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding:', error)
    process.exit(1)
  }
}

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const existingAdmin = await User.findOne({ email: adminEmail })

  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      isActive: true
    })
    console.log('Admin user created')
  } else {
    console.log('Admin user already exists')
  }
}

const seedProjects = async () => {
  for (const projectData of sampleProjects) {
    const existing = await Project.findOne({ title: projectData.title })
    if (!existing) {
      const slug = await generateUniqueSlug(Project, projectData.title)
      await Project.create({ ...projectData, slug })
      console.log(`Project created: ${projectData.title}`)
    } else {
      console.log(`Project already exists: ${projectData.title}`)
    }
  }
}

const seedArticles = async () => {
  for (const articleData of sampleArticles) {
    const existing = await Article.findOne({ title: articleData.title })
    if (!existing) {
      const slug = await generateUniqueSlug(Article, articleData.title)
      await Article.create({ ...articleData, slug })
      console.log(`Article created: ${articleData.title}`)
    } else {
      console.log(`Article already exists: ${articleData.title}`)
    }
  }
}

const seedTeam = async () => {
  for (const memberData of sampleTeam) {
    const existing = await TeamMember.findOne({ name: memberData.name })
    if (!existing) {
      await TeamMember.create(memberData)
      console.log(`Team member created: ${memberData.name}`)
    } else {
      console.log(`Team member already exists: ${memberData.name}`)
    }
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  seed()
}

export { sampleProjects, sampleArticles, sampleTeam }