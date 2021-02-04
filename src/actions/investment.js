import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers } = config;

const investment = {
    
    getInvestmentAttributes() {
        return axios.get(apiBaseUrl + '/investment-attributes', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }
}

export default investment;