# LockBox
Solana smart contract to lock funds and release a % in certain time

 
This contract allows the owner to specify an unlock time and a percentage of the funds to be released at that time, and also allows them to lock funds in the contract. It also provides a release function that can be called after the unlock time has passed to release the specified percentage of the locked funds, and a cancel function that allows the owner to cancel the contract and retrieve all remaining locked funds before the unlock time has passed. 
