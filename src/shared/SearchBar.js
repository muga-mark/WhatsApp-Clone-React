import React from 'react';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import './SearchBar.css';

function SearchBar(props) {
    return (
        <div className="search">
            <div className="search__container">
                <SearchOutlinedIcon />
                <input type="text" placeholder={props.placeholder} />
            </div>
        </div>
    )
}

export default SearchBar