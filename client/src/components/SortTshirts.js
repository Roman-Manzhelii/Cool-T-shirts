import React, {Component} from "react"

export default class SortTshirts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOptions: false
        };
    }

    handleSort = (e) => {
        const sortOption = e.target.value;
        console.log(`Sorting by ${sortOption}`);
        this.props.onSortChange(sortOption);
    }

    render() {
        return (
            <div>
                    <div className="sort-dropdown">
                        <select onChange={this.handleSort} defaultValue="">
                            <option value="" disabled>Sort</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="brand">Brand: Alphabetically</option>
                        </select>
                    </div>
            </div>
        );
    }
}
