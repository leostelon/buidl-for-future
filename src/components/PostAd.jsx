import "./Upload.css";
import { IoClose } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { Box, Dialog, Divider, IconButton, TextField } from "@mui/material";
import { createPublicPostStream, dataverseGetDid } from "../utils/dataverse";
import Web3 from "web3";

export const PostAd = ({ isOpen, onClose }) => {
	let loading = false;
	const [open, setOpen] = useState(false);
	const [fileName, setFileName] = useState("");
	const [description, setDescription] = useState("");
	const [statusOpen, setStatusOpen] = useState(false);

	async function postOnDataverse() {
		try {
			loading = true;
			setStatusOpen(true);

			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: Web3.utils.toHex(137) }],
			});

			const did = await dataverseGetDid();
			const post = {
				title: fileName,
				description,
			};

			await createPublicPostStream({
				did,
				post,
			});
			setOpen(false);
			onClose();
			alert("Posted successfully🥳");
		} catch (error) {
			console.log(error);
			setStatusOpen(false);
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
					<h3>Add a Post</h3>
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
						<h4>Title</h4>
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
						</Box>
						<h4>Description</h4>
						<Box sx={{ mb: "16px" }}>
							<TextField
								type={"text"}
								fullWidth
								placeholder="File Name"
								size="small"
								value={description}
								onChange={(e) => {
									setDescription(e.target.value);
								}}
							/>
						</Box>
						<Box sx={{ width: "100%", mt: "24px" }} onClick={postOnDataverse}>
							<div className="upload-button">
								<p>{statusOpen ? "Loading..." : "Post"}</p>
							</div>
						</Box>
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};
