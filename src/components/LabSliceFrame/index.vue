<template>
  <div 
    class="lab-slice-frame" 
    :style="frameStyle"
  >
    <!-- 内容插槽 -->
    <div class="lab-slice-frame__content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * LabSliceFrame - 通用九宫格缩放容器
 * 解决了背景图片（带边角装饰）在不同比例下变形的问题。
 * 原理：利用 CSS border-image 的 9-slice 缩放机制。
 */
export default {
  name: 'LabSliceFrame',
  props: {
    /**
     * 背景图片 URL
     */
    image: {
      type: String,
      required: true
    },
    /**
     * 九宫格切分数值 (对应 border-image-slice)
     * 可以是单个数值或空格分隔的四个值 (上 右 下 左)
     * 通常对应图片中边角装饰的像素大小
     */
    slice: {
      type: [Number, String],
      default: 20
    },
    /**
     * 边框宽度 (对应 border-width)
     * 决定了边角装饰在页面上显示的粗细/大小
     */
    borderWidth: {
      type: [Number, String],
      default: 20
    },
    /**
     * 内容区域的内边距
     */
    padding: {
      type: String,
      default: '16px'
    },
    /**
     * 背景填充模式 (stretch | repeat | round)
     */
    repeat: {
      type: String,
      default: 'stretch'
    }
  },
  computed: {
    frameStyle() {
      let bw = this.borderWidth;
      if (typeof bw === 'number') {
        bw = `${bw}px`;
      } else if (typeof bw === 'string' && !isNaN(bw)) {
        bw = `${bw}px`;
      }
      
      let sl = this.slice;
      // 这里的 fill 是必须的，否则中间内容区域背景会丢失
      const sliceValue = typeof sl === 'string' ? sl : `${sl}`;

      return {
        'border-width': bw,
        'border-style': 'solid',
        'border-image-source': `url(${this.image})`,
        'border-image-slice': `${sliceValue} fill`,
        'border-image-repeat': this.repeat
      };
    },
    contentStyle() {
      return {
        padding: this.padding
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-slice-frame {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  min-width: 40px;
  min-height: 40px;
  transition: all 0.3s ease;

  // 确保边框不会因为没有内容而塌陷
  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
