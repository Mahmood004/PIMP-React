import React from 'react';
import { Layout, Menu, Icon } from 'antd';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideNavigation = props => {

    let menus;

    menus = props.menus.map(menu => {
        
        if (menu.menu_items) {

            if (menu.accessible_by === 'all' || (menu.accessible_by !== 'all' && menu.accessible_by === props.role)) {
            
                    
                let menuItems = menu.menu_items.map(menu_item => {
                    return (
                        <Menu.Item key={menu_item.key}>
                            <Icon type={menu_item.icon_type} />
                            <span>{menu_item.title}</span>    
                        </Menu.Item>    
                    )
                });

                return (
                    <SubMenu 
                        key={menu.key} 
                        title={
                            <span>
                                <Icon type={menu.icon_type} />
                                <span>{menu.title}</span>
                            </span>
                        }
                    >
                        {menuItems}
                    </SubMenu>
                )
                
            }

        } else {

            if (menu.accessible_by === 'all' || (menu.accessible_by !== 'all' && menu.accessible_by === props.role)) {
                return (
                    <Menu.Item key={menu.key}>
                        <Icon type={menu.icon_type} />
                        <span>{menu.title}</span>
                    </Menu.Item>
                )
            }
        }

        return '';
    })

    return (
        <Sider collapsible collapsed={props.collapsed} trigger={null}>
            <div className="logo"></div>
            <Menu 
                theme="dark" 
                mode="inline"
                selectedKeys={[props.selectedKeys]}
                // openKeys={[props.openKeys]}
                onClick={props.clicked}
            >
                {menus}
                
                <Menu.Item key="logout">
                    <Icon type="logout" />
                    <span>Sign Out</span>
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default SideNavigation;