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
            country_of_manufacture: "",
            brand:"",
            price:"",
            selectedFiles: null,
            errorMessage: "",
            redirectToDisplayAllTshirts:localStorage.accessLevel < ACCESS_LEVEL_ADMIN
        }
    }


    componentDidMount() 
    {     
        this.inputToFocus.focus()        
    }
 
 
    handleChange = (e) => 
    {
        if(e.target.name === "size" || e.target.name === "materials") {
            this.setState({[e.target.name]: e.target.value.split(',')});
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
    }

    handleFileChange = (e) =>
    {
        this.setState({selectedFiles: e.target.files})
    }

    handleSubmit = (e) => 
    {
        e.preventDefault()

        let formData = new FormData()
        formData.append("style", this.state.style)
        formData.append("color", this.state.color)
        this.state.size.forEach((size, index) => {
            formData.append(`size[${index}]`, size.trim());
        });
        this.state.materials.forEach((material, index) => {
            formData.append(`materials[${index}]`, material.trim());
        });
        formData.append("country_of_manufacture",  this.state.country_of_manufacture)
        formData.append("brand",  this.state.brand)
        formData.append("price",  this.state.price)

        if(this.state.selectedFiles)
        {
            for(let i = 0; i < this.state.selectedFiles.length; i++)
            {
                formData.append("tshirtPhotos", this.state.selectedFiles[i])
            }
        }

        axios.post(`${SERVER_HOST}/tshirts`, formData, {headers: {"authorization": localStorage.token, "Content-type": "multipart/form-data"}})
        .then(res =>
        {
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    this.setState({errorMessage: res.data.errorMessage})
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
                this.setState({errorMessage: "An unexpected error occurred."});
            }
        })
    }


    render()
    {
        let errorMessageComponent = "";
        if(this.state.errorMessage !== "")
        {
            errorMessageComponent = <div className="error"><br/>{this.state.errorMessage}</div>;
        }

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

                    <Form.Group controlId="photos">
                        <Form.Label>Photos</Form.Label>
                        <Form.Control type = "file" multiple onChange = {this.handleFileChange}/>
                    </Form.Group> <br/><br/>
            
                    <LinkInClass value="Add" className="addbutton" onClick={this.handleSubmit}/>
            
                    <Link className="red-button" to={"/DisplayAllTshirts"}>Cancel</Link>
                </Form>

                {errorMessageComponent}
            </div>
        )
    }
}