import * as fs from "fs";
import * as csv from "csv";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/kN-QxA08QeBRHQXiJ_gNSLwTes3IQ4RC"
);

let blockNum = 14134149;

const consolesAddr = "0x8ed0e7404675d5c7f5b4f2a829138afcaf53d2ab";
const contractJson = fs.readFileSync("./abi.json");
const abi = JSON.parse(contractJson);
const consolesContract = new web3.eth.Contract(abi, consolesAddr);

let data = [];
let cols = {
  id: "id",
  owner: "owner",
};

// Get owner of each console
for (let i = 1; i < 1001; i++) {
  const owner = await consolesContract.methods
    .ownerOf(i)
    .call(undefined, blockNum);

  data.push([i, owner]);

  console.log(i);
}

console.log(data.length);
csv.stringify(data, { header: true, columns: cols }, (err, output) => {
  if (err) throw err;

  fs.writeFile("owner.csv", output, function (err) {
    if (err) {
      console.log(
        "Some error occured - file either not saved or corrupted file saved."
      );
    } else {
      console.log("It's saved!");
    }
  });
});
