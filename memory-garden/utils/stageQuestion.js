export const STAGE_QUESTIONS = [
  {
    stage: 1,
    question: "지금의 나를 표현하고, ‘구름’을 그려보세요",
    description: "현재의 감정을 구름으로 표현해보세요"
  },
  {
    stage: 2,
    question: "현재 기분을 ‘태양’과 ‘구름’으로 표현해보세요",
    description: "따뜻함, 답답함 등 감정을 날씨의 이미지로 표현해보세요 "
  },
  {
    stage: 3,
    question: "당신을 ‘나무’에 비유해서 표현해보세요",
    description: "뿌리, 가지, 잎 등을 통해 나의 내면과 성격을 표현해보세요"
  },
  {
    stage: 4,
    question: "하루의 일상을 ‘길’을 따라 그려보세요",
    description: "아침부터 저녁까지의 나의 하루를 길 위의 장면으로 표현해보세요"
  },
  {
    stage: 5,
    question: "현재 기분을 ‘열매’를 통해 표현해보세요",
    description: "슬픔, 기쁨, 분노 등의 감정을 열매의 색과 모양으로 시각화해보세요"
  },
  {
    stage: 6,
    question: "나에게 소중한 사람들과 있는 장면을 그려보세요",
    description: "가족이나 친구들과 함께 있는 모습을 통해 관계의 의미를 표현해보세요"
  },
  {
    stage: 7,
    question: "마음을 편안하게 하는 ‘꽃 정원’을 꾸며보세요",
    description: "좋아하는 꽃과 잔디로 채워진 공간을 상상하고 꾸며보세요"
  },
  {
    stage: 8,
    question: "기억 속 특별했던 순간을 ‘별’과 함께 그려보세요",
    description: "반짝였던 순간을 별과 함께 표현해보세요"
  },
  {
    stage: 9,
    question: "내가 꿈꾸는 미래의 공간을 상상해 그려보세요",
    description: "밝고 희망찬 공간을 집, 구름, 태양, 나무 등으로 구성해보세요"
  },
  {
    stage: 10,
    question: "과거-현재-미래의 나를 ‘길 위의 인물’로 표현해보세요",
    description: "시간의 흐름에 따라 나의 변화된 모습을 길 위에 순서대로 표현해보세요"
  },
  {
    stage: 11,
    question: "내가 살고 싶은 마을을 그려보세요",
    description: "사람들과 어울려 사는 모습을 상상하며 마을을 구성해보세요"
  },
  {
    stage: 12,
    question: "지난 여정을 담은 ‘별’과 ‘꽃’이 있는 포스터를 완성해보세요",
    description: "나의 변화와 성장을 상징하는 요소들을 사용해 나만의 이야기를 구성해보세요 "
  }
];

export const getStageQuestion = (stage) => {
  return STAGE_QUESTIONS.find(item => item.stage === stage) || STAGE_QUESTIONS[0];
};
