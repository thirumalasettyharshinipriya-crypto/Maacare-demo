export const dietPlan: Record<
  number,
  { eat: string[]; avoid: string[]; tip: string }
> = {
  1: {
    eat: [
      "Folate-rich: spinach, lentils, dal",
      "Iron: beetroot, pomegranate, amla",
      "Ginger tea for nausea",
      "Small frequent meals every 2–3 hrs",
      "Citrus fruits – Vitamin C",
      "Dairy: milk, curd, paneer",
    ],
    avoid: [
      "Raw/undercooked meat",
      "Papaya, pineapple (raw)",
      "Excess tea/coffee",
      "Alcohol",
      "Packaged junk food",
      "Raw sprouts",
    ],
    tip: "Take folic acid supplements daily. Eat small meals every 2–3 hours to manage nausea. / फोलिक एसिड सप्लीमेंट रोज लें।",
  },
  2: {
    eat: [
      "Calcium: milk, cheese, ragi",
      "Protein: eggs, lentils, nuts",
      "Iron: dark leafy greens, jaggery",
      "Omega-3: walnuts, flaxseeds",
      "Complex carbs: oats, brown rice",
      "Water – 3 litres/day",
    ],
    avoid: [
      "High-mercury fish",
      "Unwashed raw produce",
      "Excess salt (causes swelling)",
      "Sugary drinks",
      "Unpasteurized cheese",
    ],
    tip: "Your baby is growing fast! Focus on calcium and protein. Eat 5–6 small meals. / बच्चा तेजी से बढ़ रहा है – कैल्शियम और प्रोटीन लें।",
  },
  3: {
    eat: [
      "Iron: jaggery, spinach, liver",
      "Light, easily digestible meals",
      "Dates – helps prepare for delivery",
      "Coconut water – hydration",
      "Protein-rich foods",
      "Fibre to prevent constipation",
    ],
    avoid: [
      "Heavy oily foods",
      "Large meals (causes discomfort)",
      "Excess sodium",
      "Raw fish/meat",
      "Carbonated drinks",
    ],
    tip: "Eat light and often. Stay very well hydrated. Dates may help prepare your body for delivery. / हल्का खाएं, खूब पानी पिएं।",
  },
};
