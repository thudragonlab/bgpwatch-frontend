<template>
  <div>
    <el-row v-if="title" :style="titleStyle">
      {{ title }}
    </el-row>
    
    <el-row class="transition">
      <el-table
        ref="my-el-table"
        v-loading="loading"
        :data="originData.length ? (usePagination ? showingData : sortData) : []"
        :border="border"
        :stripe="stripe"
        style="width: 100%; --text: 10"
        :row-class-name="rowClassNameFunction"
        :row-style="{
          cursor: localRowClick.length !== 0 ? 'pointer' : 'Auto',
        }"
        @sort-change="sortChange"
        v-bind="$attrs"
        v-on="$listeners"
      >
      <!-- @row-click="localRowClick" -->
      
        <el-table-column
          v-if="!hiddenIndex"
          align="center"
          v-bind="indexCol"
          
        >
          <template slot-scope="scope">{{ (currentPage - 1) * pagesize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          v-for="(col, index) in showRule"
          align="center"
          v-bind="col"
          :key="index"
        >
        <div v-if="col && col.renderHeader" slot="header">{{ col.renderHeader }}</div>
          <template slot-scope="scope">
            <component
              :ref="col.templateName"
              :is="col.templateName"
              v-if="col.templateName"
              :row="scope.row"
              :table-param="tableParam"
              :row-format="col.rowFormat"
              v-on="$listeners"
            />
            {{ col && (col.templateName ? "" : scope.row[col.prop]) }}
          </template>
        </el-table-column>
      </el-table>
      <div v-if="usePagination" :class="paginationProClass">
        <el-pagination
        ref="my-el-pagination"
          v-bind="paginationProp"
          :current-page="currentPage"
          :total="total === -1 ? (originData && originData.length) || 0 : total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
  </div>
</template>

<script>
/**
 * 基于element-ui的Table组件
 * @author pzd
 */
const hoverEventName = "hovered";
const nohoverEventName = "nohovered";
export default {
  name: "PaginationTable",
  props: {
    title: {
      type: String,
    },
    stripe:{
      type: Boolean,
      default:true
    },
    border:{
      type: Boolean,
      default:true
    },
    titleStyle: {
      type: Object,
    },
    total: {
      type: Number,
      default: -1,
    },
    rowClassName: {
      type: String,
    },
    cellClassName: {
      type: Function,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    defaultOrder: {
      type: Object,
      default: () => {},
    },
    originData: {
      type: Array,
      default: () => [],
    },
    showRule: {
      type: Array,
      default: () => [],
    },
    usePagination: {
      type: Boolean,
      default: true,
    },
    tableParam: {
      type: Object,
      default: () => {},
    },
    rowClick: {
      type: Function,
      default: function () {},
    },
    paginationProp: {
      type: Object,
      default: () => {
        return { background: false, layout: "prev, pager, next" };
      },
    },
    paginationProClass: {
      type: String,
      default: "pagination",
    },
    loadDataFadeIn: {
      type: Boolean,
    },
    hiddenIndex: {
      type: Boolean,
      default: false,
    },
    useHoverEvent: {
      type: Boolean,
      default: false,
    },
    indexCol:{
      type:Object
    }
  },
  data() {
    return {
      currentPage: 1,
      pagesize:  10,
      showingData: [],
      sortObj: {},
      localRowClick: () => {},
      sortData: [],
      filters: "filters",
      
      
      
    };
  },
  watch: {
    originData(newV) {
      this.handleOrigin(newV);
    },
    sortData(newV) {
      this.showingData = newV.slice(0, 1 * this.pagesize);
    },
    pagesize(newV) {
      this.showingData = this.originData.slice((this.currentPage - 1) * newV, this.currentPage * newV);
    },
  },
  created() {},
  mounted() {
    // 如果上一次没有数据，table没有显示，这次数据加载不会走watch，会导致table中不显示数据
    const myProp = Object.keys(Object.assign(this.$props,this.$attrs))
    const tableProp = Object.keys(this.$refs['my-el-table'].$props)
    // console.log(myProp,this.$refs['my-el-table'].$props)
    myProp.forEach(prop => {
      if(prop == 'rowClassName'){
        return
      }
      // const newProp = this.transformToCamelCase(prop)
      if(prop == 'defaultOrder'){
        this.$attrs['defaultSort'] = this.$props[prop]
      }
      if(tableProp.includes(prop) ){
        this.$attrs[prop] = this.$props[prop]
      }
      

    })


    if (this.originData && this.originData.length !== 0) {
      this.handleOrigin(this.originData);
    }
    // console.log(this.showRule)
    this.showRule.forEach((item, index) => {
      if (item.subComponent) {
        item.templateName = `subComponent${index}`;
        if (typeof window !== "undefined" && window.Vue) {
          window.Vue.component(item.templateName, item.subComponent);
        }
      }
    });

    if (this.rowClick) {
      this.localRowClick = this.rowClick;
    }
  },
  methods: {
    transformToCamelCase(str) {
  return str.replace(/-(\w)/g, function(match, letter) {
    return letter.toUpperCase();
  });
},
    rowClassNameFunction({ row, rowIndex }) {
      if (this.loadDataFadeIn) {
        return `rowIndex${rowIndex} h-row-${rowIndex} ${this.rowClassName || ""}`;
      } else {
        return `rowIndex${rowIndex} ${this.rowClassName || ""}`;
      }
    },
    addSubComponentListener() {
      if (!this.useHoverEvent) {
        return;
      }
      this.$nextTick(() => {
        Object.keys(this.$refs).forEach((key) => {
          if(!key.includes('subComponent')){
            return
          }
          if (this.$refs[key].length === 0) {
            return;
          }
          this.$refs[key].forEach((subComponent) => {
            if (subComponent._events && !subComponent._events[hoverEventName] && subComponent.handleHover) {
              subComponent.$on(hoverEventName, (...args) => {
                subComponent.handleHover(...args);
              });
            }

            if (subComponent._events && !subComponent._events[nohoverEventName] && subComponent.nohandleHover) {
              subComponent.$on(nohoverEventName, (...args) => {
                subComponent.nohandleHover(...args);
              });
            }
          });
        });
      });
    },
    handleOrigin(newOriginData) {
      let originData = [...newOriginData];
      if (!this.usePagination) {
        this.sortData = originData;
      }
      if (newOriginData.length !== 0 && this.defaultOrder) {
        this.sortChange(this.defaultOrder);
        return;
      }
      this.handleCurrentChange(1);
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      let originData = this.originData;
      if (this.sortData.length !== 0) {
        originData = this.sortData;
      }
      if (this.loadDataFadeIn) {
        this.showingData = [];
      }
      this.$nextTick(() => {
        this.showingData = originData.slice((currentPage - 1) * this.pagesize, currentPage * this.pagesize);
        if (this.useHoverEvent) {
          this.addSubComponentListener();
        }
      });
    },

    sortChange(column) {
      // console.debug(column);
      this.sortObj = {
        label: column.prop,
        order: column.order === "ascending" ? 1 : -1,
      };
      this.sortByColumn();
    },
    sortByColumn() {
      if (!this.sortObj) {
        return;
      }
      const { label, order } = this.sortObj;
      const sortCol = this.showRule.filter((rule) => rule.prop === label);
      if (sortCol.length === 1) {
        const { compare } = sortCol[0];
        if (!compare) {
          console.warn("compare is not found!");
          return;
        }
        this.sortData = [...this.originData];
        this.sortData.sort((a, b) => compare(a, b) * order);
        this.handleCurrentChange(1);
      }
    },

    hoverEvent(row, column, cell, event) {
      if (this.useHoverEvent) {
        const rowElement = cell.parentNode;
        const rowIndex = Number(rowElement.getAttribute("class").split("rowIndex")[1][0]);
        Object.keys(this.$refs).forEach((key) => {
          if (this.$refs[key].length === 0) {
            return;
          }
          if(!key.includes('subComponent')){
            return
          }
          // console.log(this.$refs[key])
          this.$refs[key][rowIndex].$emit(hoverEventName, row, column, cell, event);
        });
      }
    },
    noHoverEvent(row, column, cell, event) {
      if (this.useHoverEvent) {
        const rowElement = cell.parentNode;
        const rowIndex = rowElement.getAttribute("class").split("rowIndex")[1][0];
        Object.keys(this.$refs).forEach((key) => {
          if (this.$refs[key].length === 0) {
            return;
          }
          if(!key.includes('subComponent')){
            return
          }
          this.$refs[key][rowIndex].$emit(nohoverEventName, row, column, cell, event);
        });
      }
    },
  },
};
</script>

<style lang="scss">
$totalRow:10;
.pagination {
  width: calc(100% - 2px);
  background: #fff;
  border: 1px solid #ebeef5;
}
.el-pagination {
  padding-left: 0;
  padding-right: 0;
}

.h-row {
  animation-name: fade-in;
  animation-duration: 1s;
  // color:var(--text)
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

$animation_duration: 0.1;
@for $i from 0 through $totalRow {
  .h-row-#{$i} {
    opacity: 0;
    animation-name: fade-in;
    animation-duration: #{$animation_duration}s;
    // animation-delay: 2s;
    animation-fill-mode: forwards;
    animation-delay: #{$i * $animation_duration}s;
  }
}
</style>
