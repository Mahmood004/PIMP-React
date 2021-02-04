import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Select, Input, Tabs, Button, message } from 'antd';
import { HomeContext } from '../../../containers/Home/Home';
import Deal from './Deal';
import { deal } from '../../../actions';
import withDeal from '../../../hoc/withDeal';
import dealFinder from '../../../utils/columns/dealFinder';
import Popup from '../Popup/Popup';

const { Option } = Select;
const { TabPane } = Tabs;
const { toggleFavorite, addToMyDeals, getDealFinderList } = deal;

const DealFinder = props => {

    const {  
        types, 
        categories, 
        sub_categories, 
        categoriesByType,
        subCategoriesByCategory,
    } = props;

    const [_new, set_new] = useState([]);
    const [viewed, set_viewed] = useState([]);
    const [fav, set_fav] = useState([]);
    const [query, set_query] = useState({});
    const [deal, set_deal] = useState(null);
    const [popup, set_popup] = useState(false);
    const [loading, set_loading] = useState(false);
    const [action, toggle_action] = useState(false);

    const [deal_category_id, set_deal_category_id] = useState('');
    const [deal_sub_category_id, set_deal_sub_category_id] = useState('');

    const { auth_user: { user_circles } } = useContext(HomeContext);

    useEffect(() => {

        const filterDeals = async (query) => {

            let params = '';
            const _new = [];
            const viewed = [];
            const fav = [];

            for (let q in query) {
                params = params + `&${q}=${query[q]}`
            }

            const result = await getDealFinderList(params);
            const { message: msg, deals } = result.data;

            if (result.status === 200) {

                deals.forEach(deal => {

                    let obj = {
                        key: deal.deal_id,
                        add_to_my_deals: deal,
                        rating: deal,
                        date_added: deal.created_at,
                        circle: deal.deal_circles,
                        description: deal.short_description,
                        expected_close_date: deal.expected_close_date,
                        investment_amount_sought: deal.investment_amount_sought,
                        minimum_investment: deal.minimum_investment,
                        view: deal
                    };

                    if (!deal.user_deal_interests.length) {
                        _new.push(obj);
                    }

                    viewed.push(obj);

                    if (deal.user_deal_interests.length && deal.user_deal_interests[0].favorite) {
                        fav.push(obj);
                    }
                });

                set_new(_new);
                set_viewed(viewed);
                set_fav(fav);

            } else {
                message.error(msg);
            }
            
        }

        filterDeals(query);

    }, [query, action]);

    const changeTypeHandler = type_id => {

        set_deal_category_id('');
        set_deal_sub_category_id('');

        set_query({ ...query, type: type_id, category: '', sub_category: '' });
        categoriesByType(type_id);
    }

    const changeCategoryHandler = category_id => {

        set_deal_category_id(category_id);
        set_deal_sub_category_id('');

        set_query({ ...query, category: category_id, sub_category: '' });
        subCategoriesByCategory(category_id)
    }

    const changeSubCategoryHandler = sub_category_id => {

        set_deal_sub_category_id(sub_category_id);
        set_query({ ...query, sub_category: sub_category_id});
        
    }

    const favoriteHandler = async (value, deal) => {

        set_loading(true);

        const { deal_id } = deal;

        const result = await toggleFavorite(deal_id, value);
        const { message: msg } = result.data;
        
        if (result.status === 200) {
            toggle_action(!action);
            set_loading(false);

        } else {
            message.error(msg);
        }
    }

    const closePopup = value => {
        set_popup(value);
    }

    const openPopup = (value, deal) => {
        set_deal(deal);
        set_popup(value);
    }

    const searchHandler = () => {

        console.log(Object.keys(query).length);

        if (Object.keys(query).length) {
            toggle_action(!action);
        }
    }

    const add = async deal => {

        const result = await addToMyDeals(deal.deal_id);
        const { message: msg } = result.data;

        if (result.status === 200) {
            message.success(msg);
        } else {
            message.error(msg);
        }
    }

    const columns = dealFinder(favoriteHandler, openPopup, add);
    const pageSize = 10;

    return (
        
        <React.Fragment>
            <Row>
                <Col span={4}>
                    <h4>By Date</h4>
                </Col>
                <Col span={5}>
                    <Select 
                        placeholder="Please Select" 
                        style={styles.dropdown} 
                        onChange={value => set_query({ ...query, date: value})}
                    >
                        <Option value="7">Last 7 days</Option>
                        <Option value="14">Last 14 days</Option>
                        <Option value="30">Last 30 days</Option>
                        <Option value="all">ALL</Option>
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col span={4}>
                    <h4>By Minimum/Maximum</h4>
                </Col>
                <Col span={5}>
                    <Select 
                        placeholder="Please Select" 
                        style={styles.dropdown} 
                        onChange={value => set_query({ ...query, frequency: value})}
                    >
                        <Option value="lt">&lt;</Option>
                        <Option value="gt">&gt;</Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <Input
                        placeholder="Enter amount" 
                        style={styles.input} 
                        onChange={e => set_query({ ...query, amount: e.target.value.replace(/,\s?/g, "")})} 
                    />
                </Col>
            </Row>
            <Row>
                <Col span={4}>
                    <h4>By Circle</h4>
                </Col>
                <Col span={5}>
                    <Select 
                        placeholder="Please Select" 
                        style={styles.dropdown} 
                        onChange={value => set_query({ ...query, circle: value})}
                    >
                        {
                            user_circles.map(({ circle }) => (
                                <Option 
                                    key={circle.circle_id} 
                                    value={circle.circle_id}
                                >
                                    {circle.name}
                                </Option>
                            ))
                        }
                        <Option value="all">ALL</Option>
                    </Select>
                </Col>
                
            </Row>
            <Row>
                <Col span={4}>
                    <h4>Deal Type</h4>
                </Col>
                <Col span={5}>
                    <Select 
                        placeholder="Please Select" 
                        style={styles.dropdown} 
                        onChange={value => changeTypeHandler(value)}
                    >
                        {
                            types.map(({ deal_type_id, description }) => (
                                <Option 
                                    key={deal_type_id} 
                                    value={deal_type_id}
                                >
                                    {description}
                                </Option>
                            ))
                        }
                    </Select>
                </Col>
                <Col span={5}>
                    <Select 
                        placeholder="Please Select" 
                        style={styles.dropdown} 
                        value={deal_category_id}
                        onChange={value => changeCategoryHandler(value)}
                    >
                        {
                            categories.map(({ deal_category_id, description }) => (
                                <Option 
                                    key={deal_category_id} 
                                    value={deal_category_id}
                                >
                                    {description}
                                </Option>
                            ))
                        }
                    </Select>
                </Col>
                <Col span={5}>
                    <Select 
                        placeholder="Please Select" 
                        style={styles.dropdown}
                        value={deal_sub_category_id}
                        onChange={value => changeSubCategoryHandler(value)}
                    >
                        {
                            sub_categories.map(({ deal_sub_category_id, description }) => (
                                <Option 
                                    key={deal_sub_category_id} 
                                    value={deal_sub_category_id}
                                >
                                    {description}
                                </Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>
            
            <Button
                type="primary"
                htmlType="button"
                onClick={() => searchHandler()}
                style={styles.button}
            >
                Search
            </Button>

            <Tabs type="card" style={styles.tabs}>
                <TabPane tab={"New (" + _new.length + ")"} key="1">
                    <Deal 
                        columns={columns}
                        data={_new}
                        pageSize={pageSize}
                        loading={loading}
                    />
                </TabPane>
                <TabPane tab={"Viewed (" + viewed.length + ")"} key="2">
                    <Deal 
                        columns={columns}
                        data={viewed}
                        pageSize={pageSize}
                        loading={loading}
                    />
                </TabPane>
                <TabPane tab={"Favorite (" + fav.length + ")"} key="3">
                    <Deal 
                        columns={columns}
                        data={fav}
                        pageSize={pageSize}
                        loading={loading}
                    />
                </TabPane>
            </Tabs>
            { popup && <Popup deal={deal} showPopup={closePopup} /> }
        </React.Fragment>       
    )
}

const styles = {
    dropdown: {
        width: 200
    },
    input: {
        width: 200
    },
    tabs: {
        marginTop: 40
    },
    button: {
        marginTop: 15
    }
}

export default withDeal(DealFinder);