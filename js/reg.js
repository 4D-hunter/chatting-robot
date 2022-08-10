const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账户已存在，请重新输入";
  }
});
const txtNicknameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});
const txtLoginPwd = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});
const txtLoginPwdConfirm = new FieldValidator("txtLoginPwdConfirm", function (
  val
) {
  if (!val) {
    return "请再次确认密码";
  }
  if (val !== txtLoginPwd.input.value) {
    return "两次输入密码不一致";
  }
});
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault(); //阻止提交表单刷新页面的默认行为
  const result = await FieldValidator.validate(
    loginIdValidator,
    txtNicknameValidator,
    txtLoginPwd,
    txtLoginPwdConfirm
  );
  if (!result) {
    return; //验证失败
  }
  const formData = new FormData(form); //传入一个表单dom,得到一个表单的数据对象
  const entries = formData.entries(); //FormData构造函数原型上的一个方法，用于获取实例上面的数据的键值对，键为文本框的name属性，值为文本框的值
  const data = Object.fromEntries(entries); //上一步得到的是一个二维数组，这里用对象上面的一个方法将其还原成一个对象
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，请前往登录页");
    location.href = "./login.html";
  }
};
