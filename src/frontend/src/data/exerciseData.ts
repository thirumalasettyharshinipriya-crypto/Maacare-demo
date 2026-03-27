export const exercisePlan: Record<
  number,
  { name: string; duration: string; description: string; icon: string }[]
> = {
  1: [
    {
      name: "Walking",
      duration: "20 min/day",
      description:
        "Light morning walk on flat ground. Avoid steep hills or intense heat.",
      icon: "🚶‍♀️",
    },
    {
      name: "Kegel / Pelvic Floor",
      duration: "10 min/day",
      description:
        "Strengthens pelvic muscles to support baby weight and ease delivery.",
      icon: "🧘‍♀️",
    },
    {
      name: "Gentle Stretching",
      duration: "10 min/day",
      description: "Light stretches for back and hips. No twisting or jumping.",
      icon: "🤸‍♀️",
    },
  ],
  2: [
    {
      name: "Prenatal Yoga",
      duration: "20 min/day",
      description:
        "Breathing, gentle poses, side-lying stretches. Join a local class if possible.",
      icon: "🧘‍♀️",
    },
    {
      name: "Swimming / Water Walking",
      duration: "20 min/day",
      description: "Very safe in pregnancy. Reduces back pain and swelling.",
      icon: "🏊‍♀️",
    },
    {
      name: "Walking",
      duration: "30 min/day",
      description: "Moderate pace. Keep a water bottle. Stop if dizzy.",
      icon: "🚶‍♀️",
    },
  ],
  3: [
    {
      name: "Gentle Walking",
      duration: "15 min/day",
      description: "Short slow walks only. Stop immediately if uncomfortable.",
      icon: "🚶‍♀️",
    },
    {
      name: "Deep Breathing",
      duration: "15 min/day",
      description: "Slow deep breaths for relaxation and delivery preparation.",
      icon: "💨",
    },
    {
      name: "Pelvic Tilts",
      duration: "10 min/day",
      description:
        "Relieves back pain. Do while sitting or on hands and knees gently.",
      icon: "🧘‍♀️",
    },
  ],
};
