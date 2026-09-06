export type DummyStatus =
  | "ACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "PUBLISHED"
  | "DRAFT"
  | "DELIVERED"
  | "QUEUED"
  | "FAILED"
  | "IN_STOCK"
  | "LOW"
  | "OUT_OF_STOCK"
  | "LIVE";

export type DummyUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "FARMER" | "AGRONOMIST" | "AGRO_BUSINESS";
  status: DummyStatus;
  lastLoginAt: string | null;
};

export type DummyFarmer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  district: string;
  province: string;
  farmingType: string;
  status: DummyStatus;
  farms: number;
  joinedAt: string;
};

export type DummyAgronomist = {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  specialty: string;
  farmersSupported: number;
  status: DummyStatus;
};

export type DummyBusiness = {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  province: string;
  skuCount: number;
  catchmentFarmers: number;
  status: DummyStatus;
};

export type DummyFarm = {
  id: string;
  name: string;
  farmerId: string;
  farmerName: string;
  district: string;
  hectares: number;
  crop: string;
  health: number;
  status: DummyStatus;
};

export type DummyCrop = {
  id: string;
  name: string;
  season: string;
  farmers: number;
  hectares: number;
  topIssue: string;
};

export type DummyDiagnosis = {
  id: string;
  farmerName: string;
  farmId: string;
  farmName: string;
  crop: string;
  problem: string;
  kind: "PEST" | "DISEASE" | "DEFICIENCY" | "OTHER";
  confidence: number;
  district: string;
  createdAt: string;
  status: DummyStatus;
};

export type DummyInput = {
  id: string;
  name: string;
  kind: string;
  treats: string;
  stockedAt: number;
  status: DummyStatus;
};

export type DummyLesson = {
  id: string;
  title: string;
  crop: string;
  minutes: number;
  completions: number;
  status: DummyStatus;
};

export type DummyThread = {
  id: string;
  farmerName: string;
  phone: string;
  lastMessage: string;
  unread: number;
  updatedAt: string;
  channel: "WhatsApp";
};

export type DummyNotice = {
  id: string;
  title: string;
  audience: string;
  channel: "Push" | "WhatsApp" | "SMS";
  sentAt: string | null;
  status: DummyStatus;
};

export type DummyAudit = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
};

export const dummyUsers: DummyUser[] = [
  {
    id: "usr_admin",
    name: "FarmIt Admin",
    email: "admin@farmit.co.zw",
    phone: "+263700000000",
    role: "ADMIN",
    status: "ACTIVE",
    lastLoginAt: "2026-09-01T07:12:00Z",
  },
  {
    id: "usr_01",
    name: "Tendai Moyo",
    email: "tendai.moyo@gmail.com",
    phone: "+263771204418",
    role: "FARMER",
    status: "ACTIVE",
    lastLoginAt: "2026-08-31T16:40:00Z",
  },
  {
    id: "usr_02",
    name: "Chipo Ncube",
    email: "chipo.ncube@yahoo.com",
    phone: "+263773881902",
    role: "FARMER",
    status: "ACTIVE",
    lastLoginAt: "2026-08-30T09:11:00Z",
  },
  {
    id: "usr_03",
    name: "Rudo Mpofu",
    email: "rudo.mpofu@farmit.co.zw",
    phone: "+263772441108",
    role: "AGRONOMIST",
    status: "ACTIVE",
    lastLoginAt: "2026-09-01T06:04:00Z",
  },
  {
    id: "usr_04",
    name: "Farm & City Mutare",
    email: "mutare@farmandcity.co.zw",
    phone: "+26320260661",
    role: "AGRO_BUSINESS",
    status: "ACTIVE",
    lastLoginAt: "2026-08-29T14:22:00Z",
  },
  {
    id: "usr_05",
    name: "Farai Dube",
    email: "",
    phone: "+263774019330",
    role: "FARMER",
    status: "PENDING",
    lastLoginAt: null,
  },
  {
    id: "usr_06",
    name: "Tinashe Sibanda",
    email: "tinashe.s@gmail.com",
    phone: "+263775602118",
    role: "FARMER",
    status: "SUSPENDED",
    lastLoginAt: "2026-07-12T11:00:00Z",
  },
  {
    id: "usr_07",
    name: "Nyasha Chikwanda",
    email: "nyasha.c@agrifocus.co.zw",
    phone: "+263773220145",
    role: "AGRONOMIST",
    status: "ACTIVE",
    lastLoginAt: "2026-08-31T18:09:00Z",
  },
];

