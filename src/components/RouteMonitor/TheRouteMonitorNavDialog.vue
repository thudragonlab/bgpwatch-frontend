<template>
  <el-dialog :title="title" :visible.sync="localVisiable" :width="width && width" @closed="close" append-to-body>
    <component
      :is="subComponentName"
      v-if="subComponentName"
      ref="subComponent"
      :model="model"
      :param="param"
      v-on="$listeners"
      @validate="validate"
    />

    <div v-if="showFooter" slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">{{ buttonText[0] }}</el-button>
      <el-button size="small" :disabled="isDisableConfirm" @click="clickConfrim">{{ buttonText[1] }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'Dialog22',
  props: {
    width: {
      type: String,
      default: '',
    },
    // 对话框标题
    title: {
      type: String,
      default: '',
    },
    buttonText: {
      type: Array,
      default: () => ['Cancel', 'OK'],
    },
    // 默认确认按钮状态
    defaultDisableConfrim: {
      type: Boolean,
      default: false,
    },
    // 确认按钮调用函数（subComponent中的方法名称）
    confirmMethod: {
      type: String,
      default: '',
    },
    // 是否可见
    visible: {
      type: Boolean,
      default: false,
    },
    // 对话框主要内容组件
    subComponent: {
      type: Object,
      default: () => {},
    },
    // 双向绑定的对象
    model: {
      type: [Object, Array],
      default: () => {},
    },
    // 往子组件传入的固定参数
    param: {
      type: Object,
      default: () => {},
    },
    // 是否显示底部按钮
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      subComponentName: '',
      localVisiable: false,
      isDisableConfirm: false,
    }
  },
  watch: {
    visible(val) {
      this.localVisiable = val // 新增isVisible的watch，监听变更并同步到IsShowPage上
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
    },
  },
  created() {
    this.isDisableConfirm = this.defaultDisableConfrim
  },
  mounted() {
    if (this.subComponent) {
      this.subComponentName = `subComponent${this.subComponent._scopeId}`
      Vue.component(`subComponent${this.subComponent._scopeId}`, this.subComponent)
    }
  },
  methods: {
    validate(value) {
      // console.debug(Boolean(value))
      this.isDisableConfirm = Boolean(value)
    },
    close() {
      this.$emit('close_diolog')
    },
    clickConfrim() {
      this.$refs.subComponent[this.confirmMethod]()
    },
  },
}
</script>

<style lang="scss"></style>
