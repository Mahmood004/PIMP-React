import React from 'react';
import { Button } from 'antd';

const dealActivity = download => {

    return [
        {
            title: 'Activity Date',
            dataIndex: 'activity_date'
        },
        {
            title: 'Activity Type',
            dataIndex: 'activity_type'
        },
        {
            title: 'Notes',
            dataIndex: 'notes'
        },
        {
            title: 'Document',
            dataIndex: 'document',
            render: deal_document => { 
                return deal_document ? (
                    <Button
                        type="link"
                        onClick={e => download(e, {
                            id: deal_document.deal_document_id,
                            name: deal_document.file_name,
                            type: deal_document.file_type
                        })}
                    >
                        {deal_document.file_name}
                    </Button>
                ) : 'N/A' 
            }       
        }
    ]
}

export default dealActivity;