export const dummyFarmers: DummyFarmer[] = [
  {
    id: "far_01",
    name: "Tendai Moyo",
    phone: "+263771204418",
    email: "tendai.moyo@gmail.com",
    district: "Mazowe",
    province: "Mashonaland Central",
    farmingType: "Maize · tobacco",
    status: "ACTIVE",
    farms: 2,
    joinedAt: "2026-04-12T08:00:00Z",
  },
  {
    id: "far_02",
    name: "Chipo Ncube",
    phone: "+263773881902",
    email: "chipo.ncube@yahoo.com",
    district: "Marondera",
    province: "Mashonaland East",
    farmingType: "Horticulture",
    status: "ACTIVE",
    farms: 1,
    joinedAt: "2026-05-03T10:20:00Z",
  },
  {
    id: "far_03",
    name: "Blessing Nyoni",
    phone: "+263772908441",
    email: null,
    district: "Chipinge",
    province: "Manicaland",
    farmingType: "Coffee · banana",
    status: "ACTIVE",
    farms: 3,
    joinedAt: "2026-03-18T07:45:00Z",
  },
  {
    id: "far_04",
    name: "Memory Chigumira",
    phone: "+263774551209",
    email: "memory.c@gmail.com",
    district: "Chiredzi",
    province: "Masvingo",
    farmingType: "Sugarcane",
    status: "ACTIVE",
    farms: 1,
    joinedAt: "2026-06-01T12:00:00Z",
  },
  {
    id: "far_05",
    name: "Tafadzwa Banda",
    phone: "+263771883004",
    email: null,
    district: "Kwekwe",
    province: "Midlands",
    farmingType: "Cotton · maize",
    status: "PENDING",
    farms: 1,
    joinedAt: "2026-08-22T15:10:00Z",
  },
  {
    id: "far_06",
    name: "Tatenda Gumbo",
    phone: "+263775019882",
    email: "tatenda.g@outlook.com",
    district: "Hwange",
    province: "Matabeleland North",
    farmingType: "Cattle · maize",
    status: "ACTIVE",
    farms: 2,
    joinedAt: "2026-02-09T09:30:00Z",
  },
  {
    id: "far_07",
    name: "Farai Dube",
    phone: "+263774019330",
    email: null,
    district: "Chegutu",
    province: "Mashonaland West",
    farmingType: "Maize",
    status: "PENDING",
    farms: 1,
    joinedAt: "2026-08-28T11:05:00Z",
  },
  {
    id: "far_08",
    name: "Precious Ndlovu",
    phone: "+263773440918",
    email: "precious.n@gmail.com",
    district: "Bulawayo",
    province: "Bulawayo",
    farmingType: "Poultry · veg",
    status: "ACTIVE",
    farms: 1,
    joinedAt: "2026-01-20T08:15:00Z",
  },
  {
    id: "far_09",
    name: "Simbarashe Mutasa",
    phone: "+263772110673",
    email: null,
    district: "Mutare",
    province: "Manicaland",
    farmingType: "Maize · beans",
    status: "SUSPENDED",
    farms: 1,
    joinedAt: "2025-11-04T14:00:00Z",
  },
  {
    id: "far_10",
    name: "Rutendo Makoni",
    phone: "+263771667220",
    email: "rutendo.m@gmail.com",
    district: "Murewa",
    province: "Mashonaland East",
    farmingType: "Tobacco",
    status: "ACTIVE",
    farms: 2,
    joinedAt: "2026-04-30T06:50:00Z",
  },
];

