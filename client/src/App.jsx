import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Ballot from './contracts/Ballot.json'
import Navbar from './component/Navbar.jsx'
import Admin from './component/admin.jsx'
import Voter from './component/voter.jsx'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Ballot.networks[networkId]
    if(networkData) {

      const ballot = new web3.eth.Contract(Ballot.abi, networkData.address)
      this.setState({ ballot })
      //get product count

      const proposalCount = await ballot.methods.proposalCount().call()
      this.setState({ proposalCount })

       const winnerName = await ballot.methods.winnerName().call()
      this.setState({ winnerName })

      const requestCount = await ballot.methods.requestCount().call()
            this.setState({requestCount})

      const voter = await ballot.methods.voters(this.state.account).call()
            this.setState({voter})

      const votingState = await ballot.methods.state().call()
            this.setState({votingState})

      //get seller address publice variable
      const chairperson = await ballot.methods.chairperson().call()
            this.setState({chairperson: chairperson})

      // Load products
      for (var i = 0; i < requestCount; i++) {
        const request = await ballot.methods.requests(i).call()
        this.setState({
          requests: [...this.state.requests, request]
        })
      }
      //load request address
      /*
      for (var i = 0; i < requestCount; i++) {
        const request = await ballot.methods.requestsWithAddrMap(this.state.requests[i].rAddress).call()
        this.setState({
          requestsWithAddrMap: [...this.state.requestsWithAddrMap, request]
        })
      }
*/
      for (var i = 0; i < proposalCount; i++) {
        const candidate = await ballot.methods.proposals(i).call()
        this.setState({
          candidates: [...this.state.candidates, candidate]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      requestCount: 0,
      requests: [],
      candidates:[],
      requestsWithAddrMap:[],
      loading: true
    }

    this.sendRequest = this.sendRequest.bind(this)
    this.addCandidate = this.addCandidate.bind(this)
    this.giveRightToVote=this.giveRightToVote.bind(this)
    this.startVoting=this.startVoting.bind(this)
    this.endvote=this.endvote.bind(this)
    this.vote=this.vote.bind(this)
  }



  sendRequest(name) {
    this.setState({ loading: true })
    this.state.ballot.methods.sendRequest(name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  vote(proposal) {
    this.setState({ loading: true })
    this.state.ballot.methods.vote(proposal).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  addCandidate(name) {
    this.setState({ loading: true })
    this.state.ballot.methods.addCandidate(name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  giveRightToVote(address) {
    this.setState({ loading: true })
    this.state.ballot.methods.giveRightToVote(address).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  startVoting() {
    this.setState({ loading: true })
    this.state.ballot.methods.startVoting().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  endvote() {
    this.setState({ loading: true })
    this.state.ballot.methods.endvote().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


  render() {

    if(this.state.account==this.state.chairperson){
    return (
      <div>
        <Navbar account={this.state.account}
               votingState={this.state.votingState} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Admin
                winnerName={this.state.winnerName}
                votingState={this.state.votingState}
                  requests={this.state.requests}
                  addCandidate={this.addCandidate}
                  giveRightToVote={this.giveRightToVote}
                  endvote={this.endvote}
                  startVoting={this.startVoting}/>
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
  else{
    return(
      <div>
        <Navbar account={this.state.account} 
        votingState={this.state.votingState}
        voter={this.state.voter}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Voter
                  sendRequest={this.sendRequest}
                  voter={this.state.voter}
                  account={this.state.account}
                  candidates={this.state.candidates}
                  vote={this.vote}/>
              }
            </main>
          </div>
        </div>
      </div>
      );
  }
  }
}

export default App;
