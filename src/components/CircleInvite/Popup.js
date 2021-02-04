import React from 'react';
import { Modal } from 'antd';
import CircleInvite from './CircleInvite';

const Popup = props => {

    const { visibility, toggle } = props;

    const closeModal = e => {
        toggle();
    }

    return (
        <Modal
            width={330}
            title="Send Circle Invitation"
            visible={visibility}
            onCancel={closeModal}
            onOk={closeModal}
            footer={null}
        >
            <CircleInvite 
                layout="vertical"
            />
        </Modal>
    )
}

export default Popup;