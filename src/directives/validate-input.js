export default {
    inserted: function (el, binding) {
    //   const config = binding.value;

      // 添加input事件监听
      el.addEventListener("input", (event) => {
        const value = event.target.value;
        let validValue = "";
        if(binding.value==='number'){
            validValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
        }else if(binding.value==='text'){
            validValue = value.replace(/[^a-zA-Z\u4E00-\u9FFF]/g, ""); // 允许文字和中文
        }else{
            validValue = value;
        }



        // // 根据配置决定只允许数字、文字或同时允许数字和文字
        // if (config.allowNumbers && config.allowText) {
        //   validValue = value;
        // } else if (config.allowNumbers) {
        //      // 允许数字和小数点，但确保小数点只能输入一个
        //      validValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
        // } else if (config.allowText) {
        //   validValue = value.replace(/[^a-zA-Z]/g, "");
        // }

        // 更新输入框的值
        event.target.value = validValue;
      });
    }
}