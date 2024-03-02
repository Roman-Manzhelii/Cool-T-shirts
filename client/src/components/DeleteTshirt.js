import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import {SERVER_HOST} from "../config/global_constants"


export default class DeleteTshirt extends Component {
    constructor(props) {
        super(props)

        this.state = {
            redirectToDisplayAllTshirts: false
        }
    }


    componentDidMount() {
        axios.delete(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`, {
            headers: {
                "authorization": localStorage.token,
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                this.setState({redirectToDisplayAllTshirts: true})
            })
            .catch(error => console.log(error))
    }


    render() {
        return (
            <div>
                {this.state.redirectToDisplayAllTshirts ? <Redirect to="/DisplayAllTshirts"/> : null}
            </div>
        )
    }
}