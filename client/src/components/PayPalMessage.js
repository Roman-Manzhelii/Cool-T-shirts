import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

export default class PayPalMessage extends Component {
    static messageType = {
        SUCCESS: "success",
        ERROR: "error",
        CANCEL: "cancel"
    }

    constructor(props) {
        super(props)

        this.state = {
            redirectToDisplayAllTshirts: false,
            buttonType: "error-button"
        }
    }


    componentDidMount() {
        let messageClass = "error-message"
        if (this.props.match.params.messageType === PayPalMessage.messageType.SUCCESS) {
            this.setState({
                heading: "PayPal Transaction Confirmation",
                message: "Your PayPal transaction was successful.",
                buttonType: "success-button",
                messageClass: "success-message"
            })
        } else if (this.props.match.params.messageType === PayPalMessage.messageType.CANCEL) {
            this.setState({
                heading: "PayPal Transaction Cancelled",
                message: "You cancelled your PayPal transaction. Therefore, the transaction was not completed.",
                messageClass: messageClass
            })
        } else if (this.props.match.params.messageType === PayPalMessage.messageType.ERROR) {
            this.setState({
                heading: "PayPal Transaction Error",
                message: "An error occurred when trying to perform your PayPal transaction. The transaction was not completed. Please try to perform your transaction again.",
                messageClass: messageClass
            })
        } else {
            console.log("The 'messageType' prop that was passed into the PayPalMessage component is invalid. It must be one of the following: PayPalMessage.messageType.SUCCESS, PayPalMessage.messageType.CANCEL or PayPalMessage.messageType.ERROR")
        }
    }


    render() {
        return (
            <div className={`payPalMessage ${this.state.messageClass}`}>


                {this.state.redirectToDisplayAllTshirts ? <Redirect to="/DisplayAllTshirts"/> : null}

                <h3>{this.state.heading}</h3>
                <p>{this.props.match.params.message}</p>
                <p>{this.state.message}</p>

                {this.props.match.params.messageType === PayPalMessage.messageType.SUCCESS ?
                    <p>Your PayPal payment confirmation is <span
                        id="payPalPaymentID">{this.props.match.params.payPalPaymentID}</span></p> : null}

                <p id="payPalPaymentIDButton"><Link className={this.state.buttonType}
                                                    to={"/DisplayAllTshirts"}>Continue</Link></p>
            </div>
        )
    }
}