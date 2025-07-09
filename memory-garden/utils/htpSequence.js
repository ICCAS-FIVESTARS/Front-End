export const HTP_SEQUENCE = [
  {
    id: 1,
    object: '집',
    instruction: '집을 그려주세요',
    description: '어떤 집이든 상관없습니다. 자유롭게 그려보세요.'
  },
  {
    id: 2,
    object: '나무',
    instruction: '나무를 그려주세요',
    description: '집 옆에 나무를 그려보세요. 어떤 나무든 상관없습니다.'
  },
  {
    id: 3,
    object: '사람',
    instruction: '사람을 그려주세요',
    description: '집과 나무가 있는 곳에 사람을 그려보세요. 어떤 사람이든 상관없습니다.'
  },
];

export const getHtpStep = (stepNumber) => {
  return HTP_SEQUENCE.find(step => step.id === stepNumber) || HTP_SEQUENCE[0];
};

export const getTotalHtpSteps = () => {
  return HTP_SEQUENCE.length;
};