export const dummyAgronomists: DummyAgronomist[] = [
  {
    id: "agr_01",
    name: "Rudo Mpofu",
    phone: "+263772441108",
    email: "rudo.mpofu@farmit.co.zw",
    district: "Harare",
    specialty: "Maize pests",
    farmersSupported: 48,
    status: "ACTIVE",
  },
  {
    id: "agr_02",
    name: "Nyasha Chikwanda",
    phone: "+263773220145",
    email: "nyasha.c@agrifocus.co.zw",
    district: "Mutare",
    specialty: "Horticulture",
    farmersSupported: 31,
    status: "ACTIVE",
  },
  {
    id: "agr_03",
    name: "Kudakwashe Zhou",
    phone: "+263774882001",
    email: "kuda.zhou@farmit.co.zw",
    district: "Gweru",
    specialty: "Soil fertility",
    farmersSupported: 22,
    status: "ACTIVE",
  },
  {
    id: "agr_04",
    name: "Anita Moyo",
    phone: "+263771998334",
    email: "anita.moyo@farmit.co.zw",
    district: "Masvingo",
    specialty: "Sugarcane disease",
    farmersSupported: 19,
    status: "PENDING",
  },
  {
    id: "agr_05",
    name: "Brian Sibanda",
    phone: "+263775441009",
    email: "brian.s@seedco.co.zw",
    district: "Bindura",
    specialty: "Seed systems",
    farmersSupported: 27,
    status: "ACTIVE",
  },
];

export const dummyBusinesses: DummyBusiness[] = [
  {
    id: "biz_01",
    name: "Farm & City Mutare",
    phone: "+26320260661",
    email: "mutare@farmandcity.co.zw",
    district: "Mutare",
    province: "Manicaland",
    skuCount: 214,
    catchmentFarmers: 186,
    status: "ACTIVE",
  },
  {
    id: "biz_02",
    name: "Agricura Harare",
    phone: "+263242621761",
    email: "sales@agricura.co.zw",
    district: "Harare",
    province: "Harare",
    skuCount: 340,
    catchmentFarmers: 412,
    status: "ACTIVE",
  },
  {
    id: "biz_03",
    name: "Seed Co Bindura",
    phone: "+2632716372",
    email: "bindura@seedcogroup.com",
    district: "Bindura",
    province: "Mashonaland Central",
    skuCount: 88,
    catchmentFarmers: 97,
    status: "ACTIVE",
  },
  {
    id: "biz_04",
    name: "Windmill Gweru",
    phone: "+26354222401",
    email: "gweru@windmill.co.zw",
    district: "Gweru",
    province: "Midlands",
    skuCount: 126,
    catchmentFarmers: 143,
    status: "ACTIVE",
  },
  {
    id: "biz_05",
    name: "ZFC Masvingo",
    phone: "+26339262631",
    email: "masvingo@zfc.co.zw",
    district: "Masvingo",
    province: "Masvingo",
    skuCount: 97,
    catchmentFarmers: 78,
    status: "PENDING",
  },
  {
    id: "biz_06",
    name: "National Foods Bulawayo",
    phone: "+26329262601",
    email: "byo@natfoods.co.zw",
    district: "Bulawayo",
    province: "Bulawayo",
    skuCount: 64,
    catchmentFarmers: 55,
    status: "ACTIVE",
  },
];

