import "./Status.css";
import { Dialog, Divider, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { MdDownloading } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";

export const Status = ({ isOpen, newStatus }) => {
	let loading = false;
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState(0);

	useEffect(() => {
		setOpen(isOpen);
		setStatus(newStatus);
	}, [isOpen, newStatus]);

	return (
		<Dialog open={open}>
			<Box p={2} px={4}>
				<IconButton
					sx={{ position: "absolute", right: 2, top: 8 }}
					onClick={() => {
						if (loading) return;
						window.location.reload();
					}}
				>
					<IoClose />
				</IconButton>
				<Box>
					<h3>Uploading...</h3>
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
						<div className="status">
							{status > 1 ? (
								<AiOutlineCheckCircle color="green" size={28} />
							) : status === 1 ? (
								<MdDownloading size={28} />
							) : (
								<AiOutlineClockCircle size={28} />
							)}
							<h4>Encrypting and uploading to Filecoin💙</h4>
						</div>
						<div className="status">
							{status > 2 ? (
								<AiOutlineCheckCircle color="green" size={28} />
							) : status === 2 ? (
								<MdDownloading size={28} />
							) : (
								<AiOutlineClockCircle size={28} />
							)}
							<h4>Approve transaction⛓️</h4>
						</div>
						<div className="status">
							{status > 3 ? (
								<AiOutlineCheckCircle color="green" size={28} />
							) : status === 3 ? (
								<MdDownloading size={28} />
							) : (
								<AiOutlineClockCircle size={28} />
							)}
							<h4>Writing to Shardeum🔼</h4>
						</div>
						{status === 4 && (
							<div
								className="status"
								style={{
									backgroundColor: "black",
									color: "white",
									padding: "8px",
									width: "100%",
									display: "flex",
									alignitems: "center",
									justifyContent: "center",
									borderRadius: "4px",
									cursor: "pointer",
								}}
								onClick={() => {
									if (loading) return;
									window.location.reload();
								}}
							>
								<p>Close</p>
							</div>
						)}
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};
