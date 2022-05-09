import React from "react";
import ReactModal from "react-modal";
import {CgClose} from "react-icons/cg";
import {get_offer_by_id} from "../../utils/twm_actions";
import sfxLogo from "../../img/sfx.svg";

export default class MessagesModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            offer: {
                username: ''
            },
            purchase_proof: '',
            order_info: {
                quantity: 0,
                price: 0,
                title: '',
                seller: ''
            }
        }
    }

    async componentDidUpdate(prevProps) {
        try {
            if (this.props.offerId && this.props.offerId !== prevProps.offerId) {
                const offer = await get_offer_by_id(this.props.offerId, this.props.apiUrl);
                if (offer.offer) {
                    return this.setState({offer: offer.offer});
                }
            }
        } catch (err) {
            console.error('error at loading offer', err)
        }
    }

    load_datas = () => {
        this.setState({order_info: this.props.wOrder});
    }



    render() {
        const {buyer_purchase_proof, isOpen, closeFn, orderId, refreshFn, sendFn, messages, offerId, seller, title, price, wOrder} = this.props;
        console.log(wOrder);
        return (
            <ReactModal
                isOpen={isOpen}
                onAfterOpen={this.load_datas}
                closeTimeoutMS={500}
                className="buyer-messages-modal"
                onRequestClose={() => closeFn()}
                style={{
                    overlay: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.75)",
                    },
                    content: {
                        position: "absolute",
                        top: "12%",
                        left: "30%",
                    },
                }}>
                <>
                    <div className="modal-title">
                        MESSAGES
                        <CgClose
                            className="pointer"
                            style={{position: "absolute", right: "15px", color: "red"}}
                            size={20}
                            onClick={() => closeFn()}
                        />
                    </div>
                    <div className="pt-4 pl-4 pr-4">
                        <div className="d-flex flex-column" style={{
                            borderBottom: "1px solid #e2e2e2",
                            paddingBottom: "18px",
                        }}>
                            <div className="d-flex">
                                <label>Offer ID:</label>
                                <span className="ml-2">{offerId}</span>
                            </div>
                            <div className="d-flex">
                                <label>Order ID:</label>
                                <span className="ml-2">{orderId}</span>
                            </div>
                            <div className="d-flex">
                                <label>Purchase Proof:</label>
                                <span className="ml-2">{messages.proof}</span>
                            </div>
                            <div className="d-flex">
                                <label>Seller:</label>
                                <span className="ml-2">{this.state.order_info.seller}</span>
                            </div>
                            <div className="d-flex">
                                <label>Title:</label>
                                <span className="ml-2">{this.state.order_info.title}</span>
                            </div>
                            <div className="d-flex">
                                <label>Quantity:</label>
                                <span className="ml-2">{this.state.order_info.quantity}</span>
                            </div>
                            <div className="d-flex">
                                <label>Price:</label>
                                <span className="ml-2">{this.state.order_info.price} SFX <img width="20px"
                                                                                             className="ml-2"
                                                                                             src={sfxLogo}/></span>
                            </div>
                        </div>

                        <div className="mt-4 flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <label>Messages</label>
                                <button onClick={refreshFn}>Refresh Messages</button>
                            </div>
                            <div style={{height: "340px", overflow: "overlay", marginTop: "10px"}}>
                                {messages.messages}
                            </div>
                        </div>
                        <form onSubmit={e => sendFn(e)}>
                              <textarea style={{fontSize: "1.2rem"}} rows="4" cols="30" name="messageBox">

                              </textarea>

                            <button style={{height: "35px"}} className="my-3 search-button" type="submit">
                                Send
                            </button>
                        </form>
                    </div>
                </>
            </ReactModal>
        );
    }
}
