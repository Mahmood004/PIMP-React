import React from 'react';
import moment from 'moment';
import commaNumber from 'comma-number';
import { CSVLink } from 'react-csv';
import { Rate, Button, Icon, Popconfirm, Select, Input, Tooltip } from 'antd';
import config from '../../config/config';

const { Option } = Select;
const { generateCSVData, onGridRowHover } = config;

const myDeals = (favorite, interest, interests, modify, confirm, cancel, deals) => {

    const csv_data = generateCSVData(deals);

    const cellClickHandler = (record, rowIndex) => {

        return {
            onClick: event => { 
                modify(true, record.deal_info);
            },
            ...onGridRowHover()
        }
    }

    return [
        {
            title: 'Rating',
            dataIndex: 'rating',
            render: record => (
                <Rate 
                    count={1} 
                    value={record.user_deal_interests[0] && record.user_deal_interests[0].favorite ? 1 : 0 } 
                    onChange={value => favorite(value, record.deal_id)} 
                />
            )
        },
        {
            title: 'Deal Info',
            dataIndex: 'deal_info',
            width: 180,
            render: ({ company_name, sponsor_name, short_description }) => (
                <React.Fragment>
                    { (company_name || sponsor_name) && <p>{`${company_name ? company_name : ''}${ (company_name && sponsor_name) ? ' - ' + sponsor_name : sponsor_name ? sponsor_name : ''}`}</p> }
                    { short_description && <p>{short_description}</p> }
                </React.Fragment>
            ),
            onCell: cellClickHandler
        },
        {
            title: 'Interest',
            dataIndex: 'interest',
            filters: interests.map(({name}) => {
                return { 
                    text: name, 
                    value: name
                }
            }),
            onFilter: (value, record) => {
                if (record.interest.user_deal_interests.length && record.interest.user_deal_interests[0].interest_level_id) {
                    return record.interest.user_deal_interests[0].interest_level.name.includes(value);
                }
            },
            render: ({ deal_id, user_deal_interests }) => {

                const user_deal_interest = user_deal_interests[0];

                return (
                    <Select
                        style={{width: 120}}
                        value={user_deal_interest ? user_deal_interest.interest_level_id ? user_deal_interest.interest_level.name : null : null}
                        onChange={value => interest(deal_id, { interest_level_id: value })}
                    >
                        {
                            interests.map(({interest_level_id, name}) => (
                                <Option key={interest_level_id} value={interest_level_id}>{name}</Option>
                            ))
                        }
                    </Select>
                )
            }
        },
        {
            title: 'Expected Close',
            dataIndex: 'expected_close',
            sorter: (a, b) => new Date(a.expected_close) - new Date(b.expected_close),
            sortDirections: ['ascend', 'descend'],
            render: expected_close => (
                <span>{moment(expected_close).format('MMMM Do, YYYY')}</span>
            ),
            onCell: cellClickHandler
        },
        {
            title: 'Minimum',
            dataIndex: 'minimum',
            sorter: (a, b) => parseInt(a.minimum) - parseInt(b.minimum),
            sortDirections: ['ascend', 'descend'],
            render: minimum => (
                <span>{commaNumber(minimum)}</span>
            ),
            onCell: cellClickHandler
        },
        {
            title: 'Total Raise',
            dataIndex: 'total_raise',
            sorter: (a, b) => parseInt(a.total_raise) - parseInt(b.total_raise),
            sortDirections: ['ascend', 'descend'],
            render: total_raise => (
                <span>{commaNumber(total_raise)}</span>
            ),
            onCell: cellClickHandler
        },
        {
            title: 'Ant. Investment',
            dataIndex: 'anticipated_investment',
            width: 190,
            sorter: (a, b) => {

                const udi_1 = a.anticipated_investment.user_deal_interests[0];
                const udi_2 = b.anticipated_investment.user_deal_interests[0];
                if (!udi_1 || !udi_2) return;

                const { anticipated_investment: current } = udi_1;
                const { anticipated_investment: next } = udi_2;
                return parseInt(current) - parseInt(next);
            },
            sortDirections: ['ascend', 'descend'],
            render: ({ deal_id, user_deal_interests: udi }) => (

                <Input 
                    addonBefore="$"
                    addonAfter=".00"
                    defaultValue={udi[0] ? udi[0].anticipated_investment : null}
                    onBlur={e =>  {
                        if (e.target.value) {
                            if (!udi[0]) {
                                return interest(deal_id, { anticipated_investment: e.target.value });
                            }
                            if (udi[0] && e.target.value !== udi[0].anticipated_investment) {
                                return interest(deal_id, { anticipated_investment: e.target.value });
                            }
                        }
                    }}
                />
            )
        },
        {
            title: 'My Proj. IRR',
            dataIndex: 'projected_irr',
            width: 85,
            sorter: (a, b) => {

                const udi_1 = a.projected_irr.user_deal_interests[0];
                const udi_2 = b.projected_irr.user_deal_interests[0];
                if (!udi_1 || !udi_2) return;
                
                const { projected_irr: current } = udi_1;
                const { projected_irr: next } = udi_2;
                return parseInt(current) - parseInt(next);
            },
            sortDirections: ['ascend', 'descend'],
            render: ({ deal_id, user_deal_interests: udi }) => (

                <Input 
                    defaultValue={udi[0] ? udi[0].projected_irr : null} 
                    onBlur={e =>  {
                        if (e.target.value) {
                            if (!udi[0]) {
                                return interest(deal_id, { projected_irr: e.target.value })
                            }
                            if (udi[0] && e.target.value !== udi[0].projected_irr) {
                                return interest(deal_id, { projected_irr: e.target.value })
                            }
                        }
                    }}
                />
            )
        },
        {
            title: 'Last Activity',
            dataIndex: 'last_activity',
            sorter: (a, b) => {
                if (!a.last_activity || !b.last_activity) return;
                return new Date(a.last_activity) - new Date(b.last_activity);
            },
            sortDirections: ['ascend', 'descend'],
            render: user_deal_activity => (
                <span>{user_deal_activity ? moment(user_deal_activity.activity_date).format('MMMM Do, YYYY') : 'N/A'}</span>
            ),
            onCell: cellClickHandler
        },
        {
            title: (
                <CSVLink
                    data={csv_data}
                    filename={'My Deals.csv'}
                >
                    <Tooltip
                        placement="top"
                        title="Export CSV"
                    >
                        <Button
                            icon="export"
                        ></Button>
                    </Tooltip>
                </CSVLink>
            ),
            align: 'center',
            dataIndex: 'actions',
            render: record => {
                
                return (
                    <div style={{display: 'flex'}}>

                        <Tooltip 
                            placement="top" 
                            title="Edit"
                        >
                            <Button 
                                icon="edit" 
                                onClick={() => modify(true, record, '4')}
                            ></Button>
                        </Tooltip>

                        <Tooltip 
                            placement="top" 
                            title="Activity"
                        >
                            <Button 
                                icon="history" 
                                onClick={() => modify(true, record, '5')}
                            ></Button>
                        </Tooltip>
                        

                        { !record.read_only && (
                            <Popconfirm 
                                title="Are you sure delete this deal?"
                                placement="topRight"
                                icon={<Icon 
                                    type="question-circle-o" 
                                    style={{ color: 'red' }} 
                                />}
                                onConfirm={e => confirm(e, record.deal_id)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"    
                            >
                                <Tooltip 
                                    placement="top" 
                                    title="Delete"
                                >
                                    <Button 
                                        icon="delete"
                                    ></Button>
                                </Tooltip> 
                            </Popconfirm>
                        )}

                    </div>
                )
            } 
        }
    ]
} 

export default myDeals;