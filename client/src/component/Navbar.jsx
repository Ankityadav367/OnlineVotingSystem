import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    let state=this.props.votingState;
      let status;
      if(state==0){
      status="Contract is Just Deployed";
      }
      else if(state==1){
        status="Voting is Started";
      }else{
        status=" Voting ended"
      }
      // right to vote
      

    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          voting System
        </a>
        
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{this.props.account}</span></small>
          </li>
          </ul>
          <ul>
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{status}</span></small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
