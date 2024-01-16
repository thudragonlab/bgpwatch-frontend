import request from './request'
import axios from 'axios'
// const BASE_URL = 'http://10.110.62.34:5000/'
const MY_URL = '/myapi'


export function getOverviewData(startTime, endTime,selectedOption,asn) {
    return request({
      methods: 'GET',
      url: `${MY_URL}/overview?start=${startTime}&end=${endTime}&cc=${selectedOption}&asn=${asn}`,
    })
  }


export function downloadCSV(startTime, endTime) {
    return request({
        methods: 'GET',
        url: `${MY_URL}/exportCSV?start=${startTime}&end=${endTime}`,
        responseType:'blob'
      })
}