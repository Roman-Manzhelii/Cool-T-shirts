import React, {Component} from "react"

import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"


export default class TshirtTableRowCart extends Component {

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

    removeFromCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || []
        const newCart = cart.filter(id => id !== this.props.tshirt._id)
        localStorage.setItem("cart", JSON.stringify(newCart))

        this.props.updateCart()
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
                    <button onClick={this.removeFromCart}>Remove from cart</button>
                </td>
            </tr>
        )
    }
}