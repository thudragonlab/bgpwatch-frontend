import request from './request'
const MY_URL = '/myapi'

export function getRtreeByPrefix(prefix){
  return request({
    method: 'GET',
    url: `${MY_URL}/getRtreeByPrefix?prefix=${prefix}`,
  })
}

export function getRtreeByPrefixData(prefix){
  return request({
    method: 'GET',
    url: `${MY_URL}/getRtreeByPrefixData?prefix=${prefix}`,
  })
}

export function getRtreeByPrefixDataTopo(prefix){
  return request({
    method: 'GET',
    url: `${MY_URL}/getRtreeByPrefixDataToTopo?prefix=${prefix}`,
  })
}

export function getRouteByIP(left_ip,right_ip){
  return request({
    method: 'GET',
    url: `${MY_URL}/getRouteByIP?left_ip=${left_ip}&right_ip=${right_ip}`,
  })
}

export function getRoutingPathCluster(asn){
  return request({
    method: 'GET',
    url: `${MY_URL}/getRoutingPathCluster?asn=${asn}`,
  })
}

export function getRtreeByHash(hash){
  return request({
    method: 'GET',
    url: `${MY_URL}/getRtreeByHash?hash=${hash}`,
  })
}


export function getRtreeByHashes(hashes,asn){
  return request({
    method: 'POST',
    url: `${MY_URL}/getRtreeByHashes?asn=${asn}`,
    data:hashes
  })
}


export function getJitterTopNPrefixByAs(asn,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterTopNPrefixByAs?asn=${asn}&st=${st}&et=${et}&source=${source}`,
  })
}

export function getJitterTopNPrefixByAsAndPfx(asn,prefix,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterTopNPrefixByAsAndPfx?asn=${asn}&prefix=${prefix}&st=${st}&et=${et}&source=${source}`,
  })
}



export function getJitterDataByPrefix(asn,prefix,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterDataByPrefix?prefix=${prefix}&asn=${asn}&st=${st}&et=${et}&source=${source}`,
  })
}

export function getJitterDataByASNAndPfx(asn,ppfx,prefix,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterDataByASNAndPfx?prefix=${prefix}&ppfx=${ppfx}&asn=${asn}&st=${st}&et=${et}&source=${source}`,
  })
}



export function getFITIJitterTopNPrefixByPrefix(prefix,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getFITIJitterTopNPrefixByPrefix?prefix=${prefix}&st=${st}&et=${et}&source=${source}`,
  })
}

export function getFITIJitterDataByPrefix(p_prefix,prefix,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getFITIJitterDataByPrefix?prefix=${prefix}&p_prefix=${p_prefix}&st=${st}&et=${et}&source=${source}`,
  })
}

export function getJitterTopNPeerByPfx(asn,pfx,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterTopNPeerByPfx?asn=${asn}&pfx=${pfx}&st=${st}&et=${et}&source=${source}`,
  })
}

export function getJitterTopNPrefixByPeer(asn,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterTopPeer?asn=${asn}&st=${st}&et=${et}&source=${source}`,
  })
}


export function getJitterDataByPeer(asn,peer,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterDataByPeer?asn=${asn}&peer=${peer}&st=${st}&et=${et}&source=${source}`,
  })
}

export function getJitterDataByPeerAndPfx(asn,pfx,peer,st,et,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterDataByPeerAndPfx?asn=${asn}&pfx=${pfx}&peer=${peer}&st=${st}&et=${et}&source=${source}`,
  })
}


export function getJitterPeerASPathByTimeStamp(asn,peer,ts,page,timeFrame,source){
  return request({
    method: 'GET',
    url: `${MY_URL}/getJitterPeerASPathByTimeStamp?asn=${asn}&ts=${ts}&peer=${peer}&page=${page}&time_f=${timeFrame}&source=${source}`,
  })
}

