import {
    ClaimUserReward,
    Deposit, Withdraw
} from "../generated/JavFreezer/JavFreezer"
import {
    FreezerLog,
} from "../generated/schema"
import {getLockType, weiToEth} from "./util";

export function handleClaimUserReward(event: ClaimUserReward): void {
    let entity = new FreezerLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.pid = event.params.pid
    entity.amount = event.params.amount
    entity.amountEth = weiToEth(event.params.amount)
    entity.address = event.params.user
    entity.lockType = getLockType(event.params.period)
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp

    entity.type = "CLAIM"
    entity.save()
}

export function handleDeposit(event: Deposit): void {
    let entity = new FreezerLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.pid = event.params.pid
    entity.amount = event.params.amount
    entity.amountEth = weiToEth(event.params.amount)
    entity.address = event.params.user
    entity.lockType = getLockType(event.params.period)
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp

    entity.type = "DEPOSIT"
    entity.save()
}


export function handleWithdraw(event: Withdraw): void {
    let entity = new FreezerLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.pid = event.params.pid
    entity.amount = event.params.amount
    entity.amountEth = weiToEth(event.params.amount)
    entity.address = event.params.user
    entity.lockType = getLockType(event.params.period)
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp

    entity.type = "WITHDRAW"
    entity.save()
}


