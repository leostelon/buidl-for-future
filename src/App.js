import "./App.css";
import "./styles/navbar.css";
import "./styles/body.css";
import { Upload } from "./components/Upload";
import React, { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
	ConnectButton,
	getDefaultWallets,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { shardeumChain, STORAGE_CONTRACT_ADDRESS } from "./constant";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { readContracts } from "@wagmi/core";
import StorageInterface from "./abi/Storage.json";
import { connectWalletToSite, getWalletAddress } from "./utils/wallet";
import { Box } from "@mui/system";
import { WelcomeScreen } from "./screens/Welcome";
import { SaleList } from "./components/SaleList";
import StorageJSONInterface from "./abi/Storage.json";
import Web3 from "web3";
import { checkApproval } from "./utils/checkApproval";
import { Processing } from "./components/Processing";
import { Grid } from "@mui/material";
import { PostAd } from "./components/PostAd";
import { loadMyPostStreams } from "./utils/dataverse";
import { getShortAddress } from "./utils/addressShort";

const { chains, provider } = configureChains(
	[
		{
			...shardeumChain,
			iconUrl:
				"https://images.yourstory.com/cs/images/companies/1646851374267-1666158419806.jpg?fm=auto&ar=1:1&mode=fill&fill=solid&fill-color=fffhttps://example.com/icon.svg",
		},
	],
	// [
	// 	{
	// 		...mumbaiChain,
	// 		iconUrl:
	// 			"https://images.yourstory.com/cs/images/companies/1646851374267-1666158419806.jpg?fm=auto&ar=1:1&mode=fill&fill=solid&fill-color=fffhttps://example.com/icon.svg",
	// 	},
	// ],
	[
		jsonRpcProvider({
			rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
		}),
	]
);

const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

function App() {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [postDialogOpen, setPostUploadDialogOpen] = useState(false);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isWelcomeScreen, setIsWelcomeScreen] = useState(false);
	const [marketTab, setMarketTab] = useState(false);
	const [timeLineTab, setTimeLineTab] = useState(false);
	const [saleProcessing, setSaleProcessing] = useState(false);
	const [saleProcessingComplete, setsaleProcessingComplete] = useState(false);
	const [posts, setPosts] = useState([]);

	const storageContract = {
		abi: StorageInterface.abi,
		address: STORAGE_CONTRACT_ADDRESS,
	};

	async function getFiles() {
		const currentAddress = await getWalletAddress();
		const data = await readContracts({
			contracts: [{ ...storageContract, functionName: "getFiles" }],
			overrides: { from: currentAddress },
			chainId: 80001,
		});
		setFiles([]);
		console.log(data[0]);
		setLoading(false);
		setFiles(data[0]);
	}

	async function sellAsset(contractAddress, tokenId) {
		try {
			setSaleProcessing(true);
			// Check Approval
			const approved = await checkApproval(
				contractAddress,
				contractAddress,
				tokenId
			);
			if (!approved) {
				setSaleProcessing(false);
				return;
			}

			const priceresponse = prompt("Enter price in SHM.");
			if (!priceresponse) setSaleProcessing(false);
			if (isNaN(parseFloat(priceresponse))) return;
			const price = Web3.utils.toWei(priceresponse);

			const contract = new window.web3.eth.Contract(
				StorageJSONInterface.abi,
				STORAGE_CONTRACT_ADDRESS
			);
			const currentAddress = await getWalletAddress();
			// Gas Calculation
			const gasPrice = await window.web3.eth.getGasPrice();
			const gas = await contract.methods
				.setBuyPrice(contractAddress, tokenId, price)
				.estimateGas({
					from: currentAddress,
				});

			const resp = await contract.methods
				.setBuyPrice(contractAddress, tokenId, price)
				.send({ from: currentAddress, gasPrice, gas })
				.on("transactionHash", function (hash) {
					// setStatus(3);
				})
				.on("receipt", async function (receipt) {
					setsaleProcessingComplete(true);
				});
			return resp;
		} catch (error) {
			setSaleProcessing(false);
			console.log(error);
		}
	}

	function onClose() {
		setUploadDialogOpen(false);
	}

	function onPostClose() {
		setPostUploadDialogOpen(false);
	}

	function onCloseWelcome() {
		setIsWelcomeScreen(false);
	}

	async function getPosts() {
		const results = await loadMyPostStreams();
		setPosts(results);
	}

	useEffect(() => {
		const isWelcome = localStorage.getItem("welcome");
		if (isWelcome !== "true") {
			setIsWelcomeScreen(true);
		}
		connectWalletToSite();
		getFiles();
		getPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				{isWelcomeScreen ? (
					<WelcomeScreen onCloseWelcome={onCloseWelcome} />
				) : (
					<div className="App">
						<div className="navbar">
							<div>
								<h2>Privacy Legal🔐</h2>
							</div>
							<div style={{ display: "flex" }}>
								<div style={{ display: "flex", marginRight: "24px" }}>
									<div
										className={`nav-option ${
											marketTab || timeLineTab ? "" : "active"
										}`}
										onClick={() => {
											setMarketTab(false);
											setTimeLineTab(false);
										}}
									>
										<p>Files</p>
									</div>
									<div
										className={`nav-option ${marketTab ? "active" : ""}`}
										onClick={() => {
											setMarketTab(!marketTab);
											setTimeLineTab(false);
										}}
									>
										<p>Market</p>
									</div>
									<div
										className={`nav-option ${timeLineTab ? "active" : ""}`}
										onClick={() => {
											setTimeLineTab(!timeLineTab);
											setMarketTab(false);
										}}
									>
										<p>Timeline</p>
									</div>
									<div
										className={`nav-option`}
										onClick={() => {
											setPostUploadDialogOpen(true);
										}}
									>
										<p>Post Ad</p>
									</div>
								</div>
								<div
									className="upload-button"
									onClick={() => setUploadDialogOpen(true)}
								>
									<div>
										<p>Upload</p>
									</div>
									<Upload isOpen={uploadDialogOpen} onClose={onClose} />
									<PostAd isOpen={postDialogOpen} onClose={onPostClose} />
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<ConnectButton />
								</div>
							</div>
						</div>
						<div className="body">
							{timeLineTab ? (
								<Grid
									container
									spacing={{ xs: 2, md: 3 }}
									columns={{ xs: 4, sm: 8, md: 12 }}
								>
									{Object.entries(posts).map((asset, index) => (
										<Grid item xs={12} sm={4} md={3} key={index}>
											<Box
												sx={{
													p: 2,
													m: 2,
													minHeight: "10vw",
													backgroundColor: "white",
													boxShadow: "rgba(149, 157, 165, 0.3) 0px 4px 24px",
													borderRadius: "8px",
													overflow: "hidden",
													width: "100%",
												}}
											>
												<h3>
													<span style={{ color: "grey" }}>By @</span>
													{getShortAddress(asset[1].content.controller ?? "")}
												</h3>
												<h6>{asset[1].content.content}</h6>
											</Box>
										</Grid>
									))}
								</Grid>
							) : marketTab ? (
								<SaleList />
							) : loading ? (
								<Box mt={2}>
									<h3>Fetching files...</h3>
								</Box>
							) : (
								<div>
									<table>
										<Processing
											isOpen={saleProcessing}
											canClose={saleProcessingComplete}
										/>
										<thead>
											<tr>
												<th>Name</th>
												<th>Size</th>
												<th>File</th>
												<th>Sell</th>
											</tr>
										</thead>
										<tbody>
											{files.map((f, i) => (
												<tr key={i}>
													<td>{f.name}</td>
													<td>{f.size.toString()} kb</td>
													<td>
														<a href={f.url} target="_blank" rel="noreferrer">
															View File
														</a>
													</td>
													<td
														style={{
															cursor: "pointer",
															color: "blue",
															textDecoration: "underline",
														}}
														onClick={() =>
															sellAsset(f.contractAddress, f.tokenId)
														}
													>
														Sell
													</td>
												</tr>
											))}
										</tbody>
									</table>
									<div
										onClick={() => getFiles()}
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
							)}
						</div>
					</div>
				)}
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;
