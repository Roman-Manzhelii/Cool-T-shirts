import React, {Component} from "react"
import TshirtTableRow from "./TshirtTableRow"


export default class TshirtTable extends Component
{
    render() 
    {
        return (
            <table>
                <thead>
                    <tr>

                        <th>Style</th>
                        <th>Color</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Photos</th>
                        <th> </th>
                    </tr>
                </thead>
                  
                <tbody>
                    {this.props.tshirts.map((tshirt) => <TshirtTableRow key={tshirt._id} tshirt={tshirt}/>)}
                </tbody>
            </table>      
        )
    }
}