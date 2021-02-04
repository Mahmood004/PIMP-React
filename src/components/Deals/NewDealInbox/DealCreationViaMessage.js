import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Input, DatePicker, AutoComplete, message } from 'antd';
import withDeal from '../../../hoc/withDeal';
import moment from 'moment';
import stages from '../../../utils/autocomplete/stages';
import { deal } from '../../../actions';
import config from '../../../config/config';
import commaNumber from 'comma-number';

const { Option } = Select;
const { postDeal } = deal;
const { isWholeOrDecimal, disabledDate } = config;

const DealCreationViaMessage = props => {

    const { 
        message: { key, sender, subject, body, data },
        delivered,
        types, 
        categories, 
        sub_categories,
        instruments, 
        industries,
        categoriesByType,
        subCategoriesByCategory,
        form: { getFieldDecorator, validateFields, setFields, setFieldsValue, resetFields } 
    } = props;

    const [company, set_company] = useState(null);
    const [sponsor, set_sponsor] = useState(null);
    const [type, set_type] = useState(null);
    const [category, set_category] = useState(null);
    const [sub_category, set_sub_category] = useState(null);
    const [short_description, set_short_description] = useState(null);
    const [summary, set_summary] = useState(null);
    const [location, set_location] = useState(null);
    const [referred_by, set_referred_by] = useState(null);
    const [deal_contact_name, set_deal_contact_name] = useState(null);
    const [deal_contact_email, set_deal_contact_email] = useState(null);
    const [projected_irr, set_projected_irr] = useState(null);
    const [projected_multiple, set_projected_multiple] = useState(null);
    const [stage, set_stage] = useState(null);
    const [stage_options, set_stage_options] = useState(stages.map(stage => <Option key={stage}>{stage}</Option>));
    const [valuation, set_valuation] = useState(null);
    const [instrument, set_instrument] = useState(null);
    const [industry, set_industry] = useState(null);
    const [investment_amount_sought, set_investment_amount_sought] = useState(null);
    const [minimum_investment, set_minimum_investment] = useState(null);
    const [expected_close_date, set_expected_close_date] = useState(null);
    const [loading, set_loading] = useState(false);

    useEffect(() => {

        let company, sponsor, description, summary, location, referred, irr, multiple, stage, valuation, investment, minimum, close, name, email;

        if (subject) {

            description = subject;
            
            if (subject.startsWith("FW:")) {

                if (sender.includes('[')) {
                    name = sender.split('[')[0].trim();
                    email = sender.split('[')[1].split(':')[1].split(']')[0];
                } else {
                    name = sender.split('<')[0].trim();
                    email = sender.split('<')[1].split('>')[0];
                }
                
            }
        }

        if (body) {
            
            const contents = body.split("\n");
            contents.forEach(content => {
                
                if (content.startsWith("/")) {

                    const field = content.substr(0, content.indexOf(' '));
                    const value = content.substr(content.indexOf(' ') + 1);

                    switch(field) {
                        case "/company_name": 
                            company = value;
                            break;
                        case "/sponsor_name": 
                            sponsor = value;
                            break;
                        case "/location": 
                            location = value;
                            break;
                        case "/referred_by": 
                            referred = value;
                            break;
                        case "/deal_contact_name": 
                            name = value;
                            break;
                        case "/deal_contact_email": 
                            email = value;
                            break;
                        case "/short_description": 
                            description = value;
                            break;
                        case "/summary": 
                            summary = value;
                            break;
                        case "/investment_amount_sought": 
                            investment = value;
                            break;
                        case "/minimum_investment": 
                            minimum = value;
                            break;
                        case "/expected_close_date": 
                            close = value ? moment(value) : null;
                            break;
                        case "/projected_irr": 
                            irr = value;
                            break;
                        case "/projected_multiple": 
                            multiple = value;
                            break;
                        case "/valuation": 
                            valuation = value;
                            break;
                        case "/stage": 
                            stage = value;
                            break;
                        default: 
                    }

                }
            })
        }

        set_company(company);
        set_sponsor(sponsor);
        set_location(location);
        set_referred_by(referred);
        set_deal_contact_name(name);
        set_deal_contact_email(email);
        set_short_description(description);
        set_summary(summary);
        set_investment_amount_sought(investment);
        set_minimum_investment(minimum);
        set_expected_close_date(close);
        set_projected_irr(irr);
        set_projected_multiple(multiple);
        set_valuation(valuation);
        set_stage(stage); 
    
        setFieldsValue({ company });
        setFieldsValue({ sponsor });
        setFieldsValue({ location });
        setFieldsValue({ referred });
        setFieldsValue({ name });
        setFieldsValue({ email });
        setFieldsValue({ description });
        setFieldsValue({ summary });
        setFieldsValue({ investment });
        setFieldsValue({ minimum });
        setFieldsValue({ close });
        setFieldsValue({ irr });
        setFieldsValue({ multiple });
        setFieldsValue({ valuation });
        setFieldsValue({ stage });
        
    }, [sender, subject, body, setFields, setFieldsValue]);

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
                investment: commaNumber(investment_amount_sought)
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

    }, [minimum_investment, investment_amount_sought, valuation, setFields, setFieldsValue])

    const changeTypeHandler = value => {

        setFieldsValue({
            category: '',
            sub_category: ''
        });

        set_type(value);
        categoriesByType(value);
        set_category(null);
    }

    const changeCategoryHandler = value => {

        setFieldsValue({
            sub_category: ''
        });

        set_category(value);
        subCategoriesByCategory(value);
        set_sub_category(null);
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

    const submitHandler = e => {

        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);
                const attributes = {};

                if (category === 1) {

                    attributes.valuation = valuation;
                    attributes.stage = stage;

                } else {

                    attributes.projected_irr = projected_irr;
                    attributes.projected_multiple = projected_multiple;
                }

                const deal = {
                    company_name: company,
                    sponsor_name: sponsor,
                    deal_type_id: type,
                    deal_category_id: category,
                    deal_sub_category_id: sub_category,
                    short_description,
                    summary,
                    investment_amount_sought,
                    minimum_investment,
                    expected_close_date,
                    location, 
                    referred_by,
                    deal_contact_name,
                    deal_contact_email,
                    ...attributes,
                    deal_instrument_id: instrument,
                    deal_industry_id: industry,
                    message: data
                }

                const result = await postDeal(deal);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    resetFields();
                    delivered(key);
                    message.success(msg);

                } else {
                    message.error(msg);
                }  
                
                set_loading(false);
            }
        });
    }

    const handleSearch = value => {
        
        let options = stages;

        if (value) {
            options = stages.filter(stage => stage.toLowerCase().includes(value.toLowerCase()));
        } 
        
        set_stage(value);
        set_stage_options(options.map(option => <Option key={option}>{option}</Option>));
    }

    return (

        <Form 
            onSubmit={submitHandler}
        >

            <Form.Item 
                label="Type"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('type', {
                    rules: [
                        { required: true, message: 'Please select type!' }
                    ]
                })(
                    <Select
                        placeholder="Select type"
                        onChange={value => changeTypeHandler(value)}
                        style={styles.dropdwon}
                    >
                        { types.map(({ deal_type_id, description }) => (
                            <Option
                                key={deal_type_id}
                                value={deal_type_id}
                            >
                                {description}
                            </Option>
                        ))}
                    </Select>
                )}
            </Form.Item>

            <Form.Item 
                label="Category"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('category', {
                    rules: [
                        { required: true, message: 'Please select category!' }
                    ]
                })(
                    <Select
                        placeholder="Select category"
                        onChange={value => changeCategoryHandler(value)}
                        style={styles.dropdwon}
                    >
                        { categories.map(({ deal_category_id, description }) => (
                            <Option
                                key={deal_category_id}
                                value={deal_category_id}
                            >
                                {description}
                            </Option>
                        ))}
                    </Select>
                )}
            </Form.Item>

            <Form.Item 
                label="Sub Category"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('sub_category', {})(
                    <Select
                        placeholder="Select sub category"
                        onChange={value => set_sub_category(value)}
                        style={styles.dropdwon}
                    >
                        { sub_categories.map(({ deal_sub_category_id, description }) => (
                            <Option
                                key={deal_sub_category_id}
                                value={deal_sub_category_id}
                            >
                                {description}
                            </Option>
                        ))}
                    </Select>
                )}
            </Form.Item>

            <Form.Item 
                label="Company Name"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('company', {
                    rules: [
                        { required: true, message: 'Please input company!' }
                    ]
                })(
                    <Input
                        placeholder="Company name"
                        allowClear
                        onChange={e => set_company(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Sponsor Name"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('sponsor', {
                    rules: [
                        { required: true, message: 'Please input sponsor!' }
                    ]
                })(
                    <Input
                        placeholder="Sponsor name"
                        allowClear
                        onChange={e => set_sponsor(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Location"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('location', {
                    rules: [
                        { required: true, message: 'Please input location!' }
                    ]
                })(
                    <Input
                        placeholder="Location"
                        allowClear
                        onChange={e => set_location(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Referred By"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('referred', {
                    rules: [
                        { max: 50, message: 'Referred by should not be more than 50 character(s)' }
                    ]
                })(
                    <Input
                        placeholder="Referred by"
                        allowClear
                        onChange={e => set_referred_by(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Deal Contact Name"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('name', {
                    rules: [
                        { max: 50, message: 'Deal contact name should not be more than 50 character(s)' }
                    ]
                })(
                    <Input
                        placeholder="Deal contact name"
                        allowClear
                        onChange={e => set_deal_contact_name(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Deal Contact Email"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('email', {
                    rules: [
                        { type: 'email', message: 'The input is not valid email!' },
                        { max: 50, message: 'Deal contact email should not be more than 50 character(s)' }
                    ]
                })(
                    <Input
                        placeholder="Deal contact email"
                        allowClear
                        onChange={e => set_deal_contact_email(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Short Description"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('description', {
                    rules: [
                        { required: true, message: 'Please input short description!' }
                    ]
                })(
                    <Input
                        placeholder="Deal short description"
                        allowClear
                        onChange={e => set_short_description(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Summary"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('summary', {
                    rules: [
                        { required: true, message: 'Please input summary!' }
                    ]
                })(
                    <Input
                        placeholder="Deal summary"
                        allowClear
                        onChange={e => set_summary(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Investment Amount Sought"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('investment', {
                    rules: [
                        { required: true, message: 'Please input investment!' }
                    ]
                })(
                    <Input
                        addonBefore="$"
                        addonAfter=".00"
                        placeholder="Investment amount sought"
                        allowClear
                        onChange={e => set_investment_amount_sought(e.target.value.replace(/,\s?/g, ""))} 
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Minimum Investment"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('minimum', {
                    rules: [
                        { required: true, message: 'Please input minimum!' }
                    ]
                })(
                    <Input
                        addonBefore="$"
                        addonAfter=".00"
                        placeholder="Minimum investment"
                        allowClear
                        onChange={e => set_minimum_investment(e.target.value.replace(/,\s?/g, ""))} 
                    />
                )}
            </Form.Item>

            <Form.Item 
                label="Expected Close Date"
                labelAlign="left"
                style={styles.item}
            >
                { getFieldDecorator('close', {})(
                    <DatePicker 
                        disabledDate={disabledDate}
                        style={styles.dropdown}
                        onChange={changeDateHandler} 
                    />
                )}
            </Form.Item>

            <Form.Item
                label="Instrument"
                labelAlign="left"
                style={styles.item}
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
                        style={styles.dropdown} 
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

            { category !== 1 ? (

                <Form.Item
                    label="Projected IRR"
                    labelAlign="left"
                    style={styles.item}
                >
                    { getFieldDecorator('irr', {
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
                            allowClear 
                            onChange={e => set_projected_irr(e.target.value)}
                        />
                    )}

                </Form.Item>

            ) : (

                <Form.Item
                    label="Valuation"
                    labelAlign="left"
                    style={styles.item}
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
                            allowClear 
                            onChange={e => set_valuation(e.target.value.replace(/,\s?/g, ""))}
                        />
                    )}

                </Form.Item>
            )}

            { category !== 1 ? (
            
                <Form.Item
                    label="Projected Multiple"
                    labelAlign="left"
                    style={styles.item}
                >
                    { getFieldDecorator('multiple', {
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
                            allowClear 
                            onChange={e => set_projected_multiple(e.target.value)}
                        />
                    )}

                </Form.Item>

            ) : (

                <Form.Item
                    label="Stage"
                    labelAlign="left"
                    style={styles.item}
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
                            onChange={handleSearch}
                        >
                            {stage_options}
                        </AutoComplete>
                    )}

                </Form.Item>
            )}

            { category === 1 && (
                <Form.Item 
                    label="Industry"
                    labelAlign="left"
                    style={styles.item}
                >
                    { getFieldDecorator('industry', {})(
                        <Select
                            placeholder="Select industry"
                            onChange={value => set_industry(value)}
                            style={styles.dropdwon}
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
            )}

            <Button
                type="primary"
                htmlType="submit"
                block
                style={styles.button}
                disabled={loading ? true : false}
            >
                Create
            </Button>
        </Form>
    )

}

const styles = {
    dropdwon: {
        width: 200
    },
    item: {
        margin: 0
    },
    button: {
        marginTop: 15
    }
}

export default Form.create({ name: 'deal_creation_via_message' })(withDeal(DealCreationViaMessage));