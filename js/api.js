var API = (function () {
  const Token_KEY = "token";
  const BASE_URL = "https://study.duyiedu.com";
  // 封装两个函数，以便更快捷的配置请求
  // 快捷配置请求头
  function get(path) {
    const headers = {};
    const token = localStorage.getItem(Token_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  function post(path, bodyObj) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem(Token_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }
  async function reg(userInfo) {
    return await post("/api/user/reg", userInfo).then((resp) => resp.json());
  }
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    //拿到响应体
    const result = await resp.json();
    // 将令牌存储到本地
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      localStorage.setItem(Token_KEY, token);
    }
    return result;
  }
  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`);
    return resp.json();
  }
  async function profile() {
    const resp = await get("/api/user/profile");
    return resp.json();
  }
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return resp.json();
  }
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return resp.json();
  }
  function loginOut() {
    localStorage.removeItem(Token_KEY);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
