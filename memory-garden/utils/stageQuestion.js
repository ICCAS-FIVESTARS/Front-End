export const STAGE_QUESTIONS = [
  {
    stage: 1,
    question: "Express your current self by drawing 3 clouds.",
    description: "Use different facial expressions, colors, and shapes to show your current feelings. It doesn’t have to be perfect—what you feel now is enough."
  },
  {
    stage: 2,
    question: "Show your day’s emotions with 1 sun and 2 clouds.",
    description: "Express how your mood changed from morning to night using nature. If emotions are unclear, just use colors to represent them."
  },
  {
    stage: 3,
    question: "Draw a tree with 1 root, 3 branches, and 3 leaves.",
    description: "The root reflects your thoughts, the branches your strengths, and the leaves your emotions. You can use colors or objects instead of words."
  },
  {
    stage: 4,
    question: "Divide the day into 3 paths and express your feelings on each one.",
    description: "Draw morning, afternoon, and evening paths. Use colors or symbols to reflect how you felt. Curvy or straight, it’s still your day."
  },
  {
    stage: 5,
    question: "Express joy, anger, anxiety, and sadness using 4 fruits.",
    description: "Draw each fruit to reflect a feeling. If it's hard to label them, just use similar colors or shapes—it’s okay."
  },
  {
    stage: 6,
    question: "Draw things connected to you to show your relationships.",
    description: "Not only people—pets, objects, or memories are all welcome. Think of what feels close to you."
  },
  {
    stage: 7,
    question: "Draw 5 flowers, each with a comforting message.",
    description: "You may write healing words, or just use gentle shapes and colors. Create your own garden of comfort."
  },
  {
    stage: 8,
    question: "ExperiencesDraw 3 stars for meaningful memories, and name one of them.",
    description: "Even if the memory is vague, it’s okay. A feeling or color is enough—the act of remembering matters most."
  },
  {
    stage: 9,
    question: "Draw a space you’d like to live in, with a cloud, sun, and tree included.",
    description: "It’s fine if the future feels unclear. Just imagine a warm, peaceful scene. Expressing even one element is already enough."
  },
  {
    stage: 10,
    question: "Draw one big tree that holds your feelings, memories, and beliefs.",
    description: "Combine what you’ve expressed so far. Any form is okay—this is your whole self coming together."
  },
  {
    stage: 11,
    question: "Show 3 future roles using symbolic objects.",
    description: "Think of items like books, microphones, or brushes to represent what you want. Even a vague image is perfectly fine."
  },
  {
    stage: 12,
    question: "Place your first and latest drawings side by side and write 3 things that changed.",
    description: "Small changes matter. Look at color, position, or size. Just redrawing yourself is already a sign of growth."
  }
];

export const getStageQuestion = (stage) => {
  return STAGE_QUESTIONS.find(item => item.stage === stage) || STAGE_QUESTIONS[0];
};
