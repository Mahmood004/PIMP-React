import React, { useState } from 'react';
import { Steps } from 'antd';
import './AddDeal.css';
import DealForm from './DealForm/DealForm';
import DealProfile from './DealProfile/DealProfile';
import DealDocument from './DealDocument/DealDocument';
import DealInterest from './DealInterest/DealInterest';
import DealActivity from './DealActivity/DealActivity';

const { Step } = Steps;

const steps = [
    {
        title: 'Add Deal'
    },
    {
        title: 'Add Deal Profile',
    },
    {
        title: 'Add Documents'
    },
    {
        title: 'Add Deal Interest'
    },
    {
        title: 'Add Deal Activity'
    }
];

const AddDeal = () => {

    const [current, set_current] = useState(0);
    const [deal_id, set_deal_id] = useState(null);
    const [deal_profile, set_deal_profile] = useState(null);

    const next = () => set_current(current + 1);

    return (
        <React.Fragment>
            
            <Steps current={current}>
                { steps.map(step => (
                    <Step key={step.title} title={step.title} />
                ))}
            </Steps>
            
            <div className="steps-content">
                { current === 0 && (
                    <DealForm 
                        next={next}
                        deal_id={deal_id}
                        set_deal_id={set_deal_id}
                        set_deal_profile={set_deal_profile}
                    />
                )}
                { current === 1 && (
                    <DealProfile
                        next={next}
                        deal_id={deal_id}
                        deal_profile={deal_profile}
                    />
                )}
                { current === 2 && (
                    <DealDocument
                        next={next}
                        deal_id={deal_id}
                    />
                )}
                { current === 3 && (
                    <DealInterest
                        next={next}
                        deal_id={deal_id}
                    />
                )}
                { current === 4 && (
                    <DealActivity 
                        deal_id={deal_id}
                    />
                )}
            </div>
        </React.Fragment>
    )
}

export default AddDeal;