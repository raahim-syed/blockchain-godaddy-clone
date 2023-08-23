import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Search from './components/Search'
import Domain from './components/Domain'

// ABIs
import ETHDaddy from './abis/ETHDaddy.json'

// Config
import config from './config.json';

function App() {

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const [ethDaddy, setETHDaddy] = useState(null)
  const [domains, setDomains] = useState([]);

  const loadBlockChainData = async () => {
    //Setting Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Connecting To Network
    const network = await provider.getNetwork();
    // console.log(config[network.chainId].ETHDaddy.address)

    //Creating Contract Instance
    const ethDaddy = new ethers.Contract(config[network.chainId].ETHDaddy.address, 
                    ETHDaddy, provider);

    setETHDaddy(ethDaddy)

    console.log(ethDaddy)
    //Getting Some Data from contract
    const maxSupply = await ethDaddy.name();
    console.log(maxSupply)

    //Getting Domains From Contract
    const domains = []; //For Storing Domains
    for(let i = 1 ;i <= maxSupply; i++){
      const domain = await ethDaddy.getDomain(i);
      domains.push(domain);
    } 
    setDomains(...domains);
    console.log(domains)

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({"method": "eth_requestAccounts"})
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockChainData()
  }, []);


  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <Search />

      <div className='cards__section'>

        <h2 className='cards__title'>Why You Need A Domain Name.</h2>
        <p className='cards__description'>
          Own your custom username, use it across services, and be able to store
          an avatar and other profile data.
        </p>
        
        <hr></hr>

        <div className='cards'>
          {domains.map((domain, index) => {
            return <Domain domain={domain} ethDaddy={ethDaddy} provider={provider}
             id={index + 1} key={index} /> 
          })}
        </div>

      </div>

    </div>
  );
}

export default App;