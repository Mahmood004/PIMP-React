import React from 'react';
import { Icon } from 'antd';

const inbox = [
    {
        title: 'Sender',
        dataIndex: 'sender'
    },
    {
        title: 'Subject',
        dataIndex: 'subject'
    },
    {
        title: 'Date',
        dataIndex: 'date'
    },
    {
        title: 'Attachment',
        dataIndex: 'attachment',
        render: file => (
            file && file.length ? <Icon type="paper-clip" /> : 'N/A'
        )
    },
    {
        title: 'Preview',
        dataIndex: 'preview',
        render: originalMessageId => (                
            <a 
                href={`https://mail.google.com/mail/u/0/#search/rfc822msgid:${originalMessageId}`} 
                target="_blank"
                rel="noopener noreferrer"
            >
                <Icon type="eye" />
            </a>

        )
    }
];

export default inbox;