import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers } = config;

const interest = {

    getInterestLevels() {
        return axios.get(apiBaseUrl + '/interests', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }

}

export default interest;