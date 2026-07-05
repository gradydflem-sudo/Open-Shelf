window.CommonPagesCivicData.scenarios = [
  {
    id: "localEducationBoard",
    name: "The Local Education Board Race",
    office: "Local Education Board",
    officeId: "educationBoard",
    weeks: 6,
    description: "A small but consequential race about schools, trust, parents, teachers, and turnout.",
    regionIds: ["harborCity", "pineSuburbs", "universityDistrict", "ridgeTowns"],
    startingResources: {
      money: 28000,
      time: 3,
      staff: 2,
      volunteers: 38,
      capital: 5,
      trust: 52,
      media: 8,
      energy: 6,
      maxEnergy: 6,
      debate: 42
    },
    goals: ["Win a local office", "Build early career reputation", "Learn the campaign-to-governing loop"],
    defaultOpponent: "miraVance"
  },
  {
    id: "stateAssembly",
    name: "The State Assembly Race",
    office: "Columbia State Assembly",
    officeId: "provincialAssembly",
    weeks: 10,
    description: "A competitive district with an urban center, suburbs, rural towns, a campus, and an industrial corridor.",
    startingResources: {
      money: 82000,
      time: 3,
      staff: 5,
      volunteers: 72,
      capital: 9,
      trust: 51,
      media: 18,
      energy: 6,
      maxEnergy: 6,
      debate: 48
    },
    goals: ["Win the popular vote", "Build a durable coalition", "Leave voters with a clearer sense of tradeoffs"],
    defaultOpponent: "miraVance"
  }
];
