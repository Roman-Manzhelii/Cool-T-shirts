import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import {ACCESS_LEVEL_GUEST} from "./config/global_constants"
import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"
import "./css/index.css"
import Header from "./components/Header"
import Footer from "./components/Footer"


import Register from "./components/Register"
// import ResetDatabase from "./components/ResetDatabase"
import Login from "./components/Login"
import Logout from "./components/Logout"
import AddTshirt from "./components/AddTshirt"
import EditTshirt from "./components/EditTshirt"
import DeleteTshirt from "./components/DeleteTshirt"
import DisplayAllTshirts from "./components/DisplayAllTshirts"
import BuyTshirt from "./components/BuyTshirt"
import PayPalMessage from "./components/PayPalMessage"
import LoggedInRoute from "./components/LoggedInRoute"
import ShoppingCart from "./components/ShoppingCart"


if (typeof localStorage.accessLevel === "undefined") {
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
    localStorage.profilePhoto = null
}


export default class App extends Component {
    render() {
        return (


            <BrowserRouter>
                <div className="My-header">
                    <Header/>
                </div>
                <Switch>
                    <Route exact path="/Register" component={Register}/>
                    {/*<Route exact path="/ResetDatabase" component={ResetDatabase}/>*/}
                    <Route exact path="/" component={DisplayAllTshirts}/>
                    <Route exact path="/Login" component={Login}/>
                    <Route exact path="/BuyTshirt/:id" component={BuyTshirt}/>
                    <Route exact path="/PayPalMessage/:messageType/:payPalPaymentID" component={PayPalMessage}/>
                    <LoggedInRoute exact path="/Logout" component={Logout}/>
                    <LoggedInRoute exact path="/AddTshirt" component={AddTshirt}/>
                    <LoggedInRoute exact path="/EditTshirt/:id" component={EditTshirt}/>
                    <LoggedInRoute exact path="/DeleteTshirt/:id" component={DeleteTshirt}/>
                    <LoggedInRoute exact path="/ShoppingCart" component={ShoppingCart}/>
                    <Route exact path="/DisplayAllTshirts" component={DisplayAllTshirts}/>

                    <Route path="*" component={DisplayAllTshirts}/>
                </Switch>
                <div className="My-footer">
                    <Footer/>
                </div>
            </BrowserRouter>

        )
    }
}