export const dummyFarms: DummyFarm[] = [
  {
    id: "farm_01",
    name: "Mazowe North Block",
    farmerId: "far_01",
    farmerName: "Tendai Moyo",
    district: "Mazowe",
    hectares: 12.4,
    crop: "Maize",
    health: 82,
    status: "ACTIVE",
  },
  {
    id: "farm_02",
    name: "Concession Tobacco",
    farmerId: "far_01",
    farmerName: "Tendai Moyo",
    district: "Mazowe",
    hectares: 3.1,
    crop: "Tobacco",
    health: 74,
    status: "ACTIVE",
  },
  {
    id: "farm_03",
    name: "Marondera Market Garden",
    farmerId: "far_02",
    farmerName: "Chipo Ncube",
    district: "Marondera",
    hectares: 1.8,
    crop: "Tomato",
    health: 61,
    status: "ACTIVE",
  },
  {
    id: "farm_04",
    name: "Chipinge Highlands A",
    farmerId: "far_03",
    farmerName: "Blessing Nyoni",
    district: "Chipinge",
    hectares: 6.0,
    crop: "Coffee",
    health: 88,
    status: "ACTIVE",
  },
  {
    id: "farm_05",
    name: "Hippo Valley Plot 14",
    farmerId: "far_04",
    farmerName: "Memory Chigumira",
    district: "Chiredzi",
    hectares: 18.0,
    crop: "Sugarcane",
    health: 79,
    status: "ACTIVE",
  },
  {
    id: "farm_06",
    name: "Redcliff Cotton",
    farmerId: "far_05",
    farmerName: "Tafadzwa Banda",
    district: "Kwekwe",
    hectares: 8.5,
    crop: "Cotton",
    health: 55,
    status: "PENDING",
  },
  {
    id: "farm_07",
    name: "Dete Grazing",
    farmerId: "far_06",
    farmerName: "Tatenda Gumbo",
    district: "Hwange",
    hectares: 40.0,
    crop: "Maize",
    health: 70,
    status: "ACTIVE",
  },
  {
    id: "farm_08",
    name: "Chegutu Communal 9",
    farmerId: "far_07",
    farmerName: "Farai Dube",
    district: "Chegutu",
    hectares: 2.2,
    crop: "Maize",
    health: 48,
    status: "PENDING",
  },
];

export const dummyCrops: DummyCrop[] = [
  { id: "crp_maize", name: "Maize", season: "Summer", farmers: 842, hectares: 6104, topIssue: "Fall armyworm" },
  { id: "crp_tobacco", name: "Tobacco", season: "Summer", farmers: 214, hectares: 980, topIssue: "Aphids" },
  { id: "crp_cotton", name: "Cotton", season: "Summer", farmers: 156, hectares: 1420, topIssue: "Bollworm" },
  { id: "crp_soy", name: "Soybean", season: "Summer", farmers: 98, hectares: 740, topIssue: "Rust" },
  { id: "crp_tomato", name: "Tomato", season: "Year-round", farmers: 187, hectares: 126, topIssue: "Late blight" },
  { id: "crp_potato", name: "Potato", season: "Winter", farmers: 64, hectares: 88, topIssue: "Late blight" },
  { id: "crp_cane", name: "Sugarcane", season: "Perennial", farmers: 41, hectares: 2200, topIssue: "Smut" },
  { id: "crp_coffee", name: "Coffee", season: "Perennial", farmers: 29, hectares: 310, topIssue: "Leaf rust" },
];

