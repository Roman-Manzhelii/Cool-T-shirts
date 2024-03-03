import React, {Component} from "react"

export default class SearchTshirts extends Component {
    handleSearch = (e) => {
        this.props.onSearch(e.target.value)
    }

    render() {
        return (

            <div className="search-container">
                <span className="material-symbols-outlined">search
</span>
                <input

                    type="text"
                    placeholder= "Search..."
                    onChange={this.handleSearch}
                />
            </div>
        )
    }
}
