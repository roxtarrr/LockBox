use solana_sdk::{
    account::Account,
    account_utils::State,
    pubkey::Pubkey,
    sysvar,
};
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::transaction::{Transaction, TransactionError};



#[derive(Debug, Default, Clone)]
pub struct LockBox {
    
    owner: Pubkey,

    
    unlock_time: u64,

    
    release_percentage: u64,

   
    locked_funds: u64,
}

impl LockBox {
    
    pub fn lock(&mut self, owner: &Pubkey, unlock_time: u64, release_percentage: u64, amount: u64) {
        assert_eq!(self.owner, *owner, "Only the owner can lock the funds.");
        assert!(release_percentage <= 100, "The release percentage must be less than or equal to 100.");

        self.unlock_time = unlock_time;
        self.release_percentage = release_percentage;
        self.locked_funds += amount;
    }

    
    pub fn release(&mut self, caller: &Pubkey) {
        assert!(self.unlock_time <= solana_sdk::timestamp::get(), "The unlock time has not yet passed.");

        let release_amount = (self.locked_funds * self.release_percentage) / 100;
        let remaining_funds = self.locked_funds - release_amount;

        
        let mut caller_account = Account::default();
        caller_account.balance = release_amount;
        solana_sdk::transfer(&caller_account, caller).unwrap();

       
        self.locked_funds = remaining_funds;
    }
