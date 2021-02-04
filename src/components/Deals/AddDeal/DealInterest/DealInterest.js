import React, { useState, useEffect, useContext } from 'react';
import { Form, Col, Row, Select, Input, DatePicker, Button, message, Collapse } from 'antd';
import { HomeContext } from '../../../../containers/Home/Home';
import config from '../../../../config/config';
import { deal } from '../../../../actions';
import moment from 'moment';
import commaNumber from 'comma-number';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { disabledDate, isWholeOrDecimal } = config;
const { updateDealInterest } = deal;
const caption = "Next";

const WrappedDealInterest = props => {

    const { form: { getFieldDecorator, setFields, setFieldsValue, getFieldValue, resetFields }, next, deal_id } = props;

    const [interest_level_id, set_interest_level_id] = useState(null);
    const [interest_reason, set_interest_reason] = useState(null);
    const [anticipated_investment, set_anticipated_investment] = useState(null);
    const [funds_needed_date, set_funds_needed_date] = useState(null);
    const [hold_period, set_hold_period] = useState(null);
    const [projected_irr, set_projected_irr] = useState(null);
    const [notes, set_notes] = useState(null);

    const [loading, set_loading] = useState(false);

    const { interest_levels } = useContext(HomeContext);

    const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

    useEffect(() => {

        if (anticipated_investment && isNaN(anticipated_investment)) {

            setFields({
                anticipated_investment: {
                    value: commaNumber(anticipated_investment),
                    errors: [new Error('Anticipated investment must be a numeric value!')]
                }
            });
        } else {

            setFieldsValue({
                anticipated_investment: commaNumber(anticipated_investment)
            });
        }

    }, [anticipated_investment, setFields, setFieldsValue])

    const submitHandler = async e => {

        const caption = e.target.children[0].innerHTML;
        e.preventDefault();

        if (interest_level_id || interest_reason || anticipated_investment || funds_needed_date || hold_period || projected_irr || notes) {

            set_loading(true);

            const obj = {
                interest_level_id,
                anticipated_investment,
                interest_reason,
                funds_needed_date,
                hold_period,
                projected_irr,
                notes
            }

            const result = await updateDealInterest(deal_id, obj);
            const { message: msg } = result.data;

            if (result.status === 200) {

                message.success(msg);
                resetFields();

            } else {
                message.error(msg);
            }

            set_loading(false);
        }

        if (caption === "Next") {
            next();
        }
    }

    const changeDateHandler = date => {

        let value;

        if (!date) {
            value = date
        } else {
            value = moment(date)._d.toISOString();
        }
        set_funds_needed_date(value);  
    }

    const nextHandler = e => {

        const condition = getFieldValue('interest_level') || getFieldValue('interest_reason') || getFieldValue('anticipated_investment') || getFieldValue('funds_needed_date') || getFieldValue('hold_period') || getFieldValue('projected_irr') || getFieldValue('notes');
        
        if (condition) {
            submitHandler(e);
        } else {
            next();
        }
    }

    return (
        
        <Form onSubmit={submitHandler}>

            <Collapse
                defaultActiveKey={['1', '2', '3']}
            >

                <Panel
                    key="1"
                    header="Interest Level"
                >
                    <Form.Item
                        label="Interest Level"
                        labelAlign="left"
                        labelCol={{span: 3}}
                        wrapperCol={{span: 3}}
                    >
                        { getFieldDecorator('interest_level', {})(
                            <Select
                                placeholder="Please select"  
                                onChange={value => set_interest_level_id(value)}
                            >
                                { interest_levels.map(interest => (
                                    <Option
                                        key={interest.interest_level_id}
                                        value={interest.interest_level_id}
                                    >{interest.name}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Interest Reason"
                        labelAlign="left"
                        labelCol={{span: 3}}
                        wrapperCol={{span: 21}}
                    >
                        { getFieldDecorator('interest_reason', {})(
                            <TextArea 
                                placeholder="Interest reason..."
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                onChange={e => set_interest_reason(e.target.value)}
                            />
                        )}
                    </Form.Item>
                </Panel>

                <Panel
                    key="2"
                    header="Investment Parameters"
                >
                    <Row
                        gutter={gutter}
                    >
                        <Col span={8}>
                            <Form.Item
                                label="Anticipated Investment"
                                labelAlign="left"
                                labelCol={{span: 11}}
                                wrapperCol={{span: 13}}
                            >
                                { getFieldDecorator('anticipated_investment', {})(
                                    <Input 
                                        addonBefore="$"
                                        addonAfter=".00"
                                        placeholder="Anticipated investment"  
                                        onChange={e => set_anticipated_investment(e.target.value.replace(/,\s?/g ,""))}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Funds Needed Date"
                                labelAlign="left"
                                labelCol={{span: 13}}
                                wrapperCol={{span: 11}}
                            >
                                { getFieldDecorator('funds_needed_date', {})(
                                    <DatePicker 
                                        disabledDate={disabledDate} 
                                        onChange={changeDateHandler}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="Hold Period"
                                labelAlign="left"
                                labelCol={{span: 10}}
                                wrapperCol={{span: 14}}
                            >
                                { getFieldDecorator('hold_period', {})(
                                    <Input 
                                        placeholder="Hold period"
                                        onChange={e => set_hold_period(e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="My Projected IRR"
                                labelAlign="left"
                                labelCol={{span: 14}}
                                wrapperCol={{span: 10}}
                            >
                                { getFieldDecorator('projected_irr', {
                                    rules: [
                                        {
                                            validator: isWholeOrDecimal
                                        }
                                    ]
                                })(
                                    <Input 
                                        placeholder="IRR"
                                        onChange={e => set_projected_irr(e.target.value)}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Panel>

                <Panel
                    key="3"
                    header="Notes"
                >
                    <Form.Item
                        label="Notes"
                        labelAlign="left"
                        labelCol={{span: 2}}
                        wrapperCol={{span: 22}}
                    >
                        {
                            getFieldDecorator('notes', {
                                
                            })(
                                <TextArea 
                                    placeholder="Deal notes..."
                                    autoSize={{ minRows: 3, maxRows: 6 }} 
                                    onChange={e => set_notes(e.target.value)} 
                                />
                            )
                        }
                    </Form.Item>
                </Panel>

            </Collapse>

            <Button 
                type="primary" 
                htmlType="submit"
                style={{marginTop: 20}} 
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

        </Form>
    )
}

const DealInterest = Form.create({ name: 'deal_interest_form' })(WrappedDealInterest);
export default DealInterest;