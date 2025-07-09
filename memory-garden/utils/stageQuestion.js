export const STAGE_QUESTIONS = [
  {
    stage: 1,
    question: "오늘의 기분을 색깔로 표현해보세요",
    description: "어떤 색이 지금 당신의 마음을 가장 잘 나타내나요?"
  },
  {
    stage: 2,
    question: "당신의 안전한 공간을 그려보세요",
    description: "마음이 편안해지는 장소를 자유롭게 그려보세요"
  },
  {
    stage: 3,
    question: "구름과 화살표가 포함된 그림을 그려보세요",
    description: "구름과 화살표를 포함하여 자유롭게 표현해보세요"
  },
  {
    stage: 4,
    question: "나무와 집이 있는 풍경을 그려보세요",
    description: "나무와 집을 포함한 풍경을 그려보세요"
  },
  {
    stage: 5,
    question: "가족을 그려보세요",
    description: "당신의 가족을 자유롭게 그려보세요"
  },
  {
    stage: 6,
    question: "동그라미 안에 당신의 감정을 표현해보세요",
    description: "원 안에 지금 느끼는 감정을 그려보세요"
  },
  {
    stage: 7,
    question: "비가 내리는 날의 풍경을 그려보세요",
    description: "비와 관련된 장면을 자유롭게 그려보세요"
  },
  {
    stage: 8,
    question: "꽃과 나비가 있는 정원을 그려보세요",
    description: "꽃과 나비를 포함한 아름다운 정원을 그려보세요"
  },
  {
    stage: 9,
    question: "별이 빛나는 밤하늘을 그려보세요",
    description: "밤하늘의 별들을 자유롭게 표현해보세요"
  },
  {
    stage: 10,
    question: "물고기가 헤엄치는 바다를 그려보세요",
    description: "바다와 물고기들을 그려보세요"
  },
  {
    stage: 11,
    question: "산과 태양이 있는 풍경을 그려보세요",
    description: "산과 태양을 포함한 자연 풍경을 그려보세요"
  },
  {
    stage: 12,
    question: "당신의 꿈을 그려보세요",
    description: "미래에 이루고 싶은 꿈을 자유롭게 표현해보세요"
  }
];

export const getStageQuestion = (stage) => {
  return STAGE_QUESTIONS.find(item => item.stage === stage) || STAGE_QUESTIONS[0];
};
