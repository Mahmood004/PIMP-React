import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Collapse, message, Button } from 'antd';
import moment from 'moment';
import DealInterestHistory from '../../Popup/DealInterestHistory/DealInterestHistory';
import commaNumber from 'comma-number';
import { deal } from '../../../../actions';
import config from '../../../../config/config';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { isWholeOrDecimal, get_deal_sheet_aks, set_deal_sheet_aks } = config;
const { updateDealInterest } = deal;
const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const WrappedDealSheet = props => {

    const { forwardedRef, ...rest } = props;

    const { 
        deal: { 
            deal_id,
            user_deal_interests
        }, 
        interests,
        toggle,
        sub_menu,
        form: { getFieldDecorator, setFields, setFieldsValue }, 
    } = rest;

    const [_interest_level, set_interest_level] = useState(user_deal_interests[0] && user_deal_interests[0].interest_level_id);
    const [_anticipated_investment, set_anticipated_investment] = useState(user_deal_interests[0] && user_deal_interests[0].anticipated_investment);
    const [_interest_reason, set_interest_reason] = useState(user_deal_interests[0] && user_deal_interests[0].interest_reason);
    const [_funds_needed_date, set_funds_needed_date] = useState(user_deal_interests[0] && user_deal_interests[0].funds_needed_date);
    const [_hold_period, set_hold_period] = useState(user_deal_interests[0] && user_deal_interests[0].hold_period);
    const [_projected_irr, set_projected_irr] = useState(user_deal_interests[0] && user_deal_interests[0].projected_irr);
    const [_notes, set_notes] = useState(user_deal_interests[0] && user_deal_interests[0].notes);
    const [history_visibility, set_history_visibility] = useState(false);

    useEffect(() => {

        if (_anticipated_investment && isNaN(_anticipated_investment)) {

            setFields({
                anticipated_investment: {
                    value: commaNumber(_anticipated_investment),
                    errors: [new Error('Anticipated investment must be a numeric value!')]
                }
            });
        } else {

            setFieldsValue({
                anticipated_investment: commaNumber(_anticipated_investment)
            });
        }

    }, [setFields, setFieldsValue, _anticipated_investment])

    const changeDateHandler = date => {

        let value;

        if (!date) {
            value = date
        } else {
            value = moment(date)._d.toISOString();
        }
        set_funds_needed_date(value);
    }

    const disabledDate = current => {
        return current && current < moment().endOf('day');
    }

    useImperativeHandle(forwardedRef, () => ({

        submitHandler: async () => {

            const obj = {
                interest_level_id: _interest_level,
                anticipated_investment: _anticipated_investment,
                interest_reason: _interest_reason,
                funds_needed_date: _funds_needed_date,
                hold_period: _hold_period,
                projected_irr: _projected_irr,
                notes: _notes
            }
    
            const result = await updateDealInterest(deal_id, obj);
            const { message: msg } = result.data;
    
            if (result.status === 200) {
                toggle();
            } else {
                message.error(msg);
            }
        }
    }));
    
    return (
        <React.Fragment>

            <Form>
                <Collapse
                    onChange={set_deal_sheet_aks}
                    defaultActiveKey={get_deal_sheet_aks() ? get_deal_sheet_aks().split(',') : []}
                >
                    <Panel
                        key="1"
                        header="Interest Level"
                    >
                        <Row
                            gutter={gutter}
                            className="interest-selection-row"
                        >
                            <Col 
                                span={8}
                            >
                                <Form.Item
                                    label="Interest Level"
                                    labelAlign="left"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    { getFieldDecorator('interest_level', {
                                        initialValue: _interest_level
                                    })(
                                        <Select
                                            placeholder="Please select"  
                                            onChange={value => set_interest_level(value)}
                                        >
                                            {
                                                interests.map(interest => (
                                                    <Option
                                                        key={interest.interest_level_id}
                                                        value={interest.interest_level_id}
                                                    >{interest.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            
                            <Button 
                                size="small"
                                icon="history"
                                onClick={() => set_history_visibility(true)}
                            ></Button>

                        </Row>
                        <Form.Item
                            label="Interest Reason"
                            labelAlign="left"
                            labelCol={{span: 3}}
                            wrapperCol={{span: 21}}
                        >
                            {
                                getFieldDecorator('interest_reason', {
                                    initialValue: _interest_reason
                                })(
                                    <TextArea 
                                        placeholder="Interest reason..."
                                        autoSize={{ minRows: 3, maxRows: 6 }}
                                        onChange={e => set_interest_reason(e.target.value)}
                                    />
                                )
                            }
                        </Form.Item>
                    </Panel>

                    <Panel
                        key="2"
                        header="Investment Parameters"
                    >
                        <Row
                            gutter={gutter}
                        >
                            <Col span={sub_menu === "myDeals" ? 6 : 7}>
                                <Form.Item
                                    label="Ant. Investment"
                                    labelAlign="left"
                                    labelCol={{span: sub_menu === "myDeals" ? 15 : 10}}
                                    wrapperCol={{span: sub_menu === "myDeals" ? 9 : 14}}
                                >

                                    { sub_menu === "myDeals" 
                                        ? _anticipated_investment ? commaNumber(_anticipated_investment) : 'N/A' 
                                        : getFieldDecorator('anticipated_investment', {
                                        initialValue: commaNumber(_anticipated_investment)
                                    })(
                                        <Input 
                                            addonBefore="$"
                                            addonAfter=".00"
                                            placeholder="Anticipated investment"
                                            onChange={e => set_anticipated_investment(e.target.value.replace(/,\s?/g ,""))}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={sub_menu === "myDeals" ? 8 : 7}>
                                <Form.Item
                                    label="Funds Needed Date"
                                    labelAlign="left"
                                    labelCol={{span: 12}}
                                    wrapperCol={{span: 12}}
                                >
                                    { getFieldDecorator('funds_needed_date', {
                                        initialValue: _funds_needed_date ? moment(_funds_needed_date) : _funds_needed_date
                                    })(
                                        <DatePicker 
                                            disabledDate={disabledDate}
                                            onChange={changeDateHandler}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Hold Period"
                                    labelAlign="left"
                                    labelCol={{span: 10}}
                                    wrapperCol={{span: 14}}
                                >
                                    { getFieldDecorator('hold_period', {
                                        initialValue: _hold_period
                                    })(
                                        <Input 
                                            placeholder="Hold period"  
                                            onChange={e => set_hold_period(e.target.value)}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    label="My Proj. IRR"
                                    labelAlign="left"
                                    labelCol={{span: sub_menu === "myDeals" ? 18 : 15}}
                                    wrapperCol={{span: sub_menu === "myDeals" ? 6 : 9}}
                                >
                                    { sub_menu === "myDeals" 
                                        ? _projected_irr ? _projected_irr : 'N/A' 
                                        : getFieldDecorator('projected_irr', {
                                            rules: [
                                                {
                                                    validator: isWholeOrDecimal
                                                }
                                            ],
                                            initialValue: _projected_irr
                                        })(
                                        <Input 
                                            placeholder="IRR"
                                            readOnly={sub_menu === "myDeals" ? true : false}
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
                            { getFieldDecorator('notes', {
                                initialValue: _notes
                            })(
                                <TextArea 
                                    placeholder="Deal notes..."
                                    autoSize={{ minRows: 3, maxRows: 6 }} 
                                    onChange={e => set_notes(e.target.value)}
                                />
                            )}
                        </Form.Item>
                    </Panel>

                </Collapse>
            </Form>

            { history_visibility === true && (
                <DealInterestHistory
                    deal_id={deal_id}
                    visible={history_visibility}
                    visibility={set_history_visibility}
                />
            )}

        </React.Fragment>
    )
}

const DealSheet = forwardRef((props, ref) => {
    const Updated = Form.create({ name: 'deal_sheet_form' })(WrappedDealSheet);
    return <Updated {...props} forwardedRef={ref} /> 
});

export default DealSheet;