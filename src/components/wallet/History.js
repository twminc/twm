import React from 'react';

import {Row, Col, Container, Table} from 'react-bootstrap';
import {get_transactions} from "../../utils/safexd_calls";


export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txn_history_table_data_state: [],
            loading_hist: true
        };


    }

    componentDidMount() {
        console.log("load settings");
        this.props.updateHistory();
        console.log(this.props.theWallet.unlockedBalance());

        this.load_all();
    }

    load_all = async() => {
        let load_out = [];

        for (const [key, txn] of this.props.txnhistory.entries()) {

            let the_type = '';
            switch (txn.transactionType) {
                case 0: {
                    console.log(`sfx txn`);
                    the_type = 'sfx';
                    break;
                }
                case 1: {
                    the_type = 'sft';
                    break;
                }
                case 2: {
                    the_type = 'migration';
                    break;
                }
                case 3: {
                    the_type = 'stake';
                    console.log(txn);
                    break;
                }
                case 4: {
                    the_type = 'unstake';
                    break;
                }
                case 5: {
                    if (txn.direction == 'in') {
                        the_type = 'incoming buy';
                    } else {
                        the_type = 'your purchase';
                    }
                    break;
                }
                case 6: {
                    the_type = 'new account';
                    break;
                }
                case 7: {
                    the_type = 'edit account';
                    break;
                }
                case 8: {
                    the_type = 'new offer';
                    break;
                }
                case 9: {
                    the_type = 'edit offer';
                    break;
                }
                case 10: {
                    console.log(`feedback ${txn.direction}`);
                    the_type = 'feedback';
                    break;
                }
                case 11: {
                    the_type = 'price oracle';
                    break;
                }
                case 12: {
                    the_type = 'update oracle';
                    break;
                }
            }


            if (the_type == 'your purchase') {
                if (txn.transfers.length > 0) {
                    load_out.push(
                        <tr className="tx-row" key={key}>
                            <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                            <td>{txn.id}</td>
                            <td>{txn.direction}</td>
                            <td>{txn.pending}</td>
                            <td className="">{the_type}</td>
                            <td>{(txn.transfers[2].amount / 10000000000) + (txn.transfers[1].amount / 10000000000)} SFX</td>
                            <td>{txn.fee / 10000000000}</td>
                            <td>{txn.blockHeight}</td>
                            <td>{txn.confirmations}</td>
                        </tr>
                    )
                } else {
                    load_out.push(
                        <tr className="tx-row" key={key}>
                            <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                            <td>{txn.id}</td>
                            <td>{txn.direction}</td>
                            <td>{txn.pending}</td>
                            <td className="">{the_type}</td>
                            <td>{((txn.amount / 0.95) / 10000000000)} SFX</td>
                            <td>{txn.fee / 10000000000}</td>
                            <td>{txn.blockHeight}</td>
                            <td>{txn.confirmations}</td>
                        </tr>
                    )
                }
            } else if (the_type == 'sft' || the_type == 'unstake') {
                try {
                    let gst_obj = {};
                    gst_obj.daemon_host = this.props.daemon_host;
                    gst_obj.daemon_port = this.props.daemon_port;
                    let the_tx = await get_transactions(gst_obj, txn.id);

                    let tx_json = JSON.parse(the_tx.txs[0].as_json);

                    let the_vin = {};
                    the_vin.token_amount = 0;
                    the_vin.amount = 0;
                    the_vin.script = false;
                    for (const the_ins of tx_json.vin) {
                        if (the_ins.script) {
                            the_vin = the_ins.script;
                            the_vin.script = true;
                        }
                    }

                    if (the_vin.script == true) {
                        let the_true_fee = txn.fee / 10000000000;
                        if (the_true_fee > 100) {
                            the_true_fee = 0;
                        }
                        load_out.push(
                            <tr className="tx-row" key={key}>
                                <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                                <td>{txn.id}</td>
                                <td>{txn.direction}</td>
                                <td>{txn.pending}</td>
                                <td className="">{'unstake'}</td>
                                <td>{(the_vin.token_amount / 10000000000)} SFT + {the_vin.amount / 10000000000} SFX</td>
                                <td>{the_true_fee}</td>
                                <td>{txn.blockHeight}</td>
                                <td>{txn.confirmations}</td>
                            </tr>
                        )
                    } else {
                        load_out.push(
                            <tr className="tx-row" key={key}>
                                <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                                <td>{txn.id}</td>
                                <td>{txn.direction}</td>
                                <td>{txn.pending}</td>
                                <td className="">{the_type}</td>
                                <td>{txn.tokenAmount > 0 ? (`${txn.tokenAmount / 10000000000} SFT`) : (`${txn.amount / 10000000000} SFX`)}</td>
                                <td>{txn.fee / 10000000000}</td>
                                <td>{txn.blockHeight}</td>
                                <td>{txn.confirmations}</td>
                            </tr>
                        )
                    }
                } catch (err) {
                    console.error(err);
                    load_out.push(
                        <tr className="tx-row" key={key}>
                            <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                            <td>{txn.id}</td>
                            <td>{txn.direction}</td>
                            <td>{txn.pending}</td>
                            <td className="">{the_type}</td>
                            <td>{(txn.transfers[0].tokenAmount / 10000000000)} SFT</td>
                            <td>{txn.fee / 10000000000}</td>
                            <td>{txn.blockHeight}</td>
                            <td>{txn.confirmations}</td>
                        </tr>
                    )
                }
            } else if (the_type === 'stake') {
                try {

                    let gst_obj = {};
                    gst_obj.daemon_host = this.props.daemon_host;
                    gst_obj.daemon_port = this.props.daemon_port;
                    let the_tx = await get_transactions(gst_obj, txn.id);

                    let tx_json = JSON.parse(the_tx.txs[0].as_json);
                    console.log(tx_json);
                    console.log(txn);

                    let staked_tokens = 0;

                    for (const the_os of tx_json.vout) {
                        if (the_os.target.script) {
                            console.log(the_os);
                            staked_tokens = the_os.token_amount;
                        }
                    }
                    load_out.push(
                        <tr className="tx-row" key={key}>
                            <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                            <td>{txn.id}</td>
                            <td>{txn.direction}</td>
                            <td>{txn.pending}</td>
                            <td className="">{the_type}</td>
                            <td>{`${staked_tokens / 10000000000} SFT`}</td>
                            <td>{txn.fee / 10000000000}</td>
                            <td>{txn.blockHeight}</td>
                            <td>{txn.confirmations}</td>
                        </tr>
                    )

                } catch(err) {
                    load_out.push(
                        <tr className="tx-row" key={key}>
                            <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                            <td>{txn.id}</td>
                            <td>{txn.direction}</td>
                            <td>{txn.pending}</td>
                            <td className="">{the_type}</td>
                            <td>{`${0 / 10000000000} SFT`}</td>
                            <td>{txn.fee / 10000000000}</td>
                            <td>{txn.blockHeight}</td>
                            <td>{txn.confirmations}</td>
                        </tr>
                    )
                    console.error(err);
                    console.error(`error at the fetch at the stake txs`);
                }
            } else {
                load_out.push(
                    <tr className="tx-row" key={key}>
                        <td>{new Date(txn.timestamp * 1000).toLocaleString()}</td>
                        <td>{txn.id}</td>
                        <td>{txn.direction}</td>
                        <td>{txn.pending}</td>
                        <td className="">{the_type}</td>
                        <td>{txn.tokenAmount > 0 ? (`${txn.tokenAmount / 10000000000} SFT`) : (`${txn.amount / 10000000000} SFX`)}</td>
                        <td>{txn.fee / 10000000000}</td>
                        <td>{txn.blockHeight}</td>
                        <td>{txn.confirmations}</td>
                    </tr>
                )
            }
        }
        this.setState({txn_history_table_data_state: load_out, loading_hist: false});
    }

    render() {


        return (
            <div className="settings-table-wrapper">
                <Table>
                    <thead style={{border: '1px solid lightgray'}}>
                    <tr>
                        <th>Date/Time</th>
                        <th>TXID</th>
                        <th>In/Out</th>
                        <th>Pending?</th>
                        <th>type</th>
                        <th>Amount</th>
                        <th>Fee (SFX)</th>
                        <th>Blockheight</th>
                        <th>Confirmations</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.state.loading_hist ? 'Loading History...' : this.state.txn_history_table_data_state}
                    </tbody>
                </Table>
            </div>
        );
    }
}
