import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST} from "../config/global_constants"


export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            errorMessage: "",
            isLoggedIn: false,
            wasSubmittedAtLeastOnce: false
        }
    }


    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }


    handleSubmit = () => {
        axios.post(`${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`)
            .then(res => {
                localStorage.name = res.data.name
                localStorage.email = res.data.email
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token
                localStorage.profilePhoto = res.data.profilePhoto

                this.setState({isLoggedIn: true})
            })
            .catch(err => {
                const errorMessage = err.response && err.response.data.errorMessage
                    ? err.response.data.errorMessage : "An unexpected error occurred."
                this.setState({errorMessage: errorMessage, wasSubmittedAtLeastOnce: true})
            })
    }


    render() {
        let errorMessage = ""
        if (this.state.wasSubmittedAtLeastOnce) {
            errorMessage = <div className="error">Login Details are incorrect. {this.state.errorMessage} <br/></div>
        }
        return (
            <form className="form-container" noValidate={true} id="loginOrRegistrationForm">
                <h2>Login</h2>

                {this.state.isLoggedIn ? <Redirect to="/DisplayAllTshirts"/> : null}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                /><br/>

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                /><br/><br/>

                <div className="nav-item">
                    <LinkInClass value="Login" className="green-button" onClick={this.handleSubmit}/>
                    <Link className="red-button" to={"/DisplayAllTshirts"}>Cancel</Link>
                </div>
                {errorMessage}
            </form>
        )
    }
}