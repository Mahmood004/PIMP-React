import React, { Component } from 'react';
import { Form, Input, Icon, Button, Spin, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { auth } from '../../../actions';
import config from '../../../config/config';
import { LinkedInLoginButton } from 'react-social-login-buttons';
import styles from './Signup.module.css';

const { register } = auth;
const { apiBaseUrl } = config;

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            loading: false
        }
    }

    handleSubmit = e => {

        e.preventDefault();

        const { validateFields } = this.props.form;

        validateFields(async (err, values) => {

            if (!err) {

                this.setState({
                    loading: true
                });
        
                let shortcode;
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams && urlParams.has('shortcode')) {
                    shortcode = urlParams.get('shortcode');
                }
        
                const data = {
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    email: this.state.email,
                    password: this.state.password,
                    shortcode
                }
        
                const result = await register(data);
                const { message: msg } = result.data;
        
                if (result.status === 200) {
        
                    this.setState({
                        loading: false
                    });
        
                    message.success(msg);
                    this.props.history.push('/');
        
                } else {
        
                    this.setState({
                        loading: false
                    });
        
                    message.error(msg);
                }
            }
        })
    }

    linkedinHandler = () => {
        window.location.href = `${apiBaseUrl}/auth/linkedin`;
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (

            <div className={styles.container}>
                <h2>Register</h2>
            
                <Form 
                    className={styles.form_style}
                    onSubmit={this.handleSubmit}
                    style={{background: '#FFFFFF', padding: '20px 25px', minHeight: 265, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid lightgrey', borderRadius: 3}}    
                >
                    <Form.Item style={{margin: 0}}>
                        {getFieldDecorator('first_name', {
                            rules: [{ required: true, message: 'Please input your First Name!' }],
                            initialValue: this.state.first_name
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="text"
                                placeholder="First name"
                                onChange={e => this.setState({ first_name: e.target.value })}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{margin: 0}}>
                        {getFieldDecorator('last_name', {
                            rules: [{ required: true, message: 'Please input your Last Name!'}],
                            initialValue: this.state.last_name
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="text"
                                placeholder="Last name"
                                onChange={e => this.setState({ last_name: e.target.value })}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{margin: 0}}>
                        {getFieldDecorator('email', {
                            rules: 
                                [
                                    { required: true, message: 'Please input your Email!' },
                                    { type: 'email', message: 'The input is not valid Email!' }
                                ],
                            initialValue: this.state.email
                        })(
                            <Input
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{margin: 0}}>
                        {getFieldDecorator('password', {
                            rules: 
                                [
                                    { required: true, message: 'Please input your Password!'},
                                    { min: 6, message: 'Password must be of 6 characters!' }    
                                ],
                            initialValue: this.state.password
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        )}
                    </Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        disabled={this.state.loading ? true : false}
                    >
                        Signup
                    </Button>
                </Form>

                <LinkedInLoginButton 
                    onClick={this.linkedinHandler}
                    className={styles.linkedin_btn} 
                    style={{padding: '0 60px', marginTop: 10, height: 45}}
                >
                    <span className={styles.linkedin_btn_text}>Signup with LinkedIn</span>
                </LinkedInLoginButton>

                { this.state.loading && (
                    <span className={styles.spin}>
                        <Spin />
                    </span> 
                )}
                
                <span className={styles.login_link}>
                    Alreday have an account? <Link to="/">Signin</Link>
                </span>
                <span className={styles.agreement_section}>
                    <span>
                        <Link to="/terms-of-service" target="_blank">Terms of Service</Link>
                    </span>
                    <span style={{marginLeft: 25}}>
                        <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
                    </span>

                </span>
            </div>
        )
    }
}

export const WrappedSignupForm = Form.create({ name: 'signup_form' })(withRouter(Signup));