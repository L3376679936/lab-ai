<template>
  <div class="lab-rich-text" :class="themeClass">
    <editor :key="currentTheme" v-model="content" :init="init" :disabled="disabled"></editor>
  </div>
</template>

<script>
// http://tinymce.ax-z.cn/integrations/integrate-index.php
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/icons/default/icons';
import 'tinymce/themes/silver';

// 引入核心插件
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/code';
import 'tinymce/plugins/link';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/template';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/print';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/help';
import 'tinymce/plugins/emoticons/js/emojis'; // 确保表情包加载

import { mapState } from 'vuex';

/**
 * @component LabRichText
 * @description 基于 Tinymce 的富文本编辑器组件
 * 深度集成了暗色主题样式，支持自定义插件和工具栏。
 * 
 * @prop {String} value - 编辑器内容 (v-model)
 * @prop {Boolean} disabled - 是否禁用编辑器
 * @prop {Number} height - 编辑器高度，默认 500
 * @prop {String} plugins - 启用的插件列表字符串
 * @prop {String} toolbar - 工具栏配置字符串
 */
export default {
  name: 'LabRichText',
  components: {
    Editor
  },
  props: {
    // 绑定值
    value: {
      type: String,
      default: ''
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    // 高度
    height: {
      type: Number,
      default: 500
    },
    // 插件配置
    plugins: {
      type: String,
      default:
        'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave autoresize'
    },
    // 工具栏配置
    toolbar: {
      type: String,
      default:
        'styleselect fontselect fontsizeselect | ' +
        'code undo redo restoredraft | ' +
        'copy cut paste pastetext | ' +
        'forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | help'
    }
  },
  data() {
    return {
      content: this.value,
      currentTheme: this.$store.state.theme // 初始化当前主题
    };
  },
  computed: {
    ...mapState(['theme']),
    // 根据全局主题生成类名
    themeClass() {
      // 外部容器的主题类名可以立即更新，保持边框等样式的响应速度
      return `theme-${this.theme}`;
    },
    // Tinymce 初始化配置
    init() {
      // 使用 currentTheme 来决定编辑器内部的皮肤，延迟生效
      const isDark = this.currentTheme === 'tech';
      const baseUrl = process.env.BASE_URL;
      return {
        language_url: `${baseUrl}tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin_url: isDark ? `${baseUrl}tinymce/skins/ui/oxide-dark` : `${baseUrl}tinymce/skins/ui/oxide`,
        content_css: isDark ? `${baseUrl}tinymce/skins/content/dark/content.css` : `${baseUrl}tinymce/skins/content/default/content.css`,
        height: this.height,
        min_height: this.height,
        max_height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        content_style: this.getContentStyle(isDark),
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        branding: false,
        menubar: false,
        resize: false, // 禁用自带resize，使用外层控制或自动高度
        // 图片上传处理
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64();
          success(img);
        }
      };
    }
  },
  watch: {
    // 监听全局主题变化，防抖延迟更新内部编辑器，避免卡顿
    theme: {
      handler(val) {
        // 如果有正在进行的定时器，清除它（可选，但 setTimeout 不像 debounce 容易清除，这里简单延迟即可）
        // 这里的目的是：当用户点击切换主题时，页面其他轻量级元素先变色（300ms过渡），
        // 等过渡动画结束后，再执行繁重的编辑器销毁/重建。
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.currentTheme = val;
        }, 350); // 略大于 CSS transition 的 300ms
      },
      immediate: false // 初始化时不需要延迟，因为 data 中已经赋值
    },
    value(newValue) {
      if (newValue !== this.content) {
        this.content = newValue;
      }
    },
    content(newValue) {
      this.$emit('input', newValue);
      this.$emit('change', newValue);
    }
  },
  methods: {
    // 获取内容区样式，适配深色/浅色模式
    getContentStyle(isDark) {
      const baseStyle = 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; margin: 10px; } p { margin: 5px 0; } img { max-width: 100%; }';
      if (isDark) {
        return `${baseStyle} body { color: #e0e0e0; background: #1a1a1a; }`;
      }
      return baseStyle;
    }
  }
};
</script>

<style lang="scss" scoped>
.lab-rich-text {
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
  
  &.theme-tech {
    border: 1px solid rgba(0, 243, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
    
    ::v-deep .tox-tinymce {
      border: none !important;
    }
    
    ::v-deep .tox-toolbar__group {
      background: transparent;
    }
  }
}
</style>
