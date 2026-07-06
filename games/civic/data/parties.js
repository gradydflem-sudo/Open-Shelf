window.CommonPagesCivicData.parties = [
  {
    id: "democratic",
    name: "Democratic Party",
    shortName: "Democrat",
    description: "A broad center-left coalition where primaries often revolve around public services, civil rights, climate, labor, and governing competence.",
    ideologyTags: ["progressiveDemocrat", "liberalDemocrat", "moderateDemocrat", "conservativeDemocrat"],
    resourceModifiers: { money: 2000, volunteers: 10, trust: 1, capital: 2 },
    groupModifiers: { teachers: 4, unionMembers: 4, environmentalVoters: 3, collegeStudents: 3, immigrantCommunities: 3, urbanProfessionals: 2, workingClass: 1, ruralVoters: -2, religiousVoters: -1 },
    issueAffinities: ["healthcare", "education", "labor", "housing", "climate", "civilRights"]
  },
  {
    id: "republican",
    name: "Republican Party",
    shortName: "Republican",
    description: "A broad center-right coalition where primaries often revolve around taxes, business climate, public safety, local control, faith communities, and national identity.",
    ideologyTags: ["moderateRepublican", "conservativeRepublican", "libertarianRepublican", "populistRepublican"],
    resourceModifiers: { money: 8000, volunteers: 6, trust: 0, capital: 2 },
    groupModifiers: { smallBusiness: 5, fiscalConservatives: 5, religiousVoters: 5, ruralVoters: 4, veterans: 3, seniors: 2, donors: 2, collegeStudents: -3, environmentalVoters: -2 },
    issueAffinities: ["taxes", "publicSafety", "ruralDevelopment", "economy", "government", "education"]
  },
  {
    id: "independent",
    name: "Independent",
    shortName: "Independent",
    description: "A non-party path with weaker machinery but more room to build a personal brand around competence, reform, local service, or cross-partisan frustration.",
    ideologyTags: ["centristIndependent", "progressiveIndependent", "conservativeIndependent", "antiCorruptionIndependent"],
    resourceModifiers: { money: -4000, volunteers: 4, trust: 4, capital: -2 },
    groupModifiers: { independents: 6, suburbanModerates: 4, civilLibertarians: 2, urbanProfessionals: 1, partyActivists: -3, donors: -1 },
    issueAffinities: ["government", "budget", "ethics", "education", "infrastructure"]
  }
];
