import React, { useState, useEffect } from 'react';
import { Row, Col, Checkbox, Select, Input, DatePicker, Form, Button, Spin, AutoComplete, Collapse, message } from 'antd';
import moment from 'moment';
import stages from '../../../../utils/autocomplete/stages';
import { circle, deal } from '../../../../actions';
import config from '../../../../config/config';
import withDeal from '../../../../hoc/withDeal';
import commaNumber from 'comma-number';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { postDeal } = deal;
const { getUserCircles } = circle;
const { isWholeOrDecimal, disabledDate, autoComplete } = config;
const caption = "Next";

const WrappedDealForm = props => {

    const {  
        next,
        deal_id,
        set_deal_id,
        set_deal_profile,
        types,
        instruments,
        industries,
        form: { getFieldDecorator, validateFields, setFields, setFieldsValue, resetFields } 
    } = props;

    const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

    const [categories, set_categories] = useState([]);
    const [sub_categories, set_sub_categories] = useState([]);

    const [user_circles, set_user_circles] = useState(null);
    const [deal_circles, set_deal_circles] = useState([]);

    const [deal_type_id, set_deal_type_id] = useState(null);
    const [deal_category_id, set_deal_category_id] = useState(null);
    const [deal_sub_category_id, set_deal_sub_category_id] = useState(null);
    const [company_name, set_company_name] = useState(null);
    const [sponsor_name, set_sponsor_name] = useState(null);
    const [location, set_location] = useState(null);
    const [referred_by, set_referred_by] = useState(null);
    const [deal_contact_name, set_deal_contact_name] = useState(null);
    const [deal_contact_email, set_deal_contact_email] = useState(null);
    const [short_description, set_short_description] = useState(null);
    const [deal_instrument_id, set_deal_instrument_id] = useState(null);
    const [deal_industry_id, set_deal_industry_id] = useState(null);
    const [projected_irr, set_projected_irr] = useState(null);
    const [projected_multiple, set_projected_multiple] = useState(null);
    const [valuation, set_valuation] = useState(null);
    const [stage, set_stage] = useState(null);
    const [stage_options, set_stage_options] = useState(stages.map(stage => <Option key={stage}>{stage}</Option>));
    const [investment_amount_sought, set_investment_amount_sought] = useState(null);
    const [minimum_investment, set_minimum_investment] = useState(null);
    const [expected_close_date, set_expected_close_date] = useState(null);
    const [summary, set_summary] = useState(null);

    const [loading, set_loading] = useState(false);
    
    useEffect(() => {

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

    }, [minimum_investment, investment_amount_sought, valuation, setFieldsValue, setFields])

    useEffect(() => {

        async function fetchUserCircles() {

            const result = await getUserCircles();
            const { circles, message: msg } = result.data;
    
            if (result.status === 200) {
                set_user_circles(circles);
            } else {
                message.error(msg);
            }
        }

        fetchUserCircles();
    }, []);

    useEffect(() => {

        if (types.length) {
            const obj = types.find(({ deal_type_id: type }) => type === deal_type_id);
            if (obj) {
                set_categories(obj.deal_categories);
            }
        }

    }, [types, deal_type_id]);

    useEffect(() => {

        if (categories.length) {
            if (deal_category_id) {
                const obj = categories.find(({ deal_category_id: category }) => category === deal_category_id);
                set_sub_categories(obj.deal_sub_categories);
            } else {
                set_sub_categories([]);
            }
        }

    }, [categories, deal_category_id]);

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

        set_deal_type_id(value);
        set_deal_category_id(null);
    }

    const changeCategoryHandler = async value => {

        setFieldsValue({
            sub_category: ''
        });

        set_deal_category_id(value);
        set_deal_sub_category_id(null);

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
        set_expected_close_date(value);  
    }
    
    const submitDeal = async e => {
    
        const caption = e.target.children[0].innerHTML;
        e.preventDefault();
        
        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);
                const attributes = {};

                if (deal_category_id === 1) {

                    attributes.valuation = valuation;
                    attributes.stage = stage;

                } else {

                    attributes.projected_irr = projected_irr;
                    attributes.projected_multiple = projected_multiple;
                }

                let deal = {
                    deal_circles,
                    deal_type_id,
                    deal_category_id,
                    deal_sub_category_id,
                    company_name,
                    sponsor_name,
                    location,
                    referred_by,
                    deal_contact_name,
                    deal_contact_email,
                    short_description,
                    deal_instrument_id,
                    deal_industry_id,
                    ...attributes,
                    investment_amount_sought,
                    minimum_investment,
                    expected_close_date,
                    summary
                }

                const result = await postDeal(deal);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    set_deal_id(result.data.deal_id);
                    resetFields();

                } else {
                    message.error(msg);
                }

                set_loading(false);

                if (caption === "Next") {
                    next();
                }
            }
        })
    }

    const nextHandler = e => {
        
        if (!deal_id) {
            submitDeal(e);
        } else {
            next();
        }
    }

    return (

        Array.isArray(user_circles) ? (

            <Form onSubmit={submitDeal}>
            
                <Collapse
                    defaultActiveKey={['1', '2', '3', '4', '5']}
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
                                            <Col key={circle.circle_id} span={6}>
                                                <Checkbox 
                                                    id={circle.circle_id.toString()} 
                                                    onChange={checkboxHandler}
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
                            <Col span={5}>
                                <Form.Item
                                    label="Type"
                                    labelCol={{span: 6}}
                                    labelAlign="left"
                                    wrapperCol={{span: 18}}
                                >
                                    { getFieldDecorator('type', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input deal type'
                                            }
                                        ]
                                    })(
                                        <Select 
                                            placeholder="Please select"  
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
                                    label="Category"
                                    labelCol={{span: 8}}
                                    labelAlign="left"
                                    wrapperCol={{span: 16}}
                                >
                                    { getFieldDecorator('category', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input deal category'
                                            }
                                        ]
                                    })(
                                        <Select 
                                            placeholder="Please select"  
                                            onChange={value => changeCategoryHandler(value)} 
                                            disabled={!categories.length ? true : false} 
                                            loading={loading ? true : false}
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
                            <Col span={7}>
                                <Form.Item
                                    label="Sub Category"
                                    labelCol={{span: 8}}
                                    labelAlign="left"
                                    wrapperCol={{span: 16}}
                                >
                                    { getFieldDecorator('sub_category', {

                                    })(
                                        <Select 
                                            placeholder="Please select" 
                                            onChange={value => set_deal_sub_category_id(value)} 
                                            disabled={!sub_categories.length ? true : false} 
                                            loading={loading ? true : false}
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
                                    labelCol={{span: 8}}
                                    labelAlign="left"
                                    wrapperCol={{span: 16}}
                                >
                                    { getFieldDecorator('instrument', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input deal instrument'
                                            }
                                        ]
                                    })(
                                        <Select 
                                            placeholder="Please select" 
                                            onChange={value => set_deal_instrument_id(value)} 
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
                                            onChange={e => set_investment_amount_sought(e.target.value.replace(/,\s?/g, ""))}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            { deal_category_id === 1 && (
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
                                                onChange={e => set_valuation(e.target.value.replace(/,\s?/g, ""))}
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
                                            onChange={e => set_minimum_investment(e.target.value.replace(/,\s?/g, ""))} 
                                        />
                                    )}
                                </Form.Item>
                            </Col> 
                            { deal_category_id !== 1 && (
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
                                                    onChange={e => set_projected_irr(e.target.value)}
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
                                                    onChange={e => set_projected_multiple(e.target.value)}
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
                                ]
                            })(
                                <Input 
                                    placeholder="Deal short description..." 
                                    allowClear 
                                    onChange={e => set_short_description(e.target.value)} 
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
                                            onChange={e => set_company_name(e.target.value)}
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
                                            onChange={e => set_sponsor_name(e.target.value)}
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
                                            onChange={e => set_location(e.target.value)}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        { deal_category_id === 1 && (
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
                                                onChange={value => set_deal_industry_id(value)}
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
                                            onChange={e => set_referred_by(e.target.value)}
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
                                            onChange={e => set_deal_contact_name(e.target.value)}
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
                                            onChange={e => set_deal_contact_email(e.target.value)}
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
                                    onChange={e => set_summary(e.target.value)} 
                                />
                            )}
                        </Form.Item>
                    </Panel>

                </Collapse>

                <div className="steps-action">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        disabled={loading ? true : false}
                    >
                        Done
                    </Button>
                    <Button
                        type="primary"
                        htmlType="button"
                        onClick={nextHandler}
                        disabled={loading ? true : false}
                        className="ml-15"
                    >
                        {caption}
                    </Button>
                </div>

            </Form>
        
        ) : (
            <div className="loader">
                <Spin tip="Loading..." />
            </div>
        )
    )
}

const DealForm = Form.create({ name: 'deal_form' })(withDeal(WrappedDealForm));

export default DealForm;