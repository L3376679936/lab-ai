

export default {
    bind(el, bindingObj) {
        let flag, timer;
        const [fn, time = 300, attr = 'click', ...args] = bindingObj.value;
        
        el.addEventListener(attr, (event) => {
          if (flag) {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), time);
            return false;
          }
          fn(...args);
          flag = setTimeout(() => flag = null, time);
        });
      }
}


