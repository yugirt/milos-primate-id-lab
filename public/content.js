window.GAME_CONTENT = {
  path: ["Primate", "Haplorrhine", "Anthropoid", "Platyrrhine", "Spider monkey"],
  checkpoints: [
    {
      eyebrow: "Checkpoint 1 · Order",
      question: "Is Milo a primate?",
      prompt: "Use the evidence to decide whether this mystery specimen belongs in the order Primates.",
      choices: ["Primate", "Non-primate mammal"], correct: 0,
      evidence: [
        ["Vision", "Forward-facing eyes create overlapping fields of view."],
        ["Orbit", "A bony postorbital bar supports the outside of each eye socket."],
        ["Touch", "Grasping extremities have sensitive tactile pads and nails on most digits."],
        ["Movement", "Flexible shoulder and limb joints support movement through branches."]
      ],
      diagnostic: "The combination matters most: convergent eyes, orbital support, grasping extremities, nails, and flexible limbs is the classic primate pattern.",
      explanation: "The evidence supports Primate. No single trait identifies every primate, so anthropologists classify using a suite of shared adaptations.",
      alternatives: "A non-primate mammal may share one feature, but it would not usually show this entire anatomical package.",
      terms: [["Postorbital bar", "A ring of bone along the outer edge of the eye socket."], ["Convergent eyes", "Eyes oriented toward the front, producing overlapping visual fields."]]
    },
    {
      eyebrow: "Checkpoint 2 · Suborder",
      question: "Strepsirrhine or haplorrhine?",
      prompt: "Now place Milo on one of the two major primate branches.",
      choices: ["Strepsirrhine", "Haplorrhine"], correct: 1,
      evidence: [
        ["Nose", "The nose is dry; there is no rhinarium."],
        ["Night vision", "The eyes lack a tapetum lucidum."],
        ["Vision", "Vision is emphasized more strongly than smell."],
        ["Orbit", "A bony plate closes the back of the eye socket."]
      ],
      diagnostic: "A dry nose plus postorbital closure most strongly supports the haplorrhine branch.",
      explanation: "Haplorrhines—including tarsiers, monkeys, and apes—have a dry nose and greater visual emphasis. Anthropoids also have complete postorbital closure.",
      alternatives: "Most strepsirrhines have a moist rhinarium, stronger reliance on smell, and a reflective tapetum lucidum.",
      terms: [["Rhinarium", "The moist, hairless surface around the nostrils."], ["Tapetum lucidum", "A reflective eye layer that improves low-light vision."], ["Postorbital closure", "A bony wall behind the eye socket."]]
    },
    {
      eyebrow: "Checkpoint 3 · Infraorder",
      question: "Tarsier or anthropoid?",
      prompt: "Milo is a haplorrhine. Which haplorrhine branch fits the next evidence?",
      choices: ["Tarsier", "Anthropoid"], correct: 1,
      evidence: [
        ["Jaw", "The two halves of the lower jaw are fused at the midline."],
        ["Orbit", "The eye socket has complete postorbital closure."],
        ["Proportions", "The eyes and ankle bones are not extremely enlarged."],
        ["Body plan", "The overall anatomy follows a monkey-like rather than tarsier-specialized pattern."]
      ],
      diagnostic: "A fused mandibular symphysis is especially diagnostic of anthropoids.",
      explanation: "The specimen is an anthropoid: the group containing monkeys, apes, and humans.",
      alternatives: "Tarsiers have enormous eyes and elongated tarsal bones adapted for nocturnal vertical clinging and leaping.",
      terms: [["Mandibular symphysis", "The midline where the left and right halves of the lower jaw meet."], ["Tarsals", "Bones in the ankle region."]]
    },
    {
      eyebrow: "Checkpoint 4 · Parvorder",
      question: "Platyrrhine or catarrhine?",
      prompt: "Milo is an anthropoid. Identify the New World or Old World branch.",
      choices: ["Platyrrhine", "Catarrhine"], correct: 0,
      evidence: [
        ["Nostrils", "The nostrils are broad, rounded, and face outward."],
        ["Dentition", "The dental formula is 2.1.3.3 in each quadrant."],
        ["Geography", "The specimen lives in Central and South America."],
        ["Habitat", "It is highly arboreal and spends most of its time in the canopy."]
      ],
      diagnostic: "Three premolars (2.1.3.3) and outward-facing nostrils strongly indicate a platyrrhine.",
      explanation: "Platyrrhines are the monkeys of Central and South America, commonly called New World monkeys.",
      alternatives: "Catarrhines have closer, downward-facing nostrils and usually a 2.1.2.3 dental formula.",
      terms: [["Dental formula", "The number of incisors, canines, premolars, and molars in one jaw quadrant."], ["Arboreal", "Adapted for living and moving in trees."]]
    },
    {
      eyebrow: "Checkpoint 5 · Final identification",
      question: "Which platyrrhine is Milo?",
      prompt: "Use the final adaptations to identify Milo’s closest biological model.",
      choices: ["Spider monkey", "Capuchin", "Tamarin", "Squirrel monkey"], correct: 0,
      evidence: [
        ["Limbs", "Very long arms and legs support climbing and suspensory movement."],
        ["Tail", "A fully prehensile tail can support body weight like a fifth limb."],
        ["Hands", "Thumbs are reduced or absent while the fingers form a strong hook."],
        ["Diet", "Fruit is the primary food, supplemented by leaves, flowers, and other items."]
      ],
      diagnostic: "The combination of a weight-bearing prehensile tail and reduced thumbs is characteristic of spider monkeys.",
      explanation: "Mystery solved: Milo’s biological model is a spider monkey (genus Ateles), a highly arboreal New World monkey.",
      alternatives: "Capuchins have well-developed manipulative thumbs; tamarins are small and clawed; squirrel monkeys lack a fully weight-bearing prehensile tail.",
      terms: [["Prehensile", "Able to grasp or hold objects."], ["Suspensory locomotion", "Moving or feeding while hanging below branches."], ["Frugivorous", "Eating a diet centered on fruit."]]
    }
  ],
  profile: {
    classification: ["Order: Primates", "Suborder: Haplorrhini", "Infraorder: Anthropoidea", "Parvorder: Platyrrhini", "Family: Atelidae", "Genus: Ateles"],
    represented: ["Forward-facing eyes", "Long, flexible limbs", "Long tail", "Arboreal body shape", "Rounded external ears"],
    simplified: ["Nubby hands do not show hook-like fingers", "The thumb reduction is stylized", "Teeth and dental formula are not visible", "Nostrils and orbital bones are simplified", "Tail length and gripping surface are artistic"],
    note: "Milo is a stylized teaching model—not a precise anatomical reconstruction. The game’s evidence cards supply traits the crochet design cannot show."
  }
};
