import React from 'react';
import moment from 'moment';
import { Rate, Tag, Button } from 'antd';
import commaNumber from 'comma-number';

const dealFinder = (favorite, open, add) => {

    return [
        {
            title: 'Add to My Deals',
            dataIndex: 'add_to_my_deals',
            render: record => (
                <Button icon="plus-circle" onClick={() => add(record)}></Button>
            )
        }, 
        {
            title: 'Rating',
            dataIndex: 'rating',
            render: record => (
                <Rate 
                    count={1} 
                    value={record.user_deal_interests.length && record.user_deal_interests[0].favorite ? 1 : 0 } 
                    onChange={value => favorite(value, record)} 
                />
            )
        },
        {
            title: 'Date Added',
            dataIndex: 'date_added',
            sorter: (a, b) => new Date(a.date_added) - new Date(b.date_added),
            sortDirections: ['ascend', 'descend'],
            render: created_at => (
                <span>
                    {moment(created_at).format('MMMM Do, YYYY')}
                </span>
            )
        },
        {
            title: 'Circle',
            dataIndex: 'circle',
            render: deal_circles => (
                <React.Fragment>
                    { deal_circles.map(deal_circle => (
                        <Tag key={deal_circle.deal_circle_id}>{deal_circle.circle.name}</Tag>
                    ))}
                </React.Fragment>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Expected Close Date',
            dataIndex: 'expected_close_date',
            sorter: (a, b) => new Date(a.expected_close_date) - new Date(b.expected_close_date),
            sortDirections: ['ascend', 'descend'],
            render: expected_close_date => (
                <React.Fragment>
                    { expected_close_date ? (
                        <span>{moment(expected_close_date).format('MMMM Do, YYYY')}
                        </span>
                    ): 'Nill' }
                </React.Fragment>
            )
        },
        {
            title: 'Investment Amount Sought',
            dataIndex: 'investment_amount_sought',
            sorter: (a, b) => parseInt(a.investment_amount_sought) - parseInt(b.investment_amount_sought),
            sortDirections: ['ascend', 'descend'],
            render: investment_amount_sought => (
                <span>{commaNumber(investment_amount_sought)}</span>
            )
        },
        {
            title: 'Minimum Investment',
            dataIndex: 'minimum_investment',
            sorter: (a, b) => parseInt(a.minimum_investment) - parseInt(b.minimum_investment),
            sortDirections: ['ascend', 'descend'],
            render: minimum_investment => (
                <span>{commaNumber(minimum_investment)}</span>
            )
        },
        {
            title: 'View',
            dataIndex: 'view',
            render: record => {
                
                return (
                    <Button icon="eye" onClick={() => open(true, record)}></Button>
                )
            } 
        }
    ]
}

export default dealFinder;