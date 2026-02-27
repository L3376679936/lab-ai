<template>
  <div class="lab-slice-frame-doc">
    <doc-title title="LabSliceFrame" subtitle="九宫格缩放容器。通过 border-image 实现九宫格切分，锁定四角装饰，完美解决背景图在不同比例下的拉伸变形问题。" />

    <code-display 
      title="基础用法 - 装饰框 B (横向长条模式)" 
      description="针对不对称的长条图片，可以通过非均匀的 slice 和 border-width 锁定两端装饰（如左侧图标、右侧端点），只让中间区域水平拉伸。" 
      :code="baseCodeB"
    >
      <div class="demo-frames">
        <div class="demo-item" style="width: 100%;">
          <p class="demo-label">1. 标准尺寸 (400px)</p>
          <lab-slice-frame 
            :image="techBarImg" 
            slice="0 30 0 60" 
            border-width="0 30px 0 60px"
            style="width: 400px; height: 50px;"
          >
            <div class="tech-bar-inner">
              <div class="text" style="padding-left: 10px;">只有中间在拉伸，图标比例完美</div>
            </div>
          </lab-slice-frame>
        </div>

        <div class="demo-item" style="width: 100%; margin-top: 20px;">
          <p class="demo-label">2. 极长尺寸 (800px) - 两端装饰依然固定</p>
          <lab-slice-frame 
            :image="techBarImg" 
            slice="0 30 0 60" 
            border-width="0 30px 0 60px"
            style="width: 800px; height: 50px;"
          >
            <div class="tech-bar-inner">
              <div class="text" style="padding-left: 10px;">即便拉伸到 800px，左侧图标和右侧斜角也没有任何变形</div>
            </div>
          </lab-slice-frame>
        </div>
      </div>
    </code-display>

    <code-display 
      title="常见比例适配 (装饰框 A )" 
      description="锁定四角装饰，内容区域随容器大小伸缩而不变形。适用于各种比例的容器。" 
      :code="baseCodeA"
    >
      <div class="demo-frames">
        <div class="demo-item">
          <p class="demo-label">宽扁比例 (Banner)</p>
          <lab-slice-frame 
            :image="techImg" 
            :slice="22" 
            :border-width="15"
            style="width: 400px; height: 80px;"
          >
            <div class="inner-content">宽扁比例</div>
          </lab-slice-frame>
        </div>

        <div class="demo-item">
          <p class="demo-label">高窄比例 (Card)</p>
          <lab-slice-frame 
            :image="techImg" 
            :slice="22" 
            :border-width="15"
            style="width: 150px; height: 200px;"
          >
            <div class="inner-content">竖长形状<br/>装饰锁死不变形</div>
          </lab-slice-frame>
        </div>
      </div>
    </code-display>

    <code-display 
      title="极端比例与变形优化" 
      description="在极高或极窄的比例下，如果 slice 或 border-width 设置不当，边角可能会出现异常。通过精确设置这些值，可以保持装饰的原始比例。" 
      :code="ratioCode"
    >
      <div class="demo-frames">
        <div class="demo-item">
          <p class="demo-label">极端比例 A (40:300)</p>
          <lab-slice-frame 
            :image="techImg" 
            :slice="25" 
            :border-width="12"
            style="width: 40px; height: 300px;"
          >
          </lab-slice-frame>
        </div>

        <div class="demo-item">
          <p class="demo-label">精确控制切分 (推荐)</p>
          <div style="display: flex; gap: 10px;">
            <lab-slice-frame 
              :image="techBarImg" 
              slice="0 30 0 60" 
              border-width="0 30px 0 60px"
              style="width: 60px; height: 200px;"
            >
            </lab-slice-frame>
            <div class="ratio-tip">
              对于长条图片，通过设置 <code>slice="0 30 0 60"</code> 锁定了左右，垂直方向没有切分，从而避免了重叠。
            </div>
          </div>
        </div>
      </div>
    </code-display>

    <div class="table-tip">
      <i class="el-icon-info"></i> 核心原理：使用 CSS 的 <code>border-image-slice</code>。<code>slice</code> 的值通常为图片边角装饰部分的像素宽度。
    </div>

    <!-- 技术原理详解 -->
    <div class="principles-section">
      <h3>核心原理：九宫格切分 (9-Slice Scaling)</h3>
      <p class="description">
        <code>LabSliceFrame</code> 的核心在于 CSS 的 <code>border-image</code> 属性。它将一张背景图切分为 9 个部分，从而实现「锁定边角，拉伸中心」的效果。
      </p>

      <div class="principle-visual">
        <div class="grid-diagram">
          <div class="grid-box corner top-left">左上角<br/>(固定)</div>
          <div class="grid-box edge top">顶边 (水平拉伸)</div>
          <div class="grid-box corner top-right">右上角<br/>(固定)</div>
          <div class="grid-box edge left">左边 (垂直拉伸)</div>
          <div class="grid-box center">内容区域<br/>(双向拉伸)</div>
          <div class="grid-box edge right">右边 (垂直拉伸)</div>
          <div class="grid-box corner bottom-left">左下角<br/>(固定)</div>
          <div class="grid-box edge bottom">底边 (水平拉伸)</div>
          <div class="grid-box corner bottom-right">右下角<br/>(固定)</div>
        </div>
        
        <div class="explanation-text">
          <ul>
            <li><strong>slice (切分)</strong>：决定了从素材图片的边缘向内「切多少像素」作为边角装饰。</li>
            <li><strong>border-width (宽度)</strong>：决定了切下来的边角在页面上「显示多大」。</li>
          </ul>
        </div>
      </div>

      <div class="case-study">
        <div class="case-item">
          <h4>案例 A：装饰框 A (对称锁定)</h4>
          <p>配置：<code>:slice="22" :border-width="15"</code></p>
          <div class="case-box">
             <lab-slice-frame :image="techImg" :slice="22" :border-width="15" style="width: 120px; height: 80px;">Demo</lab-slice-frame>
             <div class="case-desc">
               由于装饰框 A 四角都有对称的 L 形科技花纹，我们设置 <b>22px</b> 的切分值正好能完整捕捉图片中这四个角。
               显示的 <b>15px</b> 边框宽度则让装饰看起来精致而不过于粗笨。
             </div>
          </div>
        </div>

        <div class="case-item">
          <h4>案例 B：装饰框 B (不对称长条锁定)</h4>
          <p>配置：<code>slice="0 30 0 60" border-width="0 30px 0 60px"</code></p>
          <div class="case-box">
             <lab-slice-frame :image="techBarImg" slice="0 30 0 60" border-width="0 30px 0 60px" style="width: 260px; height: 40px;">Long Bar Demo</lab-slice-frame>
             <div class="case-desc">
               针对长条，我们<b>不希望切分布局影响垂直方向</b>。
               <br/>1. 左侧 <b>60</b>：锁住日历图标。
               <br/>2. 右侧 <b>30</b>：锁住末端斜角。
               <br/>3. 上下 <b>0</b>：确保垂直方向不被切割，保持素材原始高度。
             </div>
          </div>
        </div>
      </div>
    </div>

    <h3>组件参数 (Props)</h3>
    <el-table :data="attributes" border size="small" class="api-table">
      <el-table-column prop="prop" label="参数" width="160" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="default" label="默认值" width="120" />
    </el-table>

    <h3>插槽 (Slots)</h3>
    <el-table :data="slots" border size="small" class="api-table">
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="desc" label="说明" />
    </el-table>
  </div>
