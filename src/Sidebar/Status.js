import React from 'react';
import TooltipCustom from '../shared/TooltipCustom';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

function Status() {
    return (
        <div>
            <TooltipCustom 
                name="Status" 
                icon={<DonutLargeIcon />} 
            />
        </div>
    )
}

export default Status
