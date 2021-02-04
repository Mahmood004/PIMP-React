import React, { Component } from 'react'; 
import { Layout, Spin } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import ReactGA from 'react-ga';

import { interest, profile } from '../../actions';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import HeaderTop from '../../components/Header/HeaderTop';
import navigation from '../../utils/navigation';
import Popup from '../../components/CircleInvite/Popup';
import config from '../../config/config';

import './Home.css';

const { Content, Footer } = Layout;
const { apiBaseUrl, trackingId, set_storage, remove_storage, get_user_from_storage } = config;
const { getInterestLevels } = interest;
const { getUserProfile } = profile;

export const HomeContext = React.createContext();

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            menus: [],
            activeMenuKey: null,
            activeSubMenuKey: null,
            interest_levels: [],
            auth_user: null,
            visible: false
        }
    }
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    fetchUser = async () => {

        const result = await getUserProfile();
        const { user } = result.data;

        set_storage(null, user);

        if (result.status === 200) {
            this.setState({
                auth_user: user 
            })
        }
    }

    clickMenuHandler = e => {

        if (e.key === 'logout') {

            remove_storage();
            this.props.history.push('/');
        }

        else {

            if (e.keyPath && e.keyPath.length > 1) {
                
                this.setState({
                    activeMenuKey: e.keyPath[e.keyPath.length - 1],
                    activeSubMenuKey: e.key
                });

            } else {

                if (e.key === "circleInvitation") {

                    this.setState({
                        visible: true
                    });

                } else {
                    this.setState({
                        activeMenuKey: e.key,
                        activeSubMenuKey: null
                    });
                }
            }

            ReactGA.pageview(e.key);
        }
    }

    async componentDidMount() {

        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('mode') === 'social') {
            
            const res = await axios.get(`${apiBaseUrl}/social-user-info`);
            const { socialUserToken, socialUser } = res.data;

            if (res.status === 200) {

                await this.setState({
                    auth_user: socialUser
                });

                set_storage(socialUserToken, socialUser);
            }
            
        } else {

            await this.setState({
                auth_user: get_user_from_storage()
            });
            
        }

        const { auth_user } = this.state;

        this.accessible_by = auth_user.approved ? 'all' : 'Admin';

        const menus = navigation(this.accessible_by);

        const interest_levels = await getInterestLevels();

        this.setState({
            menus,
            activeMenuKey: 'dashboard',
            interest_levels: interest_levels.data.interests
        });

        this.initializeReactGA();
    }

    changeMenuHandler = e => {
        this.clickMenuHandler(e);
    }

    initializeReactGA = () => {
        ReactGA.initialize(trackingId);
        ReactGA.pageview('dashboard');
    }

    toggleVisibility = () => {
        this.setState({
            visible: false
        });
    }

    render() {

        const { 
            auth_user, 
            interest_levels,
            menus, 
            collapsed, 
            activeMenuKey, 
            activeSubMenuKey 
        } = this.state;
        
        const contextValue = {
            interest_levels,
            auth_user,
            modified: this.fetchUser,
            changed: this.changeMenuHandler,
            menu: activeMenuKey,
            sub_menu: activeSubMenuKey
        }

        return (

            <HomeContext.Provider value={contextValue}>
                { menus.length > 0 ? (
                    <Layout>
                        <SideNavigation
                            collapsed={collapsed}
                            clicked={this.clickMenuHandler}
                            role={auth_user ? auth_user.user_type.role : ''}
                            menus={menus}
                            selectedKeys={activeSubMenuKey ? activeSubMenuKey : activeMenuKey}
                            openKeys={activeSubMenuKey ? activeMenuKey : activeSubMenuKey}
                        />
                        <Layout>
                            <HeaderTop 
                                headerStyle={{background: "#fff", padding: 0}}
                                iconStyle={{fontSize: 20}}
                                collapsed={collapsed}
                                toggle={this.toggle}
                            />
                            <Content
                                style={{
                                    margin: '24px 16px',
                                    padding: 24,
                                    background: '#fff',
                                    minHeight: '100vh'
                                }}
                            >
                                { menus.length ? activeSubMenuKey ? 
                                    menus.find(menu => menu.key === activeMenuKey).menu_items.find(menu_item => menu_item.key === activeSubMenuKey).component : 
                                    menus.find(menu => menu.key === activeMenuKey).component : ''
                                }

                                <Popup 
                                    visibility={this.state.visible} 
                                    toggle={this.toggleVisibility}    
                                />
                                
                            </Content>

                            <Footer>
                                <span
                                    style={{display: 'flex', justifyContent: 'space-evenly'}}
                                >
                                    <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
                                    <Link to="/terms-of-service" target="_blank">Terms of Service</Link>
                                </span>
                            </Footer>
                        </Layout>
                    </Layout>
                ) : (
                    <Spin tip="Loading..." style={styles.spinner}></Spin>
                )}
                
            </HomeContext.Provider>
        )
    }
}

const styles = {
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    }
}

export default withRouter(Home);