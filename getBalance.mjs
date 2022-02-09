import * as fs from "fs";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import * as csv from "csv";

const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/kN-QxA08QeBRHQXiJ_gNSLwTes3IQ4RC"
);

let blockNum = 14133150;

const stakingAddr = "0x738E19cBE9f0443772b0CccE45D9Fd8f98057850";
const contractJson = fs.readFileSync("./abi-staking.json");
const abi = JSON.parse(contractJson);

const stakingContract = new web3.eth.Contract(abi, stakingAddr);

let data = [];
let cols = {
  id: "id",
  unclaimed: "unclaimed",
};

// Get reward at blockNum
for (let i = 1; i < 1001; i++) {
  const rewards = await stakingContract.methods
    .calcReward(i)
    .call(undefined, blockNum);

  const bal = rewards["0"];

  data.push([i, bal]);

  console.log(i);
}

csv.stringify(data, { header: true, columns: cols }, (err, output) => {
  if (err) throw err;

  fs.writeFile("unclaimed-2.csv", output, function (err) {
    if (err) {
      console.log(
        "Some error occured - file either not saved or corrupted file saved."
      );
    } else {
      console.log("It's saved!");
    }
  });
});
