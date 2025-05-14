import {Address, BigDecimal, BigInt, Bytes} from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000") as Bytes;
export const TOTAL_STATISTIC_ID = "0x0000000000000000000000000000000000000001";

export const ZERO_BI = BigInt.zero();
export const ONE_BI = BigInt.fromI32(1);

const SECONDS_IN_DAY = BigInt.fromI32(86400);

export function weiToEth(wei: BigInt): BigDecimal {
    let weiAsBigDecimal = wei.toBigDecimal();
    let eth = weiAsBigDecimal.div(BigDecimal.fromString("1000000000000000000"));
    return eth;
}

function toBigInt(integer: i32): BigInt {
    return BigInt.fromI32(integer);
}

class DayWeekMonthYear {
    day: string;
    week: string;
    month: string;
    year: string;

    constructor(day: BigInt, week: BigInt, month: BigInt, year: BigInt) {
        this.day = day.toString().padStart(2, "0");
        this.week = week.toString().padStart(2, "0");
        this.month = month.toString().padStart(2, "0");
        this.year = year.toString();
    }
}

function getWeekNumber(day: BigInt, month: BigInt, year: BigInt): BigInt {
    // Function to check if a year is a leap year
    function isLeapYear(year: BigInt): boolean {
        return (
            (year.mod(toBigInt(4)).equals(toBigInt(0)) &&
                year.mod(toBigInt(100)).notEqual(toBigInt(0))) ||
            year.mod(toBigInt(400)).equals(toBigInt(0))
        );
    }

    // Days in each month
    const monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Calculate the day of the year as a BigInt
    let dayOfYear = toBigInt(0);
    for (let i = 0; i < month.toI32() - 1; i++) {
        dayOfYear = dayOfYear.plus(toBigInt(monthDays[i])); // Add days of previous months
    }
    dayOfYear = dayOfYear.plus(day); // Add the days of the current month

    // Calculate the week number (1-indexed) using BigInt
    const weekNumber = dayOfYear.mod(toBigInt(7)).equals(toBigInt(0))
        ? dayOfYear.div(toBigInt(7)) // If it’s exactly divisible, use that
        : dayOfYear.div(toBigInt(7)).plus(toBigInt(1)); // Otherwise, round up

    return weekNumber < toBigInt(53) ? weekNumber : weekNumber.minus(toBigInt(52));
}

export function dayWeekMonthYearFromTimestamp(timestamp: BigInt): DayWeekMonthYear {
    let daysSinceEpochStart = timestamp.div(SECONDS_IN_DAY);
    daysSinceEpochStart = daysSinceEpochStart.plus(toBigInt(719468));

    let era: BigInt = (
        daysSinceEpochStart >= ZERO_BI
            ? daysSinceEpochStart
            : daysSinceEpochStart.minus(toBigInt(146096))
    ).div(toBigInt(146097));

    let dayOfEra: BigInt = daysSinceEpochStart.minus(era.times(toBigInt(146097))); // [0, 146096]

    let yearOfEra: BigInt = dayOfEra
        .minus(dayOfEra.div(toBigInt(1460)))
        .plus(dayOfEra.div(toBigInt(36524)))
        .minus(dayOfEra.div(toBigInt(146096)))
        .div(toBigInt(365)); // [0, 399]

    let year: BigInt = yearOfEra.plus(era.times(toBigInt(400)));

    let dayOfYear: BigInt = dayOfEra.minus(
        toBigInt(365)
            .times(yearOfEra)
            .plus(yearOfEra.div(toBigInt(4)))
            .minus(yearOfEra.div(toBigInt(100)))
    ); // [0, 365]

    let monthZeroIndexed = toBigInt(5).times(dayOfYear).plus(toBigInt(2)).div(toBigInt(153)); // [0, 11]

    let day = dayOfYear
        .minus(
            toBigInt(153)
                .times(monthZeroIndexed)
                .plus(toBigInt(2))
                .div(toBigInt(5))
                .plus(toBigInt(1))
        )
        .plus(toBigInt(2)); // [1, 31]

    let month = monthZeroIndexed.plus(monthZeroIndexed < toBigInt(10) ? toBigInt(3) : toBigInt(-9)); // [1, 12]

    year = month <= toBigInt(2) ? year.plus(ONE_BI) : year;

    let week = getWeekNumber(day, month, year);

    return new DayWeekMonthYear(day, week, month, year);
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
