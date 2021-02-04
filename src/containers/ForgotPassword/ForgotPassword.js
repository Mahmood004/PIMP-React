import React, { useState } from 'react';
import { Form, Input, Icon, Button, Spin, message } from 'antd';
import { auth } from '../../actions';
import styles from './ForgotPassword.module.css';

const { forgotPassword } = auth;

const WrappedForgotPassword = props => {

    const { form: { validateFields, getFieldDecorator, resetFields } } = props;

    const [email, set_email] = useState('');
    const [loading, set_loading] = useState(false);

    const submitHandler = e => {

        e.preventDefault();
        

        validateFields(async (err, values) => {

            if (!err) {

                set_loading(true);

                const result = await forgotPassword(email);
                const { message: msg } = result.data;

                if (result.status === 200) {

                    resetFields();
                    message.success(msg);

                } else {
                    message.error(msg);
                }

                set_loading(false);

            }
        })
    }

    return (
        <div className={styles.container}>

            <h2>Enter Your Email</h2>

            <Form 
                onSubmit={submitHandler}
                style={{ background: '#FFFFFF', padding: '20px 25px', minHeight: 125, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid lightgrey', borderRadius: 3 }}
            >
                <Form.Item style={{margin: 0}}>
                    { getFieldDecorator('email', {
                        rules: [
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'The input is not valid Email!' }
                        ]
                    })(
                        <Input 
                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Email"
                            onChange={e => set_email(e.target.value)}
                        />
                    )}
                </Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    disabled={loading ? true : false}
                >
                    Submit
                </Button>
            </Form>
            <span className={styles.spin}>
                { loading && <Spin /> }
            </span>
        </div>
    )
}

const ForgotPassword = Form.create({ name: 'forgot_password_form' })(WrappedForgotPassword);

export default ForgotPassword;