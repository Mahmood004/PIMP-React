import React, { useContext } from 'react';
import { Layout, Icon, Button } from 'antd';
import DropdownComponent from '../common/DropdownComponent';
import { BellDropdownMenu, PlusDropdownMenu, UserDropdownMenu } from '../../utils/menus';
import { HomeContext } from '../../containers/Home/Home';

const { Header } = Layout;

const HeaderTop = ({ collapsed, toggle, ...styles }) => {

    const { headerStyle, iconStyle } = styles;
    const { auth_user: { approved } } = useContext(HomeContext);

    return (
        <Header
            style={{
                ...headerStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={toggle}
            />
            <span>

                <DropdownComponent
                    overlay={<BellDropdownMenu />}
                    placement="bottomLeft"
                    trigger="click"
                >
                    <Icon 
                        type="bell"
                        style={iconStyle}
                    />
                </DropdownComponent>

                { approved === true && (
                    <React.Fragment>
                        <DropdownComponent
                            overlay={<PlusDropdownMenu />}
                            placement="bottomLeft"
                            trigger="click"
                        >
                            <Button
                                className="header-plus-dropdown"
                                type="link"
                                style={iconStyle}
                            >
                                <Icon
                                    type="plus"
                                />
                                <Icon 
                                    type="caret-down"
                                />
                            </Button>
                        </DropdownComponent>

                        <DropdownComponent
                            overlay={<UserDropdownMenu />}
                            placement="bottomRight"
                            trigger="click"
                        >
                            <Button
                                className="header-user-dropdown"
                                type="link"
                                style={iconStyle}
                            >
                                <Icon
                                    type="user"
                                />
                                <Icon 
                                    type="caret-down"
                                />
                            </Button>
                        </DropdownComponent>
                    </React.Fragment>
                )}

            </span>
        </Header>
    )
}

export default HeaderTop;