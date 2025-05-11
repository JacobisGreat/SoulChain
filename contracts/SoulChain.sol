// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SoulChain {
    address public owner;
    uint256 public lastPing;
    uint256 public timeout;
    bool public isExecuted;

    struct Beneficiary {
        address wallet;
        uint256 percentage;
    }

    Beneficiary[] public beneficiaries;

    constructor(uint256 _timeout) {
        owner = msg.sender;
        timeout = _timeout;
        lastPing = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function ping() external onlyOwner {
        lastPing = block.timestamp;
    }

    function setBeneficiaries(address[] calldata _wallets, uint256[] calldata _percentages) external onlyOwner {
        require(_wallets.length == _percentages.length, "Mismatched input");
        delete beneficiaries;

        uint256 total;
        for (uint i = 0; i < _wallets.length; i++) {
            beneficiaries.push(Beneficiary(_wallets[i], _percentages[i]));
            total += _percentages[i];
        }

        require(total == 10000, "Must total 100%");
    }

    function triggerAfterlife() external {
        require(block.timestamp > lastPing + timeout, "Still active");
        require(!isExecuted, "Already executed");

        uint256 balance = address(this).balance;
        isExecuted = true;

        for (uint i = 0; i < beneficiaries.length; i++) {
            uint256 amount = (balance * beneficiaries[i].percentage) / 10000;
            payable(beneficiaries[i].wallet).transfer(amount);
        }
    }

    receive() external payable {}
}
