import "./Welcome.css";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import PlaneScult from "../assets/planesculpt.png";
import { IoChevronForwardOutline } from "react-icons/io5";

export const WelcomeScreen = ({ onCloseWelcome }) => {
	useEffect(() => {
		localStorage.setItem("welcome", true);
	}, []);

	return (
		<Box
			sx={{
				position: "relative",
				height: "100vh",
				width: "100vw",
				maxWidth: "100vw",
				overflow: "hidden",
			}}
		>
			<p className="emoji-design unicorn">🦄</p>
			<p className="emoji-design rocket">🔐</p>
			<p className="emoji-design heart">💖</p>
			<Box
				p={3}
				sx={{ display: "flex", flexDirection: "column", height: "100%" }}
			>
				<Box position={"relative"} className="content-container">
					{/* <Box className="gradient-container"></Box> */}
					<Box className="main-title">
						<p>Encrypt</p>
						<p>
							<span className="nft-title">IMPORTANT FILES</span>
						</p>
						<p>on IPFS💙</p>
					</Box>
					<Box className="welcome-button-container">
						<Box className="continue-button" onClick={onCloseWelcome}>
							<p>Continue</p>
							<Box pr={1}></Box>
							<IoChevronForwardOutline />
						</Box>
						<p className="continue-button-subtitle">
							*Built in a hurry, things might brake😄
						</p>
					</Box>
				</Box>
			</Box>

			{/* Image */}
			<Box
				sx={{
					position: "absolute",
					bottom: { xs: -10, md: -120 },
					width: "100vw",
				}}
				className="planesculpt"
			>
				<img
					style={{
						// width: "110vw",
						width: "100%",
					}}
					src={PlaneScult}
					alt="planescultp"
				/>
			</Box>
		</Box>
	);
};
