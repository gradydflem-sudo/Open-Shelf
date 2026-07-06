window.CommonPagesCivicData.endorsements = [
  {
    id: "teachersGuild",
    name: "State Teachers Association",
    text: "A visible signal to parents and education voters.",
    requirements: { group: "teachers", support: 53 },
    effects: { groups: { teachers: 4, parents: 1.2 }, regions: { pineSuburbs: 1, capitalHeights: 0.8 }, volunteers: 6, media: 2 }
  },
  {
    id: "laborCouncil",
    name: "Iron County Labor Council",
    text: "A ground-game endorsement with strong effects in industrial precincts.",
    requirements: { group: "unionMembers", support: 55 },
    effects: { groups: { unionMembers: 5, workingClass: 1.5 }, regions: { ironCounty: 2 }, volunteers: 12, capital: 1 }
  },
  {
    id: "smallBusinessLeague",
    name: "Main Street Business League",
    text: "A trust mark for tax, permitting, and local economy messages.",
    requirements: { group: "smallBusiness", support: 51 },
    effects: { groups: { smallBusiness: 4, suburbanModerates: 1 }, regions: { coastalBend: 1, pineSuburbs: 0.8 }, money: 6000, media: 1 }
  },
  {
    id: "coastalResilience",
    name: "Coastal Resilience Network",
    text: "A climate-and-disaster endorsement that plays well beyond the coast.",
    requirements: { group: "environmentalVoters", support: 56 },
    effects: { groups: { environmentalVoters: 4, coastalResidents: 3 }, regions: { coastalBend: 2, universityDistrict: 0.8 }, media: 2 }
  },
  {
    id: "veteransCouncil",
    name: "Veterans Civic Council",
    text: "A credibility boost with older and service-oriented voters.",
    requirements: { group: "veterans", support: 49 },
    effects: { groups: { veterans: 4, seniors: 1 }, regions: { ridgeTowns: 1, northValley: 0.7 }, trust: 1, media: 1 }
  },
  {
    id: "housingAlliance",
    name: "Homes for Families Coalition",
    text: "A housing endorsement that energizes renters and younger voters.",
    requirements: { issue: "housing" },
    effects: { groups: { collegeStudents: 2.5, urbanProfessionals: 1.4, workingClass: 1.2 }, regions: { harborCity: 1.2, universityDistrict: 1.6 }, volunteers: 6 }
  },
  {
    id: "farmBureau",
    name: "North Valley Farm Bureau",
    text: "Hard to earn, but valuable in rural places where trust is scarce.",
    requirements: { group: "ruralVoters", support: 46 },
    effects: { groups: { ruralVoters: 4, smallBusiness: 1 }, regions: { northValley: 2.4, ridgeTowns: 0.8 }, media: 1 }
  },
  {
    id: "ethicsWatch",
    name: "State Ethics Watch",
    text: "A good-government seal with policy-minded voters.",
    requirements: { trust: 54 },
    effects: { groups: { suburbanModerates: 2, urbanProfessionals: 2, publicSectorWorkers: 1 }, regions: { capitalHeights: 2 }, trust: 1.5 }
  }
];
