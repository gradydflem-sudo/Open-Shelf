window.CommonPagesCivicData.issues = [
  {
    id: "housing",
    name: "Housing",
    description: "How the campaign explains rents, zoning, construction, and neighborhood change.",
    stances: [
      { id: "housingSupply", name: "Build more homes near jobs and transit", effects: { groups: { collegeStudents: 3, urbanProfessionals: 2, parents: 1, suburbanModerates: -1 }, regions: { harborCity: 2, universityDistrict: 3, pineSuburbs: -1 }, trust: 1 } },
      { id: "publicHousing", name: "Create a public housing and rental assistance fund", effects: { groups: { workingClass: 3, collegeStudents: 2, smallBusiness: -1, suburbanModerates: -1 }, regions: { harborCity: 2, ironCounty: 1 }, money: -2500 } },
      { id: "localControlHousing", name: "Protect local zoning decisions", effects: { groups: { suburbanModerates: 2, ruralVoters: 1, collegeStudents: -2, renters: -2 }, regions: { pineSuburbs: 2, ridgeTowns: 1, universityDistrict: -2 }, trust: 0 } }
    ]
  },
  {
    id: "education",
    name: "Education",
    description: "Schools are a high-salience issue in the suburban and campus regions.",
    stances: [
      { id: "teacherSupport", name: "Raise teacher pay and fund student services", effects: { groups: { teachers: 5, parents: 2, suburbanModerates: 1, smallBusiness: -1 }, regions: { pineSuburbs: 2, capitalHeights: 1 }, money: -3000 } },
      { id: "schoolChoice", name: "Expand school choice and local flexibility", effects: { groups: { religiousVoters: 3, parents: 1, teachers: -3, suburbanModerates: 1 }, regions: { ridgeTowns: 2, northValley: 1 }, capital: 1 } },
      { id: "careerEducation", name: "Invest in vocational and community college pathways", effects: { groups: { industrialWorkers: 3, workingClass: 2, collegeStudents: 1, smallBusiness: 1 }, regions: { ironCounty: 2, northValley: 1 }, trust: 1 } }
    ]
  },
  {
    id: "taxes",
    name: "Taxes and Budget",
    description: "Voters respond not just to rates, but to whether the math sounds honest.",
    stances: [
      { id: "progressiveRevenue", name: "Raise top-end taxes to fund public services", effects: { groups: { workingClass: 2, teachers: 2, smallBusiness: -3, suburbanModerates: -2 }, regions: { harborCity: 1, capitalHeights: 1, pineSuburbs: -2 }, capital: -1 } },
      { id: "broadRelief", name: "Offer targeted middle-class tax relief", effects: { groups: { parents: 2, suburbanModerates: 3, seniors: 1, publicSectorWorkers: -1 }, regions: { pineSuburbs: 2, ridgeTowns: 1 }, money: -2000 } },
      { id: "balancedBudget", name: "Freeze new spending until the budget stabilizes", effects: { groups: { smallBusiness: 3, seniors: 2, publicSectorWorkers: -2, teachers: -2 }, regions: { capitalHeights: 1, ridgeTowns: 1 }, trust: 1, money: 2500 } }
    ]
  },
  {
    id: "climate",
    name: "Climate and Environment",
    description: "The coast, campus, and industrial areas hear the same proposal differently.",
    stances: [
      { id: "greenTransition", name: "Green jobs and clean infrastructure", effects: { groups: { environmentalVoters: 4, collegeStudents: 2, industrialWorkers: 1, ruralVoters: -1 }, regions: { coastalBend: 2, universityDistrict: 2, ironCounty: 1 }, money: -2500 } },
      { id: "carbonPrice", name: "Carbon fee with household rebates", effects: { groups: { environmentalVoters: 5, urbanProfessionals: 2, ruralVoters: -3, industrialWorkers: -2 }, regions: { universityDistrict: 2, coastalBend: 1, northValley: -2 }, capital: -1 } },
      { id: "conservationFirst", name: "Local conservation and disaster readiness", effects: { groups: { coastalResidents: 3, ruralVoters: 2, environmentalVoters: 1, collegeStudents: -1 }, regions: { coastalBend: 3, northValley: 1 }, trust: 1 } }
    ]
  },
  {
    id: "publicSafety",
    name: "Public Safety",
    description: "The district is anxious about safety, but not united on remedies.",
    stances: [
      { id: "communitySafety", name: "Fund prevention, mental health, and accountable policing", effects: { groups: { parents: 2, urbanProfessionals: 2, immigrantCommunities: 2, veterans: -1 }, regions: { harborCity: 2, pineSuburbs: 1 }, trust: 1 } },
      { id: "lawAndOrder", name: "Hire more officers and increase visible patrols", effects: { groups: { seniors: 3, religiousVoters: 2, veterans: 2, collegeStudents: -2 }, regions: { ridgeTowns: 2, pineSuburbs: 1, universityDistrict: -1 }, capital: 1 } },
      { id: "justiceReform", name: "Reduce incarceration and expand restorative programs", effects: { groups: { collegeStudents: 3, immigrantCommunities: 3, seniors: -2, suburbanModerates: -2 }, regions: { universityDistrict: 2, harborCity: 1, ridgeTowns: -2 }, media: 2 } }
    ]
  },
  {
    id: "labor",
    name: "Labor and Wages",
    description: "A central issue in the industrial corridor and among service workers.",
    stances: [
      { id: "strongLabor", name: "Strengthen unions and raise wage standards", effects: { groups: { unionMembers: 5, workingClass: 3, smallBusiness: -3, suburbanModerates: -1 }, regions: { ironCounty: 3, harborCity: 1 }, capital: -1 } },
      { id: "smallBizWages", name: "Pair wage growth with small-business tax credits", effects: { groups: { workingClass: 2, smallBusiness: 2, unionMembers: 1, fiscalConservatives: 1 }, regions: { ironCounty: 2, coastalBend: 1 }, money: -2000 } },
      { id: "jobCreation", name: "Prioritize job creation over new mandates", effects: { groups: { smallBusiness: 3, industrialWorkers: 1, unionMembers: -2, workingClass: -1 }, regions: { northValley: 1, ridgeTowns: 1 }, money: 1000 } }
    ]
  },
  {
    id: "government",
    name: "Government Reform",
    description: "Trust rises when reform sounds specific and falls when it sounds like a slogan.",
    stances: [
      { id: "antiCorruption", name: "Ban gifts, publish meetings, and tighten ethics rules", effects: { groups: { suburbanModerates: 3, urbanProfessionals: 2, publicSectorWorkers: 1 }, regions: { capitalHeights: 3, pineSuburbs: 1 }, trust: 2, capital: -1 } },
      { id: "civicParticipation", name: "Expand public hearings and participatory budgeting", effects: { groups: { collegeStudents: 2, immigrantCommunities: 2, publicSectorWorkers: 1 }, regions: { harborCity: 1, universityDistrict: 2 }, trust: 1 } },
      { id: "efficientServices", name: "Modernize permits and cut administrative waste", effects: { groups: { smallBusiness: 3, urbanProfessionals: 2, publicSectorWorkers: -1 }, regions: { capitalHeights: 2, coastalBend: 1 }, money: 2000 } }
    ]
  },
  {
    id: "ruralDevelopment",
    name: "Rural Development",
    description: "Rural voters punish campaigns that visit only for photographs.",
    stances: [
      { id: "ruralClinics", name: "Fund rural clinics and mobile health units", effects: { groups: { ruralVoters: 3, seniors: 2, healthcareWorkers: 1, smallBusiness: -1 }, regions: { northValley: 3, ridgeTowns: 1 }, money: -2500 } },
      { id: "farmWater", name: "Prioritize farm water security and road repair", effects: { groups: { ruralVoters: 4, smallBusiness: 1, environmentalVoters: -1 }, regions: { northValley: 4, ridgeTowns: 1 }, trust: 1 } },
      { id: "broadband", name: "Build rural broadband and telework hubs", effects: { groups: { ruralVoters: 2, parents: 1, smallBusiness: 2, collegeStudents: 1 }, regions: { northValley: 2, ridgeTowns: 2 }, money: -1500 } }
    ]
  }
];
