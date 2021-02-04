import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import { Form, Collapse, Row, Col, Input, message, AutoComplete, Select } from 'antd';
import _ from 'lodash';
import commaNumber from 'comma-number';
import config from '../../../../config/config';
import { deal } from '../../../../actions';

const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { get_user_id, autoComplete } = config;
const { modifyDeal } = deal;

const WrappedDealProfile = props => {

    const { forwardedRef, ...rest } = props;

    const { 
        deal: { deal_id, deal_profile },
        deal_profile: profile_fields,
        toggle,
        form: { getFieldDecorator, setFieldsValue }
    } = rest; 

    const obj = {};
    const pf = JSON.parse(deal_profile);

    if (profile_fields && profile_fields.length) {

        profile_fields.forEach(({ field_name, field_type }) => {
            obj[field_name] =  {
                value: pf && pf[field_name] ? pf[field_name] : null,
                type: field_type
            }
        });
    }

    const [profile, set_profile] = useState(obj);
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

            if (profile_fields) {

                let columns = [];
                let rows = [];
                let space_remained = 24;

                profile_fields.forEach(({ field_name, field_type, caption, break_after, auto_complete }, index) => {

                    const condition = field_type === "text" && break_after;

                    if (space_remained <= 0 || (profile_fields[index - 1] && profile_fields[index - 1]["break_after"])) {
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
                                { getFieldDecorator(field_name, {
                                    initialValue: field_type === "money" ? commaNumber(profile[field_name].value) : profile[field_name].value
                                })(
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

        mapProfileFields(profile_fields, profile, getFieldDecorator, options);

    }, [profile_fields, profile, getFieldDecorator, options])

    const createOptions = auto_complete => { 
        set_options(auto_complete.map(element => (
            <Option key={element}>{element}</Option>
        )));
    }

    useImperativeHandle(forwardedRef, () => ({

        modifyProfile: async () => {

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
                toggle();
            } else {
                message.error(msg);
            }
        }
    }))

    return (
        
        <React.Fragment>
            { profile_fields && profile_fields.length > 0 ? (

                <Form>
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
                </Form>
            ) : (
                <span>No deal profile is available</span>
            )}
        </React.Fragment>
    )
}

const DealProfile = forwardRef((props, ref) => {
    const Updated = Form.create({ name: 'deal_profile_form' })(WrappedDealProfile);
    return <Updated {...props} forwardedRef={ref} />
})

export default DealProfile;