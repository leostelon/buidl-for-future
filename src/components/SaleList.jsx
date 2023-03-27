import React, { useEffect, useState } from "react";
import { readContracts } from "wagmi";
import Web3 from "web3";
import StorageInterface from "../abi/Storage.json";
import { STORAGE_CONTRACT_ADDRESS } from "../constant";
import { getShortAddress } from "../utils/addressShort";
import { getWalletAddress } from "../utils/wallet";
import StorageJSONInterface from "../abi/Storage.json";
import { Processing } from "./Processing";

export const SaleList = () => {
	const [assets, setAssets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saleProcessing, setSaleProcessing] = useState(false);
	const [saleProcessingComplete, setsaleProcessingComplete] = useState(false);

	const storageContract = {
		abi: StorageInterface.abi,
		address: STORAGE_CONTRACT_ADDRESS,
	};

	async function getSaleAssets() {
		const data = await readContracts({
			contracts: [{ ...storageContract, functionName: "getSales" }],
			chainId: 80001,
		});
		setAssets([]);
		console.log(data);
		setLoading(false);
		if (data[0]) setAssets(data[0]);
	}

	async function buySale(saleId, price) {
		try {
			setSaleProcessing(true);

			const contract = new window.web3.eth.Contract(
				StorageJSONInterface.abi,
				STORAGE_CONTRACT_ADDRESS
			);
			const currentAddress = await getWalletAddress();
			// Gas Calculation
			const gasPrice = await window.web3.eth.getGasPrice();
			const gas = await contract.methods.buySale(saleId).estimateGas({
				from: currentAddress,
				value: price,
			});

			const resp = await contract.methods
				.buySale(saleId)
				.send({ from: currentAddress, value: price, gasPrice, gas })
				.on("transactionHash", function (hash) {
					// setStatus(3);
				})
				.on("receipt", async function (receipt) {
					setsaleProcessingComplete(true);
				});
			console.log(resp);
			return resp;
		} catch (error) {
			setSaleProcessing(false);
			console.log(error);
		}
	}

	useEffect(() => {
		getSaleAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			{loading ? (
				<h3>Loading...</h3>
			) : (
				<table>
					<Processing
						isOpen={saleProcessing}
						canClose={saleProcessingComplete}
					/>
					<thead>
						<tr>
							<th>#ID</th>
							<th>Seller</th>
							<th>Price</th>
							<th>Token ID</th>
							<th>Status</th>
							<th>Sell</th>
						</tr>
					</thead>
					<tbody>
						{assets.map((f, i) => (
							<tr key={i}>
								<td>{f.id.toString()}</td>
								<td>{getShortAddress(f.seller)}</td>
								<td>{Web3.utils.fromWei(f.price.toString())} SHM</td>
								<td>#{f.tokenId.toString()}</td>
								<td>For Sale</td>
								<td
									style={{
										cursor: "pointer",
										color: "blue",
										textDecoration: "underline",
									}}
									onClick={() => buySale(f.id, f.price)}
								>
									Buy
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			<div
				onClick={() => getSaleAssets()}
				style={{
					color: "blue",
					cursor: "pointer",
					padding: "16px",
					textAlign: "center",
				}}
			>
				Refresh
			</div>
		</div>
	);
};
