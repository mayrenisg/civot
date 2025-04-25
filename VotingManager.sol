// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Multi-event Voting Contract
/// @author [Your Name]
contract VotingManager {
    address public owner;
    uint256 public nextEventId;

    struct Option {
        string name;
        uint256 voteCount;
    }

    struct VotingEvent {
        string name;
        uint256 start;
        uint256 end;
        Option[] options;
        mapping(address => bool) hasVoted;
        bool exists;
    }

    mapping(uint256 => VotingEvent) private votingEvents;
    mapping(address => uint256[]) private userVotingHistory;  // Historial de votaciones de los usuarios

    event VotingEventCreated(uint256 eventId, string name, uint256 start, uint256 end);
    event Voted(uint256 eventId, address voter, uint256 optionIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createVotingEvent(
        string memory _name,
        string[] memory _optionNames,
        uint256 _durationMinutes
    ) public onlyOwner {
        require(_optionNames.length > 0, "At least one option required");

        VotingEvent storage ve = votingEvents[nextEventId];
        ve.name = _name;
        ve.start = block.timestamp;
        ve.end = block.timestamp + (_durationMinutes * 1 minutes);
        ve.exists = true;

        for (uint i = 0; i < _optionNames.length; i++) {
            ve.options.push(Option({name: _optionNames[i], voteCount: 0}));
        }

        emit VotingEventCreated(nextEventId, _name, ve.start, ve.end);
        nextEventId++;
    }

    function vote(uint256 _eventId, uint256 _optionIndex) public {
        VotingEvent storage ve = votingEvents[_eventId];
        require(ve.exists, "Voting event does not exist");
        require(block.timestamp >= ve.start && block.timestamp < ve.end, "Voting not active");
        require(!ve.hasVoted[msg.sender], "Already voted");
        require(_optionIndex < ve.options.length, "Invalid option");

        ve.options[_optionIndex].voteCount++;
        ve.hasVoted[msg.sender] = true;

        // Agregar el evento al historial de votaciones del usuario
        userVotingHistory[msg.sender].push(_eventId);

        emit Voted(_eventId, msg.sender, _optionIndex);
    }

    function getOptions(uint256 _eventId) public view returns (Option[] memory) {
        VotingEvent storage ve = votingEvents[_eventId];
        require(ve.exists, "Voting event does not exist");

        Option[] memory result = new Option[](ve.options.length);
        for (uint i = 0; i < ve.options.length; i++) {
            result[i] = ve.options[i];
        }
        return result;
    }

    function getWinner(uint256 _eventId) public view returns (string memory winnerName, uint256 winnerIndex) {
        VotingEvent storage ve = votingEvents[_eventId];
        require(ve.exists, "Voting event does not exist");
        require(block.timestamp >= ve.end, "Voting still active");

        uint maxVotes = 0;
        uint winningIndex = 0;
        uint tieCount = 0;

        // Buscar el número máximo de votos y contar empates
        for (uint i = 0; i < ve.options.length; i++) {
            if (ve.options[i].voteCount > maxVotes) {
                maxVotes = ve.options[i].voteCount;
                winningIndex = i;
                tieCount = 1;  // Resetear el contador de empate
            } else if (ve.options[i].voteCount == maxVotes) {
                tieCount++;  // Aumentar el contador de empate
            }
        }

        // Si hay empate, devolver un mensaje indicando el empate
        if (tieCount > 1) {
            return ("It's a tie", 0);  // Retorna que hay empate
        }

        return (ve.options[winningIndex].name, winningIndex);
    }

    function getVotingStatus(uint256 _eventId) public view returns (bool isActive) {
        VotingEvent storage ve = votingEvents[_eventId];
        require(ve.exists, "Voting event does not exist");
        return block.timestamp >= ve.start && block.timestamp < ve.end;
    }

    function getRemainingTime(uint256 _eventId) public view returns (uint256 secondsRemaining) {
        VotingEvent storage ve = votingEvents[_eventId];
        require(ve.exists, "Voting event does not exist");

        if (block.timestamp >= ve.end) return 0;
        return ve.end - block.timestamp;
    }

    // Función para obtener el historial de votaciones de un usuario
    function getVotedEvents(address _voter) public view returns (uint256[] memory) {
        return userVotingHistory[_voter];
    }
}