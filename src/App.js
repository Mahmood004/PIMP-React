import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { WrappedSignupForm as SignupForm } from './containers/Auth/Signup/Signup';
import { WrappedLoginForm as LoginForm } from './containers/Auth/Login/Login';
import ForgotPassword from './containers/ForgotPassword/ForgotPassword';
import ResetPassword from './containers/ResetPassword/ResetPassword';
import PrivacyPolicy from './components/Agreements/PrivacyPolicy';
import TermsOfService from './components/Agreements/TermsOfService';
import DealCreationWithoutLogin from './components/Deals/DealCreationWithoutLogin/DealCreationWithoutLogin';
import Home from './containers/Home/Home';
import { toast } from 'react-toastify';
import config from './config/config';
import 'react-toastify/dist/ReactToastify.css';

const { verify_auth } = config;
toast.configure();


const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => {
    
    const urlParams = new URLSearchParams(window.location.search);
    
    return (
      localStorage.getItem('token') || urlParams.get('mode') === 'social' ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: {from: props.location} }} /> 
    )
  }} />
)


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" render={(props) => (verify_auth() ? <Redirect to="/home" /> : <LoginForm /> )} />
        <Route exact path="/signup" render={(props) => (verify_auth() ? <Redirect to="/home" /> : <SignupForm /> )} />
        <Route exact path="/forgot_password" component={ForgotPassword} />
        <Route exact path="/reset_password" component={ResetPassword} />
        <ProtectedRoute exact path="/home" component={Home} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route exact path="/terms-of-service" component={TermsOfService} />
        <Route exact path="/add/:submit_user/:sub_category_id" component={DealCreationWithoutLogin} />
        {/* <Route exact path="/dashboard/{social}" render={(props) => {
          
        }} /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
