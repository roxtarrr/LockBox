import { Contract, Config } from "solana-web3.js";
import { Connection } from "solana-web3.js/dist/interfaces/connection";



export class LockBox extends Contract {
  constructor(publicKey: string, connection: Connection) {
    super(publicKey);
    this.owner = publicKey;
    this.connection = connection;
  }

  async lock(unlockTime: number, releasePercentage: number, amount: number): Promise<void> {
    assert(await this.isSigner(this.owner), "Only the owner can lock the funds.");
    assert(releasePercentage <= 100, "The release percentage must be less than or equal to 100.");

    this.unlockTime = unlockTime;
    this.releasePercentage = releasePercentage;
    this.lockedFunds += amount;


    await this.connection.updateContract(this.publicKey, this.encode());
  }

  // The release function can only be called after the unlock time has passed. It releases
  // the specified percentage of the locked funds.
  async release(): Promise<void> {
    assert(await this.connection.getTimestamp() >= this.unlockTime, "The unlock time has not yet passed.");

    const releaseAmount = (this.lockedFunds * this.releasePercentage) / 100;
    const remainingFunds = this.lockedFunds - releaseAmount;

    await this.transfer(releaseAmount);


    this.lockedFunds = remainingFunds;


