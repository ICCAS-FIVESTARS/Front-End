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

// 12일 출석체크 시스템
export const checkDailyAttendance = (lastAttendanceDate, consecutiveDays = 0) => {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    
    // 오늘 이미 출석했는지 확인
    if (lastAttendanceDate === todayDateString) {
        return {
            alreadyChecked: true,
            message: "오늘은 이미 출석했습니다!",
            consecutiveDays: consecutiveDays,
            currentDay: consecutiveDays,
            isComplete: consecutiveDays >= 12
        };
    }
    
    let newConsecutiveDays = 0; // 기본값: 초기화
    
    if (lastAttendanceDate) {
        // 마지막 출석일의 다음날이 오늘인지 확인 (연속 출석 체크)
        const lastDate = new Date(lastAttendanceDate);
        const nextDay = new Date(lastDate);
        nextDay.setDate(lastDate.getDate() + 1);
        
        const nextDayString = nextDay.toISOString().split('T')[0];
        
        if (nextDayString === todayDateString) {
            // 연속 출석인 경우
            if (consecutiveDays >= 12) {
                // 12일 완료 후 다음날이면 초기화
                newConsecutiveDays = 0;
            } else {
                // 연속 출석 계속
                newConsecutiveDays = consecutiveDays + 1;
            }
        } else {
            // 연속 출석이 끊어진 경우 초기화
            newConsecutiveDays = 0;
        }
    }
    
    // 현재 일차 (0-based index)
    const currentDay = newConsecutiveDays;
    const message = ROLL_CALL_MESSAGES[currentDay];
    const isComplete = newConsecutiveDays >= 11; // 0-based이므로 11이 12일차
    
    return {
        alreadyChecked: false,
        message: message,
        consecutiveDays: newConsecutiveDays,
        currentDay: currentDay + 1, // 사용자에게 보여줄 때는 1-based
        todayDate: todayDateString,
        isComplete: isComplete
    };
};

// 현재 출석 상태를 가져오는 헬퍼 함수
export const getAttendanceMessage = (consecutiveDays) => {
    if (consecutiveDays < 0 || consecutiveDays >= 12) {
        return ROLL_CALL_MESSAGES[0]; // 범위를 벗어나면 첫 번째 메시지
    }
    return ROLL_CALL_MESSAGES[consecutiveDays];
};