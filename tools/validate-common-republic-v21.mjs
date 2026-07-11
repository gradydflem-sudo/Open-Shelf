import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const html = read("civic-engine.html");
const css = read("games/civic/civic.css");
const game = read("games/civic/civic-game.js");
const dataCareer = read("games/civic/data/career.js");

check(html.includes('id="civicAnnouncements"'), "Missing dedicated civicAnnouncements live region.");
check(!html.includes('id="civicRoot" aria-live'), "civicRoot should not be a whole-app live region.");
check(html.includes("skip-link"), "Missing skip link.");
check(css.includes(".cr-schedule-board"), "Missing schedule board styles.");
check(css.includes(".cr-modal-backdrop"), "Missing new-career modal styles.");
check(css.includes(":focus-visible"), "Missing focus-visible accessibility style.");

check(game.includes('const VERSION = "0.5.1"'), "Game version was not bumped to 0.5.1.");
check(game.includes("const SAVE_SCHEMA_VERSION = 3"), "Missing save schema version.");
check(game.includes("SAVE_SLOTS_KEY"), "Missing multiple save slots.");
check(!game.includes("data-phase-jump"), "Direct phase jump controls still exist.");
check(!game.includes("data-do-action"), "Immediate action buttons still exist.");
check(game.includes("data-schedule-action"), "Scheduled action buttons are missing.");
check(game.includes("function canAdvanceWeek"), "Missing turn-advance gate.");
check(game.includes("function makeFiscalModel"), "Missing fiscal model.");
check(game.includes("function projectedVotes") && game.includes("abstain") && game.includes("absent"), "Vote totals do not include abstain/absent.");
check(game.includes("function calculateStaffModifiers"), "Staff modifiers are not recalculated from active staff.");
check(game.includes("function nextHigherScenario"), "Higher-office routing guard is missing.");
check(!game.includes("Iowa Caucus") && !game.includes("Primary Calendar"), "National primary copy leaked into the campaign build.");
check(game.includes("State House general election"), "State-house scenario label was not corrected.");
check(game.includes("Teacher Retention Compact") && game.includes("Bus Route Reliability Audit"), "School-board governing bills are missing.");

const tabMatch = game.match(/const CAMPAIGN_TABS = \[([\s\S]*?)\];/);
const tabCount = tabMatch ? [...tabMatch[1].matchAll(/\["/g)].length : 0;
check(tabCount === 5, `Expected five campaign tabs, found ${tabCount}.`);

const context = { window: { CommonPagesCivicData: { voterGroups: [], regions: [], events: [] } } };
vm.createContext(context);
vm.runInContext(dataCareer, context);
const data = context.window.CommonPagesCivicData;
check(Array.isArray(data.usStates) && data.usStates.length === 50, "Expected all 50 state profiles in career data.");
check(data.educationLevels?.some((level) => level.name === "Professional / Advanced Degree"), "Professional degree label should be clear.");

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checks: 23 }, null, 2));
