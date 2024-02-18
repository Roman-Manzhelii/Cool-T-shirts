import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios";

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class TshirtTableRow extends Component
{
    componentDidMount() {
        this.props.tshirt.photos.forEach(photo => {
            axios.get(`${SERVER_HOST}/tshirts/photo/${photo.filename}`).then(res => {
                if (res.data && res.data.image) {
                    const imgElement = document.getElementById(photo._id);
                    if (imgElement) {
                        imgElement.src = `data:;base64,${res.data.image}`;
                    }
                }
            }).catch(error => console.log(error));
        });
    }

    render() 
    {
        return (
            <tr>
                <td>{this.props.tshirt.style}</td>
                <td>{this.props.tshirt.color}</td>
                <td>{this.props.tshirt.brand}</td>
                <td>{this.props.tshirt.price}</td>
                <td className="tshirtPhotos">
                    {this.props.tshirt.photos.map(photo => <img key={photo._id} id={photo._id} alt=""/>)}
                </td>
                <td>
                    {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? <Link className="edit-button" to={"/EditTshirt/" + this.props.tshirt._id}>Edit</Link> : null}
                    
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <Link className="delete-button" to={"/DeleteTshirt/" + this.props.tshirt._id}>Delete</Link> : null}
                </td>
            </tr>
        )
    }
}