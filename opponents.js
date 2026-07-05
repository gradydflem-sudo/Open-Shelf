window.CommonPagesCivicData.opponents = [
  {
    id: "miraVance",
    name: "Mira Vance",
    label: "Steady incumbent",
    ideology: "moderate",
    homeRegion: "pineSuburbs",
    strengths: ["fundraising", "constituent service", "suburban trust"],
    weaknesses: ["cautious", "thin youth support"],
    favoriteIssues: ["budget", "education", "publicSafety"],
    style: "institutional",
    stats: { fundraising: 78, field: 56, debate: 67, attack: 42, crisis: 70 },
    basePressure: { regions: { pineSuburbs: 1.5, capitalHeights: 0.8 }, groups: { suburbanModerates: 1.3, seniors: 0.8 } }
  },
  {
    id: "coleRedd",
    name: "Cole Redd",
    label: "Populist outsider",
    ideology: "populist",
    homeRegion: "ridgeTowns",
    strengths: ["earned media", "anger channeling", "rural turnout"],
    weaknesses: ["undisciplined", "weak policy detail"],
    favoriteIssues: ["industry", "publicSafety", "taxes"],
    style: "insurgent",
    stats: { fundraising: 54, field: 68, debate: 74, attack: 78, crisis: 48 },
    basePressure: { regions: { ridgeTowns: 1.7, northValley: 1.2, ironCounty: 0.8 }, groups: { ruralVoters: 1.4, veterans: 1.1, urbanProfessionals: -0.5 } }
  },
  {
    id: "adrianVale",
    name: "Adrian Vale",
    label: "Business-backed conservative",
    ideology: "conservative",
    homeRegion: "capitalHeights",
    strengths: ["money", "message discipline", "business support"],
    weaknesses: ["elite image", "limited volunteer energy"],
    favoriteIssues: ["taxes", "government", "publicSafety"],
    style: "boardroom",
    stats: { fundraising: 88, field: 46, debate: 63, attack: 66, crisis: 55 },
    basePressure: { regions: { capitalHeights: 1.2, pineSuburbs: 1, ridgeTowns: 0.7 }, groups: { smallBusiness: 1.8, suburbanModerates: 0.8, unionMembers: -0.7 } }
  },
  {
    id: "lailaMoreno",
    name: "Laila Moreno",
    label: "Labor-backed progressive",
    ideology: "progressive",
    homeRegion: "harborCity",
    strengths: ["volunteers", "labor ties", "moral clarity"],
    weaknesses: ["business skepticism", "narrower suburban reach"],
    favoriteIssues: ["labor", "housing", "healthcare"],
    style: "movement",
    stats: { fundraising: 58, field: 82, debate: 69, attack: 48, crisis: 61 },
    basePressure: { regions: { harborCity: 1.4, universityDistrict: 1.1, ironCounty: 0.8 }, groups: { unionMembers: 1.7, collegeStudents: 0.9, smallBusiness: -0.6 } }
  }
];
