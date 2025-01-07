const hre = require("hardhat");
const crypto = require("crypto");

const MAX_INPUT_SIZE = 1024 * 1024;
const SECRET_KEY = "uomiuomiuomiuomi";
const BLOCK_SIZE = 16;

// function formatAndPrintCode(inputString) {
//   // Trova la posizione iniziale e finale del blocco di codice
//   const codeStart = inputString.indexOf("```") + "```".length;
//   const codeEnd = inputString.lastIndexOf("```");

//   if (codeStart === -1 || codeEnd === -1 || codeStart >= codeEnd) {
//     console.error("Blocco di codice non trovato o formattato male.");
//     return;
//   }

//   // Estrai il codice dalla stringa
//   let code = inputString.substring(codeStart, codeEnd).trim();

//   // Sostituisci i caratteri di escape di newline con veri newline
//   code = code.replace(/\\n/g, "\n").replace(/\\\"/g, '"').replace(/\\'/g, "'");

//   // Stampa il codice formattato in console
//   return code;
// }

async function main() {
  let domanda = [
    { role: 'user', content: 'Ciao, quanto fa 2+2?' }
  ];
  const lock = await hre.ethers.deployContract("UomiEngineCaller");

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);
  const input = JSON.stringify(domanda);

  const encrypted = encryptStringForWasm(input);
  //call callAgent from contract
  await lock.callAgent(1, 1, encrypted);
  // console.log("Call Agent from contract");

  await new Promise((r) => setTimeout(r, 25000));

  await lock.claimAgentResult(1);
  // result.wait();

  await new Promise((r) => setTimeout(r, 5000));

  let result = await lock.readAgentResult(1);

  await new Promise((r) => setTimeout(r, 5000));

  // result string into json

  //ollama result result.choices[0].message.content

  const output = Buffer.from(result[0].slice(2), "hex");
  const decrypted = decryptBytesArrayFromWasm(output);
  result[0] = decrypted;
  console.log("response: ", decrypted);
  console.log("nft id: \n", result[1]);
  console.log("validation count: \n", result[2]);
  console.log("total validator: \n", result[3]);

  // console.log("agent: \n", result[4].output);
}

function decryptBytesArrayFromWasm(encryptedBytes) {
  // group the bytes into blocks
  const blocks = [];
  for (let i = 0; i < encryptedBytes.length; i += BLOCK_SIZE) {
    blocks.push(encryptedBytes.slice(i, i + BLOCK_SIZE));
  }

  // Decrypt each block
  const decipher = crypto.createDecipheriv("aes-128-ecb", SECRET_KEY, "");
  const decryptedBlocks = [];
  decipher.setAutoPadding(false);
  for (let i = 0; i < blocks.length; i++) {
    const decryptedBlock = decipher.update(Buffer.from(blocks[i])).toString();
    decryptedBlocks.push(decryptedBlock);
  }

  // Remove extra spaces at the end of the last block
  const lastBlock = decryptedBlocks[decryptedBlocks.length - 1];
  let lastBlockReversed = lastBlock.split("").reverse().join("");
  while (lastBlockReversed[0] === " ") {
    lastBlockReversed = lastBlockReversed.slice(1);
  }
  decryptedBlocks[decryptedBlocks.length - 1] = lastBlockReversed.split("").reverse().join("");

  return decryptedBlocks.join("");
}

function encryptStringForWasm(string) {
  // Be sure the string is not too long
  if (string.length > MAX_INPUT_SIZE) {
    throw new Error("string is too long");
  }

  // Add padding to the string with extra spaces
  const paddingLength = BLOCK_SIZE - (string.length % BLOCK_SIZE);
  if (paddingLength > 0) {
    string += " ".repeat(paddingLength);
  }

  // Split the string into blocks
  const blocks = [];
  for (let i = 0; i < string.length; i += BLOCK_SIZE) {
    blocks.push(string.slice(i, i + BLOCK_SIZE));
  }

  // Encrypt each block
  const cipher = crypto.createCipheriv("aes-128-ecb", SECRET_KEY, "");
  const encryptedBlocks = blocks.map((block) => cipher.update(block));
  cipher.final();

  return new Uint8Array(Buffer.concat(encryptedBlocks));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
