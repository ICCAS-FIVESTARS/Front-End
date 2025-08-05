export const EASTER_EGG_MESSAGES = [
  "🌟 I can feel the mysterious energy! I think something special will happen!",
  "✨ Magic potion is healing your mind!",
  "🎭 A hidden treasure awaits you!",
  "🌈 The rainbow-colored energy is spreading through the garden!",
  "🦋 The butterflies hover around you and give you their blessings!",
  "🌸 Petals dance and praise your courage!",
  "⭐ The stars are watching your efforts!",
  "🎪 Magic Circus is open just for you!",
  "🎨 The goddess of creativity sends you a smile!",
  "🌙 Moonlight is rooting for your dream!"
];

export const getRandomEasterEggMessage = () => {
  const randomIndex = Math.floor(Math.random() * EASTER_EGG_MESSAGES.length);
  return EASTER_EGG_MESSAGES[randomIndex];
};
