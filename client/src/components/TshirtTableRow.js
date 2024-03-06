import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import {ACCESS_LEVEL_ADMIN, SERVER_HOST, ACCESS_LEVEL_NORMAL_USER} from "../config/global_constants"


export default class TshirtTableRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPhotoIndex: 0,
            photos: []
        }
    }

    componentDidMount() {
        const loadedPhotos = this.props.tshirt.photos.map(photo => {
            return axios.get(`${SERVER_HOST}/tshirts/photo/${photo.filename}`)
                .then(res => {
                    if (res.data && res.data.image) {
                        return `data:;base64,${res.data.image}`;
                    }
                    return null;
                }).catch(error => {
                    console.log(error);
                    return null;
                });
        });

        Promise.all(loadedPhotos).then(photos => {
            this.setState({photos: photos.filter(photo => photo !== null)})
        });
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

    nextPhoto = () => {
        this.setState(prevState => ({
            currentPhotoIndex: (prevState.currentPhotoIndex + 1) % this.props.tshirt.photos.length,
        }));
    };

    prevPhoto = () => {
        this.setState(prevState => ({
            currentPhotoIndex: (prevState.currentPhotoIndex - 1 + this.props.tshirt.photos.length) % this.props.tshirt.photos.length,
        }));
    };


    render() {
        const {currentPhotoIndex, photos} = this.state;
        let soldOrForSale;

        if (this.props.tshirt.quantity <= 0) {
            soldOrForSale = <span className="sold-out">SOLD</span>;
        } else {
            soldOrForSale = <button onClick={this.addToCart} className="add-to-cart-button">Add to cart</button>;
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
                    {photos.length > 0 && currentPhotoIndex < photos.length ? (
                        <>
                            <button onClick={this.prevPhoto} className="navigation-button">{"<"}</button>
                            <img src={photos[currentPhotoIndex]} alt=""/>
                            <button onClick={this.nextPhoto} className="navigation-button">{">"}</button>
                        </>
                    ) : null}
                </td>

                <td>
                    {localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ? soldOrForSale : null}
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="edit-button" to={"/EditTshirt/" + this.props.tshirt._id}>Edit</Link> : null}
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <Link className="delete-button" to={"/DeleteTshirt/" + this.props.tshirt._id}>Delete</Link>
                        : null}
                </td>
            </tr>
        );
    }
}