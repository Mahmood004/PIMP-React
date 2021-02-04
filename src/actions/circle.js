import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers, get_user_id } = config;

const circle = {

    getUserCircles() {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/circles`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    circleInvitations(pending = false) {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/invitations?type=${'received'}&pending=${pending}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    acceptCircleInvite(invite_id) {
        return axios.post(apiBaseUrl + `/invite/${invite_id}/accept`, {}, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getCircleMembers(circle_id) {
        return axios.get(apiBaseUrl + `/circle/${circle_id}/members`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    sendCircleInvite(circle_id, data) {
        return axios.post(apiBaseUrl + `/circle/${circle_id}/invite`, data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getUserCirclesSummary() {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/circles/summary`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }

}

export default circle;