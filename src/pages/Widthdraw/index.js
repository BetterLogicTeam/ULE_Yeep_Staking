import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { getDownlineReport } from "../../store/actions/dailyYield";
import { getWalletAddress } from "../../store/actions/dashboard";
import { API } from "../../store/actions/API";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import TronWeb from "tronweb";
import Web3 from "web3";
import { Withdraw_Abi, Withdrwa_Address } from "../Activate/constants";
import { ethers } from "ethers";
// ye wala he

export const Widthdraw = () => {
  const downlineReport = useSelector(
    (state) => state?.dailyYield?.downlineReport
  );
  const dashboard = useSelector((state) => state?.dashboard);

  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const [depositeAmount, setDepositeAmount] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [tronAdd, setTronAdd] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTrans, setLoadingTrans] = useState(false);

  window.troni = {};



  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const metamask = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
      }
      if (isConnected === true) {
        const web3 = window.web3;
        let accounts = await web3.eth.getAccounts();
        if (account !== accounts[0]) {
          setAccount(accounts[0]);
        }

        let chain = await web3.eth.getChainId();
        setChainId(chain);
        if (chain === 303) {
          // handleLogin2(accounts[0]);
        }
        window.ethereum.on("accountsChanged", async function (accounts) {
          if (account !== accounts[0]) {
            setAccount(accounts[0]);
          }

          let chain = await web3.eth.getChainId();
          setChainId(chain);
          if (chain === 303) {
            // handleLogin2(accounts[0]);
          }
        });
      }
    } catch (error) {
      console.log("error message", error?.message);
    }
  };
  const [rate, setRate] = useState(0);
  const getLiveRate = async () => {
    try {
      const res = await API.get(`/live_rate`);
      setRate(res?.data.data[0].usdperunit);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getUserInfo = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/get_user_info?id=${uId}`);
      if (res?.data?.data?.length > 0) {
        setUserInfo(res?.data?.data[0]);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("error", e);
    }
  };



  let mainAccount = "";

  var nonce = 2; // some random number
  const [accountAddress, setAccountAddress] = useState("");
  const [trxtBalance, setTrxBalance] = useState("0");
  console.log(trxtBalance);
  async function Ethereum() {
    try {
      //TDVGM9a2BtqfHoG6XyGMR5mtrMAXijmmgk console.log("initial");
      mainAccount = await window?.tronWeb?.defaultAddress?.base58;
      console.log("main Account", mainAccount);

      if (mainAccount) {
        setAccountAddress(mainAccount);
        localStorage.setItem("mainAccount", mainAccount);
        console.log("mainAccount", mainAccount);
        setTimeout(() => {
          getBalanceOfAccount();
        }, 100);
      } else {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = "https://api.trongrid.io/";
        const gettronWeb = new TronWeb(fullNode, solidityNode, eventServer);
        setTimeout(() => {
          // getData();
        }, 100);

        // toast.warning("Please login or install tron wallet!");
      }
    } catch (error) {
      toast.error(error.message);

      console.log("error", error.message);
    }
  }
  const getBlnce = async () => {
    try {
      let ress = JSON.parse(user);
      let uId = ress?.user_id;
      const res = await API.get(`/net_usd?id=${uId}`);
      setTrxBalance(
        res?.data?.data[0]?.netbal ? res?.data?.data[0]?.netbal : 0
      );
    } catch (e) {
      console.log("error", e);
    }
  };
  const getBalanceOfAccount = async () => {
    try {
      await window.tronWeb.trx.getBalance(mainAccount, function (err, res) {
        var blnc = parseInt(res) / 1000000;
        // setTrxBalance(blnc.toFixed(3));
      });
    } catch (e) {
      console.log("blnc", e);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      Ethereum();
    }, 2000);
    getUserInfo();
    getLiveRate();
    getBlnce();
    metamask();
  }, []);
 



 const Withdraw_toke=async()=>{
  let CONTRACT_ADDRESS = "TJky76sBRMvV8ybkL7mb1XionbM8PdGtcw";
  let privateKey = "eff29765d34cc1c58bd3dbfa8d72c6d389f4d2e44221ea5bde9e3b81fd44d533";
  var nonce = 2; // some random number
  const web3= window.web3;
  setLoadingTrans(true)
  try{
    // let amount = jQuery("#withDrawTokenid").val()
    // let AmountBNB = web3.utils.toWei(depositeAmount);
    let AmountBNB = depositeAmount;

    console.log("ethers",window.ethers.utils);
    const ethers = window.ethers.utils;
  
    let contract=new web3.eth.Contract(Withdraw_Abi,Withdrwa_Address);
    let signingKey = new ethers.SigningKey('0x'+privateKey);
    console.log("TAyyab");
    let extra = Math.random() * 100 +1; // Additional randomness
  nonce = parseInt(nonce+Math.random() * 10); 
  nonce = nonce + extra;
  let message = (nonce + AmountBNB + new Date()).toString(); // Random unique message
  let messageBytes = ethers.toUtf8Bytes(message);
  let messageDigest = ethers.keccak256(messageBytes);
  let signature = signingKey.signDigest(messageDigest);
   contract.methods.userTokenWithdraw(AmountBNB, parseInt(nonce), [messageDigest, signature.r, signature.s], signature.v).send({from:userInfo?.EthAddress}).then((output) => {
        console.log("- Output:", output, "\n");
        // jQuery("#withDrawTokenhash").text(output);
    });;
    setLoadingTrans(false)



  }catch(e){
    setLoadingTrans(false)
    console.log("Erroe while call Withdraw Fuction",e);

  }
 }



  
  return (
    <>
      {isLoading ? (
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <ToastContainer />
          {!userInfo?.EthAddress ? (
            <div className="" ng-controller="myProfileAngularCtrl">
              <div className="content-wrapper">
                <div className="grid grid-1">
                  <div className="">
                    <div className="section-heading">
                      <h2>Enter Withdrawal Address</h2>
                    </div>
                    <div className="box box-default">
                      {userInfo?.EthAddress == userInfo?.EthAddress ? (
                        <>
                          <div className="panel-body">
                            <br />
                            <div className="row">
                              <div className="col-md-2">
                                <label>Metamask Address</label>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  id="EthAddress"
                                  name="EthAddress"
                                  className="form-control mb-20"
                                  value={userInfo?.EthAddress}
                                  disabled={true}
                                  placeholder="Enter ETH Address"
                                />
                              </div>
                            </div>
                            <br />
                            {/* <div className="row">
                              <div className="col-md-2">
                                <label>TRON Address</label>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  id="TronAddress"
                                  name="TronAddress"
                                  value={tronAdd}
                                  onChange={(e) => setTronAdd(e.target.value)}
                                  className="form-control mb-20"
                                  placeholder="Enter TRON Address"
                                />
                              </div>
                            </div> */}
                            {/* <div className="row pt-4">
                              <div className="col-md-3 col-md-offset-2">
                                <div className="submit_bnt">
                                  <button
                                
                                    id="btnsub2"
                                    className="btn"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </>
                      ) : (
                        <div className="panel-body">
                          <div className="row">
                            <div className="col-md-2">
                              <label style={{ color: 'red' }}>Wrong Address</label>
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-md-2">
                              <label>
                                Plaese connect Metamask with{" "}
                                <b>
                                  {`${userInfo?.EthAddress
                                    ? userInfo?.EthAddress.substr(
                                      0,
                                      6
                                    )
                                    : ""} ... ${userInfo?.EthAddress
                                      ? userInfo?.EthAddress.substr(
                                        userInfo?.EthAddress.length - 6,
                                        userInfo?.EthAddress.length
                                      )
                                      : ""} `}
                                </b>
                                
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          <div className="content-wrapper">
            <div className="grid grid-1">
              <div className="">
                <div className="section-heading">
                  <h2>Withdrawal</h2>
                 
                </div>

                <div className="box box-default table-wrapper ">
                  <div className="panel-body">
                    {/* <span className="metamaskConnection" style={{color:"red"}}>Metamask is not connected..!..Wait...</span> */}
                    <br />
                    <br />
                    <br />
                    <div className="row">
                      <div className="col-md-2">
                        <label>Metamask Address</label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          id="EthAddress"
                          name="EthAddress"
                          className="form-control mb-20"
                          value={userInfo?.EthAddress}
                          disabled={true}
                          placeholder="Enter ETH Address"
                        />
                      </div>
                    </div>
                    {/* <div className="row mt-3 mb-3">
                      <div className="col-md-2">
                        <label>TRON Address</label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          id="TronAddress"
                          name="TronAddress"
                          value={userInfo?.TronAddress}
                          disabled={true}
                          className="form-control mb-20"
                          placeholder="Enter TRON Address"
                        />
                      </div>
                    </div> */}
                    <div className="row mt-5">
                      <div className="col-md-2">
                        <label>Wallet Net USD Value</label>
                      </div>
                      <div className="col-md-3">
                        <label className="form-control d-flex align-items-center">
                          {trxtBalance}
                        </label>
                      </div>
                    </div>

                    <br />

                    <div className="row">
                      <div className="col-md-2">
                        <label>Enter USD Amount </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control mb-20 ng-pristine ng-untouched ng-valid ng-empty ng-valid-maxlength"
                          id="amount"
                          placeholder="Enter USD Amount"
                          value={depositeAmount}
                          onChange={(e) => setDepositeAmount(e.target.value)}
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div className="row mrset mt-5" id="withdrwaltokendiv">
                      <div className="col-md-2">
                        <label>Withdrawal Token </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                          value={rate ? (depositeAmount / rate) * 0.95 : 0}
                          placeholder="Withdrwal Token "
                          disabled={true}
                        />
                      </div>
                    </div>

                    <input
                      type="hidden"
                      id="address"
                      className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                      value=""
                      autoComplete="off"
                    />
                    <input
                      type="hidden"
                      id="userid"
                      className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                      value=""
                      autoComplete="off"
                    />
                    <input
                      type="hidden"
                      id="withdrawalvalidate"
                      className="form-control ng-pristine ng-untouched ng-valid ng-empty"
                      value=""
                      autoComplete="off"
                    />

                    <div className="row">
                      <div className="col-md-3 col-md-offset-2">
                        {isLoadingTrans ? (
                          <button
                            className="btn btn-success"
                            style={{ marginTop: "10px" }}
                            id="btnother"
                          >
                            <div
                              className="loaders"
                              style={{ height: "30px", width: "30px" }}
                            ></div>
                            Transaction is in progress
                          </button>
                        ) : (
                          <button
                            className="btn btn-success"
                            style={{ marginTop: "10px" }}
                            id="btnother"
                            onClick={() => Withdraw_toke()}
                          >
                            Withdrawal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}  
          <div className="clearfix">
            <br />
          </div>

          <br />
          <br />
          <div className="footer-section">
            Copyright © 2022 Yeepule. All Rights Reserved.
          </div>
        </>
      )}
    </>
  );
};
