import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST} from "../config/global_constants"


export default class Logout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: true
        }
    }


    handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`${SERVER_HOST}/users/logout`)
            .then(() => {
                localStorage.clear()
                this.setState({isLoggedIn: false})
            })
            .catch(error => console.log(error))
    }


    render() {
        return (
            <div>
                {!this.state.isLoggedIn ? <Redirect to="/DisplayAllTshirts"/> : null}
                <LinkInClass value="Log out" className="red-button" onClick={this.handleSubmit}/>
            </div>
        )
    }
}