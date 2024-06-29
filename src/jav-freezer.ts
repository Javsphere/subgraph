import {
    ClaimUserReward,
    Deposit, Withdraw
} from "../generated/JavFreezer/JavFreezer"
import {
    FreezerLog,
} from "../generated/schema"
import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";

export function handleClaim(event: ClaimUserReward): void {
    let entity = new FreezerLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

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

export function handleStake(event: Deposit): void {
    let entity = new FreezerLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

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


export function handleUnstake(event: Withdraw): void {
    let entity = new FreezerLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

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

function weiToEth(wei: BigInt): BigDecimal {
    let weiAsBigDecimal = wei.toBigDecimal();
    let eth = weiAsBigDecimal.div(BigDecimal.fromString("1000000000000000000"));
    return eth;
}

function getLockType(type: BigInt): string {
    if (type === BigInt.fromString("5")) {
        return "VESTING_FREEZER_10";
    } else if (type === BigInt.fromString('6')) {
        return "VESTING_FREEZER_20";
    } else if (type === BigInt.fromString('0')) {
        return "ONE_MONTH";
    } else if (type === BigInt.fromString('1')) {
        return "THREE_MONTH";
    } else if (type === BigInt.fromString('2')) {
        return "SIX_MONTH";
    } else if (type === BigInt.fromString('3')) {
        return "TWELVE_MONTH";
    } else if (type === BigInt.fromString('4')) {
        return "TWENTY_FOUR_MONTH";
    } else {
        throw "UNKNOWN";
    }
}
