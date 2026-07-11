(function () {
  const DATA = window.CommonPagesCivicData || {};
  const root = document.querySelector("#civicRoot");
  if (!root) return;

  const VERSION = "0.5.0";
  const SAVE_KEY = "commonRepublicScenarioSpineSaveV2";
  const CUSTOM_SCENARIO_KEY = "commonRepublicCustomScenariosV1";
  const DEFAULT_SCENARIO_ID = "schoolBoardDistrict";

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
    ["event", "Weekly Question"],
    ["actions", "Actions"],
    ["messages", "Messages"],
    ["voters", "Voters & Polls"],
    ["endorsements", "Endorsements"],
    ["focus", "Agenda Path"],
    ["debate", "Debate Hall"],
    ["math", "Election Math"],
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

  function save() {
    try {
      if (state) localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() }));
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
    const saved = load();
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
          ${saved ? `
            <div class="cr-note">
              <strong>Saved career found</strong>
              <p>${html(saved.candidate?.name)} is in ${html(saved.phase)} mode. This save uses the new scenario-first game spine.</p>
              <button class="cr-btn primary" data-resume-save type="button">Resume Career</button>
            </div>
          ` : ""}
          <div class="cr-note">
            <strong>Scenario data loader</strong>
            <p>Add scenarios by appending objects to <code>games/civic/data/scenarios.js</code>, or paste one JSON object here for local testing.</p>
            <textarea class="cr-scenario-json" id="customScenarioJson" placeholder='{"id":"cityCouncilPilot","name":"City Council Pilot","office":"City Council","officeId":"cityCouncil","weeks":6,"regionIds":["harborCity","pineSuburbs"],"startingResources":{"money":32000,"time":3,"staff":2,"volunteers":32,"capital":4,"trust":50,"media":8,"energy":6,"maxEnergy":6,"debate":40},"defaultOpponent":"miraVance"}'></textarea>
            <button class="cr-btn subtle" data-load-custom-scenario type="button">Load Local Scenario</button>
          </div>
        </div>
        <div class="cr-scenario-stack">
          ${scenarios.map((scenario) => renderScenarioCard(scenario)).join("")}
        </div>
      </section>
    `;
    document.querySelector("[data-resume-save]")?.addEventListener("click", () => {
      state = load();
      render();
    });
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
    const states = DATA.usStates || [];
    const backgrounds = DATA.backgrounds || [];
    const educationLevels = DATA.educationLevels || [];
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
          <label><span>Candidate name</span><input name="candidateName" value="Alex Rivers" maxlength="48" required></label>
          <label><span>Age</span><input name="age" type="number" min="18" max="90" value="35"></label>
          <label><span>Home state</span><select name="homeState">${states.map((item) => `<option value="${html(item.id)}" ${item.id === (scenario.stateId || "pa") ? "selected" : ""}>${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Office</span><input value="${html(scenario.office || officeById(scenario.officeId)?.name)}" disabled></label>
          <label><span>Background</span><select name="background">${backgrounds.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Education</span><select name="education">${educationLevels.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select></label>
          <label><span>Political identity</span><select name="party">${PARTIES.map((item) => `<option value="${html(item.id)}">${html(item.name)}</option>`).join("")}</select><em>${html(electionStructureLabel(scenario.electionStructure))}</em></label>
          <label><span>Difficulty</span><select name="difficulty">${Object.entries(DIFFICULTIES).map(([id, item]) => `<option value="${id}" ${id === "intermediate" ? "selected" : ""}>${html(item.name)}</option>`).join("")}</select></label>
          <label class="wide"><span>Ideology</span><input name="ideology" type="range" min="-35" max="35" value="-4"><em>Left/progressive to right/conservative. Scenario, voters, and stances matter more than this one slider.</em></label>
          ${[0, 1, 2].map((index) => renderPriorityRow(index, issues)).join("")}
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
      if (!readout) return;
      readout.innerHTML = `<strong>${html(currentParty.name)} · ${html(diff.name)}</strong><p>${html(currentParty.description || "Local trust and issue fit can overcome party assumptions.")} ${html(diff.text)}</p>`;
    };
    const updateStance = (index) => {
      const issueSelect = form?.querySelector(`[data-priority-issue="${index}"]`);
      const stanceSelect = form?.querySelector(`[data-priority-stance="${index}"]`);
      const issue = issueById(issueSelect?.value) || visibleIssues()[0];
      if (!stanceSelect || !issue) return;
      stanceSelect.innerHTML = (issue.stances || []).map((stance) => `<option value="${html(stance.id)}">${html(stance.name)}</option>`).join("");
    };
    [0, 1, 2].forEach(updateStance);
    form?.querySelectorAll("[data-priority-issue]").forEach((select) => {
      select.addEventListener("change", () => updateStance(select.dataset.priorityIssue));
    });
    form?.party?.addEventListener("change", updateReadout);
    form?.difficulty?.addEventListener("change", updateReadout);
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
      partyId: form.get("party") || "democratic",
      backgroundId: background.id,
      educationId: education.id,
      officeId: scenario.officeId,
      officeName: scenario.office || officeById(scenario.officeId)?.name,
      ideology: Number(form.get("ideology") || 0),
      priorities: collectPriorities(form),
      stats,
      fatigue: 0,
      traits: [background.name, education.name],
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
      pollMoe: scope === "localDistrict" ? 4.8 : 5.8,
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
      debate: { prep: resources.debate || 40, started: false, completed: false, currentIndex: 0, answers: [], clip: null },
      policyMemory: [],
      messageHistory: [],
      internalNotes: []
    };
    applyCandidateSources(campaign, candidate);
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
    const base = campaign.regions.reduce((sum, region) => sum + (region.pollMoe || 4.5), 0) / Math.max(1, campaign.regions.length);
    return clamp(base * (campaign.lastPoll ? 0.62 : 1), 1.8, 7.5);
  }

  function applyEffectsToCampaign(campaign, effects = {}, context = {}) {
    const before = districtPoll(campaign);
    const items = [];
    const region = campaign.regions.find((item) => item.id === (context.regionId || campaign.selectedRegionId));
    const group = campaign.groups[context.groupId || campaign.selectedGroupId];
    const addItem = (text) => { if (!context.quiet) items.push(text); };

    const resourceLabels = { money: "Money", volunteers: "Volunteers", staff: "Staff", capital: "Political capital", trust: "Public trust", media: "Media attention", energy: "Energy", time: "Time", debate: "Debate prep" };
    Object.entries(resourceLabels).forEach(([key, label]) => {
      if (typeof effects[key] !== "number") return;
      campaign.resources[key] = clamp((campaign.resources[key] || 0) + effects[key], key === "money" ? -999999 : 0, key === "trust" || key === "media" || key === "debate" ? 100 : 999999);
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
          <button type="button" class="${state?.phase === "campaign" || state?.phase === "briefing" ? "active" : ""}" data-phase-jump="campaign" ${state?.campaign ? "" : "disabled"}>Campaign</button>
          <button type="button" class="${state?.phase === "governing" ? "active" : ""}" data-phase-jump="governing" ${state?.governing ? "" : "disabled"}>Governing</button>
          <button type="button" data-career-tab>Career</button>
        </nav>
        <div class="cr-ribbon-actions">
          <button class="cr-btn subtle" data-save type="button">Save</button>
          <button class="cr-btn subtle" data-new-career type="button">New Career</button>
        </div>
      </header>
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
    document.querySelector("[data-new-career]")?.addEventListener("click", () => {
      clearSave();
      state = null;
      setup = { screen: "scenario", scenarioId: DEFAULT_SCENARIO_ID, customScenarios: loadCustomScenarios() };
      render();
    });
    document.querySelector("[data-phase-jump='campaign']")?.addEventListener("click", () => {
      if (!state?.campaign) return;
      state.phase = "campaign";
      state.view = state.view || "warRoom";
      render();
    });
    document.querySelector("[data-phase-jump='governing']")?.addEventListener("click", () => {
      if (!state?.governing) return;
      state.phase = "governing";
      render();
    });
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
    if (campaign.mapScope === "national") return [...CAMPAIGN_TABS.slice(0, 4), ["primary", "Primary/Convention"], ...CAMPAIGN_TABS.slice(4)];
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
    if (state.view === "event") return renderWeeklyQuestion();
    if (state.view === "actions") return renderActionBoard();
    if (state.view === "messages") return renderMessageBoard();
    if (state.view === "voters") return renderVoterBoard();
    if (state.view === "endorsements") return renderEndorsements();
    if (state.view === "focus") return renderFocusPaths();
    if (state.view === "debate") return renderDebateHall();
    if (state.view === "math") return renderElectionMath();
    if (state.view === "primary") return renderPrimaryPlaceholder();
    if (state.view === "file") return renderCandidateFile();
    return renderWarRoom();
  }

  function renderWarRoom() {
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
          <button class="cr-btn primary full" data-advance-week type="button">${state.campaign.week >= state.campaign.maxWeeks ? "Election Night" : "Advance Week"}</button>
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
        <p>${html(region.type)} · ${region.population.toLocaleString()} people · poll ${pct(region.support, 1)} · turnout ${pct(effectiveTurnout(region), 1)} · uncertainty ${pct(region.pollMoe || 4.5, 1)}</p>
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
    const disabled = !canPayCost(action.cost || {}) || used;
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
        <button class="cr-btn ${disabled ? "subtle" : "primary"} full" data-do-action="${html(action.id)}" ${disabled ? "disabled" : ""} type="button">Do This</button>
      </article>
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

  function payCost(cost = {}) {
    Object.entries(cost).forEach(([key, value]) => {
      state.campaign.resources[key] = clamp((state.campaign.resources[key] || 0) - Number(value), key === "money" ? -999999 : 0, 999999);
    });
  }

  function doAction(actionId) {
    const action = byId(DATA.actions || [], actionId);
    if (!action || !canPayCost(action.cost || {})) return;
    const region = selectedRegion();
    const regionBefore = region?.support;
    const usedKey = `${action.id}:${state.campaign.selectedRegionId}`;
    if (action.oncePerRegion && state.campaign.completedActions[usedKey]) return;
    payCost(action.cost || {});
    const effects = { ...(action.effects || {}), groupEffects: action.groupEffects || {} };
    const move = applyEffectsToCampaign(state.campaign, effects, {
      source: localizedActionName(action),
      regionId: state.campaign.selectedRegionId,
      groupId: state.campaign.selectedGroupId,
      regionBefore
    });
    if (action.risk && Math.random() < (action.risk.chance || 0) * difficulty().risk) {
      const riskEffects = { ...action.risk };
      delete riskEffects.chance;
      delete riskEffects.log;
      applyEffectsToCampaign(state.campaign, riskEffects, { source: `${localizedActionName(action)} risk`, regionId: state.campaign.selectedRegionId, groupId: state.campaign.selectedGroupId });
      state.campaign.lastMovement.items.unshift(action.risk.log || "A risk event reduced the expected benefit.");
    }
    if (action.oncePerRegion) state.campaign.completedActions[usedKey] = true;
    addLog(`${localizedActionName(action)} targeted ${actionTargetText(action)}. District movement ${signed(move.after - move.before, " pts")}.`, "action");
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
    state.campaign.regions.forEach((region) => region.pollMoe = clamp((region.pollMoe || 4.5) - 1.3, 1.8, 7));
    const swing = topSwingGroups(3).map((item) => `${item.group.name} (${pct(item.group.support, 1)}, ${Math.round(item.score)} swing value)`).join("; ");
    state.campaign.lastPoll = `District estimate ${pct(districtPoll(), 1)} ± ${pct(pollMoe(), 1)}. Top swing groups: ${swing}.`;
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
        <button class="cr-btn ${progress.met && !won ? "primary" : "subtle"} full" data-request-endorsement="${html(endorsement.id)}" ${!progress.met || won ? "disabled" : ""} type="button">${won ? "Endorsed" : "Request Endorsement"}</button>
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
      return `<section class="cr-grid two"><article class="cr-panel cr-debate-stage"><h2>Debate Clips</h2><p>${html(d.clip || "The debate is complete.")}</p>${renderWhyMoved()}</article><aside class="cr-panel"><h2>Answers</h2>${d.answers.map((answer) => `<p>${html(answer)}</p>`).join("")}</aside></section>`;
    }
    if (!d.started) {
      return `
        <section class="cr-grid two">
          <article class="cr-panel cr-debate-stage">
            <p class="cr-eyebrow">Debate Hall</p>
            <h2>Moderator, Audience, and Cameras</h2>
            <p>The debate uses prep, eloquence, policy knowledge, fatigue, opponent debate skill, and the platform you chose at setup. It has three questions and a visible post-debate clip.</p>
            <div class="cr-stage-visual"><div>Moderator</div><div>${html(state.candidate.name)}</div><div>${html(state.campaign.opponent.name)}</div><div>Audience</div></div>
            <button class="cr-btn primary full" data-start-debate type="button">Enter Debate Hall</button>
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
          <p class="cr-eyebrow">Debate Question ${d.currentIndex + 1} of 3</p>
          <h2>${html(question.title)}</h2>
          <p>${html(question.text)}</p>
          <div class="cr-answer-list">${question.choices.map((choice, index) => `
            <button class="cr-answer" data-debate-choice="${index}" type="button"><span>${html(choice.tone)}</span><strong>${html(choice.label)}</strong><em>${html(choice.preview)}</em></button>
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
    state.campaign.debate.started = true;
    state.campaign.debate.currentIndex = 0;
    save();
    render();
  }

  function answerDebate(index) {
    const d = state.campaign.debate;
    const question = debateQuestions()[d.currentIndex];
    const choice = question?.choices?.[index];
    if (!choice) return;
    const before = districtPoll();
    const prepBonus = (d.prep - 50) * 0.018 + (state.candidate.stats.eloquence - 55) * 0.012 + (state.candidate.stats.policy - 55) * 0.008 - state.candidate.fatigue * 0.01;
    const opponentPenalty = ((state.campaign.opponent.stats?.debate || 60) - 60) * 0.012 * difficulty().opposition;
    const effects = { ...choice.effects, regionSupport: (choice.effects.regionSupport || 0) + prepBonus - opponentPenalty };
    applyEffectsToCampaign(state.campaign, effects, { source: `Debate: ${question.title}` });
    d.answers.push(`${question.title}: ${choice.label}`);
    d.currentIndex += 1;
    if (d.currentIndex >= 3) {
      d.completed = true;
      d.started = false;
      const movement = districtPoll() - before;
      d.clip = movement >= 1.5 ? "Post-debate coverage calls your answers crisp and grounded." : movement <= -1.2 ? "The best clip belongs to your opponent, and your campaign spends the morning explaining context." : "Coverage is mixed, with voters mostly hearing what they already believed.";
      addLog(`Debate completed. ${d.clip}`, "debate");
    }
    save();
    render();
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

  function advanceWeek() {
    const c = state.campaign;
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
    c.regions.forEach((region) => {
      region.adSaturation = clamp(region.adSaturation - 4, 0, 100);
      region.directSupport = clamp(region.directSupport - 0.05 * difficulty().opposition, -30, 30);
    });
    if (!c.currentEventId) c.currentEventId = drawEligibleEvent(c);
    refreshAllRegionPolls(c);
    addLog(`Week ${c.week} begins. Resources reset, the rival moved, and a scenario question is available.`, "calendar");
    save();
    render();
  }

  function runElection() {
    const c = state.campaign;
    refreshAllRegionPolls(c);
    const regionResults = c.regions.map((region) => {
      const turnout = effectiveTurnout(region, c);
      const likelyVotes = Math.round(region.population * turnout / 100);
      const lateError = (Math.random() * 2 - 1) * (region.pollMoe || pollMoe(c)) * 0.55;
      const fatiguePenalty = state.candidate.fatigue > 45 ? -1.2 : 0;
      const finalSupport = clamp(region.support + lateError + fatiguePenalty, 5, 95);
      return {
        id: region.id,
        name: region.name,
        support: finalSupport,
        turnout,
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
    const budgetBase = Math.round(110 * (office.governingPower || 0.7) / difficulty().budget);
    state.governing = {
      month: 1,
      termMonths: office.tier >= 4 ? 24 : 18,
      approval: clamp(state.results.playerShare + 6, 25, 82),
      trust: state.campaign.resources.trust,
      budget: budgetBase,
      deficit: 0,
      capital: Math.round(state.campaign.resources.capital + 8),
      metrics: { education: 50, housing: 50, safety: 50, economy: 50, services: 50 },
      budgetLines: { education: 28, housing: 16, safety: 18, services: 18, administration: 10, reserves: 10 },
      staff: {},
      factions: makeFactions(),
      bills: makePolicyBills(),
      oppositionBill: makeOppositionOffer(),
      log: ["Election night is over. Every campaign promise now has a budget, a faction count, and a reelection consequence."]
    };
    addLog("Entered governing mode. The administration, budget, legislature, and reelection record are now active.", "governing");
    save();
    render();
  }

  function makeFactions() {
    return [
      { id: "progressive", name: "Progressive Caucus", seats: 5, support: 52, asks: ["housing", "labor", "education"] },
      { id: "labor", name: "Labor Caucus", seats: 4, support: 54, asks: ["labor", "education", "healthcare"] },
      { id: "reform", name: "Bipartisan Reform Caucus", seats: 6, support: 50, asks: ["budget", "government", "education"] },
      { id: "business", name: "Business Conservative Caucus", seats: 5, support: 38, asks: ["taxes", "budget", "economicDevelopment"] },
      { id: "rural", name: "Rural Coalition", seats: 4, support: 43, asks: ["ruralDevelopment", "infrastructure", "healthcare"] },
      { id: "independent", name: "Independent Members", seats: 3, support: 48, asks: ["budget", "publicSafety", "ethics"] }
    ];
  }

  function makePolicyBills() {
    return [
      { id: "schoolMeals", area: "Education", title: "Universal School Meals", summary: "Feed every student during the school day.", cost: 8, capital: 2, effects: { education: 5, approval: 2, groups: { parents: 2, teachers: 1 } }, status: "draft" },
      { id: "teacherRecruitment", area: "Education", title: "Teacher Recruitment Plan", summary: "Raise retention grants and create a classroom residency pipeline.", cost: 7, capital: 2, effects: { education: 6, approval: 1, groups: { teachers: 3 } }, status: "draft" },
      { id: "zoningReform", area: "Housing", title: "Neighborhood Housing Compact", summary: "Allow more homes near jobs while funding infrastructure.", cost: 5, capital: 3, effects: { housing: 7, approval: 1, groups: { renters: 2, homeowners: -1 } }, status: "draft" },
      { id: "safetyResponse", area: "Public Safety", title: "Response and Prevention Act", summary: "Fund response times, violence prevention, and accountability metrics.", cost: 7, capital: 3, effects: { safety: 7, approval: 1, groups: { parents: 1.5, seniors: 1 } }, status: "draft" },
      { id: "openRecords", area: "Government", title: "Open Records Expansion", summary: "Publish meetings, contracts, and budget updates online.", cost: 3, capital: 2, effects: { services: 3, approval: 1, trust: 3 }, status: "draft" }
    ];
  }

  function makeOppositionOffer() {
    return {
      id: `oppo-${Date.now()}`,
      title: "Property Tax Cap and Permit Streamlining Act",
      ask: "Support a tax cap and faster permits in exchange for two votes on your education bill.",
      effects: { budget: -4, approval: 1, business: 2, progressive: -1 },
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
    return `
      <div class="cr-metric-grid governing">
        ${metric("Approval", pct(g.approval, 0), "Public support for your governing record. Affects reelection, protests, and legislative leverage.")}
        ${metric("Trust", pct(g.trust, 0), "Whether voters believe the administration is honest and competent.")}
        ${metric("Budget", Math.round(g.budget), "Available fiscal room. Difficulty increases monthly pressure.")}
        ${metric("Deficit", Math.round(g.deficit), "Overspending that creates future attacks and economic stress.")}
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
            <button class="cr-answer" data-admin-action="focus" type="button"><span>Calendar</span><strong>Protect one priority.</strong><em>+2 capital · +1 trust</em></button>
            <button class="cr-answer" data-admin-action="listen" type="button"><span>Public</span><strong>Hold a listening month.</strong><em>+2 trust · -1 approval</em></button>
            <button class="cr-answer" data-admin-action="push" type="button"><span>Pressure</span><strong>Push several promises at once.</strong><em>+2 approval · -4 budget · -2 capital</em></button>
          </div>
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
        <button class="cr-btn ${appointed ? "subtle" : "primary"} full" data-appoint-staff="${html(staffer.id)}" ${appointed ? "disabled" : ""} type="button">${appointed ? "Appointed" : "Appoint"}</button>
      </article>
    `;
  }

  function appointStaff(id) {
    const staffer = byId(DATA.staff || [], id);
    if (!staffer) return;
    state.governing.staff[staffer.role] = staffer.id;
    const effects = staffer.effects || {};
    if (effects.trust) state.governing.trust = clamp(state.governing.trust + effects.trust, 0, 100);
    if (effects.capital) state.governing.capital += effects.capital;
    if (effects.budget) state.governing.budget += effects.budget;
    if (effects.volunteers) state.campaign.resources.volunteers += effects.volunteers;
    state.governing.log.unshift(`${staffer.name} appointed as ${staffer.role}.`);
    save();
    render();
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
    return `
      <article class="cr-action-card ${bill.status === "passed" ? "passed" : ""}">
        <span>${html(bill.area)}</span>
        <h4>${html(bill.title)}</h4>
        <p>${html(bill.summary)}</p>
        <div class="cr-action-preview">
          <p><strong>Cost:</strong> ${bill.cost}</p>
          <p><strong>Capital:</strong> ${bill.capital}</p>
          <p><strong>Projected votes:</strong> ${votes.yes}/${votes.need}</p>
        </div>
        <button class="cr-btn primary full" data-pass-bill="${html(bill.id)}" ${bill.status === "passed" || state.governing.budget < bill.cost || state.governing.capital < bill.capital ? "disabled" : ""} type="button">${bill.status === "passed" ? "Passed" : "Pass Bill"}</button>
      </article>
    `;
  }

  function renderOppositionOffer() {
    const bill = state.governing.oppositionBill;
    if (!bill || bill.status !== "pending") return "<p>No active opposition bill this month.</p>";
    return `
      <div class="cr-result-note gaffe">
        <strong>${html(bill.title)}</strong>
        <p>${html(bill.ask)}</p>
      </div>
      <div class="cr-answer-list">
        <button class="cr-answer" data-oppo-deal="accept" type="button"><span>Deal</span><strong>Accept the trade.</strong><em>-4 budget · +2 business faction support · one player bill gains votes</em></button>
        <button class="cr-answer" data-oppo-deal="amend" type="button"><span>Quid pro quo</span><strong>Offer a narrower amendment.</strong><em>-2 capital · +1 reform/rural support · lower backlash</em></button>
        <button class="cr-answer" data-oppo-deal="oppose" type="button"><span>Fight</span><strong>Oppose and make a public case.</strong><em>+1 trust · -1 capital · opposition hardens</em></button>
      </div>
    `;
  }

  function projectedVotes(bill) {
    const need = Math.floor(state.governing.factions.reduce((sum, faction) => sum + faction.seats, 0) / 2) + 1;
    let yes = 0;
    state.governing.factions.forEach((faction) => {
      let support = faction.support + state.governing.capital * 0.2 - bill.cost * 0.35;
      if ((faction.asks || []).some((ask) => String(bill.area).toLowerCase().includes(ask.toLowerCase()))) support += 10;
      if (support >= 50) yes += faction.seats;
    });
    return { yes, need };
  }

  function passBill(id) {
    const bill = byId(state.governing.bills, id);
    if (!bill || bill.status === "passed") return;
    const votes = projectedVotes(bill);
    state.governing.budget -= bill.cost;
    state.governing.capital -= bill.capital;
    if (votes.yes >= votes.need) {
      bill.status = "passed";
      state.governing.approval = clamp(state.governing.approval + (bill.effects.approval || 0), 0, 100);
      Object.entries(bill.effects || {}).forEach(([key, value]) => {
        if (state.governing.metrics[key] != null) state.governing.metrics[key] = clamp(state.governing.metrics[key] + value, 0, 100);
      });
      if (bill.effects.trust) state.governing.trust = clamp(state.governing.trust + bill.effects.trust, 0, 100);
      state.governing.log.unshift(`${bill.title} passed ${votes.yes}-${votes.need - 1}.`);
      addLog(`${bill.title} passed.`, "policy");
    } else {
      state.governing.approval = clamp(state.governing.approval - 3, 0, 100);
      state.governing.log.unshift(`${bill.title} failed with ${votes.yes} projected yes votes. The opposition calls the agenda disorganized.`);
    }
    save();
    render();
  }

  function handleOppositionDeal(type) {
    const g = state.governing;
    if (type === "accept") {
      g.budget -= 4;
      g.approval += 1;
      faction("business").support += 8;
      faction("progressive").support -= 5;
      g.log.unshift("Accepted an opposition tax-and-permit deal. It bought votes and created progressive backlash.");
    }
    if (type === "amend" && g.capital >= 2) {
      g.capital -= 2;
      faction("reform").support += 5;
      faction("rural").support += 4;
      g.log.unshift("Offered a narrower opposition amendment in exchange for process votes.");
    }
    if (type === "oppose") {
      g.capital -= 1;
      g.trust += 1;
      faction("business").support -= 4;
      g.log.unshift("Opposed the opposition bill publicly. Trust rose, but cross-party votes got harder.");
    }
    g.oppositionBill.status = "resolved";
    save();
    render();
  }

  function faction(id) {
    return state.governing.factions.find((item) => item.id === id) || state.governing.factions[0];
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
            <button class="cr-btn subtle full" data-meet-faction="${html(faction.id)}" ${state.governing.capital < 1 ? "disabled" : ""} type="button">Meet Leader · 1 capital</button>
          </article>
        `).join("")}</div>
      </section>
    `;
  }

  function meetFaction(id) {
    if (state.governing.capital < 1) return;
    const target = faction(id);
    state.governing.capital -= 1;
    target.support = clamp(target.support + 6, 0, 100);
    state.governing.log.unshift(`Met with ${target.name}. Support improved, but the capital is spent.`);
    save();
    render();
  }

  function renderBudget() {
    const g = state.governing;
    const total = Object.values(g.budgetLines).reduce((sum, value) => sum + value, 0);
    return `
      <section class="cr-grid two">
        <article class="cr-panel cr-budget-panel">
          <h2>Budget Position</h2>
          <strong class="cr-budget-number">${Math.round(g.budget)}</strong>
          <p>Available budget · deficit ${Math.round(g.deficit)} · monthly difficulty pressure x${difficulty().budget.toFixed(2)}</p>
          <p>Overspending raises the deficit and creates future attacks. Underspending leaves services weak and approval brittle.</p>
          ${Object.entries(g.budgetLines).map(([key, value]) => `
            <div class="cr-budget-line">
              <strong>${html(labelize(key))}</strong>
              <span>${value}</span>
              <button data-budget-adjust="${html(key)}:-2" type="button">-</button>
              <button data-budget-adjust="${html(key)}:2" type="button">+</button>
            </div>
          `).join("")}
        </article>
        <aside class="cr-panel">
          <h2>Budget Shape</h2>
          ${meter("Spending Load", total, 120)}
          ${meter("Service Quality", (g.metrics.education + g.metrics.housing + g.metrics.safety + g.metrics.services) / 4, 100)}
          ${meter("Fiscal Stress", Math.max(0, g.deficit + (total - 100)), 80)}
        </aside>
      </section>
    `;
  }

  function adjustBudget(key, delta) {
    const g = state.governing;
    g.budgetLines[key] = clamp((g.budgetLines[key] || 0) + Number(delta), 0, 70);
    g.budget -= Number(delta);
    if (key === "education") g.metrics.education = clamp(g.metrics.education + Number(delta) * 0.45, 0, 100);
    if (key === "housing") g.metrics.housing = clamp(g.metrics.housing + Number(delta) * 0.45, 0, 100);
    if (key === "safety") g.metrics.safety = clamp(g.metrics.safety + Number(delta) * 0.45, 0, 100);
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
      g.budget -= 4;
      g.log.unshift("Several promises moved at once. The headline was good; the internal cost was real.");
    }
    g.approval = clamp(g.approval, 0, 100);
    g.trust = clamp(g.trust, 0, 100);
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
    const spending = Object.values(g.budgetLines).reduce((sum, value) => sum + value, 0);
    const pressure = Math.round((spending - 90) * 0.12 * difficulty().budget);
    g.budget -= Math.max(0, pressure);
    if (g.budget < 0) {
      g.deficit += Math.abs(g.budget);
      g.budget = 0;
      g.approval -= 2;
    }
    g.capital += 2;
    g.approval = clamp(g.approval + (g.trust - 55) * 0.02 - g.deficit * 0.015, 5, 95);
    if (Math.random() < 0.38 * difficulty().opposition && (!g.oppositionBill || g.oppositionBill.status !== "pending")) {
      g.oppositionBill = makeOppositionOffer();
      g.log.unshift(`Opposition introduced ${g.oppositionBill.title}.`);
    }
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
                <button data-career-next="higher" type="button">Run for Higher Office</button>
                <button data-career-next="appointment" type="button">Accept Government Appointment</button>
              </div>
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
    const nextScenario = scenarioForOffice(nextOffice.id) || getScenario(state.scenarioId);
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
    return allScenarios().find((scenario) => scenario.officeId === officeId) || (officeId === "stateHouse" ? getScenario("stateHouseSwingDistrict") : null);
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
    document.querySelectorAll("[data-do-action]").forEach((button) => button.addEventListener("click", () => doAction(button.dataset.doAction)));
    document.querySelectorAll("[data-event-choice]").forEach((button) => button.addEventListener("click", () => answerEvent(Number(button.dataset.eventChoice))));
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
      primaryAndGeneral: "Primary and general election",
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
