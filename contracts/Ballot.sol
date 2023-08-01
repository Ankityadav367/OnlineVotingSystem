// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.7.0;


contract Ballot {

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
      
        string name;   
        uint voteCount; 
    }
    struct Request{
        string name;
        address rAddress;
    }

    uint public  proposalCount=0;
    uint public votesCount=0;
    uint public requestCount=0;

    enum State{Created,Voting,Ended}
        State public state;


    address public chairperson;

    mapping(address => Voter) public voters;
    mapping(uint => Proposal) public proposals;
    mapping(uint => Request) public requests;


     
             modifier onlyOfficial(){
            require(msg.sender==chairperson);
            _;
            }

            modifier inState(State _state){
            require(state==_state);
            _;
            }

    
    constructor() 
    public
    {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        state=State.Created;

       
    }


function sendRequest(string memory _name)
        public
        inState(State.Created)
        {
           
        requests[requestCount] = Request(_name,msg.sender);
        requestCount=requestCount+1;
        }


 function addCandidate (string memory _candidateName)
            public
            onlyOfficial
            inState(State.Created)
            {
                
           proposals[proposalCount] = Proposal(_candidateName,0);
            proposalCount=proposalCount+1;
          
            }


    function giveRightToVote(address voter) 
    public 
    inState(State.Created)
    {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    

     function startVoting()
            public
            inState(State.Created)
            onlyOfficial()
            {
            state=State.Voting;
            }


    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // We found a loop in the delegation, not allowed.
            require(to != msg.sender, "Found loop in delegation.");
        }
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {


            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
           
            delegate_.weight += sender.weight;
        }
    }

    
    function vote(uint proposal) 
    public 
    inState(State.Voting)
    {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
        votesCount=votesCount+1;
        sender.weight=sender.weight-1;
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposalCount; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view
            returns (string memory winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }

    function endvote()
            public
            inState(State.Voting)
            onlyOfficial
            {
            state=State.Ended;
            }




}