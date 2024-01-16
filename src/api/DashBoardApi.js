import request from './request'
import axios from 'axios'
// const BASE_URL = 'http://10.110.62.34:5000/'
const BASE_URL = '/dbapi'
const BASE_URL2 = '/newapi'
const MY_URL = '/myapi'
const WZQ_API2 = '/wzqApi2'


export function getAsInfoByASN(asn) {
  return request({
    method: 'GET',
    url: `${BASE_URL}/api/dashboard/daily/asinfo?asn=${asn}`,

  })
}

export function getAsInfoByASN_myAPI(asn) {
  return request({
    method: 'GET',
    url: `${MY_URL}/asInfo?asn=${asn}`,

  })
}


export function getPeerPrefix(asn, {
  type,
  detailAsn
}) {
  return request({
    method: 'GET',
    url: `${BASE_URL}/api/dashboard/daily/peerprefix?asn=${asn}&${type}=${detailAsn}`,
  })
}



export function getAsRoute(asn, type) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getAsRoute?asn=${asn}&type=${type}`,
  })
}

export function getPeerTypeDistribute(asn) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getPeerTypeDistribute?asn=${asn}`,
  })
}


export function getAsInfoByList(asnList) {
  return request({
    method: 'POST',
    url: `${MY_URL}/getAsInfoByList`,
    data: asnList.map(as => parseInt(as))
  })
}

export function getRealTimeData() {
  return request({
    method: 'GET',
    url: `${MY_URL}/getRealTimeData`,
  })
}

export function getRealTimeDataInAWhile() {
  return request({
    method: 'GET',
    url: `${MY_URL}/getRealTimeDataInAWhile`,
  })
}

export function getASList(asn) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getAsList?asn=${asn}`,
  })
}

// import test from '@/../public/static/temporaryData/1.json'
export function getAsPathByPrefix(prefix, asn,type) {
  // return new Promise((resolve,reject) => {
  //   resolve(test)
  // })
  return request({
    method: 'GET',
    url: `${MY_URL}/getAsPathByPrefix?prefix=${prefix}&asn=${asn}&type=${type}`,
  })
}


export function getRouteHistoryStats(asn, qtype = 'g') {
  return request({
    method: 'GET',
    url: `${MY_URL}/route_history_stats?asns=${asn.join(',')}&qtype=${qtype}`,
  })
}


export function getRoutingPath(asn, pfx, qtype = "from") {
  return request({
    method: 'GET',
    url: `${WZQ_API2}/api/routing_path?asn=${asn}&pfx=${pfx}&qtype=${qtype}`
  })
}


export function getPrefixList(asn, qstr = undefined) {
  return request({
    method: 'GET',
    url: `${MY_URL}/prefix_list?asn=${asn}${qstr ? `&qstr=${qstr}` :  ''}`
  })
}

export function getPrefixTotalByAsn(asn) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getPrefixTotalByAsn?asn=${asn}`,
  })
}

export function getPeerList(asn,ipVersion) {
  return request({
    method: 'GET',
    url: `${MY_URL}/peer_list?asn=${asn}&ipversion=${ipVersion}`
  })
}


// http://10.110.62.37:5050/api/routing_path?asn=4538&pfx=59.66.196.0%2F24&qtype=to

export function getWhoisInfoByASN(asn){
  return request({
    method: 'GET',
    url: `${MY_URL}/get_whois_info_by_asn?asn=${asn}`
  })
}