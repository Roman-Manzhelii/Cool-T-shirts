import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class AddTshirt extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            style:"",
            color:"",
            size: [],
            materials: [],
            photo: [],
            country_of_manufacture: "",
            brand:"",
            price:"",
            redirectToDisplayAllTshirts:sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
        }
    }


    componentDidMount() 
    {     
        this.inputToFocus.focus()        
    }
 
 
    handleChange = (e) => 
    {
        if(e.target.name === "size" || e.target.name === "materials" || e.target.name === "photo") {
            this.setState({[e.target.name]: e.target.value.split(',')});
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
    }


    handleSubmit = (e) => 
    {
        e.preventDefault()

        const tshirtObject = {
            style: this.state.style,
            color: this.state.color,
            size: this.state.size.map(item => item.trim()),
            materials: this.state.materials.map(item => item.trim()),
            photo: this.state.photo.map(item => item.trim()),
            country_of_manufacture: this.state.country_of_manufacture,
            brand: this.state.brand,
            price: this.state.price
        }

        axios.post(`${SERVER_HOST}/tshirts`, tshirtObject)
        .then(res => 
        {   
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                {   
                    console.log("Record added")
                    this.setState({redirectToDisplayAllTshirts:true})
                } 
            }
            else
            {
                console.log("Record not added")
            }
        })
    }


    render()
    {        
        return (
            <div className="form-container"> 
                {this.state.redirectToDisplayAllTshirts ? <Redirect to="/DisplayAllTshirts"/> : null}
                    
                <Form>
                    <Form.Group controlId="style">
                        <Form.Label>Style</Form.Label>
                        <Form.Control ref = {(input) => { this.inputToFocus = input }} type="text" name="style" value={this.state.style} onChange={this.handleChange} />
                    </Form.Group>
    
                    <Form.Group controlId="color">
                        <Form.Label>Color</Form.Label>
                        <Form.Control type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="size">
                        <Form.Label>Size</Form.Label>
                        <Form.Control type="text" name="size" value={this.state.size.join(',')} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="materials">
                        <Form.Label>Materials</Form.Label>
                        <Form.Control type="text" name="materials" value={this.state.materials.join(',')} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="photo">
                        <Form.Label>Photo</Form.Label>
                        <Form.Control type="text" name="photo" value={this.state.photo.join(',')} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="country-of-manufacture">
                        <Form.Label>Country of manufacture</Form.Label>
                        <Form.Control type="text" name="country_of_manufacture" value={this.state.country_of_manufacture} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="brand">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />
                    </Form.Group>
    
                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    </Form.Group> 
            
                    <LinkInClass value="Add" className="addbutton" onClick={this.handleSubmit}/>
            
                    <Link className="red-button" to={"/DisplayAllTshirts"}>Cancel</Link>
                </Form>
            </div>
        )
    }
}