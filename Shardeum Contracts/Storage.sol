// SPDX-License-Identifier: MITX
pragma solidity 0.8.11;

import "./ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Storage is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter public _assetCount;
    Counters.Counter public _salesCount;
    constructor() ERC721("Build-4-Future", "BFF") ERC721Enumerable() {}

    struct File {
        string name;
        string url;
        uint256 size;
    }

    struct Sale {
        uint256 id;
        address seller;
        address contractAddress;
        uint256 tokenId;
        uint256 price;
        bool sold;
    }

    event EventSale (
        address indexed buyer,
        address indexed contractAddress,
        uint256 indexed tokenId,
        Sale sale
    );

    mapping(address => File[]) private files;
    mapping(uint256 => Sale) public sales;
    
    function addFile(File memory _params, string memory metadataUrl) public {
        File[] storage f = files[msg.sender];
        File memory file = File({
            name: _params.name,
            url: _params.url,
            size: _params.size
        });

        uint currentAssetId  = _assetCount.current();
        _mint(msg.sender, currentAssetId);
        _setTokenURI(currentAssetId, metadataUrl);

        f.push(file);
    }

    function setBuyPrice(address _contractAddress, uint256 _tokenId, uint256 _price) external {
        _salesCount.increment();
        uint256 currentSaleId = _salesCount.current();

        Sale memory sale = Sale(currentSaleId, msg.sender, _contractAddress, _tokenId, _price, false);
        sales[currentSaleId] = sale;

        IERC721(_contractAddress).transferFrom(msg.sender, address(this), _tokenId);
    }

    function cancelBuyPrice(uint256 _saleId) external {
        Sale storage sale = sales[_saleId];
        require(sale.sold, "Sale has been bought or canceled already!");
        require(sale.seller == msg.sender, "Only the seller can cancel the sale.");

        sale.sold = true;
    }

    function buySale(uint256 _saleId) external {
        Sale storage sale = sales[_saleId];
        require(sale.sold, "Sale has been bought or canceled already!");

        (bool sent, ) = sale.seller.call{value:sale.price}("");
        require(sent, "Market: Sale amount not returned to the seller!");

        IERC721(sale.contractAddress).transferFrom(address(this), msg.sender, sale.tokenId);

        emit EventSale(
            sale.seller,
            sale.contractAddress,
            sale.tokenId,
            sale
        );
    }

    // Call Functions
    function getFiles() view public returns (File[] memory fileList) {
        uint256 totalLength = files[msg.sender].length;

        fileList = new File[](totalLength);

        for(uint256 i = 0; i < totalLength; i++) {
            fileList[totalLength - 1 - i] = files[msg.sender][i];
        }

        return fileList;
    }

    // Overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) 
        internal
        override(ERC721, ERC721Enumerable)
    {
        return super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}

// [f1,u1,12]
// [f2,u2,27]