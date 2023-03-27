import "./Upload.css";
import { IoClose } from "react-icons/io5";
import React, { useEffect, useRef, useState } from "react";
import { Box, Dialog, Divider, IconButton, TextField } from "@mui/material";
import StorageJSONInterface from "../abi/Storage.json";
import { uploadFile } from "../api/lighthouse";
import { Status } from "./Status";
import { NftStorageHttpService } from "../api/nftStorage";
import { STORAGE_CONTRACT_ADDRESS } from "../constant";
import { getWalletAddress } from "../utils/wallet";

export const Upload = ({ isOpen, onClose }) => {
	let loading = false;
	const [size, setSize] = useState(0);
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState();
	const [fileName, setFileName] = useState("");
	const uploadUrlRef = useRef("");
	const metaUrlRef = useRef("");
	const [status, setStatus] = useState(1);
	const [statusOpen, setStatusOpen] = useState(false);
	const nftStorageHttpService = new NftStorageHttpService();

	async function uploadToLighthouse() {
		try {
			loading = true;
			setStatusOpen(true);
			setStatus(1);
			// 1. Upload file to lighthouse
			const response = await uploadFile(file);
			uploadUrlRef.current = `https://files.lighthouse.storage/viewFile/${response.data.Hash}`;

			// 2. Upload JSON to ipfs
			const metaDataUrl = await nftStorageHttpService.pinJSONToIPFS(
				{ title: fileName, description: "Encrypted and secured." },
				uploadUrlRef.current
			);
			metaUrlRef.current = metaDataUrl;
			await new Promise((res, rej) =>
				setTimeout(() => {
					res(true);
				}, 1000)
			);
			setStatus(2);
			writeToContract();
		} catch (error) {
			loading = false;
			console.log(error);
		}
	}

	async function writeToContract() {
		try {
			const contract = new window.web3.eth.Contract(
				StorageJSONInterface.abi,
				STORAGE_CONTRACT_ADDRESS
			);
			const currentAddress = await getWalletAddress();
			const resp = await contract.methods
				.addFile([fileName, uploadUrlRef.current, size], metaUrlRef.current)
				.send({ from: currentAddress })
				.on("transactionHash", function (hash) {
					setStatus(3);
				})
				.on("receipt", async function (receipt) {
					setStatus(4);
				});
			return resp;
		} catch (error) {
			console.log(error);
		}
	}

	async function onFileChange(e) {
		try {
			const f = e.target.files[0];
			if (!f) return;
			setSize(f.size);
			setFileName(f.name);
			setFile(e);
			// const validFile = checkFileType(f.name);
			// if (!validFile) return;
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	}

	useEffect(() => {
		setOpen(isOpen);
	}, [isOpen]);

	return (
		<Dialog open={open}>
			<Status isOpen={statusOpen} newStatus={status} />
			<Box p={2} px={4}>
				<IconButton
					sx={{ position: "absolute", right: 2, top: 8 }}
					onClick={() => {
						if (loading) return;
						setOpen(false);
						onClose();
					}}
				>
					<IoClose />
				</IconButton>
				<Box>
					<h3>Upload File</h3>
				</Box>
				<Box
					display={"flex"}
					alignItems="center"
					flexDirection={"column"}
					justifyContent={"center"}
					my={2}
					width={"30vw"}
				>
					<Box mx={3} mb={2} width="100%">
						<Divider></Divider>
					</Box>
					<Box
						width={"30vw"}
						display={"flex"}
						flexDirection={"column"}
						alignItems={"flex-start"}
					>
						<Box sx={{ mb: "16px" }}>
							<TextField
								type={"text"}
								fullWidth
								placeholder="File Name"
								size="small"
								value={fileName}
								onChange={(e) => {
									setFileName(e.target.value);
								}}
							/>
							<small>Default: Original file name</small>
						</Box>
						{/* <Box sx={{ mb: "16px" }}>
							<TextField
								type={"text"}
								fullWidth
								placeholder="Access Address"
								size="small"
								value={address}
								onChange={(e) => {
									setAddress(e.target.value);
								}}
							/>
							<small>Default: Only your address</small>
						</Box> */}
						<label htmlFor="file-upload">
							<div className="image-picker">
								<div>
									<p>Select File</p>
									<input
										type="file"
										name="Asset"
										className="my-4"
										id="file-upload"
										onChange={onFileChange}
									/>
								</div>
							</div>
						</label>
						<small>{fileName}</small>
						<Box
							sx={{ width: "100%", mt: "24px" }}
							onClick={uploadToLighthouse}
						>
							<div className="upload-button">
								<p>Upload</p>
							</div>
						</Box>
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};
