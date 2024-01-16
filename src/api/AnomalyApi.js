import request from './request'
const MY_URL = '/myapi'
export function getEventlistByDate(st, et) {
    return request({
        methods: 'GET',
        url: `${MY_URL}/events?st=${st}&et=${et}&event_type=ALL`,
        timeout: 3 * 60 * 1000,
    })
}
export function getMoasEventlistByDate(st, et) {
    return request({
        methods: 'GET',
        url: `${MY_URL}/events?st=${st}&et=${et}&event_type=ALL_MOAS`,
        timeout: 3 * 60 * 1000,
    })
}


export function getEventDetail(detail_url) {
    // return new Promise((resolve,reject) => {
    //   return resolve(eventsDetail)
    // })
    return request({
        methods: 'GET',
        url: `${MY_URL}${detail_url}`
    })
}


