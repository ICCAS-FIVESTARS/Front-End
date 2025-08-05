export const ENCOURAGEMENT_MESSAGES = [
  {
    stage: 1,
    message: "You have completed the first step! Your emotions expressed in colors are beautiful. 🎨",
    subMessage: "Expressing your feelings takes courage. You're doing great!"
  },
  {
    stage: 2,
    message: "You drew a safe space! It is important to find peace of mind. 🏡",
    subMessage: "You're creating your own special space."
  },
  {
    stage: 3,
    message: "It's a wonderful piece with clouds and arrows! Creativity stands out. ☁️➡️",
    subMessage: "Thank you for using your imagination to express it."
  },
  {
    stage: 4,
    message: "You captured the beauty of nature! The trees and houses are in harmony. 🌳🏠",
    subMessage: "I can feel the feeling of being with nature."
  },
  {
    stage: 5,
    message: "My warm heart goes out for my family! What a precious people. 👨👩👧👦",
    subMessage: "Thank you for expressing your love."
  },
  {
    stage: 6,
    message: "The feelings in the circle are sincere! Your honest expression is beautiful. ⭕",
    subMessage: "You have great courage to look into your inner feelings."
  },
  {
    stage: 7,
    message: "The scenery on a rainy day is emotional! The weather and emotions mix well. 🌧️",
    subMessage: "Every weather has its own beauty."
  },
  {
    stage: 8,
    message: "The garden where flowers and butterflies dance is fantastic! It is full of life. 🌸🦋",
    subMessage: "It warms my heart because you express beautiful nature."
  },
  {
    stage: 9,
    message: "The night sky is mysterious! I can see dreams and hopes. ✨🌙",
    subMessage: "It's beautiful to find the light even in the dark."
  },
  {
    stage: 10,
    message: "The sea and the fish swimming freely are peaceful! 🌊🐠",
    subMessage: "I feel a free spirit."
  },
  {
    stage: 11,
    message: "The scenery of the mountain and the sun is magnificent! It seems to mark a new beginning. ⛰️☀️",
    subMessage: "I can see the will toward a hopeful future."
  },
  {
    stage: 12,
    message: "It's so touching how you drew your dream! You've completed the whole journey! 🎉✨",
    subMessage: "Congratulations on completing the entire 12-step course. You are such an amazing person!"
  }
];

export const getEncouragementMessage = (stage) => {
  return ENCOURAGEMENT_MESSAGES.find(item => item.stage === stage) || ENCOURAGEMENT_MESSAGES[0];
};
