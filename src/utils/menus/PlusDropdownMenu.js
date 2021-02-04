import React, { useContext } from 'react';
import { Menu } from 'antd';
import { HomeContext } from '../../containers/Home/Home';

const PlusDropdownMenu = props => {

    const { changed } = useContext(HomeContext);

    const changeMenuHandelr = (e, path) => {
        e.preventDefault();
        changed(path);
    }

    return (
        <Menu>
            <Menu.Item>
                <a
                    href="/"
                    onClick={e => changeMenuHandelr(e, { key: 'addDeal' })}
                >
                    Add Deal
                </a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href="/"
                    onClick={e => changeMenuHandelr(e, { key: 'circleInvitation' })}
                >
                    Send Invite
                </a>
            </Menu.Item>
        </Menu>
    )
}

export default PlusDropdownMenu;