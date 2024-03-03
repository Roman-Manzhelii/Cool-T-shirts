import React, {Component} from "react"

export default class FilterUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessLevels: {
                1: false,
                2: false
            }
        }
    }

    handleCheckboxChange = (type, value) => {
        this.setState(prevState => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [value]: !prevState[type][value]
            }
        }), () => {
            const filters = {
                accessLevel: Object.keys(this.state.accessLevels).filter(key => this.state.accessLevels[key])
            }
            this.props.onFilterChange(filters)
        })
    }


    renderAccessLevelCheckboxes() {
        return Object.keys(this.state.accessLevels).map(accessLevel => (
            <div key={accessLevel} className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`accessLevel-${accessLevel}`}
                    checked={this.state.accessLevels[accessLevel]}
                    onChange={() => this.handleCheckboxChange('accessLevels', accessLevel)}
                />
                <label className="form-check-label" htmlFor={`accessLevel-${accessLevel}`}>{accessLevel}</label>
            </div>
        ))
    }


    render() {
        return (
            <div className="filterCheckboxes">
                <h5>Access Level</h5>
                <div>{this.renderAccessLevelCheckboxes()}</div>
            </div>
        )
    }
}
