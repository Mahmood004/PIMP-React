import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers } = config;

const auth = {

    register(data) {
        return axios.post(apiBaseUrl + '/signup', data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    login(data) {
        return axios.post(apiBaseUrl + '/signin', data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    forgotPassword(email) {
        return axios.post(apiBaseUrl + `/user/${email}/reset`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    resetPassword(data) {
        return axios.post(apiBaseUrl + '/reset-password', data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }

}

export default auth;