</template>

<script>
import LabSliceFrame from '@/components/LabSliceFrame'
import DocTitle from '@/components/DocTitle/DocTitle.vue'
import CodeDisplay from '@/components/CodeDisplay.vue'
import techImg from '@/assets/images/techFrame.png'
import techBarImg from '@/assets/images/techBar.png'

export default {
  name: 'LabSliceFrameDoc',
  components: {
    LabSliceFrame,
    DocTitle,
    CodeDisplay
  },
  data() {
    return {
      techImg,
      techBarImg,
      baseCodeA: `
<!-- 典型比例演示：通过增加 slice (如 22) 完整覆盖边角装饰区域，防止垂直拉伸 -->
<div style="display: flex; flex-wrap: wrap; gap: 20px;">
  <!-- 宽扁比例 -->
  <lab-slice-frame 
    :image="techImg" 
    :slice="22" 
    :border-width="15"
    style="width: 400px; height: 80px;"
  >
    <div class="inner-content">宽扁比例</div>
  </lab-slice-frame>

  <!-- 高窄比例 -->
  <lab-slice-frame 
    :image="techImg" 
    :slice="22" 
    :border-width="15"
    style="width: 150px; height: 200px;"
  >
    <div class="inner-content">高窄锁死不变形</div>
  </lab-slice-frame>
</div>
`.trim(),
      baseCodeB: `
<!-- 横向长条模式：锁定两端，水平拉伸 -->
<div style="display: flex; flex-direction: column; gap: 20px;">
  <!-- 标准 400px -->
  <lab-slice-frame 
    :image="techBarImg" 
    slice="0 30 0 60" 
    border-width="0 30px 0 60px"
    style="width: 400px; height: 50px;"
  >
    <div class="tech-bar-inner">
      <div class="text">400px 长度</div>
    </div>
  </lab-slice-frame>

  <!-- 极长 800px -->
  <lab-slice-frame 
    :image="techBarImg" 
    slice="0 30 0 60" 
    border-width="0 30px 0 60px"
    style="width: 800px; height: 50px;"
  >
    <div class="tech-bar-inner">
      <div class="text">800px 长度，两端依然锁定</div>
    </div>
  </lab-slice-frame>
</div>
`.trim(),
      ratioCode: `
<!-- 极窄极高场景测试 -->

<!-- 1. 默认四角切分在极窄情况下的变形 -->
<lab-slice-frame 
  :image="techImg" 
  :slice="22" 
  :border-width="15"
  style="width: 40px; height: 300px;"
/>

<!-- 2. 使用不对称切分锁定左右，避免垂直变形 -->
<lab-slice-frame 
  :image="techBarImg" 
  slice="0 30 0 60" 
  border-width="0 30px 0 60px"
  style="width: 60px; height: 200px;"
/>
`.trim(),
      attributes: [
        { prop: 'image', desc: '背景图片 URL', type: 'String', default: '-' },
        { prop: 'slice', desc: '九宫格切分数值 (像素/百分比)', type: 'Number | String', default: '20' },
        { prop: 'borderWidth', desc: '边框显示宽度', type: 'Number | String', default: '20' },
        { prop: 'padding', desc: '内容内边距', type: 'String', default: '16px' },
        { prop: 'repeat', desc: '填充模式 (stretch/repeat/round)', type: 'String', default: 'stretch' }
      ],
      slots: [
        { name: 'default', desc: '自定义内部内容' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.lab-slice-frame-doc {
  padding: 24px;
  color: var(--text-color);

  .demo-frames {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    align-items: flex-start;
    padding: 20px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
  }

  .demo-item {
    .demo-label {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 12px;
      font-weight: 500;
    }
  }

  .inner-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--primary-color);
    font-size: 13px;
    text-align: center;
  }

  .tech-bar-inner {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 10px;
    color: #fff;
    .text {
      color: #fff;
      font-size: 13px;
      text-shadow: 0 0 8px rgba(0, 217, 255, 0.5);
    }
  }

  .ratio-tip {
    flex: 1;
    font-size: 12px;
    color: var(--text-secondary);
    max-width: 200px;
    line-height: 1.6;
    code {
      background: rgba(0, 0, 0, 0.2);
      padding: 2px 4px;
      border-radius: 4px;
      color: var(--primary-color);
    }
  }

  .api-table {
    margin: 20px 0;
    background-color: transparent !important;
    
    ::v-deep th {
      background-color: rgba(59, 110, 246, 0.05) !important;
    }
    
    ::v-deep .el-table__row {
      background-color: transparent !important;
    }
  }

  .table-tip {
    margin: 15px 0 30px;
    padding: 12px 16px;
    background: rgba(59, 130, 246, 0.05);
    border-left: 4px solid var(--primary-color);
    font-size: 13px;
    color: var(--text-secondary);
    i {
      color: var(--primary-color);
      margin-right: 8px;
    }
  }

  // 技术原理样式
  .principles-section {
    margin: 40px 0;
    padding: 24px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.1);

    h3 {
      margin-top: 0;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .principle-visual {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      align-items: center;
      margin-bottom: 30px;

      .grid-diagram {
        display: grid;
        grid-template-columns: 80px 1fr 80px;
        grid-template-rows: 60px 100px 60px;
        gap: 4px;
        width: 320px;
        background: rgba(0, 0, 0, 0.1);
        padding: 4px;
        border-radius: 4px;

        .grid-box {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 12px;
          border-radius: 2px;
          padding: 8px;
          font-weight: 500;

          &.corner {
            background: rgba(0, 217, 255, 0.8);
            color: #000;
            border: 1px solid rgba(0, 217, 255, 1);
          }
          &.edge {
            background: rgba(59, 130, 246, 0.6);
            color: #fff;
          }
          &.center {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
          }
        }
      }

      .explanation-text {
        flex: 1;
        min-width: 260px;
        ul {
          padding-left: 20px;
          li {
            margin-bottom: 12px;
            font-size: 14px;
            color: var(--text-secondary);
            strong {
              color: var(--primary-color);
            }
          }
        }
      }
    }

    .case-study {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;

      .case-item {
        background: rgba(0, 0, 0, 0.1);
        padding: 16px;
        border-radius: 8px;

        h4 {
          margin: 0 0 10px;
          color: var(--primary-color);
        }

        p {
          font-family: monospace;
          font-size: 12px;
          background: rgba(0,0,0,0.3);
          padding: 4px 8px;
          display: inline-block;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .case-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
          .case-desc {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
            b { color: var(--primary-color); }
          }
        }
      }
    }
  }
}
</style>
