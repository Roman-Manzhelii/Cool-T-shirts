import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"
import TshirtTable from "./TshirtTable"
import Logout from "./Logout"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"
import SortTshirts from "./SortTshirts";
import FilterTshirts from './FilterTshirts';



export default class DisplayAllTshirts extends Component
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            tshirts:[],
            filters: {
                size: [],
                color: [],
                style: []
            }
        }
    }
    
    
    componentDidMount() 
    {
         axios.get(`${SERVER_HOST}/tshirts`)
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
                    console.log("Records read")
                    this.setState({tshirts: res.data})
                    console.log(res)
                }
            }
            else
            {
                console.log("Record not found")
            }
        })
    }

  
    render() 
    {   
        return (           
            <div className="form-container">
                {sessionStorage.accessLevel > ACCESS_LEVEL_GUEST ? 
                    <div className="logout">
                        <Logout/>
                    </div>
                :
                    <div>
                        <Link className="green-button" to={"/Login"}>Login</Link>
                        <Link className="blue-button" to={"/Register"}>Register</Link>  
                        <Link className="red-button" to={"/ResetDatabase"}>Reset Database</Link>  <br/><br/><br/>
                    </div>
                }

                <SortTshirts onSortChange={this.handleSortChange} />  <br/>
                <FilterTshirts onFilterChange={this.handleFilterChange} />  <br/>

                <div className="table-container">
                    <TshirtTable tshirts={this.state.tshirts} />
                        
                    {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        <div className="add-new-tshirt">
                            <Link className="blue-button" to={"/AddTshirt"}>Add New T-shirt</Link>
                        </div>
                    :
                        null
                    }
                </div>
            </div> 
        )
    }

    handleSortChange = (sortOption) => {
        let sortedTshirts = [...this.state.tshirts];

        if (sortOption === 'price-low-high') {
            sortedTshirts.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high-low') {
            sortedTshirts.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'brand') {
            sortedTshirts.sort((a, b) => a.brand.toLowerCase().localeCompare(b.brand.toLowerCase()));
        }

        this.setState({ tshirts: sortedTshirts });
    }

    handleFilterChange = (newFilters) => {
        this.setState({ filters: newFilters }, this.applyFilters);
    }

    applyFilters = () => {
        axios.get(`${SERVER_HOST}/tshirts`)
            .then(res => {
                if (res.data) {
                    let filteredTshirts = res.data;
                    const { sizes, colors, styles } = this.state.filters;

                    if (sizes.length > 0) {
                        filteredTshirts = filteredTshirts.filter(tshirt =>
                            sizes.some(size => tshirt.size.includes(size))
                        );
                    }

                    if (colors.length > 0) {
                        filteredTshirts = filteredTshirts.filter(tshirt =>
                            colors.map(color => color.toLowerCase()).includes(tshirt.color.toLowerCase()));
                    }

                    if (styles.length > 0) {
                        filteredTshirts = filteredTshirts.filter(tshirt =>
                            styles.map(style => style.toLowerCase()).includes(tshirt.style.toLowerCase()));
                    }

                    this.setState({ tshirts: filteredTshirts });
                }
            });
    }



}