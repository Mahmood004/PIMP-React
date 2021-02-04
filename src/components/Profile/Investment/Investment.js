import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Select, Form, Button, message } from 'antd';
import { HomeContext } from '../../../containers/Home/Home';
import { profile, industry } from '../../../actions';

const { Option } = Select;
const { updateProfile } = profile;
const { insertIndustry } = industry;

const WrappedInvestment = props => {

    const { attributes, industries, form: { getFieldDecorator, validateFields } } = props;

    const investments_per_year = attributes.filter(attribute => attribute.attribute_name === 'investments_per_year');
    const amount_per_deal = attributes.filter(attribute => attribute.attribute_name === 'investment_amount_per_deal');

    const [investments, set_investments] = useState('');
    const [amount, set_amount] = useState('');
    const [_industries, set_industries] = useState([]);
    const [loading, set_loading] = useState(false);

    const { auth_user: { profile, user_industries }, modified } = useContext(HomeContext);

    useEffect(() => {

        if (profile) {

            const attributes = JSON.parse(profile);
            const { investments_per_year, investment_amount_per_deal } = attributes;

            set_investments(investments_per_year);
            set_amount(investment_amount_per_deal);

        }

        if (user_industries.length) {

            const industryList = user_industries
                .filter(user_industry => user_industry.relationship_type === 'I')
                .map(user_industry => user_industry.industry_id.toString());
            
            set_industries(industryList);

        }
    }, [profile, user_industries])

    const handleSubmit = e => {

        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                const user = {
                    investments_per_year: investments,
                    investment_amount_per_deal: amount
                }

                const data = {
                    industries: _industries,
                    relationship_type: 'I'
                }

                const result = await updateProfile(user);
                const res = await insertIndustry(data);

                const { message: _msg } = result.data;
                const { message: msg } = res.data;

                if (result.status === 200 && res.status === 200) {
                    modified();
                }

                if (result.status !== 200) {
                    message.error(_msg);
                }

                if (res.status !== 200) {
                    message.error(msg);
                }

                set_loading(false);
            }
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <h2>Investment Parameters</h2>
                </Col>
            </Row>

            <Form.Item
                label="Investments Per Year"
                labelAlign="left"
                labelCol={{span: 4}}
                wrapperCol={{span: 8}}
            >
                { getFieldDecorator('investments_per_year', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your investments per year'
                        }
                    ],
                    initialValue: investments
                })(
                    <Select  
                        placeholder="Please select"
                        allowClear
                        onChange={value => set_investments(value)}
                    >
                        { investments_per_year.map(option => (
                            <Option key={option.user_profile_attribute_id} value={option.attribute_value}>{option.attribute_value}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>

            <Form.Item
                label="Amount Per Deal"
                labelAlign="left"
                labelCol={{span: 3}}
                wrapperCol={{span: 9}}
            >
                { getFieldDecorator('investment_amount_per_deal', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your investment amount per deal'
                        }
                    ],
                    initialValue: amount
                })(
                    <Select 
                        placeholder="Please select"
                        allowClear
                        onChange={value => set_amount(value)}
                    >
                        { amount_per_deal.map(option => (
                            <Option key={option.user_profile_attribute_id} value={option.attribute_value}>{option.attribute_value}</Option>
                        ))}
                </Select>
                )}
            </Form.Item>
            
            <Form.Item
                label="Industries"
                labelAlign="left"
                labelCol={{span: 3}}
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('industries', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your industries'
                        }
                    ],
                    initialValue: _industries
                })(
                    <Select  
                        mode="tags" 
                        placeholder="Please select"
                        allowClear
                        onChange={value => set_industries(value)}
                    >
                        { industries.map(option => (
                            <Option key={option.industry_id} value={option.industry_id.toString()}>{option.name}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
            <Row>
                <Col>
                    <Button type="primary" htmlType="submit" disabled={loading ? true : false}>Submit</Button>
                </Col>
            </Row>
            
        </Form>
    )
}

const Investment = Form.create({ name: 'investment_form' })(WrappedInvestment)

export default Investment;