import React from 'react';
import { Dropdown } from 'antd';

const DropdownComponent = ({ overlay, placement, trigger, children }) => {
    return (
        <Dropdown
            overlay={overlay}
            placement={placement}
            trigger={[trigger]}
        >
            {children}
        </Dropdown>
    )
}

export default DropdownComponent;