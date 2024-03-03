import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import {ACCESS_LEVEL_ADMIN, SERVER_HOST, ACCESS_LEVEL_NORMAL_USER} from "../config/global_constants"


export default class TshirtTableRow extends Component {
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

    addToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || []
        const tshirtId = this.props.tshirt._id

        if (!cart.includes(tshirtId)) {
            cart.push(tshirtId)
            localStorage.setItem("cart", JSON.stringify(cart))
            alert("T-shirt added to cart")
        } else {
            alert("This T-shirt is already in the cart")
        }
    }

    render() {
        let soldOrForSale

        if (this.props.tshirt.quantity <= 0) {
            soldOrForSale = "SOLD"
        } else {
            soldOrForSale = <button onClick={this.addToCart}>Add to cart</button>
        }
        return (
            <tr>
                <td className="tshirtDetails">
                    <li>{this.props.tshirt.style}</li>
                    <li>{this.props.tshirt.color}</li>
                    <li>{this.props.tshirt.brand}</li>
                    <li><p>&euro;</p>{this.props.tshirt.price}</li>
                </td>
                <td className="tshirtPhotos">
                    {this.props.tshirt.photos.map(photo => <img key={photo._id} id={photo._id} alt=""/>)}
                </td>

                <td>
                    {localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ? soldOrForSale : null}
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="edit-button" to={"//" + this.props.tshirt._id}>Edit</Link> : null}
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="delete-button" to={"/DeleteTshirt/" + this.props.tshirt._id}>Delete</Link>
                        : null}
                </td>


            </tr>
        )
    }
}