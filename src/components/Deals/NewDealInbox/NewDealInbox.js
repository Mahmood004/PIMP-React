import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import DealCreationViaMessage from './DealCreationViaMessage';
import { admin } from '../../../actions';
import inboxColumns from '../../../utils/columns/inbox';

const { getGmailMessages } = admin;

const NewDealInbox = props => {

    const [emails, set_emails] = useState([]);
    const [msg, set_msg] = useState({});
    const [refresh, set_refresh] = useState(false);

    useEffect(() => {

        const fetchGmailInbox = async () => {

            const inbox = await getGmailMessages();
            const { messages, message: msg } = inbox.data;

            const _emails = [];
            let _email;

            messages.forEach(message => {

                const { headers, mimeType, parts } = message.data.payload;

                _email = {};
                _email.key = message.data.id;
                _email.data = message.data;

                headers.forEach(header => {

                    if (header.name === "Subject") {
                        _email.subject = header.value;
                    }

                    if (header.name === "Date") {
                        _email.date = header.value;
                    }

                    if (header.name === "Message-ID") {
                        _email.preview = header.value.replace(/<|>/g, '');
                    }

                });

                if (mimeType === "multipart/alternative") {
                    _email.body = new Buffer(parts[0].body.data, 'base64').toString();
                } 

                if (mimeType === "multipart/mixed" || mimeType === "multipart/related") {

                    if (parts[0].mimeType !== "text/plain") {
                        
                        if (parts[0].parts[0].mimeType === "multipart/alternative") {
                            _email.body = new Buffer(parts[0].parts[0].parts[0].body.data, 'base64').toString();
                        } else {
                            _email.body = new Buffer(parts[0].parts[0].body.data, 'base64').toString();
                        }
                        
                    } else {
                        _email.body = "";
                    }

                    parts.forEach((part, index) => {

                        if (index > 0) {

                            if (_email.attachment)
                                _email.attachment = [..._email.attachment, part.filename];
                            else
                                _email.attachment = [part.filename];                        
                        }
                    });
                }

                const bodyArr = _email.body.split("\n");
                
                for (let i=0; i < bodyArr.length; i++) {
                    if (bodyArr[i].startsWith("From:")) {
                        _email.sender = bodyArr[i].split("From:")[1].trim();
                        break;
                    }
                }

                _emails.push(_email);
            });

            message.success(msg);
            set_emails(_emails);
            
        }

        fetchGmailInbox();

    }, [refresh])

    const messageDelivered = key => {
        
        const items = [...emails];
        const removedItemIndex = items.findIndex(item => item.key === key);
        if (removedItemIndex > -1) {
            items.splice(removedItemIndex, 1);
        }
        set_emails(items);

    };

    return (
        <div style={styles.container}>
            <div style={styles.mailbox_section}>
                <Button
                    type="primary"
                    htmlType="button"
                    onClick={() => set_refresh(!refresh)}
                >
                    Refresh
                </Button>
                <Table 
                    columns={inboxColumns} 
                    dataSource={emails}
                    style={styles.table}
                    rowSelection={{type: 'radio', onSelect: record => set_msg(record)}}
                ></Table>
            </div>
            <DealCreationViaMessage 
                message={msg}
                delivered={messageDelivered}
            />
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    mailbox_section: {
        width: 750,
        display: 'flex', 
        flexDirection: 'column',  
        alignItems: 'flex-end'
    },
    table: {
        width: 750,
        marginTop: 15
    }
}

export default NewDealInbox;