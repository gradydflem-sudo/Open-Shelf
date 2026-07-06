(function () {
  const DATA = window.CommonPagesCivicData || {};
  const root = document.querySelector("#civicRoot");
  const saveKey = DATA.saveKey || "commonPagesCivicEngineSave";

  const IDEOLOGIES = [
    { id: "progressiveDemocrat", party: "democratic", name: "Progressive Democrat", score: -20, groups: { progressives: 4, environmentalVoters: 4, unionMembers: 3, collegeStudents: 3, donors: -2, fiscalConservatives: -3 } },
    { id: "liberalDemocrat", party: "democratic", name: "Liberal Democrat", score: -12, groups: { democrats: 3, teachers: 3, immigrantCommunities: 2, urbanProfessionals: 2, suburbanModerates: 1 } },
    { id: "moderateDemocrat", party: "democratic", name: "Moderate Democrat", score: -4, groups: { moderates: 3, suburbanModerates: 3, parents: 2, donors: 1, progressives: -1 } },
    { id: "conservativeDemocrat", party: "democratic", name: "Conservative Democrat", score: 3, groups: { workingClass: 2, ruralVoters: 2, religiousVoters: 1, progressives: -3, environmentalVoters: -1 } },
    { id: "moderateRepublican", party: "republican", name: "Moderate Republican", score: 5, groups: { moderates: 3, suburbanModerates: 3, smallBusiness: 2, collegeEducated: 1, conservatives: -1 } },
    { id: "conservativeRepublican", party: "republican", name: "Conservative Republican", score: 14, groups: { republicans: 3, conservatives: 4, religiousVoters: 3, fiscalConservatives: 3, collegeStudents: -2 } },
    { id: "libertarianRepublican", party: "republican", name: "Libertarian-leaning Republican", score: 10, groups: { smallBusiness: 3, fiscalConservatives: 3, civilLibertarians: 2, publicSectorWorkers: -2, teachers: -1 } },
    { id: "populistRepublican", party: "republican", name: "Populist Republican", score: 16, groups: { nonCollegeVoters: 3, ruralVoters: 3, veterans: 3, workingClass: 2, donors: -2, urbanProfessionals: -3 } },
    { id: "centristIndependent", party: "independent", name: "Centrist Independent", score: 0, groups: { independents: 4, moderates: 4, suburbanModerates: 3, partyActivists: -3 } },
    { id: "progressiveIndependent", party: "independent", name: "Progressive Independent", score: -16, groups: { progressives: 3, civilLibertarians: 2, environmentalVoters: 3, partyActivists: -2, donors: -2 } },
    { id: "conservativeIndependent", party: "independent", name: "Conservative Independent", score: 9, groups: { conservatives: 3, smallBusiness: 2, veterans: 2, partyActivists: -2, urbanProfessionals: -1 } },
    { id: "antiCorruptionIndependent", party: "independent", name: "Anti-corruption Independent", score: -1, groups: { independents: 4, civilLibertarians: 3, urbanProfessionals: 2, moderates: 2, partyActivists: -3 } }
  ];

  const CAMPAIGN_STYLES = [
    { id: "hopeful", name: "Hopeful organizer", text: "Optimistic, volunteer-heavy, values-forward.", effects: { volunteers: 12, trust: 1, groups: { collegeStudents: 1, workingClass: 1 } } },
    { id: "pragmatic", name: "Pragmatic reformer", text: "Careful, competent, attractive to swing voters.", effects: { capital: 2, trust: 1, groups: { suburbanModerates: 2, parents: 1 } } },
    { id: "fighter", name: "Fighting populist", text: "Sharp contrasts and emotional urgency.", effects: { media: 4, trust: -1, groups: { workingClass: 1.5, ruralVoters: 1, urbanProfessionals: -1 } } },
    { id: "technical", name: "Technical problem-solver", text: "Detailed, data-minded, sometimes dry.", effects: { trust: 2, media: -1, groups: { urbanProfessionals: 2, publicSectorWorkers: 1 } } },
    { id: "neighbor", name: "Local neighbor", text: "Personal, relational, and rooted in place.", effects: { trust: 2, volunteers: 6, groups: { seniors: 1, parents: 1, ruralVoters: 1 } } }
  ];

  const DIFFICULTY_MODES = [
    {
      id: "easy",
      name: "Easy",
      text: "Friendlier polls, looser budgets, and weaker opposition pressure.",
      supportPenalty: -1.5,
      resourceMultiplier: 1.18,
      opponentPressure: 0.78,
      electionError: 2.4,
      debateWeight: 0.08,
      startBudget: 108,
      monthlyRevenue: 7,
      startingGovCapitalMax: 18,
      govCapitalMargin: 0.36,
      policyCost: 0.9,
      policyCapital: 0.9,
      votePenalty: -4,
      oppositionChance: 0.14,
      factionDrift: 0.8,
      approvalDrag: 0.01
    },
    {
      id: "intermediate",
      name: "Intermediate",
      text: "Competitive campaigns, tighter budgets, and opposition that can interrupt your agenda.",
      supportPenalty: 3.2,
      resourceMultiplier: 0.9,
      opponentPressure: 1.12,
      electionError: 3.8,
      debateWeight: 0.1,
      startBudget: 82,
      monthlyRevenue: 4,
      startingGovCapitalMax: 12,
      govCapitalMargin: 0.22,
      policyCost: 1.15,
      policyCapital: 1.15,
      votePenalty: 3,
      oppositionChance: 0.28,
      factionDrift: 1.35,
      approvalDrag: 0.045
    },
    {
      id: "advanced",
      name: "Advanced",
      text: "Harder starts, less money, volatile polls, scarce capital, and a legislature that fights back.",
      supportPenalty: 6,
      resourceMultiplier: 0.72,
      opponentPressure: 1.38,
      electionError: 5.2,
      debateWeight: 0.12,
      startBudget: 64,
      monthlyRevenue: 2,
      startingGovCapitalMax: 8,
      govCapitalMargin: 0.13,
      policyCost: 1.4,
      policyCapital: 1.35,
      votePenalty: 8,
      oppositionChance: 0.42,
      factionDrift: 2,
      approvalDrag: 0.075
    }
  ];

  const TABS = [
    { id: "hq", name: "HQ" },
    { id: "map", name: "Map" },
    { id: "voters", name: "Voters" },
    { id: "policy", name: "Policy" },
    { id: "debate", name: "Debate" },
    { id: "actions", name: "Actions" },
    { id: "polling", name: "Polling" },
    { id: "career", name: "Career" }
  ];

  const GOV_TABS = [
    { id: "briefing", name: "Briefing" },
    { id: "administration", name: "Administration" },
    { id: "laws", name: "Policies" },
    { id: "legislature", name: "Legislature" },
    { id: "budget", name: "Budget" },
    { id: "career", name: "Career" }
  ];

  const BASE_SKILLS = {
    nameRecognition: 10,
    publicTrust: 1,
    policy: 1,
    debate: 1,
    organizing: 1,
    fundraising: 1,
    media: 1,
    legislative: 1,
    administration: 1,
    coalition: 1,
    budget: 1
  };

  let state = loadState();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  }

  function byId(items, id) {
    return (items || []).find((item) => item.id === id);
  }

  function normalizePartyId(id) {
    return {
      civicLabor: "democratic",
      greenFuture: "democratic",
      peopleCooperative: "democratic",
      libertyReform: "republican",
      traditionalUnion: "republican",
      nationalRenewal: "republican",
      independentReform: "independent"
    }[id] || id || "independent";
  }

  function normalizeOfficeId(id) {
    return {
      educationBoard: "schoolBoard",
      provincialAssembly: "stateHouse",
      regionalSenate: "stateSenate",
      nationalAssembly: "usHouse",
      nationalSenate: "usSenate",
      chancellor: "president"
    }[id] || id || "schoolBoard";
  }

  function normalizeScenarioId(id) {
    return {
      localEducationBoard: "schoolBoardDistrict",
      stateAssembly: "stateHouseSwingDistrict"
    }[id] || id || DATA.scenarios?.[0]?.id;
  }

  function normalizeIdeologyId(id, partyId = "independent") {
    const direct = byId(IDEOLOGIES, id);
    if (direct?.party === partyId) return direct.id;
    const mapped = {
      progressive: "progressiveDemocrat",
      liberal: "liberalDemocrat",
      moderate: partyId === "republican" ? "moderateRepublican" : partyId === "democratic" ? "moderateDemocrat" : "centristIndependent",
      conservative: partyId === "democratic" ? "conservativeDemocrat" : "conservativeRepublican",
      populist: partyId === "republican" ? "populistRepublican" : "conservativeIndependent",
      libertarian: partyId === "republican" ? "libertarianRepublican" : "centristIndependent",
      green: partyId === "democratic" ? "progressiveDemocrat" : "progressiveIndependent",
      socialist: partyId === "democratic" ? "progressiveDemocrat" : "progressiveIndependent",
      nationalist: partyId === "republican" ? "populistRepublican" : "conservativeIndependent",
      technocratic: "antiCorruptionIndependent"
    }[id] || id;
    const mappedIdeology = byId(IDEOLOGIES, mapped);
    if (mappedIdeology?.party === partyId) return mappedIdeology.id;
    return partyId === "democratic" ? "moderateDemocrat" : partyId === "republican" ? "conservativeRepublican" : "centristIndependent";
  }

  function getDifficulty(id = state?.difficultyId) {
    return byId(DIFFICULTY_MODES, id) || byId(DIFFICULTY_MODES, "intermediate") || DIFFICULTY_MODES[1];
  }

  function scaleMoney(value, multiplier) {
    return Math.round((value || 0) * multiplier);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Math.round(value || 0));
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(value || 0));
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function signed(amount) {
    const rounded = Math.round((amount || 0) * 10) / 10;
    return rounded > 0 ? `+${rounded}` : String(rounded);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function weightedPick(items, scoreFn) {
    const weighted = items.map((item) => ({ item, weight: Math.max(0.1, scoreFn(item)) }));
    const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * total;
    for (const entry of weighted) {
      roll -= entry.weight;
      if (roll <= 0) return entry.item;
    }
    return weighted[weighted.length - 1]?.item || items[0];
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(saveKey));
      if (!saved || !saved.version) return null;
      return migrateState(saved);
    } catch {
      return null;
    }
  }

  function migrateState(saved) {
    saved.scenarioId = normalizeScenarioId(saved.scenarioId);
    const scenario = byId(DATA.scenarios, saved.scenarioId) || DATA.scenarios?.[0];
    saved.scenarioId = scenario?.id || saved.scenarioId;
    saved.candidate = saved.candidate || {};
    saved.candidate.partyId = normalizePartyId(saved.candidate.partyId);
    saved.candidate.ideologyId = normalizeIdeologyId(saved.candidate.ideologyId, saved.candidate.partyId);
    saved.candidate.officeId = normalizeOfficeId(saved.candidate.officeId || scenario?.officeId);
    saved.candidate.backgroundId = saved.candidate.backgroundId || "teacher";
    saved.candidate.homeStateId = saved.candidate.homeStateId || scenario?.stateId || "pa";
    saved.candidate.educationId = saved.candidate.educationId || "bachelors";
    saved.candidate.age = saved.candidate.age || 35;
    saved.difficultyId = saved.difficultyId || "intermediate";
    saved.debate = saved.debate || { completed: [], score: 0, currentId: null };
    saved.career = saved.career || {
      mode: "career",
      currentOfficeId: saved.candidate.officeId,
      history: [],
      electionsWon: saved.results?.won ? 1 : 0,
      electionsLost: saved.results?.won === false ? 1 : 0,
      reputation: saved.results?.analysis?.rank ? [saved.results.analysis.rank] : ["First-time Candidate"],
      legacy: "Unwritten",
      skills: buildStartingSkills(byId(DATA.backgrounds, saved.candidate.backgroundId), byId(DATA.educationLevels, saved.candidate.educationId))
    };
    saved.career.currentOfficeId = normalizeOfficeId(saved.career.currentOfficeId || saved.candidate.officeId);
    saved.career.skills = { ...BASE_SKILLS, ...(saved.career.skills || {}) };
    saved.endorsements = saved.endorsements || [];
    saved.actionMarks = saved.actionMarks || { fieldOffices: [] };
    saved.completedEvents = saved.completedEvents || [];
    if (saved.governing) {
      saved.governing.oppositionBill = saved.governing.oppositionBill || null;
      saved.governing.oppositionCompleted = saved.governing.oppositionCompleted || [];
      saved.governing.failedPolicies = saved.governing.failedPolicies || [];
    }
    saved.log = saved.log || [];
    return saved;
  }

  function saveState() {
    if (!state) return;
    state.savedAt = new Date().toISOString();
    localStorage.setItem(saveKey, JSON.stringify(state));
  }

  function clearSavedState() {
    localStorage.removeItem(saveKey);
  }

  function addLog(message, type = "note") {
    if (!state) return;
    state.log.unshift({
      week: state.week,
      type,
      message,
      id: `${Date.now()}-${Math.random()}`
    });
    state.log = state.log.slice(0, 80);
  }

  function resourceLabel(key) {
    return {
      money: "Money",
      time: "Time",
      staff: "Staff",
      volunteers: "Volunteers",
      capital: "Political capital",
      trust: "Public trust",
      media: "Media attention",
      energy: "Energy",
      debate: "Debate prep"
    }[key] || key;
  }

  function costText(cost = {}) {
    const parts = Object.entries(cost)
      .filter(([, value]) => value)
      .map(([key, value]) => key === "money" ? formatMoney(value) : `${value} ${resourceLabel(key).toLowerCase()}`);
    return parts.length ? parts.join(" · ") : "No cost";
  }

  function getToplineSupport(regions = state?.regions || []) {
    if (!regions.length) return 0;
    const totalPopulation = regions.reduce((sum, region) => sum + region.population, 0);
    const weighted = regions.reduce((sum, region) => sum + effectiveRegionSupport(region) * region.population, 0);
    return weighted / Math.max(1, totalPopulation);
  }

  function getAverageTurnout(regions = state?.regions || []) {
    if (!regions.length) return 0;
    const totalPopulation = regions.reduce((sum, region) => sum + region.population, 0);
    return regions.reduce((sum, region) => sum + effectiveRegionTurnout(region) * region.population, 0) / Math.max(1, totalPopulation);
  }

  function getVoter(id) {
    return state?.voters?.find((group) => group.id === id);
  }

  function getRegion(id) {
    return state?.regions?.find((region) => region.id === id);
  }

  function effectiveRegionSupport(region) {
    const groupInfluence = Object.entries(region.groups || {}).reduce((sum, [groupId, weight]) => {
      const group = getVoter(groupId);
      return sum + ((group?.support ?? 50) - 50) * (weight / 100);
    }, 0);
    const trustInfluence = ((state?.resources?.trust ?? 50) - 50) * 0.045;
    const mediaDrag = Math.max(0, (state?.resources?.media ?? 0) - 55) * -0.015;
    return clamp(region.support + groupInfluence * 0.45 + trustInfluence + mediaDrag, 18, 82);
  }

  function effectiveRegionTurnout(region) {
    const groupInfluence = Object.entries(region.groups || {}).reduce((sum, [groupId, weight]) => {
      const group = getVoter(groupId);
      return sum + ((group?.turnout ?? 60) - 60) * (weight / 100);
    }, 0);
    const volunteerLift = Math.min(4, (state?.resources?.volunteers || 0) / 70);
    return clamp(region.turnout + region.ground + groupInfluence * 0.35 + volunteerLift, 35, 86);
  }

  function supportClass(value) {
    if (value >= 57) return "safe";
    if (value >= 52) return "lean";
    if (value >= 48) return "toss";
    if (value >= 43) return "behind";
    return "hard";
  }

  function applyNumber(target, key, amount, min = -Infinity, max = Infinity) {
    target[key] = clamp((target[key] || 0) + amount, min, max);
  }

  function applyResourceEffects(effects = {}) {
    const resources = state.resources;
    ["money", "volunteers", "capital", "trust", "media", "energy", "debate"].forEach((key) => {
      if (effects[key]) {
        const min = key === "money" ? 0 : key === "trust" ? 0 : 0;
        const max = key === "trust" || key === "media" || key === "debate" ? 100 : 999999;
        applyNumber(resources, key, effects[key], min, max);
      }
    });
    if (effects.staff) applyNumber(resources, "staff", effects.staff, 0, 99);
    if (effects.maxEnergy) applyNumber(resources, "maxEnergy", effects.maxEnergy, 1, 12);
  }

  function applyGroupEffects(groupEffects = {}, scale = 1) {
    Object.entries(groupEffects || {}).forEach(([groupId, value]) => {
      const group = getVoter(groupId);
      if (!group) return;
      if (typeof value === "number") {
        applyNumber(group, "support", value * scale * (group.persuasion || 1), 12, 88);
        return;
      }
      if (value.support) applyNumber(group, "support", value.support * scale * (group.persuasion || 1), 12, 88);
      if (value.turnout) applyNumber(group, "turnout", value.turnout * scale, 25, 88);
    });
  }

  function applyRegionEffects(regionEffects = {}, scale = 1) {
    Object.entries(regionEffects || {}).forEach(([regionId, amount]) => {
      const region = getRegion(regionId);
      if (!region) return;
      applyNumber(region, "support", amount * scale, 12, 88);
    });
  }

  function applyEffects(effects = {}, context = {}) {
    applyResourceEffects(effects);
    if (effects.groups) applyGroupEffects(effects.groups, context.scale || 1);
    if (effects.regions) applyRegionEffects(effects.regions, context.scale || 1);

    if (effects.groupSupport && context.groupId) {
      const group = getVoter(context.groupId);
      if (group) applyNumber(group, "support", effects.groupSupport * (group.persuasion || 1), 12, 88);
    }
    if (effects.groupTurnout && context.groupId) {
      const group = getVoter(context.groupId);
      if (group) applyNumber(group, "turnout", effects.groupTurnout, 25, 88);
    }
    if (effects.regionSupport && context.regionId) {
      const region = getRegion(context.regionId);
      if (region) applyNumber(region, "support", effects.regionSupport, 12, 88);
    }
    if (effects.regionTurnout && context.regionId) {
      const region = getRegion(context.regionId);
      if (region) {
        applyNumber(region, "turnout", effects.regionTurnout * 0.35, 35, 86);
        applyNumber(region, "ground", effects.regionTurnout * 0.65, -10, 18);
      }
    }
    if (effects.regionTurnoutAll) {
      state.regions.forEach((region) => applyNumber(region, "ground", effects.regionTurnoutAll, -10, 18));
    }
    if (effects.opponentSupport) {
      state.regions.forEach((region) => applyNumber(region, "support", -effects.opponentSupport * 0.35, 12, 88));
    }
    if (effects.issueMomentum) applyNumber(state, "issueMomentum", effects.issueMomentum, 0, 20);
  }

  function canAfford(cost = {}) {
    return Object.entries(cost).every(([key, amount]) => {
      if (!amount || amount <= 0) return true;
      if (key === "staff") return state.resources.staff >= amount;
      return (state.resources[key] || 0) >= amount;
    });
  }

  function payCost(cost = {}) {
    Object.entries(cost).forEach(([key, amount]) => {
      if (!amount || amount <= 0) return;
      if (key === "staff") return;
      applyNumber(state.resources, key, -amount, 0, key === "trust" || key === "media" ? 100 : 999999);
    });
  }

  function actionEffectPreview(action) {
    const bits = [];
    const effects = action.effects || {};
    if (effects.regionSupport) bits.push(`${signed(effects.regionSupport)} regional support`);
    if (effects.regionTurnout) bits.push(`${signed(effects.regionTurnout)} turnout work`);
    if (effects.groupSupport) bits.push(`${signed(effects.groupSupport)} target-group support`);
    if (effects.trust) bits.push(`${signed(effects.trust)} trust`);
    if (effects.media) bits.push(`${signed(effects.media)} media`);
    if (effects.money) bits.push(`${signed(effects.money)} money`);
    if (effects.volunteers) bits.push(`${signed(effects.volunteers)} volunteers`);
    if (effects.staff) bits.push(`${signed(effects.staff)} staff`);
    if (effects.debate) bits.push(`${signed(effects.debate)} debate prep`);
    return bits.join(" · ") || "Situational effects";
  }

  function startCampaign(formData) {
    const scenario = byId(DATA.scenarios, normalizeScenarioId(formData.get("scenario"))) || DATA.scenarios[0];
    const party = byId(DATA.parties, normalizePartyId(formData.get("party"))) || DATA.parties[0];
    const trait = byId(DATA.traits, formData.get("trait"));
    const background = byId(DATA.backgrounds, formData.get("background")) || DATA.backgrounds?.[0];
    const ideology = byId(IDEOLOGIES, normalizeIdeologyId(formData.get("ideology"), party?.id)) || IDEOLOGIES[0];
    const education = byId(DATA.educationLevels, formData.get("education")) || DATA.educationLevels?.find((item) => item.id === "bachelors");
    const homeState = byId(DATA.usStates, formData.get("homeState")) || byId(DATA.usStates, scenario.stateId) || DATA.usStates?.[0];
    const difficulty = getDifficulty(formData.get("difficulty"));
    const style = byId(CAMPAIGN_STYLES, formData.get("style"));
    const opponent = byId(DATA.opponents, formData.get("opponent")) || byId(DATA.opponents, scenario.defaultOpponent);
    const homeRegionId = formData.get("homeRegion");
    const topIssues = [formData.get("issueOne"), formData.get("issueTwo")].filter(Boolean);

    const resources = {
      ...scenario.startingResources,
      money: scenario.startingResources.money,
      time: scenario.startingResources.time
    };
    applyFlatResource(resources, party?.resourceModifiers);
    applyFlatResource(resources, trait?.modifiers);
    applyFlatResource(resources, background?.resources);
    applyFlatResource(resources, style?.effects);
    resources.money = scaleMoney(resources.money, difficulty.resourceMultiplier);
    resources.volunteers = Math.max(10, Math.round((resources.volunteers || 0) * difficulty.resourceMultiplier));
    resources.capital = Math.max(1, Math.round((resources.capital || 0) * difficulty.resourceMultiplier));
    resources.trust = clamp((resources.trust || 50) - difficulty.supportPenalty * 0.45, 25, 80);
    resources.money = Math.max(15000, resources.money);
    resources.maxEnergy = resources.maxEnergy || 6;
    resources.energy = clamp(resources.energy, 1, resources.maxEnergy);

    state = {
      version: DATA.version,
      phase: "campaign",
      tab: "hq",
      week: 1,
      difficultyId: difficulty.id,
      scenarioId: scenario.id,
      maxWeeks: scenario.weeks,
      candidate: {
        name: String(formData.get("candidateName") || "Alex Rivers").trim(),
        age: clamp(Number(formData.get("candidateAge") || 35), 18, 90),
        homeStateId: homeState?.id || "pa",
        partyId: party.id,
        traitId: trait.id,
        backgroundId: background?.id || "teacher",
        educationId: education?.id || "bachelors",
        ideologyId: ideology.id,
        styleId: style.id,
        office: scenario.office,
        officeId: normalizeOfficeId(scenario.officeId),
        homeRegionId,
        topIssues
      },
      career: {
        mode: "career",
        currentOfficeId: normalizeOfficeId(scenario.officeId),
        history: [],
        electionsWon: 0,
        electionsLost: 0,
        reputation: ["First-time Candidate"],
        legacy: "Unwritten",
        skills: buildStartingSkills(background, education)
      },
      opponentId: opponent.id,
      resources,
      regions: [],
      voters: [],
      platform: {},
      platformApplied: {},
      platformChanges: {},
      endorsements: [],
      askedEndorsements: [],
      actionMarks: { fieldOffices: [] },
      event: null,
      completedEvents: [],
      log: [],
      poll: null,
      pollHistory: [],
      focus: null,
      focusCompleted: [],
      debate: { completed: [], score: 0, currentId: null },
      issueMomentum: 0,
      results: null,
      governing: null,
      tutorial: formData.get("tutorial") === "true" ? { active: true, step: 0, completed: [] } : null,
      createdAt: new Date().toISOString()
    };

    state.voters = DATA.voterGroups.map((group) => {
      const partyMod = party?.groupModifiers?.[group.id] || 0;
      const ideologyMod = ideology?.groups?.[group.id] || 0;
      const traitMod = trait?.groupModifiers?.[group.id] || 0;
      const backgroundMod = background?.groups?.[group.id] || 0;
      const educationMod = education?.groups?.[group.id] || 0;
      const styleMod = style?.effects?.groups?.[group.id] || 0;
      const turnoutMod = trait?.groupTurnoutModifiers?.[group.id] || 0;
      return {
        ...group,
        support: clamp(group.support + partyMod + ideologyMod + traitMod + backgroundMod + educationMod + styleMod - difficulty.supportPenalty * 0.5 + randomBetween(-1.2, 1.2), 18, 78),
        turnout: clamp(group.turnout + turnoutMod + randomBetween(-0.8, 0.8), 30, 85)
      };
    });

    const scenarioRegions = scenario.regionIds?.length
      ? DATA.regions.filter((region) => scenario.regionIds.includes(region.id))
      : DATA.regions;
    state.regions = scenarioRegions.map((region) => {
      const ideologyFit = 4.5 - Math.abs((region.lean || 0) - ideology.score) / 5.5;
      const partyRegional = Object.entries(region.groups || {}).reduce((sum, [groupId, weight]) => {
        return sum + (party?.groupModifiers?.[groupId] || 0) * (weight / 100);
      }, 0);
      const styleRegional = Object.entries(region.groups || {}).reduce((sum, [groupId, weight]) => {
        return sum + (style?.effects?.groups?.[groupId] || 0) * (weight / 100);
      }, 0);
      const homeBonus = homeRegionId === region.id ? (trait?.homeRegionBonus || 3) : 0;
      const opponentHome = opponent.homeRegion === region.id ? -1.8 : 0;
      return {
        ...region,
        support: clamp(region.baselineSupport + ideologyFit + partyRegional * 0.35 + styleRegional * 0.35 + homeBonus + opponentHome - difficulty.supportPenalty + randomBetween(-1.8, 1.8), 18, 66),
        turnout: region.turnout,
        ground: 0,
        visits: 0,
        fieldOffice: false
      };
    });

    DATA.issues.forEach((issue) => {
      const defaultIndex = ideology.score > 8 ? 2 : ideology.score < -12 ? 0 : 1;
      const stance = issue.stances[Math.min(defaultIndex, issue.stances.length - 1)] || issue.stances[0];
      state.platform[issue.id] = stance.id;
      state.platformApplied[issue.id] = { [stance.id]: true };
      if (topIssues.includes(issue.id)) applyEffects(stance.effects, { scale: 0.55 });
    });

    addLog(`${state.candidate.name} launched a ${difficulty.name.toLowerCase()} U.S. career campaign for ${scenario.office} in ${homeState?.name || "a home state"}.`, "major");
    addLog(`Background: ${background?.name || "Community Volunteer"}. ${background?.text || "A local reputation begins to form."}`, "note");
    addLog(`Education: ${education?.name || "Bachelor's Degree"}. ${education?.text || "A public profile begins to take shape."}`, "note");
    addLog(`${opponent.name}, a ${opponent.label.toLowerCase()}, begins as the principal opponent.`, "opponent");
    refreshPoll({ internal: true });
    saveState();
    render();
  }

  function applyFlatResource(resources, modifiers = {}) {
    Object.entries(modifiers || {}).forEach(([key, value]) => {
      if (key === "groups") return;
      resources[key] = (resources[key] || 0) + value;
    });
  }

  function buildStartingSkills(background, education) {
    const skills = { ...BASE_SKILLS };
    Object.entries(background?.skills || {}).forEach(([key, value]) => {
      skills[key] = (skills[key] || 0) + value;
    });
    Object.entries(education?.skills || {}).forEach(([key, value]) => {
      skills[key] = (skills[key] || 0) + value;
    });
    return skills;
  }

  function scenarioOffice(scenario = byId(DATA.scenarios, normalizeScenarioId(state?.scenarioId))) {
    return byId(DATA.officeLadder, scenario?.officeId || state?.candidate?.officeId) || DATA.officeLadder?.[0];
  }

  function startTutorialCampaign() {
    const defaults = {
      candidateName: "Jordan Vale",
      candidateAge: "34",
      homeState: "pa",
      education: "bachelors",
      difficulty: "easy",
      scenario: "schoolBoardDistrict",
      background: "teacher",
      party: "independent",
      ideology: "centristIndependent",
      style: "neighbor",
      trait: "coalitionBuilder",
      homeRegion: "pineSuburbs",
      issueOne: "education",
      issueTwo: "government",
      opponent: "miraVance",
      tutorial: "true"
    };
    startCampaign({ get: (key) => defaults[key] || "" });
  }

  function renderSetup() {
    const saved = loadState();
    const scenario = DATA.scenarios[0];
    const defaultName = saved?.candidate?.name || "";
    root.innerHTML = `
      <section class="civic-setup">
        <div class="setup-copy">
          <p class="eyebrow">Common Pages Games</p>
          <h1>${escapeHTML(DATA.title)}</h1>
          <p class="civic-deck">Build a full U.S. political career: start local, campaign through primaries and general elections, govern after victory, pass laws, manage budgets and staff, and decide whether your public life climbs toward national leadership.</p>
          <div class="scenario-note">
            <strong>Career Mode is the flagship path.</strong>
            <span>This is the first playable layer of a larger American political life simulator: school board, city council, mayor, state legislature, Congress, governor, Senate, and president.</span>
          </div>
          <div class="setup-command-board">
            <div><span>Campaign</span><strong>Polls, field, debates</strong></div>
            <div><span>Governing</span><strong>Budget, staff, bills</strong></div>
            <div><span>Career</span><strong>Reelection or higher office</strong></div>
          </div>
          ${saved ? `
            <div class="saved-campaign">
              <strong>Saved campaign found</strong>
              <span>${escapeHTML(saved.candidate?.name || "Candidate")} · ${escapeHTML(saved.candidate?.office || "Office")} · ${saved.phase === "governing" ? `Month ${saved.governing?.month || 1}` : saved.phase === "results" ? "Election complete" : `Week ${saved.week || 1}`}</span>
              <div class="button-row">
                <button class="button primary" id="resumeCampaign" type="button">Resume</button>
                <button class="button secondary" id="clearCampaign" type="button">Start Fresh</button>
              </div>
            </div>
          ` : ""}
        </div>
        <form class="setup-form" id="campaignSetupForm">
          <div class="form-grid">
            <label>
              <span>Candidate name</span>
              <input name="candidateName" maxlength="48" required value="${escapeHTML(defaultName)}" placeholder="Alex Rivers" />
            </label>
            <label>
              <span>Age</span>
              <input name="candidateAge" type="number" min="18" max="90" value="${escapeHTML(saved?.candidate?.age || 35)}" />
            </label>
            <label>
              <span>Home state</span>
              <select name="homeState">${(DATA.usStates || []).map((stateItem) => `<option value="${stateItem.id}" ${stateItem.id === (saved?.candidate?.homeStateId || "pa") ? "selected" : ""}>${escapeHTML(stateItem.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Starting race</span>
              <select name="scenario">${DATA.scenarios.map((item) => `<option value="${item.id}">${escapeHTML(item.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Difficulty</span>
              <select name="difficulty">${DIFFICULTY_MODES.map((item) => `<option value="${item.id}" ${item.id === "intermediate" ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Background</span>
              <select name="background">${(DATA.backgrounds || []).map((item) => `<option value="${item.id}">${escapeHTML(item.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Education</span>
              <select name="education">${(DATA.educationLevels || []).map((item) => `<option value="${item.id}" ${item.id === "bachelors" ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Party</span>
              <select name="party">${DATA.parties.map((party) => `<option value="${party.id}">${escapeHTML(party.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Ideology</span>
              <select name="ideology">${IDEOLOGIES.map((item) => `<option value="${item.id}" data-party="${item.party}">${escapeHTML(item.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Campaign style</span>
              <select name="style">${CAMPAIGN_STYLES.map((item) => `<option value="${item.id}">${escapeHTML(item.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Candidate trait</span>
              <select name="trait">${DATA.traits.map((trait) => `<option value="${trait.id}">${escapeHTML(trait.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Home district area</span>
              <select name="homeRegion">${DATA.regions.map((region) => `<option value="${region.id}">${escapeHTML(region.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Main issue</span>
              <select name="issueOne">${DATA.issues.map((issue) => `<option value="${issue.id}">${escapeHTML(issue.name)}</option>`).join("")}</select>
            </label>
            <label>
              <span>Second issue</span>
              <select name="issueTwo">${DATA.issues.map((issue) => `<option value="${issue.id}">${escapeHTML(issue.name)}</option>`).join("")}</select>
            </label>
            <label class="wide">
              <span>Opponent</span>
              <select name="opponent">${DATA.opponents.map((opponent) => `<option value="${opponent.id}">${escapeHTML(opponent.name)} · ${escapeHTML(opponent.label)}</option>`).join("")}</select>
            </label>
          </div>
          <div class="setup-insight" id="setupInsight"></div>
          <div class="button-row">
            <button class="button primary" type="submit">Start Career</button>
            <button class="button secondary" id="startCivicTutorial" type="button">Interactive Tutorial</button>
          </div>
        </form>
      </section>
    `;

    document.querySelector("#campaignSetupForm").addEventListener("submit", (event) => {
      event.preventDefault();
      startCampaign(new FormData(event.currentTarget));
    });
    document.querySelector("#resumeCampaign")?.addEventListener("click", () => {
      state = saved;
      render();
    });
    document.querySelector("#clearCampaign")?.addEventListener("click", () => {
      clearSavedState();
      state = null;
      render();
    });
    document.querySelector("#startCivicTutorial")?.addEventListener("click", () => startTutorialCampaign());
    const form = document.querySelector("#campaignSetupForm");
    const syncIdeologyOptions = () => {
      const partyId = normalizePartyId(form.elements.party.value);
      const ideologySelect = form.elements.ideology;
      const allowed = IDEOLOGIES.filter((item) => item.party === partyId);
      Array.from(ideologySelect.options).forEach((option) => {
        const isAllowed = option.dataset.party === partyId;
        option.hidden = !isAllowed;
        option.disabled = !isAllowed;
      });
      if (!allowed.some((item) => item.id === ideologySelect.value)) {
        ideologySelect.value = allowed[0]?.id || "centristIndependent";
      }
    };
    const renderInsight = () => {
      syncIdeologyOptions();
      const selectedScenario = byId(DATA.scenarios, form.elements.scenario.value);
      const selectedState = byId(DATA.usStates, form.elements.homeState.value);
      const difficulty = getDifficulty(form.elements.difficulty.value);
      const party = byId(DATA.parties, form.elements.party.value);
      const ideology = byId(IDEOLOGIES, form.elements.ideology.value);
      const trait = byId(DATA.traits, form.elements.trait.value);
      const background = byId(DATA.backgrounds, form.elements.background.value);
      const education = byId(DATA.educationLevels, form.elements.education.value);
      const style = byId(CAMPAIGN_STYLES, form.elements.style.value);
      const opponent = byId(DATA.opponents, form.elements.opponent.value);
      document.querySelector("#setupInsight").innerHTML = `
        <p><strong>${escapeHTML(selectedScenario.name)}:</strong> ${escapeHTML(selectedScenario.description)}</p>
        <p><strong>${escapeHTML(selectedState.name)}:</strong> ${escapeHTML(selectedState.competitiveness)} · key issues include ${escapeHTML(selectedState.keyIssues.join(", "))}.</p>
        <p><strong>${escapeHTML(difficulty.name)} mode:</strong> ${escapeHTML(difficulty.text)}</p>
        <p><strong>${escapeHTML(background.name)}:</strong> ${escapeHTML(background.text)}</p>
        <p><strong>${escapeHTML(education.name)}:</strong> ${escapeHTML(education.text)}</p>
        <p><strong>${escapeHTML(party.name)}:</strong> ${escapeHTML(party.description)}</p>
        <p><strong>${escapeHTML(ideology.name)}:</strong> This starting lane shapes your early coalition, primary pressure, and issue credibility.</p>
        <p><strong>${escapeHTML(trait.name)}:</strong> ${escapeHTML(trait.description)}</p>
        <p><strong>${escapeHTML(style.name)}:</strong> ${escapeHTML(style.text)}</p>
        <p><strong>Opponent:</strong> ${escapeHTML(opponent.name)} is strongest at ${escapeHTML(opponent.strengths.join(", "))} and weaker on ${escapeHTML(opponent.weaknesses.join(", "))}.</p>
      `;
    };
    form.addEventListener("change", renderInsight);
    renderInsight();
  }

  function renderGame() {
    if (state.phase === "governing") {
      renderGoverning();
      return;
    }
    if (state.phase === "termReview") {
      renderTermReview();
      return;
    }
    if (state.phase === "results") {
      renderResults();
      return;
    }
    const candidate = state.candidate;
    const party = byId(DATA.parties, candidate.partyId);
    const opponent = byId(DATA.opponents, state.opponentId);
    const difficulty = getDifficulty();
    const topline = state.poll?.topline ?? getToplineSupport();
    root.innerHTML = `
      <section class="game-shell">
        <div class="game-header">
          <div>
            <p class="eyebrow">Week ${state.week} of ${state.maxWeeks}</p>
            <h1>${escapeHTML(candidate.name)} for ${escapeHTML(candidate.office)}</h1>
            <p>${escapeHTML(party.shortName)} · Facing ${escapeHTML(opponent.name)} · Polling ${Math.round(topline)}% · ${escapeHTML(difficulty.name)} mode</p>
          </div>
          <div class="header-actions">
            <button class="button secondary" id="manualSave" type="button">Save</button>
            <button class="button secondary" id="newCampaign" type="button">New Campaign</button>
            <button class="button primary" id="advanceWeek" type="button">${state.week >= state.maxWeeks ? "Election Night" : "Next Week"}</button>
          </div>
        </div>
        ${renderResourceBar()}
        ${renderCivicTutorialPanel()}
        ${state.event ? renderEventPanel(state.event) : ""}
        <div class="tab-row" role="tablist">
          ${TABS.map((tab) => `<button class="${state.tab === tab.id ? "active" : ""}" data-tab="${tab.id}" type="button">${escapeHTML(tab.name)}</button>`).join("")}
        </div>
        <section class="tab-panel">${renderActiveTab()}</section>
      </section>
    `;
    bindGameEvents();
  }

  function renderCivicTutorialPanel() {
    if (!state.tutorial?.active) return "";
    const steps = DATA.civicTutorial || [];
    const step = steps[state.tutorial.step] || steps[0];
    const actions = [
      '<button class="button secondary" data-tutorial-next type="button">Continue</button>',
      '<button class="button primary" data-tutorial-townhall type="button">Hold Tutorial Town Hall</button>',
      '<button class="button primary" data-tutorial-canvass type="button">Canvass Swing Neighborhood</button>',
      '<button class="button primary" data-tutorial-event type="button">Open Newspaper Event</button>',
      '<button class="button primary" data-tutorial-election type="button">Run Tutorial Election</button>',
      '<button class="button secondary" data-tutorial-finish type="button">Finish Tutorial</button>'
    ];
    return `
      <article class="civic-tutorial-panel">
        <div>
          <span>Tutorial ${state.tutorial.step + 1}/${steps.length}</span>
          <h2>${escapeHTML(step?.title || "Tutorial")}</h2>
          <p>${escapeHTML(step?.body || "Learn the campaign and governing loop through guided choices.")}</p>
        </div>
        <div class="button-row">
          ${actions[state.tutorial.step] || actions[0]}
          <button class="button secondary" data-tutorial-close type="button">Close Tutorial</button>
        </div>
      </article>
    `;
  }

  function renderResourceBar() {
    const r = state.resources;
    const resources = [
      ["money", formatMoney(r.money)],
      ["time", `${r.time} left`],
      ["volunteers", formatNumber(r.volunteers)],
      ["staff", formatNumber(r.staff)],
      ["capital", formatNumber(r.capital)],
      ["trust", `${Math.round(r.trust)}%`],
      ["energy", `${r.energy}/${r.maxEnergy}`],
      ["media", `${Math.round(r.media)}%`]
    ];
    return `
      <div class="resource-grid">
        ${resources.map(([key, value]) => `
          <div title="${escapeHTML(resourceDescription(key))}">
            <span>${resourceLabel(key)}</span>
            <strong>${value}</strong>
            <small>${escapeHTML(resourceDescription(key))}</small>
          </div>
        `).join("")}
      </div>
    `;
  }

  function resourceDescription(key) {
    return {
      money: "Pays for staff, ads, travel, polling, and events.",
      time: "Limits how many actions you can take this week.",
      volunteers: "Increase turnout and make field work stronger.",
      staff: "Unlocks capacity for offices, polling, debate prep, and operations.",
      capital: "Political leverage for endorsements, deals, and legislative work.",
      trust: "Makes voters more forgiving and improves late movement.",
      energy: "Prevents every turn from becoming unlimited actions.",
      media: "Attention that can help, but too much can magnify mistakes.",
      debate: "Improves debate answers and election-night performance."
    }[key] || "Campaign resource";
  }

  function renderEventPanel(eventData) {
    return `
      <article class="event-panel">
        <div>
          <p class="eyebrow">Campaign Event</p>
          <h2>${escapeHTML(eventData.title)}</h2>
          <p>${escapeHTML(eventData.body)}</p>
        </div>
        <div class="event-choices">
          ${eventData.choices.map((choice, index) => `
            <button type="button" data-event-choice="${index}">
              <strong>${escapeHTML(choice.label)}</strong>
              <span>${escapeHTML(choice.text)}</span>
            </button>
          `).join("")}
        </div>
      </article>
    `;
  }

  function renderActiveTab() {
    if (state.tab === "map") return renderMapTab();
    if (state.tab === "voters") return renderVotersTab();
    if (state.tab === "policy") return renderPolicyTab();
    if (state.tab === "debate") return renderDebateTab();
    if (state.tab === "actions") return renderActionsTab();
    if (state.tab === "polling") return renderPollingTab();
    if (state.tab === "career") return renderCareerTab();
    return renderHQTab();
  }

  function renderHQTab() {
    const opponent = byId(DATA.opponents, state.opponentId);
    const topRegions = [...state.regions]
      .sort((a, b) => effectiveRegionSupport(b) - effectiveRegionSupport(a))
      .slice(0, 3);
    const weakRegions = [...state.regions]
      .sort((a, b) => effectiveRegionSupport(a) - effectiveRegionSupport(b))
      .slice(0, 3);
    return `
      <div class="hq-grid">
        <article class="dashboard-card">
          <h2>Campaign HQ</h2>
          <p class="card-copy">Your week has ${state.resources.time} time, ${state.resources.energy} energy, and ${formatMoney(state.resources.money)} available. Actions are strongest when they fit the region or group you target.</p>
          <div class="meter-list">
            ${meter("Topline poll", state.poll?.topline ?? getToplineSupport(), "%")}
            ${meter("Average turnout", getAverageTurnout(), "%")}
            ${meter("Public trust", state.resources.trust, "%")}
            ${meter("Debate readiness", state.resources.debate, "%")}
          </div>
        </article>
        <article class="dashboard-card">
          <h2>Opponent Desk</h2>
          <p><strong>${escapeHTML(opponent.name)}</strong> · ${escapeHTML(opponent.label)}</p>
          <p class="card-copy">Strengths: ${escapeHTML(opponent.strengths.join(", "))}. Weaknesses: ${escapeHTML(opponent.weaknesses.join(", "))}.</p>
          <div class="opponent-stats">
            ${Object.entries(opponent.stats).map(([key, value]) => meter(key, value, "%")).join("")}
          </div>
        </article>
        <article class="dashboard-card">
          <h2>Best Ground</h2>
          <div class="mini-region-list">
            ${topRegions.map((region) => miniRegion(region)).join("")}
          </div>
        </article>
        <article class="dashboard-card">
          <h2>Hardest Ground</h2>
          <div class="mini-region-list">
            ${weakRegions.map((region) => miniRegion(region)).join("")}
          </div>
        </article>
        <article class="dashboard-card wide-card">
          <h2>Campaign Log</h2>
          <div class="campaign-log">
            ${state.log.length ? state.log.slice(0, 12).map((entry) => `
              <p class="${entry.type}">
                <span>Week ${entry.week}</span>
                ${escapeHTML(entry.message)}
              </p>
            `).join("") : "<p>No campaign log yet.</p>"}
          </div>
        </article>
      </div>
    `;
  }

  function meter(label, value, suffix = "") {
    const percent = clamp(value, 0, 100);
    return `
      <div class="meter">
        <div><span>${escapeHTML(label)}</span><strong>${Math.round(value)}${suffix}</strong></div>
        <i><b style="width:${percent}%"></b></i>
      </div>
    `;
  }

  function miniRegion(region) {
    const support = effectiveRegionSupport(region);
    return `
      <div class="mini-region ${supportClass(support)}">
        <span>${escapeHTML(region.name)}</span>
        <strong>${Math.round(support)}%</strong>
      </div>
    `;
  }

  function renderMapTab() {
    return `
      <div class="map-layout">
        <div class="map-column">
          <div class="map-legend">
            <span><b class="safe"></b> ahead</span>
            <span><b class="toss"></b> toss-up</span>
            <span><b class="behind"></b> behind</span>
          </div>
          <div class="region-map" aria-label="District strategy map">
            ${state.regions.map((region, index) => {
              const support = effectiveRegionSupport(region);
              return `
                <button class="map-tile ${supportClass(support)} tile-${index}" type="button" data-select-region="${region.id}" title="Click to target actions in ${escapeHTML(region.name)}">
                  <span>${escapeHTML(region.name)}</span>
                  <strong>${Math.round(support)}%</strong>
                  <em>${Math.round(effectiveRegionTurnout(region))}% turnout · ground ${Math.round(region.ground || 0)}</em>
                </button>
              `;
            }).join("")}
          </div>
        </div>
        <div class="region-detail-list">
          ${state.regions.map((region) => {
            const support = effectiveRegionSupport(region);
            const turnout = effectiveRegionTurnout(region);
            return `
              <article class="region-card ${supportClass(support)}">
                <div class="region-card-head">
                  <div>
                    <h2>${escapeHTML(region.name)}</h2>
                    <p>${escapeHTML(region.type)} · ${formatNumber(region.population)} residents · ${region.electoralValue} electoral value</p>
                  </div>
                  <strong>${Math.round(support)}%</strong>
                </div>
                <div class="bar-pair">
                  ${simpleBar("Support", support)}
                  ${simpleBar("Turnout", turnout)}
                </div>
                <p>${escapeHTML(region.notes)}</p>
                <div class="tag-row">${region.concerns.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function simpleBar(label, value) {
    return `
      <div class="simple-bar">
        <span>${escapeHTML(label)} ${Math.round(value)}%</span>
        <i><b style="width:${clamp(value, 0, 100)}%"></b></i>
      </div>
    `;
  }

  function renderVotersTab() {
    const sorted = [...state.voters].sort((a, b) => b.size - a.size);
    return `
      <div class="section-intro">
        <h2>Voter Coalitions</h2>
        <p>Each group has its own support, turnout habits, and issue priorities. Strong campaigns do not need everyone, but they do need a plausible coalition.</p>
      </div>
      <div class="voter-grid">
        ${sorted.map((group) => `
          <article class="voter-card ${supportClass(group.support)}">
            <div>
              <h3>${escapeHTML(group.name)}</h3>
              <span>${group.size}% of electorate</span>
            </div>
            ${simpleBar("Support", group.support)}
            ${simpleBar("Turnout", group.turnout)}
            <div class="tag-row">${group.issues.map((issue) => `<span>${escapeHTML(issue)}</span>`).join("")}</div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderPolicyTab() {
    return `
      <div class="policy-layout">
        <section>
          <div class="section-intro">
            <h2>Platform</h2>
            <p>Position changes can move voters, but repeated reversals cost trust. The goal is not to find a perfect stance; it is to build a believable coalition.</p>
          </div>
          <div class="policy-list">
            ${DATA.issues.map((issue) => renderIssue(issue)).join("")}
          </div>
        </section>
        <aside class="focus-panel">
          <h2>Strategic Paths</h2>
          ${state.focus ? renderActiveFocus() : "<p>Choose one agenda path. Each step has campaign effects, and finishing the path opens a public decision with tradeoffs.</p>"}
          <div class="focus-list">
            ${DATA.focuses.map((focus) => renderFocus(focus)).join("")}
          </div>
        </aside>
      </div>
    `;
  }

  function renderIssue(issue) {
    const selected = state.platform[issue.id];
    return `
      <article class="issue-card">
        <div>
          <h3>${escapeHTML(issue.name)}</h3>
          <p>${escapeHTML(issue.description)}</p>
        </div>
        <select data-policy="${issue.id}" aria-label="${escapeHTML(issue.name)} stance">
          ${issue.stances.map((stance) => `<option value="${stance.id}" ${stance.id === selected ? "selected" : ""}>${escapeHTML(stance.name)}</option>`).join("")}
        </select>
      </article>
    `;
  }

  function renderActiveFocus() {
    const focus = byId(DATA.focuses, state.focus.id);
    const step = focus?.steps[state.focus.stepIndex];
    if (!focus || !step) return "<p>Focus complete.</p>";
    return `
      <div class="active-focus">
        <span>Active focus</span>
        <strong>${escapeHTML(focus.name)}</strong>
        <em>${escapeHTML(step.name)} · ${state.focus.progress}/${step.weeks} weeks</em>
      </div>
    `;
  }

  function renderFocus(focus) {
    const completed = state.focusCompleted.includes(focus.id);
    const active = state.focus?.id === focus.id;
    const disabled = completed || active || Boolean(state.focus) || state.resources.time <= 0 || state.resources.energy <= 0;
    return `
      <article class="focus-card ${completed ? "complete" : ""}">
        <h3>${escapeHTML(focus.name)}</h3>
        <p>${escapeHTML(focus.summary || "A multi-week campaign argument.")}</p>
        <ol>
          ${focus.steps.map((step) => `<li><strong>${escapeHTML(step.name)}</strong><span>${escapeHTML(effectSummaryCampaign(step.effects))}</span></li>`).join("")}
        </ol>
        <div class="focus-impact">${escapeHTML(focus.payoff || "Finishing this path unlocks a final decision.")}</div>
        <button class="button secondary" data-start-focus="${focus.id}" type="button" ${disabled ? "disabled" : ""}>
          ${completed ? "Completed" : active ? "Active" : "Begin Focus"}
        </button>
      </article>
    `;
  }

  function renderDebateTab() {
    const current = state.debate?.currentId ? byId(DATA.debateQuestions, state.debate.currentId) : null;
    const available = (DATA.debateQuestions || []).filter((question) => !state.debate?.completed?.includes(question.id));
    const opponent = byId(DATA.opponents, state.opponentId);
    return `
      <div class="debate-layout">
        <section class="debate-stage">
          <div>
            <p class="eyebrow">Debate Hall</p>
            <h2>${current ? escapeHTML(current.title) : "Choose a Debate Moment"}</h2>
            <p>${current ? escapeHTML(current.question) : "Use debate prep to shape answers in public. Strong answers move trust, media, voter groups, and the final election calculation."}</p>
          </div>
          <div class="debate-dais">
            <div><span>Moderator</span><strong>Question control</strong></div>
            <div><span>${escapeHTML(state.candidate.name)}</span><strong>Prep ${Math.round(state.resources.debate)}%</strong></div>
            <div><span>${escapeHTML(opponent?.name || "Opponent")}</span><strong>Pressure ${opponent?.stats?.debate || 50}%</strong></div>
            <div><span>Audience</span><strong>${current ? escapeHTML(current.audience) : "Waiting for a clear answer"}</strong></div>
          </div>
        </section>
        ${current ? `
          <section class="debate-options">
            ${current.choices.map((choice, index) => `
              <button type="button" data-debate-choice="${index}">
                <strong>${escapeHTML(choice.label)}</strong>
                <span>${escapeHTML(choice.text)}</span>
                <em>${escapeHTML(effectSummaryCampaign(choice.effects))}</em>
              </button>
            `).join("")}
          </section>
        ` : `
          <section class="debate-question-grid">
            ${available.length ? available.map((question) => `
              <article class="debate-question-card">
                <h3>${escapeHTML(question.title)}</h3>
                <p>${escapeHTML(question.audience)}</p>
                <button class="button primary" data-start-debate="${question.id}" type="button">Take Question</button>
              </article>
            `).join("") : `
              <article class="dashboard-card">
                <h2>No Questions Left</h2>
                <p class="card-copy">You have answered every prepared debate moment. Debate prep still helps election-night performance.</p>
              </article>
            `}
          </section>
        `}
      </div>
    `;
  }

  function effectSummaryCampaign(effects = {}) {
    const parts = [];
    if (effects.trust) parts.push(`${signed(effects.trust)} trust`);
    if (effects.debate) parts.push(`${signed(effects.debate)} debate`);
    if (effects.media) parts.push(`${signed(effects.media)} media`);
    if (effects.capital) parts.push(`${signed(effects.capital)} capital`);
    if (effects.opponentSupport) parts.push(`${signed(-effects.opponentSupport)} opponent pressure`);
    if (effects.groups) parts.push("moves voter groups");
    if (effects.regions) parts.push("moves regions");
    return parts.join(" · ") || "Mixed reaction";
  }

  function renderActionsTab() {
    const categories = [...new Set(DATA.actions.map((action) => action.category))];
    return `
      <div class="actions-header">
        <div>
          <h2>Campaign Actions</h2>
          <p>Choose actions for the week. Most actions cost time or energy, so targeting matters.</p>
        </div>
        <div class="action-filter">
          <label>
            <span>Region target</span>
            <select id="globalRegionTarget">${state.regions.map((region) => `<option value="${region.id}">${escapeHTML(region.name)}</option>`).join("")}</select>
          </label>
          <label>
            <span>Voter target</span>
            <select id="globalGroupTarget">${state.voters.map((group) => `<option value="${group.id}">${escapeHTML(group.name)}</option>`).join("")}</select>
          </label>
        </div>
      </div>
      ${state.event ? `<div class="notice">Answer the campaign event before taking more actions this week.</div>` : ""}
      <div class="action-sections">
        ${categories.map((category) => `
          <section class="action-section">
            <h3>${escapeHTML(category)}</h3>
            <div class="action-grid">
              ${DATA.actions.filter((action) => action.category === category).map((action) => renderActionCard(action)).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    `;
  }

  function renderActionCard(action) {
    const disabledReason = actionDisabledReason(action);
    const targetControls = actionTargetControls(action);
    return `
      <article class="action-card ${disabledReason ? "disabled" : ""}">
        <div>
          <h4>${escapeHTML(action.name)}</h4>
          <p>${escapeHTML(action.text)}</p>
        </div>
        <div class="action-meta">
          <span>${escapeHTML(costText(action.cost))}</span>
          <span>${escapeHTML(actionEffectPreview(action))}</span>
        </div>
        ${targetControls}
        <button class="button primary" data-action="${action.id}" type="button" ${disabledReason ? "disabled" : ""}>
          ${disabledReason || "Do This"}
        </button>
      </article>
    `;
  }

  function actionTargetControls(action) {
    if (action.target === "region") {
      return `
        <label>
          <span>Region</span>
          <select data-action-region="${action.id}">
            ${state.regions.map((region) => `<option value="${region.id}">${escapeHTML(region.name)}</option>`).join("")}
          </select>
        </label>
      `;
    }
    if (action.target === "group") {
      return `
        <label>
          <span>Voter group</span>
          <select data-action-group="${action.id}">
            ${state.voters.map((group) => `<option value="${group.id}">${escapeHTML(group.name)}</option>`).join("")}
          </select>
        </label>
      `;
    }
    if (action.target === "endorsement") {
      const options = DATA.endorsements.map((endorsement) => `<option value="${endorsement.id}" ${state.endorsements.includes(endorsement.id) ? "disabled" : ""}>${escapeHTML(endorsement.name)}</option>`).join("");
      return `
        <label>
          <span>Organization</span>
          <select data-action-endorsement="${action.id}">${options}</select>
        </label>
      `;
    }
    return "";
  }

  function actionDisabledReason(action) {
    if (state.event) return "Event pending";
    if (!canAfford(action.cost)) return "Not enough";
    if (state.resources.time <= 0 && (action.cost?.time || 0) > 0) return "No time";
    if (state.resources.energy <= 0 && (action.cost?.energy || 0) > 0) return "No energy";
    return "";
  }

  function renderPollingTab() {
    const poll = state.poll;
    return `
      <div class="polling-layout">
        <article class="dashboard-card">
          <h2>Latest Poll</h2>
          <p class="card-copy">Polling is an estimate, not the race itself. Field work, trust, and late events can all move the final result.</p>
          <div class="big-poll">
            <strong>${Math.round(poll?.topline || getToplineSupport())}%</strong>
            <span>Estimated support · margin of error ${poll?.margin || 4}%</span>
          </div>
          <button class="button secondary" id="buyInternalPoll" type="button" ${state.resources.money < 5000 ? "disabled" : ""}>Commission Internal Poll · $5,000</button>
        </article>
        <article class="dashboard-card">
          <h2>Trend</h2>
          <div class="trend-list">
            ${(state.pollHistory || []).slice(-8).map((entry) => `
              <div>
                <span>Week ${entry.week}</span>
                <i><b style="width:${clamp(entry.topline, 0, 100)}%"></b></i>
                <strong>${Math.round(entry.topline)}%</strong>
              </div>
            `).join("") || "<p>No trend yet.</p>"}
          </div>
        </article>
        <article class="dashboard-card wide-card">
          <h2>Regional Polling</h2>
          <div class="poll-region-list">
            ${poll?.regions?.map((regionPoll) => {
              const region = getRegion(regionPoll.id);
              return `
                <div class="${supportClass(regionPoll.support)}">
                  <span>${escapeHTML(region.name)}</span>
                  <i><b style="width:${clamp(regionPoll.support, 0, 100)}%"></b></i>
                  <strong>${Math.round(regionPoll.support)}%</strong>
                </div>
              `;
            }).join("") || ""}
          </div>
        </article>
      </div>
    `;
  }

  function renderCareerTab() {
    const currentOffice = byId(DATA.officeLadder, state.career?.currentOfficeId) || scenarioOffice();
    const background = byId(DATA.backgrounds, state.candidate.backgroundId);
    const education = byId(DATA.educationLevels, state.candidate.educationId);
    const homeState = byId(DATA.usStates, state.candidate.homeStateId);
    const skills = state.career?.skills || BASE_SKILLS;
    return `
      <div class="career-layout">
        <article class="dashboard-card">
          <h2>Career Profile</h2>
          <p><strong>${escapeHTML(state.candidate.name)}</strong> · age ${escapeHTML(state.candidate.age || 35)} · ${escapeHTML(homeState?.name || "Home state")} · ${escapeHTML(currentOffice?.name || state.candidate.office)}</p>
          <p class="card-copy">${escapeHTML(background?.name || "Candidate")} · ${escapeHTML(education?.name || "Education")} · ${escapeHTML(background?.text || "A public career is beginning.")}</p>
          <div class="skill-grid">
            ${Object.entries(skills).map(([key, value]) => `
              <div><span>${escapeHTML(skillLabel(key))}</span><strong>${value}</strong></div>
            `).join("")}
          </div>
        </article>
        <article class="dashboard-card">
          <h2>Reputation</h2>
          <div class="tag-row">${(state.career?.reputation || ["First-time Candidate"]).map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
          <p class="card-copy">Reputation grows from the way you campaign, govern, handle crises, and treat coalitions.</p>
        </article>
        <article class="dashboard-card wide-card">
          <h2>Office Ladder</h2>
          <div class="office-ladder">
            ${(DATA.officeLadder || []).map((office) => `
              <div class="${office.id === currentOffice?.id ? "current" : office.tier < (currentOffice?.tier || 1) ? "past" : ""}">
                <strong>${escapeHTML(office.name)}</strong>
                <span>${escapeHTML(office.electorate)} · ${escapeHTML(office.duties.join(", "))}</span>
              </div>
            `).join("")}
          </div>
        </article>
        <article class="dashboard-card wide-card">
          <h2>Career History</h2>
          <div class="campaign-log">
            ${(state.career?.history || []).length ? state.career.history.map((entry) => `
              <p><span>${escapeHTML(entry.type)}</span>${escapeHTML(entry.text)}</p>
            `).join("") : "<p>No offices held yet. Win an election to begin governing.</p>"}
          </div>
        </article>
      </div>
    `;
  }

  function skillLabel(key) {
    return {
      nameRecognition: "Name recognition",
      publicTrust: "Public trust",
      policy: "Policy knowledge",
      debate: "Debate skill",
      organizing: "Organizing",
      fundraising: "Fundraising",
      media: "Media",
      legislative: "Legislative",
      administration: "Administration",
      coalition: "Coalition",
      budget: "Budget"
    }[key] || key;
  }

  function bindGameEvents() {
    document.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.tab = button.dataset.tab;
        saveState();
        render();
      });
    });
    document.querySelector("#manualSave")?.addEventListener("click", () => {
      saveState();
      addLog("Campaign saved locally.", "note");
      render();
    });
    document.querySelector("#newCampaign")?.addEventListener("click", () => {
      if (!window.confirm("Start a new campaign and replace the saved game?")) return;
      clearSavedState();
      state = null;
      render();
    });
    document.querySelector("#advanceWeek")?.addEventListener("click", advanceWeek);
    document.querySelector("[data-tutorial-next]")?.addEventListener("click", () => advanceTutorial(1));
    document.querySelector("[data-tutorial-close]")?.addEventListener("click", () => {
      state.tutorial.active = false;
      saveState();
      render();
    });
    document.querySelector("[data-tutorial-townhall]")?.addEventListener("click", () => tutorialCampaignAction("townHall", "pineSuburbs", 2));
    document.querySelector("[data-tutorial-canvass]")?.addEventListener("click", () => tutorialCampaignAction("canvass", "pineSuburbs", 3));
    document.querySelector("[data-tutorial-event]")?.addEventListener("click", openTutorialEvent);
    document.querySelector("[data-tutorial-election]")?.addEventListener("click", () => {
      state.regions.forEach((region) => {
        if (region.id === "pineSuburbs" || region.id === "universityDistrict") applyNumber(region, "support", 5, 12, 88);
      });
      state.week = state.maxWeeks;
      runElection();
    });
    document.querySelector("[data-tutorial-finish]")?.addEventListener("click", () => {
      state.tutorial.active = false;
      saveState();
      render();
    });
    document.querySelectorAll("[data-event-choice]").forEach((button) => {
      button.addEventListener("click", () => chooseEvent(Number(button.dataset.eventChoice)));
    });
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => useAction(button.dataset.action));
    });
    document.querySelectorAll("[data-policy]").forEach((select) => {
      select.addEventListener("change", () => updatePolicy(select.dataset.policy, select.value));
    });
    document.querySelectorAll("[data-start-focus]").forEach((button) => {
      button.addEventListener("click", () => startFocus(button.dataset.startFocus));
    });
    document.querySelectorAll("[data-start-debate]").forEach((button) => {
      button.addEventListener("click", () => startDebateQuestion(button.dataset.startDebate));
    });
    document.querySelectorAll("[data-debate-choice]").forEach((button) => {
      button.addEventListener("click", () => answerDebateQuestion(Number(button.dataset.debateChoice)));
    });
    document.querySelector("#buyInternalPoll")?.addEventListener("click", () => {
      if (state.resources.money < 5000) return;
      state.resources.money -= 5000;
      refreshPoll({ internal: true });
      addLog("Internal polling reduced uncertainty and updated the regional numbers.", "note");
      saveState();
      render();
    });
    document.querySelectorAll("[data-select-region]").forEach((button) => {
      button.addEventListener("click", () => {
        state.tab = "actions";
        saveState();
        render();
        const select = document.querySelector("#globalRegionTarget");
        if (select) select.value = button.dataset.selectRegion;
      });
    });
  }

  function advanceTutorial(step) {
    if (!state.tutorial) return;
    state.tutorial.step = clamp((state.tutorial.step || 0) + step, 0, (DATA.civicTutorial?.length || 1) - 1);
    saveState();
    render();
  }

  function tutorialCampaignAction(actionId, regionId, nextStep) {
    const action = byId(DATA.actions, actionId);
    const region = getRegion(regionId) || state.regions[0];
    if (!action || !region) return;
    if (!canAfford(action.cost)) {
      state.resources.money += 5000;
      state.resources.volunteers += 12;
      state.resources.energy = Math.max(state.resources.energy, 2);
      state.resources.time = Math.max(state.resources.time, 2);
    }
    payCost(action.cost);
    applyEffects(action.effects, { regionId: region.id });
    if (action.groupEffects) applyGroupEffects(action.groupEffects);
    region.visits += 1;
    addLog(`Tutorial: ${action.name} in ${region.name}. Public trust, turnout, or support changed because actions have consequences.`, "major");
    refreshPoll({ internal: true });
    if (state.tutorial) state.tutorial.step = nextStep;
    saveState();
    render();
  }

  function openTutorialEvent() {
    state.event = {
      id: "tutorialSchoolFunding",
      title: "Local Newspaper Question: School Funding",
      body: "The Pine Suburbs Ledger asks whether you would raise local revenue to fund smaller class sizes.",
      choices: [
        { label: "Support smaller classes and explain the cost honestly.", text: "Parents and teachers appreciate clarity; fiscal voters worry.", effects: { trust: 2, groups: { parents: 2, teachers: 3, smallBusiness: -1 }, regions: { pineSuburbs: 1.5 } } },
        { label: "Promise a full audit before any tax change.", text: "A cautious answer works with swing voters but disappoints some teachers.", effects: { trust: 1, groups: { suburbanModerates: 2, teachers: -0.5 }, regions: { pineSuburbs: 1 } } },
        { label: "Reject new revenue and focus on efficiency.", text: "Tax-sensitive voters like the line; school advocates hear a limit.", effects: { groups: { smallBusiness: 2, teachers: -2, parents: -0.5 }, regions: { ridgeTowns: 1 } } }
      ]
    };
    if (state.tutorial) state.tutorial.step = 4;
    addLog("Tutorial event opened: answer the newspaper question to see voter consequences.", "event");
    saveState();
    render();
  }

  function useAction(actionId) {
    const action = byId(DATA.actions, actionId);
    if (!action || actionDisabledReason(action)) return;
    const regionId = document.querySelector(`[data-action-region="${actionId}"]`)?.value || document.querySelector("#globalRegionTarget")?.value;
    const groupId = document.querySelector(`[data-action-group="${actionId}"]`)?.value || document.querySelector("#globalGroupTarget")?.value;
    const endorsementId = document.querySelector(`[data-action-endorsement="${actionId}"]`)?.value;

    if (action.oncePerRegion && state.actionMarks.fieldOffices.includes(regionId)) {
      addLog(`A field office already exists in ${getRegion(regionId)?.name}.`, "warning");
      render();
      return;
    }

    payCost(action.cost);
    if (action.target === "endorsement") {
      seekEndorsement(endorsementId);
    } else {
      applyEffects(action.effects, { regionId, groupId });
      if (action.groupEffects) applyGroupEffects(action.groupEffects);
      if (action.target === "region" && regionId) {
        const region = getRegion(regionId);
        region.visits += 1;
        if (action.oncePerRegion) {
          region.fieldOffice = true;
          state.actionMarks.fieldOffices.push(regionId);
        }
        addLog(`${action.name} in ${region.name}. ${actionEffectPreview(action)}.`, "action");
      } else if (action.target === "group" && groupId) {
        addLog(`${action.name} aimed at ${getVoter(groupId)?.name}. ${actionEffectPreview(action)}.`, "action");
      } else {
        addLog(`${action.name}. ${actionEffectPreview(action)}.`, "action");
      }
    }

    if (action.risk && Math.random() < action.risk.chance) {
      applyEffects(action.risk);
      addLog(action.risk.log, "warning");
    }

    refreshPoll({ soft: true });
    saveState();
    render();
  }

  function seekEndorsement(endorsementId) {
    const endorsement = byId(DATA.endorsements, endorsementId);
    if (!endorsement || state.endorsements.includes(endorsement.id)) return;
    state.askedEndorsements.push(endorsement.id);
    const req = endorsement.requirements || {};
    let chance = 0.48 + (state.resources.trust - 50) / 120 + state.resources.capital / 90;
    if (req.group) chance += ((getVoter(req.group)?.support || 45) - (req.support || 50)) / 80;
    if (req.trust) chance += (state.resources.trust - req.trust) / 80;
    if (req.issue && state.candidate.topIssues.includes(req.issue)) chance += 0.12;
    chance = clamp(chance, 0.18, 0.86);
    if (Math.random() <= chance) {
      state.endorsements.push(endorsement.id);
      applyEffects(endorsement.effects);
      addLog(`${endorsement.name} endorsed the campaign. ${endorsement.text}`, "major");
    } else {
      addLog(`${endorsement.name} declined to endorse for now. The meeting still built some relationships.`, "warning");
      applyEffects({ trust: 0.3, capital: 0.4 });
    }
  }

  function updatePolicy(issueId, stanceId) {
    const issue = byId(DATA.issues, issueId);
    const stance = issue?.stances.find((item) => item.id === stanceId);
    if (!issue || !stance || state.platform[issueId] === stanceId) return;
    state.platform[issueId] = stanceId;
    state.platformChanges[issueId] = (state.platformChanges[issueId] || 0) + 1;
    const appliedBefore = state.platformApplied[issueId]?.[stanceId];
    if (!appliedBefore) {
      applyEffects(stance.effects, { scale: 0.85 });
      state.platformApplied[issueId] = { ...(state.platformApplied[issueId] || {}), [stanceId]: true };
    }
    if (state.platformChanges[issueId] > 1) {
      applyEffects({ trust: -1.2, media: 1 });
      addLog(`The campaign changed its ${issue.name} stance again. Some voters see flexibility; others see calculation.`, "warning");
    } else {
      addLog(`Platform updated: ${issue.name} - ${stance.name}.`, "action");
    }
    refreshPoll({ soft: true });
    saveState();
    render();
  }

  function startFocus(focusId) {
    const focus = byId(DATA.focuses, focusId);
    if (!focus || state.focus || state.focusCompleted.includes(focusId)) return;
    if (state.resources.time < 1 || state.resources.energy < 1) return;
    state.resources.time -= 1;
    state.resources.energy -= 1;
    state.focus = { id: focus.id, stepIndex: 0, progress: 0 };
    addLog(`The campaign began the ${focus.name}.`, "major");
    saveState();
    render();
  }

  function progressFocus() {
    if (!state.focus) return;
    const focus = byId(DATA.focuses, state.focus.id);
    const step = focus?.steps[state.focus.stepIndex];
    if (!focus || !step) {
      state.focus = null;
      return;
    }
    state.focus.progress += 1;
    if (state.focus.progress >= step.weeks) {
      applyEffects(step.effects);
      addLog(`Focus completed: ${step.name}.`, "major");
      state.focus.stepIndex += 1;
      state.focus.progress = 0;
      if (state.focus.stepIndex >= focus.steps.length) {
        state.focusCompleted.push(focus.id);
        addLog(`${focus.name} finished. The path is now part of the campaign's public identity.`, "major");
        if (focus.choices?.length) state.event = buildFocusEvent(focus);
        state.focus = null;
      }
    }
  }

  function buildFocusEvent(focus) {
    return {
      id: `focus-${focus.id}`,
      title: `${focus.name}: Closing Choice`,
      body: focus.payoff || "The campaign has built a public argument. Now you need to choose how to use it.",
      choices: focus.choices
    };
  }

  function chooseEvent(choiceIndex) {
    if (!state.event) return;
    const eventData = state.event;
    const choice = eventData.choices[choiceIndex];
    if (!choice) return;
    applyEffects(choice.effects);
    state.completedEvents.push(eventData.id);
    addLog(`${eventData.title}: ${choice.label}`, "event");
    state.event = null;
    refreshPoll({ soft: true });
    saveState();
    render();
  }

  function startDebateQuestion(questionId) {
    const question = byId(DATA.debateQuestions, questionId);
    if (!question || state.debate?.completed?.includes(questionId)) return;
    state.debate = state.debate || { completed: [], score: 0, currentId: null };
    state.debate.currentId = question.id;
    addLog(`Debate stage opened: ${question.title}.`, "major");
    saveState();
    render();
  }

  function answerDebateQuestion(choiceIndex) {
    const debate = state.debate || { completed: [], score: 0, currentId: null };
    const question = byId(DATA.debateQuestions, debate.currentId);
    const choice = question?.choices?.[choiceIndex];
    if (!question || !choice) return;
    const prep = clamp(state.resources.debate || 50, 0, 100);
    const scale = 0.72 + prep / 125;
    applyEffects(choice.effects, { scale });
    const score = Math.round((choice.effects?.debate || 0) * scale + prep / 20);
    debate.completed = [...new Set([...(debate.completed || []), question.id])];
    debate.score = (debate.score || 0) + score;
    debate.currentId = null;
    state.debate = debate;
    applyNumber(state.resources, "debate", -8, 0, 100);
    addLog(`${question.title}: ${choice.label} Debate score ${score}.`, "event");
    refreshPoll({ soft: true });
    saveState();
    render();
  }

  function advanceWeek() {
    if (state.event) {
      addLog("The campaign must answer the active event before the week can end.", "warning");
      render();
      return;
    }
    if (state.week >= state.maxWeeks) {
      runElection();
      return;
    }

    opponentTurn();
    progressFocus();
    state.week += 1;
    state.resources.time = 3 + (state.resources.staff >= 8 ? 1 : 0);
    state.resources.energy = state.resources.maxEnergy;
    state.resources.money += Math.round((2200 + state.resources.capital * 70) * getDifficulty().resourceMultiplier);
    state.resources.volunteers += Math.max(0, Math.round((1.5 + (state.resources.trust - 50) / 16) * getDifficulty().resourceMultiplier));
    state.resources.media = clamp(state.resources.media * 0.92, 0, 100);

    const nextEvent = drawEvent();
    if (nextEvent) state.event = nextEvent;
    refreshPoll();
    addLog(`Week ${state.week} begins. New public polling is circulating.`, "note");
    saveState();
    render();
  }

  function drawEvent() {
    const eligible = DATA.events.filter((eventData) => {
      if (state.completedEvents.includes(eventData.id)) return false;
      if (eventData.weekMin && state.week + 1 < eventData.weekMin) return false;
      if (eventData.weekMax && state.week + 1 > eventData.weekMax) return false;
      return true;
    });
    if (!eligible.length) return null;
    if (state.week + 1 >= state.maxWeeks - 1) {
      const final = eligible.find((eventData) => eventData.id === "finalDebate");
      if (final) return final;
    }
    return eligible[Math.floor(Math.random() * eligible.length)];
  }

  function opponentTurn() {
    const opponent = byId(DATA.opponents, state.opponentId);
    const difficulty = getDifficulty();
    const target = weightedPick(state.regions, (region) => {
      const support = effectiveRegionSupport(region);
      const home = opponent.homeRegion === region.id ? 1.6 : 1;
      const swing = 16 - Math.abs(support - 50);
      return Math.max(1, swing) * home * (region.electoralValue / 10);
    });
    const moveRoll = Math.random();
    if (moveRoll < 0.28) {
      const pressure = opponent.stats.attack / 70 * difficulty.opponentPressure;
      applyNumber(target, "support", -randomBetween(0.6, 1.5) * pressure, 12, 88);
      applyNumber(state.resources, "trust", -0.25 * pressure, 0, 100);
      addLog(`${opponent.name} attacked your record in ${target.name}.`, "opponent");
    } else if (moveRoll < 0.55) {
      const pressure = opponent.stats.field / 80 * difficulty.opponentPressure;
      applyNumber(target, "support", -randomBetween(0.5, 1.2) * pressure, 12, 88);
      applyNumber(target, "ground", -randomBetween(0.2, 0.7) * pressure, -10, 18);
      addLog(`${opponent.name}'s organizers worked ${target.name}.`, "opponent");
    } else if (moveRoll < 0.78) {
      const pressure = opponent.stats.fundraising / 90 * difficulty.opponentPressure;
      applyNumber(target, "support", -randomBetween(0.4, 1.1) * pressure, 12, 88);
      addLog(`${opponent.name} bought fresh advertising around ${target.name}.`, "opponent");
    } else {
      const pressure = opponent.stats.debate / 100 * difficulty.opponentPressure;
      applyNumber(state.resources, "debate", -randomBetween(0.4, 1.1) * pressure, 0, 100);
      addLog(`${opponent.name} sharpened debate contrasts for the closing stretch.`, "opponent");
    }

    Object.entries(opponent.basePressure?.regions || {}).forEach(([regionId, amount]) => {
      const region = getRegion(regionId);
      if (region) applyNumber(region, "support", -amount * 0.12 * difficulty.opponentPressure, 12, 88);
    });
    Object.entries(opponent.basePressure?.groups || {}).forEach(([groupId, amount]) => {
      const group = getVoter(groupId);
      if (group) applyNumber(group, "support", -amount * 0.12 * difficulty.opponentPressure, 12, 88);
    });
  }

  function refreshPoll({ internal = false, soft = false } = {}) {
    if (!state) return;
    const margin = internal ? 2.1 : soft ? (state.poll?.margin || 4.2) : randomBetween(3.2, 5.6);
    const regions = state.regions.map((region) => {
      const noise = randomBetween(-margin, margin);
      return {
        id: region.id,
        support: clamp(effectiveRegionSupport(region) + noise, 10, 90),
        turnout: clamp(effectiveRegionTurnout(region) + randomBetween(-margin / 2, margin / 2), 30, 90)
      };
    });
    const totalPopulation = state.regions.reduce((sum, region) => sum + region.population, 0);
    const topline = regions.reduce((sum, regionPoll) => {
      const region = getRegion(regionPoll.id);
      return sum + regionPoll.support * region.population;
    }, 0) / Math.max(1, totalPopulation);
    state.poll = {
      week: state.week,
      internal,
      margin: Math.round(margin * 10) / 10,
      topline: Math.round(topline * 10) / 10,
      regions
    };
    if (!soft) {
      state.pollHistory.push({ week: state.week, topline: state.poll.topline, margin: state.poll.margin });
      state.pollHistory = state.pollHistory.slice(-12);
    }
  }

  function runElection() {
    const difficulty = getDifficulty();
    const rows = state.regions.map((region) => {
      const support = effectiveRegionSupport(region);
      const turnout = effectiveRegionTurnout(region);
      const lateTrust = (state.resources.trust - 50) * 0.035;
      const debate = ((state.resources.debate - 50) * difficulty.debateWeight) + ((state.debate?.score || 0) * 0.035);
      const field = region.ground * 0.12;
      const error = randomBetween(-difficulty.electionError, difficulty.electionError);
      const finalSupport = clamp(support + lateTrust + debate + field + error - difficulty.supportPenalty * 0.25, 15, 85);
      const voters = Math.round(region.population * turnout / 100);
      const playerVotes = Math.round(voters * finalSupport / 100);
      const opponentVotes = voters - playerVotes;
      return {
        id: region.id,
        name: region.name,
        support: finalSupport,
        turnout,
        voters,
        playerVotes,
        opponentVotes,
        margin: finalSupport - 50,
        visits: region.visits,
        ground: region.ground
      };
    });
    const playerVotes = rows.reduce((sum, row) => sum + row.playerVotes, 0);
    const opponentVotes = rows.reduce((sum, row) => sum + row.opponentVotes, 0);
    const totalVotes = playerVotes + opponentVotes;
    const playerShare = playerVotes / Math.max(1, totalVotes) * 100;
    const opponentShare = 100 - playerShare;
    const margin = playerShare - opponentShare;
    state.results = {
      rows,
      playerVotes,
      opponentVotes,
      totalVotes,
      playerShare,
      opponentShare,
      margin,
      won: playerVotes > opponentVotes,
      analysis: buildAnalysis(rows, playerShare, margin)
    };
    if (state.career) {
      if (state.results.won) state.career.electionsWon += 1;
      else state.career.electionsLost += 1;
      state.career.history.unshift({
        type: state.results.won ? "Election won" : "Election lost",
        text: `${state.candidate.office}: ${state.results.playerShare.toFixed(1)}% to ${state.results.opponentShare.toFixed(1)}%.`
      });
      state.career.reputation = [...new Set([...(state.career.reputation || []), state.results.analysis.rank])].slice(-6);
    }
    state.phase = "results";
    state.event = null;
    saveState();
    render();
  }

  function buildAnalysis(rows, playerShare, margin) {
    const sortedRegions = [...rows].sort((a, b) => b.margin - a.margin);
    const strongest = sortedRegions.slice(0, 3);
    const weakest = sortedRegions.slice(-3).reverse();
    const bestGroups = [...state.voters].sort((a, b) => b.support - a.support).slice(0, 4);
    const lowTurnoutFriendly = rows
      .filter((row) => row.support > 52 && row.turnout < 60)
      .sort((a, b) => a.turnout - b.turnout)
      .slice(0, 2);
    const neglected = rows
      .filter((row) => row.visits === 0)
      .sort((a, b) => byId(DATA.regions, b.id).electoralValue - byId(DATA.regions, a.id).electoralValue)
      .slice(0, 2);
    const rank = electionRank(margin, playerShare);
    const notes = [];
    if (state.resources.trust >= 58) notes.push("Public trust was a real campaign asset.");
    if (state.resources.volunteers >= 90) notes.push("The volunteer base gave you a stronger ground game than a paid-media campaign alone.");
    if (state.resources.money > 25000) notes.push("You left substantial money unused, which may have mattered in close regions.");
    if (lowTurnoutFriendly.length) notes.push(`Friendly but lower-turnout territory held you back: ${lowTurnoutFriendly.map((row) => row.name).join(", ")}.`);
    if (neglected.length) notes.push(`You never visited ${neglected.map((row) => row.name).join(" or ")}, leaving votes on the table.`);
    if (!notes.length) notes.push("The result mostly reflected coalition fit and late campaign execution.");
    return { strongest, weakest, bestGroups, lowTurnoutFriendly, neglected, rank, notes };
  }

  function electionRank(margin, playerShare) {
    if (margin >= 8) return "Landslide Victory";
    if (margin > 0 && margin < 2) return "Narrow Victory";
    if (margin > 0 && state.resources.volunteers > 95) return "Grassroots Organizer";
    if (margin > 0 && state.resources.trust > 60) return "Coalition Builder";
    if (margin > 0) return "Mandate Secured";
    if (margin > -2) return "Missed Opportunity";
    if (playerShare < 42) return "Crushed at the Ballot Box";
    return "Hard Lesson";
  }

  function beginGoverning() {
    if (!state.results?.won) return;
    const office = byId(DATA.officeLadder, state.candidate.officeId) || scenarioOffice();
    const difficulty = getDifficulty();
    state.phase = "governing";
    state.govTab = "briefing";
    state.career.currentOfficeId = office.id;
    state.career.history.unshift({
      type: "Took office",
      text: `${state.candidate.name} began governing as ${office.name}.`
    });
    state.career.reputation = [...new Set([...(state.career.reputation || []), state.results.analysis.rank])].slice(-6);
    state.governing = {
      month: 1,
      termMonths: 18,
      approval: clamp(Math.round(state.results.playerShare + 2 - difficulty.supportPenalty * 0.4), 34, 68),
      trust: Math.round(state.resources.trust),
      capital: clamp(Math.round(4 + state.resources.capital * 0.35 + Math.max(0, state.results.margin) * difficulty.govCapitalMargin), 2, difficulty.startingGovCapitalMax),
      budget: difficulty.startBudget,
      deficit: 0,
      metrics: {
        education: 50,
        healthcare: 50,
        housing: 50,
        economy: 50,
        environment: 50,
        safety: 50,
        administration: 50,
        rural: 50,
        inequality: 50,
        transportation: 50,
        trust: Math.round(state.resources.trust)
      },
      staff: {},
      factions: (DATA.factions || []).map((faction) => ({ ...faction, support: clamp(faction.support - difficulty.votePenalty, 20, 82) })),
      passedPolicies: [],
      failedPolicies: [],
      oppositionBill: null,
      oppositionCompleted: [],
      completedEvents: [],
      event: byId(DATA.governingEvents, "administrationFirstMeeting"),
      log: ["Election night is over. The first administration meeting is waiting."]
    };
    saveState();
    render();
  }

  function renderGoverning() {
    const gov = state.governing;
    const office = byId(DATA.officeLadder, state.career?.currentOfficeId) || scenarioOffice();
    root.innerHTML = `
      <section class="game-shell governing-shell">
        <div class="game-header">
          <div>
            <p class="eyebrow">Month ${gov.month} of ${gov.termMonths}</p>
            <h1>${escapeHTML(state.candidate.name)} · ${escapeHTML(office.name)}</h1>
            <p>Approval ${Math.round(gov.approval)}% · Budget ${Math.round(gov.budget)} · Political capital ${Math.round(gov.capital)}</p>
          </div>
          <div class="header-actions">
            <button class="button secondary" id="manualSave" type="button">Save Career</button>
            <button class="button secondary" id="newCampaign" type="button">New Career</button>
            <button class="button primary" id="advanceMonth" type="button">${gov.month >= gov.termMonths ? "Term Review" : "Next Month"}</button>
          </div>
        </div>
        ${renderGoverningResourceBar()}
        ${gov.event ? renderGoverningEvent(gov.event) : ""}
        ${gov.oppositionBill ? renderOppositionBill(gov.oppositionBill) : ""}
        ${state.tutorial?.active && state.tutorial.step >= 5 ? renderGoverningTutorialPanel() : ""}
        <div class="tab-row" role="tablist">
          ${GOV_TABS.map((tab) => `<button class="${(state.govTab || "briefing") === tab.id ? "active" : ""}" data-gov-tab="${tab.id}" type="button">${escapeHTML(tab.name)}</button>`).join("")}
        </div>
        <section class="tab-panel">${renderGoverningTab()}</section>
      </section>
    `;
    bindGoverningEvents();
  }

  function renderGoverningResourceBar() {
    const gov = state.governing;
    const resources = [
      ["Approval", `${Math.round(gov.approval)}%`],
      ["Trust", `${Math.round(gov.trust)}%`],
      ["Budget", String(Math.round(gov.budget))],
      ["Deficit", String(Math.round(gov.deficit))],
      ["Capital", String(Math.round(gov.capital))],
      ["Education", `${Math.round(gov.metrics.education)}`],
      ["Housing", `${Math.round(gov.metrics.housing)}`],
      ["Safety", `${Math.round(gov.metrics.safety)}`]
    ];
    return `
      <div class="resource-grid">
        ${resources.map(([label, value]) => `
          <div title="${escapeHTML(governingMetricDescription(label))}">
            <span>${escapeHTML(label)}</span>
            <strong>${escapeHTML(value)}</strong>
            <small>${escapeHTML(governingMetricDescription(label))}</small>
          </div>
        `).join("")}
      </div>
    `;
  }

  function governingMetricDescription(label) {
    return {
      Approval: "Public standing. Low approval makes future elections and crises harder.",
      Trust: "How much voters believe your explanations during tradeoffs.",
      Budget: "Available governing capacity for policies and deals.",
      Deficit: "Accumulated overspending that damages approval over time.",
      Capital: "Leverage for staff, factions, bills, and negotiations.",
      Education: "School outcomes and credibility with parents and teachers.",
      Housing: "Affordability, supply, and renter/homeowner pressure.",
      Safety: "Public-safety confidence and crisis vulnerability."
    }[label] || "Governing measure";
  }

  function renderGoverningEvent(eventData) {
    return `
      <article class="event-panel">
        <div>
          <p class="eyebrow">Administration Meeting</p>
          <h2>${escapeHTML(eventData.title)}</h2>
          <p>${escapeHTML(eventData.body)}</p>
        </div>
        <div class="event-choices">
          ${eventData.choices.map((choice, index) => `
            <button type="button" data-gov-event-choice="${index}">
              <strong>${escapeHTML(choice.label)}</strong>
              <span>${escapeHTML(effectSummary(choice.effects))}</span>
            </button>
          `).join("")}
        </div>
      </article>
    `;
  }

  function renderOppositionBill(bill) {
    return `
      <article class="event-panel opposition-panel">
        <div>
          <p class="eyebrow">Opposition Bill</p>
          <h2>${escapeHTML(bill.name)}</h2>
          <p>${escapeHTML(bill.text)}</p>
          <p><strong>Sponsor:</strong> ${escapeHTML(bill.sponsor)}</p>
        </div>
        <div class="event-choices">
          ${bill.choices.map((choice, index) => `
            <button type="button" data-opposition-choice="${index}">
              <strong>${escapeHTML(choice.label)}</strong>
              <span>${escapeHTML(effectSummary(choice.effects))}</span>
            </button>
          `).join("")}
        </div>
      </article>
    `;
  }

  function effectSummary(effects = {}) {
    const parts = [];
    if (effects.approval) parts.push(`${signed(effects.approval)} approval`);
    if (effects.trust) parts.push(`${signed(effects.trust)} trust`);
    if (effects.capital) parts.push(`${signed(effects.capital)} capital`);
    if (effects.metrics?.budget) parts.push(`${signed(effects.metrics.budget)} budget`);
    return parts.join(" · ") || "Mixed consequences";
  }

  function renderGoverningTutorialPanel() {
    return `
      <article class="civic-tutorial-panel">
        <div>
          <span>Tutorial 6/6</span>
          <h2>Winning Is Not the End</h2>
          <p>Now you govern. Answer administration meetings, appoint staff, pass policy cards, watch the budget, and keep enough factions with you to survive future elections.</p>
        </div>
        <div class="button-row">
          <button class="button secondary" data-tutorial-close type="button">Finish Tutorial</button>
        </div>
      </article>
    `;
  }

  function renderGoverningTab() {
    const tab = state.govTab || "briefing";
    if (tab === "administration") return renderAdministrationTab();
    if (tab === "laws") return renderLawsTab();
    if (tab === "legislature") return renderLegislatureTab();
    if (tab === "budget") return renderBudgetTab();
    if (tab === "career") return renderCareerTab();
    return renderBriefingTab();
  }

  function renderBriefingTab() {
    const gov = state.governing;
    return `
      <div class="hq-grid">
        <article class="dashboard-card">
          <h2>Executive Briefing</h2>
          <p class="card-copy">Each month, choose a priority, manage the team, and decide which policies deserve political capital. Your next campaign starts with the record you build here.</p>
          <div class="meter-list">
            ${meter("Approval", gov.approval, "%")}
            ${meter("Public trust", gov.trust, "%")}
            ${meter("Education", gov.metrics.education, "")}
            ${meter("Housing", gov.metrics.housing, "")}
          </div>
        </article>
        <article class="dashboard-card">
          <h2>Chief of Staff</h2>
          <p class="card-copy">${escapeHTML(advisorLine("Chief of Staff", "Your approval is steady, but the legislature is divided. Pick one priority and keep the calendar honest."))}</p>
        </article>
        <article class="dashboard-card">
          <h2>Policy Director</h2>
          <p class="card-copy">${escapeHTML(advisorLine("Policy Director", "The policy cards are ready. The question is whether you can afford the budget and the votes at the same time."))}</p>
        </article>
        <article class="dashboard-card">
          <h2>Legislative Liaison</h2>
          <p class="card-copy">${escapeHTML(advisorLine("Legislative Liaison", "The Bipartisan Reform Caucus and Rural Coalition can decide close votes. Talk to them before forcing a bill."))}</p>
        </article>
        <article class="dashboard-card wide-card">
          <h2>Governing Log</h2>
          <div class="campaign-log">
            ${gov.log.slice(0, 12).map((entry) => `<p><span>Month ${gov.month}</span>${escapeHTML(entry)}</p>`).join("")}
          </div>
        </article>
      </div>
    `;
  }

  function advisorLine(role, fallback) {
    const advisor = DATA.staff?.find((person) => state.governing.staff[role] === person.id);
    if (!advisor) return fallback;
    return `${advisor.name}: ${fallback} (${advisor.trait})`;
  }

  function renderAdministrationTab() {
    const roles = [...new Set((DATA.staff || []).map((person) => person.role))];
    return `
      <div class="section-intro">
        <h2>Administration</h2>
        <p>Staff choices shape governing outcomes. Strong advisors improve policy, legislation, media response, budget discipline, or coalition management, but no team is perfect.</p>
      </div>
      <div class="staff-role-list">
        ${roles.map((role) => {
          const currentId = state.governing.staff[role];
          const current = byId(DATA.staff, currentId);
          return `
            <section class="staff-role-section">
              <div class="staff-role-head">
                <h3>${escapeHTML(role)}</h3>
                <span>${current ? `Current: ${escapeHTML(current.name)}` : "No appointment yet"}</span>
              </div>
              <div class="staff-grid">
                ${(DATA.staff || []).filter((person) => person.role === role).map((person) => {
                  const appointed = currentId === person.id;
                  const replacing = currentId && !appointed;
                  return `
                    <article class="staff-card ${appointed ? "appointed" : ""}">
                      <h3>${escapeHTML(person.name)}</h3>
                      <p><strong>${escapeHTML(person.trait)}</strong></p>
                      <p>${escapeHTML(person.ideology)} · competence ${person.competence} · loyalty ${person.loyalty}</p>
                      <p class="card-copy">${escapeHTML(effectSummaryGoverningStaff(person.effects))}</p>
                      <button class="button secondary" data-appoint-staff="${person.id}" type="button" ${appointed ? "disabled" : ""}>${appointed ? "Appointed" : replacing ? "Replace" : "Appoint"}</button>
                    </article>
                  `;
                }).join("")}
              </div>
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function effectSummaryGoverningStaff(effects = {}) {
    const parts = [];
    if (effects.administration) parts.push(`${signed(effects.administration)} administration`);
    if (effects.policy) parts.push(`${signed(effects.policy)} policy skill`);
    if (effects.legislative) parts.push(`${signed(effects.legislative)} legislative skill`);
    if (effects.budget) parts.push(`${signed(effects.budget)} budget discipline`);
    if (effects.media) parts.push(`${signed(effects.media)} media handling`);
    if (effects.capital) parts.push(`${signed(effects.capital)} capital`);
    if (effects.trust) parts.push(`${signed(effects.trust)} trust`);
    if (effects.groups) parts.push("moves voter groups");
    return parts.join(" · ") || "No immediate effect";
  }

  function renderLawsTab() {
    return `
      <div class="section-intro">
        <h2>Policy Cards</h2>
        <p>Policies affect budget, approval, metrics, voter groups, and legislative factions. Some benefits are immediate; others shape your long-term record.</p>
      </div>
      <div class="opposition-docket">
        <h3>Opposition Docket</h3>
        <p>${state.governing.oppositionBill ? `${escapeHTML(state.governing.oppositionBill.name)} is active and must be decided.` : "Opposition bills can appear between months, especially on harder modes. Deals may help one faction while angering another."}</p>
      </div>
      <div class="policy-card-grid">
        ${(DATA.governingPolicies || []).map((policy) => renderGoverningPolicy(policy)).join("")}
      </div>
    `;
  }

  function renderGoverningPolicy(policy) {
    const passed = state.governing.passedPolicies.includes(policy.id);
    const votes = estimatePolicyVotes(policy);
    const cost = policyBudgetCost(policy);
    const capital = policyCapitalCost(policy);
    const canPass = !passed && state.governing.capital >= capital && state.governing.budget >= cost && votes.yes > votes.total / 2;
    return `
      <article class="law-card ${passed ? "passed" : ""}">
        <span>${escapeHTML(policy.area)}</span>
        <h3>${escapeHTML(policy.name)}</h3>
        <p>${escapeHTML(policy.text)}</p>
        <div class="law-meta">
          <strong>Cost ${cost}</strong>
          <strong>Capital ${capital}</strong>
          <strong>Votes ${votes.yes}/${votes.total}</strong>
        </div>
        <button class="button primary" data-pass-policy="${policy.id}" type="button" ${canPass ? "" : "disabled"}>${passed ? "Passed" : canPass ? "Pass Bill" : "Needs Votes or Budget"}</button>
      </article>
    `;
  }

  function policyBudgetCost(policy) {
    return Math.max(1, Math.round((policy.cost || 0) * getDifficulty().policyCost));
  }

  function policyCapitalCost(policy) {
    return Math.max(1, Math.round((policy.capital || 0) * getDifficulty().policyCapital));
  }

  function renderLegislatureTab() {
    return `
      <div class="section-intro">
        <h2>Legislature</h2>
        <p>Factions provide votes when their priorities, ideology, and your trust line up. Political capital can help, but a neglected faction will not stay friendly forever.</p>
      </div>
      <div class="faction-grid">
        ${state.governing.factions.map((faction) => `
          <article class="faction-card">
            <h3>${escapeHTML(faction.name)}</h3>
            <p>${faction.seats} seats · support ${Math.round(faction.support)}%</p>
            ${simpleBar("Support", faction.support)}
            <div class="tag-row">${faction.priorities.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div>
            <button class="button secondary" data-meet-faction="${faction.id}" type="button" ${state.governing.capital <= 0 ? "disabled" : ""}>Meet Leader · 1 capital</button>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderBudgetTab() {
    const gov = state.governing;
    const difficulty = getDifficulty();
    const rows = [
      ["Education", gov.metrics.education],
      ["Healthcare", gov.metrics.healthcare],
      ["Housing", gov.metrics.housing],
      ["Economy", gov.metrics.economy],
      ["Environment", gov.metrics.environment],
      ["Public safety", gov.metrics.safety],
      ["Administration", gov.metrics.administration],
      ["Rural access", gov.metrics.rural],
      ["Transportation", gov.metrics.transportation]
    ];
    return `
      <div class="budget-layout">
        <article class="dashboard-card">
          <h2>Budget Position</h2>
          <div class="big-poll">
            <strong>${gov.budget}</strong>
            <span>Available budget · deficit ${gov.deficit}</span>
          </div>
          <p class="card-copy">${escapeHTML(difficulty.name)} mode: monthly revenue is ${difficulty.monthlyRevenue}, policy costs are scaled by ${difficulty.policyCost.toFixed(2)}, and deficits drag approval more on harder modes.</p>
        </article>
        <article class="dashboard-card wide-card">
          <h2>Public Outcomes</h2>
          <div class="meter-list">
            ${rows.map(([label, value]) => meter(label, value, "")).join("")}
          </div>
        </article>
      </div>
    `;
  }

  function bindGoverningEvents() {
    document.querySelector("#manualSave")?.addEventListener("click", () => {
      saveState();
      state.governing.log.unshift("Career saved locally.");
      render();
    });
    document.querySelector("#newCampaign")?.addEventListener("click", () => {
      if (!window.confirm("Start a new career and replace the saved game?")) return;
      clearSavedState();
      state = null;
      render();
    });
    document.querySelector("#advanceMonth")?.addEventListener("click", advanceGoverningMonth);
    document.querySelector("[data-tutorial-close]")?.addEventListener("click", () => {
      if (state.tutorial) state.tutorial.active = false;
      saveState();
      render();
    });
    document.querySelectorAll("[data-gov-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.govTab = button.dataset.govTab;
        saveState();
        render();
      });
    });
    document.querySelectorAll("[data-gov-event-choice]").forEach((button) => {
      button.addEventListener("click", () => chooseGoverningEvent(Number(button.dataset.govEventChoice)));
    });
    document.querySelectorAll("[data-opposition-choice]").forEach((button) => {
      button.addEventListener("click", () => chooseOppositionBill(Number(button.dataset.oppositionChoice)));
    });
    document.querySelectorAll("[data-appoint-staff]").forEach((button) => {
      button.addEventListener("click", () => appointStaff(button.dataset.appointStaff));
    });
    document.querySelectorAll("[data-pass-policy]").forEach((button) => {
      button.addEventListener("click", () => passPolicy(button.dataset.passPolicy));
    });
    document.querySelectorAll("[data-meet-faction]").forEach((button) => {
      button.addEventListener("click", () => meetFaction(button.dataset.meetFaction));
    });
  }

  function applyGoverningEffects(effects = {}) {
    const gov = state.governing;
    if (effects.approval) gov.approval = clamp(gov.approval + effects.approval, 10, 90);
    if (effects.trust) gov.trust = clamp(gov.trust + effects.trust, 0, 100);
    if (effects.capital) gov.capital = clamp(gov.capital + effects.capital, 0, 99);
    if (effects.media) gov.approval = clamp(gov.approval + effects.media * 0.15, 10, 90);
    Object.entries(effects.metrics || {}).forEach(([key, value]) => {
      if (key === "approval") {
        gov.approval = clamp(gov.approval + value, 10, 90);
      } else if (key === "budget") {
        gov.budget += value;
        if (gov.budget < 0) {
          gov.deficit += Math.abs(gov.budget);
          gov.budget = 0;
        }
      } else {
        gov.metrics[key] = clamp((gov.metrics[key] || 50) + value, 0, 100);
      }
    });
    if (effects.groups) applyGroupEffects(effects.groups, 0.65);
    Object.entries(effects.factions || {}).forEach(([id, value]) => {
      const faction = gov.factions.find((item) => item.id === id);
      if (faction) faction.support = clamp(faction.support + value, 0, 100);
    });
  }

  function chooseGoverningEvent(choiceIndex) {
    const eventData = state.governing.event;
    const choice = eventData?.choices?.[choiceIndex];
    if (!choice) return;
    applyGoverningEffects(choice.effects);
    state.governing.completedEvents.push(eventData.id);
    state.governing.log.unshift(`${eventData.title}: ${choice.label}`);
    state.governing.event = null;
    saveState();
    render();
  }

  function chooseOppositionBill(choiceIndex) {
    const bill = state.governing.oppositionBill;
    const choice = bill?.choices?.[choiceIndex];
    if (!bill || !choice) return;
    applyGoverningEffects(choice.effects);
    state.governing.oppositionCompleted.push(bill.id);
    state.governing.log.unshift(`${bill.name}: ${choice.label}`);
    state.governing.oppositionBill = null;
    saveState();
    render();
  }

  function appointStaff(staffId) {
    const person = byId(DATA.staff, staffId);
    if (!person) return;
    state.governing.staff[person.role] = person.id;
    state.governing.log.unshift(`${person.name} appointed as ${person.role}.`);
    applyGoverningEffects({
      trust: person.effects?.trust || 0,
      capital: person.effects?.capital || 0,
      groups: person.effects?.groups || {},
      metrics: {
        administration: person.effects?.administration || 0,
        budget: person.effects?.budget || 0
      }
    });
    Object.entries(person.effects || {}).forEach(([key, value]) => {
      if (state.career.skills[key] != null && typeof value === "number") state.career.skills[key] += Math.max(0, Math.round(value / 2));
    });
    saveState();
    render();
  }

  function estimatePolicyVotes(policy) {
    const total = state.governing.factions.reduce((sum, faction) => sum + faction.seats, 0);
    const yes = state.governing.factions.reduce((sum, faction) => {
      const issueFit = faction.priorities.includes(policy.area.toLowerCase()) || faction.priorities.some((priority) => policy.id.toLowerCase().includes(priority.toLowerCase())) ? 12 : 0;
      const policyMod = policy.factions?.[faction.id] || 0;
      const chance = faction.support + issueFit + policyMod * 8 + (state.governing.trust - 50) * 0.12 + state.governing.capital * 0.2 - getDifficulty().votePenalty;
      return sum + (chance >= 50 ? faction.seats : 0);
    }, 0);
    return { yes, total };
  }

  function passPolicy(policyId) {
    const policy = byId(DATA.governingPolicies, policyId);
    if (!policy || state.governing.passedPolicies.includes(policyId)) return;
    const votes = estimatePolicyVotes(policy);
    const cost = policyBudgetCost(policy);
    const capital = policyCapitalCost(policy);
    if (votes.yes <= votes.total / 2 || state.governing.capital < capital || state.governing.budget < cost) return;
    state.governing.capital -= capital;
    state.governing.passedPolicies.push(policy.id);
    applyGoverningEffects({ groups: policy.groups, factions: policy.factions, metrics: { ...policy.metrics, budget: -cost } });
    state.career.history.unshift({ type: "Law passed", text: `${policy.name} became part of your governing record.` });
    state.governing.log.unshift(`Passed ${policy.name}.`);
    saveState();
    render();
  }

  function meetFaction(factionId) {
    const faction = state.governing.factions.find((item) => item.id === factionId);
    if (!faction || state.governing.capital <= 0) return;
    state.governing.capital -= 1;
    faction.support = clamp(faction.support + 6 + state.career.skills.coalition, 0, 100);
    state.governing.log.unshift(`Met with ${faction.name}. Support improved, but political capital was spent.`);
    saveState();
    render();
  }

  function drawGoverningEvent() {
    const eligible = (DATA.governingEvents || []).filter((eventData) => !state.governing.completedEvents.includes(eventData.id));
    if (!eligible.length) return null;
    if (Math.random() > 0.7) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  }

  function drawOppositionBill() {
    const eligible = (DATA.oppositionBills || []).filter((bill) => !state.governing.oppositionCompleted.includes(bill.id));
    if (!eligible.length) return null;
    if (Math.random() > getDifficulty().oppositionChance) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  }

  function advanceGoverningMonth() {
    const gov = state.governing;
    if (gov.event) {
      gov.log.unshift("Resolve the current administration meeting before advancing.");
      render();
      return;
    }
    if (gov.oppositionBill) {
      gov.log.unshift("Decide the active opposition bill before advancing.");
      render();
      return;
    }
    if (gov.month >= gov.termMonths) {
      state.career.legacy = legacyLabel();
      state.phase = "termReview";
      state.termReview = buildTermReview();
      state.career.history.unshift({
        type: "Term completed",
        text: `${state.candidate.name} completed a term as ${byId(DATA.officeLadder, state.career?.currentOfficeId)?.name || state.candidate.office} with ${state.termReview.approval}% approval and the legacy label ${state.termReview.legacy}.`
      });
      saveState();
      render();
      return;
    }
    gov.month += 1;
    gov.budget += getDifficulty().monthlyRevenue;
    gov.capital = clamp(gov.capital + (getDifficulty().id === "advanced" ? 0 : 1), 0, 99);
    gov.approval = clamp(gov.approval + (gov.trust - 50) * 0.012 - gov.deficit * getDifficulty().approvalDrag, 10, 90);
    gov.factions.forEach((faction) => {
      faction.support = clamp(faction.support + randomBetween(-getDifficulty().factionDrift, getDifficulty().factionDrift * 0.75), 0, 100);
    });
    gov.event = drawGoverningEvent();
    if (!gov.event) gov.oppositionBill = drawOppositionBill();
    gov.log.unshift(`Month ${gov.month} begins. Budget revenue arrives and factions reassess the administration.`);
    saveState();
    render();
  }

  function legacyLabel() {
    const gov = state.governing;
    if (gov.metrics.education >= 62) return "Education Champion";
    if (gov.metrics.housing >= 62) return "Housing Reformer";
    if (gov.trust >= 62) return "Anti-Corruption Reformer";
    if (gov.deficit <= 2 && gov.budget >= 70) return "Fiscal Steward";
    if (gov.approval >= 62) return "Coalition Governor";
    return "Pragmatic Survivor";
  }

  function buildTermReview() {
    const gov = state.governing;
    const strongestMetrics = Object.entries(gov.metrics || {})
      .filter(([key]) => key !== "trust")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const weakestMetrics = Object.entries(gov.metrics || {})
      .filter(([key]) => key !== "trust")
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3);
    const notes = [];
    if (gov.approval >= 65) notes.push("Your approval gives you room to seek a higher office or ask voters for another term.");
    else if (gov.approval >= 50) notes.push("Your approval is workable, but the next campaign will need a clear explanation of what changed during the term.");
    else notes.push("Low approval will make the next race difficult unless you rebuild trust before asking for a promotion.");
    if ((gov.passedPolicies || []).length) notes.push(`${gov.passedPolicies.length} major policies became part of your record.`);
    else notes.push("You leave office without a major enacted policy, which opponents can frame as drift.");
    if (gov.deficit > 8) notes.push("The deficit is now a political liability and will follow you into the next race.");
    else if (gov.budget >= 80) notes.push("Your budget position is strong, giving you a fiscal argument for future campaigns.");
    if (gov.trust >= 70) notes.push("High public trust is your strongest long-term asset.");
    return {
      legacy: legacyLabel(),
      approval: Math.round(gov.approval),
      trust: Math.round(gov.trust),
      budget: Math.round(gov.budget),
      deficit: Math.round(gov.deficit),
      capital: Math.round(gov.capital),
      passedPolicies: [...(gov.passedPolicies || [])],
      failedPolicies: [...(gov.failedPolicies || [])],
      strongestMetrics,
      weakestMetrics,
      notes
    };
  }

  function renderTermReview() {
    const review = state.termReview || buildTermReview();
    const office = byId(DATA.officeLadder, state.career?.currentOfficeId) || scenarioOffice();
    const passed = review.passedPolicies.map((id) => byId(DATA.governingPolicies, id)?.name || id);
    root.innerHTML = `
      <section class="results-shell">
        <div class="results-hero won">
          <p class="eyebrow">Term Review</p>
          <h1>${escapeHTML(review.legacy)}</h1>
          <p>${escapeHTML(state.candidate.name)} completed a term as ${escapeHTML(office?.name || state.candidate.office)} with ${review.approval}% approval, ${review.trust}% trust, and a budget position of ${review.budget}.</p>
          <div class="result-totals">
            <div><span>Approval</span><strong>${review.approval}%</strong><em>public standing</em></div>
            <div><span>Budget</span><strong>${review.budget}</strong><em>deficit ${review.deficit}</em></div>
          </div>
          <div class="button-row">
            <button class="button primary" data-career-next="reelection" type="button">Run for Reelection</button>
            <button class="button primary" data-career-next="higher" type="button">Run for Higher Office</button>
            <button class="button secondary" data-career-next="appointment" type="button">Accept Appointment Offer</button>
            <button class="button secondary" id="returnToCareer" type="button">Review Career</button>
          </div>
        </div>
        <div class="results-grid">
          <article class="dashboard-card wide-card">
            <h2>Record in Office</h2>
            ${passed.length ? passed.map((name) => `<p><strong>${escapeHTML(name)}</strong> became part of your governing record.</p>`).join("") : "<p>No major policies passed this term.</p>"}
          </article>
          <article class="dashboard-card">
            <h2>Strongest Outcomes</h2>
            ${review.strongestMetrics.map(([key, value]) => `<p><strong>${escapeHTML(metricLabel(key))}</strong> · ${Math.round(value)}</p>`).join("")}
          </article>
          <article class="dashboard-card">
            <h2>Weakest Outcomes</h2>
            ${review.weakestMetrics.map(([key, value]) => `<p><strong>${escapeHTML(metricLabel(key))}</strong> · ${Math.round(value)}</p>`).join("")}
          </article>
          <article class="dashboard-card wide-card">
            <h2>Career Analysis</h2>
            ${review.notes.map((note) => `<p>${escapeHTML(note)}</p>`).join("")}
          </article>
        </div>
      </section>
    `;
    document.querySelector("#returnToCareer")?.addEventListener("click", () => {
      state.phase = "governing";
      state.govTab = "career";
      saveState();
      render();
    });
    document.querySelectorAll("[data-career-next]").forEach((button) => {
      button.addEventListener("click", () => chooseCareerNextStep(button.dataset.careerNext));
    });
  }

  function chooseCareerNextStep(choice) {
    if (choice === "appointment") {
      acceptAppointmentOffer();
      return;
    }
    launchNextCampaign(choice === "higher");
  }

  function launchNextCampaign(higherOffice = false) {
    const previous = JSON.parse(JSON.stringify(state));
    const currentOffice = byId(DATA.officeLadder, previous.career?.currentOfficeId) || scenarioOffice();
    const ladder = (DATA.officeLadder || []).filter((office) => !office.id.startsWith("appointed")).sort((a, b) => a.tier - b.tier);
    const nextOffice = higherOffice ? ladder.find((office) => office.tier > (currentOffice?.tier || 1)) || currentOffice : currentOffice;
    const scenario = nextOffice?.id === "schoolBoard" ? byId(DATA.scenarios, "schoolBoardDistrict") : byId(DATA.scenarios, "stateHouseSwingDistrict") || DATA.scenarios[0];
    const formValues = {
      candidateName: previous.candidate.name,
      candidateAge: String((previous.candidate.age || 35) + 2),
      homeState: previous.candidate.homeStateId || scenario.stateId || "pa",
      education: previous.candidate.educationId || "bachelors",
      difficulty: previous.difficultyId || "intermediate",
      scenario: scenario.id,
      background: previous.candidate.backgroundId || "teacher",
      party: previous.candidate.partyId || "independent",
      ideology: previous.candidate.ideologyId || "centristIndependent",
      style: previous.candidate.styleId || "pragmatic",
      trait: previous.candidate.traitId || "coalitionBuilder",
      homeRegion: previous.candidate.homeRegionId || "pineSuburbs",
      issueOne: previous.candidate.topIssues?.[0] || "education",
      issueTwo: previous.candidate.topIssues?.[1] || "housing",
      opponent: previous.opponentId || scenario.defaultOpponent,
      tutorial: "false"
    };
    startCampaign({ get: (key) => formValues[key] || "" });
    state.candidate.office = nextOffice?.name || scenario.office;
    state.candidate.officeId = nextOffice?.id || scenario.officeId;
    const homeState = byId(DATA.usStates, state.candidate.homeStateId);
    const difficulty = getDifficulty(state.difficultyId);
    state.log = state.log.map((entry) => {
      if (!entry.message?.includes(" U.S. career campaign for ")) return entry;
      return {
        ...entry,
        message: `${state.candidate.name} launched a ${difficulty.name.toLowerCase()} U.S. career campaign for ${state.candidate.office} in ${homeState?.name || "a home state"}.`
      };
    });
    state.career = {
      ...previous.career,
      currentOfficeId: nextOffice?.id || previous.career?.currentOfficeId,
      history: [...(previous.career?.history || [])],
      skills: { ...BASE_SKILLS, ...(previous.career?.skills || {}) },
      reputation: previous.career?.reputation || ["Incumbent"],
      legacy: previous.career?.legacy || "Unwritten"
    };
    state.career.skills.nameRecognition = (state.career.skills.nameRecognition || 10) + (higherOffice ? 4 : 2);
    state.career.history.unshift({
      type: higherOffice ? "Launched higher-office campaign" : "Launched reelection campaign",
      text: `${state.candidate.name} began a campaign for ${state.candidate.office}.`
    });
    addLog(`${higherOffice ? "Higher office" : "Reelection"} campaign launched from your governing record.`, "major");
    saveState();
    render();
  }

  function acceptAppointmentOffer() {
    const previous = JSON.parse(JSON.stringify(state));
    const office = byId(DATA.officeLadder, "appointedEducation");
    state.phase = "governing";
    state.govTab = "briefing";
    state.candidate.office = office.name;
    state.candidate.officeId = office.id;
    state.career.currentOfficeId = office.id;
    state.career.history.unshift({
      type: "Appointment accepted",
      text: `${state.candidate.name} accepted an appointment as ${office.name}.`
    });
    state.governing = {
      ...previous.governing,
      month: 1,
      termMonths: 12,
      approval: clamp(previous.termReview?.approval || previous.governing?.approval || 52, 30, 74),
      capital: Math.max(3, Math.round((previous.termReview?.capital || previous.governing?.capital || 4) / 2)),
      budget: Math.max(40, Math.round((previous.termReview?.budget || previous.governing?.budget || 70) * 0.65)),
      oppositionBill: null,
      event: {
        id: "appointmentMandate",
        title: "Appointment Offer Accepted",
        body: "The appointment gives you administrative power without a fresh election. Legislators will test whether you are governing for students or building your next campaign.",
        choices: [
          { label: "Promise a quiet implementation term.", effects: { trust: 1, capital: 1, metrics: { administration: 2, education: 1 } } },
          { label: "Announce a bold literacy push.", effects: { approval: 1, capital: -1, metrics: { education: 4, budget: -4 }, groups: { parents: 2, teachers: 1 } } },
          { label: "Use the post to build a statewide profile.", effects: { approval: -1, media: 3, capital: 1, groups: { partyActivists: 1, independents: -1 } } }
        ]
      },
      log: ["Appointment accepted. A new administrative chapter begins."]
    };
    saveState();
    render();
  }

  function metricLabel(key) {
    return {
      education: "Education",
      healthcare: "Healthcare",
      housing: "Housing",
      economy: "Economy",
      environment: "Environment",
      safety: "Public safety",
      administration: "Administration",
      rural: "Rural access",
      inequality: "Inequality",
      transportation: "Transportation"
    }[key] || key;
  }

  function renderResults() {
    const results = state.results;
    const opponent = byId(DATA.opponents, state.opponentId);
    root.innerHTML = `
      <section class="results-shell">
        <div class="results-hero ${results.won ? "won" : "lost"}">
          <p class="eyebrow">Election Night</p>
          <h1>${escapeHTML(results.analysis.rank)}</h1>
          <p>${escapeHTML(state.candidate.name)} ${results.won ? "defeated" : "lost to"} ${escapeHTML(opponent.name)} by ${Math.abs(results.margin).toFixed(1)} percentage points.</p>
          <div class="result-totals">
            <div><span>${escapeHTML(state.candidate.name)}</span><strong>${formatNumber(results.playerVotes)}</strong><em>${results.playerShare.toFixed(1)}%</em></div>
            <div><span>${escapeHTML(opponent.name)}</span><strong>${formatNumber(results.opponentVotes)}</strong><em>${results.opponentShare.toFixed(1)}%</em></div>
          </div>
          <div class="button-row">
            ${results.won ? '<button class="button primary" id="beginGoverning" type="button">Begin Governing</button>' : ""}
            <button class="button primary" id="playAgain" type="button">Play Again</button>
          </div>
        </div>
        <div class="results-grid">
          <article class="dashboard-card wide-card">
            <h2>Regional Results</h2>
            <div class="result-region-list">
              ${results.rows.sort((a, b) => b.playerVotes + b.opponentVotes - (a.playerVotes + a.opponentVotes)).map((row) => `
                <div class="${row.margin >= 0 ? "won" : "lost"}">
                  <span>${escapeHTML(row.name)}</span>
                  <i><b style="width:${clamp(row.support, 0, 100)}%"></b></i>
                  <strong>${row.support.toFixed(1)}%</strong>
                  <em>${formatNumber(row.playerVotes)} to ${formatNumber(row.opponentVotes)}</em>
                </div>
              `).join("")}
            </div>
          </article>
          <article class="dashboard-card">
            <h2>Strongest Regions</h2>
            ${results.analysis.strongest.map((row) => `<p><strong>${escapeHTML(row.name)}</strong> · ${row.support.toFixed(1)}% · ${Math.round(row.turnout)}% turnout</p>`).join("")}
          </article>
          <article class="dashboard-card">
            <h2>Weakest Regions</h2>
            ${results.analysis.weakest.map((row) => `<p><strong>${escapeHTML(row.name)}</strong> · ${row.support.toFixed(1)}% · ${Math.round(row.turnout)}% turnout</p>`).join("")}
          </article>
          <article class="dashboard-card">
            <h2>Best Voter Groups</h2>
            ${results.analysis.bestGroups.map((group) => `<p><strong>${escapeHTML(group.name)}</strong> · ${Math.round(group.support)}% support · ${Math.round(group.turnout)}% turnout</p>`).join("")}
          </article>
          <article class="dashboard-card">
            <h2>Post-Election Analysis</h2>
            ${results.analysis.notes.map((note) => `<p>${escapeHTML(note)}</p>`).join("")}
          </article>
        </div>
      </section>
    `;
    document.querySelector("#playAgain")?.addEventListener("click", () => {
      clearSavedState();
      state = null;
      render();
    });
    document.querySelector("#beginGoverning")?.addEventListener("click", beginGoverning);
  }

  function render() {
    if (!root) return;
    if (!state) {
      renderSetup();
      return;
    }
    renderGame();
  }

  render();
})();
