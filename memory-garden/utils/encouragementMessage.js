export const ENCOURAGEMENT_MESSAGES = [
  {
    stage: 1,
    message: "첫 번째 단계를 완료하셨네요! 색깔로 표현한 당신의 감정이 아름답습니다. 🎨",
    subMessage: "감정을 표현하는 것은 용기가 필요한 일이에요. 잘하고 계십니다!"
  },
  {
    stage: 2,
    message: "안전한 공간을 그려주셨군요! 마음의 평안을 찾는 것이 중요해요. 🏡",
    subMessage: "당신만의 특별한 공간을 만들어가고 있어요."
  },
  {
    stage: 3,
    message: "구름과 화살표가 포함된 멋진 작품이에요! 창의력이 돋보입니다. ☁️➡️",
    subMessage: "상상력을 발휘해서 표현해주셔서 감사해요."
  },
  {
    stage: 4,
    message: "자연의 아름다움을 담아내셨네요! 나무와 집이 조화롭습니다. 🌳🏠",
    subMessage: "자연과 함께하는 마음이 느껴져요."
  },
  {
    stage: 5,
    message: "가족에 대한 따뜻한 마음이 전해집니다! 소중한 사람들이군요. 👨‍👩‍👧‍👦",
    subMessage: "사랑하는 마음을 표현해주셔서 고마워요."
  },
  {
    stage: 6,
    message: "원 안에 담긴 감정이 진솔하게 느껴져요! 솔직한 표현이 아름답습니다. ⭕",
    subMessage: "내면의 감정을 들여다보는 용기가 대단해요."
  },
  {
    stage: 7,
    message: "비 오는 날의 풍경이 감성적이에요! 날씨와 감정이 잘 어우러졌네요. 🌧️",
    subMessage: "모든 날씨에는 나름의 아름다움이 있어요."
  },
  {
    stage: 8,
    message: "꽃과 나비가 춤추는 정원이 환상적이에요! 생명력이 넘쳐나네요. 🌸🦋",
    subMessage: "아름다운 자연을 표현해주셔서 마음이 따뜻해져요."
  },
  {
    stage: 9,
    message: "별빛이 가득한 밤하늘이 신비로워요! 꿈과 희망이 보입니다. ✨🌙",
    subMessage: "어둠 속에서도 빛을 찾는 마음이 아름다워요."
  },
  {
    stage: 10,
    message: "바다와 물고기들이 자유롭게 헤엄치는 모습이 평화로워요! 🌊🐠",
    subMessage: "자유로운 영혼이 느껴져요."
  },
  {
    stage: 11,
    message: "산과 태양이 어우러진 풍경이 웅장해요! 새로운 시작을 알리는 듯해요. ⛰️☀️",
    subMessage: "희망찬 미래를 향한 의지가 보여요."
  },
  {
    stage: 12,
    message: "꿈을 그려내신 모습이 정말 감동적이에요! 모든 여정을 완주하셨습니다! 🎉✨",
    subMessage: "12단계 모든 과정을 완료하신 것을 축하드려요. 당신은 정말 대단한 사람이에요!"
  }
];

export const getEncouragementMessage = (stage) => {
  return ENCOURAGEMENT_MESSAGES.find(item => item.stage === stage) || ENCOURAGEMENT_MESSAGES[0];
};
