export const ROLL_CALL_MESSAGES = [
    "Hey, there! It's our first time meeting. Thank you for being here!",
    "You came again today. That's awesome!",
    "Your consistency warms even my heart. Thank you!",
    "I feel like we've gotten pretty close now.",
    "I'm cheering you on every day!",
    "Spending each day with you is so meaningful.",
    "Wow, it's already been a week! That's amazing!",
    "All your small efforts are adding up!",
    "It feels like we're more familiar with each other now.",
    "You've made this place feel warmer.",
    "You've done really well so far. I believe in you!",
    "I'm grateful for these 12 days together. You are very special to me🌸"
];

// 간단한 출석 체크 함수 - 일단 첫 번째 메시지만 반환
export const getWelcomeMessage = () => {
    const randomIndex = Math.floor(Math.random() * ROLL_CALL_MESSAGES.length);
    return ROLL_CALL_MESSAGES[randomIndex];
};