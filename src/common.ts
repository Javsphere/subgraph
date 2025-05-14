import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { JavInfo } from "../generated/schema";

import { TOTAL_STATISTIC_ID, dayWeekMonthYearFromTimestamp } from "./util";

export enum JavInfoImpactType {
  BURN,
  CLAIM,
}

export function updateJavInfo(
  timestamp: BigInt,
  amount: BigDecimal,
  impactType: JavInfoImpactType
): void {
  const date = dayWeekMonthYearFromTimestamp(timestamp);
  const dayID = `${date.year}-${date.month}-${date.day}`;
  const monthID = `${date.year}-${date.month}`;
  const yearID = `${date.year}`;

  let javInfoDaily = loadOrCreateJavInfo(dayID);
  let javInfoMonthly = loadOrCreateJavInfo(monthID);
  let javInfoYearly = loadOrCreateJavInfo(yearID);
  let javInfoTotal = loadOrCreateJavInfo(TOTAL_STATISTIC_ID);

  if (impactType == JavInfoImpactType.BURN) {
    javInfoDaily.totalJavBurned = javInfoDaily.totalJavBurned.plus(amount);
    javInfoMonthly.totalJavBurned = javInfoMonthly.totalJavBurned.plus(amount);
    javInfoYearly.totalJavBurned = javInfoYearly.totalJavBurned.plus(amount);
    javInfoTotal.totalJavBurned = javInfoTotal.totalJavBurned.plus(amount);
  } else if (impactType == JavInfoImpactType.CLAIM) {
    javInfoDaily.totalJavClaimed = javInfoDaily.totalJavClaimed.plus(amount);
    javInfoMonthly.totalJavClaimed =
      javInfoMonthly.totalJavClaimed.plus(amount);
    javInfoYearly.totalJavClaimed = javInfoYearly.totalJavClaimed.plus(amount);
    javInfoTotal.totalJavClaimed = javInfoTotal.totalJavClaimed.plus(amount);
  }

  javInfoDaily.save();
  javInfoMonthly.save();
  javInfoYearly.save();
  javInfoTotal.save();
}

function loadOrCreateJavInfo(id: string): JavInfo {
  let entity = JavInfo.load(id);
  if (entity == null) {
    entity = new JavInfo(id);
    entity.totalJavBurned = BigDecimal.zero();
    entity.totalJavClaimed = BigDecimal.zero();
  }
  return entity;
}
