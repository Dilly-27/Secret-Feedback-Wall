// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

contract SecretFeedbackWall {
    address public immutable ADMIN;
    bytes32[][] public messages;
    uint256 public messageCount;

    event NewMessage(uint256 indexed id, address indexed sender);

    error InvalidMessageLength();
    error OnlyAdmin();

    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        ADMIN = _admin;
    }

    function submitFeedback(bytes32[] calldata encryptedMessage) external {
        if (encryptedMessage.length == 0 || encryptedMessage.length > 256) {
            revert InvalidMessageLength();
        }
        
        uint256 id = messageCount++;
        messages.push();
        
        for (uint256 i = 0; i < encryptedMessage.length; ) {
            messages[id].push(encryptedMessage[i]);
            unchecked { ++i; }
        }
        
        emit NewMessage(id, msg.sender);
    }

    function getMessages() external view returns (bytes32[][] memory) {
        return messages;
    }

    function getMessage(uint256 id) external view returns (bytes32[] memory) {
        require(id < messageCount, "Invalid message ID");
        return messages[id];
    }

    function getMessageCount() external view returns (uint256) {
        return messageCount;
    }

    function isAdmin(address account) external view returns (bool) {
        return account == ADMIN;
    }
}
