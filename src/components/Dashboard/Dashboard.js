import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Statistic, message, Table, Select, Form } from 'antd';
import LineChart from '../Charts/LineChart';
import PieChart from '../Charts/PieChart';
import HorizontalBarStackedChart from '../Charts/HorizontalBarStackedChart';
import ModifyDeal from '../Deals/ModifyDeal/ModifyDeal';
import dealNotify from '../../utils/columns/dealNotify';
import moment from 'moment';
import commaNumber from 'comma-number';
import withDeal from '../../hoc/withDeal';

import { circle, profile } from '../../actions';
import config from '../../config/config';

import { HomeContext } from '../../containers/Home/Home';
import styles from './Dashboard.module.css';

const { getUserCirclesSummary, download, removeActivityDocument } = circle;
const { onGridRowHover } = config;
const { filterUserDeals } = profile;
const { Option } = Select;

const Dashboard = props => {

    const { 
        form: { getFieldDecorator, setFieldsValue },
        types, instruments, activities, industries
    } = props;

    const [deals, set_deals] = useState([]);
    const [nopassed_ai, set_nopassed_ai] = useState(0);
    const [invested_ai, set_invested_ai] = useState(0);
    const [active_deals, set_active_deals] = useState(0);
    const [total_deals, set_total_deals] = useState(0);
    
    const [circle_stats, set_circle_stats] = useState(null);

    const [charts, set_charts] = useState(null);

    const [line, set_line] = useState(null);
    const [pie, set_pie] = useState(null);
    const [bar, set_bar] = useState(null);

    const [years, set_years] = useState([]);
    const [year, set_year] = useState('all');
    const [quarter, set_quarter] = useState('all');

    const [drawer_visibility, set_drawer_visibility] = useState(false);
    const [deal, set_deal] = useState(null);
    const [toggle, set_toggle] = useState(false);

    const { 
        auth_user: { 
            user_type: { 
                role 
            }, 
            approved 
        },
        interest_levels: interests,
        sub_menu
    } = useContext(HomeContext);

    useEffect(() => {

        const fetchCircleStats = async () => {

            const res = await getUserCirclesSummary();
            const { summary: circle_stats, message: msg } = res.data;

            if (res.status === 200) {
                set_circle_stats(circle_stats);

            } else {
                message.error(msg);
            }
        }
        fetchCircleStats();

    }, []);

    useEffect(() => {

        const fetchMyDealSubmittedStats = async filter => {

            const result = await filterUserDeals(filter, true);
            const { deals, message: _msg } = result.data;

            if (result.status === 200) {

                let _deals = [];
                let nopassed = 0;
                let invested = 0;
                let _active = 0;

                // Current date
                const currDate = moment().toISOString();
                // Date before 10 days
                const prevDate = moment(currDate).subtract(10, 'days').toISOString();
                // Date after 10 days
                const nextDate = moment(currDate).add(10, 'days').toISOString();

                deals.forEach(deal => {

                    const { deal_id, company_name, submit_date, expected_close_date, investment_amount_sought, minimum_investment, user_deal_interests: udi } = deal;
                    const recently_added = submit_date && moment(submit_date).isBetween(prevDate, currDate);
                    const closing_soon = expected_close_date && moment(expected_close_date).isBetween(currDate, nextDate);

                    if (recently_added || closing_soon) {

                        let obj = {};

                        obj.key = deal_id;
                        obj.deal = deal;
                        obj.company_name = company_name;
                        obj.submit_date = submit_date ? moment(submit_date).format('L') : '';
                        obj.expected_close_date = expected_close_date ? moment(expected_close_date).format('L HH:mm') : '';
                        obj.investment_amount_sought = commaNumber(investment_amount_sought);
                        obj.minimum_investment = commaNumber(minimum_investment);

                        if (recently_added) {
                            obj.notify = 'Recently Added';
                        } else {
                            obj.notify = 'Closing Soon';
                        }
                        _deals.push(obj);
                    }

                    if (udi.length && udi[0].interest_level.name !== "Pass") {

                        _active = _active + 1;
                        if (udi[0].anticipated_investment) {
                            nopassed = nopassed + +udi[0].anticipated_investment;
                        }
                    }

                    if (udi.length && udi[0].interest_level.name === "Invested") {
                        if (udi[0].anticipated_investment) {
                            invested = invested + +udi[0].anticipated_investment;
                        }
                    }
                });

                set_deals(_deals);
                set_nopassed_ai(nopassed);
                set_invested_ai(invested);
                set_active_deals(_active);

            } else {
                message.error(_msg);
            }
        }

        fetchMyDealSubmittedStats(null);

    }, [toggle]);

    useEffect(() => {

        const factory = (chk_1, chk_2, chk_3, chk_4) => {
            return {
                q1: chk_1 ? 1 : 0,
                q2: chk_2 ? 1 : 0,
                q3: chk_3 ? 1 : 0,
                q4: chk_4 ? 1 : 0
            }
        }

        const quarters = (qtr, chk_1, chk_2, chk_3, chk_4, bar = false, desc = null) => {

            let q;

            if (chk_1) q = 'q1';
            if (chk_2) q = 'q2';
            if (chk_3) q = 'q3';
            if (chk_4) q = 'q4';

            if (!bar) {
                qtr[q] += 1;
            } else {

                qtr[q].gross += 1;
                if (qtr[q].sub_categories[desc] !== undefined) {
                    qtr[q].sub_categories[desc] += 1;
                } else {
                    qtr[q].sub_categories = {
                        ...qtr[q].sub_categories,
                        [desc]: 1
                    }
                }
            }     
        }

        const fetchMyDealAllStats = async filter => {

            const result = await filterUserDeals(filter, true);
            const { deals, message: _msg } = result.data;

            if (result.status === 200) {

                const obj = {};
                let year;
                let month;                
                let _q1_check;
                let _q2_check;
                let _q3_check;
                let _q4_check;

                deals.forEach(({ submit_date, user_deal_interests: udi, deal_category: { description }, deal_sub_category: { description: desc } }) => {

                    if (submit_date) {

                        // Retrieving deal's year and month
                        year = submit_date.split('-')[0];
                        month = submit_date.split('-')[1];
                        
                        // Checking deal falls in which quarter
                        _q1_check = month > 0 && month < 4;
                        _q2_check = month > 3 && month < 7;
                        _q3_check = month > 6 && month < 10;
                        _q4_check = month > 9 && month <= 12;

                        // Demonstrating line graph object yearly
                        if (obj[year] !== undefined) {
                            obj[year].line.gross += 1;
                        } else {
                            obj[year] = {
                                line: {
                                    gross: 1
                                },
                                pie: {},
                                bar: {}
                            }
                        }

                        // Demonstrating line graph object quarterly
                        if (obj[year].line.qtr !== undefined) {

                            const _qtr = obj[year].line.qtr;
                            quarters(_qtr, _q1_check, _q2_check, _q3_check, _q4_check);

                        } else {
                            obj[year].line.qtr = factory(_q1_check, _q2_check, _q3_check, _q4_check);
                        }
                    }

                    if (udi.length && udi[0].interest_level) {

                        const _interest = udi[0].interest_level.name;

                        if (_interest === "Watch" || _interest === "Follow Up" || _interest === "Invested") {
                            
                            // Demonstrating pie graph object yearly
                            if (obj[year].pie[_interest] !== undefined) {
                                obj[year].pie[_interest].gross += 1;
                            } else {
                                obj[year].pie[_interest] = {
                                    gross: 1
                                }
                            }

                            // Demonstrating pie graph object quarterly
                            if (obj[year].pie[_interest].qtr !== undefined) {

                                const _qtr = obj[year].pie[_interest].qtr;
                                quarters(_qtr, _q1_check, _q2_check, _q3_check, _q4_check);

                            } else {
                                obj[year].pie[_interest].qtr = factory(_q1_check, _q2_check, _q3_check, _q4_check);
                            }
                        }
                    }

                    // Demonstrating bar graph object yearly
                    if (obj[year].bar[description] !== undefined) {

                        const _ctg = obj[year].bar[description];
                        _ctg.gross += 1;

                        if (_ctg.sub_categories[desc] !== undefined) {
                            _ctg.sub_categories[desc] += 1;
                        } else {
                            _ctg.sub_categories = {
                                ..._ctg.sub_categories,
                                [desc]: 1
                            }
                        }

                    } else {
                        obj[year].bar[description] = {
                            gross: 1,
                            sub_categories: {
                                [desc]: 1
                            }
                        };
                    }

                    // Demonstrating bar graph object quarterly
                    if (obj[year].bar[description].qtr !== undefined) {

                        const _qtr = obj[year].bar[description].qtr;
                        quarters(_qtr, _q1_check, _q2_check, _q3_check, _q4_check, true, desc);

                    } else {
                        obj[year].bar[description].qtr = {
                            q1: { gross: _q1_check ? 1 : 0, sub_categories: _q1_check ? { [desc]: 1 } : {} },
                            q2: { gross: _q2_check ? 1 : 0, sub_categories: _q2_check ? { [desc]: 1 } : {} },
                            q3: { gross: _q3_check ? 1 : 0, sub_categories: _q3_check ? { [desc]: 1 } : {} },
                            q4: { gross: _q4_check ? 1 : 0, sub_categories: _q4_check ? { [desc]: 1 } : {} }
                        };
                    }

                });

                // console.log('obj', obj);
                set_total_deals(deals.length);
                set_charts(obj);
                
            } else {
                message.error(_msg);
            }
        }

        fetchMyDealAllStats('interest_level=all&all');

    }, []);

    useEffect(() => {

        if (charts) {

            const line = {};
            const pie = {};
            const bar = {};
            let years;

            if (year === "all") {

                years = Object.keys(charts);
                set_quarter('all');
                setFieldsValue({quarter: 'all'});

            } else {
                years = [year];
            }
                    
            for (let x in years) {

                if (year === "all" && quarter === "all") {

                    line[years[x]] = charts[years[x]].line.gross;

                } else if (year !== "all" && quarter === "all") {

                    line['q1'] = charts[years[x]].line.qtr['q1'];
                    line['q2'] = charts[years[x]].line.qtr['q2'];
                    line['q3'] = charts[years[x]].line.qtr['q3'];
                    line['q4'] = charts[years[x]].line.qtr['q4'];

                } else {
                    line[quarter] = charts[years[x]].line.qtr[quarter];
                }
            }

            
            for (let x in years) {

                const interests = charts[years[x]].pie;
                for (let key in interests) {

                    let count;
                    if (quarter === "all") {
                        count = interests[key].gross
                    } else {
                        count = interests[key].qtr[quarter]
                    }

                    if (pie[key] !== undefined) {
                        pie[key] += count; 
                    } else {
                        pie[key] = count;
                    }
                }
            }
            
            for (let x in years) {

                const categories = charts[years[x]].bar;
                for (let key in categories) {

                    let sub_categories = {};

                    if (quarter === "all") {
                        sub_categories = { ...categories[key].sub_categories }
                    } else {
                        sub_categories = { ...categories[key].qtr[quarter].sub_categories };
                    }

                    if (bar[key] !== undefined) {

                        const existing = { ...bar[key].sub_categories };
                        const incoming = { ...sub_categories };
                        for (let x in incoming) {
                            if (existing[x]) {
                                existing[x] += incoming[x];
                            } else {
                                existing[x] = incoming[x]
                            }
                        }

                        bar[key].sub_categories = existing;

                    } else {
                        bar[key] = {
                            sub_categories
                        };
                    }
                }
            }

            set_years(Object.keys(charts));
            set_line(line);
            set_pie(pie);
            set_bar(bar);
        }

    }, [charts, year, quarter, setFieldsValue]);

    const trigger_action = () => {
        set_toggle(!toggle);
    }

    let pending;
    
    if (role !== 'Admin') {
        pending = !approved ? true : false;
    }

    return (
        <React.Fragment>

            { drawer_visibility && <ModifyDeal  
                    drawer_visibility={drawer_visibility}
                    set_drawer_visibility={set_drawer_visibility}
                    deal={deal}
                    interests={interests}
                    sub_menu={sub_menu}
                    toggle={trigger_action}
                    types={types}
                    instruments={instruments}
                    activities={activities}
                    industries={industries}
                    download={download}
                    removeActivityDocument={removeActivityDocument}
                />
            }

            { !pending && (
                <Card title="My Stats" style={{marginTop: 25}} type="inner">

                    <p className={styles.stats_title}>
                        Deals
                    </p>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Row gutter={16}>
                                <Col span={14}>
                                    <Card>
                                        <Statistic 
                                            title="Anticipated Investment"
                                            value={`$ ${commaNumber(nopassed_ai)}`}
                                        />
                                    </Card>
                                </Col>
                                <Col span={10}>
                                    <Card>
                                        <Statistic
                                            title="Active Deals"
                                            value={active_deals}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={14}>
                                    <Card>
                                        <Statistic 
                                            title="Invested"
                                            value={`$ ${invested_ai}`}
                                        />
                                    </Card>
                                </Col>
                                <Col span={10}>
                                    <Card>
                                        <Statistic
                                            title="Total Deals"
                                            value={total_deals}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        { total_deals > 0 && (
                            <Col span={16}>
                                <Table 
                                    dataSource={deals} 
                                    columns={dealNotify} 
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: event => {
                                                set_deal(record.deal);
                                                set_drawer_visibility(true);
                                            },
                                            ...onGridRowHover()
                                        }
                                    }}    
                                />
                            </Col>
                        )}
                    </Row>

                    { total_deals > 0 && (
                        <React.Fragment>
                            <Row>
                                <Col span={4}>
                                    <Form.Item
                                        label="Year"
                                        labelAlign="left"
                                        labelCol={{span: 8}}
                                        wrapperCol={{span: 16}}
                                    >
                                        { getFieldDecorator('year', {
                                            initialValue: year
                                        })(
                                            <Select 
                                                onChange={value => set_year(value)}
                                                style={{width: 100}}
                                            >
                                                <Option value="all">All</Option>
                                                { years.map((year, index) => (
                                                    <Option key={index} value={year}>{year}</Option>
                                                )) }
                                            </Select>
                                        ) }
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        label="Quarter"
                                        labelAlign="left"
                                        labelCol={{span: 8}}
                                        wrapperCol={{span: 16}}
                                    >
                                        { getFieldDecorator('quarter', {
                                            initialValue: quarter
                                        })(
                                            <Select 
                                                onChange={value => set_quarter(value)}
                                                style={{width: 100}}
                                            >
                                                <Option value="all">All</Option>
                                                
                                                { year !== 'all' && ['q1', 'q2', 'q3', 'q4'].map((q, i) => (
                                                    <Option key={i} value={q}>{q}</Option>
                                                )) }
                                                    
                                            </Select>
                                        ) }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Row>
                                        <Col span={24}>
                                            <h4>Deal Count By Year &amp; Quarter</h4>
                                        </Col>
                                        <Col span={24}>
                                            <LineChart
                                                data={line}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}> 
                                    <Row>
                                        <Col span={24}>
                                            <h4>Deals By Status (Interest Level)</h4>
                                        </Col>
                                        <Col span={24}>
                                            <PieChart
                                                data={pie}    
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={24}>
                                            <h4>Deals Count By Category</h4>
                                        </Col>
                                        <Col span={24}>
                                            <HorizontalBarStackedChart 
                                                data={bar}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </React.Fragment>
                    )}
                            
                    <p className={styles.stats_title}>
                        Circles
                    </p>

                    <div className={styles.stats_box}>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Card>
                                    <Statistic 
                                        title="Total"
                                        value={circle_stats ? circle_stats.circles : 0}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card>
                                    <Statistic 
                                        title="People"
                                        value={circle_stats ? circle_stats.people : 0}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card>
                                    <Statistic
                                        title="Invited"
                                        value={circle_stats ? circle_stats.invited : 0}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card>
                                    <Statistic
                                        title="Accepted"
                                        value={circle_stats ? circle_stats.accepted : 0}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card>
                                    <Statistic 
                                        title="Pending"
                                        value={circle_stats ? circle_stats.pending : 0}
                                    />
                                </Card>
                            </Col>
                            
                        </Row>
                    </div>

                </Card>
            )}

        </React.Fragment>
    )
}

export default Form.create({ name: 'deals_filter_form' })(withDeal(Dashboard));