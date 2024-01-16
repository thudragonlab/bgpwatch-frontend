import request from './request'
import axios from 'axios'
// const BASE_URL = 'http://10.110.62.34:5000/'
const MY_URL = '/myapi'


export function SubscribeTo(asList) {
  return request({
    method: 'POST',
    url: `${MY_URL}/add_as_with_list`,
    data: {
      as_list: asList
    },
    useToken: true
  })
}

export function getSubscribedByToken() {
  return request({
    method: 'GET',
    url: `${MY_URL}/get_subscribed_by_token`,
    useToken: true
  })
}


export function delAsInList(asList) {
  return request({
    method: 'PUT',
    url: `${MY_URL}/del_as_in_list`,
    data: {
      as_list: asList
    },
    useToken: true
  })
}

export function getHijackEvent(st, et) {
  return request({
    method: 'POST',
    url: `${MY_URL}/get_hijack_event`,
    data: {
      st,
      et
    },
    useToken: true
  })
}


export function confirmEvent(event_id, event_type,description='-') {
  return request({
    method: 'GET',
    url: `${MY_URL}/confirm_event?_id=${event_id}&event_type=${event_type}&description=${description}`,
    useToken: true
  })
}

export function unconfirmedEvent(event_id, event_type) {
  return request({
    method: 'GET',
    url: `${MY_URL}/unconfirmed_event?_id=${event_id}&event_type=${event_type}`,
    useToken: true
  })
}


export function rejectEvent(event_id, event_type, reason) {
  return request({
    method: 'POST',
    url: `${MY_URL}/reject_event`,
    data: {
      _id: event_id,
      event_type,
      reason
    },
    useToken: true
  })
}



export function unRejectEvent(event_id, event_type) {
  return request({
    method: 'POST',
    url: `${MY_URL}/un_reject_event`,
    data: {
      _id: event_id,
      event_type
    },
    useToken: true
  })
}


export function getPeerDiff() {
  return request({
    method: 'POST',
    url: `${MY_URL}/get_peer_diff`,
    useToken: true
  })
}

export function addSubComment(event_id, event_type,parent_user_id,comment,reply_user='') {
  return request({
    method: 'POST',
    url: `${MY_URL}/add_sub_comment`,
    data: {
      _id: event_id,
      event_type,
      user_id:parent_user_id,
      comment,
      reply_user
    },
    useToken: true
  })
}

export function delSubComment(event_id, event_type,parent_user_id,comment_id) {
  return request({
    method: 'POST',
    url: `${MY_URL}/del_sub_comment`,
    data: {
      _id: event_id,
      event_type,
      user_id:parent_user_id,
      comment_id
    },
    useToken: true
  })
}

export function getPeerStats() {
  return request({
    method: 'POST',
    url: `${MY_URL}/get_peer_stats`,
    useToken: true
  })
}

export function searchAs2PrefixPath(){
  return request({
    method: 'POST',
    url: `${MY_URL}/search_as2prefix_path`,
    useToken: true
  })
}

export function searchAs2PrefixPathInfo(){
  return request({
    method: 'POST',
    url: `${MY_URL}/search_as2prefix_path_info`,
    useToken: true
  })
}

export function getAs2prefixPath(prefix,asn){
  return request({
    method: 'POST',
    url: `${MY_URL}/get_as2prefix_path`,
    data: {
      prefix,
      asn
    },
    useToken: true
  })
}

export function removeAs2prefixPath(prefix,asn){
  return request({
    method: 'POST',
    url: `${MY_URL}/remove_as2prefix_path`,
    data: {
      prefix,
      asn
    },
    useToken: true
  })
}




export function addPrefixSubscribe(prefix,asn){
  return request({
    method: 'POST',
    url: `${MY_URL}/add_prefix_subscribe`,
    data: {
      prefix,
      asn
    },
    useToken: true
  })
}