import React, { Component } from 'react';
import { Table } from 'antd';
import { admin } from '../../actions';
import approveDealColumns from '../../utils/columns/approveDeal';
import ModifyDeal from './ModifyDeal/ModifyDeal';
import Popup from './Popup/Popup';

const { getUnapprovedDeals, approveDeal } = admin;

class ApproveDeals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            view_popup: false,
            modify_popup: false,
            deal: null
        }

        this.columns = approveDealColumns(this.openViewDealPopup, this.openModifyDealPopup, this.approveDeal);

    }

    approveDeal = async (event, record) => {
        
        const res = await approveDeal(record.key);
        
        if (res.status === 200) {

            const deals = [...this.state.data];
            const approvedDealIndex = deals.findIndex(deal => deal.key === record.key);
            deals.splice(approvedDealIndex, 1);;

            this.setState({
                data: deals
            });
        }
    }

    fetchUnapprovedDeals = async () => {

        const res = await getUnapprovedDeals();
        
        if (res.status === 200) {

            let obj = {};
            const deals = [];

            res.data.deals.forEach(deal => {

                obj = {
                    key: deal.deal_id,
                    shortcode: deal.shortcode,
                    summary: deal.summary,
                    short_description: deal.short_description,
                    status: deal.approved,
                    view: deal,
                    edit: deal
                };
                deals.push(obj);
            });

            this.setState({
                data: deals
            })
        }

    }
    
    componentDidMount() {
        this.fetchUnapprovedDeals();
    }

    closeViewDealPopup = value => {

        this.setState({
            view_popup: value
        });
    }

    openViewDealPopup = (value, deal) => {
        console.log('deal', deal);
        this.setState({
            view_popup: value,
            deal
        });
    }

    openModifyDealPopup = (value, deal) => {
        console.log('deal', deal);
        this.setState({
            modify_popup: value,
            deal
        });
    }

    closeModifyDealPopup = value => {

        this.setState({
            modify_popup: value
        });
    }
    
    render() {

        const { view_popup, modify_popup, deal } = this.state;

        return (
            <React.Fragment>
                <h4>Approve Deals</h4>
                <Table columns={this.columns} dataSource={this.state.data} />

                { modify_popup && <ModifyDeal  
                    visible={modify_popup}
                    deal={deal}
                    close={this.closeModifyDealPopup}
                    toggle={this.fetchUnapprovedDeals}
                /> }

                { view_popup && <Popup 
                    deal={deal} 
                    showPopup={this.closeViewDealPopup} 
                /> }
            </React.Fragment>
        )
    }
}

export default ApproveDeals