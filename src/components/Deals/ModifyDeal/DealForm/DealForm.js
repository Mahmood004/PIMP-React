import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Checkbox, Input, Select, DatePicker, AutoComplete, Collapse, message } from 'antd';
import moment from 'moment';
import commaNumber from 'comma-number';
import stages from '../../../../utils/autocomplete/stages';
import { HomeContext } from '../../../../containers/Home/Home';
import { deal } from '../../../../actions';
import config from '../../../../config/config';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { modifyDeal } = deal;
const { isWholeOrDecimal, disabledDate, set_deal_form_aks, get_deal_form_aks, autoComplete } = config;

const WrappedDealForm = props => {

    const { forwardedRef, ...rest } = props;

    const {
        deal: { deal_id, submit_by_user_id, approved, deal_circles: circles, company_name, sponsor_name, deal_category, deal_category_id, deal_sub_category_id, short_description, investment_amount_sought, minimum_investment, expected_close_date, summary, location, referred_by, deal_contact_name, deal_contact_email, valuation, stage, projected_irr, projected_multiple, deal_instrument_id, deal_industry_id, read_only },
        set_deal_profile,
        form: { getFieldDecorator, setFieldsValue, validateFields, setFields },
        types,
        instruments,
        industries,
        toggle
    } = rest;


    const [categories, set_categories] = useState([]);
    const [sub_categories, set_sub_categories] = useState([]);

    const [deal_circles, set_deal_circles] = useState(circles.map(circle => circle.circle_id));

    const [company, set_company] = useState(company_name);
    const [sponsor, set_sponsor] = useState(sponsor_name);
    const [referred, set_referred] = useState(referred_by);
    const [contact_name, set_contact_name] = useState(deal_contact_name);
    const [contact_email, set_contact_email] = useState(deal_contact_email);
    const [type, set_type] = useState(deal_category.deal_type.deal_type_id);
    const [category, set_category] = useState(deal_category_id);
    const [sub_category, set_sub_category] = useState(deal_sub_category_id);
    const [description, set_description] = useState(short_description);
    const [investment, set_investment] = useState(investment_amount_sought);
    const [minimum, set_minimum] = useState(minimum_investment);
    const [expected_close, set_expected_close] = useState(expected_close_date);
    const [irr, set_irr] = useState(projected_irr);
    const [_valuation, set_valuation] = useState(valuation);
    const [_stage, set_stage] = useState(stage);
    const [stage_options, set_stage_options] = useState(stages.map(stage => <Option key={stage}>{stage}</Option>));
    const [multiple, set_multiple] = useState(projected_multiple);
    const [instrument, set_instrument] = useState(deal_instrument_id);
    const [industry, set_industry] = useState(deal_industry_id);
    const [_location, set_location] = useState(location);
    const [_summary, set_summary] = useState(summary);

    const { auth_user: { user_circles } } = useContext(HomeContext);

    const gutter = { xs: 8, sm: 16, md: 24, lg: 32 }

    useEffect(() => {

        if (types.length) {
            const obj = types.find(({ deal_type_id }) => deal_type_id === type);
            if (obj) {
                set_categories(obj.deal_categories);
            }
        }

    }, [types, type]);

    useEffect(() => {

        if (categories.length) {
            if (category) {
                const obj = categories.find(({ deal_category_id }) => deal_category_id === category);
                set_sub_categories(obj.deal_sub_categories);
            } else {
                set_sub_categories([]);
            }
        }

    }, [categories, category]);

    useEffect(() => {

        if (minimum) {

            if (investment && +minimum > +investment) {

                setFields({
                    minimum: {
                        value: commaNumber(minimum),
                        errors: [new Error('Minimum should be less or equal to seeking')]
                    }
                });

            } else {

                setFieldsValue({
                    minimum: commaNumber(minimum)
                });
            }
        }

        if (investment) {

            setFieldsValue({
                amount_seeking: commaNumber(investment)
            });
        }

        if (_valuation) {

            if (isNaN(_valuation)) {

                setFields({
                    valuation: {
                        value: commaNumber(_valuation),
                        errors: [new Error('Valuation must be a numeric value!')]
                    }
                });

            } else {

                setFieldsValue({
                    valuation: commaNumber(_valuation)
                });
            }
        }

    }, [minimum, investment, _valuation, setFields, setFieldsValue]);

    const checkboxHandler = e => {
        
        const circles = [...deal_circles];

        if (e.target.checked) {
            const circle = circles.find(circle_id => circle_id === +e.target.id);
            if (!circle) {
                circles.push(+e.target.id);
            }
        } else {
            const removeCircleIndex = circles.findIndex(circle_id => circle_id === +e.target.id);
            if (removeCircleIndex > -1) {
                circles.splice(removeCircleIndex, 1);
            }
        }
        set_deal_circles(circles);
    }

    const changeTypeHandler = value => {

        setFieldsValue({
            category: '',
            sub_category: ''
        });

        set_type(value);
        set_category(null);
    }

    const changeCategoryHandler = value => {

        setFieldsValue({
            sub_category: ''
        });

        set_category(value);
        set_sub_category(null);
        
        const obj = categories.find(({ deal_category_id }) => deal_category_id === value);
        if (obj) {
            if (obj.deal_profile_settings)
                set_deal_profile(JSON.parse(obj.deal_profile_settings));
            else
                set_deal_profile(obj.deal_profile_settings);
        };
    }

    const changeDateHandler = date => {
        
        let value;

        if (!date) {
            value = date
        } else {
            value = moment(date)._d.toISOString();
        }
        set_expected_close(value);
    }
    
    useImperativeHandle(forwardedRef, () => ({

        updateDeal: async () => {

            validateFields(async (err, values) => {
    
                if (!err) {
    
                    const attributes = {};
                    
                    if (category === 1) {
    
                        attributes.valuation = _valuation;
                        attributes.stage = _stage;
    
                    } else {
    
                        attributes.projected_irr = irr;
                        attributes.projected_multiple = multiple;
                    }
    
                    const obj = {
                        deal_id,
                        submit_by_user_id,
                        approved,
                        deal_circles,
                        company_name: company,
                        sponsor_name: sponsor,
                        deal_type_id: type,
                        deal_category_id: category,
                        deal_sub_category_id: sub_category,
                        short_description: description,
                        investment_amount_sought: investment,
                        minimum_investment: minimum,
                        expected_close_date: expected_close,
                        summary: _summary,
                        location: _location,
                        referred_by: referred,
                        deal_contact_name: contact_name,
                        deal_contact_email: contact_email,
                        ...attributes,
                        deal_instrument_id: instrument,
                        deal_industry_id: industry
                    }
    
                    const result = await modifyDeal(obj);
                    const { message: msg } = result.data;
    
                    if (result.status === 200) {
                        toggle();
                    } else {
                        message.error(msg);
                    }
                }
            })
        }
    })); 

    return (

        <Form>
            <Collapse
                onChange={set_deal_form_aks}
                defaultActiveKey={get_deal_form_aks() ? get_deal_form_aks().split(',') : []}
            >
                { user_circles.length > 0 && (
                    <Panel
                        key="1"
                        header="Circles"
                    >
                        <Form.Item>
                            { getFieldDecorator('circle', {})(
                                <React.Fragment>
                                    { user_circles.map(circle => (
                                        <Col key={circle.circle_id} span={8}>
                                            <Checkbox 
                                                id={circle.circle_id.toString()} 
                                                disabled={read_only ? true : false}
                                                onChange={checkboxHandler}
                                                checked={deal_circles.find(deal_circle => deal_circle === circle.circle_id) ? true : false}
                                            >
                                                {circle.circle.name}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </React.Fragment>
                            )}
                        </Form.Item>
                    </Panel>
                )}

                <Panel
                    key="2"
                    header="Deal Type"
                >
                    <Row
                        gutter={gutter}
                    >
                        <Col span={6}>
                            <Form.Item
                                label="Type"
                                labelCol={{span: 5}}
                                labelAlign="left"
                                wrapperCol={{span: 19}}
                            >
                                { getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input deal type'
                                        }
                                    ],
                                    initialValue: type
                                })(
                                    <Select 
                                        placeholder="Please select"  
                                        disabled={read_only ? true : false}
                                        onChange={value => changeTypeHandler(value)}
                                    >
                                        { types.map(type => (
                                            <Option 
                                                key={type.deal_type_id}
                                                value={type.deal_type_id}
                                            >
                                                {type.description}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Ctg"
                                labelCol={{span: 5}}
                                labelAlign="left"
                                wrapperCol={{span: 19}}
                            >
                                { getFieldDecorator('category', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input deal category'
                                        }
                                    ],
                                    initialValue: category
                                })(
                                    <Select 
                                        placeholder="Please select" 
                                        onChange={value => changeCategoryHandler(value)} 
                                        disabled={!categories.length || read_only ? true : false}
                                    >
                                        { categories.map(category => (
                                            <Option 
                                                key={category.deal_category_id}
                                                value={category.deal_category_id}
                                            >
                                                {category.description}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Sub Ctg"
                                labelCol={{span: 8}}
                                labelAlign="left"
                                wrapperCol={{span: 16}}
                            >
                                { getFieldDecorator('sub_category', {
                                    initialValue: sub_category
                                })(
                                    <Select 
                                        placeholder="Please select" 
                                        onChange={value => set_sub_category(value)} 
                                        disabled={!sub_categories.length || read_only ? true : false}
                                    >
                                        { sub_categories.map(sub_category => (
                                            <Option 
                                                key={sub_category.deal_sub_category_id}
                                                value={sub_category.deal_sub_category_id}
                                            >
                                                {sub_category.description}
                                            </Option>
                                        ))}
                                    </Select>
                                )} 
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Instrument"
                                labelAlign="left"
                                labelCol={{span: 9}}
                                wrapperCol={{span: 15}}
                            >
                                { getFieldDecorator('instrument', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input deal instrument' 
                                        }
                                    ],
                                    initialValue: instrument
                                })(
                                    <Select 
                                        placeholder="Please select"  
                                        disabled={read_only ? true : false}
                                        onChange={value => set_instrument(value)}
                                    >
                                        { instruments.map(deal_instrument => (
                                            <Option 
                                                key={deal_instrument.deal_instrument_id}
                                                value={deal_instrument.deal_instrument_id}
                                            >
                                                {deal_instrument.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Panel>

                <Panel
                    key="3"
                    header="Financial Details"
                >
                    <Row 
                        gutter={gutter}
                    >
                        <Col span={8}>
                            <Form.Item
                                label="Seeking"
                                labelCol={{span: 6}}
                                labelAlign="left"
                                wrapperCol={{span: 18}}
                            >
                                { getFieldDecorator('amount_seeking', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input amount seeking'
                                        }
                                    ],
                                    initialValue: commaNumber(investment)
                                })(
                                    <Input
                                        addonBefore="$"
                                        addonAfter=".00"
                                        placeholder="Investment amount sought"
                                        disabled={read_only ? true : false}
                                        onChange={e => set_investment(e.target.value.replace(/,\s?/g, ""))}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        { category === 1 && (
                            <Col span={8}>
                                <Form.Item
                                    label="Valuation"
                                    labelAlign="left"
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 18}}
                                >
                                    { getFieldDecorator('valuation', {
                                        rules: [
                                            { 
                                                required: true, 
                                                message: 'Please input valuation' 
                                            }
                                        ],
                                        initialValue: commaNumber(_valuation)
                                    })(
                                        <Input 
                                            addonBefore="$"
                                            addonAfter=".00"
                                            placeholder="Valuation" 
                                            disabled={read_only ? true : false}
                                            onChange={e => set_valuation(e.target.value.replace(/,\s?/g, ""))}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        )}
                        <Col span={8}>
                            <Form.Item
                                label="Minimum"
                                labelCol={{span: 6}}
                                labelAlign="left"
                                wrapperCol={{span: 18}}
                            >
                                { getFieldDecorator('minimum', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input minimum investment'
                                        }
                                    ],
                                    initialValue: commaNumber(minimum)
                                })(
                                    <Input
                                        addonBefore="$"
                                        addonAfter=".00"
                                        placeholder="Minimum investment" 
                                        disabled={read_only ? true : false}
                                        onChange={e => set_minimum(e.target.value.replace(/,\s?/g, ""))}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        { category !== 1 && (
                            <React.Fragment>
                                <Col span={8}>
                                    <Form.Item
                                        label="Deal Projected IRR"
                                        labelAlign="left"
                                        labelCol={{span: 11}}
                                        wrapperCol={{span: 13}}
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
                                            ],
                                            initialValue: irr
                                        })(
                                            <Input 
                                                placeholder="Projected IRR" 
                                                disabled={read_only ? true : false}
                                                onChange={e => set_irr(e.target.value)}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Deal Projected Multiple"
                                        labelAlign="left"
                                        labelCol={{span: 13}}
                                        wrapperCol={{span: 11}}
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
                                            ],
                                            initialValue: multiple
                                        })(
                                            <Input 
                                                placeholder="Projected multiple" 
                                                disabled={read_only ? true : false}
                                                onChange={e => set_multiple(e.target.value)}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </React.Fragment>
                        )}
                        <Col span={8}>
                            <Form.Item
                                label="Expected Close"
                                labelCol={{span: 10}}
                                labelAlign="left"
                                wrapperCol={{span: 14}}
                            >
                                { getFieldDecorator('expected_close', {
                                    initialValue: expected_close ? moment(expected_close) : expected_close
                                })(
                                    <DatePicker 
                                        disabledDate={disabledDate}
                                        disabled={read_only ? true : false}
                                        onChange={changeDateHandler} 
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Panel>

                <Panel
                    key="4"
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
                            ],
                            initialValue: description
                        })(
                            <Input 
                                placeholder="Deal short description..."
                                allowClear 
                                disabled={read_only ? true : false}
                                onChange={e => set_description(e.target.value)}
                            />
                        )}
                    </Form.Item>
                    <Row
                        gutter={gutter}
                    >
                        <Col span={8}>
                            <Form.Item
                                label="Company"
                                labelAlign="left"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                            >
                                { getFieldDecorator('company_name', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input company name' 
                                        }
                                    ],
                                    initialValue: company
                                })(
                                    <Input 
                                        placeholder="Company name" 
                                        disabled={read_only ? true : false}
                                        allowClear 
                                        onChange={e => set_company(e.target.value)}
                                    />
                                )}

                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Sponsor"
                                labelAlign="left"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                            >
                                { getFieldDecorator('sponsor_name', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input sponsor name' 
                                        }
                                    ],
                                    initialValue: sponsor
                                })(
                                    <Input 
                                        placeholder="Sponsor name" 
                                        disabled={read_only ? true : false}
                                        allowClear 
                                        onChange={e => set_sponsor(e.target.value)}
                                        
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Location"
                                labelAlign="left"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                            >
                                { getFieldDecorator('location', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: 'Please input your location' 
                                        }
                                    ],
                                    initialValue: _location
                                })(
                                    <Input 
                                        placeholder="Location" 
                                        disabled={read_only ? true : false}
                                        allowClear 
                                        onChange={e => set_location(e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    { category === 1 && (
                        <Row gutter={gutter}>
                            <Col span={8}>
                                <Form.Item
                                    label="Industry"
                                    labelCol={{span: 5}}
                                    labelAlign="left"
                                    wrapperCol={{span: 19}}
                                >
                                    { getFieldDecorator('industry', {
                                        initialValue: industry
                                    })(
                                        <Select 
                                            placeholder="Please select" 
                                            disabled={read_only ? true : false}
                                            onChange={value => set_industry(value)}
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
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 18}}
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
                                        ],
                                        initialValue: _stage
                                    })(
                                        <AutoComplete
                                            placeholder="Stage"
                                            allowClear
                                            onChange={value => autoComplete(value, stages, set_stage, set_stage_options)}
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
                                labelCol={{span: 7}}
                                wrapperCol={{span: 17}}
                            >
                                { getFieldDecorator('referred_by', {
                                    rules: [
                                        { 
                                            max: 50, 
                                            message: 'Referred by should not be more than 50 character(s)' 
                                        }
                                    ],
                                    initialValue: referred
                                })(
                                    <Input 
                                        placeholder="Referred by" 
                                        disabled={read_only ? true : false}
                                        allowClear 
                                        onChange={e => set_referred(e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Deal Contact Name"
                                labelAlign="left"
                                labelCol={{span: 10}}
                                wrapperCol={{span: 14}}
                            >
                                { getFieldDecorator('deal_contact_name', {
                                    rules: [
                                        { 
                                            max: 50, 
                                            message: 'Deal contact name should not be more than 50 character(s)' 
                                        }
                                    ],
                                    initialValue: contact_name
                                })(
                                    <Input 
                                        placeholder="Deal contact name" 
                                        disabled={read_only ? true : false}
                                        allowClear 
                                        onChange={e => set_contact_name(e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Deal Contact Email"
                                labelAlign="left"
                                labelCol={{span: 10}}
                                wrapperCol={{span: 14}}
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
                                    ],
                                    initialValue: contact_email
                                })(
                                    <Input 
                                        placeholder="Deal contact email" 
                                        disabled={read_only ? true : false}
                                        allowClear 
                                        onChange={e => set_contact_email(e.target.value)}
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
                            ],
                            initialValue: _summary
                        })(
                            <TextArea 
                                placeholder="Deal summary..." 
                                disabled={read_only ? true : false}
                                autoSize={{ minRows: 3, maxRows: 6 }} 
                                onChange={e => set_summary(e.target.value)}
                            />
                        )}
                    </Form.Item>
                </Panel>

            </Collapse>

        </Form>
    )
}

const DealForm = forwardRef((props, ref) => {
    const Updated = Form.create({ name: 'modify_deal_form' })(WrappedDealForm);
    return <Updated {...props} forwardedRef={ref} />
});

export default React.memo(DealForm);