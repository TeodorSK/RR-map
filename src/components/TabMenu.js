import React from 'react';
import RoomIcon from '@material-ui/icons/Room';
import DirectionsIcon from '@material-ui/icons/Directions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabMenu(props) {
    return (
        <div>
            <Tabs
                value={props.tabIndex}
                onChange={props.tabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                mb={3}
            >
                <Tab icon={<RoomIcon />} label="Movements" />
                <Tab icon={<DirectionsIcon />} label="Route" />
            </Tabs>
        </div>
    );
}

export default TabMenu;