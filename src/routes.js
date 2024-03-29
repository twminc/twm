import {
    HashRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import React from 'react';

import CreateWallet from './components/entry/create_wallet';
import OpenWallet from './components/entry/open_wallet';
import RecoverKeys from "./components/entry/recover_keys";
import RecoverSeed from "./components/entry/recover_seed";

import IntroScreen from './components/entry/intro_screen';
import SelectEntry from './components/entry/select_entry';

import WalletHome from './components/wallet/home';
import History from './components/wallet/History';



const routes = (
    <Router>
        <div className="height100 d-flex" >
            <Switch className="height100">
                <Route exact path="/" component={IntroScreen}/>
                <Route exact path="/select_entry" component={SelectEntry}/>
                <Route exact path="/recover_keys" component={RecoverKeys}/>
                <Route exact path="/recover_seed" component={RecoverSeed}/>
                <Route exact path="/create_wallet" component={CreateWallet}/>
                <Route exact path="/open_wallet" component={OpenWallet}/>
                <Route exact path="/wallet_home" component={WalletHome}/>
                <Route exact name="history" path="/history" component={History}/>
            </Switch>
        </div>
    </Router>
);

export default routes;