import { ethers } from 'ethers';
import React, { useState } from 'react';
import SimpleStore_abi from './SimpleStore_abi.json'



const Simplestore = () => {

    const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);


    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                })
        } else {
            setErrorMessage('Need to install MetaMask!')
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();

    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, tempSigner);
        setContract(tempContract);
    }

    const getCurrentVal = async () => {
        let val = await contract.get();
        setCurrentContractVal(val);
    }

    const setHandler = (e) => {
        e.preventDefault();
        contract.set(e.target.setText.value);
    }

    return (
        <div>
            <h3>Get/Set Interaction with contract!</h3>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <h3>Address: {defaultAccount}</h3>

            <form onSubmit={setHandler}>
                <input id='setText' type="text" />
                <button type={"submit"}> Update Contract </button>

            </form>

            <button onClick={getCurrentVal}> Get Current Value</button>
            {currentContractVal}
            {errorMessage}


        </div>
    );
}

export default Simplestore;
