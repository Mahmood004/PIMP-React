import React, { useContext } from 'react';
import { Menu, Alert } from 'antd';
import { HomeContext } from '../../containers/Home/Home';
import moment from 'moment';

const BellDropdownMenu = props => {

    const { 
        auth_user: {
            user_type: {
                role
            },
            approved, 
            profile, 
            invitations_received, 
            approved_date
        },
        changed
     } = useContext(HomeContext);

    let pending, invitation, previous_week, approval_date, is_within_a_week;
    
    if (role !== 'Admin') {

        pending = !approved ? true : false;

        if (invitations_received.length) {
            invitation = invitations_received.find(user_invite => user_invite.date_accepted === null);
        }

        if (approved_date) {
            
            previous_week = moment().subtract(1, 'week').toISOString();
            approval_date = approved_date;
            is_within_a_week = moment(approval_date).isSameOrAfter(previous_week);
            
        }
    }

    return (  
        <Menu>
            { pending && (
                <Menu.Item
                    className="notification"
                >
                    <Alert 
                        style={{margin: '15px auto'}}
                        message="Warning"
                        description="Your application is currently pending!"
                        type="warning"
                        showIcon
                    />
                </Menu.Item>
            )}

            { is_within_a_week && (
                <Menu.Item
                    className="notification"
                >
                    <Alert 
                        style={{margin: '15px auto'}}
                        message="Success"
                        description="Your application has been approved!"
                        type="success"
                        showIcon
                    />
                </Menu.Item>
            )}

            { !pending && invitation && (

                <Menu.Item
                    className="notification"
                >
                    <div
                        onClick={() => changed({ key: 'circles', keyPath: ['circles', 'myBoardRoom']})}
                    >   
                        <Alert 
                            style={{margin: '15px auto'}}
                            message="Informational Notes"
                            description="You have pending invitation(s)!"
                            type="info"
                            showIcon
                        />
                    </div>
                </Menu.Item>
            )}

            { ((!profile && !pending) || (!pending && profile &&  Object.getOwnPropertyNames(JSON.parse(profile)).length === 0)) && (
                <Menu.Item
                    className="notification"
                >
                    <div 
                        onClick={() => changed({ key: 'profile', keyPath: ['profile', 'myBoardRoom']})}
                    >
                        <Alert 
                            style={{margin: '15px auto'}}
                            message="Next Step"
                            description="You have to set your profile!"
                            type="warning"
                            showIcon
                        />
                    </div>
                </Menu.Item>
            )}
        </Menu>  
    )
}

export default BellDropdownMenu;