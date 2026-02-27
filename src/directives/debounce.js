const debounce = {
    inserted: function (el, binding) {
      // 提取参数对象中的属性
      const { fn, event, time, args = [] } = binding.value;
      
      // 检查绑定的函数是否存在且为函数类型
      if (typeof fn !== 'function') return;
      
      el._timer = null;
      
      // 监听事件，并在指定时间内执行函数，并传递参数
      el.addEventListener(event, () => {
        if (el._timer !== null) {
          clearTimeout(el._timer);
          el._timer = null;
        }
        el._timer = setTimeout(() => {
          fn(...args); // 使用扩展运算符将参数传递给函数
        }, time);
      });
    },
  };
  
  export default debounce;
  