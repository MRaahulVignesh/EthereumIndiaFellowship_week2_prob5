const token = artifacts.require("ERC20Token");
const exchange = artifacts.require("Exchange");

module.exports = function(deployer) {
  deployer.deploy(token).then(function(instance){
   tokenAddress =  instance.address;
   return deployer.deploy(exchange, tokenAddress).then(function(instance){
     instance.createExchange().then(function(){
      console.log(instance.ERC20TokenAddress())
      console.log(instance.exchangeAddress())
     });
   });
  });
};