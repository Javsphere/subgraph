import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";

export function weiToEth(wei: BigInt): BigDecimal {
    let weiAsBigDecimal = wei.toBigDecimal();
    let eth = weiAsBigDecimal.div(BigDecimal.fromString("1000000000000000000"));
    return eth;
}

export function getLockType(type: BigInt): string {
    if (type.equals(BigInt.fromString("5"))) {
        return "VESTING_FREEZER_10";
    } else if (type.equals(BigInt.fromString('6'))) {
        return "VESTING_FREEZER_20";
    } else if (type.equals(BigInt.fromString('0'))) {
        return "ONE_MONTH";
    } else if (type.equals(BigInt.fromString('1'))) {
        return "THREE_MONTH";
    } else if (type.equals(BigInt.fromString('2'))) {
        return "SIX_MONTH";
    } else if (type.equals(BigInt.fromString('3'))) {
        return "TWELVE_MONTH";
    } else if (type.equals(BigInt.fromString('4'))) {
        return "TWENTY_FOUR_MONTH";
    } else {
        return "UNKNOWN";
    }
}