export const dummyDiagnoses: DummyDiagnosis[] = [
  {
    id: "dx_01",
    farmerName: "Tendai Moyo",
    farmId: "farm_01",
    farmName: "Mazowe North Block",
    crop: "Maize",
    problem: "Fall armyworm",
    kind: "PEST",
    confidence: 0.94,
    district: "Mazowe",
    createdAt: "2026-08-31T09:14:00Z",
    status: "LIVE",
  },
  {
    id: "dx_02",
    farmerName: "Chipo Ncube",
    farmId: "farm_03",
    farmName: "Marondera Market Garden",
    crop: "Tomato",
    problem: "Late blight",
    kind: "DISEASE",
    confidence: 0.88,
    district: "Marondera",
    createdAt: "2026-08-31T11:40:00Z",
    status: "LIVE",
  },
  {
    id: "dx_03",
    farmerName: "Rutendo Makoni",
    farmId: "farm_01",
    farmName: "Concession Tobacco",
    crop: "Tobacco",
    problem: "Aphids",
    kind: "PEST",
    confidence: 0.81,
    district: "Murewa",
    createdAt: "2026-08-30T15:02:00Z",
    status: "LIVE",
  },
  {
    id: "dx_04",
    farmerName: "Blessing Nyoni",
    farmId: "farm_04",
    farmName: "Chipinge Highlands A",
    crop: "Coffee",
    problem: "Leaf rust",
    kind: "DISEASE",
    confidence: 0.76,
    district: "Chipinge",
    createdAt: "2026-08-29T08:22:00Z",
    status: "LIVE",
  },
  {
    id: "dx_05",
    farmerName: "Memory Chigumira",
    farmId: "farm_05",
    farmName: "Hippo Valley Plot 14",
    crop: "Sugarcane",
    problem: "Nitrogen deficiency",
    kind: "DEFICIENCY",
    confidence: 0.69,
    district: "Chiredzi",
    createdAt: "2026-08-28T13:55:00Z",
    status: "LIVE",
  },
  {
    id: "dx_06",
    farmerName: "Precious Ndlovu",
    farmId: "farm_08",
    farmName: "Chegutu Communal 9",
    crop: "Maize",
    problem: "Maize streak virus",
    kind: "DISEASE",
    confidence: 0.91,
    district: "Bulawayo",
    createdAt: "2026-08-27T10:08:00Z",
    status: "LIVE",
  },
  {
    id: "dx_07",
    farmerName: "Tafadzwa Banda",
    farmId: "farm_06",
    farmName: "Redcliff Cotton",
    crop: "Cotton",
    problem: "Bollworm",
    kind: "PEST",
    confidence: 0.72,
    district: "Kwekwe",
    createdAt: "2026-08-26T16:30:00Z",
    status: "PENDING",
  },
  {
    id: "dx_08",
    farmerName: "Tatenda Gumbo",
    farmId: "farm_07",
    farmName: "Dete Grazing",
    crop: "Maize",
    problem: "Grey leaf spot",
    kind: "DISEASE",
    confidence: 0.64,
    district: "Hwange",
    createdAt: "2026-08-25T07:48:00Z",
    status: "LIVE",
  },
];

export const dummyInputs: DummyInput[] = [
  { id: "in_01", name: "Ampligo 150 ZC", kind: "Insecticide", treats: "Fall armyworm", stockedAt: 14, status: "IN_STOCK" },
  { id: "in_02", name: "Ridomil Gold", kind: "Fungicide", treats: "Late blight", stockedAt: 9, status: "IN_STOCK" },
  { id: "in_03", name: "Confidor 70 WG", kind: "Insecticide", treats: "Aphids", stockedAt: 6, status: "LOW" },
  { id: "in_04", name: "Compound D", kind: "Fertiliser", treats: "Basal nutrition", stockedAt: 22, status: "IN_STOCK" },
  { id: "in_05", name: "AN 34.5%", kind: "Fertiliser", treats: "Nitrogen deficiency", stockedAt: 18, status: "IN_STOCK" },
  { id: "in_06", name: "Copper oxychloride", kind: "Fungicide", treats: "Leaf rust", stockedAt: 4, status: "LOW" },
  { id: "in_07", name: "Karate Zeon", kind: "Insecticide", treats: "Bollworm", stockedAt: 0, status: "OUT_OF_STOCK" },
  { id: "in_08", name: "Seed Co SC 719", kind: "Seed", treats: "Maize hybrid", stockedAt: 11, status: "IN_STOCK" },
];

export const dummyLessons: DummyLesson[] = [
  { id: "ln_01", title: "Scouting maize for armyworm", crop: "Maize", minutes: 8, completions: 412, status: "PUBLISHED" },
  { id: "ln_02", title: "Safe mixing of insecticides", crop: "All", minutes: 12, completions: 288, status: "PUBLISHED" },
  { id: "ln_03", title: "Tomato blight in the Highveld", crop: "Tomato", minutes: 9, completions: 156, status: "PUBLISHED" },
  { id: "ln_04", title: "Reading a soil test", crop: "All", minutes: 14, completions: 94, status: "PUBLISHED" },
  { id: "ln_05", title: "Coffee rust calendar — Chipinge", crop: "Coffee", minutes: 11, completions: 0, status: "DRAFT" },
  { id: "ln_06", title: "WhatsApp photo tips for diagnosis", crop: "All", minutes: 4, completions: 501, status: "PUBLISHED" },
];

