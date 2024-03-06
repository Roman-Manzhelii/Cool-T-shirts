import React, {Component} from "react"

export default class FilterUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessLevels: {
                1: false,
                2: false
            },
            isPanelOpen: false
        }
    }

    togglePanel = () => {
        this.setState(prevState => ({isPanelOpen: !prevState.isPanelOpen}));
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
        return (
            <div className="filter-section">
                <h5 className="filter-title"><strong>AccessLevel</strong></h5>
                <div className="filter-options">
                    {Object.keys(this.state.accessLevels).map(accessLevel => (
                        <div key={accessLevel} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`accessLevel-${accessLevel}`}
                                checked={this.state.accessLevels[accessLevel]}
                                onChange={() => this.handleCheckboxChange('accessLevels', accessLevel)}
                            />
                            <label className="form-check-label"
                                   htmlFor={`accessLevel-${accessLevel}`}>{accessLevel}</label>
                        </div>
                    ))}
                </div>
            </div>
        )
    }


    render() {
        const {isPanelOpen} = this.state;
        return (
            <>
                <div className={`filter-panel ${isPanelOpen ? "open" : ""}`}>
                    <br/><br/>{this.renderAccessLevelCheckboxes()}
                </div>
                <div className="hamburger-container" onClick={this.togglePanel}>
                    <span className="material-symbols-outlined">
                        {isPanelOpen ? 'arrow_back_ios' : 'arrow_forward_ios'}
                    </span>
                </div>
            </>
        );
    }
}
