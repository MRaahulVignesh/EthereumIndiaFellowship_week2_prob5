var ERC20Token = artifacts.require("./ERC20Token.sol");

contract('ERC20Token', function(accounts) {
  var tokenInstance;
  console.log(accounts);
  it('initializes the contructor values', function() {
    return ERC20Token.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name) {
      assert.equal(name, 'test', 'has the right Token Name');
      return tokenInstance.symbol();
    }).then(function(symbol) {
      assert.equal(symbol, 'tes', 'has the right symbol');
      return tokenInstance.totalSupply();
    }).then(function(totalSupply){
        assert.equal(totalSupply.toNumber(), 1000000000000, "has the right total supply")
        return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
        assert.equal(balance.toNumber(), 1000000000000, "transfers the inital supply to the owner")
    })
  });


  it('checks the transfer function', function() {
    return ERC20Token.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1], 1000000000001);                   
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('transaction aborted due to insufficient funds') >= 0, 'error message must be thrown');
      return tokenInstance.transfer.call(accounts[1], 100, { from: accounts[0] });
    }).then(function(success) {
      assert.equal(success, true, 'should return true');
      return tokenInstance.transfer(accounts[1], 100, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'trigger an event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the from address');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the to address');
      assert.equal(receipt.logs[0].args._value, 100, 'logs the transaction amount');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 999999999900, 'deducts the transaction amount from sender address');                           
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 100, 'adds the transaction amount to receiver address');
    });
  });

  it('checks the approve function', function() {
    return ERC20Token.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.approve.call(accounts[1], 100);
    }).then(function(success) {
      assert.equal(success, true, 'it returns true');
      return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'trigger an event');
      assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval event');
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the owner account');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the recepient account');
      assert.equal(receipt.logs[0].args._value, 100, 'logs the allowance amount');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(allowance) {
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
    });
  });

  it('handles delegated token transfers', function() {
    return ERC20Token.deployed().then(function(instance) {
      tokenInstance = instance;
      fromAccount = accounts[1];
      toAccount = accounts[2];
      spendingAccount = accounts[3];
      tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then(function(receipt) {
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('transaction aborted due to insufficient funds') >= 0, 'cannot transfer value larger than sender-account balance');
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('transaction aborted due to insufficient approved allowance') >= 0, 'amount cannot cross approved allowance');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(success) {
      assert.equal(success, true, "it should return true");
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'trigger an event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the from address');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the to address');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transaction amount');
      return tokenInstance.balanceOf(fromAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 190, 'deducts the transaction amount from sender address');
      return tokenInstance.balanceOf(toAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 10, 'adds the transaction amount to receiver address');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function(allowance) {
      assert.equal(allowance.toNumber(), 0, 'updates the approved allowance');
    });
  });
});