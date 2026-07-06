window.CommonPagesCivicData.focuses = [
  {
    id: "housingAbundance",
    name: "Housing Abundance Path",
    issue: "housing",
    steps: [
      { name: "Study the Housing Crisis", weeks: 1, effects: { trust: 1, groups: { urbanProfessionals: 1, collegeStudents: 1 } } },
      { name: "Build Local Coalition", weeks: 1, effects: { capital: 1, regions: { harborCity: 1, pineSuburbs: 0.6 } } },
      { name: "Transit-Oriented Development Plan", weeks: 1, effects: { groups: { collegeStudents: 2, parents: 1 }, regions: { universityDistrict: 1.4, harborCity: 1 } } }
    ]
  },
  {
    id: "ruralRenewal",
    name: "Rural Renewal Path",
    issue: "ruralDevelopment",
    steps: [
      { name: "Listening Tour", weeks: 1, effects: { trust: 1, groups: { ruralVoters: 1.5 } } },
      { name: "Water and Roads Compact", weeks: 1, effects: { regions: { northValley: 1.8, ridgeTowns: 1 }, groups: { smallBusiness: 1 } } },
      { name: "Clinic Access Promise", weeks: 1, effects: { groups: { seniors: 1.5, healthcareWorkers: 1 }, regions: { northValley: 1 } } }
    ]
  },
  {
    id: "cleanGovernment",
    name: "Clean Government Path",
    issue: "government",
    steps: [
      { name: "Publish the Meetings Rule", weeks: 1, effects: { trust: 1.5, media: 1 } },
      { name: "Ethics Coalition", weeks: 1, effects: { capital: 1, groups: { suburbanModerates: 1.5, publicSectorWorkers: 0.8 } } },
      { name: "Open Budget Dashboard", weeks: 1, effects: { trust: 2, regions: { capitalHeights: 1.5 } } }
    ]
  },
  {
    id: "laborDignity",
    name: "Labor Dignity Path",
    issue: "labor",
    steps: [
      { name: "Workplace Listening Sessions", weeks: 1, effects: { groups: { workingClass: 1.5, unionMembers: 1.5 }, trust: 0.6 } },
      { name: "Wage Standards Compact", weeks: 1, effects: { groups: { unionMembers: 2.2, smallBusiness: -0.8 }, regions: { ironCounty: 1.5 } } },
      { name: "Retraining and Apprenticeships", weeks: 1, effects: { groups: { industrialWorkers: 2, workingClass: 1 }, regions: { ironCounty: 1.2 } } }
    ]
  },
  {
    id: "safeNeighborhoods",
    name: "Safe Neighborhoods Path",
    issue: "publicSafety",
    steps: [
      { name: "Public Safety Roundtables", weeks: 1, effects: { groups: { parents: 1, seniors: 1 }, trust: 1 } },
      { name: "Prevention and Response Plan", weeks: 1, effects: { groups: { suburbanModerates: 1.5, urbanProfessionals: 1 }, regions: { pineSuburbs: 1 } } },
      { name: "Accountability Benchmarks", weeks: 1, effects: { groups: { immigrantCommunities: 1.5, veterans: 0.8 }, trust: 1.2 } }
    ]
  }
];
