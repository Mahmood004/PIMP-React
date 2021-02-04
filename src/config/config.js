import { toast } from 'react-toastify';
import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { Select } from 'antd';

const { Option } = Select;

const config = {

    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    trackingId: process.env.REACT_APP_TRACKING_ID,

    headers: () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    },

    file_headers: () => {
        return {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    },

    get_user_id: () => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user_id : null;
    },

    verify_auth: () => {
        return localStorage.getItem('token') && localStorage.getItem('user') ? true : false;
    },

    toastify: (type, message) => {
        toast[type](message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
    },

    set_storage: (token, user) => {

        if (token) {
            localStorage.setItem('token', token);
        }
        
        localStorage.setItem('user', JSON.stringify(user));
    },

    set_deal_form_aks: val => localStorage.setItem('EDIT_DEAL_FORM_AKS', [...val]),
    set_deal_sheet_aks: val => localStorage.setItem('EDIT_DEAL_SHEET_AKS', [...val]),

    get_deal_form_aks: () => {
        if (localStorage.getItem('EDIT_DEAL_FORM_AKS')) {
            return localStorage.getItem('EDIT_DEAL_FORM_AKS');    
        }
        return null;
    },

    get_deal_sheet_aks: () => {
        if (localStorage.getItem('EDIT_DEAL_SHEET_AKS')) {
            return localStorage.getItem('EDIT_DEAL_SHEET_AKS');    
        }
        return null;
    },

    get_user_from_storage: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    remove_storage: () => {
        localStorage.clear();
    },

    isWholeOrDecimal: (rule, value, callback) => {

        if (value && !(+value % 1 === 0 || +value % 1 > 0)) {
            callback(`${_.startCase(rule.field)} should be a whole / decimal number`);            
        } else {
            callback();
        }
    },

    disabledDate: current => {
        return current && current < moment().endOf('day');
    },

    downloadFile(file_name, file_type, arrayBuffer) {

        const base64 = new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '');

        fetch(`data:${file_type};base64,${base64}`)
            .then(res => res.blob())
            .then(blob  => {

                const link = document.createElement('a');

                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', file_name);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

            });
    },

    onGridRowHover: () => {
        return {
            onMouseEnter: event => {
                document.getElementsByTagName("body")[0].style.cursor = "pointer";
            },
            onMouseLeave: event => {
                document.getElementsByTagName("body")[0].style.cursor = "";
            }
        }
    },

    autoComplete: (value, auto_comp_arr, set_option, set_options) =>  {

        let options = [];

        if (value) {
            options = auto_comp_arr.filter(element => element.toLowerCase().includes(value.toLowerCase()));
        } 
        
        if (set_option) set_option(value);
        set_options(options.map(option => <Option key={option}>{option}</Option>));

    },

    generateCSVData: deals => {

        const csv_data = [];
    
        deals.forEach(({ deal_info: {
            deal_id, shortcode, deal_status, deal_category, deal_sub_category, submit_by_user_id, submit_date, approved,
            approved_by_user_id, approved_date, summary, investment_amount_sought, minimum_investment, expected_close_date, 
            actual_close_date, short_description, deleted, deleted_by_user_id, deleted_datetime, company_name, sponsor_name, location, deal_instrument, 
            projected_irr, projected_multiple, referred_by, valuation, stage, deal_contact_name, deal_contact_email, industry, deal_profile
        } }) => {

                const obj = {
                    id: deal_id,
                    shortcode,
                    status: deal_status ? deal_status.description : 'N/A',
                    category: deal_category ? deal_category.description : 'N/A',
                    sub_category: deal_sub_category ? deal_sub_category.description : 'N/A',
                    submit_by: submit_by_user_id,
                    submit_date: submit_date ? moment(submit_date).format('MMMM Do, YYYY') : 'N/A',
                    approved: approved ? 1 : 0,
                    approved_by: approved_by_user_id ? approved_by_user_id : 'N/A',
                    approved_date: approved_date ? moment(approved_date).format('MMMM Do, YYYY') : 'N/A',
                    summary,
                    investment_amount_sought,
                    minimum_investment,
                    expected_close_date: expected_close_date ? moment(expected_close_date).format('MMMM Do, YYYY') : 'N/A',
                    actual_close_date: actual_close_date ? moment(actual_close_date).format('MMMM Do, YYYY') : 'N/A',
                    short_description,
                    deleted: deleted ? 1 : 0,
                    deleted_by: deleted_by_user_id ? deleted_by_user_id : 'N/A',
                    deleted_datetime: deleted_datetime ? moment(deleted_datetime).format('MMMM Do, YYYY') : 'N/A',
                    company: company_name,
                    sponsor: sponsor_name,
                    location,
                    instrument: deal_instrument ? deal_instrument.name : 'N/A',
                    projected_irr, 
                    projected_multiple, 
                    referred_by, 
                    valuation, 
                    stage, 
                    deal_contact_name, 
                    deal_contact_email,
                    industry: industry ? industry.name : 'N/A'
                }

                if (deal_profile) {
                    
                    const profile_fields = JSON.parse(deal_profile);

                    for (let key in profile_fields) {
                        obj[key] = profile_fields[key]
                    }
                }

                csv_data.push(obj);
            }
        );

        return csv_data;
    }
}

export default config;