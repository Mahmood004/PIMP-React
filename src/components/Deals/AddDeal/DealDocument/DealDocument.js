import React, { useState } from 'react';
import { Icon, Row, Col, Input, message, Button } from 'antd';
import { deal } from '../../../../actions';
import Attachment from '../../../common/Attachment';
import moment from 'moment';

const { uploadDocuments } = deal;
const caption = "Next";

const DealDocument = props => {

    const [_docs, set_docs] = useState([]);
    const [loading, set_loading] = useState(false);

    const { next, deal_id } = props;

    const changeFileDescriptionHandler = (file, description) => {

        const docs = [..._docs];

        const changeDocIndex = docs.findIndex(doc => doc.uid === file.uid);
        let changeDoc;

        if (changeDocIndex > -1) {
            changeDoc = { ...docs[changeDocIndex] };
            changeDoc.short_description = description;
            docs[changeDocIndex] = changeDoc;
            set_docs(docs);
        }
    }

    const removeFileHandler = file => {

        const docs = [..._docs];
        const removeDocIndex = docs.findIndex(doc => doc.uid === file.uid);

        if (removeDocIndex > -1) {
            docs.splice(removeDocIndex, 1);
        }
        
        set_docs(docs);
    }

    const submitDealDocuments = async (caption = null) => {

        set_loading(true);

        const formData = new FormData();

        _docs.forEach(doc => {
            formData.append('docs', doc.originFileObj);
            formData.append('short_description', doc.short_description);
        });
        
        const result = await uploadDocuments(deal_id, formData);
        let { message: msg } = result.data;

        if (result.status === 200) {
            
            set_docs([]);
            message.success(msg);

            if (caption && caption === "Next") {
                next();
            }

        } else {

            if (!msg)
                msg = 'Deal document(s) failed to upload!';

            message.error(msg);
        }

        set_loading(false);
    }

    const fileProps = {
        name: "docs",
        multiple: true,
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

    const nextHandler = e => {
        
        if (_docs.length) {
            submitDealDocuments(e.target.children[0].innerHTML);
        } else {
            next();
        }
    }

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

            { _docs.length > 0 && _docs.map(doc => (
                <Row key={doc.date_added} style={{padding: '10px 0', textAlign: 'center'}}>
                    <Col span={7}>{doc.name}</Col>
                    <Col span={7}>
                        <Input placeholder="Description" value={doc.short_description} onChange={e => changeFileDescriptionHandler(doc, e.target.value)} style={{width: 260}} />
                    </Col>
                    <Col span={7}>{moment(doc.date_added).format('MMMM Do, YYYY')}</Col>
                    <Col span={3}><Icon type="delete" onClick={() => removeFileHandler(doc)} /></Col>
                </Row>
            ))}

            <Button 
                type="primary" 
                onClick={() => submitDealDocuments()} 
                disabled={!_docs.length || loading ? true : false}
                className="mt-15"
            >
                Done
            </Button>
            <Button 
                type="primary"
                onClick={nextHandler} 
                disabled={loading ? true : false}
                className="ml-15"
            >
                {caption}
            </Button>
        
        </React.Fragment>
    )
}

export default DealDocument;