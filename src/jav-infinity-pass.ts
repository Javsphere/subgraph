import { Transfer } from "../generated/InfinityPass/InfinityPass";
import {JavInfinityPassLog} from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  let entity = new JavInfinityPassLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.address = event.params.to;
  entity.tokenId = event.params.tokenId;
  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;
  entity.save();

}
