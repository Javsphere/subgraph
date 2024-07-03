import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  Claim,
  JavStakeX,
  Stake,
  Unstake,
} from "../generated/JavStakeX/JavStakeX";
import { JavTokenBalance, StakeInfo, StakeLog } from "../generated/schema";
import { getPoolId, weiToEth } from "./util";

export function handleClaim(event: Claim): void {
  let entity = new StakeLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.amount = event.params._amount;
  entity.amountEth = weiToEth(event.params._amount);
  entity.address = event.params._user;
  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;

  entity.type = "CLAIM";
  entity.save();

  let pid = getPoolId(event.params._token);
  let stakeInfo = StakeInfo.load(event.params._user.concatI32(pid.toI32()));

  if (stakeInfo) {
    stakeInfo.claimedAmount = stakeInfo.claimedAmount.plus(
      event.params._amount
    );
    stakeInfo.claimedAmountEth = weiToEth(stakeInfo.claimedAmount);
    stakeInfo.save();
  }
}

export function handleStake(event: Stake): void {
  let entity = new StakeLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.amount = event.params._amount;
  entity.amountEth = weiToEth(event.params._amount);
  entity.address = event.params._address;
  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;

  entity.type = "STAKE";
  entity.save();

  let stakeInfo = StakeInfo.load(
    event.params._address.concatI32(event.params._pid.toI32())
  );

  if (stakeInfo == null) {
    stakeInfo = new StakeInfo(
      event.params._address.concatI32(event.params._pid.toI32())
    );
    stakeInfo.pool = event.params._pid;
    stakeInfo.address = event.params._address;
    stakeInfo.claimedAmount = BigInt.zero();
    stakeInfo.claimedAmountEth = BigDecimal.zero();
    stakeInfo.totalStake = BigInt.zero();
    stakeInfo.totalStakeEth = BigDecimal.zero();

    let tokenBalance = JavTokenBalance.load(event.params._address);
    if (tokenBalance) {
      stakeInfo.freeTokenBalance = tokenBalance.id;
    }
  }

  stakeInfo.totalStake = stakeInfo.totalStake.plus(event.params._amount);
  stakeInfo.totalStakeEth = weiToEth(stakeInfo.totalStake);

  stakeInfo.save();
}

export function handleUnstake(event: Unstake): void {
  let entity = new StakeLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.amount = event.params._amount;
  entity.amountEth = weiToEth(event.params._amount);
  entity.address = event.params._address;
  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;

  entity.type = "UNSTAKE";
  entity.save();

  let stakeInfo = StakeInfo.load(
    event.params._address.concatI32(event.params._pid.toI32())
  );
  if (stakeInfo) {
    stakeInfo.totalStake = stakeInfo.totalStake.minus(event.params._amount);
    stakeInfo.totalStakeEth = weiToEth(stakeInfo.totalStake);
    stakeInfo.save();
  }
}
