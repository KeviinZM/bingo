// Utility to manage user identity
export const getUserId = () => {
    let userId = localStorage.getItem('bingo_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('bingo_user_id', userId);
    }
    return userId;
};
