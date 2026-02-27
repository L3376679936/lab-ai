<template>
  <div class="lab-text-roll" :class="[directionClass]" :style="customStyle">
    <div class="roll-mask">
      <div
        ref="wrapper"
        class="roll-wrapper"
        :style="wrapperStyle"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div ref="content" class="roll-content">
          <slot></slot>
        </div>
        <!-- Copy content for seamless loop if needed, but for now standard marquee -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LabTextRoll",
  props: {
    // 滚动速度 (px/s)
    speed: {
      type: Number,
      default: 60
    },
    // 方向: left, right, up, down
    direction: {
      type: String,
      default: "left",
      validator: val => ["left", "right", "up", "down"].includes(val)
    },
    // 鼠标悬停暂停
    hoverStop: {
      type: Boolean,
      default: true
    },
    // 容器高度 (仅垂直模式需要显式指定，或者通过 CSS 控制)
    height: {
      type: [String, Number],
      default: "auto"
    },
     // 容器宽度
    width: {
      type: [String, Number],
      default: "100%"
    },
    // 是否开启无缝滚动（内容复制一份）
    seamless: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      offset: 0,
      contentSize: 0,
      containerSize: 0,
      reqId: null,
      isHover: false,
      isOverflow: false
    };
  },
  computed: {
    directionClass() {
      return `is-${this.direction}`;
    },
    isHorizontal() {
      return this.direction === "left" || this.direction === "right";
    },
    customStyle() {
      return {
        width: typeof this.width === 'number' ? this.width + 'px' : this.width,
        height: typeof this.height === 'number' ? this.height + 'px' : this.height
      }
    },
    wrapperStyle() {
      const translate = this.isHorizontal
        ? `translate3d(${this.offset}px, 0, 0)`
        : `translate3d(0, ${this.offset}px, 0)`;
      return {
        transform: translate,
        // Make sure it acts as a container for absolute/flex
        display: this.isHorizontal ? 'inline-block' : 'block'
      };
    }
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    this.stop();
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.measure();
        // Start from container width (enter from right) or 0? 
        // myText1 logic: starts from 100% (right edge) to -width.
        // Let's adopt standard marquee: starts from rightmost edge.
        if (this.isHorizontal) {
           this.offset = this.containerSize;
        } else {
           this.offset = this.containerSize;
        }
        
        this.start();
      });
    },
    measure() {
      const wrapper = this.$refs.wrapper;
      const content = this.$refs.content;
      if (!wrapper || !content) return;

      if (this.isHorizontal) {
        this.contentSize = content.offsetWidth;
        this.containerSize = this.$el.offsetWidth;
      } else {
        this.contentSize = content.offsetHeight;
        this.containerSize = this.$el.offsetHeight;
      }
      
      // If content is smaller than container, maybe we don't roll? 
      // But standard marquee usually rolls anyway.
    },
    start() {
      this.stop();
      this.run();
    },
    stop() {
      if (this.reqId) {
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
      }
    },
    run() {
      if (this.isHover && this.hoverStop) {
        // Pause but keep loop checking
        this.reqId = requestAnimationFrame(this.run);
        return;
      }

      const step = this.speed / 60; // Approximate px per frame (assuming 60fps)

      if (this.direction === "left") {
        this.offset -= step;
        if (this.offset < -this.contentSize) {
          this.offset = this.containerSize;
        }
      } else if (this.direction === "right") {
        this.offset += step;
        if (this.offset > this.containerSize) {
          this.offset = -this.contentSize;
        }
      } else if (this.direction === "up") {
        this.offset -= step;
        if (this.offset < -this.contentSize) {
          this.offset = this.containerSize;
        }
      } else if (this.direction === "down") {
         this.offset += step;
        if (this.offset > this.containerSize) {
          this.offset = -this.contentSize;
        }
      }

      this.reqId = requestAnimationFrame(this.run);
    },
    handleMouseEnter() {
      this.isHover = true;
    },
    handleMouseLeave() {
      this.isHover = false;
    },
    handleResize() {
        this.measure();
    }
  }
};
</script>

<style lang="scss" scoped>
.lab-text-roll {
  overflow: hidden;
  position: relative;
  /* Default styles for container */
  
  .roll-mask {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .roll-wrapper {
    /* Will be moved by transform */
    white-space: nowrap; 
    will-change: transform;
  }
  
  .roll-content {
      display: inline-block;
  }

  &.is-up, &.is-down {
    .roll-wrapper {
        white-space: normal;
        display: block;
    }
    .roll-content {
        display: block;
    }
  }
}
</style>
