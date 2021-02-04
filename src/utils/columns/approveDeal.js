import React from 'react';
import { Tag, Button } from 'antd';

const approveDeal = (view, modify, approve) => {

    return [
        {
            title: 'Short Code',
            dataIndex: 'shortcode'
        },
        {
            title: 'Summary',
            dataIndex: 'summary'
        },
        {
            title: 'Short Description',
            dataIndex: 'short_description'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => {
                let tag;
                if (status)
                    tag = 'approved';
                else
                    tag = 'unapproved';
                
                return (
                    <Tag color={status ? 'green' : 'volcano'} key={status}>
                        {tag.toUpperCase()}
                    </Tag>
                )
            }              
        },
        {
            title: 'View',
            dataIndex: 'view',
            render: record => {
                
                return (
                    <Button icon="eye" onClick={() => view(true, record)}></Button>
                )
            } 
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            render: record => {
                
                return (
                    !record.read_only ? <Button icon="edit" onClick={() => modify(true, record)}></Button> : 'N/A'
                )
            } 
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={e => approve(e, record)}>Approve</Button>
                </span>
            )
        }
    ]
}

export default approveDeal;