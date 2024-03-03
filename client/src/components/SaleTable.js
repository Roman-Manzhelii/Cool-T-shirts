import React, {Component} from "react"
import SaleTableRow from "./SaleTableRow"


export default class SaleTable extends Component {
    render() {
        return (
            <table>
                <tbody>
                {this.props.sales.map((sale) => <SaleTableRow key={sale._id} sale={sale}/>)}
                </tbody>
            </table>
        )
    }
}