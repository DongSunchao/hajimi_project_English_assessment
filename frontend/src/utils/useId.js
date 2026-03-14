export const getOrCreateUserId = () => {
    let userId = localStorage.getItem('app_user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('app_user_id', userId);
    }
    return userId;
  };