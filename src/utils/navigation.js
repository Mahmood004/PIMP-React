import React from 'react';

import Dashboard from '../components/Dashboard/Dashboard';
import AddDeal from '../components/Deals/AddDeal/AddDeal';
import DealFinder from '../components/Deals/DealFinder/DealFinder';
import MyDeals from '../components/Deals/MyDeals/MyDeals';
import DealSettings from '../components/Deals/DealSettings';
import Circles from '../components/Circles/Circles';
import Profile from '../components/Profile/Profile';
import Settings from '../components/Settings/Settings';
import ApproveUsers from '../components/ApproveUsers/ApproveUsers';
import ApproveDeals from '../components/Deals/ApproveDeals';
import NewDealInbox from '../components/Deals/NewDealInbox/NewDealInbox';

let navigation = accessible_by => {

    return [
        {
            id: '1',
            title: 'Dashboard',
            key: 'dashboard',
            icon_type: 'dashboard',
            accessible_by: 'all',
            component: <Dashboard />
        },
        {
            id: '2',
            title: 'Add a Deal',
            key: 'addDeal',
            icon_type: 'file-add',
            accessible_by: accessible_by,
            component: <AddDeal />
        },
        {
            id: '3',
            title: 'Send Circle Invitation',
            key: 'circleInvitation',
            icon_type: 'file-add',
            accessible_by: accessible_by,
            component: <></>
        },
        {
            id: '4',
            title: 'Deal Room',
            key: 'dealRoom',
            icon_type: 'folder-open',
            accessible_by: accessible_by,
            menu_items: [
                {
                    id: '1',
                    title: 'Deal Finder',
                    key: 'dealFinder',
                    icon_type: 'file-search',
                    component: <DealFinder /> 
                },
                {
                    id: '2',
                    title: 'My Deals',
                    key: 'myDeals',
                    icon_type: 'container',
                    component: <MyDeals /> 
                },
                {
                    id: '3',
                    title: 'Deal Settings',
                    key: 'dealSettings',
                    icon_type: 'setting',
                    component: <DealSettings /> 
                }
            ]
        },
        {
            id: '5',
            title: 'My Boardroom',
            key: 'myBoardRoom',
            icon_type: 'home',
            accessible_by: accessible_by,
            menu_items: [
                {
                    id: '1',
                    title: 'Circles',
                    key: 'circles',
                    icon_type: 'team',
                    component: <Circles />
                },
                {
                    id: '2',
                    title: 'Profile',
                    key: 'profile',
                    icon_type: 'profile',
                    component: <Profile />
                },
                {
                    id: '3',
                    title: 'Settings',
                    key: 'settings',
                    icon_type: 'setting',
                    component: <Settings />
                }
            ]
        },
        {
            id: '6',
            title: 'Site Admin',
            key: 'siteAdmin',
            icon_type: 'audit',
            accessible_by: 'Admin',
            menu_items: [
                {
                    id: '1',
                    title: 'Approve Users',
                    key: 'approveUsers',
                    icon_type: 'team',
                    component: <ApproveUsers /> 
                },
                {
                    id: '2',
                    title: 'Approve Deals',
                    key: 'approveDeals',
                    icon_type: 'file-done',
                    component: <ApproveDeals /> 
                },
                {
                    id: '3',
                    title: 'New Deal Inbox',
                    key: 'newDealInbox',
                    icon_type: 'inbox',
                    component: <NewDealInbox />
                }
            ]
        }
    ];
}

export default navigation;