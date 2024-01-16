import request from './request'
const MY_URL = '/myapi'

export function getFakeAsPath(st, et) {
    return request({
        methods: 'GET',
        url: `${MY_URL}/getFakeAsPath?st=${st}&et=${et}`,
        timeout: 3 * 60 * 1000,
    })
}


export function getFakeAsPathRecordById(id){

    return request({
        methods: 'GET',
        url: `${MY_URL}/getFakeAsPathRecordById?id=${id}`,
        timeout: 3 * 60 * 1000,
    })

}