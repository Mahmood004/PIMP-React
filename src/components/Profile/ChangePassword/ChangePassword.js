import React, { useState } from 'react';
import { Form, Input, Icon, Button, message } from 'antd';
import { profile } from '../../../actions';

const { changePassword } = profile;

const WrappedChangePassword = props => {

    const [old_password, set_old_password] = useState('');
    const [new_password, set_new_password] = useState('');
    const [, set_confirm_new_password] = useState('');
    const [loading, set_loading] = useState(false);


    const { form: { getFieldDecorator, getFieldValue, validateFields, resetFields } } = props;

    const submitHandler = e => {

        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                const data = {
                    old_password,
                    new_password
                }
        
                const result = await changePassword(data);
                const { message: msg } = result.data;
        
                if (result.status === 200) {

                    resetFields();

                } else {
                    message.error(msg);
                }

                set_loading(false);

            }
        })
    }

    const checkPassword = (rule, value, callback) => {
        
        console.log(value);
        if ((value && value.length === getFieldValue('new_password').length && value !== getFieldValue('new_password')) || (value && value.length > getFieldValue('new_password').length)) {
            callback("Passwords don't match");
        } else {
            callback();
        }
    }

    return (
        
        <Form onSubmit={submitHandler}>
            <Form.Item 
                label="Old Password" 
                labelAlign="left" 
                labelCol={{span: 4}} 
                wrapperCol={{span: 6}}
            >
                { getFieldDecorator('old_password', {
                    rules: [
                        { required: true, message: 'Please input your old Password!' }
                    ]
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Old Password"
                        type="password"
                        allowClear
                        onChange={e => set_old_password(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item
                label="New Password"
                labelAlign="left"
                labelCol={{span: 4}}
                wrapperCol={{span: 6}}
            >
                { getFieldDecorator('new_password', {
                    rules: [
                        { required: true, message: 'Please input your new Password!' },
                        { min: 6, message: 'Password must be 6 characters long!' }
                    ]
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="New Password"
                        type="password"
                        allowClear
                        onChange={e => set_new_password(e.target.value)}
                    />
                )}
            </Form.Item>

            <Form.Item
                label="Confirm New Password"
                labelAlign="left"
                labelCol={{span: 4}}
                wrapperCol={{span: 6}}
            >
                { getFieldDecorator('confirm_new_password', {
                    rules: [
                        { required: true, message: 'Please input your confirm new Password!' },
                        { min: 6, message: 'Password must be 6 characters long!' },
                        { validator: checkPassword }
                    ]
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Confirm New Password"
                        type="password"
                        allowClear
                        onChange={e => set_confirm_new_password(e.target.value)}
                    />
                )}
            </Form.Item>
            
            <Button 
                type="primary" 
                htmlType="submit" 
                disabled={loading ? true : false}
            >
                Change
            </Button>
            
        </Form>
            
    )
    
}

const ChangePassword = Form.create({ name: 'change_password_form '})(WrappedChangePassword);

export default ChangePassword;