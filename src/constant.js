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

// export const STORAGE_CONTRACT_ADDRESS = "0x40CC626e331dFA77e294302A3C4bc7190D1AaCA3";
export const STORAGE_CONTRACT_ADDRESS =
	"0x5EFE958DCEf7eF48450D6370dcfEb7Beb823CE5E";