export const dummyThreads: DummyThread[] = [
  {
    id: "wa_01",
    farmerName: "Tendai Moyo",
    phone: "+263771204418",
    lastMessage: "Yellow patches on maize. Photo sent.",
    unread: 2,
    updatedAt: "2026-09-01T06:41:00Z",
    channel: "WhatsApp",
  },
  {
    id: "wa_02",
    farmerName: "Chipo Ncube",
    phone: "+263773881902",
    lastMessage: "Is Ridomil still in Mutare?",
    unread: 0,
    updatedAt: "2026-08-31T19:12:00Z",
    channel: "WhatsApp",
  },
  {
    id: "wa_03",
    farmerName: "Farai Dube",
    phone: "+263774019330",
    lastMessage: "Waiting-list: I farm in Chegutu.",
    unread: 1,
    updatedAt: "2026-08-31T11:05:00Z",
    channel: "WhatsApp",
  },
  {
    id: "wa_04",
    farmerName: "Blessing Nyoni",
    phone: "+263772908441",
    lastMessage: "Daily: rain expected Thursday.",
    unread: 0,
    updatedAt: "2026-08-30T05:02:00Z",
    channel: "WhatsApp",
  },
  {
    id: "wa_05",
    farmerName: "Memory Chigumira",
    phone: "+263774551209",
    lastMessage: "Need AN for plot 14.",
    unread: 0,
    updatedAt: "2026-08-29T14:33:00Z",
    channel: "WhatsApp",
  },
];

export const dummyNotices: DummyNotice[] = [
  {
    id: "nt_01",
    title: "Armyworm alert — Mashonaland",
    audience: "Maize farmers",
    channel: "WhatsApp",
    sentAt: "2026-08-31T06:00:00Z",
    status: "DELIVERED",
  },
  {
    id: "nt_02",
    title: "Daily: 12 mm rain, Mutare",
    audience: "Manicaland",
    channel: "Push",
    sentAt: "2026-09-01T05:00:00Z",
    status: "DELIVERED",
  },
  {
    id: "nt_03",
    title: "Waiting-list open for agronomists",
    audience: "Applicants",
    channel: "SMS",
    sentAt: "2026-08-20T08:00:00Z",
    status: "DELIVERED",
  },
  {
    id: "nt_04",
    title: "Late blight protocol — tomato",
    audience: "Horticulture",
    channel: "WhatsApp",
    sentAt: null,
    status: "DRAFT",
  },
  {
    id: "nt_05",
    title: "Stock-out: Karate Zeon Midlands",
    audience: "Agro businesses",
    channel: "Push",
    sentAt: null,
    status: "QUEUED",
  },
];

export const dummyAudit: DummyAudit[] = [
  { id: "au_01", actor: "admin@farmit.co.zw", action: "Approved waiting list", target: "Tendai Moyo", at: "2026-08-12T09:04:00Z" },
  { id: "au_02", actor: "admin@farmit.co.zw", action: "Rejected waiting list", target: "Simbarashe Mutasa", at: "2026-08-14T11:22:00Z" },
  { id: "au_03", actor: "rudo.mpofu@farmit.co.zw", action: "Published lesson", target: "Scouting maize for armyworm", at: "2026-08-18T15:40:00Z" },
  { id: "au_04", actor: "admin@farmit.co.zw", action: "Updated system config", target: "otp.ttl_minutes", at: "2026-08-21T08:11:00Z" },
  { id: "au_05", actor: "system", action: "WhatsApp webhook verified", target: "Meta hub.challenge", at: "2026-08-22T04:01:00Z" },
  { id: "au_06", actor: "admin@farmit.co.zw", action: "Suspended user", target: "Tinashe Sibanda", at: "2026-07-12T11:08:00Z" },
  { id: "au_07", actor: "nyasha.c@agrifocus.co.zw", action: "Confirmed diagnosis", target: "Late blight · Marondera", at: "2026-08-31T12:01:00Z" },
  { id: "au_08", actor: "admin@farmit.co.zw", action: "Password reset requested", target: "admin@farmit.co.zw", at: "2026-09-01T07:55:00Z" },
];

