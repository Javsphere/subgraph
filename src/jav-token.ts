import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/JavToken/JavToken";
import { JavTokenBalance, JavTokenLog } from "../generated/schema";
import { weiToEth } from "./util";

export function handleTransfer(event: Transfer): void {
  let entity = new JavTokenLog(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.amount = event.params.value;
  entity.amountEth = weiToEth(event.params.value);
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tx = event.transaction.hash;
  entity.block = event.block.number;
  entity.date = event.block.timestamp;
  entity.save();

  let balanceFrom = JavTokenBalance.load(event.params.from);
  if (balanceFrom == null) {
    balanceFrom = new JavTokenBalance(event.params.from);
    balanceFrom.balance = BigInt.zero();
    balanceFrom.balanceEth = BigDecimal.zero();
  }

  balanceFrom.balance = balanceFrom.balance.minus(event.params.value);
  balanceFrom.balanceEth = weiToEth(balanceFrom.balance);
  balanceFrom.save();

  let balanceTo = JavTokenBalance.load(event.params.to);
  if (balanceTo == null) {
    balanceTo = new JavTokenBalance(event.params.to);
    balanceTo.balance = BigInt.zero();
    balanceTo.balanceEth = BigDecimal.zero();
  }

  balanceTo.balance = balanceTo.balance.plus(event.params.value);
  balanceTo.balanceEth = weiToEth(balanceTo.balance);
  balanceTo.save();
}
