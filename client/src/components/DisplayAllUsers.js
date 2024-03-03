import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import UserTable from "./UserTable"

import {SERVER_HOST} from "../config/global_constants"
import SortUsers from "./SortUsers"
import FilterUsers from './FilterUsers'
import SearchUsers from "./SearchUsers"


export default class DisplayAllUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            searchedUsers: [],
            originalUsers: [],
            filters: {
                accessLevel: []
            },
            searchQuery: '',
            sortOption: ''
        }
    }


    componentDidMount() {
        axios.get(`${SERVER_HOST}/users`, {
            headers: {
                'Authorization': localStorage.token
            }
        })
            .then(res => {
                this.setState({originalUsers: res.data, searchedUsers: res.data, users: res.data})
            })
            .catch(error => console.log(error))
    }


    render() {
        return (
            <div className="form-container">

                <SearchUsers onSearch={this.handleSearch}/>
                <SortUsers onSortChange={this.handleSortChange}/>
                <FilterUsers onFilterChange={this.handleFilterChange}/>


                <div className="table-container">
                    <UserTable users={this.state.users}/>
                </div>
                <Link className="blue-button" to={"/DisplayAllTshirts"}>Back</Link>
            </div>
        )
    }

    handleSortChange = (sortOption) => {
        this.setState({sortOption}, this.sortUsers)
    }

    handleFilterChange = (filters) => {
        this.setState({filters}, this.filterUsers)
    }

    handleSearch = (searchQuery) => {
        this.setState({searchQuery}, this.searchUsers)
    }

    searchUsers = () => {
        let {originalUsers, searchQuery} = this.state

        let searchFilteredUsers = searchQuery.trim() ? originalUsers.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [...originalUsers]

        this.setState({users: searchFilteredUsers, searchedUsers: searchFilteredUsers}, this.filterUsers)
    }


    filterUsers = () => {
        let {searchedUsers, filters} = this.state
        let filteredUsers = searchedUsers

        if (filters.accessLevel && filters.accessLevel.length > 0) {
            const accessLevelFilters = filters.accessLevel.map(Number)
            filteredUsers = filteredUsers.filter(user =>
                accessLevelFilters.includes(user.accessLevel)
            )
        }
        this.setState({users: filteredUsers}, this.sortUsers)
    }


    sortUsers = () => {
        let {users, sortOption} = this.state

        if (sortOption === 'name-alphabetic') {
            users.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        } else if (sortOption === 'name-alphabetic-reverse') {
            users.sort((b, a) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
        this.setState({users})
    }
}