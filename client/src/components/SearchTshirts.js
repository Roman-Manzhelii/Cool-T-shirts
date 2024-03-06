import React, {Component} from "react"

export default class SearchTshirts extends Component {
    handleSearch = (e) => {
        this.props.onSearch(e.target.value)
    }

    render() {
        return (

            <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input" onChange={this.handleSearch}/>
                <span className="material-symbols-outlined search-icon">search</span>
            </div>
        )
    }
}
