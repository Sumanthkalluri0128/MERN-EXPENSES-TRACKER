export const getUserFromStorage = () => {
  const userinfo = JSON.parse(localStorage.getItem("userInfo")) || null;
  return userinfo?.token;
};
