import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers, get_user_id } = config;

const industry = {
    
    getIndustries() {
        return axios.get(apiBaseUrl + '/industries', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getUserIndustries() {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/industries`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    insertIndustry(data) {
        return axios.post(apiBaseUrl + `/user/${get_user_id()}/industry`, data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },
}

export default industry;