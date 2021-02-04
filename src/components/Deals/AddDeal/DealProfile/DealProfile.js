import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col, Form, Input, Button, message, AutoComplete, Select } from 'antd';
import _ from 'lodash';
import commaNumber from 'comma-number';
import { deal } from '../../../../actions';
import config from '../../../../config/config';

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { modifyDeal } = deal;
const { get_user_id, autoComplete } = config;
const caption = "Next";

const DealProfile = props => {

    const {
        deal_id,
        next,
        deal_profile,
        form: { getFieldDecorator, setFieldsValue, getFieldValue, resetFields }
    } = props;

    const obj = {};

    if (deal_profile && deal_profile.length) {

        deal_profile.forEach(({ field_name, field_type }) => {
            obj[field_name] =  {
                value: null,
                type: field_type
            }
        });
    }

    const [profile, set_profile] = useState(obj);
    const [loading, set_loading] = useState(false);
    const [options, set_options] = useState([]);
    const [pf_rows, set_pf_rows] = useState([]);

    useEffect(() => {
        
        for (let item in profile) {
            if (profile[item].type === "money") {
                if (profile[item].value) {
                    setFieldsValue({
                        [item]: commaNumber(profile[item].value)
                    });
                }
            }
        }
    }, [profile, setFieldsValue]);

    useEffect(() => {

        const mapProfileFields = () => {

            if (deal_profile) {

                let columns = [];
                let rows = [];
                let space_remained = 24;

                deal_profile.forEach(({ field_name, field_type, caption, break_after, auto_complete }, index) => {

                    const condition = field_type === "text" && break_after;

                    if (space_remained <= 0 || (deal_profile[index - 1] && deal_profile[index - 1]["break_after"])) {
                        space_remained = 24;
                    }

                    if (field_type === "notes") {
                        space_remained = space_remained - 24;
                    } else if (!condition) {
                        space_remained = space_remained - 8;
                    }

                    columns.push(
                        <Col 
                            key={field_name}
                            span={field_type === "notes" ? 24 : condition ? space_remained : 8} 
                        >
                            <Form.Item
                                label={caption}
                                labelAlign="left"
                                labelCol={{span: field_type === "notes" ? 4 : condition ? (space_remained / 8) === 3 ? 4 : (space_remained / 8) === 2 ? 6 : 12 : 12}}
                                wrapperCol={{span: field_type === "notes" ? 20 : condition ? (space_remained / 8) === 3 ? 20 : (space_remained / 8) === 2 ? 18 : 10 : 10}}
                            >
                                { getFieldDecorator(field_name, {})(
                                    <React.Fragment>
                                        { 
                                            field_type === "notes"
                                            ? (
                                                <TextArea 
                                                    placeholder={`Please input ${_.lowerCase(caption)}`}
                                                    onChange={e => set_profile({ 
                                                        ...profile, 
                                                        [field_name]: { 
                                                            ...profile[field_name], 
                                                            value: e.target.value.replace(/,\s?/g, '') 
                                                        } 
                                                    })}
                                                    autoSize={{minRows: 3, maxRows: 6}}
                                                />
                                            ) 
                                            : field_type === "text"
                                                ? (auto_complete && auto_complete.length > 0) 
                                                    ? (
                                                        <AutoComplete
                                                            placeholder={`Please input ${_.lowerCase(caption)}`}
                                                            allowClear
                                                            onFocus={() => createOptions(auto_complete)}
                                                            onChange={value => {
                                                                if (value) {
                                                                    autoComplete(value, auto_complete, null, set_options);
                                                                }
                                                                else {
                                                                    createOptions(auto_complete)
                                                                }
                                                            }}
                                                        >
                                                            {options}
                                                        </AutoComplete>
                                                    )
                                                    : (
                                                        <Input 
                                                            placeholder={`Please input ${_.lowerCase(caption)}`}
                                                            onChange={e => set_profile({ 
                                                                ...profile, 
                                                                [field_name]: { 
                                                                    ...profile[field_name], 
                                                                    value: e.target.value.replace(/,\s?/g, '') 
                                                                } 
                                                            })}
                                                        />
                                                    )
                                                : (
                                                    <Input 
                                                        placeholder={`Please input ${_.lowerCase(caption)}`}
                                                        onChange={e => set_profile({ 
                                                            ...profile, 
                                                            [field_name]: { 
                                                                ...profile[field_name], 
                                                                value: e.target.value.replace(/,\s?/g, '') 
                                                            } 
                                                        })}
                                                        addonAfter={field_type === "money" ? '00' : ''}
                                                        addonBefore={field_type === "money" ? '$' : ''}
                                                    />
                                                )
                                        }
                                    </React.Fragment>
                                )}
                            </Form.Item>
                        </Col>
                    );

                    if (condition || space_remained === 0) {

                        if ((space_remained === 0 && condition) || condition) {
                            rows.push(['break_after', ...columns]);
                        } else { 
                            rows.push([...columns]);
                        }
                        columns = [];
                    }
                });

                if (columns.length) {
                    rows.push([...columns]);
                    columns = [];
                }

                set_pf_rows(rows);
            }
        }

        mapProfileFields(deal_profile, profile, getFieldDecorator, options);

    }, [deal_profile, profile, getFieldDecorator, options])

    const nextHandler = e => {

        let status = false;
        for (let item in profile) {
            if (getFieldValue(item)) 
                status = true;
        }

        if (status) {
            submitHandler(e);
        } else {
            next();
        }

    }

    const createOptions = auto_complete => { 
        set_options(auto_complete.map(element => (
            <Option key={element}>{element}</Option>
        )));
    }

    const submitHandler = async e => {

        const caption = e.target.children[0].innerHTML;
        e.preventDefault();

        set_loading(true);
        const obj = {};

        for (let item in profile) {
            obj[item] = profile[item].value;
        }

        const result = await modifyDeal({
            deal_id, 
            deal_profile: JSON.stringify(obj), 
            submit_by_user_id: get_user_id() 
        });

        const { message: msg } = result.data;

        if (result.status === 200) {
            resetFields();
        } else {
            message.error(msg);
        }

        set_loading(false);

        if (caption === "Next") {
            next();
        }
    }

    return (

        <React.Fragment>
            { deal_profile && deal_profile.length > 0 ? (

                <Form onSubmit={submitHandler}>
                    <Collapse
                        defaultActiveKey={["1"]}
                    >
                        <Panel
                            key="1"
                            header="Profile"
                        >
                            { pf_rows.map((row, index) => {

                                return (
                                    <React.Fragment
                                        key={index}
                                    >
                                        { row[0] === "break_after" ? (
                                            <React.Fragment>
                                                <Row>{row.slice(1)}</Row>
                                                <hr />
                                            </React.Fragment>
                                        ) : (
                                            <Row>{row}</Row>
                                        )
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </Panel>
                    </Collapse>

                    <div className="mt-20">
                        { deal_profile && deal_profile.length && (
                            <Button
                                htmlType="submit"
                                type="primary"
                                disabled={loading ? true : false}
                            >
                                Done
                            </Button>
                        )}
                        <Button
                            htmlType="button"
                            type="primary"
                            disabled={loading ? true : false}
                            onClick={nextHandler}
                            className="ml-15"
                        >
                            {caption}
                        </Button>
                    </div>
                </Form>
            ) : (
                <Button
                    htmlType="button"
                    type="primary"
                    onClick={nextHandler}
                >
                    {caption}
                </Button>
            )}
        </React.Fragment>
    )
}

export default Form.create({ name: 'deal_profile_form' })(DealProfile);