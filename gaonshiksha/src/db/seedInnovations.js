export const initialInnovations = [
  {
    id: 'innov-1',
    studentId: 'student@invictus.edu',
    studentName: 'Vikas Tambade',
    studentCity: 'Kopargaon, Ahmednagar',
    studentGrade: '10th Standard',
    studentEmail: 'student@invictus.edu',
    title: {
      en: 'Solar-Powered Automated Drip Irrigation & Soil Nutrient Monitor',
      hi: 'सौर-संचालित स्वचालित ड्रिप सिंचाई एवं मृदा पोषक तत्व मॉनिटर',
      mr: 'सौर ऊर्जेवर चालणारी स्वयंचलित ठिबक सिंचन व माती पोषण परीक्षण प्रणाली'
    },
    domain: 'agritech',
    domainLabel: {
      en: 'Agritech & Rural Tech',
      hi: 'कृषि प्रौद्योगिकी',
      mr: 'कृषी व ग्रामीण तंत्रज्ञान'
    },
    stage: 'working_prototype',
    stageLabel: {
      en: 'Working Prototype (Field Tested)',
      hi: 'कार्यशील प्रोटोटाइप',
      mr: 'कार्यरत प्रोटोटाइप (शेत चाचणी यशस्वी)'
    },
    abstract: {
      en: 'A low-cost solar IoT microcontroller device deployed on sugarcane farms in Kopargaon that measures NPK moisture levels and opens solenoids automatically, saving 45% water.',
      hi: 'कोपरगाव के गन्ने के खेतों में परीक्षण किया गया कम लागत वाला सोलर IoT उपकरण, जो NPK नमी स्तर को मापकर 45% पानी बचाता है।',
      mr: 'कोपरगाव परिसरातील ऊस शेतासाठी डिझाइन केलेले सौर IoT उपकरण, जे मातीतील ओलावा व NPK मोजून स्वयंचलित पाणी पुरवठा करते व ४५% पाणी वाचवते.'
    },
    technicalSpecs: {
      hardware: 'ESP32 Microcontroller, Capacitive Soil Moisture Sensors, 12V Solar Panel 20W, NPK Optical Sensor Probe, Relay Modules',
      software: 'Arduino C++, MicroPython, MQTT Protocol, Offline BLE Mobile Dashboard',
      methodology: 'Closed-loop feedback algorithm triggering drip valve solenoids only when soil moisture drops below 35% capacity during non-peak evaporation hours.'
    },
    fundingNeeded: 25000,
    media: {
      githubUrl: 'https://github.com/invictus-innovations/solar-agri-drip',
      demoUrl: 'https://youtu.be/demo-agritech-solar',
      hasSchematic: true
    },
    featured: true,
    viewsCount: 142,
    offersCount: 2,
    createdAt: '2026-08-20T10:30:00.000Z'
  },
  {
    id: 'innov-2',
    studentId: 'priya.shinde@invictus.edu',
    studentName: 'Priya Shinde',
    studentCity: 'Sangamner, Nashik',
    studentGrade: '10th Standard',
    studentEmail: 'priya.shinde@invictus.edu',
    title: {
      en: 'Smart IoT Grain Silo Moisture & Pest Early Warning System',
      hi: 'स्मार्ट IoT अनाज गोदाम नमी एवं कीट पूर्व-चेतावनी प्रणाली',
      mr: 'स्मार्ट IoT धान्य कोठार ओलावा व कीड प्रतिबंधक पूर्वसूचना यंत्रणा'
    },
    domain: 'iot_embedded',
    domainLabel: {
      en: 'IoT & Embedded Systems',
      hi: 'IoT एवं एम्बेडेड सिस्टम',
      mr: 'IoT आणि एम्बेडेड प्रणाली'
    },
    stage: 'working_prototype',
    stageLabel: {
      en: 'Working Prototype',
      hi: 'कार्यशील प्रोटोटाइप',
      mr: 'कार्यरत प्रोटोटाइप'
    },
    abstract: {
      en: 'Battery-operated thermal and acoustic sensors placed inside rural grain storage bins to detect temperature spikes and insect micro-movements before post-harvest spoilage occurs.',
      hi: 'अनाज भंडारण के अंदर लगाए जाने वाले सेंसर जो तापमान वृद्धि और कीटों की हलचल को पहचानकर फसल बर्बादी रोकते हैं।',
      mr: 'ग्रामीण धान्य कोठारांमध्ये साठवलेल्या धान्याचे नुकसान टाळण्यासाठी तापमान व कीटकांच्या हालचालींची त्वरित माहिती देणारे स्वस्त सेन्सर यंत्र.'
    },
    technicalSpecs: {
      hardware: 'Raspberry Pi Pico W, Ultrasonic Pest Radar Sensor, DHT22 Temperature-Humidity Probes, LoRaWAN SX1276 Node',
      software: 'C++, CircuitPython, LoRaWAN Gateway mesh, Web Audio Processing',
      methodology: 'Acoustic frequency filtering (15kHz–22kHz) isolating insect burrowing vibrations and alerting farmers via SMS beacon without internet.'
    },
    fundingNeeded: 18000,
    media: {
      githubUrl: 'https://github.com/invictus-innovations/grain-silo-iot',
      demoUrl: 'https://drive.google.com/demo-grain-silo',
      hasSchematic: true
    },
    featured: true,
    viewsCount: 98,
    offersCount: 1,
    createdAt: '2026-08-22T14:15:00.000Z'
  },
  {
    id: 'innov-3',
    studentId: 'rahul.deshmukh@invictus.edu',
    studentName: 'Rahul Deshmukh',
    studentCity: 'Satara',
    studentGrade: '10th Standard',
    studentEmail: 'rahul.deshmukh@invictus.edu',
    title: {
      en: 'AI Offline Crop Disease Scanner for Rural Farmers in Marathi',
      hi: 'ग्रामीण किसानों के लिए ऑफलाइन AI फसल रोग निदान ऐप (मराठी/हिंदी)',
      mr: 'ग्रामीण शेतकऱ्यांसाठी ऑफलाइन चालणारे AI पीक रोग निदान मोबाइल ॲप'
    },
    domain: 'ai_ml',
    domainLabel: {
      en: 'AI / Machine Learning',
      hi: 'कृत्रिम बुद्धिमत्ता (AI/ML)',
      mr: 'कृत्रिम बुद्धिमत्ता (AI/ML)'
    },
    stage: 'deployed',
    stageLabel: {
      en: 'Deployed / Pilot Testing',
      hi: 'तैनात / पायलट परीक्षण',
      mr: 'वापरात / प्रत्यक्ष चाचणी सुरू'
    },
    abstract: {
      en: 'Edge-AI neural network running entirely offline on basic Android phones that identifies 18 leaf diseases in soybean, cotton, and sugarcane using camera snapshots in Marathi voice.',
      hi: 'सामान्य एंड्रॉइड फोन पर पूरी तरह से ऑफलाइन चलने वाला AI मॉडल जो सोयाबीन, कपास और गन्ने के पत्तों के 18 रोगों की सटीक पहचान करता है।',
      mr: 'इंटरनेट नसतानाही मोबाईल कॅमेऱ्याद्वारे सोयाबीन, कापूस व ऊसावरील १८ प्रकारच्या रोगांची तत्काळ अचूक ओळख करून मराठीत औषधोपचार सांगणारे AI ॲप.'
    },
    technicalSpecs: {
      hardware: 'Mobile Edge Accelerator / Neural Processing Unit compatible (Snapdragon/MediaTek)',
      software: 'TensorFlow Lite Int8 Quantized MobileNetV3, Flutter/React Native, SQLite Offline DB, Android Text-to-Speech Engine',
      methodology: 'Model compressed from 45MB to 3.8MB for sub-100ms inference on budget smartphones without requiring 4G/5G data connectivity.'
    },
    fundingNeeded: 50000,
    media: {
      githubUrl: 'https://github.com/invictus-innovations/offline-crop-ai',
      demoUrl: 'https://youtu.be/demo-crop-ai-scanner',
      hasSchematic: false
    },
    featured: true,
    viewsCount: 260,
    offersCount: 3,
    createdAt: '2026-08-25T09:00:00.000Z'
  },
  {
    id: 'innov-4',
    studentId: 'anita.kamble@invictus.edu',
    studentName: 'Anita Kamble',
    studentCity: 'Kolhapur',
    studentGrade: '10th Standard',
    studentEmail: 'anita.kamble@invictus.edu',
    title: {
      en: 'Piezoelectric Kinetic Floor Tiles for Public High-Footfall Areas',
      hi: 'सार्वजनिक स्थानों हेतु पीजोइलेक्ट्रिक गतिज ऊर्जा टाइल प्रणाली',
      mr: 'रेल्वे व बसस्थानकांसाठी पाऊल-ऊर्जेवर वीजनिर्मिती करणारी पायजोइलेक्ट्रिक टाइल'
    },
    domain: 'renewable_energy',
    domainLabel: {
      en: 'Renewable Energy & Cleantech',
      hi: 'अक्षय ऊर्जा एवं स्वच्छ तकनीक',
      mr: 'अक्षय ऊर्जा व पर्यावरणपूरक तंत्रज्ञान'
    },
    stage: 'concept_prototype',
    stageLabel: {
      en: 'Functional Prototype',
      hi: 'कार्यात्मक प्रोटोटाइप',
      mr: 'प्रात्यक्षिक मॉडेल'
    },
    abstract: {
      en: 'Modular recycled rubber floor mats fitted with piezoelectric quartz crystals that generate 12V DC power from pedestrian footsteps to power LED emergency lighting.',
      hi: 'पैदल चलने वालों के कदमों से 12V बिजली उत्पन्न करने वाली पुनर्चक्रित रबर टाइल्स, जो आपातकालीन रोशनी जलाती हैं।',
      mr: 'पादचाऱ्यांच्या चालण्यातील दाब उर्जेचे विजेत रूपांतर करून आपत्कालीन दिवे व मोबाईल चार्जिंग स्टेशन चालवणारी पर्यावरणस्नेही प्रणाली.'
    },
    technicalSpecs: {
      hardware: 'PZT Piezoelectric Discs (27mm), Full Bridge Rectifier Circuits, Supercapacitor Bank 16V 10F, DC-DC Buck-Boost Converter',
      software: 'Energy harvesting modeling in MATLAB/Simulink, Circuit simulation on EasyEDA',
      methodology: 'Mechanical spring damping array distributing foot pressure evenly across 16 piezo elements in parallel-series matrix.'
    },
    fundingNeeded: 35000,
    media: {
      githubUrl: 'https://github.com/invictus-innovations/piezo-energy-floor',
      demoUrl: 'https://youtu.be/demo-piezo-floor',
      hasSchematic: true
    },
    featured: false,
    viewsCount: 84,
    offersCount: 1,
    createdAt: '2026-08-26T11:45:00.000Z'
  }
];

