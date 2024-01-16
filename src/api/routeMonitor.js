import request from './request'
// import evetsStats from '@/../public/static/temporaryData/eventsStats.json'
// import eventsData from '@/../public/static/temporaryData/eventsData.json'
// import eventsDetail from '@/../public/static/temporaryData/eventsDetail.json'
const BASE_URL = 'http://bgpdata.cgtf.net'
const MY_URL = '/myapi'
export function getEventlistByDate(st, et) {
  // return new Promise((resolve,reject) => {
  //   return resolve(eventsData)
  // })
  return request({
    methods: 'GET',
    url: `${BASE_URL}/events?st=${st}&et=${et}&event_type=Possible Hijack`,
    timeout: 3 * 60 * 1000,
  })
}

export function getEventlist() {
  // return new Promise((resolve,reject) => {
  //   return resolve(eventsData)
  // })
  return request({
    methods: 'GET',
    url: `${BASE_URL}/events`,
    timeout: 3 * 60 * 1000,
  })
}



export function getEventlistLatest() {
  // const startDate = new Date()
  // startDate.setDate(startDate.getDate() - 3)
  // const startDateFormat = startDate.toJSON().split('.')[0].replace('T',' ')
  // const endDate = new Date()
  // const endDateFormat = endDate.toJSON().split('.')[0].replace('T',' ')
  // return request({
  //   methods: 'GET',
  //   url: `/events?start=${startDateFormat}&end=${endDateFormat}`,
  // })
  return request({
    methods: 'GET',
    url: `${BASE_URL}/events/latest`,
  })
}

export function getEventstat(startTime, endTime) {
  return request({
    methods: 'GET',
    url: `${MY_URL}/stats?start=${startTime}&end=${endTime}`,
  })
}


export function getEventDetail(detail_url) {
  // return new Promise((resolve,reject) => {
  //   return resolve(eventsDetail)
  // })
  return request({
    methods: 'GET',
    url: `${BASE_URL}${detail_url}`
  })
}


export function getAsInfo(asn='', as_name='',org_name='') {
  return request({
    method: 'GET',
    url: `${MY_URL}/getAsInfo?asn=${asn}&as_name=${as_name}&org_name=${org_name}`,
  })
}