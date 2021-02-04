import React, { Component } from 'react';
import { deal, industry } from '../actions';
import config from '../config/config';
import { message } from 'antd';

const { 
    getDealTypes,
    getDealCategories,
    getDealSubCategories,
    getDealInstruments,
    getDealActivityList,
    fetchDocument,
    removeDealDocument
} = deal;

const { downloadFile } = config;

const { getIndustries } = industry;

const withDeal = Raw => {

    class Upgraded extends Component {

        state = {
            types: [],
            categories: [],
            sub_categories: [],
            instruments: [],
            industries: [],
            activities: []
        }

        fetchTypes = async () => {

            const result = await getDealTypes();
            const { types, message: msg } = result.data;

            if (result.status === 200) {

                this.setState({
                    types
                });

            } else {
                message.error(msg);
            }
        }

        fetchInstruments = async () => {

            const result = await getDealInstruments();
            const { instruments, message: msg } = result.data;

            if (result.status === 200) {

                this.setState({
                    instruments
                });

            } else {
                message.error(msg);
            }
        }

        fetchActivities = async () => {

            const result = await getDealActivityList();
            const { message: msg, activities } = result.data;

            if (result.status === 200) {
                
                this.setState({
                    activities
                });

            } else {
                message.error(msg);
            }
        }

        fetchIndustries = async () => {

            const result = await getIndustries();
            const { industries, message: msg } = result.data;

            if (result.status === 200) {

                this.setState({
                    industries
                });

            } else {
                message.error(msg);
            }
        }

        fetchCategories = async () => {

            const result = await getDealCategories();
            const { categories, message: msg } = result.data;

            if (result.status === 200) {

                this.setState({
                    categories
                });

            } else {
                message.error(msg);
            }
        }

        fetchSubCategories = async () => {

            const result = await getDealSubCategories();
            const { sub_categories, message: msg } = result.data;

            if (result.status === 200) {

                this.setState({
                    sub_categories
                });

            } else {
                message.error(msg);
            }
        }

        fetchCategoriesByType = type_id => {

            let categories = [];
            const types = [...this.state.types];
            categories = types.find(({ deal_type_id }) => deal_type_id === type_id).deal_categories;

            this.setState({
                categories,
                sub_categories: []
            });

        }

        fetchSubCategoriesByCategory = category_id => {

            let sub_categories = [];
            const categories = [...this.state.categories];
            sub_categories = categories.find(({ deal_category_id }) => deal_category_id === category_id).deal_sub_categories;

            this.setState({
                sub_categories
            });

        }

        download = async (e, deal_document) => {

            e.preventDefault();
            const { id, name, type } = deal_document;
    
            const result = await fetchDocument(id);
            const { data: { Body: { data } }, message: msg } = result.data;
    
    
            if (result.status === 200) {
                await downloadFile(name, type, data);
                message.success(msg);
            } else {
                message.error(msg);
            }
            
        }

        removeDealActivityDocument = async deal_document_id => {
            
            const result = await removeDealDocument(deal_document_id);
            const { message: msg } = result.data;
    
            if (result.status === 200) {
                message.success(msg);
            } else {
                message.error(msg);
            }
        }

        componentDidMount() {
            this.fetchTypes();
            this.fetchInstruments();
            this.fetchIndustries();
            this.fetchActivities();
        }

        render() {

            const { types, categories, sub_categories, instruments, industries, activities } = this.state;

            return (
                <Raw
                    {...this.props}
                    types={types}
                    categories={categories}
                    sub_categories={sub_categories}
                    instruments={instruments}
                    activities={activities}
                    industries={industries}
                    categoriesByType={this.fetchCategoriesByType}
                    subCategoriesByCategory={this.fetchSubCategoriesByCategory}
                    submitDeal={this.submitDeal}
                    download={this.download}
                    removeActivityDocument={this.removeDealActivityDocument}
                />
            )
        }
    }
    return Upgraded;
}

export default withDeal;