<template>
  <div>
    <Chart
      style="height: 40vh"
      chartId="left_top_pie"
      :option="new PieOption('Event Operation log').getOption(['title', 'tooltip', 'legend', 'series'])"
      :sourceData="sourceData"
      
    ></Chart>
    <div class="add-comment">
      <el-button class="add-comment-btn" icon="el-icon-edit-outline" @click="addComment">Add comment</el-button>
    </div>
    <PaginationTable
      :useHoverEvent="false"
      default-expand-all
      :origin-data="loggingTable"
      :tableParam="{ _id: subdata['_id'], event_type: subdata['event_type'] }"
      :show-rule="showRule"
      hiddenIndex
      :tree-props="{ children: 'children' }"
      row-key="user"
      :span-method="arraySpanMethod"
      @openEditDailog="openEditDailog"
      @deleteRow="deleteRow"
    >
    </PaginationTable>

    <el-dialog title="Add Comment" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="newCommentModel" label-width="100px" style="width: 80%">
        <el-form-item label="Accept/Reject">
          <el-radio-group v-model="newCommentModel['accept/reject']">
            <el-radio label="accept" style="margin-right: 150px">Accept</el-radio>
            <el-radio label="reject">Reject</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Description">
          <el-input type="textarea" v-model="newCommentModel.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addCommentInTable">OK</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Comment List" class="comment-list" :visible.sync="commentListVisible" width="80%">
      <div class="sub-comment-box" ref="sub-comment-box">
        <div class="sub-comment-row" v-for="(item, index) in currentRow?.comments_list" :key="index">
          <!-- {{ item }} -->
          <div class="sub-comment-content">
            <span class="sub-comment-content-user">{{ item.reply_user ?  `${item.user_name} Reply to ${item.reply_user}`:item.user_name }} :</span> <span>{{ item.comment }}</span>
          </div>
          <div class="sub-comment-sub-text">
            <span class="sub-comment-date">{{ item.date | TransformDate }}</span
            ><span
              v-if="userInfo && item.user_id === userInfo['_id']"
              class="sub-comment-delete"
              @click="delSubComment"
              :data-id="item._id"
              >delete</span
            >
            <span v-if="userInfo && item.user_id !== userInfo['_id']" class="sub-comment-reply" :data-user="item.user_name" @click="replySubComment">reply</span>
          </div>
        </div>
      </div>

      <div style="padding: 20px">
        <el-input type="textarea" :placeholder="reply_user?`Reply to ${reply_user}`:'Add new comment'" v-model="subCommentContent" maxlength="100"></el-input>
      </div>
      <div class="dialog-btn">
        <el-button class="add-comment-btn" icon="el-icon-edit-outline" @click="addSubComment">Add comment</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DateColumn from '@/components/Column/DateColumn'
import TagColumn from '@/components/Column/TagColumn'
import { AnomalyLogPieOption } from '@/templates/chart/pieTemplate'
import { confirmEvent, delSubComment, rejectEvent, addSubComment } from '@/api/SubscribeApi'
import AnomalyDetailOptionColumn from '@/components/Column/AnomalyDetailOptionColumn'

