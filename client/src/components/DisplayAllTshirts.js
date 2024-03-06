import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import TshirtTable from "./TshirtTable"
import Logout from "./Logout"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST, ACCESS_LEVEL_NORMAL_USER} from "../config/global_constants"
import SortTshirts from "./SortTshirts"
import FilterTshirts from './FilterTshirts'
import SearchTshirts from "./SearchTshirts"

export default class DisplayAllTshirts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tshirts: [],
            searchedTshirts: [],
            originalTshirts: [],
            filters: {
                size: [],
                color: [],
                style: []
            },
            searchQuery: '',
            sortOption: ''
        }
    }


    componentDidMount() {
        axios.get(`${SERVER_HOST}/tshirts`)
            .then(res => {
                this.setState({originalTshirts: res.data, searchedTshirts: res.data, tshirts: res.data})
            })
            .catch(error => console.log(error))
    }


    render() {
        return (
            <div className="form-container">
                {
                    localStorage.accessLevel > ACCESS_LEVEL_GUEST ?
                        <>
                            <div className="logout"><Logout/></div>
                            {localStorage.profilePhoto !== "null"
                                ? <img id="profilePhoto" src={`data:;base64,${localStorage.profilePhoto}`} alt=""/>
                                : null
                            }
                        </>
                        :
                        <div className="welcome-container">
                            <div className="welcome">
                                <Link className="green-button" to={"/Login"}>Login</Link>
                                <Link className="blue-button" to={"/Register"}>Register</Link>
                                <br/><br/><br/>
                            </div>
                        </div>
                }

                {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                    <div className="user-table">
                        <Link className="blue-button" to={"/UsersTable"}>Users</Link>
                    </div>
                    :
                    null
                }

                {Number(localStorage.accessLevel) === ACCESS_LEVEL_NORMAL_USER ?
                    <div className="sales-table">
                        <Link className="blue-button" to={`/DisplaySales/${localStorage.email}`}>Purchases
                            history</Link>
                    </div>
                    :
                    null
                }

                {localStorage.accessLevel >= ACCESS_LEVEL_NORMAL_USER ?
                    <div className="shoppingcart-tshirt">
                        <Link className="shoppingcart-button" to={"/ShoppingCart"}><span
                            className="material-symbols-outlined">
                    shopping_bag
            </span></Link>
                    </div>
                    :
                    null
                }


                <SearchTshirts onSearch={this.handleSearch}/>
                <SortTshirts onSortChange={this.handleSortChange}/>
                <FilterTshirts onFilterChange={this.handleFilterChange}/>


                <div className="table-container">
                    <TshirtTable tshirts={this.state.tshirts}/>

                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
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
        this.setState({sortOption}, this.sortTshirts)
    }

    handleFilterChange = (filters) => {
        this.setState({filters}, this.filterTshirts)
    }

    handleSearch = (searchQuery) => {
        this.setState({searchQuery}, this.searchTshirts)
    }

    searchTshirts = () => {
        let {originalTshirts, searchQuery} = this.state

        let searchFilteredTshirts = searchQuery.trim() ? originalTshirts.filter(tshirt =>
            tshirt.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tshirt.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tshirt.country_of_manufacture.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [...originalTshirts]

        this.setState({tshirts: searchFilteredTshirts, searchedTshirts: searchFilteredTshirts}, this.filterTshirts)
    }


    filterTshirts = () => {
        let {searchedTshirts, filters} = this.state
        let filteredTshirts = searchedTshirts

        if (filters.size && filters.size.length > 0) {
            filteredTshirts = filteredTshirts.filter(tshirt =>
                tshirt.size.some(size => filters.size.includes(size))
            )
        }
        if (filters.color && filters.color.length > 0) {
            filteredTshirts = filteredTshirts.filter(tshirt =>
                filters.color.some(color => tshirt.color.toLowerCase().includes(color.toLowerCase()))
            )
        }
        if (filters.style && filters.style.length > 0) {
            filteredTshirts = filteredTshirts.filter(tshirt =>
                filters.style.some(style => tshirt.style.toLowerCase().includes(style.toLowerCase()))
            )
        }
        this.setState({tshirts: filteredTshirts}, this.sortTshirts)
    }


    sortTshirts = () => {
        let {tshirts, sortOption} = this.state

        if (sortOption === 'price-low-high') {
            tshirts.sort((a, b) => a.price - b.price)
        } else if (sortOption === 'price-high-low') {
            tshirts.sort((a, b) => b.price - a.price)
        } else if (sortOption === 'brand') {
            tshirts.sort((a, b) => a.brand.toLowerCase().localeCompare(b.brand.toLowerCase()))
        }

        this.setState({tshirts})
    }
}