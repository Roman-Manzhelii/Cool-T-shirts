import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import {ACCESS_LEVEL_NORMAL_USER, SERVER_HOST} from "../config/global_constants"

import TshirtTableRowCart from "./TshirtTableRowCart"
import BuyTshirt from "./BuyTshirt"


export default class ShoppingCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToDisplayAllTshirts: localStorage.accessLevel < ACCESS_LEVEL_NORMAL_USER,
            tshirts: [],
            errorMessage: '',
        }
    }

    componentDidMount() {
        this.loadTshirtsFromCart()
    }

    loadTshirtsFromCart = () => {
        const tshirtIds = JSON.parse(localStorage.getItem("cart")) || []

        if (tshirtIds.length === 0) {
            this.setState({errorMessage: "Your cart is empty. Please add some products to your cart before proceeding to checkout."})
            return
        }

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
                const errorMessage = error.response && error.response.data.errorMessage
                    ? error.response.data.errorMessage : "An unexpected error occurred while fetching tshirts."
                this.setState({errorMessage})
            })
    }


    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({redirectToDisplayAllTshirts: true})
    }


    render() {
        const totalPrice = this.state.tshirts.reduce((acc, tshirt) => acc + parseFloat(tshirt.price), 0).toFixed(2)
        const tshirtIds = this.state.tshirts.map(tshirt => tshirt._id)

        return (
            <div className="form-cart">
                {this.state.redirectToDisplayAllTshirts ? <Redirect to="/DisplayAllTshirts"/> : null}
                {this.state.errorMessage}
                <table>
                    <tbody>
                    {this.state.tshirts.map((tshirt) => <TshirtTableRowCart key={tshirt._id} tshirt={tshirt}
                                                                            updateCart={this.loadTshirtsFromCart}/>)}
                    </tbody>
                </table>

                {tshirtIds.length > 0 ? <BuyTshirt tshirtIDs={tshirtIds} price={totalPrice}/> : null}
                <Link className="red-button" to={"/DisplayAllTshirts"}>Continue Shopping</Link>

            </div>
        )
    }
}
