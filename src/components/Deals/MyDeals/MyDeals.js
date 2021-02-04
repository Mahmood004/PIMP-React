import React, { useContext, useState, useEffect } from 'react';
import { Tabs, message, Checkbox, Input, Select, Button } from 'antd';
import Deal from './Deal';
import { deal, profile } from '../../../actions';
import { HomeContext } from '../../../containers/Home/Home';
import myDeals from '../../../utils/columns/myDeals';
import ModifyDeal from '../ModifyDeal/ModifyDeal';
import withDeal from '../../../hoc/withDeal';;

const { updateDealInterest, toggleFavorite, removeDeal } = deal;
const { filterUserDeals } = profile;
const { TabPane } = Tabs;
const { Option } = Select;

const MyDeals = props => {

    const { types, instruments, activities, industries, download, removeActivityDocument } = props;

    const [fav, set_fav] = useState([]);
    const [all, set_all] = useState([]);
    const [submitted, set_submitted] = useState([]);
    const [drawer_visibility, set_drawer_visibility] = useState(false);
    const [deal, set_deal] = useState(null);

    const [active_tab, set_active_tab] = useState(localStorage.getItem('my_deals_active_tab') ? localStorage.getItem('my_deals_active_tab') : '1');
    const [drawer_active_key, set_drawer_active_key] = useState(null);

    const [search_value, set_search_value] = useState(localStorage.getItem('search_value') ? localStorage.getItem('search_value') : null);
    const [search_type, set_search_type] = useState(localStorage.getItem('search_type') ? localStorage.getItem('search_type') : 'all');
    
    const [loading, set_loading] = useState(false);
    const [action, set_action] = useState(false);


    const { interest_levels, sub_menu } = useContext(HomeContext);

    useEffect(() => {

        const filterDeals = async filter => {

            const all = [];
            const fav = [];

            const result = await filterUserDeals(filter);
            const { message: msg, deals } = result.data;

            if (result.status === 200) {

                deals.forEach(deal => {
            
                    let obj = {
                        key: deal.deal_id,
                        rating: deal,
                        deal_info: deal,
                        interest: deal,
                        expected_close: deal.expected_close_date,
                        minimum: deal.minimum_investment,
                        total_raise: deal.investment_amount_sought,
                        anticipated_investment: deal,
                        projected_irr: deal,
                        last_activity: deal.user_deal_activities[0],
                        actions: deal
                    };

                   all.push(obj);

                    if (deal.user_deal_interests[0] && deal.user_deal_interests[0].favorite) {
                        fav.push(obj);
                    }
                    
                });

                set_all(all);
                set_fav(fav);

            } else {
                message.error(msg);
            }
        }

        filterDeals('all');

    }, [action]);

    useEffect(() => {

        const filterDeals = async filter => {

            const submitted = [];

            const result = await filterUserDeals(filter);
            const { message: msg, deals } = result.data;

            if (result.status === 200) {

                deals.forEach(deal => {
            
                    let obj = {
                        key: deal.deal_id,
                        rating: deal,
                        deal_info: deal,
                        interest: deal,
                        expected_close: deal.expected_close_date,
                        minimum: deal.minimum_investment,
                        total_raise: deal.investment_amount_sought,
                        anticipated_investment: deal,
                        projected_irr: deal,
                        last_activity: deal.user_deal_activities[0],
                        actions: deal
                    };

                    submitted.push(obj);
                });

                set_submitted(submitted);

            } else {
                message.error(msg);
            }
        }

        filterDeals('submitted');

    }, [action]);

    const favoriteHandler = async (value, deal_id) => {

        set_loading(true);
        
        const result = await toggleFavorite(deal_id, value);
        const { message: msg } = result.data;
        
        if (result.status === 200) { 

            toggleAction();
            set_loading(false);

        } else {
            message.error(msg);
        }
    }

    const interestHandler = async (deal_id, obj) => {

        set_loading(true);

        const result = await updateDealInterest(deal_id, obj);
        const { message: msg } = result.data;
        
        if (result.status === 200) {

            toggleAction();
            set_loading(false);

        } else {
            message.error(msg);
        }
    }

    const toggleAction = () => {
        set_action(!action);
    }

    const openModifyDealDrawer = (value, deal, activeKey = null) => {

        set_drawer_visibility(value);
        set_deal(deal);

        if (activeKey !== drawer_active_key)
            set_drawer_active_key(activeKey);
    }

    const trashDeal = async deal_id => {

        set_loading(true);

        const result = await removeDeal(deal_id);
        const { message: msg } = result.data;
        
        if (result.status === 200) {
            
            message.success(msg);
            toggleAction();
            set_loading(false);

        } else {
            message.error(msg);
        }
    }

    const confirmTrash = (e, deal_id) => {
        trashDeal(deal_id);
    }

    const cancelTrash = e => {}

    const checkboxHandler = (e, value) => {
        
        if (e.target.checked) {
            localStorage.setItem('interest_level', value)
        } else {
            localStorage.removeItem('interest_level');
        }
        toggleAction();
    }

    const applyFilter = (e, type = null, value = null) => {

        if (!search_value || value === "") {
            localStorage.removeItem('search_value');
        } else {
            localStorage.setItem('search_value', search_value);
        }

        if (type) {
            localStorage.setItem('search_type', type);
        } else {
            localStorage.setItem('search_type', search_type);
        }
        toggleAction();
    }

    const columns = myDeals(
        favoriteHandler, interestHandler, interest_levels, openModifyDealDrawer, confirmTrash, cancelTrash,
        active_tab === "1" ? all : active_tab === "2" ? submitted : fav
    );
    const pageSize = 10;

    return (
        <div className="my-deals-layout">

            <div className="filters-list">

                <span>
                    <Input 
                        type="text"
                        placeholder="Enter search value"
                        defaultValue={search_value}
                        allowClear
                        style={{width: 200, marginRight: 10}}
                        onChange={e => { 
                            const value = e.target.value;
                            set_search_value(value);
                            if (value === "") {
                                applyFilter(null, null, value);
                            }
                        }}
                        onPressEnter={applyFilter}
                    />

                    <Select
                        defaultValue={search_type}
                        onChange={value => {
                            set_search_type(value);
                            applyFilter(null, value);
                        }}
                        placeholder="Select search type"
                    >
                        <Option value="company">Company</Option>
                        <Option value="sponsor">Sponsor</Option>
                        <Option value="description">Description</Option>
                        <Option value="all">All</Option>
                    </Select>

                    <Button
                        icon="search"
                        onClick={applyFilter}
                    >
                    </Button>
                </span>

                <Checkbox
                    defaultChecked={localStorage.getItem('interest_level') ? true : false}
                    onChange={e => checkboxHandler(e, 'all')}
                >
                    Show Passed
                </Checkbox>

            </div>

            <Tabs 
                type="card"
                defaultActiveKey={active_tab}
                onChange={activeTab => {
                    localStorage.setItem('my_deals_active_tab', activeTab);
                    set_active_tab(activeTab)
                }}
            >
                
                <TabPane tab={"All (" + all.length + ")"} key="1">
                    <Deal
                        columns={columns}
                        data={all}
                        pageSize={pageSize}
                        loading={loading}
                    />
                </TabPane>
                <TabPane tab={"Submitted (" + submitted.length + ")"} key="2">
                    <Deal 
                        columns={columns}
                        data={submitted}
                        pageSize={pageSize}
                        loading={loading}
                    />
                </TabPane>
                <TabPane tab={"Favorites (" + fav.length + ")"} key="3">
                    <Deal
                        columns={columns}
                        data={fav}
                        pageSize={pageSize}
                        loading={loading}
                    />
                </TabPane>
            </Tabs>

            { drawer_visibility && <ModifyDeal  
                    drawer_visibility={drawer_visibility}
                    set_drawer_visibility={set_drawer_visibility}
                    deal={deal}
                    interests={interest_levels}
                    sub_menu={sub_menu}
                    active_key={drawer_active_key}
                    toggle={toggleAction}
                    types={types}
                    instruments={instruments}
                    activities={activities}
                    industries={industries}
                    download={download}
                    removeActivityDocument={removeActivityDocument}
                />
            }
            
        </div>
    )
}

export default withDeal(MyDeals);