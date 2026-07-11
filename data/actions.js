window.CommonPagesCivicData.actions = [
  {
    id: "rally",
    name: "Hold a rally",
    category: "Field",
    target: "region",
    text: "A visible show of enthusiasm that helps supporters feel the campaign is real.",
    cost: { time: 1, energy: 1, money: 3500 },
    effects: { regionSupport: 1.4, regionTurnout: 1.2, volunteers: 6, media: 2 }
  },
  {
    id: "townHall",
    name: "Host a town hall",
    category: "Field",
    target: "region",
    text: "Lower-gloss, higher-trust campaigning with a chance to surface local worries.",
    cost: { time: 1, energy: 1, money: 2000 },
    effects: { regionSupport: 1.1, trust: 2, media: 1 },
    risk: { chance: 0.18, trust: -1, media: 2, log: "A tense question clipped your momentum, but the room appreciated the attempt." }
  },
  {
    id: "canvass",
    name: "Door-to-door canvassing",
    category: "Ground game",
    target: "region",
    text: "Volunteers talk to voters, update lists, and find unlikely supporters.",
    cost: { time: 1, energy: 1, volunteers: 10 },
    effects: { regionSupport: 0.8, regionTurnout: 2.2, trust: 1 }
  },
  {
    id: "phonebank",
    name: "Phonebank likely voters",
    category: "Ground game",
    target: "region",
    text: "Less romantic than a rally, but useful when the list is good.",
    cost: { time: 1, energy: 1, volunteers: 6, money: 800 },
    effects: { regionTurnout: 1.6, groupTurnout: 0.4 }
  },
  {
    id: "voterRegistration",
    name: "Voter registration drive",
    category: "Ground game",
    target: "region",
    text: "A slow-building turnout play, strongest where friendly voters are under-registered.",
    cost: { time: 1, energy: 1, money: 1600, volunteers: 8 },
    effects: { regionTurnout: 2.6, volunteers: 4 },
    groupEffects: { collegeStudents: { turnout: 1.6 }, immigrantCommunities: { turnout: 1.3 }, workingClass: { turnout: 0.8 } }
  },
  {
    id: "fieldOffice",
    name: "Open a field office",
    category: "Ground game",
    target: "region",
    text: "An expensive regional base that keeps paying off through turnout.",
    cost: { time: 1, energy: 1, money: 9000, staff: 1 },
    effects: { regionSupport: 0.7, regionTurnout: 3.2, volunteers: 10 },
    oncePerRegion: true
  },
  {
    id: "fundraiser",
    name: "Fundraising event",
    category: "Resources",
    target: "region",
    text: "Turns elite attention and local networks into cash, with a small authenticity cost.",
    cost: { time: 1, energy: 1, trust: 0 },
    effects: { money: 16000, media: 1, trust: -0.6, capital: 1 }
  },
  {
    id: "smallDonors",
    name: "Small-dollar email push",
    category: "Resources",
    target: "none",
    text: "A message to supporters that raises money without leaving headquarters.",
    cost: { energy: 1, media: 0 },
    effects: { money: 6500, volunteers: 2, trust: 0.4 }
  },
  {
    id: "hireStaff",
    name: "Hire campaign staff",
    category: "Resources",
    target: "none",
    text: "Professional capacity makes later choices more effective.",
    cost: { money: 12000 },
    effects: { staff: 2, trust: 0.4 }
  },
  {
    id: "digitalAds",
    name: "Run digital ads",
    category: "Media",
    target: "group",
    text: "A precise persuasion buy that works best on voters who already browse political content.",
    cost: { money: 8500, energy: 1 },
    effects: { groupSupport: 2.2, media: 3 },
    groupEffects: { collegeStudents: { support: 0.8 }, urbanProfessionals: { support: 0.8 }, suburbanModerates: { support: 0.5 } }
  },
  {
    id: "broadcastAd",
    name: "Release broadcast ad",
    category: "Media",
    target: "region",
    text: "Costly, broad, and blunt. Good for name recognition in large regions.",
    cost: { money: 18000, energy: 1 },
    effects: { regionSupport: 1.8, media: 4 },
    risk: { chance: 0.12, trust: -1, log: "Fact-checkers found a fuzzy claim in the ad. The correction blunted its effect." }
  },
  {
    id: "opEd",
    name: "Publish an op-ed",
    category: "Writing",
    target: "none",
    text: "A written argument that helps voters understand the campaign's thinking.",
    cost: { time: 1, energy: 1 },
    effects: { trust: 2.2, media: 2, capital: 1 },
    issueMomentum: 1
  },
  {
    id: "policySpeech",
    name: "Deliver policy speech",
    category: "Writing",
    target: "group",
    text: "A longer-form case for an issue, useful with voters who care about substance.",
    cost: { time: 1, energy: 1, money: 2200 },
    effects: { groupSupport: 2.5, trust: 1.4, media: 2, capital: 1 }
  },
  {
    id: "debatePrep",
    name: "Debate prep",
    category: "Strategy",
    target: "none",
    text: "Practice hard questions, rehearse a clean answer, and prepare for the debate hall.",
    cost: { time: 1, energy: 1, staff: 1 },
    effects: { debate: 15, trust: 1.2, media: 1 }
  },
  {
    id: "oppoResearch",
    name: "Opposition research",
    category: "Strategy",
    target: "none",
    text: "Find a contrast. It can help, but mean-spirited politics drains trust.",
    cost: { time: 1, energy: 1, money: 4000, staff: 1 },
    effects: { opponentSupport: -1.2, media: 2, trust: -0.4 }
  },
  {
    id: "localLeaders",
    name: "Meet local leaders",
    category: "Coalition",
    target: "region",
    text: "Quiet meetings with pastors, neighborhood chairs, nonprofit heads, and civic clubs.",
    cost: { time: 1, energy: 1, capital: 1 },
    effects: { regionSupport: 1, trust: 1.6, volunteers: 5 }
  },
  {
    id: "seekEndorsement",
    name: "Seek endorsement",
    category: "Coalition",
    target: "endorsement",
    text: "Ask an organization to put its credibility behind you.",
    cost: { time: 1, energy: 1, capital: 2 },
    effects: { media: 2, trust: 0.8 }
  },
  {
    id: "spanishOutreach",
    name: "Spanish-language outreach",
    category: "Coalition",
    target: "region",
    text: "Language access and relationship work, strongest when it begins before the final stretch.",
    cost: { time: 1, energy: 1, money: 2800, volunteers: 4 },
    effects: { regionSupport: 0.7, regionTurnout: 1.4, trust: 1 },
    groupEffects: { immigrantCommunities: { support: 2.8, turnout: 1.8 }, workingClass: { support: 0.6 } }
  },
  {
    id: "schoolVisit",
    name: "Visit a school",
    category: "Local issue",
    target: "region",
    text: "A classroom visit that works only if your education answers are concrete.",
    cost: { time: 1, energy: 1, money: 800 },
    effects: { regionSupport: 0.8, trust: 1 },
    groupEffects: { parents: { support: 1.4 }, teachers: { support: 1.8 } }
  },
  {
    id: "unionHall",
    name: "Visit a union hall",
    category: "Local issue",
    target: "region",
    text: "A direct conversation about wages, schedules, and whether the campaign really listens.",
    cost: { time: 1, energy: 1, capital: 1 },
    effects: { regionSupport: 0.8, trust: 0.8 },
    groupEffects: { unionMembers: { support: 2.5, turnout: 1 }, workingClass: { support: 1.2 }, smallBusiness: { support: -0.5 } }
  },
  {
    id: "clinicVisit",
    name: "Visit a clinic",
    category: "Local issue",
    target: "region",
    text: "A health care stop that humanizes the campaign if it avoids easy promises.",
    cost: { time: 1, energy: 1, money: 1000 },
    effects: { regionSupport: 0.7, trust: 1.3 },
    groupEffects: { healthcareWorkers: { support: 2.4 }, seniors: { support: 1.2 }, ruralVoters: { support: 0.8 } }
  },
  {
    id: "farmRoundtable",
    name: "Farm roundtable",
    category: "Local issue",
    target: "region",
    text: "A rural visit centered on water, fuel, roads, and hospital distance.",
    cost: { time: 1, energy: 1, money: 1600 },
    effects: { regionSupport: 1.2, trust: 1 },
    groupEffects: { ruralVoters: { support: 2.2 }, smallBusiness: { support: 0.8 }, environmentalVoters: { support: -0.4 } }
  },
  {
    id: "businessWalk",
    name: "Small-business walk",
    category: "Local issue",
    target: "region",
    text: "A main-street tour of rent, insurance, hiring, and permitting concerns.",
    cost: { time: 1, energy: 1, money: 1200 },
    effects: { regionSupport: 0.7, trust: 0.9 },
    groupEffects: { smallBusiness: { support: 2.5 }, immigrantCommunities: { support: 0.8 }, unionMembers: { support: -0.4 } }
  },
  {
    id: "restDay",
    name: "Rest and reset",
    category: "Health",
    target: "none",
    text: "A disciplined campaign leaves room to think, sleep, and stop avoidable mistakes.",
    cost: { time: 1 },
    effects: { energy: 3, trust: 0.5 }
  }
];
