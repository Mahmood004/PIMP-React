import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Button, Table, Spin, Modal, message } from 'antd';
import dateFormat from 'dateformat';
import { circle } from '../../actions';
import { HomeContext } from '../../containers/Home/Home';
import CircleInvite from '../CircleInvite/CircleInvite';
import sentInviteColumns from '../../utils/columns/sentInvite';

const { acceptCircleInvite, getCircleMembers } = circle;
const { TabPane } = Tabs;

const Circles = () => {

    const receivedColumns = [
        {
            title: 'Name',
            dataIndex: 'name',   
        },
        {
            title: 'Invited Date',
            dataIndex: 'invited_date',  
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: user_invite_id => (
                <Button type="primary" onClick={e => acceptInvite(e, user_invite_id)}>Accept</Button>
            )
        }
    ];

    const joinedColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Joined Date',
            dataIndex: 'joined_date'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: circle_id  => (
                <Button type="primary" onClick={() => openModal(circle_id)}>View Members</Button>
            )
        }
    ]
    
    const modalColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        }
    ];

    const [received, set_received] = useState([]);
    const [sent, set_sent] = useState([]);
    const [joined, set_joined] = useState([]);
    const [members, set_members] = useState([]);
    const [visible, set_visible] = useState(false);
    const [loading, set_loading] = useState(false);
    
    const { auth_user: { invitations_received, invitations_sent, user_circles }, modified } = useContext(HomeContext);
    
    useEffect(() => {

        const mapCircles = () => {

            let obj = {};
            const joined = [];
            const received = [];
            const sent = [];

            invitations_received.forEach(invitation => {

                if (!invitation.date_accepted) {

                    obj = {
                        key: invitation.user_invite_id,
                        name: invitation.circle.name,
                        invited_date: dateFormat(invitation.date_added, "longDate"),
                        action: invitation.user_invite_id
                    };

                    received.push(obj);

                }
            });

            invitations_sent.forEach(invitation => {

                obj = {
                    key: invitation.user_invite_id,
                    name: invitation.circle.name,
                    invitee: invitation.first_name + " " + invitation.last_name,
                    invited_date: dateFormat(invitation.date_added, "longDate"),
                    status: invitation.date_accepted
                };

                sent.push(obj);
            });

            user_circles.forEach(user_circle => {

                obj = {
                    key: user_circle.user_circle_id,
                    name: user_circle.circle.name,
                    joined_date: dateFormat(user_circle.created_at, "longDate"),
                    action: user_circle.circle.circle_id
                };

                joined.push(obj);
            });

            set_received(received);
            set_sent(sent);
            set_joined(joined);
        }

        mapCircles();
        
    }, [invitations_received, invitations_sent, user_circles]);

    const acceptInvite = async (e, user_invite_id) => {

        const result = await acceptCircleInvite(user_invite_id);
        const { message: msg } = result.data;

        if (result.status === 200) {
            modified();
        } else {
            message.error(msg);
        }
    }

    const openModal = async circle_id => {

        set_members([]);
        set_visible(true);
        set_loading(true);

        const result = await getCircleMembers(circle_id);
        const { members, message: msg } = result.data;

        if (result.status === 200) {

            const data = [];

            members.forEach(member => {

                const obj = {
                    key: member.user_circle_id,
                    name: member.User.first_name + " " + member.User.last_name,
                    email: member.User.email
                };

                data.push(obj);
            })

            set_members(data);

        } else {
            message.error(msg);
        }

        set_loading(false);
    }

    const closeModal = () => {
        set_visible(false);
    }

    return (
        <React.Fragment>
            <Tabs type="card" defaultActiveKey={"invitations"}>
                <TabPane tab="Invitations (Received)" key="invitations_received">
                    <Table style={styles.table} columns={receivedColumns} dataSource={received} />
                </TabPane>
                <TabPane tab="Invitations (Sent)" key="invitations_sent">
                    <Table style={styles.table} columns={sentInviteColumns} dataSource={sent} />
                </TabPane>
                <TabPane tab="Joined" key="joined">
                    <Table style={styles.table} columns={joinedColumns} dataSource={joined} />
                </TabPane>
            </Tabs>
            
            <Modal
                title="Circle Members"
                onOk={closeModal}
                onCancel={closeModal}
                visible={visible}
            >
                {
                    members.length ? (
                        <Table 
                            columns={modalColumns} 
                            dataSource={members} 
                            pagination={false} 
                            scroll={{y: 250}}
                        />
                    ) : (
                        loading ? <Spin tip="Loading..." /> : <span>No members are available in this cirlce!</span>
                    )
                }
            </Modal>

            <div style={{marginTop: 30}}>
                <CircleInvite 
                    layout="inline"
                />
            </div>
        </React.Fragment>
    )
}

const styles = {
    table: {
        width: 600
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    }
}

export default Circles;