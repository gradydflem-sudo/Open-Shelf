(function () {
  const data = window.CommonPagesCivicData;
  if (!data) return;

  data.voterGroups.push(
    { id: "democrats", name: "Democratic voters", size: 34, turnout: 66, support: 56, issues: ["healthcare", "civil rights", "education"], persuasion: 0.75 },
    { id: "republicans", name: "Republican voters", size: 33, turnout: 68, support: 42, issues: ["taxes", "public safety", "local control"], persuasion: 0.75 },
    { id: "moderates", name: "Moderates", size: 18, turnout: 61, support: 50, issues: ["competence", "cost of living", "public safety"], persuasion: 1.05 },
    { id: "progressives", name: "Progressives", size: 14, turnout: 63, support: 58, issues: ["climate", "housing", "labor"], persuasion: 0.9 },
    { id: "conservatives", name: "Conservatives", size: 18, turnout: 70, support: 43, issues: ["taxes", "public safety", "family policy"], persuasion: 0.85 },
    { id: "latinoVoters", name: "Latino voters", size: 9, turnout: 55, support: 53, issues: ["schools", "jobs", "healthcare"], persuasion: 1 },
    { id: "blackVoters", name: "Black voters", size: 10, turnout: 60, support: 58, issues: ["civil rights", "schools", "public safety"], persuasion: 0.95 },
    { id: "asianAmericanVoters", name: "Asian American voters", size: 5, turnout: 57, support: 52, issues: ["education", "small business", "public safety"], persuasion: 1 },
    { id: "nativeVoters", name: "Native voters", size: 2, turnout: 51, support: 52, issues: ["sovereignty", "healthcare access", "land and water"], persuasion: 1 },
    { id: "collegeEducated", name: "College-educated voters", size: 28, turnout: 70, support: 54, issues: ["government ethics", "climate", "schools"], persuasion: 0.9 },
    { id: "nonCollegeVoters", name: "Non-college voters", size: 46, turnout: 60, support: 47, issues: ["wages", "cost of living", "public safety"], persuasion: 1.05 },
    { id: "renters", name: "Renters", size: 11, turnout: 52, support: 57, issues: ["housing", "transit", "wages"], persuasion: 1.1 },
    { id: "homeowners", name: "Homeowners", size: 17, turnout: 74, support: 48, issues: ["property taxes", "schools", "zoning"], persuasion: 0.85 },
    { id: "civilLibertarians", name: "Civil libertarians", size: 6, turnout: 61, support: 54, issues: ["privacy", "speech", "justice reform"], persuasion: 1 },
    { id: "partyActivists", name: "Party activists", size: 7, turnout: 76, support: 58, issues: ["ideology", "party loyalty", "appointments"], persuasion: 0.9 },
    { id: "independents", name: "Independents", size: 14, turnout: 62, support: 50, issues: ["competence", "ethics", "cost of living"], persuasion: 1.05 },
    { id: "donors", name: "Major donors", size: 4, turnout: 82, support: 46, issues: ["taxes", "business climate", "access"], persuasion: 0.75 },
    { id: "fiscalConservatives", name: "Fiscal conservatives", size: 9, turnout: 70, support: 42, issues: ["taxes", "deficit", "business climate"], persuasion: 0.85 }
  );

  data.regions.push(
    {
      id: "mesaCrossing",
      name: "Mesa Crossing",
      type: "Fast-growing exurb",
      population: 88000,
      electoralValue: 10,
      turnout: 65,
      baselineSupport: 46,
      lean: 8,
      economy: 62,
      education: 55,
      industries: ["construction", "logistics", "family retail"],
      concerns: ["roads", "property taxes", "school crowding", "water"],
      groups: { homeowners: 24, parents: 18, smallBusiness: 12, suburbanModerates: 14, fiscalConservatives: 9 },
      notes: "Growth brings opportunity and resentment. Voters want planning without being lectured."
    },
    {
      id: "southworks",
      name: "Southworks",
      type: "Warehouse and apartment belt",
      population: 112000,
      electoralValue: 13,
      turnout: 54,
      baselineSupport: 53,
      lean: -9,
      economy: 44,
      education: 49,
      industries: ["warehousing", "food processing", "apartment services"],
      concerns: ["wages", "rent", "heat safety", "bus reliability"],
      groups: { renters: 28, workingClass: 24, immigrantCommunities: 18, unionMembers: 8, healthcareWorkers: 5 },
      notes: "A strong turnout operation can unlock votes here, but last-minute outreach feels transactional."
    },
    {
      id: "oldCapitol",
      name: "Old Capitol",
      type: "Historic civic quarter",
      population: 57000,
      electoralValue: 7,
      turnout: 69,
      baselineSupport: 51,
      lean: -4,
      economy: 67,
      education: 79,
      industries: ["courts", "museums", "public administration"],
      concerns: ["ethics", "preservation", "privacy", "public records"],
      groups: { publicSectorWorkers: 22, civilLibertarians: 12, urbanProfessionals: 18, seniors: 10, independents: 12 },
      notes: "Good-government details matter here, and so does respect for civic memory."
    },
    {
      id: "sunfield",
      name: "Sunfield",
      type: "Irrigated farm and solar towns",
      population: 76000,
      electoralValue: 9,
      turnout: 63,
      baselineSupport: 44,
      lean: 12,
      economy: 51,
      education: 46,
      industries: ["farming", "solar installation", "county services"],
      concerns: ["water", "energy jobs", "clinics", "farm credit"],
      groups: { ruralVoters: 24, environmentalVoters: 9, smallBusiness: 14, seniors: 12, veterans: 10 },
      notes: "Climate and rural development can work together here if the campaign speaks plainly."
    }
  );

  data.usStates = [
    {
      id: "pa",
      name: "Pennsylvania",
      lean: 0,
      population: 13000000,
      urbanRural: "mixed metro, small-city, and rural electorate",
      medianIncome: 73900,
      educationLevel: "mixed",
      turnout: 66,
      industries: ["healthcare", "higher education", "manufacturing", "energy", "logistics"],
      keyIssues: ["schools", "jobs", "energy", "housing", "public safety"],
      competitiveness: "swing"
    },
    {
      id: "mi",
      name: "Michigan",
      lean: -1,
      population: 10000000,
      urbanRural: "Detroit metro, mid-sized cities, manufacturing towns, and rural counties",
      medianIncome: 71600,
      educationLevel: "mixed",
      turnout: 65,
      industries: ["auto manufacturing", "healthcare", "agriculture", "clean energy"],
      keyIssues: ["jobs", "schools", "water", "labor", "roads"],
      competitiveness: "swing"
    },
    {
      id: "az",
      name: "Arizona",
      lean: 1,
      population: 7400000,
      urbanRural: "fast-growing metro suburbs, border communities, tribal nations, and rural counties",
      medianIncome: 76400,
      educationLevel: "mixed",
      turnout: 62,
      industries: ["construction", "tourism", "semiconductors", "healthcare", "agriculture"],
      keyIssues: ["water", "housing", "immigration", "schools", "growth"],
      competitiveness: "swing"
    },
    {
      id: "ga",
      name: "Georgia",
      lean: 1,
      population: 11100000,
      urbanRural: "Atlanta metro, college towns, Black Belt counties, and fast-growing suburbs",
      medianIncome: 71800,
      educationLevel: "mixed",
      turnout: 64,
      industries: ["logistics", "film", "agriculture", "higher education", "manufacturing"],
      keyIssues: ["voting rights", "growth", "schools", "healthcare access", "taxes"],
      competitiveness: "swing"
    },
    {
      id: "ca",
      name: "California",
      lean: -14,
      population: 39000000,
      urbanRural: "large metros, agricultural valleys, coastal suburbs, and inland regions",
      medianIncome: 95600,
      educationLevel: "high",
      turnout: 61,
      industries: ["technology", "agriculture", "entertainment", "logistics", "clean energy"],
      keyIssues: ["housing", "climate", "transportation", "immigration", "budget"],
      competitiveness: "safe Democratic statewide, competitive in some districts"
    },
    {
      id: "tx",
      name: "Texas",
      lean: 7,
      population: 31000000,
      urbanRural: "major metros, suburbs, border communities, energy regions, and rural counties",
      medianIncome: 76700,
      educationLevel: "mixed",
      turnout: 58,
      industries: ["energy", "technology", "agriculture", "logistics", "healthcare"],
      keyIssues: ["border", "energy", "taxes", "schools", "water"],
      competitiveness: "Republican-leaning statewide, mixed district politics"
    }
  ];

  data.educationLevels = [
    { id: "highSchool", name: "High School Graduate", text: "A local, practical profile with stronger working-class credibility.", skills: { organizing: 1 }, groups: { workingClass: 1, nonCollegeVoters: 2 } },
    { id: "communityCollege", name: "Community College", text: "A skills-and-service profile connected to local opportunity.", skills: { coalition: 1 }, groups: { parents: 1, workingClass: 1, smallBusiness: 1 } },
    { id: "bachelors", name: "Bachelor's Degree", text: "A conventional candidate profile with broad institutional familiarity.", skills: { policy: 1 }, groups: { collegeEducated: 1, suburbanModerates: 1 } },
    { id: "graduate", name: "Graduate Degree", text: "A credentialed profile with policy strength and some outsider skepticism.", skills: { policy: 2, debate: 1 }, groups: { collegeEducated: 2, nonCollegeVoters: -1 } },
    { id: "professional", name: "Professional Degree", text: "A law, medical, or professional profile that helps in debates, policy detail, and elite fundraising.", skills: { debate: 1, fundraising: 1, policy: 1 }, groups: { donors: 1, urbanProfessionals: 1 } }
  ];

  data.backgrounds = [
    { id: "teacher", name: "Teacher", text: "Credibility on schools and youth issues.", skills: { policy: 1, coalition: 1 }, resources: { trust: 2 }, groups: { parents: 2, teachers: 4, collegeStudents: 1 } },
    { id: "lawyer", name: "Lawyer", text: "Stronger debate instincts and legal reform credibility.", skills: { debate: 2, legislative: 1 }, resources: { debate: 6 }, groups: { urbanProfessionals: 1, civilLibertarians: 2 } },
    { id: "organizer", name: "Organizer", text: "More volunteer capacity and turnout strength.", skills: { organizing: 2, coalition: 1 }, resources: { volunteers: 18 }, groups: { workingClass: 2, unionMembers: 2 } },
    { id: "smallBusinessOwner", name: "Small Business Owner", text: "Fundraising and local-economy credibility.", skills: { fundraising: 2, media: 1 }, resources: { money: 9000 }, groups: { smallBusiness: 4, suburbanModerates: 1 } },
    { id: "journalist", name: "Journalist", text: "Better op-eds, interviews, and media handling.", skills: { media: 2, policy: 1 }, resources: { media: 4, trust: 1 }, groups: { urbanProfessionals: 2 } },
    { id: "doctor", name: "Doctor", text: "Trusted voice on healthcare and crises.", skills: { policy: 1, administration: 1 }, resources: { trust: 3 }, groups: { healthcareWorkers: 4, seniors: 2 } },
    { id: "unionRep", name: "Union Representative", text: "Deep working-class and labor network.", skills: { coalition: 2, legislative: 1 }, resources: { volunteers: 10, capital: 2 }, groups: { unionMembers: 5, workingClass: 3, smallBusiness: -1 } },
    { id: "cityPlanner", name: "City Planner", text: "Strong housing, transportation, and administrative instincts.", skills: { administration: 2, policy: 2 }, resources: { trust: 1 }, groups: { urbanProfessionals: 2, publicSectorWorkers: 2 } },
    { id: "veteran", name: "Veteran", text: "Service reputation and public-safety credibility.", skills: { debate: 1, administration: 1 }, resources: { trust: 2 }, groups: { veterans: 5, seniors: 1 } },
    { id: "policyResearcher", name: "Policy Researcher", text: "Detailed plans and stronger governing outcomes.", skills: { policy: 3 }, resources: { capital: 1 }, groups: { publicSectorWorkers: 2, urbanProfessionals: 2 } }
  ];

  data.officeLadder = [
    { id: "schoolBoard", name: "School Board", tier: 1, electorate: "local district", duties: ["school budgets", "teacher pay", "student services", "school transportation"], campaignScale: 0.62, governingPower: 0.55 },
    { id: "cityCouncil", name: "City Council", tier: 2, electorate: "city", duties: ["housing", "public safety", "local services"], campaignScale: 0.78, governingPower: 0.7 },
    { id: "mayor", name: "Mayor", tier: 3, electorate: "citywide", duties: ["administration", "budget", "executive response"], campaignScale: 0.95, governingPower: 0.9 },
    { id: "stateHouse", name: "State House Representative", tier: 4, electorate: "state legislative district", duties: ["committees", "state bills", "district services", "state budget"], campaignScale: 1, governingPower: 0.85 },
    { id: "stateSenate", name: "State Senator", tier: 5, electorate: "state senate district", duties: ["long-term legislation", "oversight", "state budget"], campaignScale: 1.18, governingPower: 0.9 },
    { id: "usHouse", name: "U.S. House Representative", tier: 6, electorate: "congressional district", duties: ["federal legislation", "committees", "constituent services", "national media"], campaignScale: 1.35, governingPower: 0.95 },
    { id: "governor", name: "Governor", tier: 7, electorate: "statewide", duties: ["cabinet appointments", "state agencies", "budget proposal", "veto power", "emergency response"], campaignScale: 1.55, governingPower: 1.25 },
    { id: "usSenate", name: "U.S. Senator", tier: 8, electorate: "statewide federal", duties: ["federal legislation", "major coalitions", "confirmations", "national leadership"], campaignScale: 1.78, governingPower: 1.1 },
    { id: "president", name: "President", tier: 9, electorate: "national", duties: ["cabinet", "federal agencies", "Congress", "foreign policy", "national crises", "reelection"], campaignScale: 2.25, governingPower: 1.6 }
  ];

  data.electionModels = [
    { id: "nonpartisanGeneral", name: "Nonpartisan local race", text: "Party still shapes voters, but the ballot is local and personal. Name recognition and trust matter heavily." },
    { id: "primaryAndGeneral", name: "Primary and general election", text: "The candidate must satisfy a party base without becoming unelectable in November." },
    { id: "safeSeatPrimary", name: "Safe-seat primary", text: "The primary is often the decisive election, while the general tests turnout and scandal resistance." },
    { id: "statewideCycle", name: "Statewide cycle", text: "Media markets, fundraising, debates, regional coalitions, and national mood all matter." },
    { id: "presidentialCycle", name: "Presidential cycle", text: "Primaries, delegate momentum, national debates, governing record, and crisis reputation collide." }
  ];

  data.staff = [
    { id: "marinCho", name: "Marin Cho", role: "Chief of Staff", ideology: "pragmatic", competence: 82, loyalty: 76, trait: "Crisis manager", effects: { administration: 2, trust: 1 } },
    { id: "eliBenton", name: "Eli Benton", role: "Communications Director", ideology: "moderate", competence: 74, loyalty: 68, trait: "Excellent media instincts", effects: { media: 2, trust: 1 } },
    { id: "tessaVale", name: "Tessa Vale", role: "Policy Director", ideology: "technocratic", competence: 86, loyalty: 62, trait: "Policy expert", effects: { policy: 3 } },
    { id: "omarKline", name: "Omar Kline", role: "Legislative Liaison", ideology: "coalitionist", competence: 78, loyalty: 70, trait: "Knows every faction leader", effects: { legislative: 3, capital: 1 } },
    { id: "ruthIbarra", name: "Ruth Ibarra", role: "Finance Director", ideology: "fiscal hawk", competence: 80, loyalty: 66, trait: "Budget discipline", effects: { budget: 2, fundraising: 1 } },
    { id: "noahReed", name: "Noah Reed", role: "Field Director", ideology: "movement", competence: 77, loyalty: 82, trait: "Excellent organizer", effects: { organizing: 3, volunteers: 8 } },
    { id: "sanaBrooks", name: "Sana Brooks", role: "Education Advisor", ideology: "progressive", competence: 79, loyalty: 73, trait: "Strong with teachers", effects: { policy: 1, groups: { teachers: 2, parents: 1 } } },
    { id: "calMorrow", name: "Cal Morrow", role: "Economic Advisor", ideology: "business-friendly", competence: 73, loyalty: 58, trait: "Donor network", effects: { budget: 1, groups: { smallBusiness: 2, unionMembers: -1 } } },
    { id: "inesPark", name: "Ines Park", role: "Housing Advisor", ideology: "abundance", competence: 81, loyalty: 64, trait: "Builder of unlikely coalitions", effects: { policy: 1, coalition: 1, groups: { renters: 2, suburbanModerates: -1 } } },
    { id: "devRaman", name: "Dev Raman", role: "Legal Counsel", ideology: "civil liberties", competence: 84, loyalty: 60, trait: "Independent thinker", effects: { legislative: 1, trust: 1 } }
  ];

  data.factions = [
    { id: "progressiveBloc", name: "Progressive Caucus", seats: 5, support: 54, priorities: ["housing", "labor", "civilRights"] },
    { id: "laborCaucus", name: "Labor Caucus", seats: 4, support: 58, priorities: ["labor", "education", "healthcare"] },
    { id: "greenAlliance", name: "Environmental Caucus", seats: 3, support: 55, priorities: ["climate", "transportation", "housing"] },
    { id: "moderateReformers", name: "Bipartisan Reform Caucus", seats: 6, support: 52, priorities: ["budget", "education", "government"] },
    { id: "businessConservatives", name: "Business Conservative Caucus", seats: 5, support: 43, priorities: ["taxes", "economicDevelopment", "budget"] },
    { id: "ruralCoalition", name: "Rural Coalition", seats: 4, support: 46, priorities: ["ruralDevelopment", "healthcare", "infrastructure"] },
    { id: "civilLiberties", name: "Civil Liberties Caucus", seats: 2, support: 51, priorities: ["civilRights", "technology", "government"] },
    { id: "independents", name: "Independent Members", seats: 3, support: 50, priorities: ["budget", "publicSafety", "ethics"] }
  ];

  data.governingPolicies = [
    { id: "universalMeals", name: "Universal School Meals", area: "Education", cost: 8, capital: 2, text: "Feed every student during the school day.", metrics: { education: 5, inequality: -2, budget: -8, approval: 2 }, groups: { parents: 3, teachers: 2, workingClass: 2, smallBusiness: -1 }, factions: { progressiveBloc: 2, laborCaucus: 2, moderateReformers: 1, businessConservatives: -2 } },
    { id: "teacherRecruitment", name: "Teacher Recruitment Plan", area: "Education", cost: 6, capital: 2, text: "Raise retention grants and create a classroom residency pipeline.", metrics: { education: 6, budget: -6, approval: 1 }, groups: { teachers: 4, parents: 2 }, factions: { laborCaucus: 2, moderateReformers: 1 } },
    { id: "zoningReform", name: "Zoning Reform", area: "Housing", cost: 3, capital: 3, text: "Allow more homes near transit and jobs.", metrics: { housing: 6, budget: -2, approval: 1 }, groups: { collegeStudents: 3, urbanProfessionals: 2, suburbanModerates: -2 }, factions: { progressiveBloc: 1, greenAlliance: 2, moderateReformers: 1, ruralCoalition: -1 } },
    { id: "housingTrust", name: "Affordable Housing Trust", area: "Housing", cost: 9, capital: 3, text: "Create a fund for affordable homes and rent support.", metrics: { housing: 7, inequality: -3, budget: -9, approval: 2 }, groups: { workingClass: 3, collegeStudents: 2, smallBusiness: -1 }, factions: { progressiveBloc: 3, laborCaucus: 1, businessConservatives: -2 } },
    { id: "clinicAccess", name: "Rural Clinic Access", area: "Healthcare", cost: 7, capital: 2, text: "Stabilize clinics and mobile care in under-served towns.", metrics: { healthcare: 6, rural: 4, budget: -7, approval: 2 }, groups: { ruralVoters: 4, seniors: 2, healthcareWorkers: 2 }, factions: { ruralCoalition: 3, moderateReformers: 1 } },
    { id: "smallBusinessPermits", name: "Small Business Permit Reform", area: "Economy", cost: 2, capital: 1, text: "Simplify permits and publish service deadlines.", metrics: { economy: 4, budget: -1, approval: 1 }, groups: { smallBusiness: 4, immigrantCommunities: 1 }, factions: { businessConservatives: 3, moderateReformers: 2 } },
    { id: "cleanEnergyJobs", name: "Clean Energy Jobs Program", area: "Climate", cost: 10, capital: 4, text: "Pair climate infrastructure with apprenticeships.", metrics: { environment: 7, economy: 2, budget: -10, approval: 1 }, groups: { environmentalVoters: 4, unionMembers: 2, ruralVoters: -1 }, factions: { greenAlliance: 3, laborCaucus: 2, businessConservatives: -2 } },
    { id: "ethicsCommission", name: "Independent Ethics Commission", area: "Anti-Corruption", cost: 3, capital: 3, text: "Create public reporting, gift rules, and independent review.", metrics: { trust: 6, budget: -3, approval: 2 }, groups: { suburbanModerates: 3, urbanProfessionals: 2, publicSectorWorkers: 1 }, factions: { moderateReformers: 3, civilLiberties: 2, independents: 1 } },
    { id: "communitySafety", name: "Community Safety Compact", area: "Public Safety", cost: 7, capital: 3, text: "Fund response times, violence prevention, and accountability metrics.", metrics: { safety: 5, trust: 2, budget: -7, approval: 1 }, groups: { parents: 2, seniors: 2, immigrantCommunities: 1, collegeStudents: 1 }, factions: { moderateReformers: 2, civilLiberties: 1, businessConservatives: 1 } },
    { id: "openRecords", name: "Open Records Expansion", area: "Government", cost: 2, capital: 2, text: "Make meetings, contracts, and public records easier to inspect.", metrics: { trust: 4, administration: 2, budget: -2 }, groups: { urbanProfessionals: 2, publicSectorWorkers: 1 }, factions: { civilLiberties: 3, moderateReformers: 2 } }
  ];

  data.governingEvents = [
    {
      id: "administrationFirstMeeting",
      title: "First Administration Meeting",
      body: "Your team gathers for the first official briefing. The campaign is over. Every promise now has a cost, a calendar, a faction count, and a future reelection consequence.",
      choices: [
        { label: "Choose one major priority and protect focus.", effects: { approval: 1, capital: 2, metrics: { administration: 2 } } },
        { label: "Move several promises at once.", effects: { approval: 2, capital: -2, metrics: { budget: -4, administration: -1 } } },
        { label: "Spend the month listening before filing bills.", effects: { approval: -1, trust: 2, capital: 1 } }
      ]
    },
    {
      id: "budgetShortfallGov",
      title: "Budget Shortfall",
      body: "Finance staff report that revenue is below forecast. The opposition says your platform was never realistic.",
      choices: [
        { label: "Delay one expensive policy and explain why.", effects: { approval: -1, trust: 3, metrics: { budget: 6 } } },
        { label: "Find savings in administration and contracts.", effects: { approval: 1, capital: -1, metrics: { budget: 4, administration: 1 } } },
        { label: "Argue the shortfall is temporary.", effects: { approval: 1, trust: -2, metrics: { budget: -4 } } }
      ]
    },
    {
      id: "teacherStrikeGov",
      title: "Teachers Threaten a Strike",
      body: "Teachers say classrooms cannot wait. Parents want stability. Your education promises are being tested in public.",
      choices: [
        { label: "Bring teachers and parents into a public bargaining session.", effects: { approval: 2, capital: -1, groups: { teachers: 3, parents: 2 }, metrics: { education: 2 } } },
        { label: "Offer a phased plan tied to the next budget.", effects: { approval: 1, trust: 1, groups: { teachers: 1, parents: 1 }, metrics: { budget: -2 } } },
        { label: "Call the strike irresponsible.", effects: { approval: -1, groups: { teachers: -4, parents: -1, smallBusiness: 1 }, metrics: { budget: 2 } } }
      ]
    },
    {
      id: "housingProtestGov",
      title: "Housing Protest",
      body: "Renters fill the plaza with cardboard keys. Homeowners arrive an hour later warning against rushed reforms.",
      choices: [
        { label: "Pair zoning reform with anti-displacement funds.", effects: { approval: 2, capital: -2, groups: { collegeStudents: 2, workingClass: 2, suburbanModerates: -1 }, metrics: { housing: 4, budget: -4 } } },
        { label: "Create a citizen housing commission.", effects: { trust: 2, approval: 0, metrics: { housing: 1 } } },
        { label: "Tell both sides the market needs patience.", effects: { approval: -2, groups: { smallBusiness: 1, collegeStudents: -2 }, metrics: { housing: -1 } } }
      ]
    },
    {
      id: "staffLeakGov",
      title: "A Staff Memo Leaks",
      body: "A private memo describing faction weaknesses appears online. The content is mostly accurate, which makes it worse.",
      choices: [
        { label: "Take responsibility and tighten internal process.", effects: { trust: 2, approval: -1, metrics: { administration: 2 } } },
        { label: "Blame political opponents.", effects: { trust: -3, approval: 1, media: 3 } },
        { label: "Ask Legal Counsel to investigate quietly.", effects: { trust: 1, capital: -1, metrics: { administration: 1 } } }
      ]
    },
    {
      id: "transportFailureGov",
      title: "Transit Failure",
      body: "A week of bus breakdowns strands students, workers, and nurses. The administration meeting begins with a map full of red lines.",
      choices: [
        { label: "Emergency repair order and daily public updates.", effects: { approval: 2, trust: 1, metrics: { budget: -5, administration: 2, economy: 1 } } },
        { label: "Launch a long-term reliability audit.", effects: { approval: 0, trust: 2, metrics: { transportation: 3 } } },
        { label: "Say the agency board owns operations.", effects: { approval: -2, trust: -1, metrics: { budget: 1 } } }
      ]
    }
  ];

  data.civicTutorial = [
    { title: "Premise", body: "In The Common Republic, you begin in a small U.S. local race, then try to build a public career through elections, governing, policy tradeoffs, and reputation." },
    { title: "Resources", body: "Money buys communication. Time and energy limit your week. Volunteers improve turnout. Public trust changes how voters interpret every promise and mistake." },
    { title: "Voter Groups", body: "Actions move regions and groups differently. A town hall can help parents and teachers, but it still costs time and energy you cannot spend elsewhere." },
    { title: "Polling", body: "Canvassing a swing neighborhood improves persuasion and turnout. Polls move, but they include uncertainty, late events, and ground-game effects." },
    { title: "Campaign Event", body: "Written events force public choices. A newspaper answer, debate moment, or local crisis can build trust with one coalition while worrying another." },
    { title: "Election to Governing", body: "Winning is not the end. In office, you appoint staff, manage a budget, negotiate with factions, pass policies, handle crises, and prepare for the next race." }
  ];

  data.events.push(
    {
      id: "pollingSurge",
      title: "A Polling Surge",
      body: "A public poll shows you ahead for the first time. Supporters are thrilled; your field director warns that complacency is contagious.",
      choices: [
        { label: "Use the momentum to recruit volunteers.", text: "You turn attention into capacity.", effects: { volunteers: 16, media: 2, trust: 0.5 } },
        { label: "Fundraise hard while donors are watching.", text: "Money arrives, but the campaign looks a little less grassroots.", effects: { money: 18000, trust: -0.8 } },
        { label: "Tell supporters the race is still tied.", text: "The sober message keeps urgency alive.", effects: { trust: 1.5, regionTurnoutAll: 0.5 } }
      ]
    },
    {
      id: "opponentScandal",
      title: "Opponent Ethics Story",
      body: "A watchdog group reports that your opponent blurred the line between public office and private fundraising. Reporters ask if you will attack.",
      choices: [
        { label: "Call for an investigation and keep the tone institutional.", text: "You look serious without sounding gleeful.", effects: { trust: 2, opponentSupport: -1.4, media: 2 } },
        { label: "Make it the center of your closing argument.", text: "The attack lands, but the race gets more bitter.", effects: { opponentSupport: -2.2, trust: -0.8, media: 4 } },
        { label: "Say voters care more about daily costs.", text: "You avoid seeming opportunistic but leave a weapon unused.", effects: { trust: 1, groups: { suburbanModerates: 0.8 }, opponentSupport: -0.4 } }
      ]
    },
    {
      id: "youthTurnoutDrive",
      title: "Youth Turnout Coalition",
      body: "Student organizers offer to build a turnout drive if the campaign gives them real responsibility, not a photo op.",
      choices: [
        { label: "Give organizers a budget and a seat at the table.", text: "They respond to trust with energy.", effects: { money: -2500, volunteers: 12, groups: { collegeStudents: 3 }, regions: { universityDistrict: 2 } } },
        { label: "Ask them to plug into the existing field plan.", text: "Efficient, but less inspiring.", effects: { volunteers: 5, groups: { collegeStudents: 1 }, regions: { universityDistrict: 0.8 } } },
        { label: "Keep youth outreach message-controlled.", text: "No chaos, little enthusiasm.", effects: { trust: -0.8, groups: { collegeStudents: -1.4 } } }
      ]
    },
    {
      id: "candidateMistake",
      title: "A Tired Candidate Misspeaks",
      body: "After three events and too little sleep, you mix up two towns during a speech. The clip is small but painful.",
      choices: [
        { label: "Apologize plainly and revisit the town.", text: "A mistake becomes a relationship repair.", effects: { trust: 1.5, energy: -1, media: 1 } },
        { label: "Laugh it off.", text: "Some appreciate the humor; others wanted respect.", effects: { media: 2, trust: -0.4 } },
        { label: "Blame the schedule and move on.", text: "The explanation sounds like an excuse.", effects: { trust: -1.5, energy: 1 } }
      ]
    }
  );
})();
