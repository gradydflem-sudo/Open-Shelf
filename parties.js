window.CommonPagesCivicData.parties = [
  {
    id: "civicLabor",
    name: "Civic Labor Party",
    shortName: "Labor",
    description: "A worker-focused party built around public services, wages, and practical reforms.",
    ideologyTags: ["progressive", "liberal", "social-democratic"],
    resourceModifiers: { money: -6000, volunteers: 18, trust: 2, capital: 2 },
    groupModifiers: { workingClass: 4, unionMembers: 6, teachers: 3, smallBusiness: -2, suburbanModerates: -1 },
    issueAffinities: ["labor", "education", "healthcare", "housing"]
  },
  {
    id: "libertyReform",
    name: "Liberty Reform Party",
    shortName: "Reform",
    description: "A civil-liberties and market-reform party with a donor network and reformist tone.",
    ideologyTags: ["liberal", "libertarian", "moderate"],
    resourceModifiers: { money: 8000, volunteers: 4, trust: 1, capital: 1 },
    groupModifiers: { smallBusiness: 5, urbanProfessionals: 3, suburbanModerates: 3, unionMembers: -2 },
    issueAffinities: ["taxes", "government", "technology", "civilRights"]
  },
  {
    id: "greenFuture",
    name: "Green Future Alliance",
    shortName: "Green",
    description: "A climate-centered alliance that pairs ecological policy with local democracy.",
    ideologyTags: ["green", "progressive"],
    resourceModifiers: { money: -4000, volunteers: 12, trust: 1, capital: 1 },
    groupModifiers: { environmentalVoters: 8, collegeStudents: 5, coastalResidents: 3, industrialWorkers: -2, ruralVoters: -1 },
    issueAffinities: ["climate", "transportation", "housing", "government"]
  },
  {
    id: "traditionalUnion",
    name: "Traditional Union Party",
    shortName: "Union",
    description: "A conservative party focused on order, family institutions, taxes, and local control.",
    ideologyTags: ["conservative", "traditionalist"],
    resourceModifiers: { money: 6000, volunteers: 6, trust: 0, capital: 2 },
    groupModifiers: { religiousVoters: 6, seniors: 4, ruralVoters: 4, smallBusiness: 3, collegeStudents: -4 },
    issueAffinities: ["publicSafety", "taxes", "ruralDevelopment", "education"]
  },
  {
    id: "peopleCooperative",
    name: "People's Cooperative Party",
    shortName: "Co-op",
    description: "A left-populist party emphasizing economic democracy and anti-monopoly politics.",
    ideologyTags: ["populist", "socialist", "progressive"],
    resourceModifiers: { money: -9000, volunteers: 22, trust: 1, capital: -1 },
    groupModifiers: { workingClass: 5, unionMembers: 7, collegeStudents: 4, smallBusiness: -3, donors: -5 },
    issueAffinities: ["labor", "taxes", "housing", "healthcare"]
  },
  {
    id: "nationalRenewal",
    name: "National Renewal Party",
    shortName: "Renewal",
    description: "A populist-national party promising industrial revival, border control, and visible strength.",
    ideologyTags: ["populist", "nationalist", "conservative"],
    resourceModifiers: { money: 1000, volunteers: 14, trust: -1, capital: 0 },
    groupModifiers: { ruralVoters: 5, veterans: 5, industrialWorkers: 3, immigrantCommunities: -5, urbanProfessionals: -3 },
    issueAffinities: ["publicSafety", "industry", "immigration", "infrastructure"]
  },
  {
    id: "independentReform",
    name: "Independent Reform Movement",
    shortName: "Independent",
    description: "A cross-partisan ticket with weak party machinery but room to build unusual coalitions.",
    ideologyTags: ["moderate", "technocratic", "anti-corruption"],
    resourceModifiers: { money: -2000, volunteers: 2, trust: 4, capital: -2 },
    groupModifiers: { suburbanModerates: 5, urbanProfessionals: 2, veterans: 2, unionMembers: -1, religiousVoters: -1 },
    issueAffinities: ["government", "budget", "education", "infrastructure"]
  }
];
