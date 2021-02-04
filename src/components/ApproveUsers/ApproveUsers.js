import React, { Component } from 'react';
import { admin } from '../../actions';
import { Table, Tag, Button, message } from 'antd';

const { approveUser, getUnapprovedUsers } = admin;

class ApproveUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

        this.columns = [
            {
                title: 'First Name',
                dataIndex: 'first_name'
            },
            {
                title: 'Last Name',
                dataIndex: 'last_name'
            },
            {
                title: 'Email',
                dataIndex: 'email'
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
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={e => this.approveUser(e, record)}>Approve</Button>
                    </span>
                )
            }
        ];

    }

    approveUser = async (event, record) => {
        
        const res = await approveUser(record.key);
        const { message: msg } = res.data;

        if (res.status === 200) {

            const users = [...this.state.data];
            const approvedUserIndex = users.findIndex(user => user.key === record.key);
            users.splice(approvedUserIndex, 1);;

            this.setState({
                data: users
            });

        } else {
            message.error(msg);
        }
    }
    
    async componentDidMount() {

        const res = await getUnapprovedUsers();
        const { message: msg } = res.data;

        if (res.status === 200) {

            let obj = {};
            const users = [];

            res.data.users.forEach(user => {
                obj = {
                    key: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    status: user.approved
                };
                users.push(obj);
            });

            this.setState({
                data: users
            });
            
        } else {
            message.error(msg);
        }
    }
    
    render() {
        return (
            <>
                <h4>Approve Users</h4>
                <Table columns={this.columns} dataSource={this.state.data} />
            </>
        )
    }
}

export default ApproveUsers