export const initialSponsoredBounties = [
  {
    id: 'bounty-1',
    companyName: 'Mahindra Agri Solutions Ltd.',
    companyLogo: '🏢',
    companyEmail: 'tech.partners@mahindra-agri.com',
    isVerified: true,
    title: {
      en: 'Low-Cost Optical Sugar-Brix Refractometer for Sugarcane Harvest',
      hi: 'गन्ना कटाई हेतु कम लागत वाला ऑप्टिकल शुगर-ब्रिक्स रिफ्रैक्टोमीटर',
      mr: 'ऊस तोडणीसाठी कमी खर्चाचे ऑप्टिकल शुगर-ब्रिक्स मोजणी उपकरण'
    },
    domain: 'agritech',
    bountyAmount: 75000,
    stipendOffer: '₹18,000 / month Internship',
    deadline: '2026-10-31',
    submissionsCount: 8,
    problemDescription: {
      en: 'Develop a portable, handheld optical spectrometer or digital refractometer costing under ₹1,500 that can accurately measure Brix % on standing sugarcane stalks without destructive extraction.',
      hi: 'एक ऐसा पोर्टेबल उपकरण विकसित करें जिसकी लागत ₹१,५०० से कम हो और जो खड़े गन्ने के तने से बिना नुकसान पहुँचाए शुगर ब्रिक्स माप सके।',
      mr: 'उभा ऊस न तोडता जागेवरच रसातील साखरेचे प्रमाण (Brix %) मोजणारे ₹१,५०० च्या आतील पोर्टेबल डिजिटल उपकरण विकसित करण्याचे आव्हान.'
    },
    deliverables: 'Working hardware schematic, CAD 3D enclosure files, bill of materials (BOM), and field validation report.'
  },
  {
    id: 'bounty-2',
    companyName: 'Tata Power Renewable Energy',
    companyLogo: '⚡',
    companyEmail: 'innovate@tatapowerrenewables.com',
    isVerified: true,
    title: {
      en: 'Automated Dust & Soot Detection for Solar Panels in Rural Maharashtra',
      hi: 'ग्रामीण सौर पैनलों हेतु स्वचालित धूल एवं कालिमा संसूचन प्रणाली',
      mr: 'ग्रामीण सौर प्रकल्पांवरील धूळ व घाण ओळखणारी स्वयंचलित सेन्सिंग प्रणाली'
    },
    domain: 'renewable_energy',
    bountyAmount: 100000,
    stipendOffer: '₹22,000 / month Internship + Patent Sponsorship',
    deadline: '2026-11-15',
    submissionsCount: 12,
    problemDescription: {
      en: 'Design a camera or infrared-based sensor system that determines solar panel efficiency degradation due to agricultural dust and activates microfiber wipe mechanisms.',
      hi: 'सौर पैनल पर धूल के कारण होने वाले बिजली नुकसान का पता लगाने और स्वचालित सफाई शुरू करने वाली प्रणाली डिजाइन करें।',
      mr: 'शेतातील धुळीमुळे सौर पॅनेलची कार्यक्षमता किती कमी झाली हे अचूक ओळखून मायक्रोफायबर क्लीनिंग सुरू करणारी स्वयंचलित प्रणाली तयार करा.'
    },
    deliverables: 'Prototype demonstration, firmware repository, and micro-cleaning mechanical layout.'
  }
];

