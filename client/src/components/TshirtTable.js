import React, {Component} from "react"
import TshirtTableRow from "./TshirtTableRow"


export default class TshirtTable extends Component
{
    render() 
    {
        return (
            <table>
                <tbody>
                    {this.props.tshirts.map((tshirt) => <TshirtTableRow key={tshirt._id} tshirt={tshirt}/>)}
                </tbody>
            </table>      
        )
    }
}