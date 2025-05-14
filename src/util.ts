import {Address, BigDecimal, BigInt, Bytes} from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000") as Bytes;
export const TOTAL_STATISTIC_ID = Bytes.fromHexString("0x0000000000000000000000000000000000000001") as Bytes;

export function weiToEth(wei: BigInt): BigDecimal {
    let weiAsBigDecimal = wei.toBigDecimal();
    let eth = weiAsBigDecimal.div(BigDecimal.fromString("1000000000000000000"));
    return eth;
}

export function getLockType(type: BigInt): string {
    if (type.equals(BigInt.fromString("5"))) {
        return "VESTING_FREEZER_10";
    } else if (type.equals(BigInt.fromString("6"))) {
        return "VESTING_FREEZER_20";
    } else if (type.equals(BigInt.fromString("0"))) {
        return "ONE_MONTH";
    } else if (type.equals(BigInt.fromString("1"))) {
        return "THREE_MONTH";
    } else if (type.equals(BigInt.fromString("2"))) {
        return "SIX_MONTH";
    } else if (type.equals(BigInt.fromString("3"))) {
        return "TWELVE_MONTH";
    } else if (type.equals(BigInt.fromString("4"))) {
        return "TWENTY_FOUR_MONTH";
    } else {
        return "UNKNOWN";
    }
}

export function getPoolId(token: Address): BigInt {
    if (
        ["0xedc68c4c54228d273ed50fc450e253f685a2c6b9", "0x83030ec707812af7e71042fa17153e7fc1822573"].includes(token.toString().toLowerCase())
    ) {
        return new BigInt(0);
    } else if (
        ["0xca5aa6a6c62253aab4b7b8340d17625605d0bbff", "0x8fdc017195ba2d22186e4b442497f5b19f870a64"].includes(token.toString().toLowerCase())
    ) {
        return new BigInt(1);
    }

    return new BigInt(0);
}