export const initialCollaborationOffers = [
  {
    id: 'offer-1',
    innovationId: 'innov-1',
    studentEmail: 'student@invictus.edu',
    studentName: 'Vikas Tambade',
    companyName: 'Jain Irrigation Systems Ltd.',
    recruiterName: 'Dr. Ramesh Kulkarni (Chief Innovation Officer)',
    recruiterEmail: 'r.kulkarni@jains.com',
    type: 'internship', // 'internship' | 'sponsorship' | 'mentorship'
    typeLabel: 'Summer R&D Internship + Pre-Placement Offer',
    stipend: 15000,
    sponsorshipBudget: 50000,
    duration: '3 Months (Hybrid)',
    status: 'pending', // 'pending' | 'accepted' | 'declined'
    platformFeeRate: 0.08, // 8% platform facilitation fee
    message: 'We were highly impressed with your closed-loop soil moisture sensor algorithm. We would like to offer a 3-month R&D internship in Jalgaon with access to our prototype manufacturing labs and ₹50,000 prototype component grant.',
    createdAt: '2026-08-28T16:00:00.000Z'
  },
  {
    id: 'offer-2',
    innovationId: 'innov-3',
    studentEmail: 'rahul.deshmukh@invictus.edu',
    studentName: 'Rahul Deshmukh',
    companyName: 'KisanVikas AgriTech Solutions',
    recruiterName: 'Ananya Deshpande (Head of AI)',
    recruiterEmail: 'ananya@kisanvikas.in',
    type: 'sponsorship',
    typeLabel: 'Prototype Sponsorship & Pilot Deployment',
    stipend: 0,
    sponsorshipBudget: 40000,
    duration: 'Direct Grant',
    status: 'accepted',
    platformFeeRate: 0.08,
    message: 'We would like to sponsor ₹40,000 for your offline MobileNet dataset expansion across 50 progressive farmer groups in Satara district.',
    createdAt: '2026-08-27T11:20:00.000Z'
  }
];

export const initialCompanies = [
  {
    email: 'recruiter@mahindra-agri.com',
    companyName: 'Mahindra Agri Solutions Ltd.',
    website: 'https://www.mahindraagri.com',
    gstin: '27AAACM1234F1Z8',
    cin: 'U01100MH2000PLC123456',
    industry: 'Agritech & Heavy Machinery',
    isVerified: true,
    hiringRoles: ['IoT Embedded Trainee', 'Agri-Robotics Intern', 'Firmware Engineer'],
    createdAt: '2026-07-15T00:00:00.000Z'
  },
  {
    email: 'r.kulkarni@jains.com',
    companyName: 'Jain Irrigation Systems Ltd.',
    website: 'https://www.jains.com',
    gstin: '27AAACJ4321E1Z2',
    cin: 'L29120MH1986PLC042028',
    industry: 'Irrigation & Precision Agriculture',
    isVerified: true,
    hiringRoles: ['Smart Sensor Trainee', 'Renewable Energy Researcher'],
    createdAt: '2026-07-20T00:00:00.000Z'
  }
];
