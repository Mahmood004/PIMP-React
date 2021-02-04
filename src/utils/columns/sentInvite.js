import React from 'react';
import { Tag } from 'antd';

const sentInvite = [
    {
        title: 'Name',
        dataIndex: 'name',   
    },
    {
        title: 'Invitee',
        dataIndex: 'invitee'
    },
    {
        title: 'Invited Date',
        dataIndex: 'invited_date',  
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: date_completed => {
            let tag;
            if (date_completed) {
                tag = 'accepetd';
            } else {
                tag = 'pending';
            }

            return (
                <Tag color={date_completed ? 'green' : 'volcano' } key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            )
        }
            
    }
];

export default sentInvite;