(function () {
  const data = window.CommonPagesPracticeData;
  if (!data) return;

  data.spanishPrompts.push(
    { spanish: "Mi madre prepara sopa los domingos.", answers: ["My mother makes soup on Sundays.", "My mom makes soup on Sundays.", "My mother prepares soup on Sundays."], difficulty: "beginner", category: "family", modes: ["retype", "translate"] },
    { spanish: "Voy al mercado con mi hermana.", answers: ["I go to the market with my sister.", "I'm going to the market with my sister."], difficulty: "beginner", category: "daily life", modes: ["retype", "translate"] },
    { spanish: "Me gusta dibujar después de cenar.", answers: ["I like to draw after dinner.", "I like drawing after dinner."], difficulty: "beginner", category: "hobbies", modes: ["retype", "translate"] },
    { spanish: "El tren sale a las ocho.", answers: ["The train leaves at eight.", "The train departs at eight."], difficulty: "beginner", category: "travel", modes: ["retype", "translate"] },
    { spanish: "Estoy contenta porque terminé mi proyecto.", answers: ["I am happy because I finished my project.", "I'm happy because I finished my project."], difficulty: "beginner", category: "emotions", modes: ["retype", "translate"] },
    { spanish: "La biblioteca abre temprano.", answers: ["The library opens early.", "The library opens early"], difficulty: "beginner", category: "school", modes: ["retype", "translate"] },
    { spanish: "Mi vecino toca la guitarra en el parque.", answers: ["My neighbor plays the guitar in the park.", "My neighbour plays the guitar in the park."], difficulty: "intermediate", category: "hobbies", modes: ["retype", "translate"] },
    { spanish: "Necesitamos comparar las fuentes antes de escribir el ensayo.", answers: ["We need to compare the sources before writing the essay.", "We need to compare sources before writing the essay."], difficulty: "intermediate", category: "school", modes: ["retype", "translate"] },
    { spanish: "El concejo municipal debatió el presupuesto durante tres horas.", answers: ["The city council debated the budget for three hours.", "The municipal council debated the budget for three hours."], difficulty: "intermediate", category: "politics/civics", modes: ["retype", "translate"] },
    { spanish: "Si perdemos el autobús, caminaremos hasta la plaza.", answers: ["If we miss the bus, we will walk to the plaza.", "If we miss the bus, we will walk to the square."], difficulty: "intermediate", category: "travel", modes: ["retype", "translate"] },
    { spanish: "Estoy preocupado por el examen, pero he estudiado bastante.", answers: ["I am worried about the exam, but I have studied enough.", "I'm worried about the exam, but I have studied a lot."], difficulty: "intermediate", category: "emotions", modes: ["retype", "translate"] },
    { spanish: "La receta de mi abuelo usa ajo, limón y mucha paciencia.", answers: ["My grandfather's recipe uses garlic, lemon, and a lot of patience.", "My grandpa's recipe uses garlic, lemon, and lots of patience."], difficulty: "intermediate", category: "food", modes: ["retype", "translate"] },
    { spanish: "Una comunidad democrática necesita desacuerdo honesto y reglas compartidas.", answers: ["A democratic community needs honest disagreement and shared rules.", "A democratic community needs honest disagreement and common rules."], difficulty: "advanced", category: "politics/civics", modes: ["retype", "translate"] },
    { spanish: "El periodista verificó cada cita antes de publicar la investigación.", answers: ["The journalist verified every quote before publishing the investigation.", "The reporter checked every quote before publishing the investigation."], difficulty: "advanced", category: "politics/civics", modes: ["retype", "translate"] },
    { spanish: "Aunque el viaje fue improvisado, encontramos una pequeña cafetería junto al río.", answers: ["Although the trip was improvised, we found a small cafe beside the river.", "Although the trip was unplanned, we found a small cafe by the river."], difficulty: "advanced", category: "travel", modes: ["retype", "translate"] },
    { spanish: "El silencio de la casa reveló cuánto extrañábamos las conversaciones de la abuela.", answers: ["The silence of the house revealed how much we missed grandmother's conversations.", "The silence in the house showed how much we missed grandma's conversations."], difficulty: "advanced", category: "family", modes: ["retype", "translate"] },
    { spanish: "La privacidad digital requiere leyes claras y ciudadanos atentos.", answers: ["Digital privacy requires clear laws and attentive citizens.", "Digital privacy requires clear laws and alert citizens."], difficulty: "advanced", category: "technology/civics", modes: ["retype", "translate"] },
    { spanish: "Nos reímos cuando el perro robó el pan de la mesa.", answers: ["We laughed when the dog stole the bread from the table.", "We laughed when the dog stole bread from the table."], difficulty: "beginner", category: "daily life", modes: ["retype", "translate"] }
  );

  data.typingPassages.push(
    { text: "The mayor arrived with three folders, two apologies, and one pencil sharpened to a dangerous point.", difficulty: "beginner", category: "humorous" },
    { text: "Every neighborhood has a sound it makes before breakfast.", difficulty: "beginner", category: "descriptive" },
    { text: "A school board meeting can be boring and important at the same time.", difficulty: "beginner", category: "civic" },
    { text: "The river carried leaves, rumors, and one red mitten past the old stone bridge.", difficulty: "beginner", category: "literary" },
    { text: "History is not only dates; it is the argument people leave behind for the next generation.", difficulty: "intermediate", category: "historical" },
    { text: "A useful public speech should name the problem, admit the cost, and invite people into the work.", difficulty: "intermediate", category: "persuasive" },
    { text: "The museum guide lowered her voice near the cracked ballot box, as if the old election might wake up.", difficulty: "intermediate", category: "historical" },
    { text: "On windy mornings, the city looked temporary: banners snapped, papers fled, and everyone held their coffee like evidence.", difficulty: "intermediate", category: "descriptive" },
    { text: "If a committee meets long enough, somebody will propose a subcommittee to define what lunch means.", difficulty: "intermediate", category: "humorous" },
    { text: "Persuasion begins when a writer respects the reader enough to offer reasons instead of pressure.", difficulty: "intermediate", category: "persuasive" },
    { text: "The lantern-lit archive contained ordinances, love letters, ferry schedules, and one recipe annotated like a criminal confession.", difficulty: "advanced", category: "literary" },
    { text: "A republic survives through habits as much as laws: waiting your turn, checking your facts, losing gracefully, and returning tomorrow.", difficulty: "advanced", category: "civic" },
    { text: "The pamphlet was only eight pages long, but it changed the town because it translated anger into specific demands.", difficulty: "advanced", category: "historical" },
    { text: "A descriptive passage earns trust by choosing concrete details: the chipped railing, the sour elevator, the last warm rectangle of sun.", difficulty: "advanced", category: "descriptive" },
    { text: "The candidate's joke landed badly, ricocheted through three group chats, and arrived at headquarters wearing a fake mustache.", difficulty: "advanced", category: "humorous" },
    { text: "A long drill asks the typist to maintain rhythm through commas, semicolons, quotations, and the small panic of a sentence that keeps unfolding.", difficulty: "advanced", category: "writing drills" }
  );

  data.writingPrompts.push(
    { text: "Write a scene from the point of view of someone counting votes in a very small election. Constraint: include the words pencil, kettle, and porch.", difficulty: "beginner", category: "civic argument" },
    { text: "Describe a meal that tells the reader something about a family without directly explaining the family.", difficulty: "beginner", category: "personal reflection" },
    { text: "Write a mystery scene where the clue is a sound heard twice.", difficulty: "beginner", category: "mystery" },
    { text: "Create a fantasy market where every shop sells a different kind of memory.", difficulty: "beginner", category: "worldbuilding" },
    { text: "Write a persuasive paragraph asking classmates to join a volunteer project.", difficulty: "beginner", category: "persuasive writing" },
    { text: "Write flash fiction that ends with this image: a light left on in an empty classroom.", difficulty: "beginner", category: "flash fiction" },
    { text: "Argue for or against a city rule that would close one street to cars every weekend. Begin by fairly stating the other side.", difficulty: "intermediate", category: "civic argument" },
    { text: "Write a dialogue where two friends disagree about whether a secret should be made public.", difficulty: "intermediate", category: "ethical dilemma" },
    { text: "Invent a government office in a fantasy world. Show what it does through one frustrated visitor.", difficulty: "intermediate", category: "worldbuilding" },
    { text: "Write a scene in first person plural, using we as the narrator.", difficulty: "intermediate", category: "fiction" },
    { text: "Describe a familiar place after everyone has gone home. Avoid naming the place until the final sentence.", difficulty: "intermediate", category: "descriptive writing" },
    { text: "Write a story around 120 words using these required words: envelope, fountain, vote.", difficulty: "intermediate", category: "flash fiction" },
    { text: "Make the strongest possible case for a policy you personally feel uncertain about.", difficulty: "advanced", category: "civic argument" },
    { text: "Write a scene where a public apology solves one problem and creates another.", difficulty: "advanced", category: "fiction" },
    { text: "Design a society where reputation is measured every morning. Show one person trying to disappear from the system.", difficulty: "advanced", category: "worldbuilding" },
    { text: "Write an ethical dilemma involving a scarce medicine, a public promise, and a private debt.", difficulty: "advanced", category: "ethical dilemma" },
    { text: "Write a persuasive essay opening that uses a vivid story before making its claim.", difficulty: "advanced", category: "persuasive writing" },
    { text: "Write flash fiction in which the last sentence changes the meaning of the first sentence.", difficulty: "advanced", category: "flash fiction" }
  );

  data.microFiction.genres.push(
    { name: "Council Chamber Drama", rarity: "uncommon", unlockAt: 8, requiresUpgrade: "research-notebook" },
    { name: "Cozy Climate Mystery", rarity: "rare", unlockAt: 18, requiresUpgrade: "research-notebook" },
    { name: "Public Radio Ghost Story", rarity: "rare", unlockAt: 22, requiresUpgrade: "newsletter-system" },
    { name: "Election Night Comedy", rarity: "rare", unlockAt: 26, requiresUpgrade: "research-notebook" },
    { name: "Archive Romance", rarity: "rare", unlockAt: 32, requiresUpgrade: "archive-room" },
    { name: "Near-Future Classroom", rarity: "rare", unlockAt: 36, requiresUpgrade: "translation-desk" },
    { name: "Mythic Legal Brief", rarity: "rare", unlockAt: 42, requiresUpgrade: "archive-room" }
  );
  data.microFiction.tropes.push(
    "A public promise nobody remembers making",
    "The last seat on the council",
    "A haunted newsletter",
    "A classroom votes on a spell",
    "An old law wakes up",
    "A rival offers useful advice",
    "A map hidden in a recipe",
    "The budget is cursed",
    "A lost recording changes the meeting",
    "A fictional newspaper becomes real",
    "The hero must write a correction",
    "The door only opens after a sincere apology"
  );
  data.microFiction.audiences.push(
    "civic strategy fans",
    "short-story teachers",
    "public library patrons",
    "school board observers",
    "cozy mystery readers",
    "fantasy bureaucracy fans",
    "student journalists",
    "people who like strange deadlines"
  );
  data.microFiction.wordSets.push(
    ["ordinance", "candle", "ladder"],
    ["agenda", "violin", "storm"],
    ["principal", "comet", "receipt"],
    ["zoning", "teapot", "ghost"],
    ["council", "orchard", "signal"],
    ["budget", "mirror", "saffron"],
    ["ballot", "ferry", "lullaby"],
    ["archive", "district", "cinnamon"],
    ["teacher", "satellite", "promise"],
    ["hearing", "lantern", "recipe"],
    ["reporter", "tunnel", "marigold"],
    ["mayor", "pencil", "thunder"]
  );
  data.microFiction.specialEvents.push(
    { name: "Workshop Challenge", text: "Readers are rewarding stories that hit the assignment exactly.", unlockAt: 6, multiplier: 1.22 },
    { name: "Civic Fiction Week", text: "Stories about meetings, promises, and public consequences travel farther.", unlockAt: 14, multiplier: 1.36 },
    { name: "Teacher Share Chain", text: "Classrooms are trading tiny stories as examples.", unlockAt: 18, multiplier: 1.34 },
    { name: "Cozy Mystery Weekend", text: "Small clues and gentle tension are unusually popular.", unlockAt: 28, multiplier: 1.45 },
    { name: "Archive Midnight", text: "Strange history and magical paperwork are front-page material.", unlockAt: 40, multiplier: 1.55 }
  );

  data.archivistItems.push(
    { description: "A stamped city ordinance limiting dragon landings to odd-numbered rooftops.", tag: "Legal", theme: "civic archive", tier: 1 },
    { description: "A student's diary with every entry beginning, 'Today the library moved again.'", tag: "Diary", theme: "school archive", tier: 1 },
    { description: "A classroom map where the cafeteria is drawn larger than the kingdom.", tag: "Map", theme: "school archive", tier: 1 },
    { description: "A recipe card from a family reunion, annotated with who argued and who forgave whom.", tag: "Personal", theme: "family archive", tier: 1 },
    { description: "A polished badge issued to the royal inspector of unusually loud clocks.", tag: "Royal", theme: "royal archive", tier: 1 },
    { description: "A lab note measuring how fast enchanted ink dries in winter air.", tag: "Scientific", theme: "scientific archive", tier: 1 },
    { description: "An agreement between two school clubs about hallway poster territory.", tag: "Treaty", theme: "school archive", tier: 1 },
    { description: "A handbill urging citizens to attend a midnight budget hearing.", tag: "Political", theme: "civic archive", tier: 2 },
    { description: "A banned stage script in which every minister accidentally tells the truth.", tag: "Forbidden", theme: "theater archive", tier: 2 },
    { description: "A medical chart for a patient who sneezes sparks whenever someone says parliament.", tag: "Medical", theme: "medical archive", tier: 2 },
    { description: "A gear-driven lectern that clears its throat before reading public comments aloud.", tag: "Invention", theme: "civic archive", tier: 2 },
    { description: "A prophecy describing an election decided by one misplaced umbrella.", tag: "Prophecy", theme: "magical archive", tier: 2 },
    { description: "A cursed attendance sheet where absent names complain in the margins.", tag: "Cursed", theme: "school archive", tier: 2 },
    { description: "An elven zoning appeal written on leaves that rearrange themselves by season.", tag: "Elven", theme: "legal archive", tier: 2 },
    { description: "A mythic tax receipt signed by the sun after a dispute with the harvest moon.", tag: "Mythic", theme: "civic archive", tier: 3 },
    { description: "A political strategy memo hidden inside a children's spelling workbook.", tag: "Political", theme: "school archive", tier: 3 },
    { description: "A forbidden map of every shortcut used by the royal family during boring ceremonies.", tag: "Forbidden", theme: "royal archive", tier: 3 },
    { description: "A treaty between librarians and ghosts over acceptable whisper volume.", tag: "Treaty", theme: "library archive", tier: 3 },
    { description: "A spell that turns any public meeting agenda into a poem for exactly nine minutes.", tag: "Spell", theme: "magical archive", tier: 3 },
    { description: "A historical witness statement from the day the town clock voted twice.", tag: "Historical", theme: "historical archive", tier: 3 }
  );
})();
