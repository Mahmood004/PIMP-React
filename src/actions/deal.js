import axios from 'axios';
import config from '../config/config';

const { apiBaseUrl, headers, file_headers, get_user_id } = config;

const deal = {

    getDealTypes() {
        return axios.get(apiBaseUrl + '/deal-types', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealActivityList() {
        return axios.get(apiBaseUrl + '/deal-activities', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealCategories() {
        return axios.get(apiBaseUrl + '/deal-categories', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealSubCategories() {
        return axios.get(apiBaseUrl + '/deal-sub-categories', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealCategoriesByType(type_id) {
        return axios.get(apiBaseUrl + `/type/${type_id}/categories`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealSubCategoriesByCategory(category_id) {
        return axios.get(apiBaseUrl + `/category/${category_id}/sub-categories`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    postDeal(deal) {
        return axios.post(apiBaseUrl + `/deal`, deal, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    postDealWithoutAuth(deal) {
        return axios.post(apiBaseUrl + `/deal-without-auth`, { deal }, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    modifyDeal(deal) {
        return axios.put(apiBaseUrl + `/deal/${deal.deal_id}`, deal, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    removeDeal(deal_id) {
        return axios.delete(apiBaseUrl + `/deal/${deal_id}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    uploadDocuments(deal_id, formData) {
        return axios.post(apiBaseUrl + `/deal/${deal_id}/documents`, formData, { headers: file_headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    modifyDocuments(deal_id, formData) {
        return axios.put(apiBaseUrl + `/deal/${deal_id}/documents`, formData, { headers: file_headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    updateDealInterest(deal_id, data) {
        return axios.post(apiBaseUrl + `/deal/${deal_id}/interest`, data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    toggleFavorite(deal_id, favorite) {
        return axios.post(apiBaseUrl + `/deal/${deal_id}/favorite`, { favorite }, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getUserDealsSummary() {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/deals/summary`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    addToMyDeals(deal_id) {
        return axios.post(apiBaseUrl + `/add`, { deal_id }, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getUserDealActivities(deal_id) {
        return axios.get(apiBaseUrl + `/user/${get_user_id()}/deal/${deal_id}/activity`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    submitDealActivity(deal_id, data) {
        return axios.post(apiBaseUrl + `/user/${get_user_id()}/deal/${deal_id}/activity`, data, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealFinderList(query) {

        let url;

        if (query)
            url = `/deals?${query}`;
        else
            url = `/deals`;

        return axios.get(apiBaseUrl + url, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealInstruments() {
        return axios.get(apiBaseUrl + '/deal-instruments', { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    fetchDocument(id) {
        return axios.get(apiBaseUrl + `/s3-file-download?deal_document_id=${id}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    removeDealDocument(deal_document_id) {
        return axios.delete(apiBaseUrl + `/deal_document/${deal_document_id}`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealInterestHistory(deal_id) {
        return axios.get(apiBaseUrl + `/deal/${deal_id}/interest-history`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    },

    getDealCategoryAndTypeBySubCategory(sub_category_id) {
        return axios.get(apiBaseUrl + `/deal_sub_category/${sub_category_id}/category/type`, { headers: headers() })
            .then(res => res)
            .catch(err => err.response);
    }
}

export default deal;