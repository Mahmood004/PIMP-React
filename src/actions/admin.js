import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers } = config;

const admin = {

    getUnapprovedUsers() {
        return axios.get(apiBaseUrl + `/users?approved=${false}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    approveUser(user_id) {
        return axios.patch(apiBaseUrl + `/user/${user_id}/approve`, {}, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getUnapprovedDeals() {
        return axios.get(apiBaseUrl + `/deals?approved=${false}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    approveDeal(deal_id) {
        return axios.patch(apiBaseUrl + `/deal/${deal_id}/approve`, {}, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getGmailMessages() {
        return axios.get(apiBaseUrl + `/gmail-messages`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }
}

export default admin;