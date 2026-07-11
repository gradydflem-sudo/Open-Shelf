window.CommonPagesCivicData.events = [
  {
    id: "factoryLayoffs",
    title: "A Factory Announces Layoffs",
    body: "A major employer in Iron County says six hundred jobs may disappear by winter. Reporters ask whether your campaign has an answer or only sympathy.",
    weekMin: 2,
    choices: [
      { label: "Blame corporate leadership and call for stronger labor rules.", text: "The line is clear and forceful, but business groups hear a threat.", effects: { groups: { unionMembers: 3, workingClass: 2, smallBusiness: -2 }, regions: { ironCounty: 2 }, media: 3, capital: -1 } },
      { label: "Propose a jobs and retraining package.", text: "The answer sounds serious, though budget reporters ask where the money comes from.", effects: { groups: { industrialWorkers: 3, suburbanModerates: 1, smallBusiness: 1 }, regions: { ironCounty: 2, capitalHeights: 0.7 }, money: -2500, trust: 1 } },
      { label: "Visit workers before announcing a plan.", text: "You buy credibility by giving up a day of campaign control.", effects: { groups: { workingClass: 1.5, unionMembers: 1.5 }, regions: { ironCounty: 1.6 }, trust: 2, energy: -1 } },
      { label: "Avoid a firm statement until details are confirmed.", text: "The careful answer prevents a mistake, but supporters wanted urgency.", effects: { trust: -0.5, media: -1, groups: { unionMembers: -1, suburbanModerates: 0.5 } } }
    ]
  },
  {
    id: "taxDebate",
    title: "Debate Question: Taxes",
    body: "The moderator asks whether you would raise taxes to fund education. The room goes very still.",
    weekMin: 3,
    choices: [
      { label: "Say yes for high earners, and explain the classroom tradeoff.", text: "Teachers cheer the clarity. Tax-sensitive voters mark the quote.", effects: { groups: { teachers: 3, parents: 1.5, smallBusiness: -2, suburbanModerates: -1 }, regions: { pineSuburbs: 0.5 }, trust: 1, media: 2 } },
      { label: "Promise targeted relief and a review of inefficient spending.", text: "The middle path is less memorable, but safer in the suburbs.", effects: { groups: { suburbanModerates: 2, parents: 1, teachers: -0.5 }, regions: { pineSuburbs: 1.4, capitalHeights: 0.8 }, trust: 0.8 } },
      { label: "Reject all tax increases and challenge the premise.", text: "Small business groups applaud, while public service advocates hear a closed door.", effects: { groups: { smallBusiness: 3, seniors: 1, teachers: -2, publicSectorWorkers: -1.5 }, regions: { ridgeTowns: 1, northValley: 0.8 }, capital: 1 } }
    ]
  },
  {
    id: "housingForum",
    title: "The Housing Forum Runs Long",
    body: "Renters, homeowners, builders, and neighborhood groups pack a community college auditorium. Every answer seems to disappoint someone.",
    choices: [
      { label: "Argue for more homes near transit with anti-displacement rules.", text: "A detailed answer earns respect from policy voters and some worried renters.", effects: { groups: { collegeStudents: 2, urbanProfessionals: 2, parents: 0.7, suburbanModerates: -0.8 }, regions: { harborCity: 1.4, universityDistrict: 1.5 }, trust: 1 } },
      { label: "Center tenant protections and rental aid.", text: "Renters hear urgency. Homeowners and fiscal critics hear cost.", effects: { groups: { workingClass: 2, collegeStudents: 2, smallBusiness: -1, suburbanModerates: -1 }, regions: { harborCity: 1.6 }, money: -1800 } },
      { label: "Defend neighborhood control and gradual change.", text: "The answer calms homeowner anxiety but leaves younger voters cold.", effects: { groups: { suburbanModerates: 2, parents: 1, collegeStudents: -2, urbanProfessionals: -1 }, regions: { pineSuburbs: 1.5, universityDistrict: -1.3 } } }
    ]
  },
  {
    id: "viralClip",
    title: "A Clip Goes Viral",
    body: "A fifteen-second clip from a long interview makes your answer sound sharper than it was. Supporters love it. Your staff worries about the missing context.",
    choices: [
      { label: "Ride the wave and post the clip yourself.", text: "The base enjoys the punch, but the campaign becomes a little louder.", effects: { media: 6, trust: -1, groups: { collegeStudents: 1, suburbanModerates: -1 } } },
      { label: "Post the full answer with a calmer caption.", text: "You sacrifice some momentum to protect trust.", effects: { media: 2, trust: 2, groups: { suburbanModerates: 1, urbanProfessionals: 1 } } },
      { label: "Ignore it and keep the schedule.", text: "The story burns out faster, but so does the chance to define it.", effects: { media: -1, energy: 1 } }
    ]
  },
  {
    id: "stormWarning",
    title: "Storm Warning on the Coast",
    body: "A serious storm may hit Coastal Bend. The campaign calendar suddenly looks less important than sandbags, shelters, and insurance questions.",
    choices: [
      { label: "Cancel campaign events and volunteer with relief groups.", text: "You lose a day of persuasion and gain a reputation for priorities.", effects: { regions: { coastalBend: 2.5 }, groups: { coastalResidents: 3, smallBusiness: 1 }, trust: 3, energy: -1 } },
      { label: "Hold a press conference on disaster readiness.", text: "The plan earns coverage, but residents notice whether help follows words.", effects: { regions: { coastalBend: 1.4, capitalHeights: 0.8 }, groups: { coastalResidents: 1.7, environmentalVoters: 1 }, media: 3, trust: 0.5 } },
      { label: "Keep campaigning elsewhere and send a statement.", text: "The schedule stays intact. The coast remembers.", effects: { regions: { coastalBend: -2 }, groups: { coastalResidents: -2 }, trust: -1, energy: 1 } }
    ]
  },
  {
    id: "teacherWalkIn",
    title: "Teachers Stage a Walk-In",
    body: "Teachers gather before school with handmade signs about class size and student support staff. Parents are sympathetic but worried about disruption.",
    choices: [
      { label: "Join them at dawn.", text: "The image is powerful and polarizing.", effects: { groups: { teachers: 4, parents: 0.5, smallBusiness: -1.2 }, regions: { pineSuburbs: 0.8, capitalHeights: 0.6 }, media: 2 } },
      { label: "Meet teachers and parents together after school.", text: "Less dramatic, more durable.", effects: { groups: { teachers: 2, parents: 2, suburbanModerates: 1 }, regions: { pineSuburbs: 1.4 }, trust: 1.5 } },
      { label: "Call for negotiation without taking sides.", text: "The quote is careful enough to vanish.", effects: { groups: { teachers: -1, suburbanModerates: 0.8 }, trust: -0.3 } }
    ]
  },
  {
    id: "donorPressure",
    title: "A Donor Wants Softer Language",
    body: "A wealthy supporter offers a major check if your next speech tones down criticism of corporate tax breaks.",
    choices: [
      { label: "Take the money and soften the line.", text: "The campaign can buy ads, but your economic message blurs.", effects: { money: 22000, trust: -2, groups: { smallBusiness: 1, unionMembers: -2, workingClass: -1 } } },
      { label: "Decline and say no donor writes the platform.", text: "The fundraising team winces. Volunteers notice.", effects: { money: -1500, trust: 3, volunteers: 8, groups: { unionMembers: 1.5, suburbanModerates: 0.5 } } },
      { label: "Offer a private meeting but make no promise.", text: "You preserve ambiguity, which is both useful and uncomfortable.", effects: { money: 7000, trust: -0.5, capital: 1 } }
    ]
  },
  {
    id: "safetyMeeting",
    title: "A Neighborhood Safety Meeting",
    body: "Residents in Ridge Towns describe car break-ins, opioid overdoses, and long emergency response times. They want fewer abstractions.",
    choices: [
      { label: "Promise more visible patrols and faster response times.", text: "A concrete answer lands with anxious voters.", effects: { groups: { seniors: 2, parents: 2, veterans: 1.5, collegeStudents: -1 }, regions: { ridgeTowns: 2, pineSuburbs: 0.8 } } },
      { label: "Focus on treatment, prevention, and accountability.", text: "Some residents appreciate the seriousness; others hear process.", effects: { groups: { urbanProfessionals: 1.5, immigrantCommunities: 1.2, parents: 1, seniors: -0.7 }, regions: { harborCity: 0.8, ridgeTowns: 0.4 }, trust: 1 } },
      { label: "Ask local responders what the state can actually fix.", text: "The humility works, but it is not a headline.", effects: { trust: 2, regions: { ridgeTowns: 1 }, media: -1 } }
    ]
  },
  {
    id: "waterRights",
    title: "Water Rights in North Valley",
    body: "Farmers say new conservation rules were written by people who have never missed a harvest. Environmental advocates warn that the aquifer is already overdrawn.",
    choices: [
      { label: "Back a farmer-led water compact.", text: "Rural leaders appreciate the respect, though environmental groups want clearer limits.", effects: { groups: { ruralVoters: 3, smallBusiness: 1, environmentalVoters: -1.5 }, regions: { northValley: 2.4 }, trust: 1 } },
      { label: "Defend strict conservation rules.", text: "Climate voters hear backbone. The valley hears a lecture.", effects: { groups: { environmentalVoters: 3, ruralVoters: -3 }, regions: { northValley: -2, universityDistrict: 1.2 }, media: 1 } },
      { label: "Propose drought grants tied to measurable savings.", text: "It is bureaucratic, but it treats both problems as real.", effects: { groups: { ruralVoters: 1.5, environmentalVoters: 1.5, suburbanModerates: 0.8 }, regions: { northValley: 1.3, coastalBend: 0.5 }, money: -1500, trust: 1.2 } }
    ]
  },
  {
    id: "studentProtest",
    title: "Student Protest at the University",
    body: "Students march over tuition, housing, and climate. They invite you to speak, but some signs attack both major parties.",
    choices: [
      { label: "Speak at the protest.", text: "Young voters respond. Opponents call it pandering.", effects: { groups: { collegeStudents: 4, environmentalVoters: 1.5, seniors: -1 }, regions: { universityDistrict: 2 }, media: 2 } },
      { label: "Meet organizers privately and release commitments later.", text: "The movement gets access, and you keep control of the message.", effects: { groups: { collegeStudents: 2, urbanProfessionals: 1 }, regions: { universityDistrict: 1.2 }, trust: 1 } },
      { label: "Praise civic engagement but skip the event.", text: "No blowup, no spark.", effects: { groups: { collegeStudents: -1.4, suburbanModerates: 0.6 }, energy: 1 } }
    ]
  },
  {
    id: "editorialBoard",
    title: "The Editorial Board Interview",
    body: "The Capital Heights Gazette asks for exact numbers, not slogans. Your staff slides a thick briefing book across the table.",
    choices: [
      { label: "Answer with details, even where the answer is complicated.", text: "The interview is dry and credible.", effects: { trust: 2.4, media: 1, groups: { urbanProfessionals: 1.5, publicSectorWorkers: 1, suburbanModerates: 1 }, regions: { capitalHeights: 1.8 } } },
      { label: "Keep answers short and message-focused.", text: "You avoid traps but look rehearsed.", effects: { media: 1, trust: -0.3, groups: { suburbanModerates: -0.4 } } },
      { label: "Challenge the paper's assumptions.", text: "Supporters like the pushback. The endorsement probably moved away.", effects: { media: 3, trust: -1, groups: { collegeStudents: 0.8, urbanProfessionals: -1.2 } } }
    ]
  },
  {
    id: "misquote",
    title: "A Misquoted Line",
    body: "A local outlet reports that you called a neighborhood 'unserious.' The recording shows you said its concerns were 'serious.' The correction will not travel as far.",
    choices: [
      { label: "Demand a correction immediately.", text: "The campaign looks forceful, but the dispute keeps the line alive.", effects: { trust: 0.8, media: 3, regions: { ridgeTowns: -0.4 } } },
      { label: "Release the clip and move on.", text: "The cleanest repair is also the least satisfying.", effects: { trust: 1.8, media: 1 } },
      { label: "Call the reporter privately before posting anything.", text: "You protect relationships and risk seeming slow.", effects: { trust: 1, media: -1, capital: 1 } }
    ]
  },
  {
    id: "clinicClosure",
    title: "A Rural Clinic May Close",
    body: "North Valley's only late-night clinic says staffing costs may force it to shut its doors. Seniors and farm families ask what state government is for.",
    choices: [
      { label: "Propose emergency rural clinic grants.", text: "The promise is costly and concrete.", effects: { groups: { ruralVoters: 3, seniors: 2, healthcareWorkers: 1.5, smallBusiness: -0.5 }, regions: { northValley: 2.5 }, money: -3000, trust: 1 } },
      { label: "Call for telehealth expansion and mobile units.", text: "It sounds modern, though some voters still want a door with lights on.", effects: { groups: { ruralVoters: 1.6, healthcareWorkers: 1, urbanProfessionals: 0.8 }, regions: { northValley: 1.5, ridgeTowns: 0.8 }, trust: 0.8 } },
      { label: "Ask the hospital network to explain its finances.", text: "Accountability language is popular until people ask what happens Monday.", effects: { media: 2, trust: 0.5, groups: { seniors: -0.5, suburbanModerates: 0.8 } } }
    ]
  },
  {
    id: "immigrantMarket",
    title: "A Market Owner Invites You In",
    body: "At a family-owned grocery in Harbor City, the owner asks why campaigns remember immigrant neighborhoods only near election day.",
    choices: [
      { label: "Admit the pattern and commit to language-access offices.", text: "The answer is humble and specific.", effects: { groups: { immigrantCommunities: 4, smallBusiness: 1, urbanProfessionals: 0.5 }, regions: { harborCity: 1.8 }, trust: 2 } },
      { label: "Pivot to small-business taxes and permits.", text: "Useful, but it sidesteps the question.", effects: { groups: { smallBusiness: 2, immigrantCommunities: 0.5 }, regions: { harborCity: 0.8 }, trust: -0.2 } },
      { label: "Ask the owner to host a listening session.", text: "Relationship first, headline second.", effects: { groups: { immigrantCommunities: 2, workingClass: 0.8 }, regions: { harborCity: 1.2 }, volunteers: 6, trust: 1 } }
    ]
  },
  {
    id: "transitBreakdown",
    title: "The Main Bus Line Breaks Down",
    body: "A week of transit failures strands workers and students. Commentators ask whether state candidates notice ordinary inconvenience.",
    choices: [
      { label: "Ride the route and hold a press gaggle at the depot.", text: "The image is direct. The policy still needs depth.", effects: { groups: { workingClass: 1.5, collegeStudents: 1.5, urbanProfessionals: 1 }, regions: { harborCity: 1.3, universityDistrict: 1 }, media: 3, trust: 0.6 } },
      { label: "Release a transit reliability plan.", text: "Less visual, more serious.", effects: { groups: { urbanProfessionals: 2, publicSectorWorkers: 1, suburbanModerates: 0.7 }, regions: { capitalHeights: 1, harborCity: 1 }, trust: 1.4 } },
      { label: "Say local agencies should handle operations.", text: "Fiscal conservatives nod. Riders hear distance.", effects: { groups: { smallBusiness: 1, collegeStudents: -1.4, workingClass: -1 }, regions: { harborCity: -1, universityDistrict: -0.8 } } }
    ]
  },
  {
    id: "smallTownPaper",
    title: "The Small-Town Paper Endorsement",
    body: "The North Valley Ledger offers a long interview. It will not reach many people, but the people it reaches read every word.",
    choices: [
      { label: "Spend the afternoon with the paper.", text: "A slow, local trust play.", effects: { regions: { northValley: 1.8, ridgeTowns: 0.7 }, groups: { ruralVoters: 1.7, seniors: 0.8 }, trust: 1.5, energy: -1 } },
      { label: "Send written answers to preserve the schedule.", text: "Responsible, but not memorable.", effects: { regions: { northValley: 0.5 }, trust: 0.4 } },
      { label: "Skip it for a televised segment.", text: "More eyeballs, fewer neighbors.", effects: { media: 3, regions: { northValley: -1 }, groups: { ruralVoters: -1 } } }
    ]
  },
  {
    id: "budgetShortfall",
    title: "A Budget Report Lands Badly",
    body: "State analysts project a revenue shortfall next year. Every promise now sounds heavier.",
    choices: [
      { label: "Revise your platform and name the tradeoffs.", text: "It hurts, but it sounds adult.", effects: { trust: 3, capital: 1, groups: { suburbanModerates: 2, teachers: -0.6, environmentalVoters: -0.5 } } },
      { label: "Argue that growth will close the gap.", text: "Optimistic voters like it. Analysts do not.", effects: { groups: { smallBusiness: 1.5, suburbanModerates: -0.8, publicSectorWorkers: -1 }, trust: -1, money: 1000 } },
      { label: "Attack the report as politically timed.", text: "The base may rally, but trust takes a bruise.", effects: { media: 3, trust: -2, groups: { collegeStudents: 0.8, urbanProfessionals: -1.5 } } }
    ]
  },
  {
    id: "broadband",
    title: "A Broadband Meeting Turns Personal",
    body: "A parent in Ridge Towns describes driving two children to a parking lot for reliable homework internet.",
    choices: [
      { label: "Make rural broadband a named priority.", text: "The issue becomes a bridge between practical voters and future-focused ones.", effects: { groups: { ruralVoters: 2, parents: 2, smallBusiness: 1, collegeStudents: 0.8 }, regions: { ridgeTowns: 1.6, northValley: 1.2 }, trust: 1 } },
      { label: "Tie it to private-sector incentives.", text: "Business groups like the structure; some voters doubt it reaches them soon.", effects: { groups: { smallBusiness: 2, ruralVoters: 1, publicSectorWorkers: -0.5 }, regions: { ridgeTowns: 1 }, money: -900 } },
      { label: "Fold it into a broader infrastructure speech later.", text: "The answer is tidy and forgettable.", effects: { groups: { parents: -0.6 }, media: -1 } }
    ]
  },
  {
    id: "laborStrike",
    title: "A Warehouse Strike Begins",
    body: "Warehouse workers on the edge of Harbor City strike over schedules and heat safety. The company calls the action irresponsible.",
    choices: [
      { label: "Walk the picket line.", text: "Workers believe you. Management and some moderates bristle.", effects: { groups: { unionMembers: 4, workingClass: 2, smallBusiness: -1.5, suburbanModerates: -1 }, regions: { harborCity: 1.5, ironCounty: 1.2 }, media: 2 } },
      { label: "Call for mediation and heat-safety standards.", text: "It is less dramatic and easier to defend.", effects: { groups: { unionMembers: 2, workingClass: 1, suburbanModerates: 1 }, regions: { ironCounty: 1, pineSuburbs: 0.5 }, trust: 1.4 } },
      { label: "Stay neutral and emphasize supply chain stability.", text: "Business groups relax. Labor notices.", effects: { groups: { smallBusiness: 2, unionMembers: -3, workingClass: -1 }, regions: { coastalBend: 0.5, ironCounty: -1.2 } } }
    ]
  },
  {
    id: "environmentalSpill",
    title: "A Chemical Spill Near the River",
    body: "A minor industrial spill becomes a major test of trust in Iron County, where jobs and health are both on the line.",
    choices: [
      { label: "Demand a full investigation and worker protections.", text: "A careful bridge between labor and environmental concerns.", effects: { groups: { environmentalVoters: 2.5, unionMembers: 1.5, industrialWorkers: 1, smallBusiness: -0.7 }, regions: { ironCounty: 1.7 }, trust: 1.2 } },
      { label: "Condemn the company and call for tougher penalties.", text: "The line is morally clear and economically risky.", effects: { groups: { environmentalVoters: 3.5, collegeStudents: 1, industrialWorkers: -1, smallBusiness: -1.5 }, regions: { universityDistrict: 1, ironCounty: 0.4 }, media: 2 } },
      { label: "Warn against overreaction until facts are known.", text: "Moderates appreciate restraint. People near the river feel unseen.", effects: { groups: { suburbanModerates: 1, environmentalVoters: -2, healthcareWorkers: -1 }, regions: { ironCounty: -0.7 }, trust: -0.5 } }
    ]
  },
  {
    id: "attackAd",
    title: "The Opponent Airs an Attack Ad",
    body: "Your opponent runs a sharp ad calling you risky, vague, and expensive. It is unfair in places and effective in others.",
    choices: [
      { label: "Answer point by point with receipts.", text: "The response is sober and useful for persuadable voters.", effects: { trust: 2, media: 1, groups: { suburbanModerates: 1.5, urbanProfessionals: 1 }, opponentSupport: -0.6 } },
      { label: "Counterattack their record.", text: "The race gets hotter, and some undecided voters tune in.", effects: { media: 3, trust: -0.8, opponentSupport: -1.5, groups: { collegeStudents: 0.6, seniors: -0.5 } } },
      { label: "Ignore it and stay positive.", text: "The choice is admirable if the ad fades, costly if it sticks.", effects: { trust: 1, opponentSupport: 0.8, media: -1 } }
    ]
  },
  {
    id: "volunteerBurnout",
    title: "Volunteer Burnout",
    body: "The field director says volunteers are exhausted. The campaign can push through, but mistakes are creeping into the voter file.",
    choices: [
      { label: "Call a reset day and thank the volunteers publicly.", text: "You lose contact volume and regain human capacity.", effects: { volunteers: 8, energy: 2, trust: 1.5, media: 1, regions: { universityDistrict: -0.3 } } },
      { label: "Keep the pressure on through election day.", text: "The numbers look better this week. The people may not.", effects: { volunteers: -8, regionTurnoutAll: 0.6, trust: -0.8, energy: -1 } },
      { label: "Ask local captains to redesign shifts.", text: "The quieter managerial answer works better than a speech.", effects: { volunteers: 3, regionTurnoutAll: 0.4, trust: 0.8 } }
    ]
  },
  {
    id: "finalDebate",
    title: "The Final Debate",
    body: "The last debate is less about one perfect line than about whether voters can imagine you doing the job on a bad day.",
    weekMin: 8,
    choices: [
      { label: "Be calm, detailed, and relentlessly practical.", text: "You look prepared. The clips are not electric, but trust rises.", effects: { trust: 2.5, media: 2, groups: { suburbanModerates: 2, publicSectorWorkers: 1, teachers: 0.8 }, debate: 2 } },
      { label: "Draw sharp contrasts with the opponent.", text: "The debate becomes memorable, for better and worse.", effects: { media: 5, trust: -0.5, opponentSupport: -1.5, groups: { collegeStudents: 1, seniors: -0.5 } } },
      { label: "Tell a personal story about why this race matters.", text: "A vulnerable answer travels if it feels earned.", effects: { trust: 2, media: 3, groups: { parents: 1.2, workingClass: 1, immigrantCommunities: 0.8 } } }
    ]
  },
  {
    id: "endorsementDilemma",
    title: "An Endorsement With Conditions",
    body: "A respected civic group offers an endorsement, but asks you to make its issue one of your top three priorities.",
    choices: [
      { label: "Accept and adjust the campaign calendar.", text: "The endorsement helps. The calendar gets tighter.", effects: { media: 2, trust: 1, capital: 1, volunteers: 5, energy: -1 } },
      { label: "Accept only without conditions.", text: "You may lose the endorsement, but the boundary is real.", effects: { trust: 2, capital: -1, media: -1 } },
      { label: "Decline quietly.", text: "No public fight, no public benefit.", effects: { energy: 1, capital: -0.5 } }
    ]
  },
  {
    id: "newspaperQuestion",
    title: "The One-Sentence Test",
    body: "A reporter asks for your campaign's purpose in one plain sentence. The answer will be printed as-is.",
    choices: [
      { label: "Say, 'Government should make ordinary life less precarious.'", text: "A values-first answer that resonates with voters seeking help.", effects: { groups: { workingClass: 2, teachers: 1, smallBusiness: -0.6 }, trust: 1.2, media: 1 } },
      { label: "Say, 'We can fix basics without turning every problem into a war.'", text: "A competence frame that travels well in swing areas.", effects: { groups: { suburbanModerates: 2, parents: 1, urbanProfessionals: 1 }, trust: 1.2, regions: { pineSuburbs: 1 } } },
      { label: "Say, 'This district needs courage, not caretaking.'", text: "The sharper line excites some voters and alarms others.", effects: { media: 2, groups: { collegeStudents: 1, veterans: 1, seniors: -1, suburbanModerates: -0.7 } } }
    ]
  }
];