export const dummyHeatProvinces = [
  { name: "Mashonaland East", diagnoses: 84, demand: 71, intensity: 0.92 },
  { name: "Mashonaland Central", diagnoses: 67, demand: 58, intensity: 0.78 },
  { name: "Manicaland", diagnoses: 61, demand: 80, intensity: 0.74 },
  { name: "Midlands", diagnoses: 44, demand: 39, intensity: 0.52 },
  { name: "Masvingo", diagnoses: 38, demand: 41, intensity: 0.46 },
  { name: "Mashonaland West", diagnoses: 29, demand: 22, intensity: 0.34 },
  { name: "Harare", diagnoses: 18, demand: 33, intensity: 0.22 },
  { name: "Matabeleland North", diagnoses: 12, demand: 9, intensity: 0.14 },
];

export const dummyHeatDistricts = [
  { district: "Marondera", crop: "Tomato", issue: "Late blight", count: 31 },
  { district: "Mazowe", crop: "Maize", issue: "Fall armyworm", count: 28 },
  { district: "Mutare", crop: "Maize", issue: "Grey leaf spot", count: 22 },
  { district: "Chipinge", crop: "Coffee", issue: "Leaf rust", count: 19 },
  { district: "Chiredzi", crop: "Sugarcane", issue: "Nitrogen deficiency", count: 14 },
  { district: "Kwekwe", crop: "Cotton", issue: "Bollworm", count: 11 },
];

export const dummyInsights = [
  { id: "ins_01", title: "Fall armyworm is clustering in Mazowe and Bindura", kind: "Pest", window: "14 days", action: "Alert maize farmers" },
  { id: "ins_02", title: "Ridomil demand outrunning Mutare stock", kind: "Input", window: "7 days", action: "Notify Farm & City" },
  { id: "ins_03", title: "Tomato blight intensity up 40% vs last month", kind: "Disease", window: "30 days", action: "Publish protocol" },
  { id: "ins_04", title: "Agricura Harare catchment: 48 untreated diagnoses", kind: "Catchment", window: "7 days", action: "Share heat map" },
];

export const dummySettings = [
  { group: "Auth", key: "otp.ttl_minutes", value: "5", description: "Phone OTP lifetime" },
  { group: "Auth", key: "jwt.access_minutes", value: "15", description: "Access token lifetime" },
  { group: "Waitlist", key: "waiting_list.open", value: "true", description: "Public join enabled" },
  { group: "Waitlist", key: "waiting_list.cohort", value: "Zimbabwe · first", description: "Active cohort label" },
  { group: "WhatsApp", key: "whatsapp.verify_token", value: "••••••••••zw", description: "Meta hub.verify token" },
  { group: "WhatsApp", key: "whatsapp.replies", value: "stub", description: "Inbound POST is no-op" },
  { group: "AI", key: "diagnosis.model", value: "farmit-vision-preview", description: "Not wired to FastAPI yet" },
  { group: "Region", key: "default_country", value: "ZW", description: "ISO country for phones" },
];

export const platformStats = {
  activeFarmers: 1284,
  agroBusinesses: 46,
  diagnosesThisWeek: 118,
  whatsappOpen: 37,
  farmsMapped: 910,
  avgHealth: 74,
};

export function getFarmer(id: string) {
  return dummyFarmers.find((row) => row.id === id);
}

export function getBusiness(id: string) {
  return dummyBusinesses.find((row) => row.id === id);
}

export function getFarm(id: string) {
  return dummyFarms.find((row) => row.id === id);
}

export function farmsForFarmer(farmerId: string) {
  return dummyFarms.filter((row) => row.farmerId === farmerId);
}

export function diagnosesForFarm(farmId: string) {
  return dummyDiagnoses.filter((row) => row.farmId === farmId);
}

export function diagnosesForFarmerName(name: string) {
  return dummyDiagnoses.filter((row) => row.farmerName === name);
}
