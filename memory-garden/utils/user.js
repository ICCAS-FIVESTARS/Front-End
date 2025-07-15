import React, { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    id: 'user123',
    name: '정원지기',
    stage: 11,
    clearTime: 5,
    potion: 4,
    currentSetPotionUsed: 0,
    hidden_item_list: [1, 0, 1, 1, 0, 0,],
    isFirstLogin: false // 첫 로그인 체크 변수 추가
  });

  const updateUserInfo = useCallback((newInfo) => {
    setUserInfo(prev => {
      const updated = { ...prev, ...newInfo };
      console.log('UserInfo 업데이트:', updated);
      return updated;
    });
  }, []);

  const getHiddenItemCount = useCallback(() => {
    return userInfo.hidden_item_list.filter(item => item === 1).length;
  }, [userInfo.hidden_item_list]);

  // 포션 사용 함수
  const usePotion = useCallback(() => {
    let result = { success: false };
    setUserInfo(prev => {
      if (prev.potion > 0) {
        const newPotionCount = prev.potion - 1;
        const newSetPotionUsed = prev.currentSetPotionUsed + 1;
        result = {
          success: true,
          potionUsedInSet: newSetPotionUsed,
          remainingPotion: newPotionCount
        };
        return {
          ...prev,
          potion: newPotionCount,
          currentSetPotionUsed: newSetPotionUsed
        };
      }
      return prev;
    });
    return result;
  }, []);

  // 히든 아이템 해금 함수
  const unlockRandomHiddenItem = useCallback(() => {
    let unlocked = false;
    setUserInfo(prev => {
      const hiddenItems = [...prev.hidden_item_list];
      const lockedIndices = hiddenItems
        .map((item, index) => item === 0 ? index : null)
        .filter(index => index !== null);

      if (lockedIndices.length > 0) {
        const randomIndex = lockedIndices[Math.floor(Math.random() * lockedIndices.length)];
        hiddenItems[randomIndex] = 1;
        unlocked = true;
        return {
          ...prev,
          hidden_item_list: hiddenItems
        };
      }
      return prev;
    });
    return unlocked;
  }, []);

  // 세트 완료 처리 함수
  const completeSet = useCallback(() => {
    setUserInfo(prev => ({
      ...prev,
      clearTime: prev.clearTime + 1,
      stage: 0,
      currentSetPotionUsed: 0
    }));
  }, []);

  // 첫 로그인 완료 처리 함수
  const completeFirstLogin = useCallback(() => {
    setUserInfo(prev => ({
      ...prev,
      isFirstLogin: false
    }));
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        updateUserInfo,
        getHiddenItemCount,
        usePotion,
        unlockRandomHiddenItem,
        completeSet,
        completeFirstLogin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
