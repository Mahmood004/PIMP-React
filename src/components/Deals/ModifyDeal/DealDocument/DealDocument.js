import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Icon, Row, Col, Button, Input, message } from 'antd';
import moment from 'moment';
import { deal } from '../../../../actions';
import Attachment from '../../../common/Attachment';

const { modifyDocuments } = deal;

const DealDocument = forwardRef((props, ref) => {

    const { deal, download, toggle } = props;

    const [_docs, set_docs] = useState([]);

    useEffect(() => {

        const docs = [];
        deal.deal_documents.forEach(({deal_document_id, file_name, file_type, short_description, created_at}) => {
            const obj = {
                deal_document_id,
                name: file_name,
                type: file_type,
                short_description, 
                date_added: created_at
            };
            docs.push(obj);
        });

        set_docs(docs);

    }, [deal]);


    const fileProps = {
        name: "docs",
        multiple: true,
        disabled: deal.read_only ? true : false,
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        onChange(info) {
        
            const { status } = info.file;
            
            if (status === 'done') {
        
                const docs = [..._docs];
                const file = {
                    ...info.file,
                    short_description: '',
                    date_added: moment().toISOString()
                }
    
                docs.push(file);
                set_docs(docs);
                
                message.success(`${info.file.name} file uploaded successfully.`);
            }
    
            if (status === 'error') {
                message.success(`${info.file.name} file upload failed.`);
            }
        },
        showUploadList: false
    }

    const changeFileDescriptionHandler = (name, description) => {

        const docs = [..._docs];

        const changeDocIndex = docs.findIndex(doc => doc.name === name);
        let changeDoc;

        if (changeDocIndex > -1) {
            changeDoc = { ...docs[changeDocIndex] };
            changeDoc.short_description = description;
            docs[changeDocIndex] = changeDoc;
            set_docs(docs);
        }
    }

    const removeFileHandler = name => {

        const docs = [..._docs];
        const removeDocIndex = docs.findIndex(doc => doc.name === name);

        if (removeDocIndex > -1) {
            docs.splice(removeDocIndex, 1);
        }
        
        set_docs(docs);
    }

    useImperativeHandle(ref, () => ({
        
        modifyDealDocuments: async () => {

            const formData = new FormData();
            formData.append('deal', JSON.stringify(deal));

            _docs.forEach(doc => {

                if (doc.originFileObj) {
                    formData.append('docs', doc.originFileObj);
                    formData.append('short_description', doc.short_description);

                } else {
                    formData.append('deal_documents', JSON.stringify(doc));
                }
            });
            
            const result = await modifyDocuments(deal.deal_id, formData);
            const { message: msg } = result.data;

            if (result.status === 200) {
                toggle();
            } else {
                message.error(msg);
            }
        }
    }));

    return (

        <React.Fragment>
            <Attachment
                fileProps={fileProps}
            />
                
            { _docs.length > 0 && (
                <Row style={{padding: '20px 0', textAlign: 'center'}}>
                    <Col span={7}><h4>File Name</h4></Col>
                    <Col span={7}><h4>Description</h4></Col>
                    <Col span={7}><h4>Date Added</h4></Col>
                    <Col span={3}><h4>Action</h4></Col>
                </Row>
            )}

            { _docs.length > 0 && _docs.map(({ deal_document_id, name, type, short_description, date_added }) => (
                <Row key={name} style={{padding: '10px 0', textAlign: 'center'}}>
                    <Col span={7}>
                        { deal_document_id ? 
                            <Button
                                type="link"
                                onClick={e => download(e, {
                                    id: deal_document_id,
                                    name,
                                    type
                                })}
                            >
                            {name}
                            </Button> : 
                            <React.Fragment>{name}</React.Fragment> }
                    </Col>
                    <Col span={7}>
                        <Input placeholder="Description" value={short_description} onChange={e => changeFileDescriptionHandler(name, e.target.value)} style={{width: 260}} />
                    </Col>
                    <Col span={7}>{moment(date_added).format('MMMM Do, YYYY')}</Col>
                    <Col span={3}><Icon type="delete" onClick={() => removeFileHandler(name)} /></Col>
                </Row>
            ))}
        </React.Fragment>
    )
})

export default DealDocument;