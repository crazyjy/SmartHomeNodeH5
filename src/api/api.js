import axios from 'axios';

let base = '';

// Login
export const requestLogin = params => { return axios.post(`${base}/api/admin/login`, params).then(res => res.data); };
export const getServerTime = params => { return axios.get(`${base}/api/admin/time`, { params: params }); };

// Switch
export const getSwitchIndex = params => { return axios.get(`${base}/api/switch/index`, { params: params }); };
export const createSwitch = params => { return axios.post(`${base}/api/switch/update`, params).then(res => res.data); };
export const controlSwitch = params => { return axios.post(`${base}/api/switch/control`, params).then(res => res.data); };

// Time
export const getTimeIndex = params => { return axios.get(`${base}/api/time/index`, { params: params }); };
export const updateTime = params => { return axios.post(`${base}/api/time/update`, params).then(res => res.data); };
export const controlTime = params => { return axios.post(`${base}/api/time/control`, params).then(res => res.data); };

// Button
export const getButtonIndex = params => { return axios.get(`${base}/api/button/index`, { params: params }); };
export const controlButton = params => { return axios.post(`${base}/api/button/control`, params).then(res => res.data); };