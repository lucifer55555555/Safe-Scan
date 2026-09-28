import { ScientificChunk, ScientificSource } from '../types';

export const SCIENTIFIC_SOURCES: ScientificSource[] = [
  {
    id: 'src_fda_falcpa',
    title: 'Food Allergen Labeling and Consumer Protection Act (FALCPA) Guidance',
    organization: 'FDA',
    url: 'https://www.fda.gov/food/food-allergensgluten-free-guidance-documents-regulatory-information/food-allergen-labeling-and-consumer-protection-act-2004-falcpa',
    sourceType: 'allergen_guidance',
    publicationDate: '2004-08-02',
    summary: 'Establishes federal requirements for labeling major food allergens (milk, eggs, peanuts, tree nuts, wheat, fish, crustacean shellfish, soy) and mandates clear declaration of derived ingredients.'
  },
  {
    id: 'src_fda_faster',
    title: 'Food Allergy Safety, Treatment, Education, and Research (FASTER) Act of 2021',
    organization: 'FDA',
    url: 'https://www.fda.gov/food/food-labeling-nutrition/faster-act',
    sourceType: 'regulation',
    publicationDate: '2021-04-23',
    summary: 'Declares sesame as the 9th major food allergen in the United States, mandating explicit labeling on all packaged food products starting January 1, 2023.'
  },
  {
    id: 'src_fda_cpg',
    title: 'FDA Compliance Policy Guide Sec. 555.250: Major Food Allergen Labeling and Cross-Contact',
    organization: 'FDA',
    url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-555250-major-food-allergen-labeling-and-cross-contact',
    sourceType: 'allergen_guidance',
    publicationDate: '2022-11-15',
    summary: 'FDA guidance outlining enforcement standards regarding unlabelled allergen presence, derivative proteins (e.g. casein, whey, soy lecithin), and allergen management.'
  },
  {
    id: 'src_efsa_reg1169',
    title: 'EFSA & European Commission Regulation (EU) No 1169/2011 Annex II (Substances Causing Allergies)',
    organization: 'EFSA',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32011R1169',
    sourceType: 'regulation',
    publicationDate: '2014-12-13',
    summary: 'European mandatory list of 14 substances or products causing allergies or intolerances, including cereals containing gluten, crustaceans, eggs, fish, peanuts, soybeans, milk, nuts, celery, mustard, sesame, sulphur dioxide, lupin, and molluscs.'
  },
  {
    id: 'src_efsa_openfoodtox',
    title: 'EFSA OpenFoodTox: Chemical Hazards Database & Dietary Exposure Thresholds',
    organization: 'EFSA',
    url: 'https://www.efsa.europa.eu/en/data-tools/openfoodtox',
    sourceType: 'hazard_assessment',
    publicationDate: '2023-05-10',
    summary: 'Toxicological summaries, Acceptable Daily Intake (ADI), and hazard benchmarks for food additives, colorants, emulsifiers, and preservatives in the European food chain.'
  },
  {
    id: 'src_efsa_e171',
    title: 'EFSA Scientific Opinion on the Safety Assessment of Titanium Dioxide (E171) as a Food Additive',
    organization: 'EFSA',
    url: 'https://www.efsa.europa.eu/en/efsajournal/pub/6585',
    sourceType: 'hazard_assessment',
    publicationDate: '2021-05-06',
    summary: 'Comprehensive scientific opinion concluding that titanium dioxide (E171) can no longer be considered safe when used as a food additive due to concerns regarding genotoxicity and particle accumulation.'
  },
  {
    id: 'src_fda_gras_additives',
    title: 'FDA Generally Recognized as Safe (GRAS) Additive Database & Guidance',
    organization: 'FDA',
    url: 'https://www.fda.gov/food/generally-recognized-safe-gras/gras-substances-scogs-database',
    sourceType: 'gras_notice',
    publicationDate: '2022-01-18',
    summary: 'Scientific evaluation of substances directly added to human food, establishing GRAS tolerances, safe conditions of use, and metabolic clearance.'
  },
  // --- FSSAI (INDIA) REGULATORY SOURCES ---
  {
    id: 'src_fssai_labelling_2020',
    title: 'FSSAI Food Safety and Standards (Labelling and Display) Regulations, 2020',
    organization: 'FSSAI',
    url: 'https://www.fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Labelling_Display_18_11_2020.pdf',
    sourceType: 'regulation',
    publicationDate: '2020-11-17',
    summary: 'Mandates compulsory allergen declarations on pre-packaged foods in India for 8 allergen groups, along with nutritional information per serve, date of minimum durability, and additive declarations.'
  },
  {
    id: 'src_fssai_veg_nonveg',
    title: 'FSSAI Declaration of Veg and Non-Veg Symbols & Dietary Classification Code',
    organization: 'FSSAI',
    url: 'https://www.fssai.gov.in/upload/advisories/2021/10/6169527f3aa41Letter_Veg_Non_Veg_Logo.pdf',
    sourceType: 'regulation',
    publicationDate: '2021-10-14',
    summary: 'Specifies the statutory Green Dot (in green square) for Vegetarian food and Brown Triangle (in brown square) for Non-Vegetarian food products containing animal body parts or non-dairy animal derivatives.'
  },
  {
    id: 'src_fssai_dairy_standards',
    title: 'FSSAI Food Products Standards Regulations: Milk and Milk Products (Ghee, Paneer, Khoya, Butter)',
    organization: 'FSSAI',
    url: 'https://www.fssai.gov.in/upload/uploadfiles/files/Milk_and_Milk_Products_Regulations.pdf',
    sourceType: 'regulation',
    publicationDate: '2020-08-01',
    summary: 'Defines compositional and purity standards for indigenous Indian dairy products including Desi Ghee, Paneer (cottage cheese), Khoya/Mawa, Dahi (curd), Chhena, and Butterfat.'
  },
  {
    id: 'src_fssai_spices_condiments',
    title: 'FSSAI Compounded Asafoetida (Hing) & Spices Quality Standards',
    organization: 'FSSAI',
    url: 'https://www.fssai.gov.in/upload/uploadfiles/files/Spices_Condiments_Standards.pdf',
    sourceType: 'regulation',
    publicationDate: '2019-12-05',
    summary: 'Regulates compounded asafoetida (bandhani hing) containing edible starch, maida/wheat flour, and gum arabic, requiring strict wheat/gluten declaration for consumer safety.'
  }
];

