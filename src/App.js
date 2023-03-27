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
import { mumbaiChain, STORAGE_CONTRACT_ADDRESS } from "./constant";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { readContracts } from "@wagmi/core";
import StorageInterface from "./abi/Storage.json";
import { connectWalletToSite, getWalletAddress } from "./utils/wallet";
import { Box } from "@mui/system";

const { chains, provider } = configureChains(
	[
		{
			...mumbaiChain,
			iconUrl:
				"https://images.yourstory.com/cs/images/companies/1646851374267-1666158419806.jpg?fm=auto&ar=1:1&mode=fill&fill=solid&fill-color=fffhttps://example.com/icon.svg",
		},
	],
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
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);

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

	function onClose() {
		setUploadDialogOpen(false);
	}

	useEffect(() => {
		// setInterval(() => {
		// 	getFiles();
		// }, 5000);
		connectWalletToSite();
		getFiles();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				<div className="App">
					<div className="navbar">
						<div>
							<h2>Privacy Legal🔐</h2>
						</div>
						<div style={{ display: "flex" }}>
							<div
								className="upload-button"
								onClick={() => setUploadDialogOpen(true)}
							>
								<div>
									<p>Upload</p>
								</div>
								<Upload isOpen={uploadDialogOpen} onClose={onClose} />
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
						{loading ? (
							<Box mt={2}>
								<h3>Fetching files...</h3>
							</Box>
						) : (
							<table>
								<thead>
									<tr>
										<th>Name</th>
										<th>Size</th>
										<th>File</th>
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
										</tr>
									))}
								</tbody>
							</table>
						)}
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
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;
