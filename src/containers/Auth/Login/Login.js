import React, { Component } from 'react';
import { Form, Icon, Input, Button, Spin, Checkbox, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { auth } from '../../../actions';
import config from '../../../config/config';
import { LinkedInLoginButton } from 'react-social-login-buttons';
import styles from './Login.module.css';

const { login } = auth;
const { set_storage, apiBaseUrl } = config;

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberMe: false,
            loading: false
        }
    }

    handleSubmit = e => {

        e.preventDefault();
        this.rememberMe();
        
        const { validateFields } = this.props.form;

        validateFields(async (err, values) => {

            if (!err) {

                this.setState({
                    loading: true
                });

                const data = {
                    email: this.state.email,
                    password: this.state.password
                }

                const result = await login(data);
                const { token, user, message: msg } = result.data;
    
                if (result.status === 200) {

                    this.setState({
                        loading: false
                    });

                    set_storage(token, user);
                    this.props.history.push('/home');

                } else {

                    this.setState({
                        loading: false
                    });

                    message.error(msg);
                }
            }

        });
    }

    componentDidMount() {

        if (document.cookie) {
            
            const cookieArray = document.cookie.split(';');
            
            for (let i=0; i < cookieArray.length; i++) {
                const valueArray = cookieArray[i].split('=');

                if (valueArray[0].trim() === "email") {
                    this.setState({
                        email: valueArray[1],
                        rememberMe: true
                    })
                }

                if (valueArray[0].trim() === "password") {
                    this.setState({
                        password: valueArray[1],
                        rememberMe: true
                    })
                }
            }
        }
    }

    linkedinHandler = () => {
        window.location.href = `${apiBaseUrl}/auth/linkedin`;
    }

    rememberMe = () => {

        const { email, password, rememberMe } = this.state;
        const maxAge = 60 * 60 * 24 * 30;
        

        if (rememberMe) {

            document.cookie = "email=" + email + ";max-age=" + maxAge;
            document.cookie = "password=" + password + ";max-age=" + maxAge;

        } else {

            document.cookie = "email=" + email + ";max-age= -60";
            document.cookie = "password=" + password + ";max-age= -60";

        }
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div className={styles.container}>
                <h2>Login</h2>
                <Form 
                    onSubmit={this.handleSubmit} 
                    className={styles.form_style}
                    style={{background: '#FFFFFF', padding: '20px 25px', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid lightgrey', borderRadius: 3}}    
                >
                    <Form.Item style={{margin: 0}}>
                        {getFieldDecorator('email', {
                            rules: [
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
                            rules: [
                                { required: true, message: 'Please input your Password!'}
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
                    
                    <span className={styles.tl_left}>
                        <Checkbox 
                            onChange={e => this.setState({ rememberMe: e.target.checked })}
                            checked={this.state.rememberMe}
                        >
                            Remember me
                        </Checkbox>
                    </span>
                        
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        disabled={this.state.loading ? true : false}
                    >
                        Login
                    </Button>

                    <span className={styles.tl_right}>
                        <Link to="/forgot_password">
                            Forgot Password?
                        </Link>
                    </span>

                </Form>
                
                { this.state.loading && (
                    <span className={styles.spin}>
                        <Spin />
                    </span> 
                )}
                
                <LinkedInLoginButton 
                    onClick={this.linkedinHandler} 
                    className={styles.linkedin_btn} 
                    style={{padding: '0 62px', marginTop: 10, height: 45}}
                >
                    <span className={styles.linkedin_btn_text}>Login With LinkedIn</span>
                </LinkedInLoginButton>
                    
                
                <span className={styles.signup_link}>
                    New to AIP? <Link to="/signup">Register Now!</Link>
                </span>
                    
            </div>
        )
    }
}

export const WrappedLoginForm = Form.create({ name: 'login_form' })(withRouter(Login));
