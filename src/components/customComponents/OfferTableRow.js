import React from 'react';

import { Row } from 'react-bootstrap';

import './ComponentCSS/MerchantAccounts.css'
import './ComponentCSS/StakingTable.css'

import ReactTooltip from "react-tooltip";

//This is an unused component NOTE:: July 27, 2021


export default class OfferTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            price: props.price,
            quantity: props.quantity,
            seller: props.seller,
            id: props.id,
            toEllipsis: props.toEllipsis,
            handleEditOfferForm: props.handleEditOfferForm,
            handleShowOrders: props.handleShowOrders,
            getOrders: props.getOrders
        };
    }

    render() {
        return (
            <div style={{maxHeight: '100%', overflowY: 'scroll'}}>
            <Row key={this.state.finalKey} className="staking-table-row">
                <p style={{wordBreak: 'break-word'}}>{this.state.title}</p>
            
                <p>{this.state.price}</p>
            
                <p>{this.state.quantity}</p>

                <p>{this.state.seller}</p>
            
                <p data-tip data-for='offerID'>
                    {this.state.toEllipsis(this.state.id, 5, 5)}
                </p>
                    <ReactTooltip className="entry-tooltip-container"
                        id='offerID' 
                        effect='solid'
                        place="top">
                        <span>
                            {this.state.id}
                        </span>
                    </ReactTooltip>
                <p>
                    <button className="edit-button" onClick={() => this.state.getOrders(
                            this.state.id, 
                            this.state.seller, 
                            'https://api.theworldmarketplace.com'
                            )
                        }>
                        Load
                    </button>

                    <button className="edit-button" onClick={this.state.handleEditOfferForm}>
                        Edit
                    </button>
                     
                    <button className="orders-button" onClick={this.state.handleShowOrders}>
                        Orders
                    </button>
                </p>
            </Row></div>
                
        )
    }
}