import request from './request'
const MY_URL = '/myapi'

export function getResilienceByccCode(cc) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getResilienceByccCode?cc=${cc}`,
  })
}


export function getResilienceTestData(cc, asn) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getTopologyData?cc=${cc}&asn=${asn}`,
  })
}


export function getResilienceTestDataInOptimize(cc, asn) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getTopologyDataOpt?cc=${cc}&asn=${asn}`,
  })
}

export function getAsByCc(cc) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getAsByCc?cc=${cc}`,
  })
}


export function getRtreeByAsn(cc, asn, condition) {
  return request({
    method: 'GET',
    url: `${MY_URL}/getRtreeByAsn?cc=${cc}&asn=${asn}&condition=${condition}`,
  })
}

