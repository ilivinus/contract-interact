import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SampleContract from "../../artifacts/konnadexAbi.json";
import TokenContract from "../../artifacts/erc20tokenAbi.json";

// TODO: read from environment variable
const contractAddress = "0xE83174B6990FC6c2Aa0Cf39a46288fB74bc64a80";
const tokenContractAddress = "0x73cc4CD3A3D7C5D9FB20A9a443beb970bB6630C8";
const amount = ethers.BigNumber.from("100");
const App = () => {
  const [message, setMessage] = useState("");

  // request access to the user's MetaMask account
  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };
  const approveToken = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      console.log("#########");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokenContractAddress,
        TokenContract,
        signer
      );
      console.log(
        "#########",
        (await contract.totalSupply()).toString(),
        "#$$$$$$",
        contractAddress
      );
      const ownerAddress = await signer.getAddress();
      const allowance = await contract.allowance(ownerAddress, contractAddress);
      console.log("allowance: ", allowance.toString());
      const transaction = await contract.approve(contractAddress, amount);

      console.log(transaction);
      await transaction.wait();
      const all = await contract.allowance(ownerAddress, contractAddress);
      console.log("allowance: ", all.toString());
    }
  };

  // call the smart contract, send an update
  const makeTransfer = async () => {
    if (typeof window.ethereum !== "undefined") {
      // await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        SampleContract,
        signer
      );
      console.log("####");

      // const token = await contract.tokens("0x0000005755534454");
      // const fee = await contract.setFee(ethers.BigNumber.from("10"));
      // await fee.wait();
      // const feeAmount = await contract.invoiceFee();
      // console.log(token, feeAmount.toString(), "##########");
      // const tokenTrans = await contract.addToken(
      //   "0x0000005755534454",
      //   tokenContractAddress
      // );
      // await tokenTrans.wait();
      // const tokenC = await contract.tokens("0x0000005755534454");
      // console.log(tokenC, feeAmount.toString(), "##########");

      const transaction = await contract.transferFromWithRef(
        "0x59e5Cda3AfD25b578BeE7f6DE6D406D06b3C8BAa",
        amount,
        "0x0000005755534454",
        "0x5553445600000000000000000000000000000000000000000000000000000000",
        { gasLimit: ethers.utils.parseUnits("0.000000000005", "ether") }
      );
      await transaction.wait();

      const tokBal = await contract.getTokenBalance("0x0000005755534454");

      console.log("Token balance: ", tokBal.toString());
    }
  };

  const handleUpdateClick = async () => {
    try {
      await makeTransfer();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        padding: 8,
      }}
    >
      <p>{`Contract message: ${message}`} </p>

      <br />
      <button onClick={approveToken}>Approve</button>
      <br />
      <button onClick={handleUpdateClick}>Update Message</button>
    </div>
  );
};

export default App;
