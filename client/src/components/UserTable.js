import React, {Component} from "react"
import UserTableRow from "./UserTableRow"


export default class UserTable extends Component {
    render() {
        return (
            <table>
                <tbody>
                {this.props.users.map((user) => <UserTableRow key={user._id} user={user}/>)}
                </tbody>
            </table>
        )
    }
}