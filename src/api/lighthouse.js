import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";

const API_KEY = process.env.REACT_APP_LIGHTHOUSE_KEY;

export async function uploadFile(file) {
	try {
		const sig = await encryptionSignature();
		const response = await lighthouse.uploadEncrypted(
			file,
			sig.publicKey,
			API_KEY,
			sig.signedMessage,
			progressCallback
		);
		return response;
	} catch (error) {
		alert(error.message);
		console.log(error);
	}
}

const encryptionSignature = async () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const address = await signer.getAddress();
	const messageRequested = (await lighthouse.getAuthMessage(address)).data
		.message;
	const signedMessage = await signer.signMessage(messageRequested);
	return {
		signedMessage: signedMessage,
		publicKey: address,
	};
};

const progressCallback = (progressData) => {
	let percentageDone =
		100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
	console.log(percentageDone);
};
