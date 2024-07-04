import {
    OrderExecuted,
} from "../generated/JavMarket/JavMarket"
import {
    JavMarketLog,
} from "../generated/schema"
import {weiToEth} from "./util";

export function handleTrade(event: OrderExecuted): void {
    let entity = new JavMarketLog(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.fromAmount = event.params._amount
    entity.fromAmountEth = weiToEth(event.params._amount)
    entity.receiveAmount = event.params._receiveAmount
    entity.receiveAmountEth = weiToEth(event.params._receiveAmount)
    entity.tradeId = event.params._id
    entity.fromToken = event.params._isBuy ? "DUSD" : event.params._tokenName
    entity.toToken = event.params._isBuy ? event.params._tokenName: "DUSD"
    entity.tokenId = event.params._tokenId
    entity.address = event.params._address
    entity.buyingType = event.params._buyingType === 1 ? "INSTANT": "LIMIT"
    entity.type = event.params._isBuy ? "BUY": "SELL"
    entity.status = event.params._status === 1 ? "COMPLETE": "PENDING"
    entity.price = event.params._price
    entity.priceEth = weiToEth(event.params._price)
    entity.tx = event.transaction.hash
    entity.block = event.block.number
    entity.date = event.block.timestamp
    entity.save()
}

