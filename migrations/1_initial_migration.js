const Web3 = require('web3');

const TruffleConfig = require('../truffle-config.js');

const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
