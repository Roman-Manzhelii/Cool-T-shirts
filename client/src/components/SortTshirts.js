import React, {Component} from "react";
import Select from 'react-select';

export default class SortTshirts extends Component {

    sortOptions = [
        {value: 'price-low-high', label: 'Price: Low to High'},
        {value: 'price-high-low', label: 'Price: High to Low'},
        {value: 'brand', label: 'Brand: Alphabetically'}
    ];

    handleSortChange = selectedOption => {
        this.props.onSortChange(selectedOption.value)
    }

    render() {
        const customStyles = {
            control: (base) => ({
                ...base,
                width: 300,
            }),
            menu: (base) => ({
                ...base,
                width: 300
            })
        };

        return (
            <div className="sort-dropdown">
                <Select
                    options={this.sortOptions}
                    onChange={this.handleSortChange}
                    placeholder="Sort"
                    isSearchable={false}
                    styles={customStyles}
                />
            </div>
        );
    }
}