export const SCIENTIFIC_CHUNKS: ScientificChunk[] = [
  // --- FSSAI INDIA REGULATORY & TRADITIONAL FOOD CHUNKS ---
  {
    id: 'chunk_fssai_allergens_1',
    sourceId: 'src_fssai_labelling_2020',
    text: 'Under Chapter 2, Clause 5(3) of FSSAI Food Safety and Standards (Labelling and Display) Regulations 2020, food business operators in India must declare allergens: (i) Cereals containing gluten (wheat, rye, barley, oats, spelt); (ii) Crustaceans; (iii) Milk & milk products; (iv) Eggs; (v) Fish; (vi) Peanuts & Tree nuts; (vii) Soybeans; and (viii) Sulphite in concentrations >= 10mg/kg. Allergenic ingredients must be highlighted in the ingredient list.',
    metadata: {
      ingredient: 'fssai mandatory allergens',
      org: 'FSSAI',
      topic: 'FSSAI Statutory 8-Allergen Declaration Mandate',
      section: 'FSSAI Regulation 2020 § 5(3)',
      keywords: ['fssai', 'india', 'allergen mandate', 'wheat', 'milk', 'peanut', 'egg', 'soy', 'fish', 'sulphite', 'fssai regulation']
    }
  },
  {
    id: 'chunk_fssai_veg_nonveg_1',
    sourceId: 'src_fssai_veg_nonveg',
    text: 'FSSAI mandates the distinctive Green Dot in a green square for 100% vegetarian foods and a Brown Triangle in a brown square for non-vegetarian foods containing any animal-derived ingredient (excluding milk/milk products and honey). Products with gelatin (animal collagen), carmine (E120 cochineal), animal rennet, bone char filtered sugar, or egg proteins are classified strictly as Non-Vegetarian.',
    metadata: {
      ingredient: 'vegetarian / non-vegetarian logos',
      org: 'FSSAI',
      topic: 'FSSAI Green / Brown Dot Vegetarian & Animal Derivative Mandate',
      section: 'Clause 5(4) Labelling Regulations',
      keywords: ['green dot', 'brown dot', 'vegetarian', 'non-vegetarian', 'fssai logo', 'gelatin', 'carmine', 'animal rennet', 'egg']
    }
  },
  {
    id: 'chunk_indian_dairy_ghee_paneer',
    sourceId: 'src_fssai_dairy_standards',
    text: 'Indian indigenous dairy products — Desi Ghee (clarified butter), Paneer (fresh curd cheese), Khoya / Mawa (heat-desiccated milk solids), Malai (clotted cream), and Dahi (cultured curd) — are primary staples in Indian cuisine. While ghee is clarified fat containing minimal residual water-soluble proteins (<0.1%), paneer, khoya, and milk powder contain concentrated bovine casein and whey proteins, presenting severe risk to milk-allergic individuals.',
    metadata: {
      ingredient: 'paneer / ghee / khoya',
      org: 'FSSAI',
      topic: 'Indigenous Indian Dairy Products & Casein/Whey Allergenicity',
      section: 'FSSAI Dairy Standards Part 2.1',
      keywords: ['paneer', 'ghee', 'desi ghee', 'khoya', 'mawa', 'malai', 'dahi', 'curd', 'rabri', 'milk solids', 'chhena', 'lactose']
    }
  },
  {
    id: 'chunk_indian_hing_wheat',
    sourceId: 'src_fssai_spices_condiments',
    text: 'Compounded Asafoetida (Bandhani Hing / Hing Powder) used widely in Indian cooking is formulated by blending pure Ferula foetida resin with carrier starches, predominantly edible Maida (refined wheat flour) or wheat starch and gum arabic (E414). Consequently, commercial hing is a hidden source of wheat gluten and poses significant health hazards to consumers with Celiac Disease or IgE-mediated wheat allergies unless certified 100% gluten-free (using rice flour).',
    metadata: {
      ingredient: 'hing (asafoetida)',
      org: 'FSSAI',
      topic: 'Compounded Asafoetida (Hing) Wheat Starch & Gluten Cross-Contact',
      section: 'FSSAI Spices Standards § 2.9.1',
      keywords: ['hing', 'asafoetida', 'bandhani hing', 'maida', 'wheat flour', 'gluten', 'celiac', 'gum arabic', 'curry spice']
    }
  },
  {
    id: 'chunk_indian_mustard_sarson',
    sourceId: 'src_fssai_spices_condiments',
    text: 'Mustard seeds (Brassica nigra / Rai, Brassica juncea / Sarson) and unrefined cold-pressed Mustard Oil (Kachi Ghani Tel) are ubiquitous in Indian curries, namkeens, and pickles (Achar). Mustard contains major allergen proteins Sin a 1 (2S albumin) and Bra j 1, which are highly thermal-stable. Under international and Indian food advisory benchmarks, mustard must be clearly declared due to potent systemic allergenicity.',
    metadata: {
      ingredient: 'mustard / sarson / rai',
      org: 'FSSAI',
      topic: 'Mustard Seeds & Mustard Oil (Kachi Ghani) Allergen Dynamics',
      section: 'FSSAI & CODEX Spices Guidance',
      keywords: ['mustard', 'sarson', 'rai', 'mustard oil', 'kachi ghani', 'sin a 1', 'bra j 1', 'pickle', 'achar', 'tadka']
    }
  },
  {
    id: 'chunk_indian_sesame_til',
    sourceId: 'src_fssai_labelling_2020',
    text: 'Sesame (Til / Gingelly seeds and Til Oil) is a core ingredient in traditional Indian confectionery (Til Laddu, Revdi, Gajak, Chikki), savory namkeens (Murukku, Mixture), and South Indian tempering (Milagai Podi). Sesame allergens (Ses i 1 - Ses i 7) cause rapid anaphylaxis and are recognized by FSSAI and international bodies as a mandatory allergen declaration.',
    metadata: {
      ingredient: 'sesame (til)',
      org: 'FSSAI',
      topic: 'Sesame (Til / Gingelly) in Indian Traditional Confectionery & Namkeens',
      section: 'FSSAI Allergen Mandate § 5(3)(vi)',
      keywords: ['til', 'sesame', 'gingelly', 'til laddu', 'gajak', 'chikki', 'tahini', 'sesame oil', 'murukku']
    }
  },
  {
    id: 'chunk_indian_pulses_besan',
    sourceId: 'src_fssai_labelling_2020',
    text: 'Gram Flour (Besan / Bengal gram / Chana dal flour) is the base flour for major Indian snacks (Sev, Bhujia, Pakoras, Dhokla, Laddus) and is naturally gluten-free. However, commercial milling facilities in India frequently co-process besan on grain mill stones grinding Maida/Wheat (Atta), leading to significant gluten cross-contact. Consumers with Celiac disease must verify dedicated gluten-free processing certificates.',
    metadata: {
      ingredient: 'besan (gram flour)',
      org: 'FSSAI',
      topic: 'Besan (Gram Flour) & Dal Varieties (Moong, Urad, Toor, Chana) Allergen Profile',
      section: 'FSSAI Pulses & Legumes Guidance',
      keywords: ['besan', 'gram flour', 'chana dal', 'moong dal', 'urad dal', 'toor dal', 'rajma', 'bhujia', 'sev', 'pakora', 'dhokla', 'gluten cross-contact']
    }
  },
  {
    id: 'chunk_indian_tree_nuts_kaju_badam',
    sourceId: 'src_fssai_labelling_2020',
    text: 'Tree nuts including Kaju (Cashew nuts), Badam (Almonds), Pista (Pistachio), Akhrot (Walnuts), and Charoli/Chironji are extensively used in Indian sweets (Kaju Katli, Badam Halwa, Pista Barfi, Kheer), biryanis, and rich gravy pastes (Mughlai/Shahi curries). As potent FALCPA and FSSAI major allergens (Ana o 1, Pru du 6), unlabelled nut pastes in Indian packaged gravies pose severe life-threatening risks.',
    metadata: {
      ingredient: 'kaju / badam / pista (tree nuts)',
      org: 'FSSAI',
      topic: 'Cashew (Kaju), Almond (Badam) & Nut Pastes in Indian Sweets & Gravies',
      section: 'FSSAI Tree Nut Classification § 5(3)(vi)',
      keywords: ['kaju', 'cashew', 'badam', 'almond', 'pista', 'pistachio', 'akhrot', 'walnut', 'kaju katli', 'charoli', 'shahi paneer', 'mithai']
    }
  },
  {
    id: 'chunk_indian_spices_haldi_jeera',
    sourceId: 'src_fssai_spices_condiments',
    text: 'Traditional Indian spices — Haldi (Turmeric / Curcumin), Jeera (Cumin), Dhaniya (Coriander), Ajwain (Carom seeds), Methi (Fenugreek), Saunf (Fennel), and Garam Masala blends — are Generally Recognized as Safe (GRAS) by FSSAI and FDA. Fenugreek (Methi) contains 2S albumin proteins that can cross-react with peanut allergens in highly sensitized individuals.',
    metadata: {
      ingredient: 'indian spices (haldi, methi, jeera)',
      org: 'FSSAI',
      topic: 'Indian Culinary Spices, Curcumin Bioactivity & Fenugreek Cross-Reactivity',
      section: 'FSSAI Spices Compendium § 2.9',
      keywords: ['haldi', 'turmeric', 'curcumin', 'jeera', 'cumin', 'dhaniya', 'coriander', 'methi', 'fenugreek', 'ajwain', 'saunf', 'garam masala', 'chaat masala']
    }
  },
  // --- PEANUT CHUNKS ---
  {
    id: 'chunk_peanut_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA Food Allergen Guidance identifies Peanuts (Arachis hypogaea) as one of the major food allergens responsible for 90% of documented food allergic reactions in the United States. Peanut allergies are typically lifelong and can cause rapid IgE-mediated anaphylaxis even upon ingestion of microgram quantities of peanut seed storage proteins (Ara h 1, Ara h 2, Ara h 3, and Ara h 6). Manufacturers must declare peanut or peanut-derived ingredients prominently on product packaging.',
    metadata: {
      ingredient: 'peanut',
      org: 'FDA',
      topic: 'Peanut Allergenicity and Anaphylaxis Risk',
      section: 'Major Allergen Declaration § 203',
      keywords: ['peanut', 'arachis', 'peanut butter', 'peanut flour', 'ara h', 'allergen', 'anaphylaxis']
    }
  },
  {
    id: 'chunk_peanut_2',
    sourceId: 'src_efsa_reg1169',
    text: 'Under EFSA Regulation (EU) No 1169/2011 Annex II, peanuts and products thereof are classified as mandatory allergens. This applies to whole peanuts, peanut pastes, defatted peanut meals, and cold-pressed unrefined peanut oils. Highly refined peanut oils may exhibit reduced protein content, but consumers with severe peanut sensitization are advised to avoid all unverified peanut derivatives.',
    metadata: {
      ingredient: 'peanut',
      org: 'EFSA',
      topic: 'Peanut Derivatives & Mandatory European Annex II Classification',
      section: 'Annex II Point 5',
      keywords: ['peanut', 'arachis oil', 'groundnut', 'unrefined peanut oil', 'peanut paste']
    }
  },

  // --- MILK / DAIRY CHUNKS ---
  {
    id: 'chunk_milk_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA regulations mandate the explicit declaration of milk and all milk-derived proteinaceous ingredients under FALCPA. Bovine milk contains two primary allergenic fractions: Casein (alpha-s1, alpha-s2, beta, and kappa caseins representing ~80% of total protein) and Whey proteins (beta-lactoglobulin and alpha-lactalbumin representing ~20%). Ingredients such as sodium caseinate, calcium caseinate, whey protein concentrate/isolate, and milk solids contain intact cow milk allergens.',
    metadata: {
      ingredient: 'milk',
      org: 'FDA',
      topic: 'Bovine Milk Proteins, Casein, and Whey Fractions',
      section: 'Major Allergen Declaration § 201',
      keywords: ['milk', 'casein', 'sodium caseinate', 'calcium caseinate', 'whey', 'whey protein', 'milk solids', 'butter', 'ghee']
    }
  },
  {
    id: 'chunk_milk_2',
    sourceId: 'src_efsa_reg1169',
    text: 'EFSA Scientific Opinion on Food Allergies confirms that bovine milk allergy is prevalent in early childhood and can persist into adulthood. Thermal processing and baking do not reliably eliminate allergenicity of caseins due to their heat-stable linear conformational epitopes. Products containing curds, dairy butterfat, lactose (unless certified free from lactoproteins), and whey powder require clear allergen labeling across the EU.',
    metadata: {
      ingredient: 'milk',
      org: 'EFSA',
      topic: 'Heat Stability of Milk Casein and EU Labeling Mandate',
      section: 'Annex II Point 7',
      keywords: ['milk', 'casein', 'whey powder', 'dairy solids', 'lactose', 'butterfat', 'cheese']
    }
  },

  // --- EGG CHUNKS ---
  {
    id: 'chunk_egg_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA Food Allergen Guidance identifies poultry eggs and egg-derived components (albumen, dried egg white, ovalbumin, ovomucoid, vitellin, and egg lysozyme) as major food allergens. Ovomucoid (Gal d 1) is exceptionally resistant to heat denaturation and pepsin digestion, retaining allergenicity even in extensively baked confectionery goods.',
    metadata: {
      ingredient: 'egg',
      org: 'FDA',
      topic: 'Egg Protein Fractions and Heat Resistance of Ovomucoid',
      section: 'FALCPA Technical Guidance § 201',
      keywords: ['egg', 'egg white', 'egg yolk', 'ovalbumin', 'ovomucoid', 'albumin', 'lysozyme', 'meringue']
    }
  },

  // --- SOY CHUNKS ---
  {
    id: 'chunk_soy_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA guidelines classify soybeans (Glycine max) and soy derivatives as major food allergens. Primary soybean storage globulins Gly m 5 (beta-conglycinin) and Gly m 6 (glycinin) are potent immunogens. Soy lecithin (E322), used as an emulsifier in chocolate and baked goods, is derived from soybean oil and contains residual trace soy proteins. FDA requires clear declaration of soy on product labels when soy lecithin is present.',
    metadata: {
      ingredient: 'soy',
      org: 'FDA',
      topic: 'Soybean Proteins & Soy Lecithin (E322) Labeling Rules',
      section: 'FALCPA Guidance Q&A #14',
      keywords: ['soy', 'soybean', 'soy lecithin', 'soya', 'soy protein', 'gly m', 'tofu', 'textured vegetable protein']
    }
  },

  // --- WHEAT & GLUTEN CHUNKS ---
  {
    id: 'chunk_wheat_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA FALCPA designates Wheat (including durum, semolina, spelt, farina, graham, and kamut) as a major food allergen. Wheat allergy is an IgE-mediated response distinct from Celiac disease (an autoimmune enteropathy triggered by gluten prolamins). Wheat flour, vital wheat gluten, and modified wheat starches must be explicitly declared to protect individuals with immediate hypersensitivity and gluten intolerance.',
    metadata: {
      ingredient: 'wheat',
      org: 'FDA',
      topic: 'Wheat Species and Gluten-Containing Grain Allergenicity',
      section: 'FALCPA Definitions § 201(qq)',
      keywords: ['wheat', 'wheat flour', 'semolina', 'durum', 'spelt', 'vital wheat gluten', 'gluten', 'maida', 'atta']
    }
  },

  // --- TREE NUTS CHUNKS ---
  {
    id: 'chunk_treenuts_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA recognizes Tree Nuts as a major food allergen category encompassing almonds, pecans, walnuts, cashews, hazelnuts (filberts), pistachios, macadamias, brazil nuts, and pine nuts. Allergenic seed storage proteins (2S albumins, 7S vicilins, 11S legumins) within tree nuts exhibit substantial structural stability and cross-reactivity.',
    metadata: {
      ingredient: 'tree nuts',
      org: 'FDA',
      topic: 'FDA Tree Nut Classification & Allergen Species',
      section: 'FALCPA Section 201',
      keywords: ['tree nuts', 'almond', 'cashew', 'walnut', 'hazelnut', 'pecan', 'pistachio', 'macadamia', 'marzipan', 'praline']
    }
  },

  // --- SESAME CHUNKS ---
  {
    id: 'chunk_sesame_1',
    sourceId: 'src_fda_faster',
    text: 'Under the US FASTER Act of 2021, sesame (Sesamum indicum) became the 9th major food allergen subject to statutory labeling. Sesame proteins (Ses i 1 through Ses i 7) cause severe hypersensitivity. Common derivatives including tahini, sesame paste, sesame seed oil, and toasted sesame seeds must be declared by their common or usual name.',
    metadata: {
      ingredient: 'sesame',
      org: 'FDA',
      topic: 'FASTER Act Sesame Inclusion and Clinical Precaution',
      section: 'Public Law 117-11',
      keywords: ['sesame', 'tahini', 'sesame oil', 'sesamum indicum', 'benne', 'til', 'faster act']
    }
  },

  // --- FISH & SHELLFISH CHUNKS ---
  {
    id: 'chunk_seafood_1',
    sourceId: 'src_fda_falcpa',
    text: 'FDA and EFSA classify finned fish and crustacean shellfish as major food allergens. Parvalbumin is the primary allergen in fish species, while tropomyosin is the dominant thermostable allergen in crustaceans (shrimp, crab, lobster) and mollusks. Cross-contact or derived flavorings (fish gelatin, oyster sauce, shrimp paste) require strict consumer notification.',
    metadata: {
      ingredient: 'fish / shellfish',
      org: 'FDA',
      topic: 'Parvalbumin and Tropomyosin in Aquatic Allergens',
      section: 'FALCPA Seafood Standards',
      keywords: ['fish', 'shellfish', 'shrimp', 'crab', 'lobster', 'cod', 'salmon', 'tuna', 'anchovy', 'tropomyosin', 'parvalbumin']
    }
  },

  // --- DIETARY & ADDITIVE HAZARDS ---
  {
    id: 'chunk_additive_e171',
    sourceId: 'src_efsa_e171',
    text: 'The EFSA Panel on Food Additives and Flavourings concluded that Titanium Dioxide (E171) can no longer be considered safe for use as a food additive due to concerns about genotoxicity, potential DNA strand breaks, and systemic cellular bioaccumulation of submicron/nanoparticles.',
    metadata: {
      ingredient: 'titanium dioxide',
      org: 'EFSA',
      topic: 'EFSA Ban & Genotoxicity Assessment of Titanium Dioxide (E171)',
      section: 'EFSA Journal 2021;19(5):6585',
      keywords: ['titanium dioxide', 'e171', 'food color', 'nanoparticles', 'genotoxicity']
    }
  },
  {
    id: 'chunk_additive_gras',
    sourceId: 'src_fda_gras_additives',
    text: 'FDA GRAS evaluations for common preservatives (sodium benzoate E211, potassium sorbate E202, BHA E320, BHT E321) establish strict concentration thresholds in food products to prevent oxidative toxicity and cellular irritation. Monosodium glutamate (MSG, E621) is recognized as safe at standard food additive concentrations, though sensitive individuals may experience transient subjective symptoms upon high-dose bolus ingestion.',
    metadata: {
      ingredient: 'additives',
      org: 'FDA',
      topic: 'Preservative Tolerances and GRAS Regulatory Thresholds',
      section: '21 CFR Part 182 / 184',
      keywords: ['sodium benzoate', 'potassium sorbate', 'bha', 'bht', 'msg', 'monosodium glutamate', 'preservative']
    }
  },
  {
    id: 'chunk_dietary_gelatin_carmine',
    sourceId: 'src_efsa_reg1169',
    text: 'Animal-derived ingredients such as gelatin (hydrolyzed collagen from porcine/bovine connective tissue), carmine/cochineal (E120, carminic acid from Dactylopius coccus insects), and animal rennet (bovine stomach enzymes) are classified as non-vegetarian and non-vegan. Carmine has also been documented to trigger rare IgE-mediated allergic reactions in sensitized consumers.',
    metadata: {
      ingredient: 'animal derivatives',
      org: 'EFSA',
      topic: 'Animal Origin Labeling & Carmine Hypersensitivity',
      section: 'EFSA Food Colors Directive',
      keywords: ['gelatin', 'carmine', 'cochineal', 'e120', 'rennet', 'lard', 'tallow', 'vegan', 'vegetarian']
    }
  }
];
