<template>
  <div class="lab-excel-read" :class="themeClass">
    <div class="options-bar" style="margin-bottom: 10px;">
      <el-checkbox v-model="enableMerge">是否合并单元格</el-checkbox>
    </div>
    <el-upload
      ref="upload"
      action="#"
      :auto-upload="false"
      :on-change="handleChange"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      class="upload-demo"
    >
      <div v-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <el-button v-else size="small" type="primary">点击上传</el-button>
      
      <div slot="tip" class="el-upload__tip">
        <slot name="tip">只能上传 xlsx/xls/csv/json 文件</slot>
      </div>
    </el-upload>
  </div>
</template>

<script>
// 动态引入 xlsx 以减小初始包体积 (虽然 lab-ai 可能没配 chunk split，但这也是好习惯)
// 但为了简单，这里直接 import，因为用户已经安装了依赖
import * as XLSX from 'xlsx'
import { mapState } from 'vuex'

export default {
  name: "LabExcelRead",
  props: {
    // 是否支持拖拽
    drag: {
      type: Boolean,
      default: true
    },
    // 是否显示文件列表
    showFileList: {
      type: Boolean,
      default: false
    },
    // 接受的文件类型
    accept: {
      type: String,
      default: ".xlsx, .xls, .csv, .json"
    }
  },
  data() {
    return {
      enableMerge: false,
    }
  },
  computed: {
    ...mapState(['theme']),
    themeClass() {
      return `theme-${this.theme}`;
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      
      const rawFile = file.raw;
      const fileType = rawFile.name.split('.').pop().toLowerCase();

      if (fileType === 'json') {
        this.readJSON(rawFile);
      } else {
        this.readExcel(rawFile);
      }
    },
    readJSON(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          let results = [];
          
          if (Array.isArray(jsonData)) {
            results = jsonData;
          } else {
            // 如果是对象，尝试转换为数组或直接包装
            results = [jsonData];
          }

          // 尝试提取表头
          let header = [];
          if (results.length > 0) {
            header = Object.keys(results[0]);
          }
          
          // 自动计算合并 (纵向)
          let spanMap = {};
          if (this.enableMerge) {
              spanMap = this.computeSpanMap(results, header);
          }

          this.$emit('success', { header, results, spanMap });
          this.$emit('input', results);
        } catch (error) {
          this.$message.error('JSON 解析失败，请检查文件格式');
          console.error(error);
          this.$emit('error', error);
        }
      };
      reader.readAsText(file);
    },
    computeSpanMap(data, header) {
      const spanMap = {};
      
      // 遍历每一列
      header.forEach((key, colIndex) => {
        let startRowIndex = 0;
        
        for (let i = 1; i < data.length; i++) {
            const prevVal = data[i-1][key];
            const currVal = data[i][key];
            
            // 如果值不同，或者已经是最后一行，则结算上一段合并
            if (currVal !== prevVal) {
                const rowspan = i - startRowIndex;
                if (rowspan > 1) {
                    spanMap[`${startRowIndex}-${colIndex}`] = { rowspan, colspan: 1 };
                    for (let r = startRowIndex + 1; r < i; r++) {
                        spanMap[`${r}-${colIndex}`] = { rowspan: 0, colspan: 0 };
                    }
                }
                startRowIndex = i;
            }
            
            // 处理最后一行
            if (i === data.length - 1) {
                const rowspan = i - startRowIndex + 1;
                if (rowspan > 1 && currVal === data[startRowIndex][key]) { // 确保值相同
                    spanMap[`${startRowIndex}-${colIndex}`] = { rowspan, colspan: 1 };
                    for (let r = startRowIndex + 1; r <= i; r++) {
                        spanMap[`${r}-${colIndex}`] = { rowspan: 0, colspan: 0 };
                    }
                }
            }
        }
      });
      
      return spanMap;
    },
    readExcel(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 默认读取第一个 Sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // 1. 先处理合并单元格的数值填充 (确保表头和数据都被填充)
          if (this.enableMerge && worksheet['!merges']) {
            worksheet['!merges'].forEach(merge => {
              const topCell = worksheet[XLSX.utils.encode_cell(merge.s)];
              if (topCell) {
                for (let r = merge.s.r; r <= merge.e.r; ++r) {
                  for (let c = merge.s.c; c <= merge.e.c; ++c) {
                    const targetRef = XLSX.utils.encode_cell({ c, r });
                    if (!worksheet[targetRef]) {
                      worksheet[targetRef] = { ...topCell };
                    }
                  }
                }
              }
            });
          }



          // 2. 获取表头和有效列索引 (此时表头已被填充，不会漏掉合并的列)
          const { headers, validIndices } = this.getHeaderRow(worksheet);
          
          // 构建列索引映射: originalColIndex(C) -> displayedColIndex
          const colIndexMap = {};
          validIndices.forEach((originalIndex, displayIndex) => {
             colIndexMap[originalIndex] = displayIndex;
          });
          
          // 3. 计算 spanMap (适配列过滤)
          const spanMap = {};
          
          if (this.enableMerge && worksheet['!merges']) {
            worksheet['!merges'].forEach(merge => {
              // 只有当合并区域的起始列是有效列时，才记录合并
              if (colIndexMap.hasOwnProperty(merge.s.c)) {
                  const dataRowStart = merge.s.r - 1; // 假设第一行是表头
                  const displayColStart = colIndexMap[merge.s.c];
                  
                  // 计算 colspan: 合并区域内包含了多少个有效列
                  let validColSpan = 0;
                  for (let c = merge.s.c; c <= merge.e.c; ++c) {
                      if (colIndexMap.hasOwnProperty(c)) {
                          validColSpan++;
                      }
                  }
                  
                  const rowspan = merge.e.r - merge.s.r + 1;
                  
                  // 只有当合并涵盖至少一个有效列且不是表头行时
                  if (dataRowStart >= 0 && validColSpan > 0) {
                      spanMap[`${dataRowStart}-${displayColStart}`] = { rowspan, colspan: validColSpan };
                      
                      // 标记被合并的单元格 (设为 0)
                      for (let r = merge.s.r; r <= merge.e.r; ++r) {
                        for (let c = merge.s.c; c <= merge.e.c; ++c) {
                            // 跳过主单元格
                            if (r === merge.s.r && c === merge.s.c) continue;
                            
                            // 只有当该单元格也是有效列时，才需要在 spanMap 中标记为 0
                            if (colIndexMap.hasOwnProperty(c)) {
                                const dRow = r - 1;
                                const dCol = colIndexMap[c];
                                if (dRow >= 0) {
                                  spanMap[`${dRow}-${dCol}`] = { rowspan: 0, colspan: 0 };
                                }
                            }
                        }
                      }
                  }
              }
            });
          }

          // 4. 转换为 JSON
          const rawResults = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          
          // 数据清洗
          const results = rawResults.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
              if (!key.startsWith('__EMPTY') && key.trim() !== '') {
                 const value = row[key];
                 newRow[key] = typeof value === 'string' ? value.trim() : value;
              }
            });
            return newRow;
          }).filter(row => {
            // 过滤空行
            // 如果存在合并单元格 (Object.keys(spanMap).length > 0)，则不能过滤行，否则会导致 rowIndex 错位
            if (Object.keys(spanMap).length > 0) {
                return true;
            }
            return Object.keys(row).length > 0 && Object.values(row).some(val => val !== "" && val !== null && val !== undefined);
          });
          
          // 抛出结果
          this.$emit('success', { header: headers, results, spanMap });
          this.$emit('input', results); 

          // this.$refs.upload.clearFiles(); 
        } catch (error) {
          this.$message.error('文件解析失败，请检查文件格式');
          console.error(error);
          this.$emit('error', error);
        }
      };

      reader.readAsArrayBuffer(file);
    },
    getHeaderRow(sheet) {
      const headers = [];
      const validIndices = [];
      const range = XLSX.utils.decode_range(sheet['!ref']);
      const R = range.s.r;
      
      const counts = {}; // 用于重名处理

      // 从第一行开始读取 Header
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        let hdr = ''; 
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        
        // 只有非空表头才会被添加
        if (hdr && hdr.trim()) {
           let uniqueHdr = hdr;
           // 简单的重名处理，模拟 XLSX 默认行为
           if (counts[hdr]) {
              uniqueHdr = hdr + '_' + counts[hdr];
              counts[hdr]++;
           } else {
              counts[hdr] = 1;
           }
           
           headers.push(uniqueHdr);
           validIndices.push(C);
        }
      }
      return { headers, validIndices };
    }
  }
};
</script>

<style lang="scss" scoped>
.lab-excel-read {
  width: 100%;
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
  
  &.theme-tech {
    ::v-deep .el-upload {
      .el-upload-dragger {
        background-color: var(--lab-card-bg, rgba(20, 20, 30, 0.8));
        border: 1px dashed var(--lab-border-color, rgba(0, 217, 255, 0.3));
        
        &:hover {
          border-color: #00d9ff;
        }
        
        .el-icon-upload {
          color: rgba(0, 217, 255, 0.7);
        }
        
        .el-upload__text {
          color: #e0e0e0;
          em {
            color: #00d9ff;
          }
        }
      }
      
      .el-upload__tip {
        color: rgba(224, 224, 224, 0.6);
      }
    }
  }
}
</style>
