import React, { Component } from 'react';

class Admin extends Component {

  render() {

    return (
      <div id="content">
      <button onClick={(event) => {this.props.startVoting()}}>start Voting</button><p>&nbsp;</p>
        <button onClick={(event) => {this.props.endvote()}}>End Voting</button><p>&nbsp;</p>
      
      <h1>add candidate</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          this.props.addCandidate(name)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
        <p>&nbsp;</p>
        <h2>Give Right to These Voters</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"> Voter Name</th>
              <th scope="col">Voter Address</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.requests.map((product, key) => {
              return(
                <tr key={key}>
                  <td>{product.name}</td>
                  <td>{product.rAddress}</td>
                
                  <td>
                    { !product.purchased
                      ? <button
                          value={product.rAddress}
                          onClick={(event) => {
                            this.props.giveRightToVote(event.target.value)
                          }}
                        >
                          GiveRight
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p>&nbsp;</p>
        <h3>Winner name</h3>

        <h5>{this.props.winnerName}</h5>
      </div>
    );
  }
}

export default Admin;
