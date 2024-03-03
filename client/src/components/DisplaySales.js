import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import SaleTable from "./SaleTable"

import {SERVER_HOST} from "../config/global_constants"
import SortSales from "./SortSales"


export default class DisplaySales extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sales: []
        }
    }


    componentDidMount() {
        axios.get(`${SERVER_HOST}/purchases/byUser/${this.props.match.params.email}`, {
            headers: {
                'Authorization': localStorage.token
            }
        })
            .then(res => {
                this.setState({sales: res.data})
            })
            .catch(error => console.log(error))
    }


    render() {
        return (
            <div className="form-container">
                <SortSales onSortChange={this.handleSortChange}/>

                <div className="table-container">
                    <SaleTable sales={this.state.sales}/>
                </div>
                <Link className="blue-button" to={"/DisplayAllTshirts"}>Back</Link>
            </div>
        )
    }

    handleSortChange = (sortOption) => {
        this.setState({sortOption}, this.sortSales)
    }

    sortSales = () => {
        let {sales, sortOption} = this.state

        if (sortOption === 'price-low-high') {
            sales.sort((a, b) => a.price - b.price)
        } else if (sortOption === 'price-high-low') {
            sales.sort((a, b) => b.price - a.price)
        }
        this.setState({sales})
    }
}