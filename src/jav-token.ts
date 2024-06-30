import {
    Transfer,
} from "../generated/JavToken/JavToken"
import {
    JavTokenLog,
} from "../generated/schema"
import {weiToEth} from "./util";

export function handleTransfer(event: Transfer): void {
    let entity = new JavTokenLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.amount = event.params.value
    entity.amountEth = weiToEth(event.params.value)
    entity.from = event.params.from
    entity.to = event.params.to
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp
    entity.save()
}

