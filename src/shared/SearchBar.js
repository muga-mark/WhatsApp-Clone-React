import React from 'react';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import './SearchBar.css';

function SearchBar( { placeholder, searchRoom, setSearch, search } ) {

    return (
        <div className="search">
            <div className="search__container">
                <SearchOutlinedIcon onClick={searchRoom}/>
                    <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        type="text" 
                        placeholder={placeholder} 
                        required
                    />
            </div>
        </div>
    )
}

export default SearchBar