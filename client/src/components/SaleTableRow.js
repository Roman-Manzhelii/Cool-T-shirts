import React, {Component} from "react"
import axios from "axios"
import {SERVER_HOST} from "../config/global_constants"

export default class SaleTableRow extends Component {
    state = {
        tshirts: []
    }

    componentDidMount() {
        const tshirtIds = this.props.sale.tshirtIDs
        axios.post(`${SERVER_HOST}/tshirts/bulk`, {ids: tshirtIds}, {
            headers: {
                "Authorization": localStorage.token,
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                this.setState({tshirts: response.data})
            })
            .catch(error => {
                console.log("Error fetching tshirts details:", error)
            })
    }


    renderTshirtsDetails() {
        return this.state.tshirts.map(tshirt => (
            <div key={tshirt._id}>
                {tshirt.style} - {tshirt.color} - {tshirt.brand} - {tshirt.price}€
            </div>
        ))
    }

    render() {
        return (
            <tr>
                <td>{this.props.sale.paypalPaymentID}</td>
                <td>{this.props.sale.customerName}</td>
                <td>{this.props.sale.customerEmail}</td>
                <td>{this.props.sale.price}</td>
                <td>{this.renderTshirtsDetails()}</td>
            </tr>
        )
    }
}
