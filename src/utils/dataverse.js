import {
	Apps,
	CRYPTO_WALLET_TYPE,
	Extension,
	FileType,
	METAMASK,
	ModelNames,
	RuntimeConnector,
} from "@dataverse/runtime-connector";

export const runtimeConnector = new RuntimeConnector(Extension);
export const appName = Apps.Playground;
export const modelName = ModelNames.post;

export const createPublicPostStream = async ({ did, post }) => {
	// const res = await runtimeConnector.createFolder({
	// 	did,
	// 	appName,
	// 	folderType: FolderType.Private,
	// 	folderName: "Private",
	// });
	// const folderId = res.newFolder.folderId;
	const folderId =
		"kjzl6kcym7w8y9ea99e515l37aodo0vaiczz75b07shrgi516ohw3hdonm75bh9";
	const content = JSON.stringify(post);

	const streamObject = await runtimeConnector.createStream({
		did,
		appName,
		modelName,
		folderId,
		streamContent: {
			appVersion: "0.0.2",
			content,
		},
		fileType: FileType.Public,
	});
	console.log(streamObject);

	// return streamObject;
};

export const loadMyPostStreams = async () => {
	try {
		const streams = await runtimeConnector.loadStreamsByModel({
			appName,
			modelName,
		});
		console.log(streams);
		return streams;
	} catch (error) {
		console.log(error);
	}
};

export const dataverseGetDid = async () => {
	try {
		const did = await runtimeConnector.connectIdentity({
			wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
			appName,
		});
		return did;
	} catch (error) {
		console.log(error);
	}
};
