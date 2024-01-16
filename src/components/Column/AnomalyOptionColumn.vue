<template>
  <div>
    <el-button
      v-if="!(row.logging && row.logging[userInfo._id] && row.logging[userInfo._id]['accept/reject'] === 'reject')"
      size="mini"
      :type="row.logging && row.logging[userInfo._id] ? 'info' : 'success'"
      icon="el-icon-check"
      :round="!confirmList.length == 0"
      :circle="confirmList.length == 0"
      @click="clickConfirmBtn"
    >
      <template v-if="confirmList.length">
        {{ confirmList.length }}
      </template>
    </el-button>
    <el-button
      v-if="!(row.logging && row.logging[userInfo._id] && row.logging[userInfo._id]['accept/reject'] === 'accept')"
      size="mini"
      :type="row.logging && row.logging[userInfo._id] ? 'info' : 'danger'"
      icon="el-icon-close"
      :round="!rejectList.length == 0"
      :circle="rejectList.length == 0"
      @click="clickRejectBtn"
    >
      <template v-if="rejectList.length"> {{ rejectList.length }} </template>
    </el-button>
  </div>
</template>

<script>
import { confirmEvent, unconfirmedEvent, rejectEvent, unRejectEvent } from '@/api/SubscribeApi'
export default {
  name: 'DetailOptionColumn',
  created() {},
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      confirmList: [],
      rejectList: [],
    }
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      },
    },
    tableParam: {
      type: Object,
      default: () => {
        return {}
      },
    },
    rowFormat: {
      type: Function,
    },
  },
  watch: {
    row: {
      handler(newV) {
        // console.log('newV', newV)
        this.refrushConfirmList(newV)
        this.refrushRejectList(newV)
      },
      immediate: true,
    },
  },
  // mounted() {
  //   console.log(this.row)
  // },
  methods: {
    refrushRejectList(row) {
      if (row.logging) {
        this.rejectList = Object.values(row.logging).filter(i => i['accept/reject'] === 'reject')
      } else {
        this.rejectList = []
      }
    },
    refrushConfirmList(row) {
      if (row.logging) {
        this.confirmList = Object.values(row.logging).filter(i => i['accept/reject'] === 'accept')
      } else {
        this.confirmList = []
      }
    },
    async clickConfirmBtn() {
      if (this.row.logging && this.row.logging[this.userInfo._id]) {
        this.unconfirmed()
      } else {
        this.confirm()
      }
    },
    clickRejectBtn() {
      if (this.row.logging && this.row.logging[this.userInfo._id]) {
        this.unReject()
      } else {
        const rowIndex = this.$el.parentNode.parentNode.parentElement.getAttribute('class').split('rowIndex')[1]
        this.$emit('clickReject', Number(rowIndex))
      }
    },
    confirm() {
      if (this.row.logging && this.row.logging[this.userInfo._id]) {
        return
      }
      this.$alert('This event is correct?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: async action => {
          if (action === 'confirm') {
            const result = await confirmEvent(this.row._id, this.row.event_type)
            if (result['status']) {
              this.$message({
                message: 'Thanks for your confirmation!',
                type: 'success',
              })
              this.row.logging[this.userInfo._id] = { 'accept/reject': 'accept' }
              this.confirmList.push({})
            }
          }
        },
      })
    },
    unconfirmed() {
      if (!(this.row.logging && this.row.logging[this.userInfo._id])) {
        return
      }
      this.$alert('Revoke Confirmation?', 'Unconfirmed', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: async action => {
          if (action === 'confirm') {
            const result = await unconfirmedEvent(this.row._id, this.row.event_type)
            if (result['status']) {
              this.$message({
                message: 'Revoke setting success!',
                type: 'success',
              })

              delete this.row.logging[this.userInfo._id]
              this.confirmList.pop()
            }
          }
        },
      })
    },
    async reject(reason) {
      if (reason.length > 100) {
        this.$message.error('reason is too long!')
        return
      }
      if (this.row.logging && this.row.logging[this.userInfo._id]) {
        return
      }
      const result = await rejectEvent(this.row._id, this.row.event_type, reason)
      if (result['status']) {
        this.$message({
          message: 'Thanks for your confirmation!',
          type: 'success',
        })
        this.row.logging[this.userInfo._id] = { 'accept/reject': 'reject' }
        this.rejectList.push({})
      }
    },

    async unReject() {
      if (!(this.row.logging && this.row.logging[this.userInfo._id])) {
        return
      }
      this.$alert('Revoke Confirmation?', 'Cancel Reject', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: async action => {
          if (action === 'confirm') {
            // console.log(this.row)
            const result = await unRejectEvent(this.row._id, this.row.event_type)
            if (result['status']) {
              this.$message({
                message: 'Revoke setting success!',
                type: 'success',
              })

              delete this.row.logging[this.userInfo._id]
              this.rejectList.pop()
            }
          }
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
