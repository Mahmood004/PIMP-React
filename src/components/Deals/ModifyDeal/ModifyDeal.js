import React, { useRef, useState } from 'react';
import { Tabs } from 'antd';
import DealForm from './DealForm/DealForm';
import DealProfile from './DealProfile/DealProfile';
import DealDocument from './DealDocument/DealDocument';
import DealSheet from './DealSheet/DealSheet';
import DealActivity from './DealActivity/DealActivity';
import DrawerComponent from '../../common/DrawerComponent';
import commaNumber from 'comma-number';

const { TabPane } = Tabs;

const ModifyDeal = props => {

    const { 
        drawer_visibility, set_drawer_visibility, active_key, deal, interests, toggle, sub_menu, 
        types, instruments, activities, industries, download, removeActivityDocument
    } = props;
    
    const [deal_profile, set_deal_profile] = useState(JSON.parse(deal.deal_category.deal_profile_settings));

    const dealRef = useRef();
    const profileRef = useRef();
    const documentRef = useRef();
    const sheetRef = useRef();

    const invoked = () => {
        
        if (sheetRef.current) {
            sheetRef.current.submitHandler();
        }
        if (documentRef.current) {
            documentRef.current.modifyDealDocuments();
        }
        if (profileRef.current) {
            profileRef.current.modifyProfile();
        }
        if (dealRef.current) {
            dealRef.current.updateDeal();
        }
    }

    const close_drawer = async () => {
        set_drawer_visibility(false);
        invoked();
    }

    const { company_name, sponsor_name, minimum_investment, investment_amount_sought } = deal;

    return (
        
        <DrawerComponent
            drawer_title={`${company_name ? company_name : ''}${sponsor_name ? ' - ' + deal.sponsor_name : ''}${minimum_investment ? ' - ' + commaNumber(minimum_investment) : ''}${investment_amount_sought ? ' of ' + commaNumber(investment_amount_sought) : ''}`}
            drawer_visibility={drawer_visibility}
            close_drawer={close_drawer}
        >

            <Tabs 
                type="card"
                defaultActiveKey={active_key ? active_key : '1'}
            >
                <TabPane 
                    tab="Modify Deal" 
                    key="1"
                >
                    <DealForm
                        ref={dealRef}
                        deal={deal}
                        types={types}
                        instruments={instruments}
                        industries={industries}
                        set_deal_profile={set_deal_profile}
                        toggle={toggle}
                    />
                </TabPane>

                <TabPane
                    tab="Modify Profile"
                    key="2"
                >
                    <DealProfile 
                        ref={profileRef}
                        deal={deal}
                        deal_profile={deal_profile}
                        toggle={toggle}
                    />
                </TabPane>

                <TabPane 
                    tab="Modify Deal Documents" 
                    key="3"
                >
                    <DealDocument 
                        ref={documentRef}
                        deal={deal}
                        download={download}
                        toggle={toggle}
                    />
                </TabPane>

                <TabPane
                    tab="My Deal Sheet"
                    key="4"
                >
                    <DealSheet 
                        ref={sheetRef}
                        deal={deal}
                        interests={interests}
                        sub_menu={sub_menu}
                        toggle={toggle}
                    />

                </TabPane>

                <TabPane
                    tab="Activity"
                    key="5"
                >
                    <DealActivity 
                        deal={deal}
                        _activities={activities}
                        download={download}
                        removeActivityDocument={removeActivityDocument}
                    />
                </TabPane>

            </Tabs>

        </DrawerComponent>
    )
}


export default ModifyDeal;