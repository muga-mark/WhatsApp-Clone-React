import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

function TooltipCustom(props) {
    return (
        <div>
            <Tooltip title={<span style={{fontSize: '14px', 
                padding: '8px 5px 8px 5px'}}>{props.name}</span>} 
                placement="bottom-end">
                <IconButton onClick={props.onClick}>
                    {props.icon}
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default TooltipCustom
