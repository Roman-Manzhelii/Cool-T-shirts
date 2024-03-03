import React, {Component} from "react"
import {Link} from "react-router-dom"
import axios from "axios"
import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class UserTableRow extends Component {
    componentDidMount() {
        const photoFilename = this.props.user.profilePhotoFilename
        if (photoFilename) {
            axios.get(`${SERVER_HOST}/users/photo/${photoFilename}`, {
                headers: {
                    'Authorization': localStorage.token
                }
            })
                .then(res => {
                    if (res.data && res.data.image) {
                        const imgElementId = `user-photo-${this.props.user._id}`
                        const imgElement = document.getElementById(imgElementId)
                        if (imgElement) {
                            imgElement.src = `data:;base64,${res.data.image}`
                        }
                    }
                }).catch(error => console.log(error))
        }
    }


    render() {
        const imgElementId = `user-photo-${this.props.user._id}`

        return (
            <tr className="userinfo">
                <td>{this.props.user.name}</td>
                <td>{this.props.user.email}</td>
                <td>{this.props.user.accessLevel}</td>
                <td className="userPhotos">
                    <img key={this.props.user._id} id={imgElementId} alt=""/>
                </td>
                <td>


                    {this.props.user.accessLevel !== ACCESS_LEVEL_ADMIN ?
                        <Link className="delete-button" to={"/DeleteUser/" + this.props.user._id}>Delete</Link>
                        : null
                    }
                    <Link className="blue-button" to={"/DisplaySales/" + this.props.user.email}>View Purchases</Link>
                </td>
            </tr>
        )
    }

}