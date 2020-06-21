// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
import "../node_modules/@openzeppelin/contracts/math/Safemath.sol";


contract ERC20Token {
    using SafeMath for uint256;
    string  public name;
    string  public symbol;
    string public decimals;
    uint public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor () public {
        name = "test";
        symbol = "Lol";
        decimals = "2";
        totalSupply = 10**18;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(msg.sender, msg.sender, totalSupply);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "transaction aborted due to insufficient funds");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "transaction aborted due to insufficient funds");
        require(allowance[_from][msg.sender] >= _value, "transaction aborted due to insufficient approved allowance");
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_from].add(_value);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

}