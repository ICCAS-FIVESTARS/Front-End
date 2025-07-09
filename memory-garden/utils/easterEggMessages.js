export const EASTER_EGG_MESSAGES = [
  "🌟 신비한 기운이 느껴져요! 뭔가 특별한 일이 일어날 것 같아요!",
  "✨ 마법의 포션이 당신의 마음을 치유하고 있어요!",
  "🎭 숨겨진 보물이 당신을 기다리고 있어요!",
  "🌈 무지개 빛깔의 에너지가 정원에 퍼져나가네요!",
  "🦋 나비들이 당신 주위를 맴돌며 축복을 전해요!",
  "🌸 꽃잎이 춤추며 당신의 용기를 칭찬해요!",
  "⭐ 별들이 당신의 노력을 지켜보고 있어요!",
  "🎪 마법의 서커스가 당신만을 위해 열렸어요!",
  "🎨 창의력의 여신이 당신에게 미소를 보내요!",
  "🌙 달빛이 당신의 꿈을 응원하고 있어요!"
];

export const getRandomEasterEggMessage = () => {
  const randomIndex = Math.floor(Math.random() * EASTER_EGG_MESSAGES.length);
  return EASTER_EGG_MESSAGES[randomIndex];
};
