window.CommonPagesCivicData.scenarios = [
  {
    id: "schoolBoardDistrict",
    name: "School Board District Race",
    office: "School Board",
    officeId: "schoolBoard",
    stateId: "pa",
    districtType: "local school district",
    electionStructure: "nonpartisanGeneral",
    primaryImportance: "low",
    weeks: 6,
    description: "A first campaign in a Pennsylvania-style school district, focused on schools, parents, teachers, turnout, and local trust.",
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
    id: "stateHouseSwingDistrict",
    name: "State House Swing District",
    office: "State House Representative",
    officeId: "stateHouse",
    stateId: "mi",
    districtType: "state legislative district",
    electionStructure: "primaryAndGeneral",
    primaryImportance: "medium",
    weeks: 10,
    description: "A competitive Michigan-style district with an urban center, suburbs, rural towns, a campus, and an industrial corridor.",
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
    goals: ["Win the primary or party base", "Win the general election", "Build a durable coalition"],
    defaultOpponent: "miraVance"
  }
];
