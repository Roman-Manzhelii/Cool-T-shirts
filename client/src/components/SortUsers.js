import React, {Component} from "react"
import Select from "react-select";

export default class SortUsers extends Component {

    sortOptions = [
        {value: 'name-alphabetic', label: 'Name: Alphabetic'},
        {value: 'name-alphabetic-reverse', label: 'Name: Alphabetic Reverse'},
    ];

    constructor(props) {
        super(props)
    }

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
