import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Input, Icon, Tooltip, Form, Button, message } from 'antd';
import { HomeContext } from '../../../containers/Home/Home';
import { profile } from '../../../actions';

const { updateProfile } = profile;
const { TextArea } = Input;

const WrappedAbout = props => {

    const { form: { getFieldDecorator, validateFields } } = props;

    const [first_name, set_first_name] = useState('');
    const [last_name, set_last_name] = useState('');
    const [company, set_company] = useState('');
    const [business_phone, set_business_phone] = useState('');
    const [mobile_phone, set_mobile_phone] = useState('');
    const [linkedin_profile_url, set_linkedin] = useState('');
    const [twitter, set_twitter] = useState('');
    const [headline, set_headline] = useState('');
    const [location, set_location] = useState('');
    const [summary, set_summary] = useState('');
    const [loading, set_loading] = useState(false);

    const { auth_user: { first_name: fname, last_name: lname, email, profile }, modified } = useContext(HomeContext);

    useEffect(() => {

        set_first_name(fname);
        set_last_name(lname)

    }, [fname, lname]);

    useEffect(() => {
        
        if (profile) {

            const attributes = JSON.parse(profile);
            const { company, business_phone, mobile_phone, linkedin_profile_url, twitter, headline, location, summary } = attributes;

            set_company(company);
            set_business_phone(business_phone);
            set_mobile_phone(mobile_phone);
            set_linkedin(linkedin_profile_url);
            set_twitter(twitter);
            set_headline(headline);
            set_location(location);
            set_summary(summary);
        }

    }, [profile]);

    const submitHandler = e => {

        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                const user = {
                    first_name,
                    last_name,
                    company,
                    mobile_phone,
                    business_phone,
                    linkedin_profile_url,
                    twitter,
                    headline,
                    location,
                    summary
                }
        
                const result = await updateProfile(user);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    message.success(msg);
                    modified();
                    
                } else {
                    message.error(msg);
                }

                set_loading(false);
            }
        });

        
        
    }

    const checkPhone = (rule, value, callback) => {

        let field;

        if (rule.field === "mobile_phone") {
            field = "Mobile"
        } else {
            field = "Business"
        }

        if (value && !/^\(?([0-9]{0,3})\)?[-. ]?([0-9]{0,3})[-. ]?([0-9]{0,4})$/.test(value)) {
            callback(`${field} phone format is not valid`);
        } else {
            callback();
        }
        
    }

    return (
        
        <Form 
            onSubmit={submitHandler}
        >
            <Row>
                <Col><h2>Contact Info</h2></Col>
            </Row>

            <Row
                gutter={8}
            >
                <Col span={8}>
                    <Form.Item 
                        label="First Name" 
                        labelCol={{span: 6}} 
                        labelAlign="left" 
                        wrapperCol={{span: 18}}
                    >
                        { getFieldDecorator('first_name', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your first name'
                                }
                            ],
                            initialValue: first_name
                        })(
                            <Input 
                                placeholder="First name" 
                                allowClear
                                prefix={<Icon type="user" style={styles.prefixIcon} />}
                                suffix={
                                    <Tooltip title="Contact Info">
                                    <Icon type="info-circle" style={styles.suffixIcon} />
                                    </Tooltip>
                                }
                                onChange={e => set_first_name(e.target.value)}
                            />
                        )}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item 
                        label="Last Name" 
                        labelCol={{span: 6}} 
                        labelAlign="left" 
                        wrapperCol={{span: 18}}
                    >
                        { getFieldDecorator('last_name', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your last name'
                                }
                            ],
                            initialValue: last_name
                        })(
                            <Input 
                                placeholder="Last name" 
                                allowClear
                                prefix={<Icon type="user" style={styles.prefixIcon} />}
                                suffix={
                                    <Tooltip title="Contact Info">
                                    <Icon type="info-circle" style={styles.suffixIcon} />
                                    </Tooltip>
                                }
                                onChange={e => set_last_name(e.target.value)}
                            />
                        )}  
                        
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item 
                        label="Email" 
                        labelCol={{span: 6}} 
                        labelAlign="left" 
                        wrapperCol={{span: 18}}
                    >
                        { getFieldDecorator('email', {
                            initialValue: email,
                            
                        })(
                            <Input 
                                placeholder="Email" 
                                prefix={<Icon type="mail" style={styles.prefixIcon} />}
                                suffix={
                                    <Tooltip title="Contact Info">
                                    <Icon type="info-circle" style={styles.suffixIcon} />
                                    </Tooltip>
                                }
                                readOnly
                            />
                        )}  
                        
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item 
                label="Company" 
                labelCol={{span: 3}} 
                labelAlign="left" 
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('company', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your company'
                        }
                    ],
                    initialValue: company
                })(
                    <Input 
                        placeholder="Company/Firm name" 
                        allowClear
                        prefix={<Icon type="bank" style={styles.prefixIcon} />}
                        suffix={
                            <Tooltip title="Contact Info">
                            <Icon type="info-circle" style={styles.suffixIcon} />
                            </Tooltip>
                        }
                        onChange={e => set_company(e.target.value)}
                    />
                )}
            </Form.Item>
                
            
            <Row
                gutter={12}
            >
                <Col span={12}>
                    <Form.Item 
                        label="Business Phone" 
                        labelCol={{span: 6}} 
                        labelAlign="left" 
                        wrapperCol={{span: 18}}
                    >
                        { getFieldDecorator('business_phone', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your business phone'
                                },
                                { 
                                    validator: checkPhone
                                }
                            ],
                            initialValue: business_phone
                        })(
                            <Input 
                                placeholder="Business phone" 
                                allowClear
                                prefix={<Icon type="phone" style={styles.prefixIcon} />}
                                suffix={
                                    <Tooltip title="Contact Info">
                                    <Icon type="info-circle" style={styles.suffixIcon} />
                                    </Tooltip>
                                }
                                onChange={e => set_business_phone(e.target.value)}
                            />
                        )}
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item 
                        label="Mobile Phone" 
                        labelCol={{span: 6}} 
                        labelAlign="left" 
                        wrapperCol={{span: 18}}
                    >
                        { getFieldDecorator('mobile_phone', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your mobile phone'
                                },
                                {
                                    validator: checkPhone
                                }
                            ],
                            initialValue: mobile_phone
                        })(
                            <Input 
                                placeholder="Mobile phone" 
                                allowClear
                                prefix={<Icon type="phone" style={styles.prefixIcon} />}
                                suffix={
                                    <Tooltip title="Contact Info">
                                    <Icon type="info-circle" style={styles.suffixIcon} />
                                    </Tooltip>
                                }
                                onChange={e => set_mobile_phone(e.target.value)}
                            />
                        )}  
                        
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item 
                label="LinkedIn URL" 
                labelAlign="left" 
                labelCol={{span: 3}} 
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('linkedin', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your linkedin url'
                        }
                    ],
                    initialValue: linkedin_profile_url
                })(
                    <Input 
                        placeholder="LinkedIn url" 
                        allowClear
                        prefix={<Icon type="linkedin" style={styles.prefixIcon} />}
                        suffix={
                            <Tooltip title="Contact Info">
                            <Icon type="info-circle" style={styles.suffixIcon} />
                            </Tooltip>
                        }
                        onChange={e => set_linkedin(e.target.value)}
                    />
                )}
                
            </Form.Item>
            
            <Form.Item 
                label="Twitter Handle" 
                labelAlign="left" 
                labelCol={{span: 3}} 
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('twitter', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your twitter handle'
                        }
                    ],
                    initialValue: twitter
                })(
                    <Input 
                        placeholder="Twitter handle" 
                        allowClear
                        prefix={<Icon type="twitter" style={styles.prefixIcon} />}
                        suffix={
                            <Tooltip title="Contact Info">
                            <Icon type="info-circle" style={styles.suffixIcon} />
                            </Tooltip>
                        }
                        onChange={e => set_twitter(e.target.value)}
                    />
                )}
            </Form.Item>
            
            <Row>
                <Col><h2>Profile</h2></Col>
            </Row>
            
            <Form.Item 
                label="Headline" 
                labelAlign="left" 
                labelCol={{span: 3}} 
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('headline', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your headline'
                        }
                    ],
                    initialValue: headline
                })(
                    <Input 
                        placeholder="Headline"
                        allowClear
                        prefix={<Icon type="profile" style={styles.prefixIcon} />}
                        suffix={
                            <Tooltip title="Profile">
                                <Icon type="info-circle" style={styles.suffixIcon} />
                            </Tooltip>
                        }
                        onChange={e => set_headline(e.target.value)}
                    />
                )}    
            </Form.Item>
            
            <Form.Item 
                label="Location" 
                labelAlign="left" 
                labelCol={{span: 3}} 
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('location', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your location'
                        }
                    ],
                    initialValue: location
                })(
                    <Input 
                        placeholder="Location"
                        allowClear
                        prefix={<Icon type="environment" style={styles.prefixIcon} />}
                        suffix={
                            <Tooltip title="Profile">
                                <Icon type="info-circle" style={styles.suffixIcon} />
                            </Tooltip>
                        }
                        onChange={e => set_location(e.target.value)}
                    />
                )}
                
            </Form.Item>
            
            <Form.Item 
                label="Summary" 
                labelAlign="left" 
                labelCol={{span: 3}} 
                wrapperCol={{span: 21}}
            >
                { getFieldDecorator('summary', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your summary' 
                        }
                    ],
                    initialValue: summary
                })(
                    <TextArea 
                        placeholder="Summary..." 
                        autoSize={{minRows: 3, maxRows: 6}}
                        onChange={e => set_summary(e.target.value)}

                    />
                )}
            </Form.Item>
            
            <Row>
                <Col>
                    <Button type="primary" htmlType="submit" disabled={loading ? true : false}>Submit</Button>
                </Col>
            </Row>
        </Form>
        
    );
}

const styles = {
    prefixIcon: {
        color: 'rgba(0, 0, 0, 0.5)'
    },
    suffixIcon: {
        color: 'rgba(0, 0, 0, 0.4)'
    }
}

const About = Form.create({ name: 'about_form' })(WrappedAbout)

export default About;