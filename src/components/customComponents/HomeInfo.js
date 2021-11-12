import React from "react";
import {FaCubes} from "react-icons/fa";
import {Row, Col, Container, Button, Form, Image} from 'react-bootstrap';
import "./ComponentCSS/HomeInfo.css";
import sfxLogo from "../../img/sfx.svg";
import sftLogo from "../../img/sft.svg";

export default function HomeInfo(props) {
    return (
        <div className="home-info-box p-4 mt-4">
            <h4 className="d-flex align-content-center">
                <FaCubes className="mr-3"/>
                {props.walletHeight === props.blockHeight
                    ? props.blockHeight
                    : `${props.walletHeight} / ${props.blockHeight}`}
            </h4>

            <p>{props.connection}</p>

            <Row>
                <Col md={6}>
                        <label>SAFEX CASH BALANCE</label>
                        <div className="d-flex flex-column">
                            <div>
                                {props.firstRefresh === true
                                    ? props.cashBalance.toLocaleString() + " SFX"
                                    : "∞"}{" "}
                                <img className="ml-2" src={sfxLogo} width={20} alt="Safex Cash"/>
                            </div>
                            <span>
          {props.pendingCash > 0
              ? `(${props.pendingCash.toLocaleString()} SFX Pending)`
              : ""}
          </span>
                        </div>
                </Col>
                <Col md={6}>
                        <label>SAFEX TOKEN BALANCE</label>
                        <div className="d-flex flex-column">
                            <div>
                                {props.firstRefresh === true
                                    ? props.tokenBalance.toLocaleString() + " SFT"
                                    : "∞"}
                                <img src={sftLogo} width={30} alt="Safex Tokens"/>
                            </div>
                            <span>
          {props.pendingTokens > 0
              ? `(${props.pendingTokens.toLocaleString()} SFT Pending)`
              : ""}
          </span>
                            <span>
          {props.stakedTokens > 0
              ? `(${props.stakedTokens.toLocaleString()} SFT Staked)`
              : ""}
          </span>
                        </div>
                </Col>
            </Row>
        </div>
    );
}
