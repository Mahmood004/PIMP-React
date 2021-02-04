import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Select, Checkbox, Form, Button, message } from 'antd';
import { HomeContext } from '../../../containers/Home/Home';
import { profile, industry } from '../../../actions';

const { Option } = Select;
const { updateProfile } = profile;
const { insertIndustry } = industry;

const WrappedExpertise = props => {

    const { industries, form: { getFieldDecorator, validateFields } } = props;

    const [_industries, set_industries] = useState([]);
    const [search, set_search] = useState([]);
    const [_skills, set_skills] = useState([]);
    const [loading, set_loading] = useState(false);
    const [skill_qa, set_skill_qa] = useState(false);
    const [industry_qa, set_industry_qa] = useState(false);

    const { auth_user: { profile, user_industries }, modified } = useContext(HomeContext);

    useEffect(() => {

        if (profile) {

            const attributes = JSON.parse(profile);
            const { skills, skill_QA, industry_QA } = attributes;

            set_skills(skills);

            if (skill_QA !== undefined)
                set_skill_qa(skill_QA);
            if (industry_QA !== undefined);
                set_industry_qa(industry_QA);
        }
            

        if (user_industries.length) {

            const industryList = user_industries
                .filter(user_industry => user_industry.relationship_type === 'E')
                .map(user_industry => user_industry.industry_id.toString());
            
            set_industries(industryList);

        }
        
    }, [profile, user_industries]);

    const handleSubmit = e => {
        
        e.preventDefault();

        validateFields(async (err, values) => {
            if (!err) {

                set_loading(true);

                const user = {
                    skills: _skills,
                    skill_QA: skill_qa,
                    industry_QA: industry_qa
                }

                const data = {
                    industries: _industries,
                    relationship_type: 'E'
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

    const searchSkills = value => {
        
        if (value.length > 2) {
            
            const skills = require('../../../utils/skills.json').filter(skill => skill.name.toLowerCase().startsWith(value.toLowerCase()));
            set_search(skills);
        } else {
            set_search([]);
        }
    }
    
    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <h2>Skills</h2>
                </Col>
            </Row>
            <Form.Item
                label="Skills"
                labelAlign="left"
                labelCol={{span: 2}}
                wrapperCol={{span: 22}}
            >
                { getFieldDecorator('skills', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your skills'
                        }
                    ],
                    initialValue: _skills
                })(
                    <Select
                        placeholder="Please enter at least 3 characters"
                        mode="tags"
                        allowClear
                        onChange={value => set_skills(value)}
                        onSearch={searchSkills}
                    >
                        { search.map((option, index) => (
                            <Option key={index} value={option.name}>{option.name}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
                
            <Form.Item>
                { getFieldDecorator('skill_qa', {})(
                    <Checkbox 
                        checked={skill_qa} 
                        onChange={e => set_skill_qa(e.target.checked)}
                    >
                        I am willing to answer questions/requests for expertise on these topics
                    </Checkbox>
                )}
            </Form.Item>
            
        
            <Form.Item
                label="Industries"
                labelAlign="left"
                labelCol={{span: 2}}
                wrapperCol={{span: 22}}
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
                        placeholder="Please select"
                        mode="tags"
                        allowClear
                        onChange={value => set_industries(value)}
                    >
                        { industries.map(option => (
                            <Option key={option.industry_id} value={option.industry_id.toString()}>{option.name}</Option>
                        ))}
                    </Select>
                ) }
            </Form.Item>

            <Form.Item>
                { getFieldDecorator('industry_qa', {})(
                    <Checkbox 
                        checked={industry_qa}
                        onChange={e => set_industry_qa(e.target.checked)}
                    >
                        I am willing to answer questions/requests for expertise on these industries
                    </Checkbox>
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

const Expertise = Form.create({ name: 'expertise_form' })(WrappedExpertise);

export default Expertise;