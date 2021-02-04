import React, { useContext } from 'react';
import { Menu } from 'antd';
import { HomeContext } from '../../containers/Home/Home';

const UserDropdownMenu = props => {

    const { changed } = useContext(HomeContext);

    const changeMenuHandler = (e, path) => {
        e.preventDefault();
        changed(path);
    }
    
    return (
        <Menu>
            <Menu.Item>
                <a
                    href="/"
                    onClick={e => changeMenuHandler(e, { key: 'circles', keyPath: ['circles', 'myBoardRoom'] })}
                >
                    Circles
                </a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href="/"
                    onClick={e => changeMenuHandler(e, { key: 'profile', keyPath: ['profile', 'myBoardRoom'] })}
                >
                    Profile
                </a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href="/"
                    onClick={e => changeMenuHandler(e, { key: 'settings', keyPath: ['settings', 'myBoardRoom'] })}
                >
                    Settings
                </a>
            </Menu.Item>
        </Menu>
    )
}

export default UserDropdownMenu;