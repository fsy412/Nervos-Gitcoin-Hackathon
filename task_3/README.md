# Gitcoin: 2) Deploy A Simple Ethereum Smart Contract On Polyjuice
1.A screenshot of the console output immediately after you have successfully issued a smart contract call.

![png](https://github.com/fsy412/Nervos-Gitcoin-Hackathon/blob/main/task_3/snapshot.png?raw=true)

2.The transaction hash from the console output (in text format).
0x25fecdf54013e3c05c7d26adae11525a7f1b5119a246b6831c044def7d923866

3.The contract address that you called (in text format).
0x4b314BdC75dd3b9dF2f4847Bdc79cDDe9FeD4764

The ABI for contract you made a call on (in text format).
```
[
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]
```