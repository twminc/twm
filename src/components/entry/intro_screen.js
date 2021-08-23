import React from 'react';
import ReactModal from "react-modal";
import {Container, Row, Image, Form} from 'react-bootstrap'
import { CgClose } from "react-icons/cg";

const {app} = window.require("electron").remote;
const os = window.require('os');
const fs = window.require('fs').promises;
const libPath = window.require('path');

const WALLET_FILENAME = 'safexwallet.dat';
const DEFAULT_WALLET_PATH = libPath.resolve(os.homedir(), WALLET_FILENAME);

async function read_legacy_wallet(wallet_path) {
    try {
        return await fs.readFile(wallet_path);
    } catch (err) {
        let error = {};
        error.e = err;
        error.error = "error at loading the wallet file";
        return error;
    }
}

export default class IntroScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            legacy_wallet: '',
            legacy_detected: false,
            acceptedTerms: false,
            confirmedTos: false,
            showTerms: false
        };
    }

    async componentDidMount() {
        await fs.readFile("user.json", "utf8", (err, data) => {
            if (err && err.code === 'ENOENT') {
                fs.writeFile("user.json", JSON.stringify({acceptedTerms: false}));
            } else if (data) {
                const parsed = JSON.parse(data);
                if (parsed.acceptedTerms) {
                    this.setState({acceptedTerms: true});
                }
            }
        });

        try {
            let wallet = await read_legacy_wallet(DEFAULT_WALLET_PATH);

            //if there is an error loading the file, perhaps it doesn't exist
            if (wallet.e) {
                console.log("legacy wallet was not found");
            } else {
                this.setState({legacy_wallet: wallet, legacy_detected: true});
            }
        } catch (err) {
            console.error(err);
            console.error("error at reading legacy wallet");
        }
    }

    closeTosModal = () => {
        this.setState({showTerms: false, confirmedTos: false});
    }

    handleTosConfirm = () => {
        if (!this.state.confirmedTos) {
            return;
        }

        fs.writeFile("user.json", JSON.stringify({acceptedTerms: true}));
        return this.open_select();
    }

    handleGetStarted = () => {
        if (this.state.acceptedTerms) {
            return this.open_select();
        }

        this.setState({showTerms: true});
    }


    open_select = () => {
        this.props.history.push({pathname: '/select_entry'});
    };

    render() {
        return (
            <div className="width100 height100 d-flex flex-column text-center intro-background-image">
                <Container fluid className="height100 flex-column d-flex justify-content-center">
                    <Image onClick={() => app.quit()} className="entry-off-button pointer" src={require("./../../img/off_black.svg")}/>

                    <Row className="row justify-content-md justify-content-center p-3 intro-safex-logo">
                        <Image className="w-50 intro-safex-logo " src={require("./../../img/safex-home-multi.png")}/>
                    </Row>

                    <button onClick={this.handleGetStarted} className="w-50 custom-button-entry my-5 intro-safex-logo">
                        Get Started
                    </button>
                </Container>


                <ReactModal
        isOpen={this.state.showTerms}
        closeTimeoutMS={500}
        className="tos-modal"
        onRequestClose={this.closeTosModal}
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
        }}
      >
        <div className="h-100 d-flex flex-column">
          <div className="modal-title">
            TERMS
            <CgClose
              className="pointer"
              style={{ position: "absolute", right: "15px", color: "red" }}
              size={20}
              onClick={this.closeTosModal}
            />
          </div>
          <div className="flex-grow-1 d-flex flex-column pt-4 pl-4 pr-4">
                  <div className="p-4" style={{height: '500px', overflow: 'overlay', border: "2px solid #d3d3d363"}}>
                      <p>THIS PARAGRAPH CONTAINS AN IMPORTANT NOTICE. PLEASE READ IT CAREFULLY. SECTION 16 AND SECTION
                          17 OF THIS DOCUMENT CONTAIN A BINDING ARBITRATION PROVISION THAT REQUIRES ARBITRATION ON AN
                          INDIVIDUAL BASIS (RATHER THAN JURY TRIALS OR CLASS ACTIONS) AND LIMITS THE TIME PERIOD WITHIN
                          WHICH YOU MAY BRING A CLAIM AGAINST US.</p>
                      <p>TWM Wallet User License Agreement</p>
                      <p>This TWM Wallet User License Agreement (“<strong>Agreement</strong>”) is a binding agreement
                          between you (“<strong>User</strong>” or “<strong>you</strong>”) and The World Marketplace,
                          Inc. (“<strong>TWM,</strong>” “<strong>we</strong>,” or “<strong>us</strong>”). This Agreement
                          governs your use of the TWM digital wallet application (including all related documentation, “<strong>The
                              Wallet</strong>”). The Wallet is licensed, not sold, to you.</p>
                      <p>BY CHECKING THE BOX INDICATING YOUR CONSENT TO THIS AGREEMENT, YOU (A) ACKNOWLEDGE THAT YOU
                          HAVE READ AND UNDERSTAND THIS AGREEMENT; (B) REPRESENT THAT YOU ARE 18 YEARS OLD AND OF LEGAL
                          AGE TO ENTER INTO A BINDING AGREEMENT; AND (C) ACCEPT THIS AGREEMENT AND AGREE THAT YOU ARE
                          LEGALLY BOUND BY ITS TERMS. IF YOU DO NOT AGREE TO THESE TERMS, DELETE THE WALLET FROM YOUR
                          DEVICE AND DO NOT USE IT.</p>
                      <ol type="1">
                          <li><p><span className="underline">License Grant</span>. Subject to the terms of this
                              Agreement, TWM grants you a limited, non-exclusive, revocable and nontransferable license
                              to download, install, and use The Wallet for your personal use on hardware or other
                              devices owned or otherwise controlled by you (“<strong>Device</strong>”) in accordance
                              with TWM’s documentation.</p></li>
                          <li><p><span className="underline">License Restrictions</span>. You agree that you shall <span
                              className="underline">NOT</span>:</p>
                              <ol type="a">
                                  <li>
                                      <blockquote>
                                          <p>copy The Wallet, except as expressly permitted by this Agreement;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>modify, translate, adapt, or otherwise create derivative works or
                                              improvements of The Wallet;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>reverse engineer, disassemble, decompile, decode, or otherwise attempt to
                                              derive or gain access to or view the source code of The Wallet or any part
                                              of it;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>remove, delete, alter, or obscure any trademarks or any copyright,
                                              trademark, patent, or other intellectual property or proprietary rights
                                              notices from The Wallet, including any copy of it;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>rent, lease, lend, sell, sublicense, assign, distribute, publish, transfer,
                                              or otherwise make available The Wallet, or any features or functionality
                                              of The Wallet, to any third party for any reason, including by making The
                                              Wallet available on a network where it is capable of being accessed by
                                              more than one device at any time;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>violate applicable laws or regulations;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>attempt to do anything that does or could interfere with, disrupt,
                                              negatively affect or inhibit other users from using The Wallet;</strong>
                                          </p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>use The Wallet to transmit any threatening, libelous, defamatory, obscene,
                                              scandalous, inflammatory, pornographic or profane material, any material
                                              that is contrary to applicable local, federal, or international laws and
                                              regulations, or any material that could constitute or encourage unlawful
                                              conduct;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>access any content, area or functionality of The Wallet that you
                                              are prohibited or restricted from accessing or attempt to bypass or
                                              circumvent measures employed to prevent or limit your access to any
                                              content, area or functionality of The Wallet;</strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>remove, disable, circumvent, or otherwise create or implement any
                                              workaround to any copy protection, rights management, or security features
                                              in or protecting The Wallet;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>use The Wallet to authorize your access to, or otherwise in connection
                                              with, any hazardous environments or systems, including power generation
                                              systems; aircraft navigation or communication systems, air traffic control
                                              systems, or any other transport management systems; safety-critical
                                              applications, including medical or life-support systems, vehicle operation
                                              applications or any police, fire, or other safety response systems; and
                                              military or aerospace applications, weapons systems, or environments;</p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>create a false identity for the purpose of misleading others or
                                              fraudulently or otherwise misrepresent yourself to be another person or a
                                              representative of another entity;</strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>use The Wallet to transmit any files or data that contain viruses,
                                              Trojan horses, worms, time bombs, cancelbots, corrupted files, or any
                                              other similar software or programs that may damage the operation of
                                              another’s computer or property; </strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>mislead or deceive us, our representatives and any third parties
                                              who may rely on the information provided by you, by providing inaccurate
                                              or false information, which includes omissions of information;</strong>
                                          </p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>obtain unauthorised access to or interfere with the performance of
                                              any computer that hosts The Wallet or any node in the Safex blockchain
                                              network;</strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>disguise the origin of any material transmitted through The Wallet
                                              (whether by forging message/packet headers or otherwise manipulating
                                              normal identification information);</strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>interfere or violate the legal rights (such as rights of privacy
                                              and publicity) of others or violate others use or enjoyment of The
                                              Wallet;</strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p><strong>attempt to gain unauthorized access to any services or products,
                                              APIs, databases, other accounts, computer systems, or networks connected
                                              to any of our servers through hacking, password mining, or any other
                                              means; or</strong></p>
                                      </blockquote>
                                  </li>
                                  <li>
                                      <blockquote>
                                          <p>engage in or promote any activity that violates this Agreement.</p>
                                      </blockquote>
                                  </li>
                              </ol>
                          </li>
                          <li><p><span className="underline">Reservation of Rights</span>. You acknowledge that The
                              Wallet is licensed, not sold, to you. You do not acquire any ownership interest in The
                              Wallet under this Agreement, or any other rights to it other than the limited license to
                              use it subject to the terms of this Agreement. TWM and its licensors and service providers
                              reserves and retain their entire respective rights, title, and interest in and to The
                              Wallet, including all related copyrights, trademarks, and other intellectual property
                              rights, except as expressly granted to you in this Agreement.</p></li>
                          <li><p><span className="underline">Collection and Use of Your Information</span>. You
                              acknowledge that when you download, install, or use The Wallet, TWM may use automatic
                              means (including, for example, cookies and web beacons) to collect information about your
                              Device and about your use of The Wallet. You also may be required to provide certain
                              information about yourself as a condition to downloading, installing, or using The Wallet
                              or certain of its features or functionality. Please review our Privacy Policy available
                              at <a href="">http:// theworldmarketplace.com/privacy-policy</a> for details about how we
                              collect, use, and disclose your information in connection with your access to The Wallet.
                              By downloading, installing, using, and providing information to or through The Wallet, you
                              consent to all actions taken by us with respect to your personal information in compliance
                              with the Privacy Policy.</p></li>
                          <li><p><span className="underline">Updates</span>. From time to time, TWM may develop and
                              provide The Wallet updates, which may include upgrades, bug fixes, patches, other error
                              corrections, or new features (collectively, including related documentation,
                              “<strong>Updates</strong>”). Updates may also modify or delete existing features and
                              functionality. TWM has no obligation to provide any Updates or to continue to provide or
                              enable any particular features or functionality. Based on your Device settings, when your
                              Device is connected to the internet, either The Wallet will automatically download and
                              install all available Updates, or you may receive notice of or be prompted to download and
                              install available Updates. You shall promptly download and install all Updates and
                              acknowledge that The Wallet (or portions of it) may not properly operate if you fail to
                              download and install the Updates. All Updates are considered to be a part of The Wallet,
                              and accordingly, are subject to all terms and conditions of this Agreement.</p></li>
                          <li><p><span className="underline">Termination</span>. This Agreement will continue in effect
                              until terminated by you or TWM as set forth in this Section 6. You may terminate this
                              Agreement by deleting The Wallet and all copies of it from your Devices. TWM may terminate
                              this Agreement at any time without notice if it ceases to support The Wallet, which TWM
                              may do in its sole discretion. In addition, this Agreement will terminate immediately and
                              automatically without any notice if you violate any of the terms and conditions of this
                              Agreement. Upon termination: (a) all rights granted to you under this Agreement will also
                              terminate; and (b) you must cease all use of The Wallet and delete all copies of The
                              Wallet from your Device and account. Termination will not limit any of TWM’s rights or
                              remedies at law or in equity.</p></li>
                          <li><p><span className="underline">Third Party Components</span>. The Wallet may include or
                              rely upon products, services, and components provided by third parties. TWM does not
                              assume, and will not have, any liability or responsibility to you or any other person or
                              entity for any such third party products, services, or components.</p></li>
                          <li><p><span className="underline">Terms of Sale</span>. You may order certain products
                              through The Wallet (“Products”). This Section 8 sets out your rights and obligations with
                              respect to your purchases of Products, including important limitations and
                              exclusions. <strong>You acknowledge that your use of The Wallet may result in legally
                                  binding actions or contracts with TWM or other provider of Products (The Wallet, in
                                  conjunction with any third party provider of products shall collectively be referred
                                  to as “Seller”). TWM makes no representation that your use of The Wallet to purchase
                                  Products will or will not result in an executed transaction or legally binding
                                  contract.</strong></p>
                              <ol type="a">
                                  <li><p><span className="underline">Purchases</span>. All Products purchased through
                                      The Wallet will be delivered to the address you specify. You must pay for the
                                      Products through The Wallet at the time you place the order. If you entered a
                                      valid address and your order and payment are accepted, your order will be shipped
                                      pursuant to the terms below. The Safex blockchain will send a proof of purchase of
                                      the Products in the form of a transaction ID and a feedback token through The
                                      Wallet. You agree that you will not challenge the legitimacy, validity or
                                      authenticity of the actions you take through The Wallet, or the contracts that you
                                      may form through use of The Wallet, on the basis that you used The Wallet or an
                                      electronic signature process to do so. In connection with your use of The Wallet,
                                      you hereby waive any rights or requirements under any laws or regulations in any
                                      jurisdiction that require an original (non-electronic) signature or delivery or
                                      retention of non-electronic records, to the extent permitted under applicable
                                      mandatory law. Further, you agree that no certification authority or other third
                                      party verification is necessary to establish the validity of your electronic
                                      signature, and that the lack of such certification or third party verification
                                      will not affect the enforceability of your signature or any resulting contract
                                      between you and us.</p></li>
                                  <li><p><span className="underline">Payment</span>. Prices offered in The Wallet are
                                      quoted in Safex Cash and Products may only be purchased using Safex Cash. If the
                                      amount you pay for an item is incorrect, regardless of whether it is an error in a
                                      price listed in The Wallet, calculation of shipping charges, or otherwise
                                      communicated to you, then Seller reserves the right, at its sole discretion, to
                                      cancel your order and refund to you the amount that you paid less a 5% processing
                                      fee, regardless of how the error occurred.</p></li>
                                  <li><p><span className="underline">Product Descriptions; All Sales Final</span>.
                                      Seller attempts to describe and display the items offered on The Wallet as
                                      accurately as possible; however, Seller does not warrant that the descriptions or
                                      other content on The Wallet are accurate, complete, reliable, current or
                                      error-free. Unless you are provided with information to the contrary from
                                      Seller<strong>, all Product sales are final</strong>.</p></li>
                                  <li><p><span className="underline">Payment Disputes</span>. If you dispute any charge
                                      for purchases of Products on The Wallet, you must notify Seller in writing within
                                      thirty (30) days of any such charge; failure to so notify Seller shall result in
                                      the waiver by you of any claim relating to such disputed charge; and charges shall
                                      be calculated solely based on records maintained by Seller and at Seller’s
                                      discretion.</p></li>
                                  <li><p><span className="underline">Shipment and Delivery</span>. You must pay for
                                      Product shipping costs to your designated locations within the ordering process
                                      prior to shipment of such Products. Accepted orders will be processed and Products
                                      will be shipped to valid physical addresses. Seller reserves the right to make
                                      partial shipments. Seller is not bound to deliver any Products (i) for which you
                                      have not provided shipping instructions, which include a valid e-mail and phone
                                      number where you may be reached, (ii) for which you have provided invalid shipping
                                      instructions or shipping instructions that violate this Agreement or any
                                      applicable laws or regulations, or (iii) for which you have failed to pay all
                                      applicable shipping charges. Products may not be returned without the prior
                                      written consent of Seller. Title to the Products will pass to you upon Seller’s
                                      delivery of the Products to the carrier. Seller does not take title to returned
                                      Products until the item arrives at our facilities. Seller reserves the right to
                                      request additional funds from you to cover additional shipping costs of the
                                      Products and delivery of such Products may be conditioned on your paying for such
                                      additional shipping costs.</p></li>
                                  <li><p><span className="underline">PRODUCT WARRANTY DISCLAIMER</span>. PRODUCTS ARE
                                      SOLD TO YOU “AS-IS” AND SELLER HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND WITH
                                      RESPECT TO THE PRODUCTS, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE,
                                      INCLUDING WITHOUT LIMITATION ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                                      PARTICULAR USE OR PURPOSE, SUITABILITY, NON-INFRINGEMENT, AND REGARDING RESULTS
                                      OBTAINED THROUGH THE USE OF ANY PRODUCT.</p></li>
                                  <li><p><span className="underline">Product Use and Restrictions</span>. You hereby
                                      acknowledge and agree that you are solely responsible for complying with all
                                      applicable laws, regulations and governmental policies when purchasing and using
                                      Products, including all applicable import and export laws and customs regulations.
                                      You agree that you will not purchase or attempt to purchase any good or service
                                      that you are not legally permitted to purchase in your respective jurisdiction.
                                      You are solely responsible for obtaining all necessary approvals, permissions
                                      and/or licenses or intellectual property rights from applicable third parties as
                                      may be required for your intended uses of the Products. It is solely your
                                      responsibility to make sure the Products are suitable for your particular use. As
                                      a material condition to Seller providing its Products to you, you agree that you
                                      shall not, directly or indirectly, attempt to reverse engineer, disassemble, or
                                      otherwise perform any compositional, structural, functional or other analyses
                                      directed to learning the methodology, components, formulae, processes, make-up, or
                                      production of any Product or any portion thereof. You further hereby agree to
                                      comply with any terms and conditions that are packaged with or otherwise included
                                      with the Products or in the product descriptions on The Wallet.</p></li>
                              </ol>
                          </li>
                          <li><p><span className="underline">THE WALLET WARRANTY DISCLAIMER</span>. THE WALLET IS
                              PROVIDED TO YOU “AS IS” AND WITH ALL FAULTS AND DEFECTS WITHOUT WARRANTY OF ANY KIND. TWM
                              IS NOT RESPONSIBLE FOR, AND DOES NOT GUARANTEE, THE VALIDITY OF SIGNATURES OR
                              AUTHENTICATION MADE THROUGH THE WALLET. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE
                              LAW, TWM, ON ITS OWN BEHALF AND ON BEHALF OF ITS AFFILIATES AND ITS AND THEIR RESPECTIVE
                              LICENSORS AND SERVICE PROVIDERS, EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS,
                              IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE WALLET, INCLUDING ALL IMPLIED
                              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                              NON-INFRINGEMENT, AND WARRANTIES THAT MAY ARISE OUT OF COURSE OF DEALING, COURSE OF
                              PERFORMANCE, USAGE, OR TRADE PRACTICE. TWM PROVIDES NO WARRANTY OR UNDERTAKING, AND MAKES
                              NO REPRESENTATION OF ANY KIND THAT THE WALLET WILL MEET YOUR REQUIREMENTS, ACHIEVE ANY
                              INTENDED RESULTS, BE COMPATIBLE, OR WORK WITH ANY OTHER SOFTWARE, APPLICATIONS, SYSTEMS,
                              OR SERVICES, OPERATE WITHOUT INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS,
                              OR BE ERROR-FREE, OR THAT ANY ERRORS OR DEFECTS CAN OR WILL BE CORRECTED. SOME
                              JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF OR LIMITATIONS ON IMPLIED WARRANTIES OR THE
                              LIMITATIONS ON THE APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO SOME OR ALL OF THE ABOVE
                              EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU.</p></li>
                          <li><p><span className="underline">Limitation of Liability</span>. TO THE FULLEST EXTENT
                              PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL TWM OR ITS AFFILIATES, OR ANY OF ITS OR
                              THEIR RESPECTIVE LICENSORS OR SERVICE PROVIDERS, HAVE ANY LIABILITY ARISING FROM OR
                              RELATED YOUR USE OF OR INABILITY TO USE THE WALLET OR ANY CONTENT OR SERVICES PROVIDED BY
                              TWM, OR YOUR PURCHASE OR USE OF PRODUCTS FOR: (A) PERSONAL INJURY, PROPERTY DAMAGE,
                              REPLACEMENT GOODS, LOST PROFITS, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION,
                              COMPUTER FAILURE OR MALFUNCTION, OR ANY OTHER CONSEQUENTIAL, INCIDENTAL, INDIRECT,
                              EXEMPLARY, SPECIAL, OR PUNITIVE DAMAGES; OR (B) DIRECT DAMAGES IN AMOUNTS THAT IN THE
                              AGGREGATE EXCEED THE GREATER OF (I) AMOUNT ACTUALLY PAID BY YOU FOR THE PRODUCT GIVING
                              RISE TO SUCH CLAIM AND (II) $100.</p></li>
                      </ol>
                      <p>THE FOREGOING LIMITATIONS WILL APPLY WHETHER SUCH DAMAGES ARISE OUT OF BREACH OF CONTRACT, TORT
                          (INCLUDING NEGLIGENCE), OR OTHERWISE AND REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE
                          OR TWM WAS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW CERTAIN
                          LIMITATIONS OF LIABILITY SO SOME OR ALL OF THE ABOVE LIMITATIONS OF LIABILITY MAY NOT APPLY TO
                          YOU.</p>
                      <ol start="11" type="1">
                          <li><p><span className="underline">Indemnification</span>. You will indemnify, defend, and
                              hold harmless TWM and its officers, directors, employees, agents, affiliates, successors,
                              and assigns from and against any and all third-party claims and associated losses, costs,
                              and expenses of whatever kind, including reasonable attorneys’ fees, arising from or
                              relating to your use or misuse of The Wallet, any Products, your breach of this Agreement,
                              or your violation of applicable laws, including export control laws.</p></li>
                          <li><p><span className="underline">Restricted Locations</span>. You represent and warrant that
                              (a) you are not located in a country that is subject to a U.S. government embargo or
                              sanctions program, or that has been designated by the U.S. government as a “terrorist
                              supporting” country; (b) you do not appear on the List of Specially Designated Nationals
                              and Blocked Persons maintained by the U.S. Office of Foreign Assets Control (“OFAC”) as
                              set forth at <a href="http://www.treas.gov/ofac">http://www.treas.gov/ofac</a>; (c) you
                              are not a person or entity that is the subject of an OFAC-administered sanctions program
                              (codified at 31 C.F.R. 500, <em>et seq.</em> with summaries available at
                              http://www.treas.gov/ofac); (d) you are not purchasing on behalf of any person or entity
                              that is covered by subsections (a)-(c) of this section titled “Restricted Locations”; and
                              (e) you are not using technological means for purposes of misrepresenting your location
                              (<em>e.g.</em> VPN, internet protocol address scrambler, or other proxy).</p></li>
                          <li><p><span className="underline">Export Regulation</span>. The Wallet may be subject to U.S.
                              export control laws, including the U.S. Export Administration Act and its associated
                              regulations. You shall not, directly or indirectly, export, re-export, or release The
                              Wallet to, or make The Wallet accessible from, any jurisdiction or country to which
                              export, re-export, or release is prohibited by United States law, rule, or regulation. You
                              shall comply with all applicable federal laws, regulations, and rules, and complete all
                              required undertakings (including obtaining any necessary export license or other
                              governmental approval), prior to exporting, re-exporting, releasing, or otherwise making
                              The Wallet available outside the U.S.</p></li>
                          <li><p><span className="underline">US Government Rights</span>. The Wallet is and includes
                              commercial computer software and commercial computer software documentation, as such terms
                              are defined in 48 C.F.R. §2.101. Accordingly, if you are an agency of the U.S. government
                              or any contractor for an agency of the U.S. government, you receive only those rights with
                              respect to The Wallet as are granted to all other end users under license, in accordance
                              with (a) 48 C.F.R. §227.7201 through 48 C.F.R. §227.7204, with respect to the Department
                              of Defense and their contractors, or (b) 48 C.F.R. §12.212, with respect to all other U.S.
                              government licensees and their contractors.</p></li>
                          <li><p><span className="underline">Severability</span>. If any provision of this Agreement is
                              illegal or unenforceable under applicable law, the remainder of the provision will be
                              amended to achieve as closely as possible the effect of the original term and all other
                              provisions of this Agreement will continue in full force and effect.</p></li>
                          <li><p><span className="underline">Arbitration; Governing Law</span>. ANY DISPUTES ARISING
                              FROM THE USE OF THESE TERMS OF USE OR THE WALLET, INCLUDING DISPUTES ARISING FROM OR
                              CONCERNING THEIR INTERPRETATION, VIOLATION, INVALIDITY, NON-PERFORMANCE, OR TERMINATION,
                              TO FINAL AND BINDING ARBITRATION UNDER THE RULES OF ARBITRATION OF THE AMERICAN
                              ARBITRATION ASSOCIATION. YOU AGREE TO ARBITRATE IN YOUR INDIVIDUAL CAPACITY ONLY – NOT AS
                              A REPRESENTATIVE OR MEMBER OF A CLASS – AND YOU EXPRESSLY WAIVE ANY RIGHT TO FILE A CLASS
                              ACTION OR SEEK RELIEF ON A CLASS‑ACTION BASIS. FURTHERMORE, UNLESS YOU AND COMPANY AGREE
                              IN WRITING, THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON’S CLAIMS, AND MAY NOT
                              OTHERWISE PRESIDE OVER ANY FORM OF A REPRESENTATIVE OF CLASS PROCEEDING. ALL ARBITRATION
                              PROCEEDINGS ARE CONFIDENTIAL, UNLESS BOTH YOU AND COMPANY AGREE OTHERWISE. ARBITRATION
                              ORDERS AND AWARDS REQUIRED TO BE FILED WITH APPLICABLE COURTS OF COMPETENT JURISDICTION
                              ARE NOT CONFIDENTIAL AND MAY BE DISCLOSED BY THE PARTIES TO SUCH COURTS. A PARTY WHO
                              IMPROPERLY DISCLOSES CONFIDENTIAL INFORMATION WILL BE SUBJECT TO SANCTIONS. THE ARBITRATOR
                              AND FORUM MAY DISCLOSE CASE FILINGS, CASE DISPOSITIONS, AND OTHER CASE INFORMATION AS
                              REQUIRED BY A COURT ORDER OF PROPER JURISDICTION. This Agreement is governed by and
                              construed in accordance with the internal laws of the State of Delaware, without giving
                              effect to any choice or conflict of law provision or rule.</p></li>
                          <li><p><span className="underline">Limitation of Time to File Claims</span>. ANY CAUSE OF
                              ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE WALLET
                              MUST BE COMMENCED WITHIN ONE YEAR AFTER THE CAUSE OF ACTION ACCRUES OTHERWISE SUCH CAUSE
                              OF ACTION OR CLAIM IS PERMANENTLY BARRED.</p></li>
                          <li><p><span className="underline">Entire Agreement</span>. This Agreement constitutes the
                              entire agreement between you and TWM with respect to The Wallet and any Products, and
                              supersedes all prior or contemporaneous understandings and agreements, whether written or
                              oral, with respect to The Wallet or Products. TWM reserves the right to modify this
                              Agreement at any time without prior notice. TWM may, at its sole discretion, notify you of
                              changes to this Agreement via: (a) a prompt from The Wallet that will allow you to read
                              the new or modified Agreement, and require you to accept the new or modified terms prior
                              to being able to access The Wallet, (b) by electronic mail, or (c) by posting a notice on
                              the TWM website. Regardless, your continued use of The Wallet after the Agreement has been
                              updated constitutes your approval of the revised Agreement.</p></li>
                          <li><p><span className="underline">Waiver</span>. No failure to exercise, and no delay in
                              exercising, on the part of either party, any right or any power hereunder shall operate as
                              a waiver thereof, nor shall any single or partial exercise of any right or power hereunder
                              preclude further exercise of that or any other right hereunder. In the event of a conflict
                              between this Agreement and any applicable purchase or other terms, the terms of this
                              Agreement shall govern.</p></li>
                          <li><p><span className="underline">Open Source Software</span>. We may make (but are not
                              obligated to make) the source code for The Wallet available for download as open source
                              software. If you use this software, you agree to be bound by and comply with any license
                              that applies to this open source software. You will not indicate that you are associated
                              with us in connection with your use, modifications or distributions of this open source
                              software.</p></li>
                          <li><p><span className="underline">TWM Name and Contact</span>. You agree and consent to
                              receive electronically all communications, agreements, documents, receipts, notices and
                              disclosures (collectively, “Communications”). We may provide Communications to you by
                              posting them via the The Wallet, by e-mailing them to you at the e-mail address you
                              provide, by sending an SMS or text message to a mobile phone number that you provide, or
                              by posting them to the TWM website. You should maintain copies of all Communications. You
                              may contact TWM with any questions, complaints, or claims at the following:</p>
                              <p>The World Marketplace, Inc.</p>
                              <p>1007 North Orange Street, 10<sup>th</sup> Floor</p>
                              <p>Wilmington, Delaware 19801</p>
                              <p>* * *</p></li>
                      </ol>
                  </div>
                  <Form.Check
                    className="my-4"
                    label="I agree to the terms and conditions"
                    checked={this.state.confirmedTos}
                    onChange={() => this.setState(state => ({confirmedTos: !state.confirmedTos}))}
                    type="switch"
                    id="tos-switch"
                    name="tos" />
                  <div className="d-flex mb-4">
                      <button type="button" onClick={this.closeTosModal}>Cancel</button>
                      <button 
                      disabled={!this.state.confirmedTos} 
                      onClick={this.handleTosConfirm}
                      type="button" className="ml-3">Confirm</button>
                  </div>
          </div>
          </div>
            </ReactModal>
            </div>
        );
    }
}
