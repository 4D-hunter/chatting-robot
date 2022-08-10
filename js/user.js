//用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId
   * @param {Function} validatorFunc//人为定义的验证规则函数，当需要对某个文本框验证时，会调用该函数，函数的参数为文本框当前值，函数的返回结果为验证的错误消息，若没有错误消息则验证成功
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    // console.log(this.input, this.p);
    //拿到上面的元素之后，现在要对其开始验证
    //>>>什么时候开始验证？
    //>>>1.元素失去焦点的时候要进行验证
    this.input.onblur = () => {
      this.validate();
    };
  }
  // 2.当整个表单提交的时候要进行验证
  /**
   * 原型方法用于验证表单，可以随时调用，验证成功返回true,验证失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 构造器的静态方法，用于在提交表单时对表单的每一项进行统一验证，根据其验证结果再决定是否需要提交表单
   * @param Array{...args} validataors 一个包含所有验证器验证结果的数组
   */
  static async validate(...validataors) {
    const proms = validataors.map((v) => v.validate()); //将传进来的每一个验证器映射为去调用它原型上的validate方法，返回一个每一项均为一个promise的数组
    const result = await Promise.all(proms); //调用Promise的静态方法，等待数组proms的每一项的promsie完成，返回一个每一项均为布尔值的一个数组
    return result.every((r) => r); //调用数组的every方法(ES5的查找方法)，将result数组的每一项传入，如果有一项为false则返回false,如果都为true则返回true
  }
}
