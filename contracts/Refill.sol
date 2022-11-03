// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface WCANTO {
    // deposit function used to deposit received canto into wcanto
    function deposit() external payable;
    // transfer wcanto to an address
    function transfer(address, uint) external returns(bool);
    // get balance of wcanto at address
    function balanceOf(address owner) external view returns (uint256 balance);
}

contract Refill {

    /// address of comptroller, this is the address that canto received will be sent to
    address immutable unitroller;
    address immutable wcanto;

    constructor(address _wcanto) {
        unitroller = 0x2c3f6919cc25Cd7559dbA05bAbad838D4A603fbd;
        wcanto = _wcanto;
    }

    function wrapSend () public {
        // wrap canto
        WCANTO(wcanto).deposit{value: address(this).balance}();

        // send to comptroller
        WCANTO(wcanto).transfer(unitroller, WCANTO(wcanto).balanceOf(address(this)));
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /// @dev wraps and sends all received canto to the comptroller
    receive() external payable {

    }
}