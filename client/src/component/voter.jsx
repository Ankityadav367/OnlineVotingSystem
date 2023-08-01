import React, { Component } from 'react';


class Voter extends Component {

  render() {
      let voted=this.props.voter.weight;
      let right;
      if(voted==0){
        right="This voter has NO right to vote";
      }
      if(voted==1){
        right=" This voter has  right to vote";
      }
    return (
      <div id="content">
        <h3>Send request For Right To Vote</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          this.props.sendRequest(name)
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
          <button type="submit" className="btn btn-primary">Send Request</button>
        </form>

        <p>&nbsp;</p>
        <h5 > {right}</h5>
        <p>&nbsp;</p>
        <h2>Candidate List</h2>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col"></th>
              <th scope="col">Vote Count</th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.candidates.map((product, key) => {
              return(
                <tr key={key}>
                <th scope="row">{key}</th>
                  <td>{product.name}</td>
                
                  <td>
                    { !this.props.voter.voted
                      ? <button
                          value={key}
                          onClick={(event) => {
                            this.props.vote(event.target.value)
                          }}
                        >
                          vote
                        </button>
                      : null
                    }
                    </td>
                    <td>{product.voteCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
      </div>
    );
  }
}

export default Voter;
