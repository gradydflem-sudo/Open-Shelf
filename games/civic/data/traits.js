window.CommonPagesCivicData.traits = [
  {
    id: "coalitionBuilder",
    name: "Coalition Builder",
    description: "You are patient with groups that do not naturally agree.",
    modifiers: { trust: 3, capital: 2 },
    groupModifiers: { suburbanModerates: 2, immigrantCommunities: 1, religiousVoters: 1 }
  },
  {
    id: "fieldOrganizer",
    name: "Field Organizer",
    description: "Your campaign knows how to turn interest into turnout.",
    modifiers: { volunteers: 18, energy: 1 },
    groupTurnoutModifiers: { collegeStudents: 2, workingClass: 1, ruralVoters: 1 }
  },
  {
    id: "policyWonk",
    name: "Policy Wonk",
    description: "Reporters and civic groups take your plans seriously.",
    modifiers: { trust: 2, capital: 1 },
    issueBonus: 1.2
  },
  {
    id: "mediaNatural",
    name: "Media Natural",
    description: "Your best moments travel quickly, though so do mistakes.",
    modifiers: { media: 8, trust: 1 },
    actionBonus: { media: 1.25 }
  },
  {
    id: "localSteward",
    name: "Local Steward",
    description: "You begin with a reputation for showing up where you live.",
    modifiers: { trust: 3, volunteers: 8 },
    homeRegionBonus: 5
  },
  {
    id: "partyOperator",
    name: "Party Operator",
    description: "You know the committees, donors, and ward chairs by name.",
    modifiers: { money: 9000, capital: 4, trust: -1 }
  }
];
