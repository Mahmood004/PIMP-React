import React from 'react';

const dealInterestHistory = [
    {
        title: 'Change Date',
        dataIndex: 'change_date'
    },
    {
        title: 'From Interest Level',
        dataIndex: 'from_interest',
        render: from_interest => (
            <React.Fragment>
                { from_interest ? from_interest.name : 'N/A' }
            </React.Fragment>
        )
    },
    {
        title: 'To Interest Level',
        dataIndex: 'to_interest',
        render: to_interest => (
            <React.Fragment>
                { to_interest ? to_interest.name : 'N/A' }
            </React.Fragment>
        )
    },
    {
        title: 'From Interest Reason',
        dataIndex: 'from_interest_reason',
        render: from_interest_reason => (
            <React.Fragment>
                { from_interest_reason ? from_interest_reason : 'N/A' }
            </React.Fragment>
        )
    }
];

export default dealInterestHistory;