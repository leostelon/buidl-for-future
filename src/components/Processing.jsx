import { Dialog, Divider, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export const Processing = ({ isOpen, canClose }) => {
	let loading = false;
	const [open, setOpen] = useState(false);

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
					}}
				>
					<IoClose />
				</IconButton>
				<Box>
					<h3>Processing</h3>
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
						<Box p={2} textAlign={"center"}>
							<h4>
								{canClose
									? "Transaction completed, please close the dialog."
									: "Processing transaction, should be completed in a second."}
							</h4>
						</Box>
						{canClose && (
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
