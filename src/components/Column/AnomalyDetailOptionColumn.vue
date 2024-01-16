<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" circle @click="commentInComment"></el-button>
    <el-button v-if="userInfo && row['user_id'] === userInfo._id" type="danger" icon="el-icon-delete" circle @click="deleteComment"></el-button>
  </div>
</template>

<script>
import { confirmEvent, unconfirmedEvent, rejectEvent, unRejectEvent } from '@/api/SubscribeApi'
export default {
  name: 'AnomalyDetailOptionColumn',
  created() {},
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
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
  
  },
  methods: {
    commentInComment(){
      this.$emit('openEditDailog',this.row['rowId'])
    },
    deleteComment(){
      if(this.row['accept/reject']){
        this.$alert('Revoke Comment?', 'Revoke', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: async action => {
          if (action === 'confirm') {
                if(this.row['accept/reject'] === 'accept'){
              unconfirmedEvent(this.tableParam['_id'],this.tableParam['event_type'])
            }
            else if(this.row['accept/reject'] === 'reject'){
              unRejectEvent(this.tableParam['_id'],this.tableParam['event_type'])
            }
          }
          this.$emit('deleteRow',this.row['rowId'])
        },
      })

        
      }
    }
  },
}
</script>

<style lang="scss" scoped></style>
