// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract DomainMinting {
    struct Identity {
        string username;
        address[] wallets;
        uint points;
    }

    mapping(string => Identity) private identities;
    mapping(address => string) public walletToUsername;
    mapping(string => bool) public domainExists;

    event DomainMinted(
        string indexed domain,
        address indexed owner,
        address[] wallets,
        uint points
    );

    function mintDomain(string memory domain) public {
        require(!domainExists[domain], "Domain already exists");

        address[] memory emptyArray;
        identities[domain] = Identity({
            username: domain,
            wallets: emptyArray,
            points: 0
        });

        domainExists[domain] = true;
        addWalletToDomain(domain, msg.sender);

        emit DomainMinted(
            domain,
            msg.sender,
            identities[domain].wallets,
            identities[domain].points
        );
    }

    function addWalletToDomain(string memory domain, address wallet) public {
        require(domainExists[domain], "Domain does not exist");
        for (uint i = 0; i < identities[domain].wallets.length; i++) {
            if (identities[domain].wallets[i] == wallet) {
                revert("Wallet Already Added");
            }
        }

        identities[domain].wallets.push(wallet);
        identities[domain].points += 10;
        walletToUsername[wallet] = domain;
    }

    function getWalletsByDomain(
        string memory domain
    ) public view returns (address[] memory) {
        require(domainExists[domain], "Domain does not exist");
        return identities[domain].wallets;
    }

    function getDomainByWallet(
        address wallet
    ) public view returns (string memory) {
        return walletToUsername[wallet];
    }

    function getPointsByDomain(
        string memory domain
    ) public view returns (uint) {
        require(domainExists[domain], "Domain does not exist");
        return identities[domain].points;
    }
}
