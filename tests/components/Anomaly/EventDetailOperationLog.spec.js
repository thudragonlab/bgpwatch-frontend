import {
  mount
} from "@vue/test-utils";
import 'jest-localstorage-mock';
import ElementUI from '@/lib/element.js'
import EventDetailOperationLog from "@/components/Anomaly/EventDetailOperationLog.vue";
import Vue from "vue";
import {
  subdata,
  loggingTable,
  sourceData
} from '../../mockData/EventDetailOperationLog'
Vue.use(ElementUI)
localStorage.setItem('userInfo', JSON.stringify({
  name: 'pzd',
  _id: '64262090457da4468fb57da9'
}));
import { confirmEvent, delSubComment, rejectEvent, addSubComment } from '@/api/SubscribeApi'
jest.mock('@/api/SubscribeApi', () => {
  return {
    confirmEvent: jest.fn(() => Promise.resolve({
      'status': true
    })),
    delSubComment: jest.fn(() => Promise.resolve({
      'status': true
    })),
    rejectEvent: jest.fn(() => Promise.resolve({
      'status': true
    })),
    addSubComment: jest.fn(() => Promise.resolve({
      'status': true
    })),
  }
})
let wrapper
Vue.prototype.$messageBox = jest.fn()
Vue.prototype.$alert = jest.fn()
Vue.prototype.$message = jest.fn()


describe('SubscribeASPeerChangeTab', () => {
  beforeEach(() => {
    wrapper = mount(EventDetailOperationLog, {
      stubs: {
        transition: false
      },
      propsData: {
        subdata: {}
      }
    })
  })
  it('init', async () => {
    await wrapper.setProps({
      subdata
    })
    // console.log(JSON.stringify(wrapper.vm.loggingTable))
    expect(wrapper.vm.loggingTable).toEqual(loggingTable)
    expect(wrapper.vm.sourceData).toEqual(sourceData)
  })
  it('rowformat', () => {
    expect(wrapper.vm.showRule[3].rowFormat({
      'date': 1
    })).toBe(1)
  })
  it('openEditDailog', () => {
    wrapper.vm.openEditDailog(0)
    expect(wrapper.vm.commentListVisible).toBeTruthy()
    expect(wrapper.vm.subCommentContent).toBe('')
    expect(wrapper.vm.reply_user).toBe('')
  })
  it('deleteRow', async () => {
    await wrapper.setProps({
      subdata
    })
    await Vue.nextTick()
    const makeSourceData = jest.spyOn(wrapper.vm, 'makeSourceData')
    const beforeLength = wrapper.vm.loggingTable.length
    wrapper.vm.deleteRow(0)
    expect(wrapper.vm.loggingTable).toHaveLength(beforeLength - 1)
    expect(wrapper.vm.subdata.logging['64262090457da4468fb57da9']).not.toBeDefined()
    expect(makeSourceData).toHaveBeenCalled()
  })

  it('arraySpanMethod', async () => {
    const result1 = wrapper.vm.arraySpanMethod({
      row: {},
      column: {
        label: 'Description'
      }
    })
    expect(result1).toEqual({
      rowspan: 1,
      colspan: 2,
    })
    const result2 = wrapper.vm.arraySpanMethod({
      row: {},
      column: {
        label: 'Accept/Reject'
      }
    })
    expect(result2).toEqual({
      rowspan: 0,
      colspan: 0,
    })
  })

  it('refrushSourceData', () => {
    const oldSD = wrapper.vm.sourceData
    wrapper.vm.refrushSourceData()
    expect(wrapper.vm.sourceData).not.toBe(oldSD)
  })

  it('addComment', async () => {
    await wrapper.setProps({
      subdata
    })

    wrapper.vm.userInfo = {
      name: 'pzd',
      _id: '64262090457da4468fb17da9'
    }
    wrapper.vm.addComment()
    expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('You have commented.')

    wrapper.vm.userInfo = {
      name: 'pzd',
      _id: '1'
    }
    wrapper.vm.addComment()
    expect(wrapper.vm.dialogVisible).toBeTruthy()
  })

  it('delSubComment', async () => {
    await wrapper.setProps({
      subdata
    })

    wrapper.vm.userInfo = {
      name: 'pzd',
      _id: '64262090457da4468fb17da9'
    }
    wrapper.vm.addComment()
    expect(wrapper.vm.$messageBox).toHaveBeenCalledWith('You have commented.')

    wrapper.vm.userInfo = {
      name: 'pzd',
      _id: '1'
    }
    wrapper.vm.addComment()
    expect(wrapper.vm.dialogVisible).toBeTruthy()
  })

  it('delSubComment', async () => {
    wrapper.vm.currentRow = {'user_id':1,'comments_list':[{'_id':0}]}
    await wrapper.setProps({
      subdata
    })
    
    
    await wrapper.vm.delSubComment({
      target: {
        dataset: {
          id: 0
        }
      }
    })
    await Vue.nextTick()
    expect(wrapper.vm.$alert).toHaveBeenCalledWith('Delete this comment?','',{
      confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
      callback: expect.any(Function)
    })
    
    wrapper.vm.$alert.mock.calls[0][2].callback('confirm')
    expect(delSubComment).toHaveBeenCalled()
    await Vue.nextTick()
    expect(wrapper.vm.currentRow['comments_list']).toHaveLength(0)
    expect(wrapper.vm.$message).toHaveBeenCalledWith({
      message: 'Delete success!',
      type: 'success',
    })
  })

  it('addSubComment', async () => {
    const  scrollTo= jest.fn()
    wrapper.vm.$refs = {'sub-comment-box':{scrollTo,scrollHeight:100}}
    wrapper.vm.reply_user = '223'
    wrapper.vm.currentRow = {'user_id':1,'comments_list':[{'_id':0}]}
    await wrapper.setProps({
      subdata
    })
    
    await wrapper.vm.addSubComment()
    await Vue.nextTick()
    
    expect(addSubComment).toHaveBeenCalled()
    await Vue.nextTick()
    expect(wrapper.vm.currentRow['comments_list']).toHaveLength(2)
    expect(scrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: 'smooth',
    })
    
  })


  it('replySubComment', () => {
  
    wrapper.vm.replySubComment({target:{dataset:{user:'123'}}})
    expect(wrapper.vm.reply_user).toBe('123')

})

it('addCommentInTable', async () => {
  await wrapper.setProps({
    subdata
  })
  
  wrapper.vm.newCommentModel['accept/reject'] = 'accept'
  

  await wrapper.vm.addCommentInTable()

  expect(confirmEvent).toHaveBeenCalled()
  
  wrapper.vm.newCommentModel['accept/reject'] = 'reject'
  
  delete wrapper.vm.subdata.logging
  wrapper.vm.loggingTable = []
  expect(wrapper.vm.subdata.logging).not.toBeDefined()

  await wrapper.vm.addCommentInTable()

  expect(rejectEvent).toHaveBeenCalled()
  expect(Object.keys(wrapper.vm.subdata.logging)).toHaveLength(1)
  expect(wrapper.vm.dialogVisible).toBeFalsy()
  expect(wrapper.vm.loggingTable).toHaveLength(1)
  
})
})
