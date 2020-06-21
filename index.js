const exchange = artifacts.require("Exchange");
var Web3 = require('web3');
const url = "http://127.0.0.1:7545";
var web3 = new Web3(new Web3.providers.HttpProvider(url));

async function maint() {
  contract1 = await exchange.deployed();
  var res = await contract1.exchangeAddress();
  console.log(res);
  return res;
}




module.exports = async function (callback) {
  try {
    await maint()
  } catch (e) {
    console.log(e)
  }
  callback()
}