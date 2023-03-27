import { getWalletAddress } from "./wallet";
import ERC721Interface from "../abi/ERC721.json";

export async function checkApproval(
	approval_address,
	contract_address,
	token_id
) {
	let isApproved = false;
	try {
		const currentAddress = await getWalletAddress();
		const abi = ERC721Interface.abi;

		const contract = new window.web3.eth.Contract(abi, contract_address);
		let approvedAddress;
		// Check for approval
		approvedAddress = await contract.methods.getApproved(token_id).call();

		if (approvedAddress !== approval_address) {
			const isConfirmed = window.confirm(
				"Before selling the NFT, please approve us as a operator for your NFT."
			);
			if (isConfirmed) {
				await contract.methods
					.approve(approval_address, token_id)
					.send({ from: currentAddress });
				isApproved = true;
			}
		} else {
			isApproved = true;
		}
	} catch (error) {
		console.log(error.message);
	}
	return isApproved;
}
