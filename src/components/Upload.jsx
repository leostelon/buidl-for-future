import "./Upload.css";
import { IoClose } from "react-icons/io5";
import React, { useEffect, useState, useRef } from "react";
import { Box, Dialog, Divider, IconButton, TextField } from "@mui/material";
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";
import StorageJSONInterface from "../abi/Storage.json";
import { uploadFile } from "../api/lighthouse";
import { Status } from "./Status";

export const Upload = ({ isOpen, onClose }) => {
	let loading = false;
	const [size, setSize] = useState(0);
	const [open, setOpen] = useState(false);
	const uploadUrlRef = useRef("");
	const [file, setFile] = useState();
	const [fileName, setFileName] = useState("");
	const [status, setStatus] = useState(1);
	const [statusOpen, setStatusOpen] = useState(false);

	const { config } = usePrepareContractWrite({
		address: "0x09DEb799D43b6e0f10344ec2cA7454F8dF9Ab83c",
		abi: StorageJSONInterface.abi,
		functionName: "addFile",
		args: [[fileName, uploadUrlRef.current, size]],
	});

	const { data, write } = useContractWrite(config);

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	async function uploadToLighthouse() {
		try {
			setStatusOpen(true);
			const response = await uploadFile(file);
			setStatus(1);
			uploadUrlRef.current = `https://files.lighthouse.storage/viewFile/${response.data.Hash}`;
			await new Promise((res, rej) =>
				setTimeout(() => {
					res(true);
				}, 1000)
			);
			setStatus(2);
			write?.();
		} catch (error) {
			console.log(error);
		}
	}

	async function onFileChange(e) {
		try {
			const f = e.target.files[0];
			if (!f) return;
			console.log(f);
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
			<Status
				isOpen={statusOpen}
				newStatus={isLoading ? 3 : isSuccess ? 4 : status}
			/>
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
					width={"40vw"}
				>
					<Box mx={3} mb={2} width="100%">
						<Divider></Divider>
					</Box>
					<Box
						width={"40vw"}
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
