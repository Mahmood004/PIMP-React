import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers, get_user_id } = config;

const profile = {

    getUserDealCategory() {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/user-deal-category`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    userDealCategoryInsertion(obj) {
        return axios.post(apiBaseUrl + `/user/${get_user_id()}/user-deal-category`, { user_deal_category: JSON.stringify(obj) }, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    userDealCategoryRemoval(obj) {
        return axios.post(apiBaseUrl + `/user/${get_user_id()}/remove-user-deal-category`, { user_deal_category: JSON.stringify(obj) }, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    changePassword(data) {
        return axios.patch(apiBaseUrl + '/update-password', data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    updateProfile(data) {
        return axios.patch(apiBaseUrl + `/user/${get_user_id()}`, data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getUserProfile() {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    filterUserDeals(filter, dashboard = false) {

        let url = `/user/${get_user_id()}/deals`;
        let query = `?`;

        if (filter) {
            query = query + `${filter}=true`;
        }

        if (!dashboard) {

            if (localStorage.getItem('interest_level')) {
                query = query + `&interest_level=${localStorage.getItem('interest_level')}`;
            }

            if (localStorage.getItem('search_value')) {
                query = query + `&search_value=${localStorage.getItem('search_value')}`;
            }

            if (localStorage.getItem('search_type')) {
                query = query + `&search_type=${localStorage.getItem('search_type')}`;
            }
        }
            
        return axios.get(apiBaseUrl + url + query, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }
}

export default profile;