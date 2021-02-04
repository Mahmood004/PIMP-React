import React, { useState, useContext } from 'react';
import { Col, Select, Button, Input, Form, message } from 'antd';
import { HomeContext } from '../../containers/Home/Home';
import ConditionalWrapper from '../common/ConditionalWrapper';
import { circle } from '../../actions';

const { Option } = Select;
const { sendCircleInvite } = circle;

const WrappedCircleInvite = props => {

    const { form: { getFieldDecorator, validateFields, resetFields }, layout } = props;

    const [circle, set_circle] = useState('');
    const [first_name, set_first_name] = useState('');
    const [last_name, set_last_name] = useState('');
    const [email, set_email] = useState('');
    const [loading, set_loading] = useState(false);

    const { auth_user: { user_circles }, modified } = useContext(HomeContext)

    const submitHandler = e => {

        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                let obj = {
                    first_name,
                    last_name,
                    email
                }

                const result = await sendCircleInvite(circle, obj);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    resetFields();
                    modified();

                } else {
                    message.error(msg);
                }

                set_loading(false);
            }

        });

    }

    return (
        <React.Fragment>
            
            { layout === "inline" && <h2>Send Circle Invitations</h2> }
            
            <Form 
                onSubmit={submitHandler}
                layout={layout}
            >
                
                <ConditionalWrapper
                    condition={layout === "inline"}
                    wrapper={children => <Col span={6}>{children}</Col>}
                >
            
                    <Form.Item
                        label="Your Circles"
                        labelAlign="left"
                        style={styles.cell}
                    >
                        { getFieldDecorator('circle', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please choose a circle'
                                }
                            ]
                        })(
                            <Select 
                                placeholder="Please Select"
                                onChange={value => set_circle(value)}
                                style={{width: 260}}
                                >
                                { user_circles && user_circles.map(({ circle }) => (
                                    <Option 
                                        key={circle.circle_id} 
                                        value={circle.circle_id}
                                    >
                                        {circle.name}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>

                </ConditionalWrapper>
                
                <ConditionalWrapper
                    condition={layout === "inline"}
                    wrapper={children => <Col span={5}>{children}</Col>}
                >

                    <Form.Item
                        label="Invitee First Name"
                        labelAlign="left"
                        style={styles.cell}
                    >
                        { getFieldDecorator('first_name', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input first name'
                                }
                            ]
                        })(
                            <Input 
                                type="text" 
                                placeholder="First name" 
                                style={{width: 240}}
                                onChange={e => set_first_name(e.target.value)}
                            />
                        )}
                    </Form.Item>

                </ConditionalWrapper>

                <ConditionalWrapper
                    condition={layout === "inline"}
                    wrapper={children => <Col span={5}>{children}</Col>}
                >

                    <Form.Item
                        label="Invitee Last Name"
                        labelAlign="left"
                        style={styles.cell}
                    >
                        { getFieldDecorator('last_name', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input last name'
                                }
                            ]
                        })(
                            <Input 
                                type="text" 
                                placeholder="Last name" 
                                style={{width: 240}}
                                onChange={e => set_last_name(e.target.value)}
                            />
                        )}
                    </Form.Item>

                </ConditionalWrapper>

                <ConditionalWrapper
                    condition={layout === "inline"}
                    wrapper={children => <Col span={6}>{children}</Col>}
                >

                    <Form.Item
                        label="Invitee Email"
                        labelAlign="left"
                        style={styles.cell}
                    >
                        { getFieldDecorator('email', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input invitee email'
                                },
                                {
                                    type: 'email',
                                    message: 'Please input valid email'
                                }
                            ]
                        })(
                            <Input 
                                type="text" 
                                placeholder="Email" 
                                style={{width: 260}}
                                onChange={e => set_email(e.target.value)}
                            />
                        )}
                    </Form.Item>

                </ConditionalWrapper>

                <ConditionalWrapper
                    condition={layout === "inline"}
                    wrapper={children => <Col span={2}>{children}</Col>}
                >

                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{marginTop: layout === "inline" ? 41 : 0}}
                        disabled={loading ? true : false}
                    >
                        Send
                    </Button>
                
                </ConditionalWrapper>

            </Form>
            
        </React.Fragment>
    )
}

const CircleInvite = Form.create({ name: 'circle_invite_form' })(WrappedCircleInvite);

const styles = {
    cell: {
        display: 'flex',
        flexDirection: 'column'
    }
}

export default CircleInvite;