export default {
  name: 'EventDetailOperationLog',
  filters: {
    TransformDate(ts) {
      const date = new Date(ts)
      const month = date.getMonth() + 1
      return `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + month : month}-${
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      } ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
    },
  },
  data() {
    return {
      dialogVisible: false,
      commentListVisible: false,
      subCommentContent: '',
      reply_user:'',
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      newCommentModel: {},
      PieOption: AnomalyLogPieOption,
      loggingTable: [],
      sourceData: [],
      currentRow: undefined,
      showRule: [
        {
          prop: 'user',
          label: 'User',
        },
        {
          prop: 'accept/reject',
          label: 'Accept/Reject',
          subComponent: TagColumn,
        },
        {
          prop: 'description',
          label: 'Description',
        },
        {
          prop: 'date',
          label: 'Date',
          subComponent: DateColumn,
          rowFormat: row => {
            return row.date
          },
        },
        {
          label: 'Comments',
          subComponent: AnomalyDetailOptionColumn,
        },
      ],
    }
  },
  props: ['subdata'],
  watch: {
    subdata(newV) {
      if (!newV.logging) {
        this.sourceData = [{ name: 'accept', value: 0, itemStyle: { color: '#91cc75' } },{ name: 'reject', value: 0, itemStyle: { color: '#ee6666' } }]
        this.loggingTable = []
        newV.logging = {}
        return
      }
      const loggingTable = Object.entries(newV.logging).map((item, index) => {
        return Object.assign(item[1], { user_id: item[0], rowId: index.toString() })
      })
      this.makeSourceData(loggingTable)
      this.loggingTable = loggingTable
    },
  },
  methods: {
    openEditDailog(rowId) {
      this.currentRow = this.loggingTable.find(i => i.rowId === rowId)
      this.commentListVisible = true
      this.subCommentContent= ''
      this.reply_user = ''
      // await Vue.nextTick()
    },
    deleteRow(rowId) {
      this.loggingTable.splice(
        this.loggingTable.findIndex(i => i.rowId === rowId),
        1
      )
      delete this.subdata.logging[this.userInfo['_id']]
      this.makeSourceData(this.loggingTable)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!row['accept/reject']) {
        if (column.label === 'Description') {
          return {
            rowspan: 1,
            colspan: 2,
          }
        } else if (column.label === 'Accept/Reject') {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
    },
    makeSourceData(loggingData) {
      const acceptObj = { name: 'accept', value: 0, itemStyle: { color: '#91cc75' } }
      const rejectObj = { name: 'reject', value: 0, itemStyle: { color: '#ee6666' } }
      const newSourceData = []
      loggingData.forEach(item => {
        if (item['accept/reject'] === 'accept') {
          acceptObj['value'] += 1
        }
        if (item['accept/reject'] === 'reject') {
          rejectObj['value'] += 1
        }
      })
      newSourceData.push(acceptObj)
      newSourceData.push(rejectObj)
      this.sourceData = newSourceData
    },

    refrushSourceData() {
      const newSourceData = [...this.sourceData]
      this.sourceData = newSourceData
    },

    addComment() {
      if(this.userInfo){
        if (!this.subdata?.logging[this.userInfo['_id']]) {
        this.dialogVisible = true
      } else {
        this.$messageBox(`You have commented.`)
      }
      }else{
        this.$messageBox('Please Login first!')
      }
      
    },

    async delSubComment(e) {
      const comment_id = e.target.dataset.id
      this.$alert('Delete this comment?', '', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        callback: async action => {
          if (action === 'confirm') {
            const result = await delSubComment(
              this.subdata['_id'],
              this.subdata['event_type'],
              this.currentRow['user_id'],
              comment_id
            ).catch(e => console.error(e))
            if (result['status']) {
              this.currentRow['comments_list'].splice(
                this.currentRow['comments_list'].findIndex(i => i._id === comment_id),
                1
              )
              this.$message({
                message: 'Delete success!',
                type: 'success',
              })
            }
          }
        },
      })
    },

    async addSubComment() {
      if(!this.userInfo){
        return this.$messageBox('Please Login first!')
      }
      const result = await addSubComment(
        this.subdata['_id'],
        this.subdata['event_type'],
        this.currentRow['user_id'],
        this.subCommentContent,
        this.reply_user
      )
      if (result['status']) {
        const newComment = {
          _id: result['comment_id'],
          comment: this.subCommentContent,
          user_name: this.userInfo['user_name'],
          date: new Date().getTime(),
          user_id: this.userInfo['_id']
        }
        if(this.reply_user){
          newComment['reply_user'] = this.reply_user
        }
        if(!this.currentRow['comments_list']){
          this.currentRow['comments_list'] = []
        }
        this.currentRow['comments_list'].push(newComment)
        this.subCommentContent = ''
        this.reply_user = ''
        this.$refs['sub-comment-box'].scrollTo({
          top: this.$refs['sub-comment-box'].scrollHeight,
          behavior: 'smooth',
        })
      }
    },

    replySubComment(e){
      this.reply_user = e.target.dataset.user
    },

    addCommentInTable() {
      if (this.newCommentModel['accept/reject'] === 'accept') {
        confirmEvent(this.subdata['_id'], this.subdata['event_type'], this.newCommentModel['description'])
        this.sourceData[0].value += 1
      } else if (this.newCommentModel['accept/reject'] === 'reject') {
        rejectEvent(this.subdata['_id'], this.subdata['event_type'], this.newCommentModel['description'])
        this.sourceData[1].value += 1
      }
      this.dialogVisible = false
      if(!this.subdata.logging){
        this.subdata.logging = {}
      }
      const commentObj = {
        user_id: this.userInfo['_id'],
        user: this.userInfo['user_name'],
        'accept/reject': this.newCommentModel['accept/reject'],
        description: this.newCommentModel['description'],
        date: new Date().getTime(),
        comments_list:[]
      }
      this.subdata.logging[this.userInfo['_id']] = commentObj
      this.loggingTable.push(commentObj)
      this.refrushSourceData()
    },
  },
}
</script>

<style lang="scss" scoped>
.add-comment-btn {
  color: #fff;
  background-color: #631fa9;
}
.add-comment {
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  flex-direction: row-reverse;
  justify-self: flex-end;
}

.dialog-btn {
  display: flex;
  flex-direction: row-reverse;
  justify-self: flex-end;
  margin-right: 20px;
}

.sub-comment-row {
  text-align: left;
  padding: 10px;
  background-color: #eaeaea;
  margin: 0 20px 20px 20px;
  border-radius: var(--border-radius-deg);
}

.sub-comment-sub-text {
  font-size: var(--min-font-size);
}

.sub-comment-date {
  color: #9499a0;
  padding-right: 10px;
}
.sub-comment-delete:hover {
  cursor: pointer;
  color: #aa6464;
}
.sub-comment-delete {
  color: #aa6464c3;
  font-weight: bold;
}

.sub-comment-reply {
  color: #313131a7;
  font-weight: bold;
}

.sub-comment-reply:hover {
  cursor: pointer;
  color: #313131;
}
.sub-comment-content {
  /* font-weight: bold; */
  font-size: var(--subTitle-font-size);
}
.sub-comment-content-user {
  font-weight: bold;
  padding-right: 5px;
}

.sub-comment-box {
  height: 30vh;
  overflow: auto;
}
</style>

<style>
.comment-list .el-dialog__body {
  display: block !important;
}

textarea {
  min-height: 100px !important;
}
</style>
