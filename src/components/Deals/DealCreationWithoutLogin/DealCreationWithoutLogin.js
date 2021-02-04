import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Collapse, Input, DatePicker, AutoComplete, Select, message, Button } from 'antd';
import dealState from '../../../utils/defaultState/deal';
import config from '../../../config/config';
import { deal } from '../../../actions';
import stages from '../../../utils/autocomplete/stages';
import withDeal from '../../../hoc/withDeal';
import moment from 'moment';
import commaNumber from 'comma-number';
import _ from 'lodash';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { disabledDate, isWholeOrDecimal } = config;
const { getDealCategoryAndTypeBySubCategory, postDealWithoutAuth } = deal;

const DealCreationWithoutLogin = props => {

    const { submit_user, sub_category_id } = props.match.params;
    const { form: { getFieldDecorator, setFields, setFieldsValue, validateFields, resetFields }, industries } = props;

    const [deal, set_deal] = useState(dealState);

    const [stage_options, set_stage_options] = useState(stages.map(stage => <Option key={stage}>{stage}</Option>));
    const [options, set_options] = useState([]);
    const [loading, set_loading] = useState(false);

    const [profile, set_profile] = useState(null);
    const [pf_rows, set_pf_rows] = useState([]);


    useEffect(() => {

        const { minimum_investment, investment_amount_sought, valuation } = deal;

        if (minimum_investment) {

            if (investment_amount_sought && +minimum_investment > +investment_amount_sought) {

                setFields({
                    minimum: {
                        value: commaNumber(minimum_investment),
                        errors: [new Error('Minimum should be less or equal to seeking')]
                    }
                });

            } else {

                setFieldsValue({
                    minimum: commaNumber(minimum_investment)
                });
            }
        }

        if (investment_amount_sought) {

            setFieldsValue({
                amount_seeking: commaNumber(investment_amount_sought)
            });
        }

        if (valuation) {

            if (isNaN(valuation)) {

                setFields({
                    valuation: {
                        value: commaNumber(valuation),
                        errors: [new Error('Valuation must be a numeric value!')]
                    }
                });

            } else {

                setFieldsValue({
                    valuation: commaNumber(valuation)
                });
            }
        }

    }, [deal, setFieldsValue, setFields])

    useEffect(() => {

        const fetchDetails = async sub_category_id => {

            const result = await getDealCategoryAndTypeBySubCategory(sub_category_id);
            const { 
                details: { 
                    deal_category_id, 
                    deal_category: { 
                        deal_profile_settings 
                    }
                }, 
                message: msg 
            } = result.data;

            if (result.status === 200) {

                set_deal({
                    ...deal,
                    deal_category_id,
                    deal_sub_category_id: +sub_category_id,
                    submit_by_user_id: +submit_user,
                    deal_profile: deal_profile_settings ? JSON.parse(deal_profile_settings) : null
                });

                const deal_profile = JSON.parse(deal_profile_settings);
                const obj = {};

                if (deal_profile && deal_profile.length) {

                    deal_profile.forEach(({ field_name, field_type }) => {
                        obj[field_name] =  {
                            value: null,
                            type: field_type
                        }
                    });
                }

                set_profile(obj);

            } else {
                message.error(msg);
            }
        }

        if (!deal.deal_sub_category_id) {
            fetchDetails(sub_category_id);
        }

    }, [deal, sub_category_id, submit_user]);

    useEffect(() => {

        const autoComplete = (value, auto_comp_arr, set_options) =>  {

            let options = [];

            if (value) {
                options = auto_comp_arr.filter(element => element.toLowerCase().includes(value.toLowerCase()));
            } 

            set_options(options.map(option => <Option key={option}>{option}</Option>));
        }

        const createOptions = auto_complete => { 
            set_options(auto_complete.map(element => (
                <Option key={element}>{element}</Option>
            )));
        }

        const mapProfileFields = () => {

            const { deal_profile } = deal;

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
                                                                    autoComplete(value, auto_complete, set_options);
                                                                    set_profile({ 
                                                                        ...profile, 
                                                                        [field_name]: { 
                                                                            ...profile[field_name], 
                                                                            value 
                                                                        }
                                                                    })
                                                                }
                                                                else {
                                                                    createOptions(auto_complete)
                                                                }
                                                            }}
                                                            style={{
                                                                width: (space_remained / 8) === 3 ? '83.33%' : (space_remained / 8) === 2 ? '75%' : '41.66%' 
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

        mapProfileFields(deal.deal_profile, profile, getFieldDecorator, options);

    }, [deal, getFieldDecorator, options, profile])

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

    const changeDateHandler = date => {

        let value;

        if (!date) {
            value = date
        } else {
            value = moment(date)._d.toISOString();
        }

        setDeal('expected_close_date', value);  
    }

    const autoComplete = (value, auto_comp_arr, set_options) =>  {

        let options = [];

        if (value) {
            options = auto_comp_arr.filter(element => element.toLowerCase().includes(value.toLowerCase()));
        } 

        setDeal('stage', value);
        set_options(options.map(option => <Option key={option}>{option}</Option>));
    }

    const setDeal = (key, value) => {
        set_deal({
            ...deal,
            [key]: value
        })
    }

    const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

    const submitHandler = e => {

        e.preventDefault();
        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);
                const deal_profile = {};

                for (let item in profile) {
                    deal_profile[item] = profile[item].value;
                }

                let obj = {
                    ...deal,
                    deal_profile: JSON.stringify(deal_profile)
                };

                const result = await postDealWithoutAuth(obj);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    message.success(msg);
                    resetFields();

                } else {
                    message.error(msg);
                }

                set_loading(false);
            }
        })
    }

    return (

        <Form onSubmit={submitHandler}>
            <Collapse
                style={{
                    margin: 20
                }}
            >

                <Panel
                    key="1"
                    header="Financial Details"
                >
                    <Row
                        gutter={gutter}
                    >
                        <Col span={8}>
                            <Form.Item
                                label="Amount Seeking"
                                labelCol={{span: 10}}
                                labelAlign="left"
                                wrapperCol={{span: 14}}
                            >
                                { getFieldDecorator('amount_seeking', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input amount seeking'
                                        }
                                    ]
                                })(
                                    <Input
                                        addonBefore="$"
                                        addonAfter=".00"
                                        placeholder="Investment amount sought"
                                        onChange={e => setDeal('investment_amount_sought', e.target.value.replace(/,\s?/g, ""))}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        { deal.deal_category_id === 1 && (
                            <Col span={8}>
                                <Form.Item
                                    label="Valuation"
                                    labelAlign="left"
                                    labelCol={{span: 8}}
                                    wrapperCol={{span: 16}}
                                >
                                    { getFieldDecorator('valuation', {
                                        rules: [
                                            { 
                                                required: true, 
                                                message: 'Please input valuation' 
                                            }
                                        ]
                                    })(
                                        <Input 
                                            addonBefore="$"
                                            addonAfter=".00"
                                            placeholder="Valuation" 
                                            onChange={e => setDeal('valuation', e.target.value.replace(/,\s?/g, ""))}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        )}
                        <Col span={8}>
                            <Form.Item
                                label="Minimum"
                                labelCol={{span: 8}}
                                labelAlign="left"
                                wrapperCol={{span: 16}}
                            >
                                { getFieldDecorator('minimum', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input minimum investment'
                                        }
                                    ]
                                })(
                                    <Input
                                        addonBefore="$"
                                        addonAfter=".00"
                                        placeholder="Minimum investment"
                                        onChange={e => setDeal('minimum_investment', e.target.value.replace(/,\s?/g, ""))} 
                                    />
                                )}
                            </Form.Item>
                        </Col> 
                        { deal.deal_category_id !== 1 && (
                            <React.Fragment>
                                <Col span={8}>
                                    <Form.Item
                                        label="Deal Projected IRR"
                                        labelAlign="left"
                                        labelCol={{span: 10}}
                                        wrapperCol={{span: 14}}
                                    >
                                        { getFieldDecorator('projected_irr', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: 'Please input projected IRR' 
                                                },
                                                {
                                                    validator: isWholeOrDecimal
                                                }
                                            ]
                                        })(
                                            <Input 
                                                placeholder="Projected IRR"
                                                onChange={e => setDeal('projected_irr', e.target.value)}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Deal Projected Multiple"
                                        labelAlign="left"
                                        labelCol={{span: 11}}
                                        wrapperCol={{span: 13}}
                                        >
                                        { getFieldDecorator('projected_multiple', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: 'Please input projected multiple' 
                                                },
                                                {
                                                    validator: isWholeOrDecimal
                                                }
                                            ]
                                        })(
                                            <Input 
                                                placeholder="Projected multiple"
                                                onChange={e => setDeal('projected_multiple', e.target.value)}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </React.Fragment>
                        )}
                        <Col span={8}>
                            <Form.Item
                                label="Expected Close"
                                labelCol={{span: 8}}
                                labelAlign="left"
                                wrapperCol={{span: 16}}
                            >
                                { getFieldDecorator('expected_close', {})(
                                    <DatePicker 
                                        disabledDate={disabledDate}
                                        onChange={changeDateHandler} 
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Panel>

                <Panel
                    key="2"
                    header="Deal Details"
                >
                    <Form.Item
                        label="Short Deal Description"
                        labelCol={{span: 4}}
                        labelAlign="left"
                        wrapperCol={{span: 20}}
                    >
                        { getFieldDecorator('short_deal_description', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input deal short description'
                                },
                                {
                                    max: 100,
                                    message: 'Description should not be more than 100 character(s)'
                                }
                            ]
                        })(
                            <Input 
                                placeholder="Deal short description..." 
                                allowClear 
                                onChange={e => setDeal('short_description', e.target.value)} 
                            />
                        )}
                    </Form.Item>
                    <Row
                        gutter={gutter}
                    >
                        <Col span={8}>
                            <Form.Item
                                label="Company Name"
                                labelAlign="left"
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                            >
                                { getFieldDecorator('company_name', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input company name' 
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="Company name" 
                                        allowClear 
                                        onChange={e => setDeal('company_name', e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>  
                            <Form.Item
                                label="Sponsor Name"
                                labelAlign="left"
                                labelCol={{span: 9}}
                                wrapperCol={{span: 15}}
                            >
                                { getFieldDecorator('sponsor_name', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input sponsor name' 
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="Sponsor name" 
                                        allowClear 
                                        onChange={e => setDeal('sponsor_name', e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Location"
                                labelAlign="left"
                                labelCol={{span: 9}}
                                wrapperCol={{span: 15}}
                            >
                                { getFieldDecorator('location', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input your location' 
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="Location" 
                                        allowClear 
                                        onChange={e => setDeal('location', e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    { deal.deal_category_id === 1 && (
                        <Row
                            gutter={gutter}
                        >
                            <Col span={8}>
                                <Form.Item
                                    label="Industry"
                                    labelCol={{span: 8}}
                                    labelAlign="left"
                                    wrapperCol={{span: 16}}
                                >
                                    { getFieldDecorator('industry', {
                                        
                                    })(
                                        <Select 
                                            placeholder="Please select"
                                            onChange={value => setDeal('deal_industry_id', value)}
                                            style={{width: 280}}
                                        >
                                            { industries.map(({ industry_id, name }) => (
                                                <Option 
                                                    key={industry_id}
                                                    value={industry_id}
                                                >
                                                    {name}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Stage"
                                    labelAlign="left"
                                    labelCol={{span: 9}}
                                    wrapperCol={{span: 15}}
                                >
                                    { getFieldDecorator('stage', {
                                        rules: [
                                            { 
                                                required: true, 
                                                message: 'Please input stage' 
                                            },
                                            {
                                                max: 25,
                                                message: 'Stage should not be more than 25 character(s)'
                                            }
                                        ]
                                    })(
                                        <AutoComplete
                                            placeholder="Stage"
                                            allowClear
                                            onChange={value => autoComplete(value, stages, set_stage_options)}
                                        >
                                            {stage_options}
                                        </AutoComplete>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                    <Row
                        gutter={gutter}
                    >
                        <Col span={8}>       
                            <Form.Item
                                label="Referred By"
                                labelAlign="left"
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                            >
                                { getFieldDecorator('referred_by', {
                                    rules: [
                                        {
                                            max: 50,
                                            message: 'Referred by should not be more than 50 character(s)'
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="Referred by" 
                                        allowClear 
                                        onChange={e => setDeal('referred_by', e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Deal Contact Name"
                                labelAlign="left"
                                labelCol={{span: 9}}
                                wrapperCol={{span: 15}}
                            >
                                { getFieldDecorator('deal_contact_name', {
                                    rules: [
                                        {
                                            max: 50,
                                            message: 'Deal contact name should not be more than 50 character(s)'
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="Deal contact name" 
                                        allowClear 
                                        onChange={e => setDeal('deal_contact_name', e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Deal Contact Email"
                                labelAlign="left"
                                labelCol={{span: 9}}
                                wrapperCol={{span: 15}}
                            >
                                { getFieldDecorator('deal_contact_email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: 'The input is not valid email!'
                                        },
                                        {
                                            max: 50,
                                            message: 'Deal contact email should not be more than 50 character(s)'
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="Deal contact email" 
                                        allowClear 
                                        onChange={e => setDeal('deal_contact_email', e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Executive Summary"
                        labelCol={{span: 4}}
                        labelAlign="left"
                        wrapperCol={{span: 20}}
                    >
                        { getFieldDecorator('executive_summary', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input executive summary'
                                }
                            ]
                        })(
                            <TextArea 
                                placeholder="Deal summary..." 
                                autoSize={{ minRows: 3, maxRows: 6 }} 
                                onChange={e => setDeal('summary', e.target.value)} 
                            />
                        )}
                    </Form.Item>
                </Panel>

                <Panel
                    key="3"
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

            <Button
                htmlType="submit"
                type="primary"
                disabled={loading ? true : false}
                style={{margin: 20}}
            >
                Submit
            </Button>
        </Form>
        
    )

}

export default Form.create({ name: 'deal_form' })(withDeal(DealCreationWithoutLogin));