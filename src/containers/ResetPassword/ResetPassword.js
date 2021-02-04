import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Icon, Spin, message } from 'antd';
import { auth } from '../../actions';
import { withRouter } from 'react-router-dom';
import styles from './ResetPassword.module.css';

const { resetPassword } = auth;

const WrappedResetPassword = props => {

    const { form: { validateFields, getFieldDecorator, resetFields, getFieldValue }, history } = props;

    const [password, set_password] = useState('');
    const [token, set_token] = useState('');
    const [loading, set_loading] = useState(false);
    

    useEffect(() => {

        let urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.has('token'));
        if (urlParams && urlParams.has('token')) {
            set_token(urlParams.get('token'));
        }

    }, []);

    const checkPassword = (rule, value, callback) => {
        if ((value && value.length === getFieldValue('password').length && value !== getFieldValue('password')) || (value && value.length > getFieldValue('password').length)) {
            callback("Passwords don't match");
        } else {
            callback();
        }
    }

    const submitHandler = e => {

        e.preventDefault();
        

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                let data = {
                    token,
                    password
                };
                
                const result = await resetPassword(data);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    resetFields();
                    message.success(msg);
                    history.push('/');

                } else {

                    message.error(msg);
                }

                set_loading(false);
            }
        })
    }

    return (
        
        <div className={styles.container}>

            <h2>Reset Your Password</h2>

            <Form 
                onSubmit={submitHandler}
                style={{ background: '#FFFFFF', padding: '20px 25px', minHeight: 170, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid lightgrey', borderRadius: 3 }}
            >
                <Form.Item style={{margin: 0}}>
                    { getFieldDecorator('password', {
                        rules: [
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be of 6 characters!'}
                        ]
                    })(
                        <Input 
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Password"
                            type="password"
                            onChange={e => set_password(e.target.value)}
                        />
                    )}
                </Form.Item>

                <Form.Item style={{margin: 0}}>
                    { getFieldDecorator('confirm_password', {
                        rules: [
                            { required: true, message: 'Please input confirm password!' },
                            { min: 6, message: 'Password must be of 6 characters!'},
                            { validator: checkPassword }
                            
                        ]
                    })(
                        <Input 
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Confirm password"
                            type="password"
                            onChange={e => set_password(e.target.value)}
                        />
                    )}
                </Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    disabled={loading ? true : false}
                >
                    Reset
                </Button>
            </Form>
            <span className={styles.spin}>
                { loading && <Spin /> }
            </span>
            
        </div>
        
    )
}

const ResetPassword = Form.create({ name: 'reset_password_form' })(withRouter(WrappedResetPassword))

export default ResetPassword;