import React, {Component} from "react"

export default class SortUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showOptions: false
        }
    }

    handleSort = (e) => {
        const sortOption = e.target.value
        this.props.onSortChange(sortOption)
    }

    render() {
        return (
            <div>
                <div className="sort-dropdown">
                    <select onChange={this.handleSort} defaultValue="">
                        <option value="" disabled>Sort</option>
                        <option value="name-alphabetic">Name: Alphabetic</option>
                        <option value="name-alphabetic-reverse">Name: Alphabetic Reverse</option>
                    </select>
                </div>
            </div>
        )
    }
}
