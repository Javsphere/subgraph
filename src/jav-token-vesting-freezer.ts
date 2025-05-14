import { weiToEth} from "./util";
import { updateJavInfo, JavInfoImpactType } from "./common";
import {JavVestingLog, JavVestingReleaseLog} from "../generated/schema";
import {Released, VestingScheduleAdded} from "../generated/TokenVestingFreezer/TokenVestingFreezer";
import {BigInt} from "@graphprotocol/graph-ts";


export function handleRelease(event: Released): void {
  let entity = new JavVestingReleaseLog(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.amount = event.params.amount;
  entity.amountEth = weiToEth(event.params.amount);
  entity.address = event.params.to;
  entity.vestingScheduleId = event.params.vestingScheduleId

  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;

  entity.save();

    updateJavInfo(
      event.block.timestamp,
      weiToEth(event.params.amount),
      JavInfoImpactType.CLAIM
    );
}

export function handleVesting(event: VestingScheduleAdded): void {
  let entity = new JavVestingLog(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.amount = event.params.amountTotal;
  entity.amountEth = weiToEth(event.params.amountTotal);

  entity.address = event.params.beneficiary;
  entity.cliff  = event.params.cliff;
  entity.start  = event.params.start;
  entity.duration  = event.params.duration;
  entity.slicePeriodSeconds  = event.params.slicePeriodSeconds;
  entity.revocable  = event.params.revocable;
  entity.vestingType = BigInt.fromI32(event.params.vestingType);

  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;


  entity.save();
}

