import React, {Component} from "react"
export default class FilterTshirts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sizes: {
                S: false,
                M: false,
                L: false,
                XL: false
            },
            colors: {
                red: false,
                blue: false,
                green: false
            },
            styles: {
                casual: false,
                formal: false,
                sport: false
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
                sizes: Object.keys(this.state.sizes).filter(key => this.state.sizes[key]),
                colors: Object.keys(this.state.colors).filter(key => this.state.colors[key]),
                styles: Object.keys(this.state.styles).filter(key => this.state.styles[key])
            };
            this.props.onFilterChange(filters);
        });
    }


    renderSizeCheckboxes() {
        return Object.keys(this.state.sizes).map(size => (
            <div key={size} className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`size-${size}`}
                    checked={this.state.sizes[size]}
                    onChange={() => this.handleCheckboxChange('sizes', size)}
                />
                <label className="form-check-label" htmlFor={`size-${size}`}>{size}</label>
            </div>
        ));
    }

    renderColorCheckboxes() {
        return Object.keys(this.state.colors).map(color => (
            <div key={color} className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`color-${color}`}
                    checked={this.state.colors[color]}
                    onChange={() => this.handleCheckboxChange('colors', color)}
                />
                <label className="form-check-label" htmlFor={`color-${color}`}>{color}</label>
            </div>
        ));
    }

    renderStyleCheckboxes() {
        return Object.keys(this.state.styles).map(style => (
            <div key={style} className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`style-${style}`}
                    checked={this.state.styles[style]}
                    onChange={() => this.handleCheckboxChange('styles', style)}
                />
                <label className="form-check-label" htmlFor={`style-${style}`}>{style}</label>
            </div>
        ));
    }

    render() {
        return (
            <div className="filterCheckboxes">
                <h4>Filter by Size</h4>
                <div>{this.renderSizeCheckboxes()}</div>
                <h4>Filter by Color</h4>
                <div>{this.renderColorCheckboxes()}</div>
                <h4>Filter by Style</h4>
                <div>{this.renderStyleCheckboxes()}</div>
            </div>
        );
    }
}
