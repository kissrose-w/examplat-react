import axios from 'axios';


export const getCaptchaApi = () => {
  return axios.get('http://39.96.210.90:8001/login/captcha');
}