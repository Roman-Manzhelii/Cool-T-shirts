import React, {Component} from "react"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"


export default class TshirtTableRowCart extends Component {
    componentDidMount() {
        this.props.tshirt.photos.forEach(photo => {
            axios.get(`${SERVER_HOST}/tshirts/photo/${photo.filename}`).then(res => {
                if (res.data && res.data.image) {
                    const imgElement = document.getElementById(photo._id)
                    if (imgElement) {
                        imgElement.src = `data:;base64,${res.data.image}`
                    }
                }
            }).catch(error => console.log(error))
        })
    }

// У файлі TshirtTableRowCart.js

    removeFromCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || []
        const newCart = cart.filter(id => id !== this.props.tshirt._id)
        localStorage.setItem("cart", JSON.stringify(newCart))

        this.props.updateCart()
    }

    render() {
        return (
            <tr>
                <td>{this.props.tshirt.style}</td>
                <td>{this.props.tshirt.color}</td>
                <td>{this.props.tshirt.brand}</td>
                <td>{this.props.tshirt.price}€</td>
                <td className="tshirtPhotos">
                    {this.props.tshirt.photos.map(photo => <img key={photo._id} id={photo._id} alt=""/>)}
                </td>
                <td>
                    <button onClick={this.removeFromCart}>Remove from cart</button>
                </td>
            </tr>
        )
    }
}