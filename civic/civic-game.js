(function () {
  const DATA = window.CommonPagesCivicData || {};
  const root = document.querySelector("#civicRoot");
  if (!root) return;

  const VERSION = "0.5.1";
  const SAVE_SCHEMA_VERSION = 3;
  const SAVE_KEY = "commonRepublicScenarioSpineSaveV2";
  const SAVE_SLOTS_KEY = "commonRepublicSaveSlotsV3";
  const LEGACY_SAVE_KEYS = ["commonRepublicScenarioSpineSaveV2", "commonRepublicCareerSaveV1", "commonRepublicGrandStrategySaveV1"];
  const CUSTOM_SCENARIO_KEY = "commonRepublicCustomScenariosV1";
  const DEFAULT_SCENARIO_ID = "schoolBoardDistrict";
  const IS_MOD_MODE = new URLSearchParams(window.location.search).get("mod") === "1";

  const RAW_PARTIES = DATA.parties || [];
  const PARTIES = RAW_PARTIES.length ? RAW_PARTIES.map((party) => ({
    ...party,
    short: party.shortName || party.short || party.name,
    factions: party.ideologyTags || party.factions || ["Local pragmatists", "Institutional reformers", "Movement activists"]
  })) : [
    { id: "democratic", name: "Democratic Party", short: "Democrat", groupModifiers: { teachers: 3, unionMembers: 3, collegeStudents: 2, urbanProfessionals: 1 }, resourceModifiers: { volunteers: 8, capital: 1 }, factions: ["Progressive Democrats", "Liberal Democrats", "Moderate Democrats"] },
    { id: "republican", name: "Republican Party", short: "Republican", groupModifiers: { smallBusiness: 3, ruralVoters: 3, religiousVoters: 3, veterans: 2 }, resourceModifiers: { money: 5000, capital: 1 }, factions: ["Moderate Republicans", "Conservative Republicans", "Populist Republicans"] },
    { id: "independent", name: "Independent", short: "Independent", groupModifiers: { independents: 4, suburbanModerates: 3 }, resourceModifiers: { trust: 3, volunteers: 3, capital: -1 }, factions: ["Good-government reformers", "Local pragmatists", "Disaffected partisans"] }
  ];

  const OFFICE_LADDER = DATA.officeLadder || [
    { id: "schoolBoard", name: "School Board", tier: 1, campaignScale: 0.6, governingPower: 0.55 },
    { id: "cityCouncil", name: "City Council", tier: 2, campaignScale: 0.8, governingPower: 0.7 },
    { id: "mayor", name: "Mayor", tier: 3, campaignScale: 0.95, governingPower: 0.9 },
    { id: "stateHouse", name: "State House Representative", tier: 4, campaignScale: 1, governingPower: 0.85 },
    { id: "governor", name: "Governor", tier: 7, campaignScale: 1.55, governingPower: 1.25 },
    { id: "president", name: "President", tier: 9, campaignScale: 2.25, governingPower: 1.6 }
  ];

  const DIFFICULTIES = {
    easy: {
      name: "Easy",
      text: "A forgiving civic classroom mode: friendlier polls, more money, softer opposition, and lower budget pressure.",
      support: 2.5,
      money: 1.2,
      volunteers: 1.18,
      opposition: 0.72,
      risk: 0.72,
      pollError: 2.2,
      budget: 0.78,
      capital: 1.18
    },
    intermediate: {
      name: "Intermediate",
      text: "The recommended baseline: tight local math, meaningful costs, active opponents, and real budget tradeoffs.",
      support: -2.2,
      money: 1,
      volunteers: 1,
      opposition: 1.1,
      risk: 1,
      pollError: 3.6,
      budget: 1,
      capital: 1
    },
    advanced: {
      name: "Advanced",
      text: "A sharper simulator: worse starting polls, less cash, stronger rival turns, tougher debates, and harsher governing budgets.",
      support: -6,
      money: 0.78,
      volunteers: 0.82,
      opposition: 1.42,
      risk: 1.28,
      pollError: 5.1,
      budget: 1.32,
      capital: 0.82
    }
  };

  const OFFICE_SCOPES = {
    schoolBoard: "localDistrict",
    cityCouncil: "city",
    mayor: "city",
    stateHouse: "stateDistrict",
    stateSenate: "stateDistrict",
    usHouse: "stateDistrict",
    governor: "statewide",
    usSenate: "statewide",
    president: "national"
  };

  const LOCAL_ISSUES = ["education", "taxes", "publicSafety", "housing", "labor", "government", "ruralDevelopment"];
  const SUPPORTED_CAMPAIGN_EFFECT_KEYS = new Set([
    "money", "volunteers", "staff", "capital", "trust", "media", "energy", "time", "debate",
    "regionSupport", "regionTurnout", "regionTurnoutAll", "groupSupport", "groupTurnout",
    "groups", "groupEffects", "regions", "opponentSupport", "issueMomentum"
  ]);
  const STANCE_SCALE = 0.68;
  const PARTY_SCALE = 0.45;
  const BACKGROUND_SCALE = 0.72;

  const MAP_SHAPES = [
    "polygon(4% 4%, 58% 2%, 54% 44%, 7% 49%)",
    "polygon(60% 3%, 97% 9%, 91% 41%, 57% 43%)",
    "polygon(9% 51%, 54% 46%, 61% 96%, 3% 93%)",
    "polygon(58% 45%, 94% 43%, 98% 93%, 63% 96%)",
    "polygon(38% 24%, 75% 16%, 83% 62%, 45% 65%)",
    "polygon(3% 66%, 37% 58%, 42% 96%, 5% 96%)",
    "polygon(69% 61%, 98% 54%, 96% 96%, 66% 92%)",
    "polygon(18% 11%, 43% 6%, 42% 37%, 15% 42%)"
  ];

  const DEFAULT_REGIONS_BY_SCOPE = {
    localDistrict: ["harborCity", "pineSuburbs", "universityDistrict", "ridgeTowns"],
    city: ["harborCity", "pineSuburbs", "universityDistrict", "capitalHeights", "southworks", "oldCapitol"],
    stateDistrict: ["harborCity", "pineSuburbs", "ironCounty", "northValley", "universityDistrict", "ridgeTowns", "capitalHeights", "southworks"],
    statewide: ["harborCity", "pineSuburbs", "ironCounty", "northValley", "universityDistrict", "coastalBend", "ridgeTowns", "capitalHeights", "sunfield"]
  };

  const GENERATED_SCENARIOS = [
    {
      id: "harborMayorRace",
      name: "Harbor City Mayoral Race",
      office: "Mayor",
      officeId: "mayor",
      stateId: "pa",
      mapScope: "city",
      districtType: "citywide municipal race",
      electionStructure: "nonpartisanGeneral",
      weeks: 8,
      description: "A citywide mayoral campaign fought across neighborhoods, local media, civic groups, safety concerns, school quality, and housing costs.",
      regionIds: ["harborCity", "pineSuburbs", "universityDistrict", "capitalHeights", "southworks", "oldCapitol"],
      startingResources: { money: 64000, time: 3, staff: 4, volunteers: 58, capital: 7, trust: 50, media: 12, energy: 6, maxEnergy: 6, debate: 45 },
      goals: ["Win a citywide office", "Build a governing team", "Show visible competence on housing, safety, and services"],
      defaultOpponent: "adrianVale"
    }
  ];

  const CAMPAIGN_TABS = [
    ["warRoom", "War Room"],
    ["schedule", "Schedule"],
    ["platform", "Platform"],
    ["coalition", "Coalition"],
    ["file", "Candidate File"]
  ];

  const GOVERNING_TABS = [
    ["desk", "Administration Desk"],
    ["staff", "Administration"],
    ["policy", "Policy Engine"],
    ["legislature", "Legislature"],
    ["budget", "Budget"],
    ["career", "Career"]
  ];

  let state = load();
  let setup = {
    screen: "scenario",
    scenarioId: DEFAULT_SCENARIO_ID,
    customScenarios: loadCustomScenarios()
  };

  function clamp(value, min, max) {
    const n = Number(value);
    return Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function byId(list, id) {
    return (list || []).find((item) => item.id === id);
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

  function money(value) {
    return `$${Math.round(Number(value) || 0).toLocaleString()}`;
  }

  function pct(value, digits = 0) {
    return `${Number(value || 0).toFixed(digits)}%`;
  }

  function signed(value, suffix = "") {
    const n = Math.round(Number(value || 0) * 10) / 10;
    return `${n >= 0 ? "+" : ""}${n}${suffix}`;
  }

  function labelize(key) {
    return String(key || "").replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  }

  function allScenarios() {
    const dataScenarios = DATA.scenarios || [];
    const existing = new Set(dataScenarios.map((item) => item.id));
    return [
      ...dataScenarios,
      ...GENERATED_SCENARIOS.filter((item) => !existing.has(item.id)),
      ...setup.customScenarios.filter((item) => !existing.has(item.id))
    ];
  }

  function getScenario(id = DEFAULT_SCENARIO_ID) {
    return byId(allScenarios(), id) || byId(allScenarios(), DEFAULT_SCENARIO_ID) || allScenarios()[0];
  }

  function getMapScope(scenario) {
    return scenario?.mapScope || OFFICE_SCOPES[scenario?.officeId] || "localDistrict";
  }

  function officeById(id) {
    return byId(OFFICE_LADDER, id) || OFFICE_LADDER[0];
  }

  function currentOffice() {
    return officeById(state?.candidate?.officeId || state?.campaign?.officeId);
  }

  function party(id = state?.candidate?.partyId) {
    return byId(PARTIES, id) || PARTIES[0];
  }

  function difficulty(id = state?.difficultyId) {
    return DIFFICULTIES[id || "intermediate"] || DIFFICULTIES.intermediate;
  }

  function isFederalOffice(office = currentOffice()) {
    return ["usHouse", "usSenate", "president"].includes(office?.id);
  }

  function issueById(id) {
    return byId(DATA.issues || [], id);
  }

  function stanceById(id) {
    for (const issue of DATA.issues || []) {
      const stance = byId(issue.stances || [], id);
      if (stance) return { issue, stance };
    }
    return null;
  }

  function visibleIssues(scenario = getScenario(setup.scenarioId)) {
    const officeScope = getMapScope(scenario);
    if (officeScope === "national") return DATA.issues || [];
    return (DATA.issues || []).filter((issue) => LOCAL_ISSUES.includes(issue.id));
  }

  function announce(text) {
    const target = document.querySelector("#civicAnnouncements");
    if (target) target.textContent = text;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getSaveSlots() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_SLOTS_KEY) || "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeSaveSlots(slots) {
    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
  }

  function save(slotId = "autosave") {
    try {
      if (!state) return;
      normalizeState(state);
      const savedAt = new Date().toISOString();
      const slots = getSaveSlots();
      const data = clone({ ...state, version: VERSION, gameVersion: VERSION, saveSchemaVersion: SAVE_SCHEMA_VERSION, savedAt });
      delete data.confirmNewCareer;
      delete data.confirmExportJson;
      slots[slotId] = {
        id: slotId,
        label: slotId === "autosave" ? "Autosave" : slotId === "manual1" ? "Manual Save 1" : "Manual Save 2",
        savedAt,
        meta: saveMeta(data),
        data
      };
      writeSaveSlots(slots);
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      announce(`${slots[slotId].label} saved.`);
    } catch (error) {
      console.warn("Could not save The Common Republic", error);
      announce("Could not save The Common Republic.");
    }
  }

  function saveMeta(data) {
    return {
      candidate: data?.candidate?.name || "Unnamed candidate",
      phase: data?.phase || "setup",
      office: data?.candidate?.officeName || data?.campaign?.officeId || "unknown office",
      scenario: data?.campaign?.scenarioName || data?.scenarioId || "unknown scenario",
      week: data?.campaign?.week,
      month: data?.governing?.month
    };
  }

  function load(slotId = "autosave") {
    try {
      const slots = getSaveSlots();
      const slotted = slots[slotId]?.data || Object.values(slots)[0]?.data;
      if (slotted) return migrateSave(slotted);
      for (const key of LEGACY_SAVE_KEYS) {
        const parsed = JSON.parse(localStorage.getItem(key) || "null");
        if (parsed) return migrateSave(parsed);
      }
      return null;
    } catch {
      return null;
    }
  }

  function clearSave(slotId = null) {
    if (!slotId) {
      localStorage.removeItem(SAVE_SLOTS_KEY);
      localStorage.removeItem(SAVE_KEY);
      return;
    }
    const slots = getSaveSlots();
    delete slots[slotId];
    writeSaveSlots(slots);
  }

  function migrateSave(raw) {
    const migrated = clone(raw);
    migrated.version = VERSION;
    migrated.gameVersion = VERSION;
    migrated.saveSchemaVersion = SAVE_SCHEMA_VERSION;
    migrated.view = migrated.view || "warRoom";
    migrated.govView = migrated.govView || "desk";
    if (migrated.campaign) migrateCampaign(migrated.campaign);
    if (migrated.governing) migrateGoverning(migrated.governing);
    return normalizeState(migrated);
  }

  function migrateCampaign(campaign) {
    const resources = campaign.resources || {};
    resources.maxEnergy = Number(resources.maxEnergy || 6);
    resources.energy = clamp(Number(resources.energy ?? resources.maxEnergy), 0, resources.maxEnergy);
    campaign.resources = resources;
    campaign.debate = {
      prep: Number(campaign.debate?.prep ?? resources.debate ?? 40),
      scheduledWeek: Number(campaign.debate?.scheduledWeek || Math.min(4, campaign.maxWeeks || 6)),
      started: Boolean(campaign.debate?.started),
      completed: Boolean(campaign.debate?.completed),
      declined: Boolean(campaign.debate?.declined),
      currentIndex: Number(campaign.debate?.currentIndex || 0),
      baselinePoll: campaign.debate?.baselinePoll ?? null,
      baselineTrust: campaign.debate?.baselineTrust ?? null,
      score: Number(campaign.debate?.score || 0),
      opponentScore: Number(campaign.debate?.opponentScore || 0),
      answers: Array.isArray(campaign.debate?.answers) ? campaign.debate.answers : [],
      clip: campaign.debate?.clip || null,
      report: campaign.debate?.report || null
    };
    campaign.polling = campaign.polling || { measurementError: difficulty(campaign.difficultyId).pollError || 3.6, lastPollWeek: null, pollsBought: 0 };
    campaign.issueMomentum = campaign.issueMomentum || {};
    campaign.weekStep = campaign.weekStep || "briefing";
    campaign.weekReport = campaign.weekReport || [];
    campaign.schedule = campaign.schedule || { candidate: null, staff: null, volunteers: null, media: null, resolved: false, report: [] };
    (campaign.regions || []).forEach((region) => {
      region.measurementError = Number(region.measurementError || region.pollMoe || campaign.polling.measurementError || 4.2);
      region.electionVolatility = Number(region.electionVolatility || Math.max(2.2, region.measurementError * 0.75));
      region.turnoutError = Number(region.turnoutError || 1.8);
      region.lateMovement = Number(region.lateMovement || 0);
    });
  }

  function migrateGoverning(governing) {
    governing.monthlyActions = governing.monthlyActions || { administration: false, outreach: false };
    governing.staff = governing.staff || {};
    governing.staffModifiers = calculateStaffModifiers(governing);
    governing.fiscal = governing.fiscal || makeFiscalModel(governing.budget || 80, governing.budgetLines);
    governing.budgetLines = governing.fiscal.allocations;
    (governing.bills || []).forEach((bill) => normalizeBill(bill, governing.month || 1));
    recalculateFiscal(governing);
  }

  function loadCustomScenarios() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOM_SCENARIO_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCustomScenarios() {
    try {
      localStorage.setItem(CUSTOM_SCENARIO_KEY, JSON.stringify(setup.customScenarios.slice(-8)));
    } catch {
      // Non-essential.
    }
  }

  function addLog(text, type = "note") {
    if (!state) return;
    state.log.unshift({
      id: `${Date.now()}-${Math.random()}`,
      type,
      week: state.campaign?.week,
      month: state.governing?.month,
      text
    });
    state.log = state.log.slice(0, 160);
  }

  function render() {
    if (!state) {
      if (setup.screen === "candidate") renderCandidateSetup();
      else renderScenarioSelect();
      return;
    }
    if (state.phase === "briefing") renderCampaignBriefing();
    else if (state.phase === "campaign") renderCampaign();
    else if (state.phase === "results") renderResults();
    else if (state.phase === "governing") renderGoverning();
    else if (state.phase === "termReview") renderTermReview();
    else renderScenarioSelect();
  }

  function renderScenarioSelect() {
    const slots = getSaveSlots();
    const hasSaves = Object.keys(slots).length > 0 || load();
    const scenarios = allScenarios();
    root.innerHTML = `
      <section class="cr-setup cr-spine">
        <div class="cr-setup-brief">
          <p class="cr-eyebrow">Common Pages Games</p>
          <h1>The Common Republic</h1>
          <p class="cr-lede">Pick a scenario first. The office determines the map, campaign math, questions, actors, and whether national systems such as delegates appear at all.</p>
          <div class="cr-system-strip">
            <div><span>Campaign Trail</span><strong>Authored weekly choices</strong></div>
            <div><span>Civic Engine</span><strong>Voter groups and policies</strong></div>
            <div><span>Career</span><strong>Office, governing, reelection</strong></div>
          </div>
          ${hasSaves ? `
            <div class="cr-note">
              <strong>Saved careers</strong>
              <p>Autosave and manual slots migrate forward when the game changes. Export a save before replacing files if you want a backup.</p>
              <div class="cr-save-slots">${renderSaveSlots(slots)}</div>
            </div>
          ` : ""}
          ${IS_MOD_MODE ? `<div class="cr-note">
            <strong>Scenario data loader</strong>
            <p>Add scenarios by appending objects to <code>games/civic/data/scenarios.js</code>, or paste one JSON object here for local testing.</p>
            <textarea class="cr-scenario-json" id="customScenarioJson" placeholder='{"id":"cityCouncilPilot","name":"City Council Pilot","office":"City Council","officeId":"cityCouncil","weeks":6,"regionIds":["harborCity","pineSuburbs"],"startingResources":{"money":32000,"time":3,"staff":2,"volunteers":32,"capital":4,"trust":50,"media":8,"energy":6,"maxEnergy":6,"debate":40},"defaultOpponent":"miraVance"}'></textarea>
            <button class="cr-btn subtle" data-load-custom-scenario type="button">Load Local Scenario</button>
          </div>` : `<a class="cr-btn subtle" href="civic-engine.html?mod=1">Open Mod Tools</a>`}
        </div>
        <div class="cr-scenario-stack">
          ${scenarios.map((scenario) => renderScenarioCard(scenario)).join("")}
        </div>
      </section>
    `;
    document.querySelectorAll("[data-resume-slot]").forEach((button) => button.addEventListener("click", () => {
      state = load(button.dataset.resumeSlot);
      render();
    }));
    document.querySelectorAll("[data-export-slot]").forEach((button) => button.addEventListener("click", () => {
      exportSaveSlot(button.dataset.exportSlot);
    }));
    document.querySelector("[data-import-save]")?.addEventListener("click", importSaveFromTextarea);
    document.querySelectorAll("[data-select-scenario]").forEach((button) => {
      button.addEventListener("click", () => {
        setup.scenarioId = button.dataset.selectScenario;
        setup.screen = "candidate";
        render();
      });
    });
    document.querySelector("[data-load-custom-scenario]")?.addEventListener("click", () => {
      const textarea = document.querySelector("#customScenarioJson");
      try {
        const parsed = JSON.parse(textarea.value || "{}");
        if (!parsed.id || !parsed.name || !parsed.officeId) throw new Error("Scenario needs id, name, and officeId.");
        setup.customScenarios.push(parsed);
        setup.scenarioId = parsed.id;
        saveCustomScenarios();
        setup.screen = "candidate";
        render();
      } catch (error) {
        textarea.value = `Could not load scenario: ${error.message}`;
      }
    });
  }

  function renderSaveSlots(slots) {
    const allSlots = { ...slots };
    if (!Object.keys(allSlots).length) {
      const legacy = load();
      if (legacy) allSlots.autosave = { id: "autosave", label: "Autosave", savedAt: legacy.savedAt, meta: saveMeta(legacy), data: legacy };
    }
    return `
      ${["autosave", "manual1", "manual2"].map((slotId) => {
        const slot = allSlots[slotId];
        if (!slot) return `<div class="cr-save-slot empty"><strong>${slotId === "autosave" ? "Autosave" : slotId === "manual1" ? "Manual Save 1" : "Manual Save 2"}</strong><span>Empty</span></div>`;
        return `<div class="cr-save-slot"><strong>${html(slot.label || slotId)}</strong><span>${html(slot.meta?.candidate || "Saved career")} · ${html(slot.meta?.office || "office")} · ${html(slot.meta?.phase || "phase")}</span><em>${new Date(slot.savedAt || Date.now()).toLocaleString()}</em><button class="cr-btn primary" data-resume-slot="${html(slotId)}" type="button">Resume</button><button class="cr-btn subtle" data-export-slot="${html(slotId)}" type="button">Export</button></div>`;
      }).join("")}
      <textarea class="cr-save-import" id="saveImportJson" placeholder="Paste exported save JSON here"></textarea>
      <button class="cr-btn subtle" data-import-save type="button">Import Save JSON</button>
    `;
  }

  function exportSaveSlot(slotId = "autosave") {
    const slots = getSaveSlots();
    const data = slots[slotId]?.data || load(slotId);
    if (!data) return;
    const textarea = document.querySelector("#saveImportJson");
    if (textarea) {
      textarea.value = JSON.stringify(data, null, 2);
      textarea.focus();
      textarea.select();
      announce("Save JSON is ready to copy.");
    }
  }

  function importSaveFromTextarea() {
    const textarea = document.querySelector("#saveImportJson");
    try {
      const parsed = JSON.parse(textarea?.value || "{}");
      state = migrateSave(parsed);
      save("manual1");
      announce("Imported save into Manual Save 1.");
      render();
    } catch (error) {
      announce("Could not import that save JSON.");
      if (textarea) textarea.value = `Could not import save: ${error.message}`;
    }
  }

  function renderScenarioCard(scenario) {
    const scope = getMapScope(scenario);
    const regions = scenarioRegionList(scenario);
    return `
      <article class="cr-panel cr-scenario-card">
        <div>
          <p class="cr-eyebrow">${html(scopeLabel(scope))}</p>
          <h2>${html(scenario.name)}</h2>
          <p>${html(scenario.description || "A civic campaign scenario.")}</p>
          <div class="cr-chip-row">
            <span>${html(scenario.office || officeById(scenario.officeId)?.name)}</span>
            <span>${html(electionStructureLabel(scenario.electionStructure))}</span>
            <span>${scenario.weeks || 6} weeks</span>
            <span>${regions.length} regions</span>
          </div>
        </div>
        <button class="cr-btn primary" data-select-scenario="${html(scenario.id)}" type="button">Choose Scenario</button>
      </article>
    `;
  }

  function renderCandidateSetup() {
    const scenario = getScenario(setup.scenarioId);
    const issues = visibleIssues(scenario);
    const fixedState = byId(DATA.usStates || [], scenario.stateId || "pa") || { id: scenario.stateId || "pa", name: "Scenario state" };
    const backgrounds = DATA.backgrounds || [];
    const educationLevels = DATA.educationLevels || [];
    const traits = DATA.traits || [];
    const regions = scenarioRegionList(scenario);
    const selectedParty = PARTIES[0];
    root.innerHTML = `
      <section class="cr-setup">
        <div class="cr-setup-brief">
          <p class="cr-eyebrow">Candidate Setup</p>
          <h1>${html(scenario.name)}</h1>
          <p class="cr-lede">${html(scenario.description)}</p>
          <div class="cr-note">
            <strong>Scale locked by scenario</strong>
            <p>${html(scenario.office)} uses a ${html(scopeLabel(getMapScope(scenario)).toLowerCase())}. Local scenarios do not use presidential nomination calendars or a 50-state map.</p>
          </div>
          <button class="cr-btn subtle" data-back-scenarios type="button">Back to Scenarios</button>
        </div>
        <form id="crCandidateForm" class="cr-setup-form cr-candidate-form">
          <input type="hidden" name="scenarioId" value="${html(scenario.id)}">
          <input type="hidden" name="homeState" value="${html(fixedState.id)}">
          <label><span>Candidate name</span><input name="candidateName" value="Alex Rivers" maxlength="48" required></label>
          <label><span>Age</span><input name="age" type="number" min="18" max="90" value="35"></label>
          <label><span>Scenario state</span><input value="${html(fixedState.name)}" disabled><em>Fixed by scenario.</em></label>
          <label><span>Home region</span><select name="homeRegion">${regions.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Office</span><input value="${html(scenario.office || officeById(scenario.officeId)?.name)}" disabled></label>
          <label><span>Background</span><select name="background">${backgrounds.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Education</span><select name="education">${educationLevels.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Political identity</span><select name="party">${PARTIES.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select><em>${html(electionStructureLabel(scenario.electionStructure))}</em></label>
          <label><span>Difficulty</span><select name="difficulty">${Object.entries(DIFFICULTIES).map(([id, item]) => `<option value="${id}" ${id === "intermediate" ? "selected" : ""}>${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Candidate trait</span><select name="trait">${traits.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select></label>
          <label class="wide"><span>Ideology</span><input name="ideology" type="range" min="-35" max="35" value="-4"><em>Left/progressive to right/conservative. Scenario, voters, and stances matter more than this one slider.</em></label>
          ${[0, 1, 2].map((index) => renderPriorityRow(index, issues)).join("")}
          <label class="wide"><span>Why are you running?</span><textarea name="motivation" maxlength="220">I want local government to feel legible, honest, and useful to ordinary families.</textarea></label>
          <label><span>Public strength</span><input name="strength" value="Clear explanations"></label>
          <label><span>Campaign flaw</span><input name="flaw" value="Sometimes too cautious"></label>
          <div class="cr-note wide" id="candidateReadout">
            <strong>${html(selectedParty.short)} identity</strong>
            <p>${html(selectedParty.description || "Your identity shapes initial coalition assumptions, but local trust can override party labels.")}</p>
          </div>
          <button class="cr-btn primary wide" type="submit">Build Campaign Briefing</button>
        </form>
      </section>
    `;
    bindCandidateSetup();
  }

  function renderPriorityRow(index, issues) {
    const issue = issues[index] || issues[0];
    return `
      <div class="cr-priority-row wide">
        <label><span>Priority ${index + 1}</span><select name="priorityIssue${index}" data-priority-issue="${index}">
          ${issues.map((item) => `<option value="${html(item.id)}" ${item.id === issue.id ? "selected" : ""}>${html(item.name)}</option>`).join("")}
        </select></label>
        <label><span>Stance</span><select name="priorityStance${index}" data-priority-stance="${index}"></select></label>
      </div>
    `;
  }

  function bindCandidateSetup() {
    document.querySelector("[data-back-scenarios]")?.addEventListener("click", () => {
      setup.screen = "scenario";
      render();
    });
    const form = document.querySelector("#crCandidateForm");
    const updateReadout = () => {
      const readout = document.querySelector("#candidateReadout");
      const currentParty = party(form?.party?.value);
      const diff = difficulty(form?.difficulty?.value);
      const trait = byId(DATA.traits || [], form?.trait?.value);
      const homeRegion = byId(scenarioRegionList(getScenario(form?.scenarioId?.value)), form?.homeRegion?.value);
      if (!readout) return;
      readout.innerHTML = `<strong>${html(currentParty.name)} · ${html(diff.name)}</strong><p>${html(currentParty.description || "Local trust and issue fit can overcome party assumptions.")} ${html(diff.text)}</p><p><strong>${html(trait?.name || "Trait")}:</strong> ${html(trait?.description || "No trait selected.")}</p><p><strong>Home base:</strong> ${html(homeRegion?.name || "selected region")} gives extra familiarity but also raises expectations there.</p>`;
    };
    const updateStance = (index) => {
      const issueSelect = form?.querySelector(`[data-priority-issue="${index}"]`);
      const stanceSelect = form?.querySelector(`[data-priority-stance="${index}"]`);
      const issue = issueById(issueSelect?.value) || visibleIssues()[0];
      if (!stanceSelect || !issue) return;
      stanceSelect.innerHTML = (issue.stances || []).map((stance) => `<option value="${html(stance.id)}">${html(stance.name)}</option>`).join("");
    };
    const updatePriorityOptions = () => {
      const selected = [0, 1, 2].map((index) => form?.querySelector(`[data-priority-issue="${index}"]`)?.value);
      [0, 1, 2].forEach((index) => {
        const select = form?.querySelector(`[data-priority-issue="${index}"]`);
        if (!select) return;
        [...select.options].forEach((option) => {
          option.disabled = option.value !== select.value && selected.includes(option.value);
        });
      });
    };
    [0, 1, 2].forEach(updateStance);
    updatePriorityOptions();
    form?.querySelectorAll("[data-priority-issue]").forEach((select) => {
      select.addEventListener("change", () => {
        updatePriorityOptions();
        updateStance(select.dataset.priorityIssue);
        updateReadout();
      });
    });
    form?.party?.addEventListener("change", updateReadout);
    form?.difficulty?.addEventListener("change", updateReadout);
    form?.trait?.addEventListener("change", updateReadout);
    form?.homeRegion?.addEventListener("change", updateReadout);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      createNewCareer(new FormData(form));
    });
  }

  function collectPriorities(form) {
    return [0, 1, 2].map((index) => {
      const issueId = form.get(`priorityIssue${index}`);
      const issue = issueById(issueId) || visibleIssues()[0];
      let stance = byId(issue?.stances || [], form.get(`priorityStance${index}`));
      if (!stance) stance = issue?.stances?.[0];
      return { issueId: issue?.id, stanceId: stance?.id };
    }).filter((item, index, list) => item.issueId && list.findIndex((other) => other.issueId === item.issueId) === index);
  }

  function makeCandidate(form, scenario) {
    const background = byId(DATA.backgrounds || [], form.get("background")) || DATA.backgrounds?.[0] || { id: "teacher", name: "Teacher", skills: {} };
    const education = byId(DATA.educationLevels || [], form.get("education")) || DATA.educationLevels?.[0] || { id: "bachelors", name: "Bachelor's Degree", skills: {} };
    const trait = byId(DATA.traits || [], form.get("trait")) || DATA.traits?.[0] || { id: "coalitionBuilder", name: "Coalition Builder", modifiers: {} };
    const stats = {
      eloquence: 54,
      policy: 52,
      organizing: 52,
      fundraising: 50,
      coalition: 50,
      media: 50,
      stamina: 70,
      legislative: 46,
      administration: 45
    };
    [background, education].forEach((source) => {
      Object.entries(source.skills || {}).forEach(([key, value]) => {
        const mapped = key === "debate" ? "eloquence" : key === "coalition" ? "coalition" : key;
        if (stats[mapped] != null) stats[mapped] += value * 6;
      });
    });
    return {
      name: String(form.get("candidateName") || "Alex Rivers").trim(),
      age: clamp(Number(form.get("age") || 35), 18, 90),
      homeStateId: form.get("homeState") || scenario.stateId || "pa",
      homeRegionId: form.get("homeRegion") || scenarioRegionList(scenario)[0]?.id,
      partyId: form.get("party") || "democratic",
      backgroundId: background.id,
      educationId: education.id,
      traitId: trait.id,
      officeId: scenario.officeId,
      officeName: scenario.office || officeById(scenario.officeId)?.name,
      ideology: Number(form.get("ideology") || 0),
      priorities: collectPriorities(form),
      biography: {
        motivation: String(form.get("motivation") || "").trim(),
        strength: String(form.get("strength") || "").trim(),
        flaw: String(form.get("flaw") || "").trim()
      },
      stats,
      fatigue: 0,
      traits: [background.name, education.name, trait.name],
      protege: { name: "No protege selected", age: 27, eloquence: 42, policy: 42, coalition: 38, network: 10, ready: false }
    };
  }

  function createNewCareer(form) {
    const scenario = getScenario(form.get("scenarioId"));
    const candidate = makeCandidate(form, scenario);
    state = {
      version: VERSION,
      phase: "briefing",
      view: "warRoom",
      govView: "desk",
      difficultyId: form.get("difficulty") || "intermediate",
      scenarioId: scenario.id,
      candidate,
      campaign: createCampaignFromScenario(scenario, candidate),
      governing: null,
      results: null,
      termReview: null,
      career: {
        year: 2028,
        electionsWon: 0,
        electionsLost: 0,
        termsServed: 0,
        officesHeld: [],
        reputation: ["First-time candidate"],
        network: 16,
        pacFunds: 18000,
        legacy: "Unwritten"
      },
      log: []
    };
    addLog(`${candidate.name} opened ${scenario.name}. The scenario controls the map, actors, questions, and election math.`, "scenario");
    save();
    render();
  }

  function createCampaignFromScenario(scenario, candidate) {
    const diff = difficulty(state?.difficultyId || document.querySelector("#crCandidateForm")?.difficulty?.value || "intermediate");
    const resources = normalizeResources(scenario.startingResources || {});
    resources.money = Math.round(resources.money * diff.money);
    resources.volunteers = Math.round(resources.volunteers * diff.volunteers);
    resources.trust = clamp(resources.trust + diff.support, 12, 88);
    resources.capital = Math.max(0, Math.round(resources.capital * diff.capital));
    const scope = getMapScope(scenario);
    const regions = scenarioRegionList(scenario).map((region, index) => ({
      id: region.id,
      name: region.name,
      type: region.type,
      population: region.population,
      electoralValue: region.electoralValue,
      baselineSupport: clamp((region.baselineSupport || 50) + diff.support + (Math.random() * 2 - 1), 15, 85),
      directSupport: 0,
      support: region.baselineSupport || 50,
      turnout: region.turnout || 60,
      turnoutBoost: 0,
      ground: 0,
      adSaturation: 0,
      measurementError: scope === "localDistrict" ? diff.pollError : diff.pollError + 0.8,
      electionVolatility: scope === "localDistrict" ? 2.7 * diff.risk : 3.6 * diff.risk,
      turnoutError: 1.7 * diff.risk,
      lateMovement: 0,
      groups: { ...(region.groups || {}) },
      concerns: region.concerns || [],
      industries: region.industries || [],
      notes: region.notes || "",
      mapShape: MAP_SHAPES[index % MAP_SHAPES.length],
      contacted: 0
    }));
    const groups = createCampaignGroups(regions, candidate, diff);
    const opponent = makeOpponent(scenario);
    const campaign = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      officeId: scenario.officeId,
      mapScope: scope,
      electionStructure: scenario.electionStructure || "nonpartisanGeneral",
      stage: "general",
      week: 1,
      maxWeeks: scenario.weeks || 6,
      resources,
      regions,
      groups,
      states: scope === "national" ? createNationalStates(candidate, diff) : [],
      opponent,
      actors: [],
      selectedRegionId: regions[0]?.id,
      selectedGroupId: activeGroupIds(regions, groups)[0],
      selectedEndorsementId: (DATA.endorsements || [])[0]?.id,
      answeredEvents: [],
      currentEventId: null,
      completedActions: {},
      lastMovement: null,
      lastPoll: null,
      rival: { lastMove: null },
      endorsements: {},
      focus: { activeId: null, stepIndex: 0, completed: [], awaitingChoice: null },
      debate: { prep: resources.debate || 40, scheduledWeek: scenario.debateWeek || Math.min(4, scenario.weeks || 6), started: false, completed: false, declined: false, currentIndex: 0, baselinePoll: null, baselineTrust: null, score: 0, opponentScore: 0, answers: [], clip: null, report: null },
      polling: { measurementError: diff.pollError, lastPollWeek: null, pollsBought: 0, publicPolls: [] },
      issueMomentum: {},
      weekStep: "briefing",
      weekReport: [],
      schedule: { candidate: null, staff: null, volunteers: null, media: null, resolved: false, report: [] },
      policyMemory: [],
      messageHistory: [],
      internalNotes: []
    };
    applyCandidateSources(campaign, candidate);
    applyTraitSources(campaign, candidate);
    refreshAllRegionPolls(campaign);
    campaign.actors = buildActors(campaign, scenario);
    campaign.currentEventId = drawEligibleEvent(campaign);
    campaign.lastMovement = {
      source: "Opening baseline",
      before: null,
      after: districtPoll(campaign),
      items: [
        "Scenario scale locked to " + scopeLabel(scope) + ".",
        `${regions.length} campaign regions loaded from scenario data.`,
        "Starting support reflects voter groups, region mix, background, education, party identity, issue stances, and difficulty."
      ]
    };
    return campaign;
  }

  function applyTraitSources(campaign, candidate) {
    const trait = byId(DATA.traits || [], candidate.traitId);
    if (!trait) return;
    applyEffectsToCampaign(campaign, trait.modifiers || {}, { source: trait.name, quiet: true });
    Object.entries(trait.groupModifiers || {}).forEach(([groupId, amount]) => {
      const group = campaign.groups[groupId];
      if (group) group.support = clamp(group.support + Number(amount), 4, 96);
    });
    Object.entries(trait.groupTurnoutModifiers || {}).forEach(([groupId, amount]) => {
      const group = campaign.groups[groupId];
      if (group) group.turnout = clamp(group.turnout + Number(amount), 10, 95);
    });
    if (trait.homeRegionBonus && candidate.homeRegionId) {
      const region = campaign.regions.find((item) => item.id === candidate.homeRegionId);
      if (region) region.directSupport = clamp(region.directSupport + Number(trait.homeRegionBonus), -30, 30);
    }
  }

  function normalizeResources(source) {
    return {
      money: Number(source.money ?? 28000),
      time: Number(source.time ?? 3),
      staff: Number(source.staff ?? 2),
      volunteers: Number(source.volunteers ?? 36),
      capital: Number(source.capital ?? 4),
      trust: Number(source.trust ?? 50),
      media: Number(source.media ?? 8),
      energy: Number(source.energy ?? 6),
      maxEnergy: Number(source.maxEnergy ?? 6),
      debate: Number(source.debate ?? 40)
    };
  }

  function scenarioRegionList(scenario) {
    const scope = getMapScope(scenario);
    const ids = scenario.regionIds?.length ? scenario.regionIds : DEFAULT_REGIONS_BY_SCOPE[scope] || DEFAULT_REGIONS_BY_SCOPE.localDistrict;
    return ids.map((id) => byId(DATA.regions || [], id)).filter(Boolean);
  }

  function createNationalStates(candidate, diff) {
    return (DATA.usStates || []).map((item) => ({
      id: item.id,
      name: item.name,
      abbreviation: item.id.toUpperCase(),
      lean: item.lean || 0,
      support: clamp(49 - (item.lean || 0) * (candidate.partyId === "republican" ? -0.45 : 0.45) + diff.support, 12, 88),
      turnout: item.turnout || 62
    }));
  }

  function createCampaignGroups(regions, candidate, diff) {
    const relevant = new Set();
    regions.forEach((region) => Object.keys(region.groups || {}).forEach((id) => relevant.add(id)));
    candidate.priorities.forEach(({ stanceId }) => {
      const found = stanceById(stanceId);
      Object.keys(found?.stance?.effects?.groups || {}).forEach((id) => relevant.add(id));
    });
    ["parents", "teachers", "suburbanModerates", "workingClass", "smallBusiness", "independents"].forEach((id) => relevant.add(id));
    const groups = {};
    (DATA.voterGroups || []).forEach((group) => {
      if (!relevant.has(group.id)) return;
      groups[group.id] = {
        id: group.id,
        name: group.name,
        size: group.size || 5,
        support: clamp((group.support || 50) + diff.support * 0.55, 8, 92),
        turnout: clamp(group.turnout || 58, 18, 90),
        salience: 50,
        persuasion: group.persuasion || 1,
        issues: group.issues || []
      };
    });
    return groups;
  }

  function applyCandidateSources(campaign, candidate) {
    const partyData = party(candidate.partyId);
    scaleAndApplyEffects(campaign, { groups: partyData.groupModifiers || {}, ...(partyData.resourceModifiers || {}) }, PARTY_SCALE, "Political identity", true);
    const background = byId(DATA.backgrounds || [], candidate.backgroundId);
    const education = byId(DATA.educationLevels || [], candidate.educationId);
    scaleAndApplyEffects(campaign, { groups: background?.groups || {}, ...(background?.resources || {}) }, BACKGROUND_SCALE, "Background", true);
    scaleAndApplyEffects(campaign, { groups: education?.groups || {}, ...(education?.resources || {}) }, BACKGROUND_SCALE, "Education", true);
    candidate.priorities.forEach(({ stanceId }) => {
      const found = stanceById(stanceId);
      if (found?.stance?.effects) {
        scaleAndApplyEffects(campaign, found.stance.effects, STANCE_SCALE, found.stance.name, true);
        campaign.policyMemory.push(`${found.issue.name}: ${found.stance.name}`);
      }
    });
  }

  function scaleEffects(effects, scale = 1) {
    const scaled = {};
    Object.entries(effects || {}).forEach(([key, value]) => {
      if (key === "groups" || key === "regions") {
        scaled[key] = {};
        Object.entries(value || {}).forEach(([id, amount]) => scaled[key][id] = Number(amount) * scale);
      } else if (typeof value === "number") {
        scaled[key] = value * scale;
      } else {
        scaled[key] = value;
      }
    });
    return scaled;
  }

  function scaleAndApplyEffects(campaign, effects, scale, source, quiet = false) {
    applyEffectsToCampaign(campaign, scaleEffects(effects, scale), { source, quiet });
  }

  function activeGroupIds(regions = state?.campaign?.regions || [], groups = state?.campaign?.groups || {}) {
    const ids = new Set();
    regions.forEach((region) => Object.keys(region.groups || {}).forEach((id) => {
      if (groups[id]) ids.add(id);
    }));
    Object.keys(groups).forEach((id) => ids.add(id));
    return [...ids].sort((a, b) => (groups[b]?.size || 0) - (groups[a]?.size || 0));
  }

  function refreshAllRegionPolls(campaign = state.campaign) {
    campaign.regions.forEach((region) => {
      region.support = computeRegionSupport(region, campaign);
    });
  }

  function computeRegionSupport(region, campaign = state.campaign) {
    let groupContribution = 0;
    let shareTotal = 0;
    Object.entries(region.groups || {}).forEach(([groupId, share]) => {
      const group = campaign.groups[groupId];
      if (!group) return;
      groupContribution += (group.support - 50) * (share / 100) * 0.42;
      shareTotal += share;
    });
    const trust = (campaign.resources.trust - 50) * 0.04;
    const media = Math.min(3, campaign.resources.media * 0.025);
    const turnoutQuality = (effectiveTurnout(region, campaign) - 60) * 0.025;
    return clamp(region.baselineSupport + region.directSupport + groupContribution + trust + media + turnoutQuality, 4, 96);
  }

  function effectiveTurnout(region, campaign = state.campaign) {
    let groupTurnout = 0;
    let shareTotal = 0;
    Object.entries(region.groups || {}).forEach(([groupId, share]) => {
      const group = campaign.groups[groupId];
      if (!group) return;
      groupTurnout += group.turnout * share;
      shareTotal += share;
    });
    const blended = shareTotal ? groupTurnout / shareTotal : region.turnout;
    return clamp(blended * 0.35 + (region.turnout || 58) * 0.65 + region.turnoutBoost + region.ground * 0.2, 20, 92);
  }

  function districtPoll(campaign = state.campaign) {
    if (campaign.mapScope === "national" && campaign.states.length) {
      return campaign.states.reduce((sum, item) => sum + item.support, 0) / campaign.states.length;
    }
    let weighted = 0;
    let total = 0;
    campaign.regions.forEach((region) => {
      const weight = (region.population || 1) * effectiveTurnout(region, campaign) / 100;
      weighted += region.support * weight;
      total += weight;
    });
    return total ? weighted / total : 50;
  }

  function pollMoe(campaign = state.campaign) {
    const base = campaign.regions.reduce((sum, region) => sum + (region.measurementError || campaign.polling?.measurementError || 4.5), 0) / Math.max(1, campaign.regions.length);
    return clamp(base, 1.6, 8.5);
  }

  function applyEffectsToCampaign(campaign, effects = {}, context = {}) {
    const before = districtPoll(campaign);
    const items = [];
    const region = campaign.regions.find((item) => item.id === (context.regionId || campaign.selectedRegionId));
    const group = campaign.groups[context.groupId || campaign.selectedGroupId];
    const addItem = (text) => { if (!context.quiet) items.push(text); };

    Object.keys(effects || {}).forEach((key) => {
      if (!SUPPORTED_CAMPAIGN_EFFECT_KEYS.has(key)) {
        console.error(`Unknown Common Republic campaign effect key: ${key}`, effects);
        addItem(`Unknown effect key "${key}" was ignored. Check the content data.`);
      }
    });

    const resourceLabels = { money: "Money", volunteers: "Volunteers", staff: "Staff", capital: "Political capital", trust: "Public trust", media: "Media attention", energy: "Energy", time: "Time", debate: "Debate prep" };
    Object.entries(resourceLabels).forEach(([key, label]) => {
      if (typeof effects[key] !== "number") return;
      if (key === "debate") {
        const beforePrep = campaign.debate?.prep ?? campaign.resources.debate ?? 40;
        campaign.debate = campaign.debate || {};
        campaign.debate.prep = clamp(beforePrep + effects[key], 0, 100);
        campaign.resources.debate = campaign.debate.prep;
        addItem(`${label} ${Math.round(beforePrep)} to ${Math.round(campaign.debate.prep)}.`);
        return;
      }
      const max = key === "energy" ? campaign.resources.maxEnergy || 6 : key === "trust" || key === "media" ? 100 : 999999;
      campaign.resources[key] = clamp((campaign.resources[key] || 0) + effects[key], key === "money" ? -999999 : 0, max);
      addItem(`${label} ${signed(effects[key])}.`);
    });

    if (typeof effects.regionSupport === "number" && region) {
      region.directSupport = clamp(region.directSupport + effects.regionSupport, -30, 30);
      addItem(`${region.name} support ${signed(effects.regionSupport, " pts")}.`);
    }
    if (typeof effects.regionTurnout === "number" && region) {
      region.turnoutBoost = clamp(region.turnoutBoost + effects.regionTurnout, -20, 30);
      region.ground = clamp(region.ground + Math.max(0, effects.regionTurnout), 0, 100);
      addItem(`${region.name} turnout ${signed(effects.regionTurnout, " pts")}.`);
    }
    if (typeof effects.regionTurnoutAll === "number") {
      campaign.regions.forEach((item) => {
        item.turnoutBoost = clamp(item.turnoutBoost + effects.regionTurnoutAll, -20, 30);
        item.ground = clamp(item.ground + Math.max(0, effects.regionTurnoutAll), 0, 100);
      });
      addItem(`All-region turnout ${signed(effects.regionTurnoutAll, " pts")}.`);
    }
    if (typeof effects.groupSupport === "number" && group) {
      group.support = clamp(group.support + effects.groupSupport * (group.persuasion || 1), 4, 96);
      addItem(`${group.name} support ${signed(effects.groupSupport, " pts")}.`);
    }
    if (typeof effects.groupTurnout === "number" && group) {
      group.turnout = clamp(group.turnout + effects.groupTurnout, 10, 95);
      addItem(`${group.name} turnout ${signed(effects.groupTurnout, " pts")}.`);
    }
    Object.entries(effects.groups || {}).forEach(([groupId, amount]) => {
      const target = campaign.groups[groupId];
      if (!target) return;
      const delta = Number(amount) * (target.persuasion || 1);
      target.support = clamp(target.support + delta, 4, 96);
      addItem(`${target.name} support ${signed(delta, " pts")}.`);
    });
    Object.entries(effects.groupEffects || {}).forEach(([groupId, effect]) => {
      const target = campaign.groups[groupId];
      if (!target) return;
      if (typeof effect.support === "number") {
        target.support = clamp(target.support + effect.support * (target.persuasion || 1), 4, 96);
        addItem(`${target.name} support ${signed(effect.support, " pts")}.`);
      }
      if (typeof effect.turnout === "number") {
        target.turnout = clamp(target.turnout + effect.turnout, 10, 95);
        addItem(`${target.name} turnout ${signed(effect.turnout, " pts")}.`);
      }
    });
    Object.entries(effects.regions || {}).forEach(([regionId, amount]) => {
      const target = campaign.regions.find((item) => item.id === regionId);
      if (!target) return;
      target.directSupport = clamp(target.directSupport + Number(amount), -30, 30);
      addItem(`${target.name} support ${signed(amount, " pts")}.`);
    });
    if (typeof effects.opponentSupport === "number") {
      const playerDelta = -effects.opponentSupport * 0.45;
      campaign.regions.forEach((item) => item.directSupport = clamp(item.directSupport + playerDelta, -30, 30));
      addItem(`Opponent standing ${signed(effects.opponentSupport, " pts")}; your district poll reacts ${signed(playerDelta, " pts")}.`);
    }
    if (typeof effects.issueMomentum === "number") {
      const issueId = state.candidate?.priorities?.[0]?.issueId || "general";
      campaign.issueMomentum[issueId] = clamp((campaign.issueMomentum[issueId] || 0) + effects.issueMomentum, -20, 20);
      addItem(`${issueById(issueId)?.name || "General issue"} momentum ${signed(effects.issueMomentum, " pts")}.`);
    } else {
      Object.entries(effects.issueMomentum || {}).forEach(([issueId, amount]) => {
        campaign.issueMomentum[issueId] = clamp((campaign.issueMomentum[issueId] || 0) + Number(amount), -20, 20);
        addItem(`${issueById(issueId)?.name || labelize(issueId)} momentum ${signed(amount, " pts")}.`);
      });
    }

    normalizeCampaign(campaign);
    refreshAllRegionPolls(campaign);
    const after = districtPoll(campaign);
    if (!context.quiet) {
      campaign.lastMovement = {
        source: context.source || "Campaign update",
        before,
        after,
        regionBefore: context.regionBefore,
        regionAfter: region ? region.support : undefined,
        items: items.length ? items : ["No measurable movement, but the campaign record updated."]
      };
    }
    return { before, after, items };
  }

  function normalizeState(target = state) {
    if (!target) return target;
    if (!CAMPAIGN_TABS.some(([id]) => id === target.view)) target.view = "warRoom";
    if (!GOVERNING_TABS.some(([id]) => id === target.govView)) target.govView = "desk";
    if (target.campaign) normalizeCampaign(target.campaign);
    if (target.governing) normalizeGoverning(target.governing);
    return target;
  }

  function normalizeCampaign(campaign) {
    if (!campaign) return campaign;
    campaign.resources = campaign.resources || normalizeResources({});
    campaign.resources.maxEnergy = clamp(campaign.resources.maxEnergy || 6, 1, 12);
    campaign.resources.energy = clamp(campaign.resources.energy || 0, 0, campaign.resources.maxEnergy);
    campaign.resources.trust = clamp(campaign.resources.trust || 0, 0, 100);
    campaign.resources.media = clamp(campaign.resources.media || 0, 0, 100);
    campaign.debate = campaign.debate || {};
    campaign.debate.prep = clamp(campaign.debate.prep ?? campaign.resources.debate ?? 40, 0, 100);
    campaign.resources.debate = campaign.debate.prep;
    Object.values(campaign.groups || {}).forEach((group) => {
      group.support = clamp(group.support, 4, 96);
      group.turnout = clamp(group.turnout, 10, 95);
      group.salience = clamp(group.salience ?? 50, 0, 100);
    });
    (campaign.regions || []).forEach((region) => {
      region.directSupport = clamp(region.directSupport || 0, -30, 30);
      region.turnoutBoost = clamp(region.turnoutBoost || 0, -20, 30);
      region.ground = clamp(region.ground || 0, 0, 100);
      region.measurementError = clamp(region.measurementError || 4.5, 1.5, 9);
      region.electionVolatility = clamp(region.electionVolatility || 3, 0.5, 9);
      region.turnoutError = clamp(region.turnoutError || 1.5, 0, 7);
    });
    return campaign;
  }

  function normalizeGoverning(governing) {
    if (!governing) return governing;
    governing.approval = clamp(governing.approval || 0, 0, 100);
    governing.trust = clamp(governing.trust || 0, 0, 100);
    governing.capital = Math.max(0, Math.round(governing.capital || 0));
    Object.values(governing.metrics || {}).forEach((_value, _index) => {});
    Object.keys(governing.metrics || {}).forEach((key) => governing.metrics[key] = clamp(governing.metrics[key], 0, 100));
    recalculateFiscal(governing);
    return governing;
  }

  function renderCampaignBriefing() {
    const c = state.campaign;
    const scenario = getScenario(state.scenarioId);
    const poll = districtPoll(c);
    root.innerHTML = `
      <section class="cr-game">
        ${renderRibbon()}
        <div class="cr-title-row">
          <div>
            <p class="cr-eyebrow">Campaign Briefing</p>
            <h1>${html(state.candidate.name)} for ${html(scenario.office)}</h1>
            <p>${html(scenario.description)} Current opening estimate: ${pct(poll, 1)} with ${pct(pollMoe(c), 1)} uncertainty.</p>
          </div>
          ${renderCareerChip()}
        </div>
        <section class="cr-grid two">
          <article class="cr-panel">
            <h2>Scenario Rules</h2>
            <p><strong>Map scope:</strong> ${html(scopeLabel(c.mapScope))}. <strong>Election:</strong> ${html(electionStructureLabel(c.electionStructure))}. <strong>Length:</strong> ${c.maxWeeks} weeks.</p>
            <p>${c.mapScope === "national" ? "National states and nomination systems are available in national scenarios." : "This is not a national race. Presidential nomination systems and the 50-state map are hidden for this office."}</p>
            <h3>Goals</h3>
            ${(scenario.goals || []).map((goal) => `<p class="cr-mini-note">${html(goal)}</p>`).join("")}
          </article>
          <article class="cr-panel">
            <h2>Opponent and Actors</h2>
            <p><strong>${html(c.opponent.name)}</strong>, ${html(c.opponent.label || "opponent")} from ${html(regionName(c.opponent.homeRegion))}. Strengths: ${(c.opponent.strengths || []).map(html).join(", ")}.</p>
            <div class="cr-ai-roster">${c.actors.slice(0, 10).map(renderActorMini).join("")}</div>
          </article>
          <article class="cr-panel">
            <h2>Regions</h2>
            <div class="cr-brief-region-list">${c.regions.map((region) => `<button type="button" data-brief-region="${html(region.id)}"><strong>${html(region.name)}</strong><span>${pct(region.support, 1)} · turnout ${pct(effectiveTurnout(region, c), 0)}</span><em>${html((region.concerns || []).join(", "))}</em></button>`).join("")}</div>
          </article>
          <article class="cr-panel">
            <h2>Platform Priorities</h2>
            ${state.candidate.priorities.map(renderPrioritySummary).join("")}
            <button class="cr-btn primary full" data-open-war-room type="button">Open Week 1 War Room</button>
          </article>
        </section>
      </section>
    `;
    bindGlobal();
    document.querySelector("[data-open-war-room]")?.addEventListener("click", () => {
      state.phase = "campaign";
      state.view = "warRoom";
      save();
      render();
    });
  }

  function renderRibbon() {
    return `
      <header class="cr-ribbon">
        <a class="cr-ribbon-brand" href="index.html#games">Common Pages Games</a>
        <nav>
          <button type="button" class="${state?.phase === "campaign" || state?.phase === "briefing" ? "active" : ""}" disabled>Campaign</button>
          <button type="button" class="${state?.phase === "governing" ? "active" : ""}" disabled>Governing</button>
          <button type="button" data-career-tab>Career</button>
        </nav>
        <div class="cr-ribbon-actions">
          <button class="cr-btn subtle" data-save type="button">Save</button>
          <button class="cr-btn subtle" data-save-slot="manual1" type="button">Manual 1</button>
          <button class="cr-btn subtle" data-save-slot="manual2" type="button">Manual 2</button>
          <button class="cr-btn subtle" data-new-career type="button">New Career</button>
        </div>
      </header>
      ${renderNewCareerModal()}
    `;
  }

  function renderNewCareerModal() {
    if (!state?.confirmNewCareer) return "";
    return `
      <div class="cr-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="newCareerTitle">
        <div class="cr-modal">
          <h2 id="newCareerTitle">Start a new career?</h2>
          <p>This will leave the current career screen. Export first if you want a JSON backup.</p>
          ${state.confirmExportJson ? `<textarea class="cr-save-import" readonly>${html(JSON.stringify({ ...state, confirmNewCareer: false, confirmExportJson: false }, null, 2))}</textarea>` : ""}
          <div class="cr-action-stack inline">
            <button class="cr-btn primary" data-confirm-new-career="start" type="button">Start New Career</button>
            <button class="cr-btn subtle" data-confirm-new-career="export" type="button">Export Current Save</button>
            <button class="cr-btn subtle" data-confirm-new-career="cancel" type="button">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderCareerChip() {
    const scenario = getScenario(state.scenarioId);
    return `
      <div class="cr-career-chip">
        <span>${html(scenario.office || currentOffice().name)}</span>
        <strong>${html(state.candidate.name)}</strong>
        <em>${html(party().short)} · ${html(difficulty().name)}</em>
      </div>
    `;
  }

  function bindGlobal() {
    document.querySelector("[data-save]")?.addEventListener("click", () => {
      save();
      addLog("Career saved locally.", "system");
      render();
    });
    document.querySelectorAll("[data-save-slot]").forEach((button) => button.addEventListener("click", () => {
      save(button.dataset.saveSlot);
      addLog(`Career saved to ${button.dataset.saveSlot}.`, "system");
      render();
    }));
    document.querySelector("[data-new-career]")?.addEventListener("click", () => {
      state.confirmNewCareer = true;
      render();
    });
    document.querySelectorAll("[data-confirm-new-career]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.confirmNewCareer;
      if (action === "start") {
        clearSave();
        state = null;
        setup = { screen: "scenario", scenarioId: DEFAULT_SCENARIO_ID, customScenarios: loadCustomScenarios() };
      } else if (action === "export") {
        state.confirmExportJson = true;
      } else {
        state.confirmNewCareer = false;
        state.confirmExportJson = false;
      }
      render();
    }));
    document.querySelector("[data-career-tab]")?.addEventListener("click", () => {
      if (state.phase === "governing") state.govView = "career";
      if (state.phase === "campaign") state.view = "file";
      render();
    });
  }

  function renderCampaign() {
    const c = state.campaign;
    const scenario = getScenario(state.scenarioId);
    const subtitle = `Week ${c.week} of ${c.maxWeeks} · ${html(electionStructureLabel(c.electionStructure))} · district poll ${pct(districtPoll(c), 1)} ± ${pct(pollMoe(c), 1)}`;
    root.innerHTML = `
      <section class="cr-game">
        ${renderRibbon()}
        <div class="cr-title-row">
          <div>
            <p class="cr-eyebrow">Campaign War Room</p>
            <h1>${html(state.candidate.name)} for ${html(scenario.office)}</h1>
            <p>${subtitle}</p>
          </div>
          ${renderCareerChip()}
        </div>
        ${renderCampaignMetrics()}
        <div class="cr-tab-row">${campaignTabs(c).map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-campaign-tab="${id}" type="button">${html(label)}</button>`).join("")}</div>
        ${renderCampaignTab()}
      </section>
    `;
    bindGlobal();
    bindCampaign();
  }

  function campaignTabs(campaign) {
    return CAMPAIGN_TABS;
  }

  function renderCampaignMetrics() {
    const r = state.campaign.resources;
    return `
      <div class="cr-metric-grid campaign">
        ${metric("Money", money(r.money), "Pays for local fundraisers, ads, polling, events, staff, and campaign materials.")}
        ${metric("Time", `${Math.round(r.time)} left`, "Most campaign actions cost one time slot. You cannot campaign everywhere at once.")}
        ${metric("Energy", `${Math.round(r.energy)}/${Math.round(r.maxEnergy)}`, "Low energy raises debate and event mistake risk. Resting matters.")}
        ${metric("Volunteers", Math.round(r.volunteers), "Grassroots capacity for canvassing, phonebanks, registration, and turnout.")}
        ${metric("Staff", Math.round(r.staff), "Professional campaign capacity for research, debate prep, field offices, and endorsements.")}
        ${metric("Public Trust", pct(r.trust, 0), "A general credibility measure that affects polls, events, and governing legitimacy.")}
        ${metric("District Poll", pct(districtPoll(state.campaign), 1), `Current model estimate with ${pct(pollMoe(state.campaign), 1)} uncertainty.`)}
        ${metric("Debate Prep", pct(state.campaign.debate.prep, 0), "Debate preparation improves answer quality and lowers public mistake risk.")}
      </div>
    `;
  }

  function metric(label, value, text) {
    return `<div class="cr-metric" title="${html(text)}"><span>${html(label)}</span><strong>${html(value)}</strong><em>${html(text)}</em></div>`;
  }

  function renderCampaignTab() {
    if (state.view === "schedule") return renderScheduleTab();
    if (state.view === "platform") return renderPlatformTab();
    if (state.view === "coalition") return renderCoalitionTab();
    if (state.view === "file") return renderCandidateFile();
    return renderWarRoom();
  }

  function renderScheduleTab() {
    return `
      <section class="cr-grid two cr-schedule-tab">
        <div class="cr-stack">
          ${renderWeeklyQuestion()}
          ${renderDebateHall()}
        </div>
        <div class="cr-stack">
          ${renderActionBoard()}
        </div>
      </section>
    `;
  }

  function renderPlatformTab() {
    return `
      <section class="cr-grid two">
        <div class="cr-stack">
          ${renderMessageBoard()}
        </div>
        <div class="cr-stack">
          ${renderFocusPaths()}
        </div>
      </section>
    `;
  }

  function renderCoalitionTab() {
    return `
      <section class="cr-grid two">
        <div class="cr-stack">
          ${renderVoterBoard()}
        </div>
        <div class="cr-stack">
          ${renderEndorsements()}
          ${state.campaign.mapScope === "national" ? renderPrimaryPlaceholder() : ""}
        </div>
      </section>
    `;
  }

  function renderWarRoom() {
    const advance = canAdvanceWeek();
    return `
      <section class="cr-war-room cr-scenario-war-room">
        <div class="cr-map-panel">
          <div class="cr-panel-head">
            <div>
              <h2>${html(scopeLabel(state.campaign.mapScope))}</h2>
              <p>${html(mapHelpText(state.campaign.mapScope))}</p>
            </div>
            ${renderTargetControls()}
          </div>
          ${renderMapByScope()}
          ${renderRegionDetail()}
        </div>
        <aside class="cr-action-ledger">
          <h2>This Week</h2>
          <p>Choose actions, answer the weekly question, watch the rival turn, then advance the week. Every movement is shown in the poll explanation.</p>
          ${renderWhyMoved()}
          ${renderRivalMove()}
          <button class="cr-btn primary full" data-advance-week ${advance.ok ? "" : "disabled"} type="button">${state.campaign.week >= state.campaign.maxWeeks ? "Election Night" : "Advance Week"}</button>
          ${advance.ok ? "" : `<p class="cr-disabled-reason">${html(advance.reason)}</p>`}
        </aside>
      </section>
    `;
  }

  function renderTargetControls() {
    const c = state.campaign;
    return `
      <div class="cr-control-line">
        <label>Region <select data-select-region>${c.regions.map((region) => `<option value="${html(region.id)}" ${region.id === c.selectedRegionId ? "selected" : ""}>${html(region.name)}</option>`).join("")}</select></label>
        <label>Voter group <select data-select-group>${activeGroupIds(c.regions, c.groups).map((groupId) => `<option value="${html(groupId)}" ${groupId === c.selectedGroupId ? "selected" : ""}>${html(c.groups[groupId]?.name || groupId)}</option>`).join("")}</select></label>
      </div>
    `;
  }

  function renderMapByScope() {
    const c = state.campaign;
    if (c.mapScope === "national") return renderNationalMap();
    if (c.mapScope === "statewide") return renderStatewideMap();
    return renderLocalMap();
  }

  function renderLocalMap() {
    const c = state.campaign;
    return `
      <div class="cr-district-map ${html(c.mapScope)}" aria-label="${html(scopeLabel(c.mapScope))}">
        ${c.regions.map((region, index) => `<button class="cr-district-region ${region.id === c.selectedRegionId ? "selected" : ""}" data-map-region="${html(region.id)}" style="clip-path:${html(region.mapShape || MAP_SHAPES[index % MAP_SHAPES.length])};${regionFill(region.support)}" type="button">
          <span>${html(region.name)}</span>
          <strong>${pct(region.support, 0)}</strong>
          <em>${pct(effectiveTurnout(region, c), 0)} turnout</em>
        </button>`).join("")}
      </div>
    `;
  }

  function renderStatewideMap() {
    return `
      <div class="cr-statewide-map">
        ${state.campaign.regions.map((region, index) => `<button class="${region.id === state.campaign.selectedRegionId ? "selected" : ""}" data-map-region="${html(region.id)}" style="${regionFill(region.support)}" type="button">
          <span>${html(region.type)}</span>
          <strong>${html(region.name)}</strong>
          <em>${pct(region.support, 1)} · ${pct(effectiveTurnout(region), 0)} turnout</em>
        </button>`).join("")}
      </div>
    `;
  }

  function renderNationalMap() {
    return `
      <div class="cr-state-map">
        ${state.campaign.states.map((item) => `<button class="cr-state-tile" style="${regionFill(item.support)}" type="button">
          <span>${html(item.abbreviation)}</span>
          <strong>${pct(item.support, 0)}</strong>
          <em>${item.lean === 0 ? "tossup" : `${item.lean > 0 ? "R" : "D"}+${Math.abs(item.lean)}`}</em>
        </button>`).join("")}
      </div>
    `;
  }

  function regionFill(value) {
    const hue = value >= 50 ? 163 : 5;
    const light = clamp(88 - Math.abs(value - 50) * 0.9, 38, 84);
    const sat = clamp(38 + Math.abs(value - 50), 32, 78);
    return `background:hsl(${hue} ${sat}% ${light}%);`;
  }

  function renderRegionDetail() {
    const region = selectedRegion();
    if (!region) return "";
    const groupRows = Object.entries(region.groups || {}).filter(([id]) => state.campaign.groups[id]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return `
      <div class="cr-map-detail">
        <h3>${html(region.name)}</h3>
        <p>${html(region.type)} · ${region.population.toLocaleString()} people · estimate ${pct(region.support, 1)} · turnout ${pct(effectiveTurnout(region), 1)} · measurement error ${pct(region.measurementError || 4.5, 1)}</p>
        <div class="cr-chip-row">${(region.concerns || []).map((item) => `<span>${html(item)}</span>`).join("")}</div>
        <div class="cr-group-mini-grid">${groupRows.map(([id, share]) => `<div><strong>${html(state.campaign.groups[id].name)}</strong><span>${share}% of region</span><em>support ${pct(state.campaign.groups[id].support, 1)} · turnout ${pct(state.campaign.groups[id].turnout, 0)}</em></div>`).join("")}</div>
      </div>
    `;
  }

  function selectedRegion() {
    return state.campaign.regions.find((item) => item.id === state.campaign.selectedRegionId) || state.campaign.regions[0];
  }

  function selectedGroup() {
    return state.campaign.groups[state.campaign.selectedGroupId] || state.campaign.groups[activeGroupIds()[0]];
  }

  function renderWhyMoved() {
    const move = state.campaign.lastMovement;
    if (!move) return `<div class="cr-result-note"><strong>Why polls moved</strong><p>No campaign action has been recorded yet.</p></div>`;
    const beforeAfter = move.before == null ? pct(move.after, 1) : `${pct(move.before, 1)} to ${pct(move.after, 1)} (${signed(move.after - move.before, " pts")})`;
    return `
      <div class="cr-result-note cr-why-moved">
        <strong>Why polls moved: ${html(move.source)}</strong>
        <p>Net district poll: ${html(beforeAfter)}. These are percentage-point changes, not percent-of-total-votes claims.</p>
        ${move.items.slice(0, 6).map((item) => `<p>${html(item)}</p>`).join("")}
      </div>
    `;
  }

  function renderRivalMove() {
    const move = state.campaign.rival.lastMove;
    if (!move) return `<div class="cr-mini-note"><strong>Rival Turn</strong><p>${html(state.campaign.opponent.name)} has not taken a visible weekly action yet.</p></div>`;
    return `<div class="cr-mini-note"><strong>Rival Turn</strong><p>${html(move.text)}</p><p><em>Counterplay: ${html(move.counter)}</em></p></div>`;
  }

  function renderActionBoard() {
    const actions = DATA.actions || [];
    const groups = Object.groupBy ? Object.groupBy(actions, (action) => action.category || "Campaign") : groupBy(actions, (action) => action.category || "Campaign");
    return `
      <section class="cr-panel">
        <div class="cr-panel-head">
          <div>
            <h2>Campaign Actions</h2>
            <p>Actions are loaded from <code>actions.js</code>. Each card previews target, costs, expected effects, risk, and whether the action has already been used in the selected region.</p>
          </div>
          ${renderTargetControls()}
        </div>
        ${renderScheduleBoard()}
        <div class="cr-action-board">
          ${Object.entries(groups).map(([category, items]) => `<section><h3>${html(category)}</h3><div class="cr-card-grid">${items.map(renderActionCard).join("")}</div></section>`).join("")}
        </div>
        ${renderWhyMoved()}
      </section>
    `;
  }

  function groupBy(list, fn) {
    return list.reduce((acc, item) => {
      const key = fn(item);
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function renderActionCard(action) {
    const targetText = actionTargetText(action);
    const usedKey = `${action.id}:${state.campaign.selectedRegionId}`;
    const used = Boolean(action.oncePerRegion && state.campaign.completedActions[usedKey]);
    const eligibleSlot = firstEligibleScheduleSlot(action);
    const disabled = !canAffordAdditionalCost(action.cost || {}) || used || !eligibleSlot || state.campaign.schedule?.resolved;
    const reason = used ? "Used already in this region" : state.campaign.schedule?.resolved ? "Week operation already resolved" : !eligibleSlot ? "No matching schedule slot is open" : !canAffordAdditionalCost(action.cost || {}) ? "Not enough resources after scheduled actions" : "";
    return `
      <article class="cr-action-card">
        <span>${html(action.category || "Campaign")}</span>
        <h4>${html(localizedActionName(action))}</h4>
        <p>${html(action.text)}</p>
        <div class="cr-action-preview">
          <p><strong>Cost:</strong> ${html(costText(action.cost))}</p>
          <p><strong>Target:</strong> ${html(targetText)}</p>
          <p><strong>Expected:</strong> ${html(effectText(action))}</p>
          <p><strong>Risk:</strong> ${html(riskText(action.risk))}</p>
          <p><strong>Used before:</strong> ${used ? "yes" : "no"}</p>
        </div>
        <button class="cr-btn ${disabled ? "subtle" : "primary"} full" data-schedule-action="${html(action.id)}" ${disabled ? "disabled" : ""} type="button">${eligibleSlot ? `Schedule: ${labelize(eligibleSlot)}` : "Schedule"}</button>
        ${reason ? `<p class="cr-disabled-reason">${html(reason)}</p>` : ""}
      </article>
    `;
  }

  function renderScheduleBoard() {
    const schedule = state.campaign.schedule || { candidate: null, staff: null, volunteers: null, media: null, report: [] };
    const slots = [
      ["candidate", "Candidate Time", "Speeches, town halls, debates, and visible campaign work."],
      ["staff", "Staff Operation", "Research, field offices, polling, and logistics."],
      ["volunteers", "Volunteer Operation", "Canvassing, phonebanks, registration, and turnout."],
      ["media", "Media/Message", "Ads, digital outreach, earned media, and press work."]
    ];
    const filled = slots.filter(([id]) => schedule[id]).length;
    return `
      <section class="cr-schedule-board">
        <div class="cr-panel-head">
          <div>
            <h3>Weekly Schedule</h3>
            <p>Plan up to four operations, then resolve them together. Costs are checked against the whole schedule so you cannot overbook staff, volunteers, stamina, or funds.</p>
          </div>
          <div class="cr-action-stack inline">
            <button class="cr-btn primary" data-resolve-schedule ${filled ? "" : "disabled"} type="button">Resolve Schedule</button>
            <button class="cr-btn subtle" data-clear-schedule ${filled && !schedule.resolved ? "" : "disabled"} type="button">Clear</button>
          </div>
        </div>
        <div class="cr-schedule-slots">
          ${slots.map(([id, label, text]) => {
            const item = schedule[id];
            return `<div class="cr-schedule-slot ${item ? "filled" : ""}"><span>${html(label)}</span><strong>${html(item?.name || "Open")}</strong><em>${html(item ? `${item.regionName} · ${item.groupName}` : text)}</em>${item && !schedule.resolved ? `<button type="button" data-unschedule="${id}">Remove</button>` : ""}</div>`;
          }).join("")}
        </div>
        ${(schedule.report || []).length ? `<div class="cr-result-note"><strong>Schedule report</strong>${schedule.report.map((item) => `<p>${html(item)}</p>`).join("")}</div>` : ""}
      </section>
    `;
  }

  function localizedActionName(action) {
    if (action.id === "fundraiser" && state.campaign.mapScope !== "national") return "Local fundraising event";
    return action.name;
  }

  function costText(cost = {}) {
    const bits = [];
    if (cost.time) bits.push(`${cost.time} time`);
    if (cost.energy) bits.push(`${cost.energy} energy`);
    if (cost.money) bits.push(money(cost.money));
    if (cost.staff) bits.push(`${cost.staff} staff`);
    if (cost.volunteers) bits.push(`${cost.volunteers} volunteers`);
    if (cost.capital) bits.push(`${cost.capital} capital`);
    return bits.join(", ") || "no direct cost";
  }

  function effectText(action) {
    const effects = action.effects || {};
    const bits = [];
    if (effects.regionSupport) bits.push(`${signed(effects.regionSupport)} region support`);
    if (effects.regionTurnout) bits.push(`${signed(effects.regionTurnout)} region turnout`);
    if (effects.groupSupport) bits.push(`${signed(effects.groupSupport)} target group support`);
    if (effects.groupTurnout) bits.push(`${signed(effects.groupTurnout)} target group turnout`);
    if (effects.money) bits.push(`${signed(effects.money, " money")}`);
    if (effects.volunteers) bits.push(`${signed(effects.volunteers)} volunteers`);
    if (effects.trust) bits.push(`${signed(effects.trust)} trust`);
    if (effects.media) bits.push(`${signed(effects.media)} media`);
    if (action.groupEffects) bits.push(`${Object.keys(action.groupEffects).length} group-specific effects`);
    return bits.join(" · ") || "situational effect";
  }

  function riskText(risk) {
    if (!risk) return "none";
    return `${Math.round((risk.chance || 0) * 100)}% chance: ${risk.log || "possible backlash"}`;
  }

  function actionTargetText(action) {
    if (action.target === "region") return selectedRegion()?.name || "selected region";
    if (action.target === "group") return selectedGroup()?.name || "selected group";
    if (action.target === "endorsement") return endorsementById(state.campaign.selectedEndorsementId)?.name || "selected endorser";
    return "campaign-wide";
  }

  function canPayCost(cost = {}) {
    const r = state.campaign.resources;
    return Object.entries(cost).every(([key, value]) => {
      if (key === "money") return r.money >= value;
      return (r[key] || 0) >= value;
    });
  }

  function scheduledCosts() {
    const costs = {};
    Object.values(state.campaign.schedule || {}).forEach((item) => {
      if (!item || typeof item !== "object" || !item.cost) return;
      Object.entries(item.cost).forEach(([key, value]) => {
        costs[key] = (costs[key] || 0) + Number(value || 0);
      });
    });
    return costs;
  }

  function canAffordAdditionalCost(cost = {}) {
    const r = state.campaign.resources;
    const pending = scheduledCosts();
    return Object.entries(cost).every(([key, value]) => {
      const available = key === "money" ? r.money : (r[key] || 0);
      return available >= (pending[key] || 0) + Number(value || 0);
    });
  }

  function payCost(cost = {}) {
    Object.entries(cost).forEach(([key, value]) => {
      state.campaign.resources[key] = clamp((state.campaign.resources[key] || 0) - Number(value), key === "money" ? -999999 : 0, 999999);
    });
  }

  function doAction(actionId, options = {}) {
    const action = byId(DATA.actions || [], actionId);
    if (!action || !canPayCost(action.cost || {})) return;
    const region = selectedRegion();
    const regionBefore = region?.support;
    const usedKey = `${action.id}:${state.campaign.selectedRegionId}`;
    if (action.oncePerRegion && state.campaign.completedActions[usedKey]) return;
    if (action.id === "seekEndorsement") {
      doEndorsementInterview(action, options);
      return;
    }
    payCost(action.cost || {});
    let effects = { ...(action.effects || {}), groupEffects: action.groupEffects || {} };
    let riskText = "";
    if (action.risk && Math.random() < (action.risk.chance || 0) * difficulty().risk) {
      const riskEffects = { ...action.risk };
      riskText = riskEffects.log || "A risk event reduced the expected benefit.";
      delete riskEffects.chance;
      delete riskEffects.log;
      effects = mergeCampaignEffects(effects, riskEffects);
    }
    const move = applyEffectsToCampaign(state.campaign, effects, {
      source: localizedActionName(action),
      regionId: state.campaign.selectedRegionId,
      groupId: state.campaign.selectedGroupId,
      regionBefore
    });
    if (riskText) state.campaign.lastMovement.items.unshift(riskText);
    if (action.oncePerRegion) state.campaign.completedActions[usedKey] = true;
    addLog(`${localizedActionName(action)} targeted ${actionTargetText(action)}. District movement ${signed(move.after - move.before, " pts")}.`, "action");
    if (options.saveAndRender !== false) {
      save();
      render();
    }
  }

  function doEndorsementInterview(action, options = {}) {
    if (!canPayCost(action.cost || {})) return;
    const endorsement = endorsementById(state.campaign.selectedEndorsementId);
    if (!endorsement) return;
    payCost(action.cost || {});
    const progress = endorsementProgress(endorsement);
    const before = districtPoll();
    let items;
    if (progress.met || progress.value >= 92 || Math.random() * 100 < progress.value * 0.72) {
      state.campaign.endorsements[endorsement.id] = "won";
      applyEffectsToCampaign(state.campaign, endorsement.effects || {}, { source: `${endorsement.name} endorsement`, quiet: true });
      items = [`${endorsement.name} endorsed the campaign after the interview.`, `Requirement: ${progress.text}.`];
      addLog(`${endorsement.name} endorsed the campaign after an interview.`, "endorsement");
    } else {
      state.campaign.endorsements[endorsement.id] = "interviewed";
      applyEffectsToCampaign(state.campaign, { media: 1, trust: 0.3 }, { source: `${endorsement.name} interview`, quiet: true });
      items = [`${endorsement.name} did not endorse yet.`, `They want more evidence: ${progress.text}.`];
      addLog(`${endorsement.name} held endorsement pending after an interview.`, "endorsement");
    }
    refreshAllRegionPolls(state.campaign);
    state.campaign.lastMovement = {
      source: "Endorsement interview",
      before,
      after: districtPoll(),
      items
    };
    if (options.saveAndRender !== false) {
      save();
      render();
    }
  }

  function mergeCampaignEffects(base = {}, extra = {}) {
    const merged = clone(base);
    Object.entries(extra || {}).forEach(([key, value]) => {
      if (typeof value === "number") merged[key] = Number(merged[key] || 0) + value;
      else if (key === "groups" || key === "regions" || key === "issueMomentum") {
        merged[key] = { ...(merged[key] || {}) };
        Object.entries(value || {}).forEach(([id, amount]) => merged[key][id] = Number(merged[key][id] || 0) + Number(amount || 0));
      } else if (key === "groupEffects") {
        merged.groupEffects = { ...(merged.groupEffects || {}) };
        Object.entries(value || {}).forEach(([id, effect]) => {
          merged.groupEffects[id] = { ...(merged.groupEffects[id] || {}) };
          Object.entries(effect || {}).forEach(([effectKey, amount]) => {
            merged.groupEffects[id][effectKey] = Number(merged.groupEffects[id][effectKey] || 0) + Number(amount || 0);
          });
        });
      } else {
        merged[key] = value;
      }
    });
    return merged;
  }

  function firstEligibleScheduleSlot(action) {
    const schedule = state.campaign.schedule || {};
    const cost = action.cost || {};
    const slots = [];
    if (cost.time || cost.energy || ["Field", "Events", "Debate"].includes(action.category)) slots.push("candidate");
    if (cost.staff || ["Research", "Operations"].includes(action.category)) slots.push("staff");
    if (cost.volunteers || String(action.name || "").toLowerCase().includes("canvass") || String(action.name || "").toLowerCase().includes("phone")) slots.push("volunteers");
    if (cost.money || action.category === "Media" || String(action.name || "").toLowerCase().includes("ad")) slots.push("media");
    if (!slots.length) slots.push("candidate");
    return slots.find((slot) => !schedule[slot]);
  }

  function scheduleAction(actionId) {
    const action = byId(DATA.actions || [], actionId);
    if (!action || state.campaign.schedule?.resolved) return;
    const slot = firstEligibleScheduleSlot(action);
    if (!slot || !canAffordAdditionalCost(action.cost || {})) {
      announce("That action cannot fit into the remaining weekly schedule.");
      return;
    }
    state.campaign.schedule[slot] = {
      id: action.id,
      name: localizedActionName(action),
      cost: clone(action.cost || {}),
      regionId: state.campaign.selectedRegionId,
      regionName: selectedRegion()?.name || "selected region",
      groupId: state.campaign.selectedGroupId,
      groupName: selectedGroup()?.name || "selected group"
    };
    announce(`${localizedActionName(action)} added to the ${labelize(slot)} slot.`);
    save();
    render();
  }

  function unscheduleAction(slot) {
    if (!state.campaign.schedule || state.campaign.schedule.resolved) return;
    state.campaign.schedule[slot] = null;
    save();
    render();
  }

  function clearSchedule() {
    state.campaign.schedule = { candidate: null, staff: null, volunteers: null, media: null, resolved: false, report: [] };
    save();
    render();
  }

  function resolveSchedule() {
    const schedule = state.campaign.schedule || {};
    const entries = ["candidate", "staff", "volunteers", "media"].map((slot) => [slot, schedule[slot]]).filter(([, item]) => item);
    if (!entries.length || schedule.resolved) return;
    const report = [];
    entries.forEach(([slot, item]) => {
      state.campaign.selectedRegionId = item.regionId;
      state.campaign.selectedGroupId = item.groupId;
      const before = districtPoll();
      doAction(item.id, { saveAndRender: false });
      const after = districtPoll();
      report.push(`${labelize(slot)}: ${item.name} in ${item.regionName} moved the district estimate ${signed(after - before, " pts")}.`);
    });
    schedule.resolved = true;
    schedule.report = report;
    state.campaign.weekStep = "report";
    addLog(`Resolved weekly schedule: ${report.join(" ")}`, "schedule");
    save();
    render();
  }

  function renderWeeklyQuestion() {
    const event = currentEvent();
    if (!event) {
      return `<section class="cr-panel"><h2>No Eligible Question</h2><p>Advance the week to refresh the scenario event deck.</p>${renderWhyMoved()}</section>`;
    }
    return `
      <section class="cr-qa-layout">
        <article class="cr-question-panel">
          <p class="cr-eyebrow">Week ${state.campaign.week} Question</p>
          <h2>${html(event.title)}</h2>
          <p>${html(event.body || event.text)}</p>
          <div class="cr-answer-list">
            ${(event.choices || event.options || []).map((choice, index) => `
              <button class="cr-answer" data-event-choice="${index}" type="button">
                <span>Choice ${index + 1}</span>
                <strong>${html(choice.label)}</strong>
                <em>${html(choice.text || effectText({ effects: choice.effects || {} }))}</em>
              </button>
            `).join("")}
          </div>
          <button class="cr-btn subtle full" data-skip-weekly-question type="button">Skip Question · -1 trust, rival controls the story</button>
        </article>
        <aside class="cr-qa-side">
          <h2>Visible Consequences</h2>
          <p>Choices apply to voter groups, regions, trust, money, media, and opponent standing. The poll explanation panel shows the exact movement after you answer.</p>
          ${renderWhyMoved()}
        </aside>
      </section>
    `;
  }

  function currentEvent() {
    return byId(DATA.events || [], state.campaign.currentEventId);
  }

  function answerEvent(index) {
    const event = currentEvent();
    const choice = (event?.choices || event?.options || [])[index];
    if (!event || !choice) return;
    const effects = choice.effects || {};
    applyEffectsToCampaign(state.campaign, effects, { source: event.title });
    state.campaign.answeredEvents.push(event.id);
    state.campaign.currentEventId = null;
    addLog(`${event.title}: ${choice.label}`, "event");
    save();
    render();
  }

  function skipWeeklyQuestion() {
    const event = currentEvent();
    if (!event) return;
    applyEffectsToCampaign(state.campaign, { trust: -1, media: 1, opponentSupport: 0.8 }, { source: `Skipped: ${event.title}` });
    state.campaign.answeredEvents.push(event.id);
    state.campaign.currentEventId = null;
    addLog(`Skipped weekly question: ${event.title}.`, "event");
    save();
    render();
  }

  function drawEligibleEvent(campaign = state.campaign) {
    const events = DATA.events || [];
    const priorities = new Set(state?.candidate?.priorities?.map((item) => item.issueId) || []);
    const eligible = events.filter((event) => eventFitsCampaign(event, campaign));
    if (!eligible.length) return null;
    const weighted = [];
    eligible.forEach((event) => {
      const text = `${event.title} ${event.body || ""}`.toLowerCase();
      let weight = 1;
      priorities.forEach((issueId) => {
        if (text.includes(String(issueId).toLowerCase()) || text.includes(issueById(issueId)?.name?.toLowerCase() || "")) weight += 2;
      });
      if ((event.weekMin || 1) === campaign.week) weight += 1;
      for (let i = 0; i < weight; i += 1) weighted.push(event);
    });
    return pick(weighted).id;
  }

  function eventFitsCampaign(event, campaign) {
    if (campaign.answeredEvents.includes(event.id)) return false;
    if (event.weekMin && campaign.week < event.weekMin) return false;
    if (event.weekMax && campaign.week > event.weekMax) return false;
    if (event.federalOnly && campaign.mapScope !== "national") return false;
    if (event.offices && !event.offices.includes(campaign.officeId)) return false;
    if (event.scenarioIds && !event.scenarioIds.includes(campaign.scenarioId)) return false;
    const mentionedRegions = new Set();
    (event.choices || event.options || []).forEach((choice) => Object.keys(choice.effects?.regions || {}).forEach((id) => mentionedRegions.add(id)));
    if (!mentionedRegions.size) return true;
    const campaignRegionIds = new Set(campaign.regions.map((region) => region.id));
    return [...mentionedRegions].some((id) => campaignRegionIds.has(id));
  }

  function renderMessageBoard() {
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Message System</h2>
          <p>Ads promote one selected platform stance to one voter group in one region. The ad does not invent a new promise; it amplifies a stance you chose at setup.</p>
          ${renderTargetControls()}
          <div class="cr-card-grid">${state.candidate.priorities.map(renderMessageCard).join("")}</div>
        </article>
        <aside class="cr-panel">
          <h2>Message History</h2>
          <div class="cr-log">${state.campaign.messageHistory.slice(0, 12).map((item) => `<p>${html(item)}</p>`).join("") || "<p>No ads have run yet.</p>"}</div>
          ${renderWhyMoved()}
        </aside>
      </section>
    `;
  }

  function renderMessageCard(priority) {
    const found = stanceById(priority.stanceId);
    if (!found) return "";
    const cost = adCost();
    return `
      <article class="cr-action-card">
        <span>${html(found.issue.name)}</span>
        <h4>${html(found.stance.name)}</h4>
        <p>${html(found.issue.description)}</p>
        <div class="cr-action-preview">
          <p><strong>Target:</strong> ${html(selectedGroup()?.name)} in ${html(selectedRegion()?.name)}</p>
          <p><strong>Cost:</strong> ${money(cost)} and 1 energy</p>
          <p><strong>Expected:</strong> stance effects at 45% strength, plus ${signed(0.6)} region support if the ad fits.</p>
          <p><strong>Risk:</strong> ${Math.round(12 * difficulty().risk)}% chance of backlash if the audience dislikes the stance.</p>
        </div>
        <button class="cr-btn primary full" data-message-stance="${html(found.stance.id)}" ${state.campaign.resources.money < cost || state.campaign.resources.energy < 1 ? "disabled" : ""} type="button">Run Targeted Ad</button>
      </article>
    `;
  }

  function adCost() {
    const weekPressure = 1 + state.campaign.week / state.campaign.maxWeeks * 0.45;
    const region = selectedRegion();
    return Math.round((6500 + (region?.population || 50000) * 0.018) * weekPressure);
  }

  function runMessageAd(stanceId) {
    const found = stanceById(stanceId);
    const cost = adCost();
    if (!found || state.campaign.resources.money < cost || state.campaign.resources.energy < 1) return;
    state.campaign.resources.money -= cost;
    state.campaign.resources.energy -= 1;
    const effects = scaleEffects(found.stance.effects || {}, 0.45);
    effects.regionSupport = (effects.regionSupport || 0) + 0.6;
    effects.media = (effects.media || 0) + 2;
    if (Math.random() < 0.12 * difficulty().risk) {
      effects.trust = (effects.trust || 0) - 0.7;
    }
    applyEffectsToCampaign(state.campaign, effects, {
      source: `Ad: ${found.stance.name}`,
      regionId: state.campaign.selectedRegionId,
      groupId: state.campaign.selectedGroupId
    });
    state.campaign.messageHistory.unshift(`${found.stance.name} ad targeted ${selectedGroup()?.name} in ${selectedRegion()?.name} for ${money(cost)}.`);
    addLog(`Targeted ad promoted ${found.stance.name}.`, "message");
    save();
    render();
  }

  function renderVoterBoard() {
    const c = state.campaign;
    const groupIds = activeGroupIds(c.regions, c.groups);
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <div class="cr-panel-head"><div><h2>Voter Groups</h2><p>Groups drive regional polls through their support, turnout, salience, persuasion, and share inside each region.</p></div><button class="cr-btn primary" data-internal-poll type="button">Conduct Internal Poll · ${money(3200)}</button></div>
          <div class="cr-voter-table">
            ${groupIds.map((id) => {
              const group = c.groups[id];
              return `<button class="${id === c.selectedGroupId ? "selected" : ""}" data-voter-group="${html(id)}" type="button"><strong>${html(group.name)}</strong><span>support ${pct(group.support, 1)} · turnout ${pct(group.turnout, 0)} · salience ${pct(group.salience, 0)}</span><em>${html((group.issues || []).join(", "))}</em></button>`;
            }).join("")}
          </div>
        </article>
        <aside class="cr-panel">
          <h2>Polling and Uncertainty</h2>
          <p>Polling reveals the model more clearly; it does not itself persuade anyone. Error remains until election night.</p>
          ${meter("District estimate", districtPoll(c), 100)}
          ${meter("Uncertainty", pollMoe(c), 8)}
          ${c.lastPoll ? `<div class="cr-result-note"><strong>Internal poll</strong><p>${html(c.lastPoll)}</p></div>` : "<p>No internal poll has been purchased yet.</p>"}
          ${renderWhyMoved()}
        </aside>
      </section>
    `;
  }

  function conductInternalPoll() {
    const cost = 3200;
    if (state.campaign.resources.money < cost) return;
    state.campaign.resources.money -= cost;
    state.campaign.regions.forEach((region) => region.measurementError = clamp((region.measurementError || 4.5) - 1.2, 1.6, 8));
    state.campaign.polling.pollsBought += 1;
    state.campaign.polling.lastPollWeek = state.campaign.week;
    const swing = topSwingGroups(3).map((item) => `${item.group.name} (${pct(item.group.support, 1)}, ${Math.round(item.score)} swing value)`).join("; ");
    state.campaign.lastPoll = `Internal poll, week ${state.campaign.week}: district estimate ${pct(districtPoll(), 1)} ± ${pct(pollMoe(), 1)} measurement error. Top swing groups: ${swing}. Election volatility remains separate.`;
    state.campaign.lastMovement = {
      source: "Internal poll",
      before: districtPoll(),
      after: districtPoll(),
      items: ["Polling reduced uncertainty and revealed group detail. It did not change support."]
    };
    addLog("Internal poll conducted. It revealed more detail without changing voter support.", "poll");
    save();
    render();
  }

  function renderEndorsements() {
    const endorsements = DATA.endorsements || [];
    return `
      <section class="cr-panel">
        <div class="cr-panel-head"><div><h2>Endorsement Goals</h2><p>Endorsements are active goals with visible requirements. Meeting a requirement lets you ask; asking applies real voter, region, volunteer, media, or money effects.</p></div>${renderTargetControls()}</div>
        <div class="cr-card-grid">${endorsements.map(renderEndorsementCard).join("")}</div>
      </section>
    `;
  }

  function endorsementById(id) {
    return byId(DATA.endorsements || [], id);
  }

  function renderEndorsementCard(endorsement) {
    const progress = endorsementProgress(endorsement);
    const won = state.campaign.endorsements[endorsement.id] === "won";
    const interviewed = state.campaign.endorsements[endorsement.id] === "interviewed";
    return `
      <article class="cr-action-card">
        <span>Endorsement</span>
        <h4>${html(endorsement.name)}</h4>
        <p>${html(endorsement.text)}</p>
        <div class="cr-action-preview">
          <p><strong>Requirement:</strong> ${html(progress.text)}</p>
          <p><strong>Progress:</strong> ${Math.round(progress.value)}%</p>
          <p><strong>Effect:</strong> ${html(effectText({ effects: endorsement.effects || {} }))}</p>
        </div>
        <button class="cr-btn ${progress.met && !won ? "primary" : "subtle"} full" data-request-endorsement="${html(endorsement.id)}" ${!progress.met || won ? "disabled" : ""} type="button">${won ? "Endorsed" : interviewed ? "Interviewed · build support" : "Request Endorsement"}</button>
      </article>
    `;
  }

  function endorsementProgress(endorsement) {
    const req = endorsement.requirements || {};
    if (req.group) {
      const group = state.campaign.groups[req.group];
      const support = group?.support || 0;
      return { value: clamp(support / req.support * 100, 0, 120), met: support >= req.support, text: `${group?.name || req.group} support ${pct(req.support, 0)}+` };
    }
    if (req.trust) return { value: clamp(state.campaign.resources.trust / req.trust * 100, 0, 120), met: state.campaign.resources.trust >= req.trust, text: `Public trust ${pct(req.trust, 0)}+` };
    if (req.issue) {
      const met = state.candidate.priorities.some((item) => item.issueId === req.issue);
      return { value: met ? 100 : 35, met, text: `Platform includes ${issueById(req.issue)?.name || req.issue}` };
    }
    return { value: 100, met: true, text: "No formal requirement" };
  }

  function requestEndorsement(id) {
    const endorsement = endorsementById(id);
    if (!endorsement || state.campaign.endorsements[id] === "won" || !endorsementProgress(endorsement).met) return;
    state.campaign.endorsements[id] = "won";
    applyEffectsToCampaign(state.campaign, endorsement.effects || {}, { source: `${endorsement.name} endorsement` });
    addLog(`${endorsement.name} endorsed the campaign.`, "endorsement");
    save();
    render();
  }

  function renderFocusPaths() {
    const focus = state.campaign.focus;
    const active = byId(DATA.focuses || [], focus.activeId);
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Agenda Paths</h2>
          <p>Focus paths are three-week mini-arcs. Each step applies effects when the week advances; the final decision forces a strategic tradeoff.</p>
          <div class="cr-card-grid">${(DATA.focuses || []).map(renderFocusCard).join("")}</div>
        </article>
        <aside class="cr-panel">
          <h2>Active Path</h2>
          ${active ? renderActiveFocus(active) : "<p>No active path. Begin one to turn a broad slogan into a sequence of visible campaign commitments.</p>"}
          ${renderWhyMoved()}
        </aside>
      </section>
    `;
  }

  function renderFocusCard(focus) {
    const active = state.campaign.focus.activeId === focus.id;
    const done = state.campaign.focus.completed.includes(focus.id);
    return `
      <article class="cr-action-card">
        <span>${html(issueById(focus.issue)?.name || focus.issue)}</span>
        <h4>${html(focus.name)}</h4>
        <p>${html(focus.summary)}</p>
        <ol>${(focus.steps || []).map((step) => `<li>${html(step.name)}</li>`).join("")}</ol>
        <p><strong>Payoff:</strong> ${html(focus.payoff)}</p>
        <button class="cr-btn ${!active && !done && !state.campaign.focus.activeId ? "primary" : "subtle"} full" data-begin-focus="${html(focus.id)}" ${active || done || state.campaign.focus.activeId ? "disabled" : ""} type="button">${done ? "Completed" : active ? "Active" : "Begin Focus"}</button>
      </article>
    `;
  }

  function renderActiveFocus(active) {
    const f = state.campaign.focus;
    if (f.awaitingChoice === active.id) {
      return `
        <p>${html(active.payoff)}</p>
        <div class="cr-answer-list">${(active.choices || []).map((choice, index) => `
          <button class="cr-answer" data-focus-choice="${index}" type="button"><span>Final Decision</span><strong>${html(choice.label)}</strong><em>${html(choice.text)}</em></button>
        `).join("")}</div>
      `;
    }
    const current = active.steps?.[f.stepIndex];
    return `
      <p><strong>${html(active.name)}</strong></p>
      <p>Current step: ${html(current?.name || "Final decision pending")}.</p>
      ${(active.steps || []).map((step, index) => meter(step.name, index < f.stepIndex ? 100 : index === f.stepIndex ? 45 : 0)).join("")}
    `;
  }

  function beginFocus(id) {
    if (state.campaign.focus.activeId) return;
    state.campaign.focus = { activeId: id, stepIndex: 0, completed: state.campaign.focus.completed || [], awaitingChoice: null };
    addLog(`Began agenda path: ${byId(DATA.focuses || [], id)?.name}.`, "focus");
    save();
    render();
  }

  function chooseFocusFinal(index) {
    const active = byId(DATA.focuses || [], state.campaign.focus.activeId);
    const choice = active?.choices?.[index];
    if (!active || !choice) return;
    applyEffectsToCampaign(state.campaign, choice.effects || {}, { source: `${active.name}: final decision` });
    state.campaign.focus.completed.push(active.id);
    state.campaign.focus.activeId = null;
    state.campaign.focus.awaitingChoice = null;
    state.campaign.focus.stepIndex = 0;
    addLog(`${active.name} completed: ${choice.label}`, "focus");
    save();
    render();
  }

  function advanceFocusStep() {
    const f = state.campaign.focus;
    const active = byId(DATA.focuses || [], f.activeId);
    if (!active || f.awaitingChoice) return;
    const step = active.steps?.[f.stepIndex];
    if (!step) {
      f.awaitingChoice = active.id;
      return;
    }
    applyEffectsToCampaign(state.campaign, step.effects || {}, { source: `${active.name}: ${step.name}` });
    addLog(`Agenda path advanced: ${active.name} / ${step.name}.`, "focus");
    f.stepIndex += 1;
    if (f.stepIndex >= (active.steps || []).length) f.awaitingChoice = active.id;
  }

  function renderDebateHall() {
    const d = state.campaign.debate;
    const questions = debateQuestions();
    if (d.completed) {
      return `<section class="cr-grid two"><article class="cr-panel cr-debate-stage"><h2>Debate Report</h2><p>${html(d.clip || "The debate is complete.")}</p>${renderDebateReport()}${renderWhyMoved()}</article><aside class="cr-panel"><h2>Answers</h2>${d.answers.map((answer) => `<p><strong>${html(answer.questionTitle || "Question")}</strong><br>${html(answer.choiceLabel || answer)}</p>`).join("")}</aside></section>`;
    }
    if (d.declined) {
      return `<section class="cr-panel cr-debate-stage"><h2>Debate Declined</h2><p>The campaign declined the scheduled debate. You avoided a risky stage, but the opponent gained a clean attack line.</p>${renderWhyMoved()}</section>`;
    }
    if (!d.started) {
      const due = state.campaign.week >= d.scheduledWeek;
      return `
        <section class="cr-grid two">
          <article class="cr-panel cr-debate-stage">
            <p class="cr-eyebrow">Debate Hall</p>
            <h2>Moderator, Audience, and Cameras</h2>
            <p>${due ? "The scheduled debate is now due." : `The debate is scheduled for week ${d.scheduledWeek}. Until then, prep actions and mock answers improve readiness.`} The debate uses prep, eloquence, policy knowledge, fatigue, opponent debate skill, and the platform you chose at setup.</p>
            <div class="cr-stage-visual"><div>Moderator</div><div>${html(state.candidate.name)}</div><div>${html(state.campaign.opponent.name)}</div><div>Audience</div></div>
            <div class="cr-action-stack">
              <button class="cr-btn primary full" data-start-debate ${due ? "" : "disabled"} type="button">Enter Debate Hall</button>
              <button class="cr-btn subtle full" data-decline-debate ${due ? "" : "disabled"} type="button">Decline Debate · -2 trust, opponent attack</button>
            </div>
            ${due ? "" : `<p class="cr-disabled-reason">Debate actions are preparation only until week ${d.scheduledWeek}.</p>`}
          </article>
          <aside class="cr-panel">
            <h2>Debate Readiness</h2>
            ${meter("Prep", d.prep)}
            ${meter("Eloquence", state.candidate.stats.eloquence)}
            ${meter("Policy", state.candidate.stats.policy)}
            ${meter("Fatigue risk", state.candidate.fatigue)}
          </aside>
        </section>
      `;
    }
    const question = questions[d.currentIndex] || questions[0];
    return `
      <section class="cr-qa-layout">
        <article class="cr-question-panel cr-debate-stage">
          <p class="cr-eyebrow">Debate Question ${d.currentIndex + 1} of ${Math.min(3, questions.length)}</p>
          <h2>${html(question.title)}</h2>
          <p>${html(question.audience || "")}</p>
          <p>${html(question.question || question.text)}</p>
          <div class="cr-answer-list">${question.choices.map((choice, index) => `
            <button class="cr-answer" data-debate-choice="${index}" type="button"><span>${html(choice.tone || "Answer")}</span><strong>${html(choice.label)}</strong><em>${html(choice.preview || choice.text || effectText({ effects: choice.effects || {} }))}</em></button>
          `).join("")}</div>
        </article>
        <aside class="cr-qa-side">
          <h2>Stage Conditions</h2>
          <p>Prep ${pct(d.prep, 0)} · candidate eloquence ${Math.round(state.candidate.stats.eloquence)} · opponent debate ${Math.round(state.campaign.opponent.stats?.debate || 60)}.</p>
          ${renderWhyMoved()}
        </aside>
      </section>
    `;
  }

  function debateQuestions() {
    if ((DATA.debateQuestions || []).length) return DATA.debateQuestions;
    return [
      {
        title: "School Funding and Taxes",
        text: "The moderator asks whether better services require higher taxes or a different budget.",
        choices: [
          { tone: "Clear Tradeoff", label: "Name the cost and the classroom benefit.", preview: "+teachers, +trust, some tax backlash", effects: { groups: { teachers: 2.8, parents: 1.2, smallBusiness: -1.2 }, trust: 1.4, media: 1 } },
          { tone: "Audit First", label: "Promise an audit before any new revenue.", preview: "+suburban moderates, -teachers", effects: { groups: { suburbanModerates: 2, teachers: -0.8, smallBusiness: 0.8 }, regions: { pineSuburbs: 0.8 }, trust: 0.8 } },
          { tone: "Local Control", label: "Say families know better than bureaucrats.", preview: "+religious/rural voters, -teachers", effects: { groups: { religiousVoters: 2, ruralVoters: 1, teachers: -1.6 }, regions: { ridgeTowns: 0.9 } } }
        ]
      },
      {
        title: "Safety and Student Discipline",
        text: "A parent in the audience asks how you would keep schools safe without turning them into fortresses.",
        choices: [
          { tone: "Balanced", label: "Combine faster response, counseling, and accountability.", preview: "+parents, +moderates, +trust", effects: { groups: { parents: 2.2, suburbanModerates: 1.4, urbanProfessionals: 0.8 }, trust: 1 } },
          { tone: "Strict", label: "Emphasize visible rules and consequences.", preview: "+seniors/veterans, -students", effects: { groups: { seniors: 1.8, veterans: 1.4, collegeStudents: -1.4 }, regions: { ridgeTowns: 0.9 } } },
          { tone: "Prevention", label: "Lead with youth programs and mental health.", preview: "+students, +immigrant communities, some softness risk", effects: { groups: { collegeStudents: 1.8, immigrantCommunities: 1.6, seniors: -0.8 }, regions: { harborCity: 0.7 } } }
        ]
      },
      {
        title: "Trust and Experience",
        text: `The final question asks why voters should trust you over ${state.campaign.opponent.name}.`,
        choices: [
          { tone: "Record", label: "Contrast your plan with the incumbent's stale record.", preview: "+media, opponent down, some negative tone", effects: { opponentSupport: -1.2, media: 2, trust: -0.2 } },
          { tone: "Listening", label: "Tell a story from the campaign trail and name what changed your mind.", preview: "+trust, +parents, +rural voters", effects: { trust: 2, groups: { parents: 1, ruralVoters: 1 }, regions: { ridgeTowns: 0.5 } } },
          { tone: "Policy", label: "Give a concise three-part governing plan.", preview: "+policy voters, +moderates", effects: { groups: { urbanProfessionals: 1.8, suburbanModerates: 1.4, publicSectorWorkers: 1 }, capital: 1 } }
        ]
      }
    ];
  }

  function startDebate() {
    if (state.campaign.week < state.campaign.debate.scheduledWeek) return;
    state.campaign.debate.started = true;
    state.campaign.debate.currentIndex = 0;
    state.campaign.debate.baselinePoll = districtPoll();
    state.campaign.debate.baselineTrust = state.campaign.resources.trust;
    state.campaign.debate.score = 0;
    state.campaign.debate.opponentScore = 0;
    state.campaign.debate.answers = [];
    save();
    render();
  }

  function declineDebate() {
    const d = state.campaign.debate;
    if (!d || d.completed || d.declined || state.campaign.week < d.scheduledWeek) return;
    d.declined = true;
    d.clip = `${state.campaign.opponent.name} uses the declined debate as an attack line.`;
    applyEffectsToCampaign(state.campaign, { trust: -2, media: 2, opponentSupport: 1.2 }, { source: "Debate declined" });
    addLog("Declined the scheduled debate.", "debate");
    save();
    render();
  }

  function answerDebate(index) {
    const d = state.campaign.debate;
    const question = debateQuestions()[d.currentIndex];
    const choice = question?.choices?.[index];
    if (!choice) return;
    const baseEffects = choice.effects || {};
    const prepBonus = (d.prep - 50) * 0.018 + (state.candidate.stats.eloquence - 55) * 0.012 + (state.candidate.stats.policy - 55) * 0.008 - state.candidate.fatigue * 0.01;
    const opponentPenalty = ((state.campaign.opponent.stats?.debate || 60) - 60) * 0.012 * difficulty().opposition;
    const effects = { ...baseEffects, regionSupport: (baseEffects.regionSupport || 0) + prepBonus - opponentPenalty };
    applyEffectsToCampaign(state.campaign, effects, { source: `Debate: ${question.title}` });
    const answerScore = 50 + (baseEffects.debate || 0) + d.prep * 0.12 + state.candidate.stats.eloquence * 0.08 + state.candidate.stats.policy * 0.05 - state.candidate.fatigue * 0.08;
    const opponentScore = 47 + (state.campaign.opponent.stats?.debate || 60) * 0.12 * difficulty().opposition + Math.random() * 4;
    d.score += answerScore;
    d.opponentScore += opponentScore;
    d.answers.push({ questionTitle: question.title, choiceLabel: choice.label, score: Math.round(answerScore), opponentScore: Math.round(opponentScore) });
    d.currentIndex += 1;
    if (d.currentIndex >= Math.min(3, debateQuestions().length)) {
      d.completed = true;
      d.started = false;
      const movement = districtPoll() - (d.baselinePoll ?? districtPoll());
      d.report = buildDebateReport(movement);
      d.clip = d.report.clip;
      addLog(`Debate completed. ${d.clip}`, "debate");
    }
    save();
    render();
  }

  function buildDebateReport(movement) {
    const d = state.campaign.debate;
    const answers = d.answers || [];
    const best = [...answers].sort((a, b) => b.score - a.score)[0];
    const weakest = [...answers].sort((a, b) => a.score - b.score)[0];
    const groups = Object.values(state.campaign.groups).sort((a, b) => b.support - a.support);
    const candidateScore = Math.round(d.score / Math.max(1, answers.length));
    const opponentScore = Math.round(d.opponentScore / Math.max(1, answers.length));
    const clip = candidateScore >= opponentScore + 4 || movement >= 1.2
      ? "Post-debate coverage calls your answers specific, grounded, and ready for office."
      : candidateScore <= opponentScore - 4 || movement <= -1.1
        ? `The strongest clip belongs to ${state.campaign.opponent.name}, and your campaign spends the morning explaining context.`
        : "Coverage is mixed: supporters heard discipline, skeptics still want proof.";
    return {
      candidateScore,
      opponentScore,
      best: best?.questionTitle || "No clear standout",
      weakest: weakest?.questionTitle || "No clear weak answer",
      pollMovement: movement,
      trustMovement: state.campaign.resources.trust - (d.baselineTrust ?? state.campaign.resources.trust),
      groupsGained: groups.slice(0, 2).map((group) => group.name),
      groupsLost: groups.slice(-2).map((group) => group.name),
      clip,
      attackLine: movement < 0 ? `${state.campaign.opponent.name} says the debate exposed shallow execution.` : "The opponent argues you overpromised, but the clip is less damaging."
    };
  }

  function renderDebateReport() {
    const report = state.campaign.debate.report;
    if (!report) return "";
    return `
      <div class="cr-result-board won cr-debate-report">
        <div><span>Your score</span><strong>${report.candidateScore}</strong><em>average answer quality</em></div>
        <div><span>Opponent score</span><strong>${report.opponentScore}</strong><em>estimated stage performance</em></div>
      </div>
      <p><strong>Best answer:</strong> ${html(report.best)}. <strong>Weakest answer:</strong> ${html(report.weakest)}.</p>
      <p><strong>Movement:</strong> district ${signed(report.pollMovement, " pts")}; trust ${signed(report.trustMovement, " pts")}.</p>
      <p><strong>Groups helped:</strong> ${html(report.groupsGained.join(", "))}. <strong>Groups still skeptical:</strong> ${html(report.groupsLost.join(", "))}.</p>
      <p><strong>Attack line:</strong> ${html(report.attackLine)}</p>
    `;
  }

  function renderElectionMath() {
    const c = state.campaign;
    const turnoutVotes = c.regions.reduce((sum, region) => sum + (region.population || 1) * effectiveTurnout(region, c) / 100, 0);
    const share = districtPoll(c);
    const playerVotes = Math.round(turnoutVotes * share / 100);
    const need = Math.floor(turnoutVotes / 2) + 1;
    const persuadable = topSwingGroups(3);
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Election Math</h2>
          <div class="cr-result-board won cr-math-board">
            <div><span>Votes Needed</span><strong>${need.toLocaleString()}</strong><em>estimated majority threshold</em></div>
            <div><span>Current Estimate</span><strong>${playerVotes.toLocaleString()}</strong><em>${pct(share, 1)} of likely votes</em></div>
          </div>
          <p>Polling uncertainty: ${pct(pollMoe(c), 1)}. Election night adds random error, turnout effects, rival pressure, fatigue, debate results, endorsements, and late events.</p>
          <h3>Top Swing Groups</h3>
          ${persuadable.map(({ group, score }) => `<p class="cr-mini-note"><strong>${html(group.name)}</strong> support ${pct(group.support, 1)} · turnout ${pct(group.turnout, 0)} · swing value ${Math.round(score)}</p>`).join("")}
        </article>
        <aside class="cr-panel">
          <h2>Regional Vote Estimate</h2>
          ${c.regions.map((region) => {
            const votes = Math.round(region.population * effectiveTurnout(region, c) / 100);
            return meter(`${region.name} (${votes.toLocaleString()} likely votes)`, region.support, 100);
          }).join("")}
        </aside>
      </section>
    `;
  }

  function topSwingGroups(limit = 3) {
    return Object.values(state.campaign.groups).map((group) => {
      const closeness = 100 - Math.abs(group.support - 50) * 2;
      const score = Math.max(0, closeness) * (group.size || 1) * (group.persuasion || 1) * (group.turnout / 65);
      return { group, score };
    }).sort((a, b) => b.score - a.score).slice(0, limit);
  }

  function renderPrimaryPlaceholder() {
    if (state.campaign.mapScope === "national") {
      return `<section class="cr-panel"><h2>Primary and Convention</h2><p>National scenarios can use delegate contests and convention deals. This scenario is ready for that data when a presidential scenario is added.</p></section>`;
    }
    return `<section class="cr-panel"><h2>Not Used In This Scenario</h2><p>${html(getScenario(state.scenarioId).office)} is not a presidential race, so national nomination-calendar mechanics are hidden.</p></section>`;
  }

  function renderCandidateFile() {
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Candidate File</h2>
          <p>${html(state.candidate.name)} · age ${state.candidate.age} · ${html(party().name)} · ${html(getScenario(state.scenarioId).name)}.</p>
          ${Object.entries(state.candidate.stats).map(([key, value]) => meter(labelize(key), value, 100)).join("")}
          <h3>Platform</h3>
          ${state.candidate.priorities.map(renderPrioritySummary).join("")}
        </article>
        <article class="cr-panel">
          <h2>Named Actors</h2>
          <p>The game now uses visible actors instead of a fake huge political ecosystem. These people have goals, asks, memories, and weekly moves.</p>
          <div class="cr-ai-roster">${state.campaign.actors.map(renderActorMini).join("")}</div>
        </article>
        <article class="cr-panel wide">
          <h2>Campaign Log</h2>
          <div class="cr-log">${state.log.slice(0, 30).map((entry) => `<p><strong>${html(entry.type)}</strong> ${html(entry.text)}</p>`).join("")}</div>
        </article>
      </section>
    `;
  }

  function renderPrioritySummary(priority) {
    const found = stanceById(priority.stanceId);
    if (!found) return "";
    return `<p class="cr-mini-note"><strong>${html(found.issue.name)}</strong><br>${html(found.stance.name)}</p>`;
  }

  function renderActorMini(actor) {
    return `<div><strong>${html(actor.name)}</strong><span>${html(actor.role)} · ${html(actor.ideology || "pragmatic")}</span><em>relationship ${Math.round(actor.relationship || 50)} · power ${Math.round(actor.power || 50)} · ask: ${html(actor.ask || "none")}</em></div>`;
  }

  function buildActors(campaign, scenario) {
    const opponent = campaign.opponent;
    const endorsers = (DATA.endorsements || []).slice(0, 3).map((endorsement) => ({
      id: `endorser-${endorsement.id}`,
      name: endorsement.name,
      role: "Endorser",
      ideology: endorsement.requirements?.issue || endorsement.requirements?.group || "civic",
      homeRegion: campaign.regions[0]?.id,
      relationship: 48,
      power: 58,
      goal: "Secure policy commitment before endorsing.",
      ask: endorsementProgressSafe(campaign, endorsement),
      memory: [],
      nextMove: "Evaluate endorsement request."
    }));
    const officials = campaign.regions.slice(0, 5).map((region, index) => ({
      id: `official-${region.id}`,
      name: ["Rosa Bell", "Malik Ortiz", "Ellen Price", "Jon Kline", "Beatrice Snow"][index] || `Council Member ${index + 1}`,
      role: "Local official",
      ideology: index % 2 ? "moderate" : "local services",
      homeRegion: region.id,
      relationship: 46 + index * 3,
      power: 42 + index * 4,
      goal: `Protect ${region.name}'s concerns.`,
      ask: region.concerns?.[0] || "local attention",
      memory: [],
      nextMove: "Wait for a region visit."
    }));
    return [
      {
        id: `opponent-${opponent.id}`,
        name: opponent.name,
        role: "Opponent",
        ideology: opponent.ideology,
        homeRegion: opponent.homeRegion,
        relationship: 18,
        power: 72,
        goal: "Win the race and define the player as risky.",
        ask: "public debate",
        memory: [],
        nextMove: "Rival turn"
      },
      ...endorsers,
      ...officials,
      { id: "party-chair", name: "Elena Merritt", role: scenario.electionStructure === "nonpartisanGeneral" ? "Local civic chair" : "Party chair", ideology: "institutional", homeRegion: campaign.regions[1]?.id, relationship: 52, power: 64, goal: "Avoid a disastrous nominee.", ask: "discipline and turnout", memory: [], nextMove: "Watch weekly movement" },
      { id: "press", name: "Capital Heights Gazette", role: "Press outlet", ideology: "watchdog", homeRegion: "capitalHeights", relationship: 45, power: 68, goal: "Find the clearest public-interest story.", ask: "specific numbers", memory: [], nextMove: "Interview request" },
      { id: "donor", name: "Main Street Donor Circle", role: "Donor group", ideology: "business-friendly", homeRegion: "pineSuburbs", relationship: 46, power: 55, goal: "Keep taxes and regulations predictable.", ask: "budget reassurance", memory: [], nextMove: "Fundraiser invitation" }
    ];
  }

  function endorsementProgressSafe(campaign, endorsement) {
    const req = endorsement.requirements || {};
    if (req.group) return `${campaign.groups[req.group]?.name || req.group} ${pct(req.support || 50, 0)}`;
    if (req.trust) return `trust ${pct(req.trust, 0)}`;
    if (req.issue) return `${req.issue} priority`;
    return "relationship";
  }

  function makeOpponent(scenario) {
    const opponent = byId(DATA.opponents || [], scenario.defaultOpponent) || DATA.opponents?.[0] || {
      id: "miraVance",
      name: "Mira Vance",
      label: "Steady incumbent",
      ideology: "moderate",
      homeRegion: "pineSuburbs",
      strengths: ["fundraising", "suburban trust"],
      weaknesses: ["cautious"],
      stats: { debate: 65, attack: 45, field: 55, fundraising: 70 },
      basePressure: { regions: { pineSuburbs: 1 }, groups: { suburbanModerates: 1 } }
    };
    return JSON.parse(JSON.stringify(opponent));
  }

  function rivalTurn() {
    const c = state.campaign;
    const opponent = c.opponent;
    const home = c.regions.find((region) => region.id === opponent.homeRegion) || c.regions.find((region) => Math.abs(region.support - 50) < 5) || c.regions[0];
    const moves = [
      {
        text: `${opponent.name} held a parent safety forum in ${home.name}.`,
        counter: "Host a town hall, visit a school, or answer safety questions with a specific plan.",
        effects: { regions: { [home.id]: -0.8 * difficulty().opposition }, groups: { parents: -0.5 * difficulty().opposition, suburbanModerates: -0.4 * difficulty().opposition } }
      },
      {
        text: `${opponent.name} used a local fundraiser to question your budget math.`,
        counter: "Publish an op-ed, run a budget-first message, or seek an ethics/business endorsement.",
        effects: { groups: { smallBusiness: -0.8 * difficulty().opposition, suburbanModerates: -0.5 * difficulty().opposition }, media: 1 }
      },
      {
        text: `${opponent.name}'s field team knocked doors in ${home.name}.`,
        counter: "Canvass, phonebank, or open a field office in the same region.",
        effects: { regions: { [home.id]: -1 * difficulty().opposition } }
      },
      {
        text: `${opponent.name} challenged you to explain one campaign promise in plain numbers.`,
        counter: "Debate prep, policy speech, or editorial board answers can blunt the attack.",
        effects: { trust: -0.6 * difficulty().opposition, media: 1 }
      }
    ];
    const move = pick(moves);
    applyEffectsToCampaign(c, move.effects, { source: "Rival turn", quiet: false });
    c.rival.lastMove = move;
    addLog(`Rival turn: ${move.text}`, "rival");
  }

  function canAdvanceWeek() {
    const c = state.campaign;
    if (c.currentEventId) return { ok: false, reason: "Answer or skip the weekly question before advancing." };
    const scheduledItems = Object.values(c.schedule || {}).filter((item) => item && typeof item === "object" && item.id);
    if (scheduledItems.length && !c.schedule.resolved) return { ok: false, reason: "Resolve the weekly schedule before advancing." };
    if (c.debate && c.week >= c.debate.scheduledWeek && !c.debate.completed && !c.debate.declined) {
      return { ok: false, reason: `Participate in or decline the scheduled week ${c.debate.scheduledWeek} debate before advancing.` };
    }
    if (c.focus?.awaitingChoice) return { ok: false, reason: "Finish the active agenda path decision before advancing." };
    return { ok: true, reason: "" };
  }

  function advanceWeek() {
    const c = state.campaign;
    const advance = canAdvanceWeek();
    if (!advance.ok) {
      c.lastMovement = {
        source: "Turn blocked",
        before: districtPoll(c),
        after: districtPoll(c),
        items: [advance.reason]
      };
      announce(advance.reason);
      render();
      return;
    }
    if (c.week >= c.maxWeeks) {
      runElection();
      return;
    }
    if (c.focus.activeId) advanceFocusStep();
    rivalTurn();
    c.week += 1;
    c.resources.time = normalizeResources(getScenario(state.scenarioId).startingResources || {}).time;
    c.resources.energy = Math.min(c.resources.maxEnergy, c.resources.energy + 2);
    c.resources.money += Math.round((4200 + state.career.network * 90 + c.resources.media * 55) * difficulty().money);
    c.resources.staff += c.resources.staff < 2 ? 1 : 0;
    c.resources.volunteers = Math.max(0, Math.round(c.resources.volunteers + 3 - difficulty().opposition));
    state.candidate.fatigue = clamp(state.candidate.fatigue - 9, 0, 100);
    c.schedule = { candidate: null, staff: null, volunteers: null, media: null, resolved: false, report: [] };
    c.weekStep = "briefing";
    c.regions.forEach((region) => {
      region.adSaturation = clamp(region.adSaturation - 4, 0, 100);
      region.directSupport = clamp(region.directSupport - 0.05 * difficulty().opposition, -30, 30);
    });
    if (!c.currentEventId) c.currentEventId = drawEligibleEvent(c);
    refreshAllRegionPolls(c);
    normalizeCampaign(c);
    addLog(`Week ${c.week} begins. Resources reset, the rival moved, and a scenario question is available.`, "calendar");
    save();
    render();
  }

  function runElection() {
    const c = state.campaign;
    refreshAllRegionPolls(c);
    const sharedLateSwing = (Math.random() * 2 - 1) * difficulty().pollError * 0.35;
    const regionResults = c.regions.map((region) => {
      const turnoutShock = (Math.random() * 2 - 1) * (region.turnoutError || 1.5);
      const turnout = clamp(effectiveTurnout(region, c) + turnoutShock, 18, 96);
      const likelyVotes = Math.round(region.population * turnout / 100);
      const regionalError = (Math.random() * 2 - 1) * (region.electionVolatility || 3);
      const lateMovement = region.lateMovement || 0;
      const fatiguePenalty = state.candidate.fatigue > 45 ? -1.2 : 0;
      const unresolvedPenalty = c.currentEventId ? -0.8 : 0;
      const debatePenalty = c.debate?.declined ? -0.8 : c.debate?.completed ? 0 : -0.5;
      const finalSupport = clamp(region.support + sharedLateSwing + regionalError + lateMovement + fatiguePenalty + unresolvedPenalty + debatePenalty, 5, 95);
      return {
        id: region.id,
        name: region.name,
        support: finalSupport,
        turnout,
        projectedSupport: region.support,
        swing: finalSupport - region.support,
        playerVotes: Math.round(likelyVotes * finalSupport / 100),
        opponentVotes: Math.round(likelyVotes * (100 - finalSupport) / 100)
      };
    });
    const playerVotes = regionResults.reduce((sum, item) => sum + item.playerVotes, 0);
    const opponentVotes = regionResults.reduce((sum, item) => sum + item.opponentVotes, 0);
    const totalVotes = playerVotes + opponentVotes;
    const playerShare = totalVotes ? playerVotes / totalVotes * 100 : 50;
    const opponentShare = 100 - playerShare;
    const won = playerVotes > opponentVotes;
    state.results = {
      won,
      playerShare,
      opponentShare,
      playerVotes,
      opponentVotes,
      margin: playerShare - opponentShare,
      sharedLateSwing,
      regions: regionResults,
      notes: buildElectionNotes(regionResults, won)
    };
    state.phase = "results";
    if (won) state.career.electionsWon += 1;
    else state.career.electionsLost += 1;
    addLog(`${won ? "Won" : "Lost"} ${getScenario(state.scenarioId).name} by ${Math.abs(state.results.margin).toFixed(1)} percentage points.`, "election");
    save();
    render();
  }

  function buildElectionNotes(regionResults, won) {
    const sorted = [...regionResults].sort((a, b) => b.support - a.support);
    const groups = topSwingGroups(6).map((item) => item.group);
    const notes = [
      `${sorted[0]?.name} was your strongest region at ${pct(sorted[0]?.support || 0, 1)}.`,
      `${sorted.at(-1)?.name} was your weakest region at ${pct(sorted.at(-1)?.support || 0, 1)}.`,
      `Best persuadable opportunities: ${groups.slice(0, 3).map((group) => group.name).join(", ")}.`,
      `Turnout operation ${state.campaign.regions.some((region) => region.ground > 5) ? "created visible regional ground strength" : "was thin; more canvassing, field offices, or registration could have helped"}.`,
      state.campaign.debate.completed ? `The debate clip: ${state.campaign.debate.clip}` : "Skipping the debate left potential persuasion on the table.",
      won ? "Victory came from a coalition of regional support and voter-group turnout, not a single popularity score." : "The campaign needed either broader persuasion, more turnout, or a sharper answer to the opponent's weekly pressure."
    ];
    return notes;
  }

  function renderResults() {
    const r = state.results;
    root.innerHTML = `
      <section class="cr-game">
        ${renderRibbon()}
        <div class="cr-title-row">
          <div>
            <p class="cr-eyebrow">Election Night</p>
            <h1>${r.won ? "Victory" : "Defeat"}</h1>
            <p>${html(state.candidate.name)} ${r.won ? "won" : "lost"} by ${Math.abs(r.margin).toFixed(1)} percentage points.</p>
          </div>
          ${renderCareerChip()}
        </div>
        <section class="cr-results">
          <div class="cr-result-board ${r.won ? "won" : "lost"}">
            <div><span>${html(state.candidate.name)}</span><strong>${pct(r.playerShare, 1)}</strong><em>${r.playerVotes.toLocaleString()} votes</em></div>
            <div><span>${html(state.campaign.opponent.name)}</span><strong>${pct(r.opponentShare, 1)}</strong><em>${r.opponentVotes.toLocaleString()} votes</em></div>
          </div>
          <div class="cr-grid two">
            <article class="cr-panel">
              <h2>Post-Election Analysis</h2>
              ${r.notes.map((note) => `<p>${html(note)}</p>`).join("")}
              <h3>Region Results</h3>
              ${r.regions.map((region) => meter(region.name, region.support, 100)).join("")}
            </article>
            <article class="cr-panel">
              <h2>Next Step</h2>
              <p>${r.won ? "Winning opens governing. Your choices as an officeholder will shape the next election and your career ladder." : "A loss does not end the career. You can rebuild with a new scenario or start over."}</p>
              <div class="cr-action-stack">
                <button class="cr-btn primary" data-begin-governing ${r.won ? "" : "disabled"} type="button">Begin Governing</button>
                <button class="cr-btn secondary" data-run-again type="button">Run Again</button>
              </div>
            </article>
          </div>
        </section>
      </section>
    `;
    bindGlobal();
    document.querySelector("[data-begin-governing]")?.addEventListener("click", beginGoverning);
    document.querySelector("[data-run-again]")?.addEventListener("click", () => launchNextCampaign("reelection"));
  }

  function beginGoverning() {
    const office = currentOffice();
    state.phase = "governing";
    state.govView = "desk";
    state.career.officesHeld = [...new Set([...state.career.officesHeld, office.name])];
    const budgetBase = Math.round(105 * (office.governingPower || 0.7) / difficulty().budget);
    const fiscal = makeFiscalModel(budgetBase, officeBudgetLines(office.id));
    state.governing = {
      month: 1,
      termMonths: office.tier >= 4 ? 24 : 18,
      approval: clamp(state.results.playerShare + 6, 25, 82),
      trust: state.campaign.resources.trust,
      budget: 0,
      deficit: 0,
      capital: Math.round(state.campaign.resources.capital + 8),
      metrics: makeGoverningMetrics(office.id),
      fiscal,
      budgetLines: fiscal.allocations,
      monthlyActions: { administration: false, outreach: false },
      staff: {},
      staffModifiers: {},
      factions: makeFactions(),
      bills: makePolicyBills(),
      oppositionBill: makeOppositionOffer(),
      log: ["Election night is over. Every campaign promise now has a budget, a faction count, and a reelection consequence."]
    };
    recalculateFiscal(state.governing);
    addLog("Entered governing mode. The administration, budget, legislature, and reelection record are now active.", "governing");
    save();
    render();
  }

  function makeGoverningMetrics(officeId) {
    if (officeId === "schoolBoard") {
      return {
        studentAchievement: 50,
        attendance: 50,
        teacherRetention: 50,
        classSize: 50,
        facilityCondition: 50,
        safety: 50,
        parentTrust: 50,
        staffMorale: 50,
        transportation: 50,
        education: 50
      };
    }
    return { education: 50, housing: 50, safety: 50, economy: 50, services: 50, administration: 50, healthcare: 50, environment: 50 };
  }

  function officeBudgetLines(officeId) {
    if (officeId === "schoolBoard") {
      return { instruction: 34, teacherPay: 18, studentSupport: 12, transportation: 9, facilities: 10, safety: 7, administration: 6, reserves: 4 };
    }
    return { education: 28, housing: 16, safety: 18, services: 18, administration: 10, reserves: 10 };
  }

  function makeFiscalModel(revenue = 80, allocations = {}) {
    const cleanAllocations = { ...allocations };
    const discretionarySpending = Object.entries(cleanAllocations).filter(([key]) => key !== "reserves").reduce((sum, [, value]) => sum + Number(value || 0), 0);
    const reserves = Number(cleanAllocations.reserves || 0);
    const model = {
      revenue: Math.round(revenue),
      mandatorySpending: Math.round(revenue * 0.42),
      discretionarySpending,
      reserves,
      debt: 0,
      debtService: 0,
      projectedBalance: 0,
      allocations: cleanAllocations
    };
    return recalculateFiscalModel(model);
  }

  function recalculateFiscalModel(fiscal) {
    fiscal.discretionarySpending = Object.entries(fiscal.allocations || {}).filter(([key]) => key !== "reserves").reduce((sum, [, value]) => sum + Number(value || 0), 0);
    fiscal.reserves = Number(fiscal.allocations?.reserves || fiscal.reserves || 0);
    fiscal.debtService = Math.round((fiscal.debt || 0) * 0.08);
    fiscal.projectedBalance = Math.round((fiscal.revenue || 0) - (fiscal.mandatorySpending || 0) - fiscal.discretionarySpending - fiscal.debtService);
    return fiscal;
  }

  function recalculateFiscal(governing = state?.governing) {
    if (!governing) return null;
    governing.fiscal = governing.fiscal || makeFiscalModel(governing.budget || 80, governing.budgetLines);
    recalculateFiscalModel(governing.fiscal);
    governing.budgetLines = governing.fiscal.allocations;
    governing.budget = governing.fiscal.projectedBalance;
    governing.deficit = governing.fiscal.debt || 0;
    return governing.fiscal;
  }

  function makeFactions() {
    if (currentOffice().id === "schoolBoard") {
      return [
        { id: "parentCoalition", name: "Parent Coalition", seats: 3, support: 50, asks: ["studentSupport", "safety", "transportation"], expectations: [] },
        { id: "teacherAssociation", name: "Teacher Association", seats: 2, support: 55, asks: ["teacherPay", "classSize", "studentSupport"], expectations: [] },
        { id: "fiscalWatch", name: "Fiscal Watch Members", seats: 2, support: 43, asks: ["budget", "reserves", "administration"], expectations: [] },
        { id: "equityAdvocates", name: "Equity Advocates", seats: 1, support: 52, asks: ["instruction", "attendance", "studentSupport"], expectations: [] },
        { id: "safetyCommittee", name: "School Safety Committee", seats: 1, support: 48, asks: ["safety", "facilityCondition", "parentTrust"], expectations: [] },
        { id: "ruralFamilies", name: "Rural Families Bloc", seats: 1, support: 46, asks: ["transportation", "facilityCondition", "studentSupport"], expectations: [] }
      ];
    }
    const source = (DATA.factions || []).length ? DATA.factions : [
      { id: "progressiveBloc", name: "Progressive Caucus", seats: 5, support: 52, priorities: ["housing", "labor", "education"] },
      { id: "laborCaucus", name: "Labor Caucus", seats: 4, support: 54, priorities: ["labor", "education", "healthcare"] },
      { id: "moderateReformers", name: "Bipartisan Reform Caucus", seats: 6, support: 50, priorities: ["budget", "government", "education"] },
      { id: "businessConservatives", name: "Business Conservative Caucus", seats: 5, support: 38, priorities: ["taxes", "budget", "economicDevelopment"] },
      { id: "ruralCoalition", name: "Rural Coalition", seats: 4, support: 43, priorities: ["ruralDevelopment", "infrastructure", "healthcare"] },
      { id: "independents", name: "Independent Members", seats: 3, support: 48, priorities: ["budget", "publicSafety", "ethics"] }
    ];
    return source.map((item) => ({ id: item.id, name: item.name, seats: item.seats, support: item.support, asks: item.asks || item.priorities || [], expectations: [] }));
  }

  function makePolicyBills() {
    const schoolBills = [
      { id: "classSizePlan", area: "Instruction", title: "Class Size Reduction Plan", summary: "Hire aides and rebalance schedules in early grades.", cost: 8, capital: 2, effects: { studentAchievement: 4, classSize: 7, teacherRetention: 2, approval: 1 }, factions: { teacherAssociation: 8, parentCoalition: 4, fiscalWatch: -4 } },
      { id: "teacherRetention", area: "Teacher Pay", title: "Teacher Retention Compact", summary: "Use retention grants, mentoring, and planning time to slow teacher turnover.", cost: 7, capital: 2, effects: { teacherRetention: 8, staffMorale: 6, studentAchievement: 2, approval: 1 }, factions: { teacherAssociation: 10, fiscalWatch: -3 } },
      { id: "attendanceTeams", area: "Student Support", title: "Attendance and Family Outreach Teams", summary: "Create small teams that follow up quickly with families when students disappear from class.", cost: 5, capital: 2, effects: { attendance: 8, parentTrust: 3, studentAchievement: 2 }, factions: { parentCoalition: 6, equityAdvocates: 5, fiscalWatch: -2 } },
      { id: "facilityRepairs", area: "Facilities", title: "Deferred Maintenance Repair List", summary: "Publish and fund a ranked list of roof, HVAC, accessibility, and safety repairs.", cost: 9, capital: 3, effects: { facilityCondition: 9, safety: 3, parentTrust: 2, approval: 1 }, factions: { safetyCommittee: 7, ruralFamilies: 4, fiscalWatch: -5 } },
      { id: "busRouteAudit", area: "Transportation", title: "Bus Route Reliability Audit", summary: "Redesign late routes and publish monthly on-time data.", cost: 3, capital: 1, effects: { transportation: 8, attendance: 2, parentTrust: 1 }, factions: { ruralFamilies: 8, parentCoalition: 3, fiscalWatch: 1 } },
      { id: "schoolSafety", area: "Safety", title: "Safety, Counseling, and Response Plan", summary: "Pair response protocols with prevention, counseling, and transparent incident reports.", cost: 6, capital: 3, effects: { safety: 8, parentTrust: 3, staffMorale: 1, approval: 1 }, factions: { safetyCommittee: 9, parentCoalition: 5, equityAdvocates: 1 } },
      { id: "openMeetings", area: "Transparency", title: "Open Meetings and Budget Dashboard", summary: "Put agendas, contracts, budget line changes, and implementation updates in plain language.", cost: 2, capital: 2, effects: { parentTrust: 5, staffMorale: 1, approval: 1, trust: 3 }, factions: { fiscalWatch: 6, parentCoalition: 2 } }
    ];
    if (currentOffice().id === "schoolBoard") return schoolBills.map((bill) => normalizeBill({ ...bill, status: "floor" }));
    const policies = (DATA.governingPolicies || []).map((policy) => ({
      id: policy.id,
      area: policy.area,
      title: policy.name,
      summary: policy.text,
      cost: policy.cost,
      capital: policy.capital,
      effects: { ...(policy.metrics || {}), groups: policy.groups || {} },
      factions: policy.factions || {},
      status: "floor"
    }));
    return (policies.length ? policies : []).map((bill) => normalizeBill(bill));
  }

  function normalizeBill(bill, month = state?.governing?.month || 1) {
    bill.status = bill.status || "floor";
    bill.stage = bill.stage || bill.status;
    bill.cost = Number(bill.cost || 0);
    bill.capital = Number(bill.capital || 0);
    bill.draftCost = Number(bill.draftCost ?? Math.max(1, Math.ceil(bill.cost * 0.2)));
    bill.implementationCost = Number(bill.implementationCost ?? Math.max(0, bill.cost - bill.draftCost));
    bill.lockUntil = Number(bill.lockUntil || 0);
    bill.sponsors = Number(bill.sponsors || 0);
    bill.amended = Boolean(bill.amended);
    bill.voteRecord = bill.voteRecord || null;
    bill.draftingPaid = Boolean(bill.draftingPaid);
    bill.history = bill.history || [];
    return bill;
  }

  function makeOppositionOffer() {
    const dataOffer = pick(DATA.oppositionBills || []);
    if (dataOffer) {
      return {
        id: `${dataOffer.id}-${Date.now()}`,
        title: dataOffer.name,
        sponsor: dataOffer.sponsor,
        ask: dataOffer.text,
        choices: dataOffer.choices || [],
        status: "pending"
      };
    }
    return {
      id: `oppo-${Date.now()}`,
      title: "Board Fiscal Restraint Resolution",
      sponsor: "Fiscal Watch Members",
      ask: "The opposition proposes a spending cap in exchange for support on one student-support bill.",
      choices: [
        { label: "Accept the cap and claim discipline.", effects: { approval: 1, capital: -1, metrics: { education: -1 }, factions: { fiscalWatch: 5, teacherAssociation: -3 } } },
        { label: "Negotiate an exemption for classrooms.", effects: { approval: 1, capital: -2, metrics: { studentAchievement: 1 }, factions: { fiscalWatch: 2, teacherAssociation: 1 } } },
        { label: "Reject it publicly.", effects: { trust: 1, capital: -1, factions: { fiscalWatch: -4, teacherAssociation: 2 } } }
      ],
      status: "pending"
    };
  }

  function renderGoverning() {
    root.innerHTML = `
      <section class="cr-game">
        ${renderRibbon()}
        <div class="cr-title-row">
          <div>
            <p class="cr-eyebrow">Executive Dashboard</p>
            <h1>${html(state.candidate.name)} · ${html(currentOffice().name)}</h1>
            <p>Month ${state.governing.month} of ${state.governing.termMonths} · approval ${pct(state.governing.approval, 0)} · budget ${Math.round(state.governing.budget)} · political capital ${Math.round(state.governing.capital)}</p>
          </div>
          ${renderCareerChip()}
        </div>
        ${renderGoverningMetrics()}
        <div class="cr-tab-row">${GOVERNING_TABS.map(([id, label]) => `<button class="${state.govView === id ? "active" : ""}" data-gov-tab="${id}" type="button">${html(label)}</button>`).join("")}</div>
        ${renderGoverningTab()}
      </section>
    `;
    bindGlobal();
    bindGoverning();
  }

  function renderGoverningMetrics() {
    const g = state.governing;
    const school = currentOffice().id === "schoolBoard";
    const fiscal = recalculateFiscal(g);
    if (school) {
      return `
        <div class="cr-metric-grid governing">
          ${metric("Approval", pct(g.approval, 0), "Public support for your governing record. Affects reelection, protests, and board leverage.")}
          ${metric("Trust", pct(g.trust, 0), "Whether families, staff, and local press believe the board is honest and competent.")}
          ${metric("Balance", Math.round(fiscal.projectedBalance), "Projected fiscal room after revenue, mandatory costs, discretionary lines, and debt service.")}
          ${metric("Debt", Math.round(fiscal.debt), "Borrowed or overspent obligations that create future attacks.")}
          ${metric("Capital", Math.round(g.capital), "Political capital for deals, faction meetings, appointments, and difficult votes.")}
          ${metric("Achievement", Math.round(g.metrics.studentAchievement), "Student achievement trend.")}
          ${metric("Attendance", Math.round(g.metrics.attendance), "Daily attendance and family outreach strength.")}
          ${metric("Teachers", Math.round(g.metrics.teacherRetention), "Teacher retention and staffing stability.")}
          ${metric("Facilities", Math.round(g.metrics.facilityCondition), "Building condition, repairs, HVAC, accessibility, and maintenance.")}
          ${metric("Safety", Math.round(g.metrics.safety), "School safety confidence and response systems.")}
        </div>
      `;
    }
    return `
      <div class="cr-metric-grid governing">
        ${metric("Approval", pct(g.approval, 0), "Public support for your governing record. Affects reelection, protests, and legislative leverage.")}
        ${metric("Trust", pct(g.trust, 0), "Whether voters believe the administration is honest and competent.")}
        ${metric("Balance", Math.round(fiscal.projectedBalance), "Available fiscal room after revenue, spending, reserves, and debt service.")}
        ${metric("Debt", Math.round(fiscal.debt), "Overspending that creates future attacks and economic stress.")}
        ${metric("Capital", Math.round(g.capital), "Political capital for deals, faction meetings, appointments, and difficult votes.")}
        ${metric("Education", Math.round(g.metrics.education), "School outcomes and service quality.")}
        ${metric("Housing", Math.round(g.metrics.housing), "Housing affordability, supply, and renter pressure.")}
        ${metric("Safety", Math.round(g.metrics.safety), "Public safety confidence, response, prevention, and accountability.")}
      </div>
    `;
  }

  function renderGoverningTab() {
    if (state.govView === "staff") return renderAdministration();
    if (state.govView === "policy") return renderPolicyEngine();
    if (state.govView === "legislature") return renderLegislature();
    if (state.govView === "budget") return renderBudget();
    if (state.govView === "career") return renderCareer();
    return renderAdministrationDesk();
  }

  function renderAdministrationDesk() {
    const g = state.governing;
    return `
      <section class="cr-grid two">
        <article class="cr-panel cr-admin-desk">
          <p class="cr-eyebrow">Administration Meeting</p>
          <h2>Monthly Briefing</h2>
          <div class="cr-briefing-grid">
            <div><strong>Chief of Staff</strong><p>Your calendar can carry one major priority this month. Trying to do everything drains capital.</p></div>
            <div><strong>Policy Director</strong><p>The next bill is ready, but the budget and vote count both matter.</p></div>
            <div><strong>Communications Director</strong><p>Voters need a clear reason why the tradeoff is worth it.</p></div>
            <div><strong>Legislative Liaison</strong><p>The Reform Caucus and Rural Coalition can decide close votes. The opposition has its own bill.</p></div>
          </div>
          <div class="cr-answer-list">
            <button class="cr-answer" data-admin-action="focus" ${g.monthlyActions?.administration ? "disabled" : ""} type="button"><span>Calendar</span><strong>Protect one priority.</strong><em>+2 capital · +1 trust</em></button>
            <button class="cr-answer" data-admin-action="listen" ${g.monthlyActions?.administration ? "disabled" : ""} type="button"><span>Public</span><strong>Hold a listening month.</strong><em>+2 trust · -1 approval</em></button>
            <button class="cr-answer" data-admin-action="push" ${g.monthlyActions?.administration ? "disabled" : ""} type="button"><span>Pressure</span><strong>Push several promises at once.</strong><em>+2 approval · debt risk · -2 capital</em></button>
          </div>
          ${g.monthlyActions?.administration ? `<p class="cr-disabled-reason">Administration choice completed for month ${g.month}.</p>` : ""}
          <button class="cr-btn primary full" data-advance-month type="button">${g.month >= g.termMonths ? "Term Review" : "Advance Month"}</button>
        </article>
        <aside class="cr-panel">
          <h2>Governing Log</h2>
          <div class="cr-log">${g.log.slice(0, 18).map((item) => `<p>${html(item)}</p>`).join("")}</div>
        </aside>
      </section>
    `;
  }

  function renderAdministration() {
    const byRole = groupBy(DATA.staff || [], (staff) => staff.role || "Advisor");
    return `
      <section class="cr-panel">
        <h2>Administration</h2>
        <p>Each position has multiple options. Competence, loyalty, ideology, and traits shape governing outcomes; no team is perfect.</p>
        ${Object.entries(byRole).slice(0, 10).map(([role, staffers]) => `
          <section class="cr-staff-role">
            <h3>${html(role)}</h3>
            <div class="cr-card-grid">${staffers.slice(0, 3).map(renderStaffCard).join("")}</div>
          </section>
        `).join("")}
      </section>
    `;
  }

  function renderStaffCard(staffer) {
    const appointed = state.governing.staff[staffer.role] === staffer.id;
    const replacing = state.governing.staff[staffer.role] && !appointed;
    const canReplace = state.governing.capital >= (replacing ? 1 : 0);
    return `
      <article class="cr-action-card">
        <span>${html(staffer.role)}</span>
        <h4>${html(staffer.name)}</h4>
        <p>${html(staffer.trait)} · ${html(staffer.ideology)}</p>
        <div class="cr-action-preview">
          <p><strong>Competence:</strong> ${staffer.competence}</p>
          <p><strong>Loyalty:</strong> ${staffer.loyalty}</p>
          <p><strong>Effects:</strong> ${html(effectText({ effects: staffer.effects || {} }))}</p>
        </div>
        <button class="cr-btn ${appointed || !canReplace ? "subtle" : "primary"} full" data-appoint-staff="${html(staffer.id)}" ${appointed || !canReplace ? "disabled" : ""} type="button">${appointed ? "Appointed" : replacing ? "Replace · 1 capital" : "Appoint"}</button>
        ${!appointed && !canReplace ? `<p class="cr-disabled-reason">Replacing staff costs 1 political capital.</p>` : ""}
      </article>
    `;
  }

  function appointStaff(id) {
    const staffer = byId(DATA.staff || [], id);
    if (!staffer) return;
    const previous = state.governing.staff[staffer.role];
    if (previous && previous !== staffer.id && state.governing.capital < 1) return;
    if (previous && previous !== staffer.id) {
      state.governing.capital -= 1;
      state.governing.trust = clamp(state.governing.trust - 0.5, 0, 100);
    }
    state.governing.staff[staffer.role] = staffer.id;
    state.governing.staffModifiers = calculateStaffModifiers(state.governing);
    state.governing.log.unshift(`${staffer.name} ${previous ? "replaced the previous appointee" : "was appointed"} as ${staffer.role}. Team modifiers recalculated.`);
    save();
    render();
  }

  function calculateStaffModifiers(governing = state?.governing) {
    const modifiers = { trust: 0, capital: 0, budget: 0, legislation: 0, media: 0, policy: 0, administration: 0 };
    if (!governing) return modifiers;
    Object.values(governing.staff || {}).forEach((staffId) => {
      const staffer = byId(DATA.staff || [], staffId);
      Object.entries(staffer?.effects || {}).forEach(([key, value]) => {
        if (modifiers[key] == null) modifiers[key] = 0;
        modifiers[key] += Number(value || 0);
      });
      if (staffer?.role?.includes("Legislative")) modifiers.legislation += (staffer.competence - 60) / 20;
      if (staffer?.role?.includes("Communications")) modifiers.media += (staffer.competence - 60) / 22;
      if (staffer?.role?.includes("Policy")) modifiers.policy += (staffer.competence - 60) / 22;
      if (staffer?.role?.includes("Chief")) modifiers.administration += (staffer.competence - 60) / 24;
    });
    return modifiers;
  }

  function renderPolicyEngine() {
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Policy Cards</h2>
          <p>Policies affect budget, approval, metrics, voter groups, and legislative factions. Opposition pressure can force deals or unfavorable votes.</p>
          <div class="cr-card-grid">${state.governing.bills.map(renderBillCard).join("")}</div>
        </article>
        <aside class="cr-panel">
          <h2>Opposition Agenda</h2>
          ${renderOppositionOffer()}
        </aside>
      </section>
    `;
  }

  function renderBillCard(bill) {
    const votes = projectedVotes(bill);
    const disabled = billDisabledReason(bill, votes);
    return `
      <article class="cr-action-card ${bill.status === "passed" ? "passed" : ""}">
        <span>${html(bill.area)}</span>
        <h4>${html(bill.title)}</h4>
        <p>${html(bill.summary)}</p>
        <div class="cr-action-preview">
          <p><strong>Cost:</strong> ${bill.cost}</p>
          <p><strong>Drafting cost:</strong> ${bill.draftCost} now; ${bill.implementationCost} if enacted</p>
          <p><strong>Capital:</strong> ${bill.capital}</p>
          <p><strong>Vote count:</strong> ${votes.yes} yes · ${votes.no} no · ${votes.abstain} abstain · ${votes.absent} absent · ${votes.required} needed</p>
          <p><strong>Status:</strong> ${html(labelize(bill.status))}${bill.lockUntil > state.governing.month ? ` · locked until month ${bill.lockUntil}` : ""}</p>
        </div>
        <button class="cr-btn primary full" data-pass-bill="${html(bill.id)}" ${disabled ? "disabled" : ""} type="button">${bill.status === "passed" ? "Passed" : bill.status === "failed" ? "Reconsider Bill" : votes.yes < votes.required ? "Force Floor Vote" : "Bring to Floor"}</button>
        ${!disabled && votes.yes < votes.required ? `<p class="cr-disabled-reason warn">Warning: projected to fail unless the whip count changes.</p>` : ""}
        ${bill.status === "failed" ? `<button class="cr-btn subtle full" data-amend-bill="${html(bill.id)}" ${state.governing.capital < 1 ? "disabled" : ""} type="button">Amend / Find Sponsors · 1 capital</button>` : ""}
        ${disabled ? `<p class="cr-disabled-reason">${html(disabled)}</p>` : ""}
        ${bill.voteRecord ? `<p class="cr-mini-note"><strong>Last vote:</strong> ${bill.voteRecord.yes}-${bill.voteRecord.no}, ${bill.voteRecord.abstain} abstain, ${bill.voteRecord.absent} absent.</p>` : ""}
      </article>
    `;
  }

  function renderOppositionOffer() {
    const bill = state.governing.oppositionBill;
    if (!bill || bill.status !== "pending") return "<p>No active opposition bill this month.</p>";
    return `
      <div class="cr-result-note gaffe">
        <strong>${html(bill.title)}</strong>
        <p>${html(bill.sponsor ? `${bill.sponsor}: ${bill.ask}` : bill.ask)}</p>
      </div>
      <div class="cr-answer-list">
        ${(bill.choices || []).map((choice, index) => `<button class="cr-answer" data-oppo-deal="${index}" type="button"><span>Opposition Choice</span><strong>${html(choice.label)}</strong><em>${html(effectText({ effects: choice.effects || {} }))}</em></button>`).join("")}
      </div>
    `;
  }

  function projectedVotes(bill) {
    const chamberSize = state.governing.factions.reduce((sum, faction) => sum + faction.seats, 0);
    const required = Math.floor(chamberSize / 2) + 1;
    let yes = 0;
    let no = 0;
    let abstain = 0;
    let absent = 0;
    state.governing.factions.forEach((faction) => {
      let support = faction.support + state.governing.capital * 0.15 - bill.cost * 0.32 + (state.governing.staffModifiers?.legislation || 0);
      if ((faction.asks || []).some((ask) => billMatchesAsk(bill, ask))) support += 12;
      if (bill.factions?.[faction.id]) support += bill.factions[faction.id] * 2.2;
      if (bill.amended) support += 4;
      if (bill.sponsors) support += bill.sponsors;
      if ((faction.expectations || []).length) support -= 3;
      const missing = support < 38 ? Math.min(faction.seats, Math.round(faction.seats * 0.2)) : 0;
      absent += missing;
      const votingSeats = faction.seats - missing;
      if (support >= 58) yes += votingSeats;
      else if (support >= 47) {
        const half = Math.floor(votingSeats / 2);
        yes += half;
        abstain += votingSeats - half;
      } else {
        no += votingSeats;
      }
    });
    return { yes, no, abstain, absent, required, passed: yes >= required, chamberSize };
  }

  function billMatchesAsk(bill, ask) {
    const haystack = `${bill.area} ${bill.title} ${bill.summary}`.toLowerCase();
    return haystack.includes(String(ask).toLowerCase()) || String(ask).toLowerCase().includes(String(bill.area || "").toLowerCase());
  }

  function billDisabledReason(bill, votes = projectedVotes(bill)) {
    if (bill.status === "passed" || bill.status === "implemented") return "This bill already passed.";
    if (bill.status === "failed" && !bill.amended) {
      if (bill.lockUntil > state.governing.month) return `Failed bills are locked until month ${bill.lockUntil}; amend and find sponsors to reopen it sooner.`;
      return "Failed bills require an amendment or new sponsors before reconsideration.";
    }
    if (state.governing.capital < bill.capital) return `Need ${bill.capital} political capital.`;
    const fiscal = recalculateFiscal(state.governing);
    const upfront = bill.draftingPaid ? 0 : bill.draftCost;
    if (fiscal.projectedBalance < upfront) return `Need ${upfront} budget room for drafting.`;
    return "";
  }

  function passBill(id) {
    const bill = byId(state.governing.bills, id);
    if (!bill || bill.status === "passed") return;
    normalizeBill(bill);
    const votes = projectedVotes(bill);
    const disabled = billDisabledReason(bill, votes);
    if (disabled) {
      announce(disabled);
      return;
    }
    const upfront = bill.draftingPaid ? 0 : bill.draftCost;
    spendFiscal(upfront);
    bill.draftingPaid = true;
    state.governing.capital -= bill.capital;
    bill.voteRecord = { ...votes, month: state.governing.month };
    if (votes.passed) {
      spendFiscal(bill.implementationCost);
      bill.status = "passed";
      bill.stage = "implemented";
      applyGoverningEffects(bill.effects || {});
      Object.entries(bill.factions || {}).forEach(([id, value]) => {
        const target = faction(id);
        if (target) target.support = clamp(target.support + Number(value || 0), 0, 100);
      });
      state.governing.log.unshift(`${bill.title} passed ${votes.yes}-${votes.no}, with ${votes.abstain} abstentions and ${votes.absent} absent.`);
      addLog(`${bill.title} passed.`, "policy");
    } else {
      bill.status = "failed";
      bill.lockUntil = state.governing.month + 2;
      bill.amended = false;
      state.governing.approval = clamp(state.governing.approval - 3, 0, 100);
      state.governing.log.unshift(`${bill.title} failed ${votes.yes}-${votes.no}. Only the drafting cost was spent; reconsideration is locked until month ${bill.lockUntil} unless amended.`);
    }
    recalculateFiscal(state.governing);
    save();
    render();
  }

  function spendFiscal(amount) {
    const fiscal = recalculateFiscal(state.governing);
    const cost = Number(amount || 0);
    if (cost <= 0) return;
    fiscal.projectedBalance -= cost;
    if (fiscal.projectedBalance < 0) {
      fiscal.debt += Math.abs(fiscal.projectedBalance);
      fiscal.projectedBalance = 0;
      state.governing.approval = clamp(state.governing.approval - 1, 0, 100);
    }
    state.governing.budget = fiscal.projectedBalance;
    state.governing.deficit = fiscal.debt;
  }

  function amendBill(id) {
    const bill = byId(state.governing.bills, id);
    if (!bill || state.governing.capital < 1) return;
    state.governing.capital -= 1;
    bill.amended = true;
    bill.sponsors = (bill.sponsors || 0) + 3;
    bill.lockUntil = Math.min(bill.lockUntil || 0, state.governing.month);
    bill.history.push(`Month ${state.governing.month}: amended and sponsor count improved.`);
    state.governing.log.unshift(`${bill.title} was amended after talks with swing members. Projected votes improved.`);
    save();
    render();
  }

  function applyGoverningEffects(effects = {}) {
    const g = state.governing;
    if (typeof effects.approval === "number") g.approval = clamp(g.approval + effects.approval, 0, 100);
    if (typeof effects.trust === "number") g.trust = clamp(g.trust + effects.trust, 0, 100);
    if (typeof effects.capital === "number") g.capital = Math.max(0, g.capital + effects.capital);
    const metrics = effects.metrics || effects;
    Object.entries(metrics || {}).forEach(([key, value]) => {
      if (key === "groups" || key === "factions") return;
      if (!effects.metrics && ["approval", "trust", "capital"].includes(key)) return;
      if (key === "approval") g.approval = clamp(g.approval + Number(value || 0), 0, 100);
      else if (key === "trust") g.trust = clamp(g.trust + Number(value || 0), 0, 100);
      else if (key === "capital") g.capital = Math.max(0, g.capital + Number(value || 0));
      else if (key === "budget") spendFiscal(Math.abs(Math.min(0, Number(value || 0))));
      else if (g.metrics[key] != null) g.metrics[key] = clamp(g.metrics[key] + Number(value || 0), 0, 100);
    });
  }

  function handleOppositionDeal(type) {
    const g = state.governing;
    const bill = g.oppositionBill;
    const choice = bill?.choices?.[Number(type)];
    if (!choice) return;
    applyGoverningEffects(choice.effects || {});
    Object.entries(choice.effects?.factions || {}).forEach(([id, value]) => {
      const target = faction(id);
      if (target) target.support = clamp(target.support + Number(value || 0), 0, 100);
    });
    Object.entries(choice.effects?.groups || {}).forEach(([groupId, value]) => {
      const group = state.campaign?.groups?.[groupId];
      if (group) group.support = clamp(group.support + Number(value || 0), 4, 96);
    });
    g.log.unshift(`Opposition bill response: ${choice.label}`);
    g.oppositionBill.status = "resolved";
    recalculateFiscal(g);
    save();
    render();
  }

  function faction(id) {
    return state.governing.factions.find((item) => item.id === id) || null;
  }

  function renderLegislature() {
    return `
      <section class="cr-panel">
        <h2>Legislature</h2>
        <p>Factions provide votes when priorities, ideology, relationship, and your public trust line up. Political capital helps, but a neglected faction will not stay friendly forever.</p>
        <div class="cr-card-grid">${state.governing.factions.map((faction) => `
          <article class="cr-action-card">
            <span>${faction.seats} seats</span>
            <h4>${html(faction.name)}</h4>
            ${meter("Support", faction.support, 100)}
            <div class="cr-chip-row">${faction.asks.map((ask) => `<span>${html(ask)}</span>`).join("")}</div>
            ${(faction.expectations || []).length ? `<p class="cr-mini-note"><strong>Expectation:</strong> ${html(faction.expectations[0])}</p>` : ""}
            <button class="cr-btn subtle full" data-meet-faction="${html(faction.id)}" ${state.governing.capital < 1 || state.governing.monthlyActions?.outreach ? "disabled" : ""} type="button">Meet Leader · 1 capital · monthly outreach</button>
            ${state.governing.monthlyActions?.outreach ? `<p class="cr-disabled-reason">Faction outreach already used this month.</p>` : ""}
          </article>
        `).join("")}</div>
      </section>
    `;
  }

  function meetFaction(id) {
    if (state.governing.capital < 1 || state.governing.monthlyActions?.outreach) return;
    const target = faction(id);
    if (!target) return;
    state.governing.capital -= 1;
    target.support = clamp(target.support + 6, 0, 100);
    target.expectations = target.expectations || [];
    target.expectations.unshift(`Wants visible movement on ${target.asks?.[0] || "its priority"} by next month.`);
    target.expectations = target.expectations.slice(0, 2);
    state.governing.monthlyActions.outreach = true;
    state.governing.factions.forEach((other) => {
      if (other.id !== target.id && Math.random() < 0.25) other.support = clamp(other.support - 1, 0, 100);
    });
    state.governing.log.unshift(`Met with ${target.name}. Support improved, but they now expect movement on ${target.asks?.[0] || "their priority"}.`);
    save();
    render();
  }

  function renderBudget() {
    const g = state.governing;
    const fiscal = recalculateFiscal(g);
    return `
      <section class="cr-grid two">
        <article class="cr-panel cr-budget-panel">
          <h2>Budget Position</h2>
          <strong class="cr-budget-number">${Math.round(fiscal.projectedBalance)}</strong>
          <p>Projected balance · revenue ${Math.round(fiscal.revenue)} · mandatory ${Math.round(fiscal.mandatorySpending)} · discretionary ${Math.round(fiscal.discretionarySpending)} · debt ${Math.round(fiscal.debt)}</p>
          <p>Budget changes use applied deltas. Overspending creates debt; underspending can weaken services and brittle approval.</p>
          ${Object.entries(fiscal.allocations).map(([key, value]) => `
            <div class="cr-budget-line">
              <strong>${html(labelize(key))}</strong>
              <span>${value}</span>
              <button data-budget-adjust="${html(key)}:-2" type="button">-</button>
              <button data-budget-adjust="${html(key)}:2" ${fiscal.projectedBalance < 2 ? "disabled" : ""} type="button">+</button>
            </div>
          `).join("")}
        </article>
        <aside class="cr-panel">
          <h2>Budget Shape</h2>
          ${meter("Revenue", fiscal.revenue, Math.max(1, fiscal.revenue))}
          ${meter("Discretionary Spending", fiscal.discretionarySpending, Math.max(1, fiscal.revenue))}
          ${meter("Reserves", fiscal.reserves, 30)}
          ${meter("Fiscal Stress", Math.max(0, fiscal.debt + Math.max(0, -fiscal.projectedBalance)), 80)}
        </aside>
      </section>
    `;
  }

  function adjustBudget(key, delta) {
    const g = state.governing;
    const fiscal = recalculateFiscal(g);
    const previous = Number(fiscal.allocations[key] || 0);
    const next = clamp(previous + Number(delta), 0, 70);
    const appliedDelta = next - previous;
    if (appliedDelta > 0 && fiscal.projectedBalance < appliedDelta) {
      announce("Not enough projected balance for that budget increase.");
      return;
    }
    fiscal.allocations[key] = next;
    recalculateFiscal(g);
    if (currentOffice().id === "schoolBoard") {
      const metricMap = {
        instruction: "studentAchievement",
        teacherPay: "teacherRetention",
        studentSupport: "attendance",
        transportation: "transportation",
        facilities: "facilityCondition",
        safety: "safety",
        administration: "parentTrust"
      };
      const metricKey = metricMap[key];
      if (metricKey && g.metrics[metricKey] != null) g.metrics[metricKey] = clamp(g.metrics[metricKey] + appliedDelta * 0.35, 0, 100);
    } else {
      if (key === "education") g.metrics.education = clamp(g.metrics.education + appliedDelta * 0.45, 0, 100);
      if (key === "housing") g.metrics.housing = clamp(g.metrics.housing + appliedDelta * 0.45, 0, 100);
      if (key === "safety") g.metrics.safety = clamp(g.metrics.safety + appliedDelta * 0.45, 0, 100);
    }
    g.log.unshift(`${labelize(key)} budget changed by ${signed(appliedDelta)}. Projected balance is now ${Math.round(g.fiscal.projectedBalance)}.`);
    save();
    render();
  }

  function renderCareer() {
    return `
      <section class="cr-grid two">
        <article class="cr-panel">
          <h2>Career</h2>
          <p>Offices held: ${state.career.officesHeld.map(html).join(", ") || "none yet"}.</p>
          <p>Elections won ${state.career.electionsWon}; lost ${state.career.electionsLost}; terms served ${state.career.termsServed}.</p>
          ${meter("Network", state.career.network, 100)}
          ${meter("PAC funds", Math.min(state.career.pacFunds / 10000, 100), 100)}
        </article>
        <article class="cr-panel">
          <h2>Future Ballot</h2>
          <p>At term review you can run for reelection, seek higher office, or accept an appointed government role if your record is strong enough.</p>
          <div class="cr-action-stack">
            <button data-career-preview="reelection" type="button">Review Reelection Math</button>
            <button data-career-preview="higher" type="button">Review Higher Office Path</button>
          </div>
        </article>
      </section>
    `;
  }

  function adminAction(type) {
    const g = state.governing;
    if (g.monthlyActions?.administration) return;
    if (type === "focus") {
      g.capital += 2;
      g.trust += 1;
      g.log.unshift("The administration protected one priority and kept the calendar honest.");
    }
    if (type === "listen") {
      g.trust += 2;
      g.approval -= 1;
      g.capital += 1;
      g.log.unshift("A listening month improved trust while impatient supporters wanted more action.");
    }
    if (type === "push") {
      g.approval += 2;
      g.capital -= 2;
      spendFiscal(4);
      g.log.unshift("Several promises moved at once. The headline was good; the internal cost was real.");
    }
    g.monthlyActions.administration = true;
    g.approval = clamp(g.approval, 0, 100);
    g.trust = clamp(g.trust, 0, 100);
    recalculateFiscal(g);
    save();
    render();
  }

  function advanceMonth() {
    const g = state.governing;
    if (g.month >= g.termMonths) {
      buildTermReview();
      return;
    }
    g.month += 1;
    g.monthlyActions = { administration: false, outreach: false };
    const fiscal = recalculateFiscal(g);
    const pressure = Math.max(0, Math.round((-fiscal.projectedBalance + fiscal.debtService) * 0.18 * difficulty().budget));
    if (pressure > 0) {
      fiscal.debt += pressure;
      g.approval -= 2;
    }
    g.capital += 2 + Math.max(0, Math.round((g.staffModifiers?.administration || 0) * 0.3));
    g.factions.forEach((fac) => {
      if ((fac.expectations || []).length) {
        fac.support = clamp(fac.support - 2, 0, 100);
        fac.expectations = fac.expectations.slice(0, 1);
      }
    });
    g.approval = clamp(g.approval + (g.trust - 55) * 0.02 - (fiscal.debt || 0) * 0.015, 5, 95);
    if (Math.random() < 0.38 * difficulty().opposition && (!g.oppositionBill || g.oppositionBill.status !== "pending")) {
      g.oppositionBill = makeOppositionOffer();
      g.log.unshift(`Opposition introduced ${g.oppositionBill.title}.`);
    }
    recalculateFiscal(g);
    g.log.unshift(`Month ${g.month} begins. Budget pressure, faction support, and reelection memory updated.`);
    save();
    render();
  }

  function buildTermReview() {
    const g = state.governing;
    const passed = g.bills.filter((bill) => bill.status === "passed").length;
    const legacy = passed >= 3 ? "Legislative Builder" : g.approval >= 65 ? "Coalition Executive" : g.deficit <= 5 ? "Fiscal Steward" : "Embattled Reformer";
    state.termReview = {
      legacy,
      approval: g.approval,
      budget: g.budget,
      deficit: g.deficit,
      passed,
      notes: g.log.slice(0, 8)
    };
    state.career.termsServed += 1;
    state.career.legacy = legacy;
    state.phase = "termReview";
    save();
    render();
  }

  function renderTermReview() {
    const review = state.termReview;
    const higherScenario = nextHigherScenario();
    root.innerHTML = `
      <section class="cr-game">
        ${renderRibbon()}
        <div class="cr-title-row">
          <div>
            <p class="cr-eyebrow">Term Review</p>
            <h1>${html(review.legacy)}</h1>
            <p>Approval ${pct(review.approval, 0)} · ${review.passed} laws passed · budget ${Math.round(review.budget)} · deficit ${Math.round(review.deficit)}</p>
          </div>
          ${renderCareerChip()}
        </div>
        <section class="cr-results">
          <div class="cr-result-board won">
            <div><span>Approval</span><strong>${pct(review.approval, 0)}</strong><em>public standing</em></div>
            <div><span>Budget</span><strong>${Math.round(review.budget)}</strong><em>deficit ${Math.round(review.deficit)}</em></div>
          </div>
          <div class="cr-grid two">
            <article class="cr-panel"><h2>Record</h2>${review.notes.map((note) => `<p>${html(note)}</p>`).join("")}</article>
            <article class="cr-panel">
              <h2>Career Choice</h2>
              <p>You can run for reelection, run for a higher office, or accept an appointed government role if you want to keep governing without a campaign.</p>
              <div class="cr-action-stack">
                <button data-career-next="reelection" type="button">Run for Reelection</button>
                <button data-career-next="higher" ${higherScenario ? "" : "disabled"} type="button">Run for Higher Office</button>
                <button data-career-next="appointment" type="button">Accept Government Appointment</button>
              </div>
              ${higherScenario ? `<p class="cr-mini-note">Available higher race: ${html(higherScenario.name)}.</p>` : `<p class="cr-disabled-reason">No higher-office scenario installed. Add one to <code>games/civic/data/scenarios.js</code> to continue climbing.</p>`}
            </article>
          </div>
        </section>
      </section>
    `;
    bindGlobal();
    document.querySelectorAll("[data-career-next]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.careerNext === "appointment") acceptAppointment();
        else launchNextCampaign(button.dataset.careerNext);
      });
    });
  }

  function launchNextCampaign(type) {
    const current = currentOffice();
    const nextOffice = type === "higher" ? nextOfficeFrom(current) : current;
    const nextScenario = type === "higher" ? nextHigherScenario() : scenarioForOffice(nextOffice.id);
    if (!nextScenario) {
      state.careerNotice = "No higher-office scenario installed.";
      announce(state.careerNotice);
      render();
      return;
    }
    state.phase = "briefing";
    state.view = "warRoom";
    state.scenarioId = nextScenario.id;
    state.candidate.officeId = nextScenario.officeId;
    state.candidate.officeName = nextScenario.office;
    state.candidate.age += type === "higher" ? 2 : 1;
    state.campaign = createCampaignFromScenario(nextScenario, state.candidate);
    state.results = null;
    state.governing = null;
    addLog(`${type === "higher" ? "Higher-office" : "Reelection"} campaign launched: ${nextScenario.name}.`, "career");
    save();
    render();
  }

  function nextOfficeFrom(office) {
    const ladder = OFFICE_LADDER.filter((item) => !String(item.id).startsWith("appointed")).sort((a, b) => a.tier - b.tier);
    return ladder.find((item) => item.tier > office.tier) || office;
  }

  function scenarioForOffice(officeId) {
    return allScenarios().find((scenario) => scenario.officeId === officeId) || null;
  }

  function nextHigherScenario() {
    const current = currentOffice();
    const ladder = OFFICE_LADDER.filter((item) => !String(item.id).startsWith("appointed")).sort((a, b) => a.tier - b.tier);
    const currentTier = current?.tier || 0;
    const scenarioIds = new Set(allScenarios().map((scenario) => scenario.officeId));
    const next = ladder.find((item) => item.tier > currentTier && scenarioIds.has(item.id));
    return next ? scenarioForOffice(next.id) : null;
  }

  function acceptAppointment() {
    const appointed = officeById("appointedEducation") || { id: "appointedEducation", name: "Education Commissioner", tier: 4.5, governingPower: 0.85 };
    state.candidate.officeId = appointed.id;
    state.candidate.officeName = appointed.name;
    state.results = { won: true, playerShare: state.termReview?.approval || 55, opponentShare: 45, playerVotes: 0, opponentVotes: 0, margin: 10, regions: [], notes: ["Appointment accepted after term review."] };
    beginGoverning();
    addLog("Accepted an appointed government position. No campaign required, but the record still matters.", "career");
  }

  function bindCampaign() {
    document.querySelectorAll("[data-campaign-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.campaignTab;
        save();
        render();
      });
    });
    document.querySelectorAll("[data-select-region]").forEach((select) => {
      select.addEventListener("change", (event) => {
        state.campaign.selectedRegionId = event.target.value;
        render();
      });
    });
    document.querySelectorAll("[data-select-group]").forEach((select) => {
      select.addEventListener("change", (event) => {
        state.campaign.selectedGroupId = event.target.value;
        render();
      });
    });
    document.querySelectorAll("[data-map-region], [data-brief-region]").forEach((button) => {
      button.addEventListener("click", () => {
        state.campaign.selectedRegionId = button.dataset.mapRegion || button.dataset.briefRegion;
        render();
      });
    });
    document.querySelectorAll("[data-schedule-action]").forEach((button) => button.addEventListener("click", () => scheduleAction(button.dataset.scheduleAction)));
    document.querySelector("[data-resolve-schedule]")?.addEventListener("click", resolveSchedule);
    document.querySelector("[data-clear-schedule]")?.addEventListener("click", clearSchedule);
    document.querySelectorAll("[data-unschedule]").forEach((button) => button.addEventListener("click", () => unscheduleAction(button.dataset.unschedule)));
    document.querySelectorAll("[data-event-choice]").forEach((button) => button.addEventListener("click", () => answerEvent(Number(button.dataset.eventChoice))));
    document.querySelector("[data-skip-weekly-question]")?.addEventListener("click", skipWeeklyQuestion);
    document.querySelectorAll("[data-message-stance]").forEach((button) => button.addEventListener("click", () => runMessageAd(button.dataset.messageStance)));
    document.querySelector("[data-internal-poll]")?.addEventListener("click", conductInternalPoll);
    document.querySelectorAll("[data-voter-group]").forEach((button) => button.addEventListener("click", () => {
      state.campaign.selectedGroupId = button.dataset.voterGroup;
      render();
    }));
    document.querySelectorAll("[data-request-endorsement]").forEach((button) => button.addEventListener("click", () => requestEndorsement(button.dataset.requestEndorsement)));
    document.querySelectorAll("[data-begin-focus]").forEach((button) => button.addEventListener("click", () => beginFocus(button.dataset.beginFocus)));
    document.querySelectorAll("[data-focus-choice]").forEach((button) => button.addEventListener("click", () => chooseFocusFinal(Number(button.dataset.focusChoice))));
    document.querySelector("[data-start-debate]")?.addEventListener("click", startDebate);
    document.querySelector("[data-decline-debate]")?.addEventListener("click", declineDebate);
    document.querySelectorAll("[data-debate-choice]").forEach((button) => button.addEventListener("click", () => answerDebate(Number(button.dataset.debateChoice))));
    document.querySelector("[data-advance-week]")?.addEventListener("click", advanceWeek);
  }

  function bindGoverning() {
    document.querySelectorAll("[data-gov-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.govView = button.dataset.govTab;
        save();
        render();
      });
    });
    document.querySelectorAll("[data-admin-action]").forEach((button) => button.addEventListener("click", () => adminAction(button.dataset.adminAction)));
    document.querySelector("[data-advance-month]")?.addEventListener("click", advanceMonth);
    document.querySelectorAll("[data-appoint-staff]").forEach((button) => button.addEventListener("click", () => appointStaff(button.dataset.appointStaff)));
    document.querySelectorAll("[data-pass-bill]").forEach((button) => button.addEventListener("click", () => passBill(button.dataset.passBill)));
    document.querySelectorAll("[data-amend-bill]").forEach((button) => button.addEventListener("click", () => amendBill(button.dataset.amendBill)));
    document.querySelectorAll("[data-oppo-deal]").forEach((button) => button.addEventListener("click", () => handleOppositionDeal(button.dataset.oppoDeal)));
    document.querySelectorAll("[data-meet-faction]").forEach((button) => button.addEventListener("click", () => meetFaction(button.dataset.meetFaction)));
    document.querySelectorAll("[data-budget-adjust]").forEach((button) => button.addEventListener("click", () => {
      const [key, delta] = button.dataset.budgetAdjust.split(":");
      adjustBudget(key, Number(delta));
    }));
  }

  function meter(label, value, max = 100) {
    const width = clamp(Number(value || 0) / max * 100, 0, 100);
    return `<div class="cr-meter"><div><span>${html(label)}</span><strong>${Math.round(Number(value || 0))}</strong></div><i><b style="width:${width}%"></b></i></div>`;
  }

  function scopeLabel(scope) {
    return {
      localDistrict: "Local District Map",
      city: "City Neighborhood Map",
      stateDistrict: "State Legislative District Map",
      statewide: "Statewide Region Map",
      national: "National Map"
    }[scope] || "Scenario Map";
  }

  function electionStructureLabel(id) {
    return {
      nonpartisanGeneral: "Nonpartisan local ballot",
      primaryAndGeneral: "State House general election",
      safeSeatPrimary: "Safe-seat primary",
      statewideCycle: "Statewide cycle",
      presidentialCycle: "Presidential cycle"
    }[id] || "General election";
  }

  function mapHelpText(scope) {
    if (scope === "localDistrict") return "A stylized district map of neighborhoods, schools, parent communities, and turnout pockets.";
    if (scope === "city") return "A city map of neighborhoods, local media zones, and turnout pockets.";
    if (scope === "stateDistrict") return "A state legislative district map, not a national map.";
    if (scope === "statewide") return "A statewide map of regions and media markets.";
    return "A national map used only for presidential or future national scenarios.";
  }

  function regionName(id) {
    return byId(DATA.regions || [], id)?.name || id || "the district";
  }

  init();

  function init() {
    render();
  }
})();
