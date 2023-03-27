import { getWalletAddress } from "./wallet";
import StorageJSONInterface from "../abi/Storage.json";
import { STORAGE_CONTRACT_ADDRESS } from "../constant";

export async function uploadFileContract(name, url, size) {
	try {
		const currentAddress = await getWalletAddress();
		const contract = new window.web3.eth.Contract(
			StorageJSONInterface.abi,
			STORAGE_CONTRACT_ADDRESS
		);

		const transaction = await contract.methods
			.addFile({ name, url, size })
			.send({ from: currentAddress });
		alert(
			`NFT with token ID ${transaction.events.Transfer.returnValues.tokenId} has been minted, it can take some time to reflect in your profile.`
		);
		return transaction;
	} catch (error) {
		console.log(error);
	}
}
