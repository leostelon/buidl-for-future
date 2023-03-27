// SPDX-License-Identifier: MITX
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenSingle is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter public _assetCount;

    constructor() ERC721("Buidl-4-Future", "BFF") ERC721Enumerable() {}

    function mint(string memory _tokeURI) external returns(uint){
        _assetCount.increment();
        uint currentAssetId  = _assetCount.current();

        _mint(msg.sender, currentAssetId);
        _setTokenURI(currentAssetId, _tokeURI);

        return currentAssetId;
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }

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