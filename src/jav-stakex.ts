import {
    Claim,
    Stake, Unstake
} from "../generated/JavStakeX/JavStakeX"
import {
    StakeLog,
} from "../generated/schema"
import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";

export function handleClaim(event: Claim): void {
    let entity = new StakeLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.amount = event.params._amount
    entity.amountEth = weiToEth(event.params._amount)
    entity.address = event.params._user
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp

    entity.type = "CLAIM"
    entity.save()
}

export function handleStake(event: Stake): void {
    let entity = new StakeLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.amount = event.params._amount
    entity.amountEth = weiToEth(event.params._amount)
    entity.address = event.params._address
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp

    entity.type = "STAKE"
    entity.save()
}


export function handleUnstake(event: Unstake): void {
    let entity = new StakeLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.amount = event.params._amount
    entity.amountEth = weiToEth(event.params._amount)
    entity.address = event.params._address
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp

    entity.type = "UNSTAKE"
    entity.save()
}

function weiToEth(wei: BigInt): BigDecimal {
    let weiAsBigDecimal = wei.toBigDecimal();
    let eth = weiAsBigDecimal.div(BigDecimal.fromString("1000000000000000000"));
    return eth;
}
