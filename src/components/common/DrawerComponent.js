import React from 'react';
import { Drawer } from 'antd';

const DrawerComponent = ({ drawer_title, drawer_visibility, close_drawer, children }) => {
    return (
        <Drawer 
            title={drawer_title}
            placement="right"
            width={1200}
            onClose={() => close_drawer(false)}
            visible={drawer_visibility}
        >
            {children}
        </Drawer>
    )
}

export default DrawerComponent;