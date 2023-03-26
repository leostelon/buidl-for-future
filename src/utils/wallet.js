export async function getWalletAddress() {
	try {
		let address = await window.ethereum.selectedAddress;
		return address;
	} catch (error) {
		console.log(error);
	}
}
