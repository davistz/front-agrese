export const getToken = () => {
    const token = localStorage.getItem('authToken');
    console.log('[getToken] Token:', token);
    return token;
}