<template>
  <div :id="id" class="code-display" :class="{ 'is-expanded': isExpanded }">
    <!-- Demo Area -->
    <div class="demo-block">
      <slot></slot>
    </div>

    <!-- Meta Info -->
    <div class="meta-block" v-if="title || description">
      <div class="demo-title" v-if="title">{{ title }}</div>
      <div class="demo-description" v-if="description">{{ description }}</div>
    </div>

    <!-- Actions -->
    <div class="demo-actions" :class="{ 'is-fixed': isExpanded }">
       <el-tooltip content="复制全部代码" placement="top">
        <i class="el-icon-document-copy" @click="copyCode"></i>
      </el-tooltip>
      <el-tooltip :content="isExpanded ? '隐藏代码' : '显示代码'" placement="top">
        <i :class="isExpanded ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" @click="toggleExpand"></i>
      </el-tooltip>
    </div>

    <!-- Source Code -->
    <el-collapse-transition>
      <div class="source-block" v-show="isExpanded">
        <pre><code class="language-html" ref="codeBlock">{{ code }}</code></pre>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import Prism from 'prismjs'
import 'prismjs/themes/prism.css' // Or a better theme if available

export default {
  name: 'CodeDisplay',
  props: {
    title: String,
    description: String,
    code: String,
    id: String
  },
  data() {
    return {
      isExpanded: false
    }
  },
  watch: {
    code() {
      this.$nextTick(() => {
        this.highlight()
      })
    }
  },
  mounted() {
    this.highlight()
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    highlight() {
      if (this.$refs.codeBlock) {
        Prism.highlightElement(this.$refs.codeBlock)
      }
    },
    copyCode() {
      this.$copyText(this.code).then(() => {
        this.$message.success('代码已复制')
      }, () => {
        this.$message.error('复制失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.code-display {
  border: 1px solid var(--border-color, #ebeef5);
  border-radius: 4px;
  background-color: var(--card-bg, #fff);
  margin-bottom: 24px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
    .demo-actions {
      color: var(--primary-color);
      background-color: var(--bg-color);
    }
  }
}

.demo-block {
  padding: 24px;
  border-bottom: 1px solid var(--border-color, #ebeef5);
}

.meta-block {
  padding: 18px 24px;
  border-bottom: 1px dashed var(--border-color, #ebeef5);
  
  .demo-title {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 6px;
    color: var(--text-color);
  }
  
  .demo-description {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
}

.demo-actions {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid var(--border-color, #ebeef5);
  background-color: var(--card-bg);
  transition: background-color 0.3s;
  
  i {
    cursor: pointer;
    font-size: 16px;
    color: var(--text-secondary);
    transition: color 0.3s;
    
    &:hover {
      color: var(--primary-color);
    }
  }
}

.source-block {
  background-color: #fafafa;
  border-top: 1px solid var(--border-color, #ebeef5);
  overflow: hidden;
  
  pre {
    margin: 0;
    padding: 18px 24px;
    overflow-x: auto;
    font-family: Consolas, Menlo, Monaco, "Courier New", monospace;
    font-size: 12px;
    line-height: 1.8;
  }
}

// Dark mode adaptation for CodeDisplay
.theme-tech {
  .code-display {
    border-color: rgba(0, 243, 255, 0.2);
    background-color: rgba(10, 25, 47, 0.6);
    backdrop-filter: blur(10px);
    
    &:hover {
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.15);
    }
  }

  .demo-block {
    border-bottom: 1px solid rgba(0, 243, 255, 0.15);
  }

  .meta-block {
    background-color: rgba(6, 182, 212, 0.05);
    border-bottom: 1px dashed rgba(0, 243, 255, 0.2);
    
    .demo-title { color: #fff; }
    .demo-description { color: #94a3b8; }
  }

  .demo-actions {
    background-color: rgba(10, 25, 47, 0.8);
    border-top: 1px solid rgba(0, 243, 255, 0.15);
    i { color: #94a3b8; }
  }

  .source-block {
    background-color: #000 !important;
    border-top: 1px solid rgba(0, 243, 255, 0.2);
    
    pre { 
      background: transparent !important;
      color: #fff !important; 
      border: none !important;
      box-shadow: none !important;
      margin: 0 !important;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 243, 255, 0.2);
        border-radius: 3px;
        &:hover { background: rgba(0, 243, 255, 0.4); }
      }
    }
  }

  ::v-deep .language-html {
    &, * {
      text-shadow: none !important;
      color: #fff; // 默认文字纯白
    }
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    
    // Lab-AI Tech 专业级语法高亮 (适配纯黑背景)
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6e7681; font-style: italic; }
    .token.punctuation { color: #a5d6ff; }
    .token.namespace { opacity: .7; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #79c0ff; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #a5d6ff; }
    .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #b392f0; }
    .token.atrule, .token.attr-value, .token.keyword { color: #ffab70; }
    .token.function, .token.class-name { color: #d2a8ff; }
    .token.regex, .token.important, .token.variable { color: #ff7b72; }
    
    // 增加加粗效果提升辨识度
    .token.keyword, .token.selector, .token.attr-name { font-weight: 500; }
  }
}
</style>
