const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const txtLoginPwd = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault(); //阻止提交表单刷新页面的默认行为
  const result = await FieldValidator.validate(loginIdValidator, txtLoginPwd);
  if (!result) {
    return; //验证失败
  }
  const formData = new FormData(form); //传入一个表单dom,得到一个表单的数据对象
  const entries = formData.entries(); //FormData构造函数原型上的一个方法，用于获取实例上面的数据的键值对，键为文本框的name属性，值为文本框的值
  const data = Object.fromEntries(entries); //上一步得到的是一个二维数组，这里用对象上面的一个方法将其还原成一个对象
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerText = "账号或密码错误";
    txtLoginPwd.input.value = "";
  }
};
