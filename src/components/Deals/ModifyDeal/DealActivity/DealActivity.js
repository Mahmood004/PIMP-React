import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Select, Input, DatePicker, Button, message, Table, Icon } from 'antd';
import moment from 'moment';
import { deal } from '../../../../actions';
import dealActivity from '../../../../utils/columns/dealActivity';
import Attachment from '../../../common/Attachment';

const { Option } = Select;
const { TextArea } = Input;
const { getUserDealActivities, uploadDocuments, submitDealActivity } = deal;

const WrappedDealActivity = props => {

    const { 
        deal: { deal_id },
        form: { getFieldDecorator, validateFields, setFields },
        _activities,
        download,
        removeActivityDocument
    } = props;

    const columns = dealActivity(download);

    const [activities, set_activities] = useState([]);
    const [date, set_date] = useState(moment(Date.now()));
    const [activity, set_activity] = useState(null);
    const [notes, set_notes] = useState(null);
    const [_docs, set_docs] = useState([]);
    const [deal_document_id, set_deal_document_id] = useState(null);

    const [loading, set_loading] = useState(false);
    const [toggle, set_toggle] = useState(true);

    useEffect(() => {

        async function fetchUserDealActivities() {

            const result = await getUserDealActivities(deal_id);
            const { message: msg, user_deal_activity } = result.data;

            if (result.status === 200) {

                const activities = [];

                user_deal_activity.forEach(activity => {

                    let obj = {
                        key: activity.user_deal_activity_id,
                        activity_date: moment(activity.activity_date).format('MMMM Do, YYYY'),
                        activity_type: activity.user_activity_type.name,
                        notes: activity.notes,
                        document: activity.deal_document
                    };

                    activities.push(obj);
                })

                set_activities(activities);

            } else {
                message.error(msg);
            }
        }

        fetchUserDealActivities();

    }, [deal_id, toggle]);

    useEffect(() => {

        async function uploadDealActivityDocument() {
    
            set_loading(true);
            const formData = new FormData();

            formData.append('docs', _docs[0]);
            formData.append('private', 1);
            
            const result = await uploadDocuments(deal_id, formData);
            const { message: msg, deal_document_ids } = result.data;
    
            if (result.status === 200) {

                message.success(msg);
                set_deal_document_id(deal_document_ids[0]);
                set_loading(false);

            } else {
                message.error(msg);
            }
        }

        if (_docs.length) 
            uploadDealActivityDocument();

    }, [_docs, deal_id]);

    const changeDateHandler = date => {

        let value;

        if (!date) {
            value = date
        } else {
            value = moment(date)._d.toISOString();
        }
        set_date(value);  
    }

    const submitHandler = e => {

        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                const obj = {
                    activity_type: activity,
                    activity_date: date,
                    notes,
                    deal_document_id
                }

                const result = await submitDealActivity(deal_id, obj);
                const { message: msg } = result.data;

                if (result.status === 200) {
                    
                    message.success(msg);
                    setFields({
                        activity_type: {
                            value: null
                        },
                        notes: {
                            value: null
                        },
                        activity_date: {
                            value: null
                        }
                    });
                    set_toggle(!toggle);

                } else {
                    message.error(msg);
                }

                set_loading(false);
                set_docs([]);
                set_deal_document_id(null);
            }
        });
    }

    const fileProps = {
        name: 'docs',
        multiple: false,
        disabled: _docs.length ? true : false,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {

            const { status, originFileObj } = info.file;
            
            if (status === 'done') {

                const docs = [..._docs];
                docs.push(originFileObj);
                set_docs(docs);

                message.success(`${info.file.name} file uploaded successfully.`);
            }
            
            if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        showUploadList: false
    };

    const onRemove = name => {

        const docs = [..._docs];
        const removeDocIndex = docs.findIndex(doc => doc.name === name);

        if (removeDocIndex > -1) {
            docs.splice(removeDocIndex, 1);
        }

        removeActivityDocument(deal_document_id);
        set_docs(docs);
        set_deal_document_id(null);
    }

    return (
        
        <React.Fragment>
            <Form onSubmit={submitHandler}>
                <Row gutter={24}> 

                    <Col span={8}>
                        <Form.Item
                            label="Activity Type"
                            labelAlign="left"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                        >

                            {
                                getFieldDecorator('activity_type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please select activity type'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder="Please select"
                                        onChange={value => set_activity(value)}
                                    >
                                        { 
                                            _activities.map(activity => (
                                                <Option
                                                    key={activity.user_activity_type_id}
                                                    value={activity.user_activity_type_id}
                                                >
                                                    { activity.name }
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>

                    <Col span={8}> 
                        <Form.Item
                            label="Activity Date"
                            labelAlign="left"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                        >
                            {
                                getFieldDecorator('activity_date', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input activity date'
                                        }
                                    ],
                                    initialValue: date
                                })(
                                    <DatePicker
                                        onChange={changeDateHandler}
                                    />
                                )
                            }
                        </Form.Item>
                    </Col>
                    
                </Row>

                <Form.Item
                    label="Notes"
                    labelAlign="left"
                    labelCol={{span: 2}}
                    wrapperCol={{span: 22}}
                >
                    { 
                        getFieldDecorator('notes', {})(
                            <TextArea
                                placeholder="Deal activity notes..."
                                autoSize={{minRows: 3, maxRows: 6}}
                                onChange={e => set_notes(e.target.value)}
                            ></TextArea>
                        )
                        
                    }
                </Form.Item> 

                <Row>

                    <Attachment
                        fileProps={fileProps}
                    />
                </Row>
                
                { _docs.length > 0 && 
                        <span>
                            {_docs[0].name}
                            { deal_document_id !== null && 
                                <Icon 
                                    type="delete" 
                                    onClick={() => onRemove(_docs[0].name)} 
                                    style={{marginLeft: 15}}    
                                />
                            }
                        </span> 
                }
                
                <Row>
                    <Button
                        htmlType="submit"
                        type="primary"
                        disabled={loading ? true : false}
                        style={{marginTop: 15}}
                    >
                        Add
                    </Button>
                </Row>
            </Form>

            <Table
                dataSource={activities}
                columns={columns}
                style={styles.table}
            ></Table>
        </React.Fragment>
    )

}

const styles = {
    table: {
        marginTop: 20   
    }
}

const DealActivity = Form.create({ name: 'deal_activity_form' })(WrappedDealActivity);

export default DealActivity


