import './search.css';

function SearchBar({ handleSearchInput, searchText }) {
    return (
        <div className='searchbar'>
            <input className="search"
                type="text"
                value={searchText}
                onChange={handleSearchInput}
                placeholder="Search blogs..." />
            <button className='generate' type='button'>Search</button>
        </div>
    );
}

export default SearchBar;