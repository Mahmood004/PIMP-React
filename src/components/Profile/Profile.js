import React, { useState, useEffect } from 'react';
import { Tabs, Spin, message } from 'antd';
import { industry, investment } from '../../actions';
import About from './About/About';
import Expertise from './Expertise/Expertise';
import Investment from './Investment/Investment';
import ChangePassword from './ChangePassword/ChangePassword';

const { TabPane } = Tabs;
const { getIndustries } = industry;
const { getInvestmentAttributes } = investment;

const Profile = () => {

    const [industries, set_industries] = useState([]);
    const [attributes, set_attributes] = useState([]);
    const [loading, set_loading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            const result = await getIndustries();
            const res = await getInvestmentAttributes();

            const { industries, message: _msg } = result.data;
            const { attributes, message: msg } = res.data;

            if (result.status === 200) {
                set_industries(industries);
            } else {
                message.error(_msg);
            }

            if (res.status === 200) {
                set_attributes(attributes);
            } else {
                message.error(msg);
            }

            set_loading(false);
        }

        fetchData();
        
    }, [])
        
    return (
        <React.Fragment>
            { !loading ? (
                <Tabs type="card">
                    <TabPane tab="About Me" key="1">
                        <About />
                    </TabPane>
                    <TabPane tab="Investment Profile" key="2">  
                        <Investment
                            industries={industries}
                            attributes={attributes}
                        />
                    </TabPane>
                    <TabPane tab="Expertise Profile" key="3">
                        <Expertise
                            industries={industries}
                        />
                    </TabPane>
                    <TabPane tab="Change Password" key="4">
                        <ChangePassword />
                    </TabPane>
                </Tabs>
            ) : <Spin tip="Loading..." style={styles.spinner} /> }
            
        </React.Fragment>
    )
    
}

const styles = {
    spinner: {
        position: 'absolute', 
        left: '55%',
        top: '300px'
    }
}

export default Profile;