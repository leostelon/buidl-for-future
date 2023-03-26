import "./Upload.css";
import { IoClose } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { Box, Dialog, Divider, IconButton, TextField } from "@mui/material";
import { NftStorageHttpService } from "../api/nftStorage";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import StorageJSONInterface from "../abi/Storage.json";

export const Upload = ({ isOpen, onClose }) => {
	let loading = false;
	const [size, setSize] = useState(0);
	const [open, setOpen] = useState(false);
	const [uploadUrl, setUploadUrl] = useState("");
	const [file, setFile] = useState();
	const [fileName, setFileName] = useState("");
	const [address, setAddress] = useState("");
	const nftStorageHttpService = new NftStorageHttpService();

	const { config } = usePrepareContractWrite({
		address: "0x09DEb799D43b6e0f10344ec2cA7454F8dF9Ab83c",
		abi: StorageJSONInterface.abi,
		functionName: "addFile",
		args: [[fileName, uploadUrl, size]],
	});

	const { write } = useContractWrite(config);

	async function uploadToIpfs() {
		if (loading) return;
		try {
			loading = true;

			// 1. Upload file to ipfs
			const assetUrl = await nftStorageHttpService.pinFileToIPFS(file);

			// 2. Upload data to ipfs
			const metaDataUrl = await nftStorageHttpService.pinJSONToIPFS(
				{ fileName },
				assetUrl
			);
			setUploadUrl(metaDataUrl);
			await new Promise((res, rej) =>
				setTimeout(() => {
					res(true);
				}, 500)
			);
			// 3. After file is uploaded to IPFS, pass the URL to mint it on chain
			write?.();

			// Redirect to home page
			// navigate("/", { replace: true });
		} catch (error) {
			console.log(error);
			loading = false;
		}
	}

	async function onFileChange(e) {
		try {
			const f = e.target.files[0];
			if (!f) return;
			console.log(f);
			setSize(f.size);
			setFileName(f.name);
			setFile(f);
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
								value={address}
								onChange={(e) => {
									setAddress(e.target.value);
								}}
							/>
							<small>Default: Original file name</small>
						</Box>
						<Box sx={{ mb: "16px" }}>
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
						</Box>
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
						<Box sx={{ width: "100%", mt: "24px" }} onClick={uploadToIpfs}>
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
