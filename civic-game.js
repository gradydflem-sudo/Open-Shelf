(function () {
  const DATA = window.CommonPagesCivicData || {};
  const root = document.querySelector("#civicRoot");
  if (!root) return;

  const SAVE_KEY = "commonRepublicGrandStrategySaveV1";
  const VERSION = "0.4.0";
  const STATES = DATA.usStates || [];
  const OFFICE_LADDER = DATA.officeLadder || [
    { id: "schoolBoard", name: "School Board", tier: 1, campaignScale: 0.6, governingPower: 0.5 },
    { id: "cityCouncil", name: "City Council", tier: 2, campaignScale: 0.8, governingPower: 0.7 },
    { id: "mayor", name: "Mayor", tier: 3, campaignScale: 1, governingPower: 0.9 },
    { id: "stateHouse", name: "State House Representative", tier: 4, campaignScale: 1.1, governingPower: 0.95 },
    { id: "governor", name: "Governor", tier: 7, campaignScale: 1.6, governingPower: 1.3 },
    { id: "president", name: "President", tier: 9, campaignScale: 2.4, governingPower: 1.7 }
  ];

  const DIFFICULTIES = {
    easy: {
      name: "Easy",
      text: "Forgiving polls, lower ad costs, calmer opposition, and wider room for mistakes.",
      supportPenalty: -2,
      money: 1.2,
      staff: 1.15,
      stamina: 1.12,
      adCost: 0.82,
      gaffe: 0.72,
      opposition: 0.78,
      crisis: 0.7,
      whip: 1.15
    },
    intermediate: {
      name: "Intermediate",
      text: "Competitive campaigns, real budget pressure, active factions, and meaningful gaffe risk.",
      supportPenalty: 0,
      money: 1,
      staff: 1,
      stamina: 1,
      adCost: 1,
      gaffe: 1,
      opposition: 1,
      crisis: 1,
      whip: 1
    },
    advanced: {
      name: "Advanced",
      text: "Narrow margins, expensive late media, aggressive AI politicians, and punishing fatigue.",
      supportPenalty: 3.2,
      money: 0.78,
      staff: 0.84,
      stamina: 0.88,
      adCost: 1.28,
      gaffe: 1.35,
      opposition: 1.32,
      crisis: 1.25,
      whip: 0.86
    }
  };

  const PARTIES = [
    {
      id: "democratic",
      name: "Democratic Party",
      short: "Democrat",
      baseName: "Your Party Base",
      factions: ["Progressives", "Establishment Moderates", "Blue Dog/Rural Conservatives"],
      homeBase: ["ca", "ny", "ma", "md", "wa", "or", "il", "nj", "vt", "hi"],
      leanSign: -1,
      color: "#2f6f9f"
    },
    {
      id: "republican",
      name: "Republican Party",
      short: "Republican",
      baseName: "Your Party Base",
      factions: ["Populist/Nationalists", "Traditional Fiscal Conservatives", "Moderate Institutionalists"],
      homeBase: ["al", "ar", "id", "ks", "ky", "ok", "tn", "tx", "ut", "wy"],
      leanSign: 1,
      color: "#a9473e"
    },
    {
      id: "independent",
      name: "Independent Reform Coalition",
      short: "Independent",
      baseName: "Reform Coalition",
      factions: ["Good-Government Reformers", "Local Pragmatists", "Disaffected Partisans"],
      homeBase: ["ak", "me", "nh", "nv", "pa", "wi"],
      leanSign: 0,
      color: "#66714a"
    }
  ];

  const CAMPAIGN_TABS = [
    ["map", "War Room Map"],
    ["qa", "Questions"],
    ["logistics", "Action Ledger"],
    ["ads", "Micro-Targeting"],
    ["primary", "Primary/Convention"],
    ["profile", "Candidate File"]
  ];

  const GOVERNING_TABS = [
    ["dashboard", "Executive Dashboard"],
    ["draft", "Draft Engine"],
    ["whip", "Whip Matrix"],
    ["ledger", "Legislative Ledger"],
    ["pulse", "Constituent Pulse"],
    ["world", "World Simulation"],
    ["legacy", "Legacy/Dynasty"]
  ];

  const DEMOS = [
    "College-Educated Women 30-45",
    "Working-Class Voters",
    "Suburban Independents",
    "Young Renters",
    "Rural Seniors",
    "Small Business Owners",
    "Party Primary Voters",
    "Low-Propensity New Registrants"
  ];

  const AD_MESSAGES = [
    "Education and healthcare competence",
    "Cost-of-living and tax relief",
    "Public safety and order",
    "Anti-corruption and transparency",
    "Jobs, labor, and wages",
    "Housing supply and affordability",
    "Climate resilience and energy"
  ];

  const CAMPAIGN_ACTIONS = [
    { id: "fieldOffice", name: "Open Field Office", cost: 18000, staff: 18, stamina: 5, text: "A physical office raises turnout and creates permanent campaign footprint.", effects: { footprint: 10, enthusiasm: 4, turnout: 2.5 } },
    { id: "oppoResearch", name: "Opposition Research", cost: 9000, staff: 24, stamina: 3, text: "Researchers dig through votes, finances, and interviews to unlock attack lines.", effects: { oppo: 16, negative: 2 } },
    { id: "registration", name: "Voter Registration Drive", cost: 12000, staff: 20, stamina: 6, text: "Register friendly voters and alter the long-term partisan baseline.", effects: { registration: 10, enthusiasm: 2, turnout: 1.5 } },
    { id: "rally", name: "Hold High-Energy Rally", cost: 7500, staff: 8, stamina: 16, text: "A rally boosts base enthusiasm but drains the candidate.", effects: { base: 4, enthusiasm: 8, stamina: -2 } },
    { id: "townHall", name: "Host Local Town Hall", cost: 4000, staff: 10, stamina: 10, text: "A room of skeptical voters can improve trust if you are prepared.", effects: { independents: 3, trust: 3, enthusiasm: 1 } },
    { id: "fundraiser", name: "National Fundraiser", cost: 0, staff: 8, stamina: 9, text: "Raise money from aligned donors and party networks.", effects: { money: 42000, base: -1 } },
    { id: "debateCamp", name: "Debate Boot Camp", cost: 6500, staff: 12, stamina: 8, text: "Prep hard questions and lower the chance of a public stumble.", effects: { eloquence: 4, gaffeShield: 8 } },
    { id: "downballot", name: "Campaign for Allies", cost: 10000, staff: 16, stamina: 11, text: "Help colleagues, bank political capital, and improve future whip counts.", effects: { pc: 8, network: 4 } }
  ];

  const QUESTION_BANK = [
    {
      id: "factoryLayoffs",
      title: "A Local Factory Announces Layoffs",
      region: "Industrial media markets",
      text: "A major employer announces that hundreds of workers may lose their jobs. Reporters ask whether your campaign has an answer beyond sympathy.",
      issue: "jobs",
      options: [
        { id: "base", type: "Base-Mobilizing", label: "Call it corporate abandonment and demand labor protections.", baseWeight: 3.2, ideology: 0.82, base: 6, independents: -2, regional: 2, enthusiasm: 10, negative: 1 },
        { id: "center", type: "Pivot-to-Center", label: "Propose a retraining, infrastructure, and small business recovery package.", baseWeight: 2.2, ideology: 0.58, base: -1, independents: 5, regional: 3, enthusiasm: -2, negative: 0 },
        { id: "attack", type: "Deflection/Attack", label: "Tie the layoffs to your opponent's donors and voting record.", baseWeight: 2.4, ideology: 0.64, base: 2, independents: -1, opponentSuppression: 4, regional: 1, negative: 6 },
        { id: "expert", type: "Policy Expert", locked: { stat: "policy", min: 75 }, label: "Walk through a wage-insurance and procurement plan with funding sources.", baseWeight: 2.4, ideology: 0.9, base: 2, independents: 3, regional: 2, expertise: 3, negative: -1 }
      ]
    },
    {
      id: "taxDebate",
      title: "Debate Question: Taxes and Services",
      region: "Suburban counties",
      text: "The moderator asks whether you would raise taxes to fund schools, clinics, or infrastructure. The room is divided between service quality and tax fatigue.",
      issue: "taxes",
      options: [
        { id: "base", type: "Base-Mobilizing", label: "Say the wealthy and large corporations should pay what they owe.", baseWeight: 2.8, ideology: 0.75, base: 7, independents: -4, enthusiasm: 12, negative: 2 },
        { id: "center", type: "Pivot-to-Center", label: "Promise no broad hike without audits, offsets, and measurable outcomes.", baseWeight: 2.1, ideology: 0.55, base: -2, independents: 6, enthusiasm: -3, negative: 0 },
        { id: "attack", type: "Deflection/Attack", label: "Argue your opponent's math hides cuts and favors insiders.", baseWeight: 2.3, ideology: 0.6, base: 2, independents: 0, opponentSuppression: 3, negative: 5 },
        { id: "expert", type: "Policy Expert", locked: { stat: "policy", min: 75 }, label: "Name the brackets, credits, and sunset clauses line by line.", baseWeight: 2.5, ideology: 0.92, base: 2, independents: 3, expertise: 4, negative: -1 }
      ]
    },
    {
      id: "viralClip",
      title: "A Viral Clip Misquotes You",
      region: "Statewide social media",
      text: "A clipped sentence spreads online. It is misleading, but it is moving fast enough that silence starts to look like guilt.",
      issue: "media",
      options: [
        { id: "base", type: "Base-Mobilizing", label: "Attack the clip as bad-faith manipulation by political elites.", baseWeight: 2.6, ideology: 0.72, base: 6, independents: -3, enthusiasm: 8, negative: 4 },
        { id: "center", type: "Pivot-to-Center", label: "Release the full video and calmly restate the point.", baseWeight: 2.2, ideology: 0.7, base: 0, independents: 4, trust: 4, enthusiasm: -1, negative: -1 },
        { id: "attack", type: "Deflection/Attack", label: "Counter with your opponent's worse statement from last year.", baseWeight: 2.4, ideology: 0.54, base: 3, independents: -2, opponentSuppression: 5, negative: 7 },
        { id: "expert", type: "Media Discipline", locked: { stat: "eloquence", min: 72 }, label: "Do a live interview and answer follow-ups without notes.", baseWeight: 2.6, ideology: 0.88, base: 2, independents: 4, trust: 5, expertise: 2, negative: -2 }
      ]
    },
    {
      id: "publicSafety",
      title: "Town Hall: Public Safety",
      region: "High-turnout suburbs",
      text: "A parent asks why response times are slow after a rash of car break-ins. Activists in the back row also want accountability reforms.",
      issue: "safety",
      options: [
        { id: "base", type: "Base-Mobilizing", label: "Center prevention, youth programs, and accountable policing.", baseWeight: 2.7, ideology: 0.76, base: 5, independents: -1, enthusiasm: 7, regional: 1 },
        { id: "center", type: "Pivot-to-Center", label: "Pair more visible patrols with data reporting and mental-health response.", baseWeight: 2.6, ideology: 0.8, base: 0, independents: 5, regional: 2, enthusiasm: -1 },
        { id: "attack", type: "Deflection/Attack", label: "Say your opponent ignored response times until cameras arrived.", baseWeight: 2.1, ideology: 0.55, base: 2, independents: -1, opponentSuppression: 4, negative: 5 },
        { id: "expert", type: "Policy Expert", locked: { stat: "policy", min: 75 }, label: "Cite staffing, dispatch, prevention, and accountability benchmarks.", baseWeight: 2.5, ideology: 0.9, base: 1, independents: 4, expertise: 3, regional: 1 }
      ]
    },
    {
      id: "foreignShock",
      title: "Foreign Crisis Question",
      region: "National press pool",
      federalOnly: true,
      text: "A foreign nation escalates a regional conflict. The press asks whether you would support sanctions, aid, or military deployment.",
      issue: "foreign",
      options: [
        { id: "base", type: "Base-Mobilizing", label: "Frame the crisis through your party's clearest moral language.", baseWeight: 2.5, ideology: 0.74, base: 6, independents: -2, enthusiasm: 8, negative: 2 },
        { id: "center", type: "Pivot-to-Center", label: "Back sanctions and diplomacy while resisting open-ended war powers.", baseWeight: 2.4, ideology: 0.82, base: -1, independents: 5, trust: 2 },
        { id: "attack", type: "Deflection/Attack", label: "Accuse the opponent of either reckless intervention or dangerous weakness.", baseWeight: 2.2, ideology: 0.56, base: 2, independents: -1, opponentSuppression: 5, negative: 7 },
        { id: "expert", type: "Policy Expert", locked: { stat: "policy", min: 78 }, label: "Lay out alliance commitments, sanctions design, and congressional oversight.", baseWeight: 2.7, ideology: 0.95, base: 1, independents: 4, expertise: 4, negative: -1 }
      ]
    }
  ];

  const WORLD_EVENTS = [
    { id: "marketCrash", type: "Economic Crisis", title: "Credit Markets Tighten", text: "A financing freeze raises unemployment and makes every budget promise more expensive.", effects: { unemployment: 0.7, inflation: 0.3, approval: -3, budget: -12 } },
    { id: "supplyShock", type: "Economic Crisis", title: "Supply Chain Disruption", text: "Prices rise on fuel, food, and construction materials. Voters look for competence, not slogans.", effects: { inflation: 0.8, income: -900, approval: -2, budget: -8 } },
    { id: "courtRuling", type: "Social/Judicial Shift", title: "Court Ruling Rewrites the Agenda", text: "A major ruling changes the political conversation overnight and drags social policy into the center of the term.", effects: { base: 3, independents: -2, opposition: -3, trust: -1 } },
    { id: "foreignAttack", type: "Geopolitical Shock", title: "Foreign Attack Dominates the News", text: "A security crisis shifts the national mood toward hard questions about alliances, sanctions, and readiness.", federal: true, effects: { base: 1, independents: -1, trust: -2, approval: -2 } },
    { id: "massProtest", type: "Social Movement", title: "Mass Protest Movement Erupts", text: "Organizers fill public squares and force every officeholder to choose between order, reform, and delay.", effects: { base: 2, independents: -1, trust: -2, pc: -3 } }
  ];

  const NAMES = {
    first: ["Mara", "Jon", "Elena", "Victor", "Samir", "Talia", "Grace", "Noah", "Ruth", "Cal", "Ines", "Omar", "Leah", "Darius", "Nora", "Mae", "Grant", "Ana", "Malik", "Beatrice"],
    last: ["Vance", "Kline", "Reed", "Cho", "Benton", "Vale", "Ibarra", "Rios", "Park", "Stone", "Fox", "Bell", "Ortiz", "Snow", "Merritt", "Price", "Doyle", "Raman", "Okafor", "Feld"]
  };

  let state = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function byId(list, id) {
    return (list || []).find((item) => item.id === id);
  }

  function money(value) {
    return `$${Math.round(value).toLocaleString()}`;
  }

  function pct(value, digits = 0) {
    return `${Number(value).toFixed(digits)}%`;
  }

  function html(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function signed(value, suffix = "") {
    const n = Number(value || 0);
    return `${n >= 0 ? "+" : ""}${Math.round(n * 10) / 10}${suffix}`;
  }

  function party() {
    return byId(PARTIES, state?.candidate?.partyId) || PARTIES[0];
  }

  function difficulty() {
    return DIFFICULTIES[state?.difficultyId || "intermediate"] || DIFFICULTIES.intermediate;
  }

  function currentOffice() {
    return byId(OFFICE_LADDER, state?.candidate?.officeId) || OFFICE_LADDER[0];
  }

  function homeState() {
    return byId(STATES, state?.candidate?.homeStateId) || byId(STATES, "pa") || STATES[0];
  }

  function isFederalOffice(office = currentOffice()) {
    return ["usHouse", "usSenate", "president"].includes(office?.id);
  }

  function addLog(text, type = "note") {
    if (!state) return;
    state.log.unshift({ id: `${Date.now()}-${Math.random()}`, week: state.campaign?.week, month: state.governing?.month, type, text });
    state.log = state.log.slice(0, 120);
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() }));
    } catch (error) {
      console.warn("Could not save The Common Republic", error);
    }
  }

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (!parsed || parsed.version !== VERSION) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function clearSave() {
    localStorage.removeItem(SAVE_KEY);
  }

  function generateMarkets(stateData) {
    const name = stateData?.name || "Columbia";
    if (stateData?.id === "pa") {
      return [
        { id: "philadelphia", name: "Philadelphia Media Market", counties: "Philadelphia, Bucks, Montgomery, Delaware, Camden", cost: 1.35, lean: -7, turnout: 66, saturation: 0 },
        { id: "pittsburgh", name: "Pittsburgh Media Market", counties: "Allegheny, Beaver, Washington, Westmoreland", cost: 1.12, lean: -2, turnout: 64, saturation: 0 },
        { id: "harrisburg", name: "Harrisburg-Lancaster Market", counties: "Dauphin, Lancaster, York, Cumberland", cost: 0.92, lean: 4, turnout: 68, saturation: 0 },
        { id: "scranton", name: "Scranton-Wilkes-Barre Market", counties: "Lackawanna, Luzerne, Monroe", cost: 0.86, lean: 2, turnout: 63, saturation: 0 },
        { id: "erie", name: "Erie and Northwest Market", counties: "Erie, Crawford, Warren", cost: 0.72, lean: 1, turnout: 61, saturation: 0 }
      ];
    }
    return [
      { id: "metro", name: `${name} Metro Market`, counties: "urban core and inner suburbs", cost: 1.18, lean: (stateData?.lean || 0) - 5, turnout: 64, saturation: 0 },
      { id: "suburbs", name: `${name} Suburban Ring`, counties: "commuter counties and exurbs", cost: 1.05, lean: stateData?.lean || 0, turnout: 68, saturation: 0 },
      { id: "river", name: `${name} River/Industrial Belt`, counties: "small cities and industrial towns", cost: 0.88, lean: (stateData?.lean || 0) + 1, turnout: 60, saturation: 0 },
      { id: "rural", name: `${name} Rural Network`, counties: "agricultural, mountain, and small-town counties", cost: 0.74, lean: (stateData?.lean || 0) + 6, turnout: 62, saturation: 0 }
    ];
  }

  function generatePrecincts(market) {
    return Array.from({ length: 12 }, (_, index) => ({
      id: `${market.id}-p${index + 1}`,
      name: `Precinct ${index + 1}`,
      voters: Math.round(700 + Math.random() * 4200),
      lean: clamp((market.lean || 0) + (Math.random() * 16 - 8), -25, 25),
      enthusiasm: clamp(48 + Math.random() * 25, 20, 95),
      contacted: Math.round(Math.random() * 18)
    }));
  }

  function calculateInitialSupport(stateData, partyData) {
    const lean = stateData?.lean || 0;
    if (partyData.id === "independent") return clamp(50 - Math.abs(lean) * 0.2 + Math.random() * 5 - 2.5, 33, 60);
    const partisanFit = partyData.id === "democratic" ? -lean : lean;
    return clamp(48 + partisanFit * 0.72 - difficulty().supportPenalty + Math.random() * 4 - 2, 22, 76);
  }

  function generateCampaignMap(partyData) {
    return STATES.map((stateData) => {
      const support = calculateInitialSupport(stateData, partyData);
      return {
        id: stateData.id,
        name: stateData.name,
        abbreviation: stateData.id.toUpperCase(),
        pvi: stateData.lean || 0,
        support,
        enthusiasm: clamp(52 + (support - 50) * 0.35 + Math.random() * 10 - 5, 25, 90),
        footprint: 0,
        offices: 0,
        adSaturation: 0,
        registration: 0,
        turnout: stateData.turnout || 62,
        unemployment: clamp(3.2 + Math.random() * 4 + Math.abs(stateData.lean || 0) * 0.02, 2.4, 10),
        inflation: clamp(2.1 + Math.random() * 2.5, 1, 8),
        income: stateData.medianIncome || 70000,
        markets: generateMarkets(stateData)
      };
    });
  }

  function makeCandidate(form) {
    const partyId = form.get("party") || "democratic";
    const background = byId(DATA.backgrounds, form.get("background")) || DATA.backgrounds?.[0] || { name: "Organizer", skills: {} };
    const office = byId(OFFICE_LADDER, form.get("office")) || OFFICE_LADDER[0];
    const statBase = {
      eloquence: 58,
      policy: 58,
      negotiation: 55,
      stamina: 72,
      organizing: 56,
      fundraising: 54
    };
    Object.entries(background.skills || {}).forEach(([key, value]) => {
      const mapped = key === "debate" ? "eloquence" : key === "coalition" || key === "legislative" ? "negotiation" : key;
      if (statBase[mapped] != null) statBase[mapped] += value * 6;
    });
    return {
      name: String(form.get("candidateName") || "Alex Rivers").trim(),
      age: clamp(Number(form.get("age") || 35), 18, 90),
      partyId,
      faction: form.get("faction") || partyFactions(partyId)[0],
      backgroundId: background.id || "organizer",
      homeStateId: form.get("homeState") || "pa",
      officeId: office.id,
      officeName: office.name,
      ideology: Number(form.get("ideology") || 0),
      stats: statBase,
      traits: ["First-time Candidate"],
      fatigue: 0,
      protege: {
        name: "No protege selected",
        age: 27,
        eloquence: 42,
        negotiation: 38,
        policy: 44,
        network: 10,
        ready: false
      }
    };
  }

  function partyFactions(partyId) {
    return (byId(PARTIES, partyId) || PARTIES[0]).factions;
  }

  function newGame(form) {
    const partyId = form.get("party") || "democratic";
    state = {
      version: VERSION,
      phase: "campaign",
      view: "map",
      govView: "dashboard",
      difficultyId: form.get("difficulty") || "intermediate",
      candidate: makeCandidate(form),
      career: {
        year: 2028,
        termsServed: 0,
        electionsWon: 0,
        electionsLost: 0,
        delegatesWon: 0,
        pacFunds: 45000,
        network: 20,
        legacy: "Unwritten",
        officesHeld: []
      },
      campaign: null,
      governing: null,
      world: null,
      selected: {},
      log: []
    };
    const partyData = party();
    const office = currentOffice();
    state.campaign = {
      week: 1,
      maxWeeks: office.id === "president" ? 24 : office.tier >= 7 ? 16 : office.tier >= 4 ? 10 : 6,
      stage: office.tier >= 6 ? "primary" : "general",
      funds: Math.round((65000 + office.campaignScale * 85000) * difficulty().money),
      staffHours: Math.round((70 + office.campaignScale * 40) * difficulty().staff),
      stamina: Math.round(100 * difficulty().stamina),
      baseEnthusiasm: 54,
      independentSupport: 50,
      oppositionBase: 54,
      negativeCampaigning: 0,
      politicalCapital: 18,
      delegates: 0,
      delegateGoal: office.id === "president" ? 1991 : 50,
      momentum: 1,
      gaffeShield: 0,
      oppoResearch: 0,
      answered: [],
      activeQuestionId: null,
      lastQuestionResult: null,
      selectedStateId: state.candidate.homeStateId,
      selectedMarketId: "metro",
      overlay: "partisan",
      zoom: "national",
      map: generateCampaignMap(partyData),
      primaryCalendar: buildPrimaryCalendar(),
      convention: { active: false, uncommitted: 0, deals: [] },
      microTarget: {
        market: "metro",
        demo: DEMOS[0],
        message: AD_MESSAGES[0],
        spend: 50000
      }
    };
    const selectedState = getCampaignState(state.campaign.selectedStateId);
    state.campaign.selectedMarketId = selectedState?.markets?.[0]?.id || "metro";
    state.world = buildWorld();
    addLog(`${state.candidate.name} opened a ${difficulty().name.toLowerCase()} ${office.name} campaign in ${homeState()?.name || "the home state"}.`, "major");
    addLog(`${partyData.name} factions begin watching every answer for signs of loyalty or electability.`, "party");
    save();
    render();
  }

  function buildPrimaryCalendar() {
    return [
      { id: "ia", name: "Iowa Caucus", delegates: 40, week: 2, status: "pending", expectation: 12 },
      { id: "nh", name: "New Hampshire Primary", delegates: 32, week: 3, status: "pending", expectation: 10 },
      { id: "sc", name: "South Carolina Primary", delegates: 55, week: 4, status: "pending", expectation: 14 },
      { id: "nv", name: "Nevada Caucus", delegates: 36, week: 5, status: "pending", expectation: 11 },
      { id: "superTuesday", name: "Super Tuesday", delegates: 612, week: 7, status: "pending", expectation: 190 },
      { id: "rustbelt", name: "Rust Belt Cluster", delegates: 360, week: 10, status: "pending", expectation: 120 },
      { id: "coasts", name: "Coastal Finish", delegates: 520, week: 13, status: "pending", expectation: 170 }
    ];
  }

  function buildWorld() {
    return {
      totalPoliticians: 3200,
      turn: 1,
      unemployment: 4.2,
      inflation: 2.8,
      medianIncome: homeState()?.medianIncome || 74000,
      publicMood: 50,
      crisis: null,
      memory: [],
      aiActors: Array.from({ length: 36 }, (_, index) => makeAIActor(index, index % 2 ? "opposition" : "ally")),
      notes: ["A 3,200-politician ecosystem is simulated in summary, with visible actors surfacing as rivals, allies, committee chairs, and future opponents."]
    };
  }

  function makeAIActor(index, alignment = "ally") {
    const partyId = alignment === "opposition"
      ? (state?.candidate?.partyId === "republican" ? "democratic" : "republican")
      : (state?.candidate?.partyId || "democratic");
    return {
      id: `ai-${index}`,
      name: `${pick(NAMES.first)} ${pick(NAMES.last)}`,
      office: pick(["Mayor", "State Senator", "Committee Chair", "Governor", "U.S. Representative", "Party Leader"]),
      partyId,
      ambition: clamp(35 + Math.random() * 60, 0, 100),
      trust: clamp(35 + Math.random() * 45 + (alignment === "ally" ? 10 : -8), 0, 100),
      grudge: 0,
      pac: Math.round(10000 + Math.random() * 900000),
      memory: []
    };
  }

  function render() {
    if (!state) {
      renderSetup();
      return;
    }
    if (state.phase === "campaign") renderCampaign();
    else if (state.phase === "results") renderResults();
    else if (state.phase === "governing") renderGoverning();
    else if (state.phase === "termReview") renderTermReview();
  }

  function renderSetup() {
    const saved = load();
    root.innerHTML = `
      <section class="cr-setup">
        <div class="cr-setup-brief">
          <p class="cr-eyebrow">Common Pages Games</p>
          <h1>The Common Republic</h1>
          <p class="cr-lede">A civic strategy simulator about campaigns, governing, legislative bargaining, policy drafting, political memory, and long careers.</p>
          <div class="cr-system-strip">
            <div><span>Campaign</span><strong>Map, Q&A, primaries</strong></div>
            <div><span>Governing</span><strong>Draft bills, whip votes</strong></div>
            <div><span>World</span><strong>AI rivals, crises, legacy</strong></div>
          </div>
          ${saved ? `
            <div class="cr-note">
              <strong>Saved career found</strong>
              <p>${html(saved.candidate?.name)} is in ${html(saved.phase)} mode, year ${html(saved.career?.year || 2028)}.</p>
              <button class="cr-btn primary" data-load-save type="button">Resume Career</button>
            </div>
          ` : ""}
        </div>
        <form id="crSetupForm" class="cr-setup-form">
          <label><span>Candidate name</span><input name="candidateName" value="Alex Rivers" maxlength="48" required></label>
          <label><span>Age</span><input name="age" type="number" min="18" max="90" value="35"></label>
          <label><span>Home state</span><select name="homeState">${STATES.map((item) => `<option value="${item.id}" ${item.id === "pa" ? "selected" : ""}>${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Starting office</span><select name="office">${OFFICE_LADDER.filter((office) => !office.id.startsWith("appointed")).map((office) => `<option value="${office.id}" ${office.id === "schoolBoard" ? "selected" : ""}>${html(office.name)}</option>`).join("")}</select></label>
          <label><span>Party</span><select name="party">${PARTIES.map((item) => `<option value="${item.id}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Party faction</span><select name="faction">${partyFactions("democratic").map((item) => `<option>${html(item)}</option>`).join("")}</select></label>
          <label><span>Background</span><select name="background">${(DATA.backgrounds || []).map((item) => `<option value="${item.id}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Difficulty</span><select name="difficulty">${Object.entries(DIFFICULTIES).map(([id, item]) => `<option value="${id}" ${id === "intermediate" ? "selected" : ""}>${html(item.name)}</option>`).join("")}</select></label>
          <label class="wide"><span>Ideology position</span><input name="ideology" type="range" min="-25" max="25" value="-4"><em>Left/progressive to right/conservative. Your party faction still matters more than this single slider.</em></label>
          <div class="cr-note wide" id="setupReadout"></div>
          <button class="cr-btn primary wide" type="submit">Start Career</button>
        </form>
      </section>
    `;
    bindSetup();
    updateSetupReadout();
  }

  function bindSetup() {
    const form = document.querySelector("#crSetupForm");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      newGame(new FormData(form));
    });
    form?.party?.addEventListener("change", () => {
      form.faction.innerHTML = partyFactions(form.party.value).map((item) => `<option>${html(item)}</option>`).join("");
      updateSetupReadout();
    });
    form?.difficulty?.addEventListener("change", updateSetupReadout);
    form?.office?.addEventListener("change", updateSetupReadout);
    document.querySelector("[data-load-save]")?.addEventListener("click", () => {
      state = load();
      render();
    });
  }

  function updateSetupReadout() {
    const form = document.querySelector("#crSetupForm");
    const readout = document.querySelector("#setupReadout");
    if (!form || !readout) return;
    const office = byId(OFFICE_LADDER, form.office.value);
    const diff = DIFFICULTIES[form.difficulty.value];
    const partyData = byId(PARTIES, form.party.value);
    readout.innerHTML = `
      <strong>${html(office?.name || "Office")} starts as a ${html(office?.tier >= 6 ? "federal" : office?.tier >= 4 ? "state/regional" : "local")} career step.</strong>
      <p>${html(diff.text)} ${html(partyData.name)} factions: ${partyData.factions.map(html).join(", ")}.</p>
    `;
  }

  function renderShell(title, subtitle, body, mode) {
    root.innerHTML = `
      <section class="cr-game">
        <header class="cr-ribbon">
          <a class="cr-ribbon-brand" href="index.html#games">Common Pages Games</a>
          <nav>
            <button type="button" class="${state.phase === "campaign" ? "active" : ""}" data-jump-phase="campaign">Campaign</button>
            <button type="button" class="${state.phase === "governing" ? "active" : ""}" data-jump-phase="governing" ${state.governing ? "" : "disabled"}>Governing</button>
            <button type="button" data-jump-view="${state.phase === "campaign" ? "profile" : "legacy"}">Career</button>
          </nav>
          <div class="cr-ribbon-actions">
            <button class="cr-btn subtle" data-save type="button">Save</button>
            <button class="cr-btn subtle" data-new-career type="button">New Career</button>
          </div>
        </header>
        <div class="cr-title-row">
          <div>
            <p class="cr-eyebrow">${html(mode)}</p>
            <h1>${html(title)}</h1>
            <p>${html(subtitle)}</p>
          </div>
          <div class="cr-career-chip">
            <span>${html(currentOffice()?.name || state.candidate.officeName)}</span>
            <strong>${html(state.candidate.name)}</strong>
            <em>${html(party().short)} · ${html(difficulty().name)}</em>
          </div>
        </div>
        ${body}
      </section>
    `;
    bindGlobal();
  }

  function bindGlobal() {
    document.querySelector("[data-save]")?.addEventListener("click", () => {
      save();
      addLog("Career saved locally.", "system");
      render();
    });
    document.querySelector("[data-new-career]")?.addEventListener("click", () => {
      clearSave();
      state = null;
      render();
    });
    document.querySelectorAll("[data-jump-view]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.phase === "campaign") state.view = button.dataset.jumpView;
        if (state.phase === "governing") state.govView = button.dataset.jumpView;
        render();
      });
    });
    document.querySelector("[data-jump-phase='campaign']")?.addEventListener("click", () => {
      if (state.phase !== "campaign" && state.campaign) {
        state.phase = "campaign";
        render();
      }
    });
    document.querySelector("[data-jump-phase='governing']")?.addEventListener("click", () => {
      if (state.governing) {
        state.phase = "governing";
        render();
      }
    });
  }

  function renderCampaign() {
    const c = state.campaign;
    const title = `${state.candidate.name} for ${currentOffice().name}`;
    const subtitle = `Week ${c.week} of ${c.maxWeeks} · ${c.stage === "primary" ? "Primary campaign" : "General election"} · ${campaignTopline()} national support`;
    renderShell(title, subtitle, `
      ${renderCampaignMetrics()}
      <div class="cr-tab-row">${CAMPAIGN_TABS.map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-campaign-tab="${id}" type="button">${html(label)}</button>`).join("")}</div>
      ${renderCampaignTab()}
    `, "Campaign War Room");
    bindCampaign();
  }

  function renderCampaignMetrics() {
    const c = state.campaign;
    return `
      <div class="cr-metric-grid campaign">
        ${metric("Funds", money(c.funds), "Buys media, travel, research, and field operations.")}
        ${metric("Staff Hours", Math.round(c.staffHours), "Used for offices, research, registration, ads, and voter contact.")}
        ${metric("Stamina", `${Math.round(c.stamina)}%`, "If this hits zero, fatigue halves eloquence and raises gaffe risk.")}
        ${metric("Base Enthusiasm", pct(c.baseEnthusiasm), "High enthusiasm raises turnout in friendly territory.")}
        ${metric("Independents", pct(c.independentSupport), "Swing voters who punish extremes and reward competence.")}
        ${metric("Negative Tone", pct(c.negativeCampaigning), "Attack-heavy campaigns suppress opponents but can lower turnout.")}
        ${metric("Political Capital", Math.round(c.politicalCapital), "Earned by allies, fundraising, and bipartisan credibility.")}
        ${metric("Delegates", c.delegates, "Primary delegates toward nomination or convention leverage.")}
      </div>
    `;
  }

  function metric(label, value, text) {
    return `<div class="cr-metric" title="${html(text)}"><span>${html(label)}</span><strong>${html(value)}</strong><em>${html(text)}</em></div>`;
  }

  function campaignTopline() {
    const battlegrounds = state.campaign.map.filter((item) => Math.abs(item.pvi) <= 5);
    const pool = battlegrounds.length ? battlegrounds : state.campaign.map;
    const avg = pool.reduce((sum, item) => sum + item.support, 0) / pool.length;
    return pct(avg, 1);
  }

  function renderCampaignTab() {
    if (state.view === "qa") return renderQuestions();
    if (state.view === "logistics") return renderLogistics();
    if (state.view === "ads") return renderMicroTargeting();
    if (state.view === "primary") return renderPrimary();
    if (state.view === "profile") return renderProfile();
    return renderWarRoomMap();
  }

  function renderWarRoomMap() {
    const c = state.campaign;
    const selectedState = getCampaignState(c.selectedStateId);
    const selectedMarket = getSelectedMarket();
    return `
      <section class="cr-war-room">
        <div class="cr-map-panel">
          <div class="cr-panel-head">
            <div>
              <h2>War Room Map</h2>
              <p>Toggle overlays, zoom from national state tiles to media markets and precinct blocks, then spend actions where the math matters.</p>
            </div>
            <div class="cr-control-line">
              <label>Overlay <select data-map-overlay>${["partisan", "enthusiasm", "footprint", "ads"].map((id) => `<option value="${id}" ${c.overlay === id ? "selected" : ""}>${overlayName(id)}</option>`).join("")}</select></label>
              <label>Zoom <select data-map-zoom>${["national", "media", "precinct"].map((id) => `<option value="${id}" ${c.zoom === id ? "selected" : ""}>${zoomName(id)}</option>`).join("")}</select></label>
            </div>
          </div>
          <div class="cr-state-map ${html(c.overlay)}">
            ${c.map.map((item) => `<button type="button" class="cr-state-tile ${item.id === c.selectedStateId ? "selected" : ""}" data-state-id="${item.id}" style="${tileStyle(item)}">
              <span>${html(item.abbreviation)}</span>
              <strong>${Math.round(tileValue(item))}</strong>
              <em>${html(tileCaption(item))}</em>
            </button>`).join("")}
          </div>
          <div class="cr-map-detail">
            <h3>${html(selectedState?.name || "State")} Detail</h3>
            <p>PVI ${signed(selectedState?.pvi || 0)} · support ${pct(selectedState?.support || 0, 1)} · enthusiasm ${pct(selectedState?.enthusiasm || 0, 1)} · footprint ${Math.round(selectedState?.footprint || 0)} · ads ${Math.round(selectedState?.adSaturation || 0)}</p>
            ${renderZoomLayer(selectedState, selectedMarket)}
          </div>
        </div>
        <aside class="cr-action-ledger">
          <h2>Action Ledger</h2>
          <p>Remaining week resources: ${money(c.funds)}, ${Math.round(c.staffHours)} staff hours, ${Math.round(c.stamina)} stamina.</p>
          ${CAMPAIGN_ACTIONS.map((action) => renderCampaignAction(action)).join("")}
          <button class="cr-btn primary full" data-advance-week type="button">${c.week >= c.maxWeeks ? "Election Night" : "Advance Week"}</button>
        </aside>
      </section>
    `;
  }

  function overlayName(id) {
    return {
      partisan: "Partisan Lean",
      enthusiasm: "Voter Enthusiasm Index",
      footprint: "Campaign Footprint",
      ads: "Advertising Saturation"
    }[id] || id;
  }

  function zoomName(id) {
    return {
      national: "50-State Overview",
      media: "Media Markets",
      precinct: "Precinct Blocks"
    }[id] || id;
  }

  function tileValue(item) {
    if (state.campaign.overlay === "enthusiasm") return item.enthusiasm;
    if (state.campaign.overlay === "footprint") return item.footprint;
    if (state.campaign.overlay === "ads") return item.adSaturation;
    return item.support;
  }

  function tileCaption(item) {
    if (state.campaign.overlay === "enthusiasm") return "enthusiasm";
    if (state.campaign.overlay === "footprint") return `${item.offices} offices`;
    if (state.campaign.overlay === "ads") return "ad saturation";
    return item.pvi === 0 ? "tossup" : `${item.pvi > 0 ? "R" : "D"}+${Math.abs(item.pvi)}`;
  }

  function tileStyle(item) {
    const value = tileValue(item);
    let hue = 190;
    if (state.campaign.overlay === "partisan") hue = item.support >= 50 ? 163 : 5;
    if (state.campaign.overlay === "enthusiasm") hue = 42;
    if (state.campaign.overlay === "footprint") hue = 205;
    if (state.campaign.overlay === "ads") hue = 270;
    const light = clamp(88 - Math.abs(value - 50) * 0.8, 36, 82);
    const saturation = clamp(34 + Math.abs(value - 50) * 0.9, 28, 82);
    return `background:hsl(${hue} ${saturation}% ${light}%);`;
  }

  function renderZoomLayer(selectedState, selectedMarket) {
    if (!selectedState) return "";
    if (state.campaign.zoom === "national") {
      return `<p class="cr-mini-note">National overview shows all 50 states. Select a state, then change zoom to media markets or precincts.</p>`;
    }
    if (state.campaign.zoom === "media") {
      return `
        <div class="cr-market-grid">
          ${selectedState.markets.map((market) => `<button class="${market.id === state.campaign.selectedMarketId ? "selected" : ""}" data-market-id="${market.id}" type="button">
            <strong>${html(market.name)}</strong>
            <span>${html(market.counties)}</span>
            <em>Cost x${market.cost.toFixed(2)} · lean ${signed(market.lean)} · ads ${Math.round(market.saturation)}</em>
          </button>`).join("")}
        </div>
      `;
    }
    const precincts = generatePrecincts(selectedMarket || selectedState.markets[0]);
    return `
      <div class="cr-precinct-grid">
        ${precincts.map((precinct) => `<div style="background:hsl(${precinct.lean < 0 ? 205 : 7} 45% ${clamp(82 - Math.abs(precinct.lean), 46, 82)}%)">
          <strong>${html(precinct.name)}</strong>
          <span>${precinct.voters.toLocaleString()} voters</span>
          <em>${signed(precinct.lean)} PVI · ${Math.round(precinct.contacted)}% contacted</em>
        </div>`).join("")}
      </div>
    `;
  }

  function renderCampaignAction(action) {
    const c = state.campaign;
    const disabled = c.funds < action.cost || c.staffHours < action.staff || c.stamina < action.stamina;
    return `
      <article class="cr-ledger-action">
        <h3>${html(action.name)}</h3>
        <p>${html(action.text)}</p>
        <span>${money(action.cost)} · ${action.staff} staff · ${action.stamina} stamina</span>
        <button class="cr-btn ${disabled ? "subtle" : "secondary"} full" data-campaign-action="${action.id}" ${disabled ? "disabled" : ""} type="button">Do This Here</button>
      </article>
    `;
  }

  function renderQuestions() {
    const c = state.campaign;
    const available = QUESTION_BANK.filter((q) => !q.federalOnly || isFederalOffice()).filter((q) => !c.answered.includes(q.id));
    const active = byId(QUESTION_BANK, c.activeQuestionId) || available[0];
    return `
      <section class="cr-qa-layout">
        <div class="cr-question-panel">
          <p class="cr-eyebrow">Question-and-Answer Engine</p>
          <h2>${html(active?.title || "Press Pool Cleared")}</h2>
          <p>${html(active?.text || "Every prepared prompt has been answered. Advance the week or use logistics to change the map.")}</p>
          ${active ? `
            <div class="cr-formula">Delta Support = (Base Weight x Ideology Match) + (Eloquence Check x RNG) + Regional Modifier</div>
            <div class="cr-answer-list">
              ${active.options.map((option, index) => renderAnswerOption(active, option, index)).join("")}
            </div>
          ` : ""}
        </div>
        <aside class="cr-qa-side">
          <h2>Hidden Checks</h2>
          <p>Eloquence: ${Math.round(effectiveEloquence())}. Policy expertise: ${Math.round(state.candidate.stats.policy)}. Fatigue: ${Math.round(state.candidate.fatigue)}.</p>
          <p>Critical success can double positive modifiers and grant a temporary media darling fundraising lift. A gaffe can override the chosen response and force cleanup pressure.</p>
          ${c.lastQuestionResult ? `
            <div class="cr-result-note ${c.lastQuestionResult.kind}">
              <strong>${html(c.lastQuestionResult.title)}</strong>
              <p>${html(c.lastQuestionResult.text)}</p>
            </div>
          ` : ""}
        </aside>
      </section>
    `;
  }

  function renderAnswerOption(question, option, index) {
    const locked = option.locked && state.candidate.stats[option.locked.stat] < option.locked.min;
    const lockText = locked ? `Locked: requires ${option.locked.stat} ${option.locked.min}+` : effectPreview(option);
    return `
      <button class="cr-answer" data-answer-index="${index}" ${locked ? "disabled" : ""} type="button">
        <span>${html(option.type)}</span>
        <strong>${html(option.label)}</strong>
        <em>${html(lockText)}</em>
      </button>
    `;
  }

  function effectPreview(option) {
    const bits = [];
    if (option.base) bits.push(`${signed(option.base)} base`);
    if (option.independents) bits.push(`${signed(option.independents)} independents`);
    if (option.enthusiasm) bits.push(`${signed(option.enthusiasm)} enthusiasm`);
    if (option.negative) bits.push(`${signed(option.negative)} negative`);
    if (option.expertise) bits.push(`${signed(option.expertise)} universal`);
    return bits.join(" · ") || "Situational effect";
  }

  function effectiveEloquence() {
    const fatiguePenalty = state.candidate.fatigue >= 50 ? 24 : state.candidate.fatigue >= 25 ? 10 : 0;
    return clamp(state.candidate.stats.eloquence - fatiguePenalty, 10, 100);
  }

  function renderLogistics() {
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Campaign Logistics</h2>
          <p>Every week refreshes some funds and staff. Physical travel burns stamina. If stamina reaches zero, your next Q&A turn is much more likely to become a gaffe.</p>
          <div class="cr-list-table">
            ${CAMPAIGN_ACTIONS.map((action) => `<div><strong>${html(action.name)}</strong><span>${money(action.cost)} · ${action.staff} staff · ${action.stamina} stamina</span><button data-campaign-action="${action.id}" type="button">Assign</button></div>`).join("")}
          </div>
        </article>
        <article class="cr-panel">
          <h2>Operations</h2>
          <div class="cr-operation-grid">
            ${operation("Grassroots Mobilization", "Field offices raise local turnout and leave a campaign footprint.", state.campaign.map.reduce((sum, item) => sum + item.offices, 0))}
            ${operation("Opposition Research", "Unlock vulnerabilities for attack answers and debate pressure.", state.campaign.oppoResearch)}
            ${operation("Voter Registration", "Permanent demographic changes help friendly groups over time.", Math.round(avgMap("registration")))}
            ${operation("Fatigue Risk", "Overworking lowers eloquence and raises gaffe probability.", Math.round(state.candidate.fatigue))}
          </div>
          <button class="cr-btn primary full" data-advance-week type="button">${state.campaign.week >= state.campaign.maxWeeks ? "Election Night" : "Advance Week"}</button>
        </article>
      </section>
    `;
  }

  function operation(title, text, value) {
    return `<div><span>${html(title)}</span><strong>${html(value)}</strong><p>${html(text)}</p></div>`;
  }

  function avgMap(key) {
    return state.campaign.map.reduce((sum, item) => sum + (item[key] || 0), 0) / state.campaign.map.length;
  }

  function renderMicroTargeting() {
    const c = state.campaign;
    const selectedState = getCampaignState(c.selectedStateId);
    return `
      <section class="cr-grid two">
        <form class="cr-panel cr-target-form" id="microTargetForm">
          <h2>Micro-Targeting Matrix</h2>
          <p>Build ads by market, demographic cross-section, message, and spend. Alignment with your record and Q&A answers determines efficiency.</p>
          <label>Media market <select name="market">${selectedState.markets.map((market) => `<option value="${market.id}" ${c.microTarget.market === market.id ? "selected" : ""}>${html(market.name)}</option>`).join("")}</select></label>
          <label>Target voters <select name="demo">${DEMOS.map((item) => `<option ${c.microTarget.demo === item ? "selected" : ""}>${html(item)}</option>`).join("")}</select></label>
          <label>Message <select name="message">${AD_MESSAGES.map((item) => `<option ${c.microTarget.message === item ? "selected" : ""}>${html(item)}</option>`).join("")}</select></label>
          <label>Spend <input name="spend" type="range" min="10000" max="250000" step="5000" value="${c.microTarget.spend}"><em>${money(c.microTarget.spend)}</em></label>
          <button class="cr-btn primary" type="submit">Place Ad Buy</button>
        </form>
        <article class="cr-panel">
          <h2>Ad Market Pressure</h2>
          <p>Ad costs rise as election day approaches and as saturation grows in the same market.</p>
          <div class="cr-list-table">
            ${selectedState.markets.map((market) => `<div><strong>${html(market.name)}</strong><span>Cost x${adCost(market).toFixed(2)} · saturation ${Math.round(market.saturation)}</span><button data-market-id="${market.id}" type="button">Inspect</button></div>`).join("")}
          </div>
        </article>
      </section>
    `;
  }

  function adCost(market) {
    const weekPressure = 1 + state.campaign.week / state.campaign.maxWeeks * 0.65;
    return market.cost * weekPressure * (1 + market.saturation / 180) * difficulty().adCost;
  }

  function renderPrimary() {
    const c = state.campaign;
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Primary Calendar</h2>
          <p>Early overperformance creates momentum for fundraising and name recognition. Falling short before Super Tuesday can force a suspension.</p>
          <div class="cr-calendar">
            ${c.primaryCalendar.map((contest) => `<div class="${contest.status}">
              <span>Week ${contest.week}</span>
              <strong>${html(contest.name)}</strong>
              <em>${contest.delegates} delegates · expectation ${contest.expectation}</em>
              <button data-primary-contest="${contest.id}" ${contest.status !== "pending" || c.week < contest.week ? "disabled" : ""} type="button">${contest.status === "pending" ? "Compete" : html(contest.status)}</button>
            </div>`).join("")}
          </div>
        </article>
        <article class="cr-panel">
          <h2>Party Convention</h2>
          <p>If no candidate has a majority, the convention becomes a negotiation floor. Offer platform planks, cabinet slots, or debt relief to secure delegate blocks.</p>
          ${party().factions.map((faction) => `<div class="cr-deal-row"><strong>${html(faction)}</strong><span>${Math.round(28 + Math.random() * 42)}% influence</span><button data-convention-deal="${html(faction)}" type="button">Offer Deal</button></div>`).join("")}
          <div class="cr-result-note">
            <strong>Delegates: ${c.delegates} / ${c.delegateGoal}</strong>
            <p>Momentum multiplier: x${c.momentum.toFixed(2)}. Convention deals logged: ${c.convention.deals.length}.</p>
          </div>
        </article>
      </section>
    `;
  }

  function renderProfile() {
    const stats = state.candidate.stats;
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Candidate File</h2>
          <p>${html(state.candidate.name)} · age ${state.candidate.age} · ${html(party().name)} · ${html(state.candidate.faction)} · home state ${html(homeState()?.name)}.</p>
          ${Object.entries(stats).map(([key, value]) => meter(labelize(key), value, 100)).join("")}
        </article>
        <article class="cr-panel">
          <h2>Campaign Memory</h2>
          <div class="cr-log">${state.log.slice(0, 18).map((entry) => `<p><strong>${html(entry.type)}</strong> ${html(entry.text)}</p>`).join("")}</div>
        </article>
      </section>
    `;
  }

  function labelize(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  }

  function meter(label, value, max = 100) {
    const width = clamp(value / max * 100, 0, 100);
    return `<div class="cr-meter"><div><span>${html(label)}</span><strong>${Math.round(value)}</strong></div><i><b style="width:${width}%"></b></i></div>`;
  }

  function bindCampaign() {
    document.querySelectorAll("[data-campaign-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.campaignTab;
        save();
        render();
      });
    });
    document.querySelector("[data-map-overlay]")?.addEventListener("change", (event) => {
      state.campaign.overlay = event.target.value;
      render();
    });
    document.querySelector("[data-map-zoom]")?.addEventListener("change", (event) => {
      state.campaign.zoom = event.target.value;
      render();
    });
    document.querySelectorAll("[data-state-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.campaign.selectedStateId = button.dataset.stateId;
        const selected = getCampaignState(button.dataset.stateId);
        state.campaign.selectedMarketId = selected?.markets?.[0]?.id || "metro";
        render();
      });
    });
    document.querySelectorAll("[data-market-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.campaign.selectedMarketId = button.dataset.marketId;
        render();
      });
    });
    document.querySelectorAll("[data-campaign-action]").forEach((button) => {
      button.addEventListener("click", () => doCampaignAction(button.dataset.campaignAction));
    });
    document.querySelectorAll("[data-answer-index]").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(Number(button.dataset.answerIndex)));
    });
    document.querySelector("[data-advance-week]")?.addEventListener("click", advanceCampaignWeek);
    document.querySelector("#microTargetForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      placeMicroAd(new FormData(event.currentTarget));
    });
    document.querySelector("#microTargetForm input[name='spend']")?.addEventListener("input", (event) => {
      event.target.nextElementSibling.textContent = money(Number(event.target.value));
    });
    document.querySelectorAll("[data-primary-contest]").forEach((button) => {
      button.addEventListener("click", () => competePrimary(button.dataset.primaryContest));
    });
    document.querySelectorAll("[data-convention-deal]").forEach((button) => {
      button.addEventListener("click", () => conventionDeal(button.dataset.conventionDeal));
    });
  }

  function getCampaignState(id) {
    return state.campaign.map.find((item) => item.id === id) || state.campaign.map[0];
  }

  function getSelectedMarket() {
    const selectedState = getCampaignState(state.campaign.selectedStateId);
    return selectedState?.markets?.find((market) => market.id === state.campaign.selectedMarketId) || selectedState?.markets?.[0];
  }

  function doCampaignAction(actionId) {
    const action = CAMPAIGN_ACTIONS.find((item) => item.id === actionId);
    const c = state.campaign;
    const mapState = getCampaignState(c.selectedStateId);
    if (!action || c.funds < action.cost || c.staffHours < action.staff || c.stamina < action.stamina) return;
    c.funds -= action.cost;
    c.staffHours -= action.staff;
    c.stamina -= action.stamina;
    state.candidate.fatigue = clamp(state.candidate.fatigue + action.stamina * 0.45 - (action.effects.stamina || 0), 0, 100);
    if (action.effects.footprint) {
      mapState.footprint = clamp(mapState.footprint + action.effects.footprint, 0, 100);
      mapState.offices += action.id === "fieldOffice" ? 1 : 0;
    }
    if (action.effects.turnout) mapState.turnout = clamp(mapState.turnout + action.effects.turnout, 20, 92);
    if (action.effects.registration) {
      mapState.registration = clamp(mapState.registration + action.effects.registration, 0, 100);
      mapState.support = clamp(mapState.support + action.effects.registration * 0.08, 5, 95);
    }
    if (action.effects.enthusiasm) {
      c.baseEnthusiasm = clamp(c.baseEnthusiasm + action.effects.enthusiasm, 5, 100);
      mapState.enthusiasm = clamp(mapState.enthusiasm + action.effects.enthusiasm * 0.5, 5, 100);
    }
    if (action.effects.independents) c.independentSupport = clamp(c.independentSupport + action.effects.independents, 5, 95);
    if (action.effects.base) c.baseEnthusiasm = clamp(c.baseEnthusiasm + action.effects.base, 5, 100);
    if (action.effects.trust) c.independentSupport = clamp(c.independentSupport + action.effects.trust * 0.8, 5, 95);
    if (action.effects.money) c.funds += action.effects.money;
    if (action.effects.pc) c.politicalCapital += action.effects.pc;
    if (action.effects.network) state.career.network += action.effects.network;
    if (action.effects.eloquence) state.candidate.stats.eloquence = clamp(state.candidate.stats.eloquence + action.effects.eloquence, 1, 100);
    if (action.effects.gaffeShield) c.gaffeShield = clamp(c.gaffeShield + action.effects.gaffeShield, 0, 40);
    if (action.effects.oppo) c.oppoResearch = clamp(c.oppoResearch + action.effects.oppo, 0, 100);
    if (action.effects.negative) c.negativeCampaigning = clamp(c.negativeCampaigning + action.effects.negative, 0, 100);
    addLog(`${action.name} in ${mapState.name}: ${action.text}`, "action");
    save();
    render();
  }

  function answerQuestion(index) {
    const c = state.campaign;
    const available = QUESTION_BANK.filter((q) => !q.federalOnly || isFederalOffice()).filter((q) => !c.answered.includes(q.id));
    const question = byId(QUESTION_BANK, c.activeQuestionId) || available[0];
    const option = question?.options?.[index];
    if (!question || !option) return;
    const eloquence = effectiveEloquence();
    const rng = Math.random() * 10 - 3;
    const gaffeChance = clamp((100 - eloquence) * 0.0035 * difficulty().gaffe - c.gaffeShield * 0.003 + state.candidate.fatigue * 0.002, 0.02, 0.32);
    const critChance = clamp(eloquence * 0.0019 + state.candidate.stats.policy * 0.0007, 0.03, 0.24);
    const ideologyMatch = 1 - Math.abs(state.candidate.ideology) / 60;
    const regionalModifier = option.regional || 0;
    let supportDelta = (option.baseWeight * option.ideology * ideologyMatch) + (eloquence / 100 * rng) + regionalModifier;
    let kind = "normal";
    let title = "Answer Landed";
    let text = `${option.type}: ${option.label}`;
    if (Math.random() < gaffeChance) {
      kind = "gaffe";
      title = "Gaffe Failure";
      text = "The answer stumbled in delivery. Reporters focus on the mistake instead of the message, and cleanup questions will follow.";
      supportDelta = -4.8 - Math.random() * 3;
      c.negativeCampaigning = clamp(c.negativeCampaigning + 4, 0, 100);
      c.baseEnthusiasm = clamp(c.baseEnthusiasm - 2, 0, 100);
      c.independentSupport = clamp(c.independentSupport - 3, 0, 100);
      state.candidate.traits = [...new Set([...state.candidate.traits, "Press Cleanup Mode"])];
    } else if (Math.random() < critChance) {
      kind = "critical";
      title = "Critical Success";
      text = "The line lands cleanly. Positive modifiers are doubled and donors notice the clip.";
      supportDelta *= 2;
      c.funds += 28000;
      state.candidate.traits = [...new Set([...state.candidate.traits, "Media Darling"])];
    }
    c.baseEnthusiasm = clamp(c.baseEnthusiasm + (option.base || 0) + (option.enthusiasm || 0) * 0.35, 0, 100);
    c.independentSupport = clamp(c.independentSupport + (option.independents || 0) + (option.expertise || 0), 0, 100);
    c.oppositionBase = clamp(c.oppositionBase - (option.opponentSuppression || 0), 0, 100);
    c.negativeCampaigning = clamp(c.negativeCampaigning + (option.negative || 0), 0, 100);
    c.gaffeShield = clamp(c.gaffeShield - 5, 0, 40);
    const selectedState = getCampaignState(c.selectedStateId);
    selectedState.support = clamp(selectedState.support + supportDelta, 5, 95);
    selectedState.enthusiasm = clamp(selectedState.enthusiasm + (option.enthusiasm || 0) * 0.25, 0, 100);
    c.answered.push(question.id);
    c.activeQuestionId = null;
    c.lastQuestionResult = { kind, title, text: `${text} Net local movement: ${signed(supportDelta, " pts")}.` };
    addLog(`${title}: ${question.title}. ${c.lastQuestionResult.text}`, kind);
    save();
    render();
  }

  function placeMicroAd(form) {
    const c = state.campaign;
    const selectedState = getCampaignState(c.selectedStateId);
    const market = selectedState.markets.find((item) => item.id === form.get("market")) || selectedState.markets[0];
    const spend = Number(form.get("spend") || 50000);
    const realCost = spend * adCost(market);
    if (c.funds < realCost || c.staffHours < 8) return;
    c.funds -= realCost;
    c.staffHours -= 8;
    c.microTarget = { market: market.id, demo: form.get("demo"), message: form.get("message"), spend };
    const alignment = adAlignment(c.microTarget.message);
    const effect = clamp(spend / 50000 * alignment / adCost(market), 0.4, 6);
    market.saturation = clamp(market.saturation + spend / 7000, 0, 100);
    selectedState.adSaturation = clamp(selectedState.adSaturation + spend / 9000, 0, 100);
    selectedState.support = clamp(selectedState.support + effect, 5, 95);
    selectedState.enthusiasm = clamp(selectedState.enthusiasm + effect * 0.7, 0, 100);
    addLog(`Micro-targeted ${form.get("demo")} in ${market.name} with ${form.get("message")} for ${money(realCost)}. Movement: ${signed(effect, " pts")}.`, "ads");
    save();
    render();
  }

  function adAlignment(message) {
    const record = state.governing?.passedBills?.length || 0;
    const qas = state.campaign.answered.length;
    let score = 1 + qas * 0.035 + record * 0.05;
    if (message.includes("Anti-corruption") && state.candidate.traits.includes("Media Darling")) score += 0.2;
    if (message.includes("Public safety") && state.candidate.ideology < -15) score -= 0.15;
    return clamp(score, 0.65, 1.45);
  }

  function competePrimary(id) {
    const contest = state.campaign.primaryCalendar.find((item) => item.id === id);
    if (!contest || contest.status !== "pending") return;
    const performance = clamp(campaignToplineNumber() + state.campaign.momentum * 6 + Math.random() * 18 - 9 - difficulty().supportPenalty, 5, 95);
    const won = performance >= 50;
    const delegates = Math.round(contest.delegates * clamp(performance / 100, 0.05, 0.8));
    contest.status = won ? "won" : "survived";
    state.campaign.delegates += delegates;
    state.career.delegatesWon += delegates;
    state.campaign.momentum = clamp(state.campaign.momentum + (performance - contest.expectation) / 60, 0.55, 2.2);
    state.campaign.funds += Math.round((won ? 70000 : 24000) * state.campaign.momentum);
    addLog(`${contest.name}: ${Math.round(performance)}% performance, ${delegates} delegates, momentum x${state.campaign.momentum.toFixed(2)}.`, "primary");
    save();
    render();
  }

  function campaignToplineNumber() {
    return Number(campaignTopline().replace("%", ""));
  }

  function conventionDeal(faction) {
    const cost = 10 + state.campaign.convention.deals.length * 4;
    if (state.campaign.politicalCapital < cost) return;
    state.campaign.politicalCapital -= cost;
    const delegates = Math.round(30 + Math.random() * 90);
    state.campaign.delegates += delegates;
    state.campaign.convention.deals.push({ faction, delegates, text: `Promised ${faction} a platform plank or future appointment.` });
    state.world.memory.push(`${faction} received a convention promise in ${state.career.year}.`);
    addLog(`Backroom convention deal with ${faction}: +${delegates} delegates for ${cost} political capital.`, "deal");
    save();
    render();
  }

  function advanceCampaignWeek() {
    const c = state.campaign;
    if (c.week >= c.maxWeeks) {
      runElection();
      return;
    }
    c.week += 1;
    c.funds += Math.round((14000 + state.career.network * 230 + c.momentum * 9000) * difficulty().money);
    c.staffHours = Math.round(clamp(c.staffHours + 42 * difficulty().staff, 20, 220));
    c.stamina = clamp(c.stamina + 20 - state.candidate.fatigue * 0.08, 0, 100);
    state.candidate.fatigue = clamp(state.candidate.fatigue - 14, 0, 100);
    c.map.forEach((item) => {
      const opp = difficulty().opposition * (0.25 + Math.random() * 0.55);
      item.support = clamp(item.support - opp + item.footprint * 0.012 + item.registration * 0.015, 5, 95);
      item.adSaturation = clamp(item.adSaturation - 2, 0, 100);
      item.markets.forEach((market) => market.saturation = clamp(market.saturation - 3, 0, 100));
    });
    if (Math.random() < 0.28 * difficulty().crisis) triggerCampaignQuestion();
    addLog(`Week ${c.week} begins. Ad prices are rising and opposition field pressure increases.`, "calendar");
    save();
    render();
  }

  function triggerCampaignQuestion() {
    const available = QUESTION_BANK.filter((q) => !q.federalOnly || isFederalOffice()).filter((q) => !state.campaign.answered.includes(q.id));
    if (available.length) state.campaign.activeQuestionId = pick(available).id;
  }

  function runElection() {
    const c = state.campaign;
    const home = getCampaignState(state.candidate.homeStateId);
    const base = campaignToplineNumber();
    const enthusiasm = (c.baseEnthusiasm - 50) * 0.09;
    const independents = (c.independentSupport - 50) * 0.16;
    const footprint = avgMap("footprint") * 0.05;
    const negative = -c.negativeCampaigning * 0.035;
    const stamina = c.stamina < 25 ? -2.5 : 0.8;
    const error = Math.random() * 7 - 3.5;
    const finalShare = clamp((base * 0.55 + home.support * 0.45) + enthusiasm + independents + footprint + negative + stamina + error - difficulty().supportPenalty * 0.45, 20, 80);
    const won = finalShare >= 50;
    const votes = Math.round(300000 * (currentOffice().campaignScale || 1) + Math.random() * 240000);
    state.results = {
      won,
      playerShare: finalShare,
      opponentShare: 100 - finalShare,
      playerVotes: Math.round(votes * finalShare / 100),
      opponentVotes: Math.round(votes * (100 - finalShare) / 100),
      margin: finalShare - (100 - finalShare),
      notes: buildElectionNotes(finalShare)
    };
    if (won) state.career.electionsWon += 1;
    else state.career.electionsLost += 1;
    state.phase = "results";
    addLog(`${won ? "Won" : "Lost"} the election by ${Math.abs(state.results.margin).toFixed(1)} percentage points.`, "election");
    save();
    render();
  }

  function buildElectionNotes(finalShare) {
    const notes = [];
    if (state.campaign.baseEnthusiasm >= 65) notes.push("Base enthusiasm created a turnout cushion in friendly areas.");
    if (state.campaign.independentSupport >= 55) notes.push("Independent voters responded to the campaign's competence frame.");
    if (state.campaign.negativeCampaigning >= 30) notes.push("Negative campaigning suppressed the opponent but also hardened media coverage.");
    if (state.candidate.fatigue >= 45) notes.push("Fatigue made late answers riskier and weakened the closing schedule.");
    if (avgMap("footprint") >= 12) notes.push("Field offices converted staff hours into durable local turnout.");
    if (finalShare < 50) notes.push("The map demanded more persuasion or turnout than the campaign could deliver.");
    return notes;
  }

  function renderResults() {
    const r = state.results;
    renderShell(r.won ? "Election Night: Victory" : "Election Night: Defeat", `${state.candidate.name} ${r.won ? "won" : "lost"} by ${Math.abs(r.margin).toFixed(1)} percentage points.`, `
      <section class="cr-results">
        <div class="cr-result-board ${r.won ? "won" : "lost"}">
          <div><span>${html(state.candidate.name)}</span><strong>${pct(r.playerShare, 1)}</strong><em>${r.playerVotes.toLocaleString()} votes</em></div>
          <div><span>Opponent</span><strong>${pct(r.opponentShare, 1)}</strong><em>${r.opponentVotes.toLocaleString()} votes</em></div>
        </div>
        <div class="cr-grid two">
          <article class="cr-panel"><h2>Post-Election Analysis</h2>${r.notes.map((note) => `<p>${html(note)}</p>`).join("")}</article>
          <article class="cr-panel"><h2>Next Step</h2><p>${r.won ? "Winning office pauses the campaign engine and opens the governing dashboard. Your record will shape the next election." : "A loss does not end the career. You can rebuild, seek an appointment, or start a new race."}</p><button class="cr-btn primary" data-begin-governing type="button" ${r.won ? "" : "disabled"}>Begin Governing</button><button class="cr-btn secondary" data-next-campaign type="button">Run Again</button></article>
        </div>
      </section>
    `, "Election Night");
    document.querySelector("[data-begin-governing]")?.addEventListener("click", beginGoverning);
    document.querySelector("[data-next-campaign]")?.addEventListener("click", () => {
      launchNextCampaign(false);
    });
  }

  function beginGoverning() {
    const office = currentOffice();
    state.phase = "governing";
    state.govView = "dashboard";
    state.career.officesHeld = [...new Set([...state.career.officesHeld, office.name])];
    state.governing = {
      month: 1,
      termMonths: office.id === "president" ? 48 : office.tier >= 7 ? 48 : office.tier >= 4 ? 24 : 18,
      budget: Math.round(140 * (office.governingPower || 1)),
      deficit: 0,
      pc: state.campaign.politicalCapital + 10,
      approval: {
        base: clamp(state.campaign.baseEnthusiasm + 6, 5, 95),
        independents: clamp(state.campaign.independentSupport + 2, 5, 95),
        opposition: clamp(28 - difficulty().supportPenalty, 5, 60)
      },
      economy: {
        unemployment: state.world.unemployment,
        inflation: state.world.inflation,
        income: state.world.medianIncome
      },
      selectedFolder: "briefing",
      selectedBillId: null,
      selectedLegislatorId: null,
      draft: defaultDraft(),
      bills: initialBills(),
      chamber: generateChamber(),
      passedBills: [],
      failedBills: [],
      officeScene: office.tier >= 9 ? "oval office" : office.tier >= 7 ? "governor suite" : office.tier >= 4 ? "capitol office" : "local office",
      crisis: null
    };
    addLog("The campaign is over. Governing begins with a budget, a chamber, and promises that now require votes.", "governing");
    save();
    render();
  }

  function defaultDraft() {
    return {
      sector: "healthcare",
      architecture: "Public Option",
      payrollTax: 1.2,
      corporateTax: 1.5,
      deficitSpend: 0.8,
      mandates: ["Pre-existing condition protections"],
      brackets: [8, 10, 14, 18, 23, 29, 35],
      capitalGains: 22,
      corporateRate: 24,
      credits: ["Child Tax Credit"],
      defense: { readiness: 35, cyber: 20, nuclear: 15, personnel: 30 },
      treaties: "Targeted sanctions and trade enforcement",
      intervention: 20,
      zoning: 55,
      transit: 35,
      roads: 35,
      utilities: 30,
      title: "Public Services and Affordability Act"
    };
  }

  function initialBills() {
    return [
      makeBill("schoolMeals", "Universal School Meals Act", "Education", 28, "A nutrition and attendance bill for public schools.", "introduced"),
      makeBill("permitStreamline", "Small Business Permit Streamlining Act", "Economy", 18, "Opposition-backed permit simplification and deadline bill.", "opposition"),
      makeBill("ethics", "Open Meetings and Ethics Commission Act", "Government", 16, "Creates public reporting, gift rules, and independent review.", "introduced")
    ];
  }

  function makeBill(id, title, sector, cost, summary, sponsor = "player") {
    return {
      id,
      title,
      sector,
      cost,
      summary,
      sponsor,
      momentum: sponsor === "opposition" ? 42 : 50,
      status: "Introduced",
      legalText: `Section 1. Short title. This Act may be cited as the ${title}. Section 2. Findings. The public interest requires transparent goals, funding sources, implementation rules, and review. Section 3. Appropriation and authority. Agencies may issue rules consistent with this Act.`,
      amendments: []
    };
  }

  function generateChamber() {
    const size = currentOffice().tier >= 8 ? 100 : currentOffice().tier >= 4 ? 80 : 31;
    return Array.from({ length: size }, (_, index) => {
      const memberParty = index % 5 === 0 ? "independent" : index < size * 0.52 ? state.candidate.partyId : (state.candidate.partyId === "republican" ? "democratic" : "republican");
      const pvi = Math.round(Math.random() * 30 - 15 + (memberParty === "republican" ? 4 : memberParty === "democratic" ? -4 : 0));
      return {
        id: `leg-${index}`,
        name: `${pick(NAMES.first)} ${pick(NAMES.last)}`,
        partyId: memberParty,
        district: `District ${index + 1}`,
        ideologyX: clamp((memberParty === "republican" ? 35 : memberParty === "democratic" ? -35 : 0) + Math.random() * 30 - 15, -60, 60),
        ideologyY: clamp(Math.random() * 70 - 35, -60, 60),
        vulnerability: clamp(60 - Math.abs(pvi) + Math.random() * 25, 5, 95),
        pvi,
        localApproval: clamp(45 + Math.random() * 25, 20, 90),
        trust: clamp(44 + Math.random() * 28 + (memberParty === state.candidate.partyId ? 12 : -8), 0, 100),
        fear: clamp(18 + Math.random() * 45, 0, 100),
        petProject: pick(["bridge funding", "research center", "hospital grant", "port repairs", "rural broadband", "workforce campus"]),
        vote: "undecided",
        memory: []
      };
    });
  }

  function renderGoverning() {
    const approval = aggregateApproval();
    renderShell(`${state.candidate.name} · ${currentOffice().name}`, `Month ${state.governing.month} of ${state.governing.termMonths} · approval ${pct(approval, 0)} · budget ${Math.round(state.governing.budget)} · PC ${Math.round(state.governing.pc)}`, `
      ${renderGoverningMetrics()}
      <div class="cr-tab-row">${GOVERNING_TABS.map(([id, label]) => `<button class="${state.govView === id ? "active" : ""}" data-gov-tab="${id}" type="button">${html(label)}</button>`).join("")}</div>
      ${renderGoverningTab()}
    `, "Executive Dashboard");
    bindGoverning();
  }

  function renderGoverningMetrics() {
    const g = state.governing;
    return `
      <div class="cr-metric-grid governing">
        ${metric("Party Base", pct(g.approval.base), "Approval among the voters most likely to volunteer and defend you.")}
        ${metric("Independents", pct(g.approval.independents), "Approval among persuadable voters who decide close elections.")}
        ${metric("Opposition", pct(g.approval.opposition), "Cross-party approval that can help pass bills or lower attacks.")}
        ${metric("Budget", Math.round(g.budget), "Available fiscal room for policies, deals, and crisis response.")}
        ${metric("Deficit", Math.round(g.deficit), "Overspending that raises future attack risk and economic pressure.")}
        ${metric("Political Capital", Math.round(g.pc), "Currency for pork, logrolling, pressure, and appointments.")}
        ${metric("Unemployment", pct(g.economy.unemployment, 1), "Constituency economic heat map indicator.")}
        ${metric("Inflation", pct(g.economy.inflation, 1), "Price pressure that punishes governing parties.")}
      </div>
    `;
  }

  function aggregateApproval() {
    const g = state.governing;
    return clamp(g.approval.base * 0.38 + g.approval.independents * 0.42 + g.approval.opposition * 0.2, 1, 99);
  }

  function renderGoverningTab() {
    if (state.govView === "draft") return renderDraftEngine();
    if (state.govView === "whip") return renderWhipMatrix();
    if (state.govView === "ledger") return renderLegislativeLedger(true);
    if (state.govView === "pulse") return renderPulsePanel(true);
    if (state.govView === "world") return renderWorldSimulation();
    if (state.govView === "legacy") return renderLegacy();
    return renderExecutiveDashboard();
  }

  function renderExecutiveDashboard() {
    return `
      <section class="cr-exec-dashboard">
        ${renderLegislativeLedger(false)}
        <article class="cr-office-window">
          <div class="cr-office-scene ${html(state.governing.officeScene.replace(/\s/g, "-"))}">
            <div class="cr-window-blinds"></div>
            <div class="cr-desk">
              <button data-office-folder="briefing" type="button"><span>Briefings</span></button>
              <button data-office-folder="schedule" type="button"><span>Schedule</span></button>
              <button data-office-folder="legislation" type="button"><span>Legislation</span></button>
            </div>
          </div>
          <div class="cr-office-readout">
            <h2>${html(labelize(state.governing.selectedFolder))}</h2>
            ${renderOfficeFolder()}
          </div>
          <button class="cr-btn primary full" data-advance-month type="button">${state.governing.month >= state.governing.termMonths ? "Term Review" : "Advance Month"}</button>
        </article>
        ${renderPulsePanel(false)}
      </section>
    `;
  }

  function renderOfficeFolder() {
    const folder = state.governing.selectedFolder;
    if (folder === "schedule") {
      return `<p>Morning: caucus call. Afternoon: district services review. Evening: televised interview or donor calls. You cannot do everything without burning staff trust.</p>`;
    }
    if (folder === "legislation") {
      const bill = activeBill();
      return `<p>Pending folder: ${html(bill?.title || "No player bill selected")}. Use the Draft Engine and Whip Matrix to move legislation.</p>`;
    }
    return `<p>Your chief of staff reports that the chamber is movable but transactional. The ledger is full, the opposition has its own bills, and your next campaign starts with this record.</p>`;
  }

  function renderLegislativeLedger(expanded) {
    const bills = state.governing.bills;
    return `
      <aside class="cr-ledger ${expanded ? "expanded" : ""}">
        <h2>Legislative Ledger</h2>
        <p>Live ticker of bills in the chamber. Green means passing momentum, red means stalling, amber means volatile.</p>
        <div class="cr-bill-ticker">
          ${bills.map((bill) => `<button class="${bill.momentum >= 58 ? "passing" : bill.momentum <= 42 ? "stalling" : "volatile"} ${state.governing.selectedBillId === bill.id ? "selected" : ""}" data-select-bill="${bill.id}" type="button">
            <span>${html(bill.sector)} · ${html(bill.sponsor)}</span>
            <strong>${html(bill.title)}</strong>
            <em>${html(bill.status)} · momentum ${Math.round(bill.momentum)}</em>
          </button>`).join("")}
        </div>
        ${expanded ? renderBillText(activeBill() || bills[0]) : ""}
      </aside>
    `;
  }

  function renderBillText(bill) {
    if (!bill) return "";
    return `
      <article class="cr-legal-text">
        <h3>${html(bill.title)}</h3>
        <p>${html(bill.summary)}</p>
        <pre>${html(bill.legalText)}</pre>
        <h4>Amendment Tree</h4>
        ${bill.amendments.length ? bill.amendments.map((item) => `<p><strong>${html(item.type)}</strong> ${html(item.text)}</p>`).join("") : "<p>No amendments attached.</p>"}
      </article>
    `;
  }

  function renderPulsePanel(expanded) {
    const g = state.governing;
    return `
      <aside class="cr-pulse ${expanded ? "expanded" : ""}">
        <h2>Constituent Pulse</h2>
        ${meter("Your Party Base", g.approval.base)}
        ${meter("Independents", g.approval.independents)}
        ${meter("Opposition Party", g.approval.opposition)}
        <h3>Heat Map</h3>
        <div class="cr-heat-map">
          <div><span>Unemployment</span><strong>${pct(g.economy.unemployment, 1)}</strong></div>
          <div><span>Inflation</span><strong>${pct(g.economy.inflation, 1)}</strong></div>
          <div><span>Average income</span><strong>${money(g.economy.income)}</strong></div>
        </div>
        ${expanded ? `
          <div class="cr-operation-grid">
            ${["Workers", "Parents", "Teachers", "Renters", "Homeowners", "Business owners", "Rural voters", "Civil libertarians"].map((group) => operation(group, "Approval, turnout pressure, and issue salience shift with laws and crises.", Math.round(35 + Math.random() * 45))).join("")}
          </div>
        ` : ""}
      </aside>
    `;
  }

  function renderDraftEngine() {
    const d = state.governing.draft;
    return `
      <section class="cr-draft-layout">
        <form class="cr-panel cr-draft-form" id="draftForm">
          <div class="cr-panel-head"><div><h2>Policy and Legislation Draft Engine</h2><p>Build legislation across healthcare, tax/economy, foreign policy, and local/state modules. The resulting bill enters the whip matrix.</p></div><button class="cr-btn primary" type="submit">Draft Bill</button></div>
          <label>Bill title <input name="title" value="${html(d.title)}"></label>
          <label>Active module <select name="sector">${["healthcare", "tax", "foreign", "local"].map((id) => `<option value="${id}" ${d.sector === id ? "selected" : ""}>${html(moduleName(id))}</option>`).join("")}</select></label>
          <div class="cr-module-grid">
            ${renderHealthcareModule(d)}
            ${renderTaxModule(d)}
            ${renderForeignModule(d)}
            ${renderLocalModule(d)}
          </div>
        </form>
        <aside class="cr-panel">
          <h2>Bill Score</h2>
          ${renderDraftScore()}
          <button class="cr-btn secondary full" data-send-draft type="button">Send Current Draft to Whip Matrix</button>
        </aside>
      </section>
    `;
  }

  function moduleName(id) {
    return { healthcare: "Healthcare Module", tax: "Tax and Economy Module", foreign: "Foreign Policy and Military Module", local: "Local and State Module" }[id] || id;
  }

  function renderHealthcareModule(d) {
    return `
      <fieldset>
        <legend>Healthcare</legend>
        <label>System architecture <select name="architecture">${["Single-Payer", "Public Option", "Subsidized Private Marketplace", "Fully Deregulated/Privatized"].map((item) => `<option ${d.architecture === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        ${slider("payrollTax", "Payroll tax hike", d.payrollTax, 0, 8, 0.1, "%")}
        ${slider("corporateTax", "Corporate tax adjustment", d.corporateTax, -5, 8, 0.1, "%")}
        ${slider("deficitSpend", "Deficit spending", d.deficitSpend, 0, 10, 0.1, "% GDP")}
        ${check("mandates", "Pre-existing condition protections", d.mandates.includes("Pre-existing condition protections"))}
        ${check("mandates", "Prescription drug price caps", d.mandates.includes("Prescription drug price caps"))}
        ${check("mandates", "Mental health parity", d.mandates.includes("Mental health parity"))}
      </fieldset>
    `;
  }

  function renderTaxModule(d) {
    return `
      <fieldset>
        <legend>Tax and Economy</legend>
        <div class="cr-bracket-grid">
          ${d.brackets.map((rate, index) => `<label>Bracket ${index + 1}<input name="bracket${index}" type="number" min="0" max="60" value="${rate}"><span>%</span></label>`).join("")}
        </div>
        ${slider("corporateRate", "Corporate tax rate", d.corporateRate, 0, 45, 1, "%")}
        ${slider("capitalGains", "Capital gains tax", d.capitalGains, 0, 45, 1, "%")}
        ${check("credits", "Child Tax Credit", d.credits.includes("Child Tax Credit"))}
        ${check("credits", "Green manufacturing credit", d.credits.includes("Green manufacturing credit"))}
        ${check("credits", "Small business exemption", d.credits.includes("Small business exemption"))}
      </fieldset>
    `;
  }

  function renderForeignModule(d) {
    const disabled = isFederalOffice() ? "" : "disabled";
    return `
      <fieldset class="${disabled ? "muted" : ""}">
        <legend>Foreign Policy and Military ${disabled ? "(Federal offices only)" : ""}</legend>
        ${slider("readiness", "Conventional readiness", d.defense.readiness, 0, 100, 1, "", disabled)}
        ${slider("cyber", "Cyber warfare", d.defense.cyber, 0, 100, 1, "", disabled)}
        ${slider("nuclear", "Nuclear modernization", d.defense.nuclear, 0, 100, 1, "", disabled)}
        ${slider("personnel", "Personnel benefits", d.defense.personnel, 0, 100, 1, "", disabled)}
        <label>Treaty and alliance matrix <select name="treaties" ${disabled}>${["Targeted sanctions and trade enforcement", "Mutual defense pact", "Bilateral trade agreement", "Humanitarian aid package"].map((item) => `<option ${d.treaties === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        ${slider("intervention", "Intervention level", d.intervention, 0, 100, 1, "", disabled)}
      </fieldset>
    `;
  }

  function renderLocalModule(d) {
    return `
      <fieldset>
        <legend>Local and State</legend>
        ${slider("zoning", "High-density zoning", d.zoning, 0, 100, 1, "")}
        ${slider("transit", "Public transit expansion", d.transit, 0, 100, 1, "")}
        ${slider("roads", "Road maintenance", d.roads, 0, 100, 1, "")}
        ${slider("utilities", "Utility upgrades", d.utilities, 0, 100, 1, "")}
      </fieldset>
    `;
  }

  function slider(name, label, value, min, max, step, suffix = "", disabled = "") {
    return `<label>${html(label)}<input name="${html(name)}" type="range" min="${min}" max="${max}" step="${step}" value="${html(value)}" ${disabled}><em>${html(value)}${html(suffix)}</em></label>`;
  }

  function check(name, label, checked) {
    return `<label class="cr-check"><input name="${html(name)}" type="checkbox" value="${html(label)}" ${checked ? "checked" : ""}><span>${html(label)}</span></label>`;
  }

  function renderDraftScore() {
    const score = scoreDraft(state.governing.draft);
    return `
      ${meter("Progressive support", score.progressive)}
      ${meter("Moderate support", score.moderate)}
      ${meter("Conservative support", score.conservative)}
      ${meter("Fiscal risk", score.risk)}
      <div class="cr-result-note">
        <strong>Estimated cost: ${Math.round(score.cost)}</strong>
        <p>${html(score.summary)}</p>
      </div>
    `;
  }

  function scoreDraft(d) {
    const healthcareAmbition = ["Fully Deregulated/Privatized", "Subsidized Private Marketplace", "Public Option", "Single-Payer"].indexOf(d.architecture) * 14;
    const taxProgressivity = d.brackets[6] - d.brackets[0] + d.corporateRate * 0.4 + d.capitalGains * 0.2;
    const localSpend = (d.transit + d.roads + d.utilities + d.zoning) / 8;
    const foreignSpend = isFederalOffice() ? (d.defense.readiness + d.defense.cyber + d.defense.nuclear + d.defense.personnel) / 9 : 0;
    const cost = 8 + healthcareAmbition * 0.28 + d.deficitSpend * 2.5 + localSpend * 0.7 + foreignSpend * 0.55 - d.payrollTax * 0.9 - d.corporateTax * 0.7;
    return {
      progressive: clamp(42 + healthcareAmbition * 0.75 + taxProgressivity * 0.42 + d.zoning * 0.08, 0, 100),
      moderate: clamp(66 - Math.abs(cost - 18) * 1.3 - Math.abs(d.zoning - 55) * 0.12, 0, 100),
      conservative: clamp(64 - healthcareAmbition * 0.58 - taxProgressivity * 0.52 - d.deficitSpend * 2 + (d.architecture.includes("Deregulated") ? 16 : 0), 0, 100),
      risk: clamp(cost + d.deficitSpend * 4 + Math.max(0, d.inflation || 0), 0, 100),
      cost,
      summary: "Mandates, taxes, zoning, and spending change faction support and the eventual vote count."
    };
  }

  function renderWhipMatrix() {
    const bill = activeBill() || state.governing.bills[0];
    const votes = countVotes(bill);
    const selected = state.governing.chamber.find((member) => member.id === state.governing.selectedLegislatorId) || state.governing.chamber[0];
    return `
      <section class="cr-whip-layout">
        <article class="cr-panel">
          <div class="cr-panel-head"><div><h2>Legislative Strategy and Whip Matrix</h2><p>Move votes with pork-barrel amendments, logrolling, or the bully pulpit. Trust and fear persist into future years.</p></div><button class="cr-btn primary" data-call-vote type="button">Call Vote</button></div>
          <div class="cr-vote-summary"><strong>${html(bill?.title || "No bill")}</strong><span>${votes.yes} yes · ${votes.no} no · ${votes.undecided} undecided · need ${votes.need}</span></div>
          <div class="cr-chamber-grid">
            ${state.governing.chamber.map((member) => `<button class="${member.vote} ${member.id === selected.id ? "selected" : ""}" data-legislator="${member.id}" type="button"><span>${member.partyId[0].toUpperCase()}</span><strong>${Math.round(projectMemberSupport(member, bill))}</strong><em>${member.district}</em></button>`).join("")}
          </div>
        </article>
        <aside class="cr-panel">
          <h2>Member Profile</h2>
          <p><strong>${html(selected.name)}</strong> · ${html(byId(PARTIES, selected.partyId)?.short || selected.partyId)} · ${html(selected.district)}</p>
          ${meter("Trust", selected.trust)}
          ${meter("Fear", selected.fear)}
          ${meter("Re-election vulnerability", selected.vulnerability)}
          <p>Ideology coordinates: ${Math.round(selected.ideologyX)}, ${Math.round(selected.ideologyY)}. District PVI ${signed(selected.pvi)}. Local approval ${pct(selected.localApproval)}.</p>
          <div class="cr-action-stack">
            <button data-whip-action="pork" type="button">Pork-Barrel Amendment · 6 PC</button>
            <button data-whip-action="logroll" type="button">Logrolling Promise · 4 PC</button>
            <button data-whip-action="pulpit" type="button">Bully Pulpit in District · 5 PC</button>
          </div>
        </aside>
      </section>
    `;
  }

  function activeBill() {
    return state.governing.bills.find((bill) => bill.id === state.governing.selectedBillId) || state.governing.bills[0];
  }

  function projectMemberSupport(member, bill = activeBill()) {
    if (!bill) return 0;
    const partyBoost = member.partyId === state.candidate.partyId ? 14 : member.partyId === "independent" ? 2 : -14;
    const trust = (member.trust - 50) * 0.45;
    const fear = (member.fear - 35) * 0.22;
    const momentum = (bill.momentum - 50) * 0.36;
    const vulnerability = member.vulnerability > 60 && aggregateApproval() > 55 ? 6 : 0;
    const ideologyPenalty = Math.abs(member.ideologyX - state.candidate.ideology) * 0.16;
    return clamp(50 + partyBoost + trust + fear + momentum + vulnerability - ideologyPenalty, 0, 100);
  }

  function countVotes(bill) {
    const need = Math.floor(state.governing.chamber.length / 2) + 1;
    let yes = 0;
    let no = 0;
    let undecided = 0;
    state.governing.chamber.forEach((member) => {
      const support = projectMemberSupport(member, bill);
      if (member.vote === "yes" || support >= 58) yes += 1;
      else if (member.vote === "no" || support <= 42) no += 1;
      else undecided += 1;
    });
    return { yes, no, undecided, need };
  }

  function renderWorldSimulation() {
    const w = state.world;
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>World Simulation and Dynamic AI Engine</h2>
          <p>The engine tracks ${w.totalPoliticians.toLocaleString()} simulated politicians in summary, while visible actors surface as allies, rivals, committee chairs, primary challengers, and future opponents.</p>
          <div class="cr-ai-roster">
            ${w.aiActors.slice(0, 18).map((actor) => `<div><strong>${html(actor.name)}</strong><span>${html(actor.office)} · ${html(byId(PARTIES, actor.partyId)?.short || actor.partyId)}</span><em>trust ${Math.round(actor.trust)} · grudge ${Math.round(actor.grudge)} · PAC ${money(actor.pac)}</em></div>`).join("")}
          </div>
        </article>
        <article class="cr-panel">
          <h2>Macro-Crisis Simulation</h2>
          ${w.crisis ? `<div class="cr-result-note gaffe"><strong>${html(w.crisis.title)}</strong><p>${html(w.crisis.text)}</p></div>` : "<p>No active macro crisis. The world engine may inject shocks as months advance.</p>"}
          <div class="cr-action-stack">
            <button data-trigger-crisis type="button">Stress Test Crisis Engine</button>
            <button data-world-ai-turn type="button">Simulate AI Political Month</button>
          </div>
          <h3>Memory Engine</h3>
          <div class="cr-log">${w.memory.slice(0, 12).map((item) => `<p>${html(item)}</p>`).join("") || "<p>No durable grudges or promises yet.</p>"}</div>
        </article>
      </section>
    `;
  }

  function renderLegacy() {
    const protege = state.candidate.protege;
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Succession, Legacy, and Dynasty</h2>
          <p>Age lowers maximum stamina over time. A trained protege can inherit part of your network, PAC funds, and relationship memory when you retire.</p>
          ${meter("Current stamina ceiling", Math.max(40, 100 - Math.max(0, state.candidate.age - 55) * 2))}
          ${meter("Career network", state.career.network, 100)}
          ${meter("PAC funds", Math.min(state.career.pacFunds / 10000, 100), 100)}
          <button class="cr-btn secondary" data-retire type="button">Retire and Hand Career to Protege</button>
        </article>
        <article class="cr-panel">
          <h2>Mentorship Mechanic</h2>
          <p><strong>${html(protege.name)}</strong> · age ${protege.age}. Train them through staff posts, endorsements, and local campaigns.</p>
          ${meter("Eloquence", protege.eloquence)}
          ${meter("Negotiation", protege.negotiation)}
          ${meter("Policy Expertise", protege.policy)}
          ${meter("Network", protege.network)}
          <div class="cr-action-stack">
            <button data-protege="appoint" type="button">Appoint as Chief of Staff</button>
            <button data-protege="endorse" type="button">Endorse for Local Office</button>
            <button data-protege="train" type="button">Weekly Skill Training</button>
          </div>
        </article>
      </section>
    `;
  }

  function bindGoverning() {
    document.querySelectorAll("[data-gov-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.govView = button.dataset.govTab;
        save();
        render();
      });
    });
    document.querySelectorAll("[data-office-folder]").forEach((button) => {
      button.addEventListener("click", () => {
        state.governing.selectedFolder = button.dataset.officeFolder;
        render();
      });
    });
    document.querySelector("[data-advance-month]")?.addEventListener("click", advanceGoverningMonth);
    document.querySelector("#draftForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      readDraftForm(new FormData(event.currentTarget));
      introduceDraftBill();
    });
    document.querySelector("#draftForm")?.addEventListener("input", (event) => {
      if (event.target.matches("input, select")) {
        readDraftForm(new FormData(event.currentTarget));
        save();
        render();
      }
    });
    document.querySelector("[data-send-draft]")?.addEventListener("click", introduceDraftBill);
    document.querySelectorAll("[data-select-bill]").forEach((button) => {
      button.addEventListener("click", () => {
        state.governing.selectedBillId = button.dataset.selectBill;
        render();
      });
    });
    document.querySelectorAll("[data-legislator]").forEach((button) => {
      button.addEventListener("click", () => {
        state.governing.selectedLegislatorId = button.dataset.legislator;
        render();
      });
    });
    document.querySelectorAll("[data-whip-action]").forEach((button) => {
      button.addEventListener("click", () => whipAction(button.dataset.whipAction));
    });
    document.querySelector("[data-call-vote]")?.addEventListener("click", callVote);
    document.querySelector("[data-trigger-crisis]")?.addEventListener("click", triggerWorldCrisis);
    document.querySelector("[data-world-ai-turn]")?.addEventListener("click", simulateAITurn);
    document.querySelectorAll("[data-protege]").forEach((button) => {
      button.addEventListener("click", () => trainProtege(button.dataset.protege));
    });
    document.querySelector("[data-retire]")?.addEventListener("click", retireToProtege);
  }

  function readDraftForm(form) {
    const d = state.governing.draft;
    d.title = String(form.get("title") || d.title);
    d.sector = form.get("sector") || d.sector;
    d.architecture = form.get("architecture") || d.architecture;
    d.payrollTax = Number(form.get("payrollTax") || d.payrollTax);
    d.corporateTax = Number(form.get("corporateTax") || d.corporateTax);
    d.deficitSpend = Number(form.get("deficitSpend") || d.deficitSpend);
    d.mandates = form.getAll("mandates");
    d.brackets = d.brackets.map((_, index) => Number(form.get(`bracket${index}`) || d.brackets[index]));
    d.corporateRate = Number(form.get("corporateRate") || d.corporateRate);
    d.capitalGains = Number(form.get("capitalGains") || d.capitalGains);
    d.credits = form.getAll("credits");
    d.defense.readiness = Number(form.get("readiness") || d.defense.readiness);
    d.defense.cyber = Number(form.get("cyber") || d.defense.cyber);
    d.defense.nuclear = Number(form.get("nuclear") || d.defense.nuclear);
    d.defense.personnel = Number(form.get("personnel") || d.defense.personnel);
    d.treaties = form.get("treaties") || d.treaties;
    d.intervention = Number(form.get("intervention") || d.intervention);
    d.zoning = Number(form.get("zoning") || d.zoning);
    d.transit = Number(form.get("transit") || d.transit);
    d.roads = Number(form.get("roads") || d.roads);
    d.utilities = Number(form.get("utilities") || d.utilities);
  }

  function introduceDraftBill() {
    const d = state.governing.draft;
    const score = scoreDraft(d);
    const id = `draft-${Date.now()}`;
    const bill = makeBill(id, d.title, moduleName(d.sector), Math.round(score.cost), `Custom bill built from ${moduleName(d.sector)} with risk ${Math.round(score.risk)}.`, "player");
    bill.momentum = clamp((score.progressive + score.moderate + score.conservative) / 3 - score.risk * 0.15 + state.governing.pc * 0.2, 10, 88);
    bill.legalText = buildLegalText(d, score);
    state.governing.bills.unshift(bill);
    state.governing.selectedBillId = id;
    state.govView = "whip";
    addLog(`Drafted ${bill.title}. Estimated cost ${Math.round(score.cost)} and starting momentum ${Math.round(bill.momentum)}.`, "bill");
    save();
    render();
  }

  function buildLegalText(d, score) {
    return `Section 1. Short title. This Act may be cited as the ${d.title}.
Section 2. Policy architecture. The active framework is ${d.architecture || moduleName(d.sector)}.
Section 3. Funding. Payroll adjustment ${d.payrollTax || 0} percent, corporate adjustment ${d.corporateTax || 0} percent, deficit authority ${d.deficitSpend || 0}.
Section 4. Implementation. Agencies shall publish metrics, spending reports, and a public review schedule.
Section 5. Fiscal note. Estimated cost score ${Math.round(score.cost)}, risk score ${Math.round(score.risk)}.`;
  }

  function whipAction(type) {
    const g = state.governing;
    const bill = activeBill();
    const member = g.chamber.find((item) => item.id === g.selectedLegislatorId) || g.chamber[0];
    const costs = { pork: 6, logroll: 4, pulpit: 5 };
    if (!bill || !member || g.pc < costs[type]) return;
    g.pc -= costs[type];
    if (type === "pork") {
      member.trust = clamp(member.trust + 8, 0, 100);
      bill.cost += 3;
      bill.amendments.push({ type: "Pork-Barrel Amendment", text: `Added ${member.petProject} for ${member.district}.` });
    }
    if (type === "logroll") {
      member.trust = clamp(member.trust + 12, 0, 100);
      state.world.memory.push(`${member.name} expects a future yes vote for ${member.petProject}.`);
      bill.amendments.push({ type: "Logrolling Promise", text: `Promised support for ${member.name}'s ${member.petProject}.` });
    }
    if (type === "pulpit") {
      member.fear = clamp(member.fear + 16, 0, 100);
      member.trust = clamp(member.trust - 10, 0, 100);
      member.localApproval = clamp(member.localApproval - 4, 0, 100);
      bill.amendments.push({ type: "Bully Pulpit Pressure", text: `Public pressure campaign in ${member.district}.` });
    }
    bill.momentum = clamp(bill.momentum + 3.5 * difficulty().whip, 0, 100);
    member.vote = projectMemberSupport(member, bill) >= 50 ? "yes" : "undecided";
    addLog(`${type === "pork" ? "Pork amendment" : type === "logroll" ? "Logrolling promise" : "Bully pulpit"} used on ${member.name}.`, "whip");
    save();
    render();
  }

  function callVote() {
    const bill = activeBill();
    if (!bill) return;
    const votes = countVotes(bill);
    if (votes.yes >= votes.need) {
      bill.status = "Passed";
      bill.momentum = 100;
      state.governing.passedBills.push(bill.id);
      state.governing.budget = clamp(state.governing.budget - bill.cost, -200, 500);
      if (state.governing.budget < 0) state.governing.deficit += Math.abs(state.governing.budget);
      state.governing.approval.base = clamp(state.governing.approval.base + 3, 0, 100);
      state.governing.approval.independents = clamp(state.governing.approval.independents + (bill.cost <= 25 ? 2 : -1), 0, 100);
      addLog(`${bill.title} passed ${votes.yes}-${votes.no}. It is now part of your governing record.`, "passed");
    } else {
      bill.status = "Failed";
      bill.momentum = 15;
      state.governing.failedBills.push(bill.id);
      state.governing.approval.base = clamp(state.governing.approval.base - 3, 0, 100);
      addLog(`${bill.title} failed with ${votes.yes} yes votes. Opponents call the agenda disorganized.`, "failed");
    }
    save();
    render();
  }

  function advanceGoverningMonth() {
    const g = state.governing;
    if (g.month >= g.termMonths) {
      buildTermReview();
      return;
    }
    g.month += 1;
    state.career.year += g.month % 12 === 0 ? 1 : 0;
    g.budget += 7 - g.deficit * 0.04;
    g.pc += 3 + Math.round(state.career.network / 40);
    g.economy.unemployment = clamp(g.economy.unemployment + Math.random() * 0.3 - 0.12, 2, 14);
    g.economy.inflation = clamp(g.economy.inflation + Math.random() * 0.35 - 0.12 + g.deficit * 0.003, 0.5, 12);
    g.economy.income = Math.round(g.economy.income * (1 + (Math.random() * 0.006 - 0.001)));
    g.approval.independents = clamp(g.approval.independents - g.economy.inflation * 0.08 - g.deficit * 0.02, 0, 100);
    if (Math.random() < 0.24 * difficulty().crisis) triggerWorldCrisis(false);
    if (Math.random() < 0.35 * difficulty().opposition) introduceOppositionBill();
    simulateAITurn(false);
    addLog(`Month ${g.month} begins. The chamber ledger, economy, and AI politicians moved in the background.`, "month");
    save();
    render();
  }

  function introduceOppositionBill() {
    const bill = makeBill(`oppo-${Date.now()}`, pick(["Property Tax Cap Act", "School Choice Pilot Act", "Regulatory Sunset Act", "Public Safety Enhancement Act"]), "Opposition", Math.round(10 + Math.random() * 20), "An opposition bill designed to force a tradeoff or split your coalition.", "opposition");
    bill.momentum = clamp(42 + Math.random() * 25, 0, 100);
    state.governing.bills.unshift(bill);
    addLog(`Opposition introduced ${bill.title}. Ignoring it may let their frame dominate the ledger.`, "opposition");
  }

  function triggerWorldCrisis(renderAfter = true) {
    const eligible = WORLD_EVENTS.filter((event) => !event.federal || isFederalOffice());
    const crisis = pick(eligible);
    state.world.crisis = crisis;
    Object.entries(crisis.effects || {}).forEach(([key, value]) => {
      if (key === "unemployment") state.governing.economy.unemployment = clamp(state.governing.economy.unemployment + value, 0, 20);
      if (key === "inflation") state.governing.economy.inflation = clamp(state.governing.economy.inflation + value, 0, 20);
      if (key === "income") state.governing.economy.income += value;
      if (key === "approval") state.governing.approval.independents = clamp(state.governing.approval.independents + value, 0, 100);
      if (key === "budget") state.governing.budget += value;
      if (key === "base") state.governing.approval.base = clamp(state.governing.approval.base + value, 0, 100);
      if (key === "opposition") state.governing.approval.opposition = clamp(state.governing.approval.opposition + value, 0, 100);
      if (key === "trust") state.governing.approval.independents = clamp(state.governing.approval.independents + value, 0, 100);
      if (key === "pc") state.governing.pc += value;
    });
    state.world.memory.unshift(`${crisis.type}: ${crisis.title} reshaped the agenda in ${state.career.year}.`);
    addLog(`${crisis.title}: ${crisis.text}`, "crisis");
    if (renderAfter) {
      save();
      render();
    }
  }

  function simulateAITurn(renderAfter = true) {
    state.world.turn += 1;
    state.world.aiActors.forEach((actor) => {
      actor.ambition = clamp(actor.ambition + Math.random() * 8 - 3, 0, 100);
      actor.trust = clamp(actor.trust + Math.random() * 4 - 2, 0, 100);
      actor.grudge = clamp(actor.grudge + (actor.trust < 35 ? Math.random() * 3 : -1), 0, 100);
      if (actor.ambition > 86 && Math.random() < 0.08) {
        const note = `${actor.name} began exploring a higher office bid and may become relevant later.`;
        actor.memory.unshift(note);
        state.world.memory.unshift(note);
      }
    });
    if (renderAfter) {
      addLog("AI politicians raised money, climbed committees, traded favors, and updated memories.", "world");
      save();
      render();
    }
  }

  function trainProtege(type) {
    const p = state.candidate.protege;
    if (p.name === "No protege selected") p.name = `${pick(NAMES.first)} ${pick(NAMES.last)}`;
    if (type === "appoint") {
      p.negotiation += 6;
      p.network += 8;
      state.career.network += 2;
    }
    if (type === "endorse") {
      p.eloquence += 5;
      p.network += 10;
      state.career.pacFunds -= 5000;
    }
    if (type === "train") {
      p.policy += 5;
      p.eloquence += 3;
      p.negotiation += 3;
    }
    p.eloquence = clamp(p.eloquence, 0, 100);
    p.negotiation = clamp(p.negotiation, 0, 100);
    p.policy = clamp(p.policy, 0, 100);
    p.network = clamp(p.network, 0, 100);
    p.ready = p.eloquence + p.negotiation + p.policy + p.network >= 245;
    addLog(`${p.name} gained experience through ${type}.`, "legacy");
    save();
    render();
  }

  function retireToProtege() {
    const p = state.candidate.protege;
    if (!p.ready) {
      addLog("The protege is not ready to inherit the career. Train them more first.", "legacy");
      render();
      return;
    }
    state.candidate.name = p.name;
    state.candidate.age = p.age;
    state.candidate.stats.eloquence = Math.round(p.eloquence);
    state.candidate.stats.negotiation = Math.round(p.negotiation);
    state.candidate.stats.policy = Math.round(p.policy);
    state.career.network = Math.round(state.career.network * 0.55 + p.network * 0.45);
    state.career.pacFunds = Math.round(state.career.pacFunds * 0.6);
    state.candidate.protege = { name: "No protege selected", age: 27, eloquence: 42, negotiation: 38, policy: 44, network: 10, ready: false };
    addLog("Dynasty transition completed. The new politician inherits part of the old network and PAC structure.", "legacy");
    launchNextCampaign(true);
  }

  function buildTermReview() {
    const g = state.governing;
    const legacy = g.passedBills.length >= 3 ? "Legislative Builder" : aggregateApproval() >= 65 ? "Coalition Executive" : g.deficit <= 5 ? "Fiscal Steward" : "Embattled Pragmatist";
    state.termReview = {
      legacy,
      approval: aggregateApproval(),
      bills: g.passedBills.length,
      failed: g.failedBills.length,
      budget: g.budget,
      deficit: g.deficit,
      memory: state.world.memory.slice(0, 5)
    };
    state.phase = "termReview";
    state.career.termsServed += 1;
    state.career.legacy = legacy;
    save();
    render();
  }

  function renderTermReview() {
    const review = state.termReview;
    renderShell("Term Review", `${review.legacy} · approval ${pct(review.approval, 0)} · ${review.bills} laws passed`, `
      <section class="cr-results">
        <div class="cr-result-board won">
          <div><span>Approval</span><strong>${pct(review.approval, 0)}</strong><em>public standing</em></div>
          <div><span>Budget</span><strong>${Math.round(review.budget)}</strong><em>deficit ${Math.round(review.deficit)}</em></div>
        </div>
        <div class="cr-grid two">
          <article class="cr-panel"><h2>Record</h2><p>${review.bills} bills passed. ${review.failed} bills failed. Legacy label: ${html(review.legacy)}.</p>${review.memory.map((item) => `<p>${html(item)}</p>`).join("")}</article>
          <article class="cr-panel"><h2>Career Choice</h2><p>Run again, seek higher office, accept an appointment, or retire into the dynasty system.</p><div class="cr-action-stack"><button data-career-next="reelection" type="button">Run for Reelection</button><button data-career-next="higher" type="button">Run for Higher Office</button><button data-career-next="appointment" type="button">Accept Government Appointment</button><button data-career-next="retire" type="button">Prepare Succession</button></div></article>
        </div>
      </section>
    `, "Career Review");
    document.querySelectorAll("[data-career-next]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.careerNext === "retire") {
          state.phase = "governing";
          state.govView = "legacy";
          render();
          return;
        }
        if (button.dataset.careerNext === "appointment") acceptAppointment();
        else launchNextCampaign(button.dataset.careerNext === "higher");
      });
    });
  }

  function acceptAppointment() {
    const appointed = byId(OFFICE_LADDER, "appointedEducation") || { id: "appointedEducation", name: "Education Commissioner", tier: 4.5, campaignScale: 0.7, governingPower: 0.85 };
    state.candidate.officeId = appointed.id;
    state.candidate.officeName = appointed.name;
    beginGoverning();
    addLog("Accepted an appointed government position. No campaign required, but the record still matters.", "career");
  }

  function launchNextCampaign(higher) {
    const office = currentOffice();
    const ladder = OFFICE_LADDER.filter((item) => !item.id.startsWith("appointed")).sort((a, b) => a.tier - b.tier);
    const next = higher ? ladder.find((item) => item.tier > office.tier) || office : office;
    state.phase = "campaign";
    state.view = "map";
    state.candidate.officeId = next.id;
    state.candidate.officeName = next.name;
    state.candidate.age += 2;
    state.campaign = null;
    state.results = null;
    state.governing = null;
    const form = new Map([
      ["candidateName", state.candidate.name],
      ["age", String(state.candidate.age)],
      ["party", state.candidate.partyId],
      ["faction", state.candidate.faction],
      ["background", state.candidate.backgroundId],
      ["homeState", state.candidate.homeStateId],
      ["office", next.id],
      ["difficulty", state.difficultyId],
      ["ideology", String(state.candidate.ideology)]
    ]);
    const existingCareer = state.career;
    const existingCandidate = { ...state.candidate, stats: { ...state.candidate.stats }, protege: { ...state.candidate.protege } };
    newGame({ get: (key) => form.get(key) });
    state.career = existingCareer;
    state.candidate = existingCandidate;
    state.candidate.officeId = next.id;
    state.candidate.officeName = next.name;
    addLog(`${higher ? "Higher-office" : "Reelection"} campaign launched for ${next.name}.`, "career");
    save();
    render();
  }

  function init() {
    state = load();
    render();
  }

  init();
})();
