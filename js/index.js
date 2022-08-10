//验证是否有登录，如果没有登陆，跳转到登录页，如果登录了，获取到用户信息
// 页面加载完成时判断本地有没有token
(async function () {
  const resp = await API.profile();
  const user = resp.data;
  //登陆失败
  if (!user) {
    alert("请先登录");
    location.href = "./login.html";
    return;
  }
  const doms = {
    aside: {
      loginId: $("#loginId"),
      nickname: $("#nickname"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  //登陆成功
  setUserInfo();

  //注销事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };
  // 显示用户信息
  function setUserInfo() {
    doms.aside.loginId.innerText = resp.data.loginId;
    doms.aside.nickname.innerText = resp.data.nickname;
  }

  //获取历史消息记录
  const arr = await API.getHistory();
  arr.data.forEach(({ content, createdAt, from }) => {
    addChat({ content, createdAt, from });
  });
  // 历史消息加载完毕之后，需要将聊天窗口的滚动条位置设置到聊天窗口的最底部
  setScroll();

  // 发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
  /**
   * 根据消息对象，将消息加入到聊天窗口去
   * content: "菲菲是个小美女"
   * createdAt: 1659746528673
   *from: null
   *to: "劫"
   *_id: "62edb8e0d88e1031b48d82ee"
   */
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  // 格式化时间戳
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // 设置滚动条位置
  function setScroll() {
    // console.log(doms.chatContainer.scrollHeight);
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  // 发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    setScroll();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    setScroll();
  }
})();
