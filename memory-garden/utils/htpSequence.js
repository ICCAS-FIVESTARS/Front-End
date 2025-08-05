export const HTP_SEQUENCE = [
  {
    id: 1,
    object: 'house',
    instruction: 'Please draw a house',
    description: 'It doesn not matter what house it is. Feel free to draw.'
  },
  {
    id: 2,
    object: 'tree',
    instruction: 'Please draw a tree',
    description: 'Draw a tree next to your house. It doesn not matter what kind of tree it is.'
  },
  {
    id: 3,
    object: 'people',
    instruction: 'Please draw a person',
    description: 'Draw a person where there are houses and trees. It doesn not matter who it is.'
  },
];

export const getHtpStep = (stepNumber) => {
  return HTP_SEQUENCE.find(step => step.id === stepNumber) || HTP_SEQUENCE[0];
};

export const getTotalHtpSteps = () => {
  return HTP_SEQUENCE.length;
};
