window.CommonPagesCivicData.focuses = [
  {
    id: "housingAbundance",
    name: "Housing Abundance Path",
    issue: "housing",
    summary: "Build an affordability argument around supply, transit, and renter pressure.",
    payoff: "Unlocks a final housing decision that can move renters, young voters, suburbs, and local officials in different directions.",
    steps: [
      { name: "Study the Housing Crisis", weeks: 1, effects: { trust: 1.5, groups: { urbanProfessionals: 1.4, collegeStudents: 1.8, renters: 1.5 } } },
      { name: "Build Local Coalition", weeks: 1, effects: { capital: 2, regions: { harborCity: 1.2, pineSuburbs: 0.8 }, groups: { suburbanModerates: 0.8 } } },
      { name: "Transit-Oriented Development Plan", weeks: 1, effects: { groups: { collegeStudents: 2.5, parents: 1.2, homeowners: -0.8 }, regions: { universityDistrict: 1.7, harborCity: 1.2 } } }
    ],
    choices: [
      { label: "Frame the plan around lower rents and starter homes.", text: "You make the housing path concrete for young families and renters.", effects: { trust: 1, groups: { renters: 3, collegeStudents: 2, parents: 1, homeowners: -1 }, regions: { harborCity: 1.5, universityDistrict: 1.2 } } },
      { label: "Offer suburbs infrastructure funding with zoning reform.", text: "The compromise costs money but reduces backlash.", effects: { money: -5000, capital: 1, groups: { suburbanModerates: 2, homeowners: 1, renters: 1 }, regions: { pineSuburbs: 1.8 } } },
      { label: "Lean into a sharper pro-building argument.", text: "Supporters hear courage; some homeowners hear threat.", effects: { media: 3, groups: { renters: 3, urbanProfessionals: 2, homeowners: -2, seniors: -1 }, issueMomentum: 2 } }
    ]
  },
  {
    id: "ruralRenewal",
    name: "Rural Renewal Path",
    issue: "ruralDevelopment",
    summary: "Campaign on roads, water, clinics, and respect for communities outside the metro center.",
    payoff: "Creates a rural compact decision that can broaden the map, but may pull resources from urban priorities.",
    steps: [
      { name: "Listening Tour", weeks: 1, effects: { trust: 1.4, groups: { ruralVoters: 2, veterans: 0.8 } } },
      { name: "Water and Roads Compact", weeks: 1, effects: { regions: { northValley: 2.2, ridgeTowns: 1.4, sunfield: 1.2 }, groups: { smallBusiness: 1.2, ruralVoters: 1.4 } } },
      { name: "Clinic Access Promise", weeks: 1, effects: { groups: { seniors: 1.8, healthcareWorkers: 1.4, ruralVoters: 1.2 }, regions: { northValley: 1.2, ridgeTowns: 1 } } }
    ],
    choices: [
      { label: "Promise a rural clinics and roads package.", text: "Rural trust rises, though fiscal voters ask how you will pay.", effects: { groups: { ruralVoters: 3, seniors: 2, fiscalConservatives: -1 }, regions: { northValley: 2, ridgeTowns: 1.6, sunfield: 1.5 }, capital: 1 } },
      { label: "Tie rural renewal to clean-energy jobs.", text: "You connect climate and local economics, but skeptics need persuasion.", effects: { groups: { environmentalVoters: 2, ruralVoters: 1.5, smallBusiness: 1, conservatives: -0.8 }, media: 2 } },
      { label: "Keep the compact narrow and budget-first.", text: "The plan is credible, but less inspiring.", effects: { trust: 2, groups: { fiscalConservatives: 1.5, ruralVoters: 1, healthcareWorkers: -0.5 }, money: 2500 } }
    ]
  },
  {
    id: "cleanGovernment",
    name: "Clean Government Path",
    issue: "government",
    summary: "Run on meetings, records, budgets, ethics, and institutional trust.",
    payoff: "Forces a choice between careful reform, aggressive anti-corruption politics, or a public-records bargain.",
    steps: [
      { name: "Publish the Meetings Rule", weeks: 1, effects: { trust: 2, media: 1, groups: { independents: 1 } } },
      { name: "Ethics Coalition", weeks: 1, effects: { capital: 2, groups: { suburbanModerates: 1.8, publicSectorWorkers: 0.8, civilLibertarians: 1 } } },
      { name: "Open Budget Dashboard", weeks: 1, effects: { trust: 2.5, regions: { capitalHeights: 1.8, oldCapitol: 1.5 }, groups: { urbanProfessionals: 1.5 } } }
    ],
    choices: [
      { label: "Announce an independent ethics commission.", text: "Good-government voters respond strongly.", effects: { trust: 3, capital: 1, groups: { independents: 2, suburbanModerates: 2, partyActivists: -0.8 }, regions: { oldCapitol: 1.7 } } },
      { label: "Attack the local insider network by name.", text: "The line travels, but the race gets more hostile.", effects: { media: 4, trust: 0.5, opponentSupport: -1.3, groups: { partyActivists: -1, independents: 1.4 } } },
      { label: "Negotiate records reform with cautious officials.", text: "A slower route wins institutional allies.", effects: { capital: 3, groups: { publicSectorWorkers: 1.5, civilLibertarians: 1, progressives: -0.5 }, trust: 1 } }
    ]
  },
  {
    id: "laborDignity",
    name: "Labor Dignity Path",
    issue: "labor",
    summary: "Center wages, scheduling, workplace safety, and training without losing the local business conversation.",
    payoff: "Ends with a labor compact decision that can energize workers or trigger business backlash.",
    steps: [
      { name: "Workplace Listening Sessions", weeks: 1, effects: { groups: { workingClass: 2, unionMembers: 2 }, trust: 0.8 } },
      { name: "Wage Standards Compact", weeks: 1, effects: { groups: { unionMembers: 2.8, smallBusiness: -1.2, workingClass: 1.5 }, regions: { ironCounty: 1.8, southworks: 1.2 } } },
      { name: "Retraining and Apprenticeships", weeks: 1, effects: { groups: { industrialWorkers: 2.2, workingClass: 1.4, smallBusiness: 0.6 }, regions: { ironCounty: 1.5, southworks: 1 } } }
    ],
    choices: [
      { label: "Accept the labor council's full pledge.", text: "Union enthusiasm surges and business groups bristle.", effects: { volunteers: 12, groups: { unionMembers: 4, workingClass: 2, smallBusiness: -2, donors: -1 }, regions: { ironCounty: 2 } } },
      { label: "Pair wage standards with small-business relief.", text: "The deal is more complex but easier to defend.", effects: { capital: 1, money: -3500, groups: { unionMembers: 2, smallBusiness: 1, workingClass: 1.2, suburbanModerates: 1 } } },
      { label: "Focus on training instead of wage mandates.", text: "Moderates approve; labor leaders wanted more.", effects: { trust: 1.5, groups: { suburbanModerates: 2, smallBusiness: 1.5, unionMembers: -1 }, regions: { pineSuburbs: 1 } } }
    ]
  },
  {
    id: "safeNeighborhoods",
    name: "Safe Neighborhoods Path",
    issue: "publicSafety",
    summary: "Shape a public-safety message around response times, prevention, accountability, and neighborhood trust.",
    payoff: "Creates a debate over enforcement, prevention, and civil liberties.",
    steps: [
      { name: "Public Safety Roundtables", weeks: 1, effects: { groups: { parents: 1.5, seniors: 1.4, suburbanModerates: 1 }, trust: 1 } },
      { name: "Prevention and Response Plan", weeks: 1, effects: { groups: { suburbanModerates: 1.8, urbanProfessionals: 1, veterans: 0.8 }, regions: { pineSuburbs: 1.3 } } },
      { name: "Accountability Benchmarks", weeks: 1, effects: { groups: { immigrantCommunities: 1.8, veterans: 0.8, civilLibertarians: 1.2 }, trust: 1.5 } }
    ],
    choices: [
      { label: "Lead with response times and visible patrols.", text: "Safety-concerned voters approve; civil-liberties voters worry.", effects: { groups: { parents: 2, seniors: 2, veterans: 1.5, civilLibertarians: -1.5 }, regions: { pineSuburbs: 1.4, ridgeTowns: 1 } } },
      { label: "Lead with violence prevention and youth programs.", text: "The plan builds trust in urban areas but sounds soft to some voters.", effects: { trust: 1.5, groups: { collegeStudents: 1.5, immigrantCommunities: 2, parents: 1, conservatives: -1 }, regions: { harborCity: 1.5 } } },
      { label: "Offer a compact: faster response plus accountability.", text: "The balanced plan is harder to explain but broader.", effects: { capital: 1, groups: { suburbanModerates: 2, parents: 1.5, civilLibertarians: 1, veterans: 1 }, debate: 4 } }
    ]
  }
];
