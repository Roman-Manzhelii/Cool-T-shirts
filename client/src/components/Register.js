import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {SERVER_HOST} from "../config/global_constants"


export default class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            selectedFile: null,
            errorMessage: "",
            isRegistered: false,
            wasSubmittedAtLeastOnce: false
        }
    }


    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleFileChange = (e) => {
        this.setState({selectedFile: e.target.files[0]})
    }

    validateName = (name) => {
        return name !== ""
    }

    validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!#€$%^&*]).{6,20}$/
        return passwordRegex.test(password)
    }

    validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const {name, email, password, confirmPassword} = this.state

        if (!this.validateName(name)) {
            this.setState({errorMessage: "Name is required", wasSubmittedAtLeastOnce: true})
            return
        }

        if (!this.validateEmail(email)) {
            this.setState({errorMessage: "Email must have the structure ***@***.***", wasSubmittedAtLeastOnce: true})
            return
        }

        if (!this.validatePassword(password)) {
            this.setState({
                errorMessage: "Password requires a number, special character (!#€$%^&*), lowercase and uppercase letter. The password requires a minimum of 6 characters, a maximum of 20",
                wasSubmittedAtLeastOnce: true
            })
            return
        }

        if (!this.validateConfirmPassword(password, confirmPassword)) {
            this.setState({errorMessage: "Passwords do not match", wasSubmittedAtLeastOnce: true})
            return
        }

        let formData = new FormData()
        formData.append("profilePhoto", this.state.selectedFile)

        axios.post(`${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`, formData, {headers: {"Content-type": "multipart/form-data"}})
            .then(res => {
                localStorage.name = res.data.name
                localStorage.email = res.data.email
                localStorage.accessLevel = res.data.accessLevel
                localStorage.token = res.data.token
                localStorage.profilePhoto = res.data.profilePhoto

                this.setState({isRegistered: true})
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
            errorMessage = <div className="error">{this.state.errorMessage}<br/></div>
        }
        return (
            <form className="form-container" noValidate={true} id="loginOrRegistrationForm"
                  onSubmit={this.handleSubmit}>

                {this.state.isRegistered ? <Redirect to="/DisplayAllTshirts"/> : null}

                <h2>New User Registration</h2>

                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.inputToFocus = input
                    }}
                /><br/>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                /><br/>

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="password"
                    title="Password must be at least ten-digits long and contains at least one lowercase letter, one uppercase letter, one digit and one of the following characters (£!#€$%^&*)"
                    value={this.state.password}
                    onChange={this.handleChange}
                /><br/>

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    autoComplete="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                /><br/>

                <input
                    type="file"
                    onChange={this.handleFileChange}
                /><br/><br/>
                <div className="nav-item">
                    <LinkInClass value="Register New User" className="green-button" onClick={this.handleSubmit}/>
                    <Link className="red-button" to={"/DisplayAllTshirts"}>Cancel</Link>
                </div>
                {errorMessage}
            </form>
        )
    }
}