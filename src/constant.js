export const shardeumChain = {
	id: 8082,
	name: "Shardeum",
	network: "shardeum",
	nativeCurrency: {
		decimals: 18,
		name: "Shard",
		symbol: "SHM",
	},
	rpcUrls: {
		default: {
			http: ["https://sphinx.shardeum.org/"],
		},
		public: {
			http: [],
		},
	},
	blockExplorers: {
		default: {
			name: "Shardeum Explorer",
			url: "https://explorer-sphinx.shardeum.org/",
		},
	},
	testnet: false,
};

export const mumbaiChain = {
	id: 80001,
	name: "Polygon Mumbai",
	network: "maticmum",
	nativeCurrency: {
		decimals: 18,
		name: "MATIC",
		symbol: "SHM",
	},
	rpcUrls: {
		default: {
			http: [
				"https://polygon-mumbai.g.alchemy.com/v2/fI2Q4tIRzviaO4Kw6vsBHvr7rW5cp_s_",
			],
		},
		public: {
			http: [],
		},
	},
	blockExplorers: {
		default: {
			name: "PolygonScan",
			url: "https://mumbai.polygonscan.com",
		},
	},
	testnet: false,
};

// export const STORAGE_CONTRACT_ADDRESS =
// 	"0xA0837f446b933136b3B682ddf21274D90DF2D82A";
export const STORAGE_CONTRACT_ADDRESS =
	"0xA715c69b9309E42DacECcc448f2cAe8dB0E91024";
