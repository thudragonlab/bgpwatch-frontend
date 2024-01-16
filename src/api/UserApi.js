import request from './request'
import axios from 'axios'
// const BASE_URL = 'http://10.110.62.34:5000/'
const MY_URL = '/myapi'

export function Login(user_name,password) {
    const fd = new FormData()
    fd.append('user_name', user_name)
    fd.append('password', password)
  return request({
    method: 'POST',
    url: `${MY_URL}/login`,
    data: fd
  })
}


export function Register(token) {
    return request({
      method: 'GET',
      url: `${MY_URL}/register?token=${token}`,
    })
  }

  export function VerifyMail(user_name,password,email) {
    const fd = new FormData()
    fd.append('user_name', user_name)
    fd.append('password', password)
    fd.append('email', email)
    return request({
      method: 'POST',
      url: `${MY_URL}/verifyEmail`,
      data: fd
    })
  }


export function forgetPwd(userName) {
  return request({
    method: 'GET',
    url: `${MY_URL}/forget?userName=${userName}`,
  })
}

export function updatePwd(userName,pwd){
  return request({
    method: 'POST',
    url: `${MY_URL}/updatePwd`,
    data: {
      user:userName,
      pwd
    }
  })
}

export function addSource(source){
  return request({
    method: 'GET',
    url: `${MY_URL}/addSourceIp?source=${source}`,
    useToken: true
  })
}

export function delSource(source){
  return request({
    method: 'GET',
    url: `${MY_URL}/delSourceIp?source=${source}`,
    useToken: true
  })
}
export function getSourceIP(){
  return request({
    method: 'GET',
    url: `${MY_URL}/getSourceIP`,
    useToken: true
  })
}

