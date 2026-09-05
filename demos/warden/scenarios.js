// Every scenario here is invented, thresholds included. They illustrate one
// shape -- a decision whose reasons are useful, partly sensitive, and partly
// an oracle -- across three unrelated industries. None is any company's real
// ruleset.
export const SCENARIOS = {
  "payout": {
    "label": "marketplace payout",
    "blurb": "A new shop asks to be paid out to an account other than the one its sales settle into. The seller needs the <em>why</em> and the <em>fix</em>; a support agent needs context to have that conversation; the seasoning threshold and the chargeback floor are exactly what someone would binary-search for, so they stay inside.",
    "tiers": {
      "public": "the seller",
      "partner": "a support agent",
      "internal": "the risk team"
    },
    "contract": {
      "contract_version": "1",
      "ruleset": "payout-eligibility",
      "outcomes": {
        "ALLOW": {
          "as": "available",
          "audience": "public"
        },
        "DENY": {
          "as": "not_available_yet",
          "audience": "public"
        },
        "HOLD": {
          "as": "under_review",
          "audience": "partner"
        }
      },
      "rules": {
        "RL_NEW_SELLER_PAYOUT_MISMATCH": {
          "audience": "public",
          "reason_code": "PAYOUT_ACCOUNT_NOT_YET_ELIGIBLE",
          "message": "Payouts to an account other than the one your sales settle into are not available on a new shop yet. This unlocks on {available_on}. Until then you can be paid out to your settlement account at any time.",
          "facts": {
            "FirstAvailableOn": {
              "as": "available_on",
              "audience": "public"
            },
            "SellerAgeDays": {
              "as": "shop_age_days",
              "audience": "partner"
            },
            "SeasoningThresholdDays": {
              "as": "threshold_days",
              "audience": "internal"
            },
            "SettlementAccountId": {
              "as": "settles_to",
              "audience": "internal"
            },
            "RequestedPayoutAccountId": {
              "as": "requested_to",
              "audience": "internal"
            }
          }
        },
        "RL_PAYOUT_ACCT_UNVERIFIED": {
          "audience": "public",
          "reason_code": "PAYOUT_ACCOUNT_NOT_VERIFIED",
          "message": "The payout account has not finished verification. Confirm the two small deposits we sent to complete it.",
          "facts": {
            "VerificationAgeHours": {
              "as": "hours_since_started",
              "audience": "partner"
            },
            "VerificationState": {
              "as": "verification_state",
              "audience": "internal"
            }
          }
        },
        "RL_CHARGEBACK_RISK_SCORE": {
          "audience": "internal",
          "reason_code": "CHARGEBACK_REVIEW",
          "message": "Chargeback score {score} is over the {floor} review floor (model {model}).",
          "facts": {
            "Score": {
              "as": "score",
              "audience": "internal"
            },
            "ReviewFloor": {
              "as": "floor",
              "audience": "internal"
            },
            "ModelVersion": {
              "as": "model",
              "audience": "internal"
            }
          }
        }
      }
    },
    "trace": {
      "ruleset": "payout-eligibility",
      "version": "2026.08.3",
      "outcome": "DENY",
      "firings": [
        {
          "rule": "RL_NEW_SELLER_PAYOUT_MISMATCH",
          "facts": {
            "SellerAgeDays": 12,
            "SeasoningThresholdDays": 45,
            "SettlementAccountId": "ACCT-4471",
            "RequestedPayoutAccountId": "ACCT-9082",
            "FirstAvailableOn": "2026-10-08"
          }
        },
        {
          "rule": "RL_PAYOUT_ACCT_UNVERIFIED",
          "facts": {
            "VerificationState": "PENDING_MICRODEPOSIT",
            "VerificationAgeHours": 6
          }
        },
        {
          "rule": "RL_CHARGEBACK_RISK_SCORE",
          "facts": {
            "Score": 0.71,
            "ReviewFloor": 0.65,
            "ModelVersion": "cb-2026.07"
          }
        }
      ]
    },
    "unmapped": {
      "rule": "RL_SANCTIONS_SCREEN",
      "facts": {
        "ListId": "SDN",
        "MatchScore": 0.94
      }
    }
  },
  "pharmacy": {
    "label": "pharmacy claim",
    "blurb": "A refill is rejected at the counter. The patient is told only when they can fill it and what to do if they cannot wait; the pharmacist gets what they need to act on it; the plan keeps the refill threshold and the controlled-substance signal, which are the numbers that would be gamed. This is warden's OBD-port analogy in the wild \u2014 a standardised reject code every pharmacy reads, while the plan's rules move underneath it.",
    "tiers": {
      "public": "the patient",
      "partner": "the pharmacist",
      "internal": "the plan"
    },
    "contract": {
      "contract_version": "1",
      "ruleset": "pharmacy-claim",
      "outcomes": {
        "ALLOW": {
          "as": "paid",
          "audience": "public"
        },
        "DENY": {
          "as": "not_covered",
          "audience": "public"
        },
        "HOLD": {
          "as": "in_review",
          "audience": "partner"
        }
      },
      "rules": {
        "RL_REFILL_TOO_SOON": {
          "audience": "public",
          "reason_code": "REFILL_TOO_SOON",
          "message": "This refill is earlier than the plan allows. It can be filled on {next_fill_on}. If you need it sooner \u2014 travel, a lost supply \u2014 your pharmacist can request an override.",
          "facts": {
            "NextFillOn": {
              "as": "next_fill_on",
              "audience": "public"
            },
            "DaysSupplyRemaining": {
              "as": "days_remaining",
              "audience": "partner"
            },
            "RefillThresholdPct": {
              "as": "threshold_pct",
              "audience": "internal"
            },
            "LastFillOn": {
              "as": "last_fill_on",
              "audience": "internal"
            }
          }
        },
        "RL_QUANTITY_OVER_PLAN_LIMIT": {
          "audience": "public",
          "reason_code": "QUANTITY_LIMIT_EXCEEDED",
          "message": "The plan covers a smaller quantity than was requested. Your pharmacist can dispense the covered amount, or your prescriber can request an exception.",
          "facts": {
            "PlanLimitQty": {
              "as": "covered_qty",
              "audience": "partner"
            },
            "RequestedQty": {
              "as": "requested_qty",
              "audience": "partner"
            },
            "LimitPeriodDays": {
              "as": "per_days",
              "audience": "partner"
            },
            "OverrideCode": {
              "as": "override_code",
              "audience": "internal"
            }
          }
        },
        "RL_CONTROLLED_UTILIZATION_SIGNAL": {
          "audience": "internal",
          "reason_code": "UTILIZATION_REVIEW",
          "message": "{prescribers} prescribers in 90 days, over the {floor} review floor (model {model}).",
          "facts": {
            "PrescriberCount90d": {
              "as": "prescribers",
              "audience": "internal"
            },
            "ReviewFloor": {
              "as": "floor",
              "audience": "internal"
            },
            "ModelVersion": {
              "as": "model",
              "audience": "internal"
            }
          }
        }
      }
    },
    "trace": {
      "ruleset": "pharmacy-claim",
      "version": "2026.07.2",
      "outcome": "DENY",
      "firings": [
        {
          "rule": "RL_REFILL_TOO_SOON",
          "facts": {
            "DaysSupplyRemaining": 9,
            "RefillThresholdPct": 75,
            "NextFillOn": "2026-09-14",
            "LastFillOn": "2026-08-21"
          }
        },
        {
          "rule": "RL_QUANTITY_OVER_PLAN_LIMIT",
          "facts": {
            "RequestedQty": 90,
            "PlanLimitQty": 60,
            "LimitPeriodDays": 30,
            "OverrideCode": "PA-QL-2026.4"
          }
        },
        {
          "rule": "RL_CONTROLLED_UTILIZATION_SIGNAL",
          "facts": {
            "PrescriberCount90d": 4,
            "ReviewFloor": 3,
            "ModelVersion": "cs-2026.05"
          }
        }
      ]
    },
    "unmapped": {
      "rule": "RL_DUR_INTERACTION",
      "facts": {
        "Severity": "MAJOR",
        "InteractingNdc": "00000-0000-00"
      }
    }
  },
  "shipping": {
    "label": "shipping eligibility",
    "blurb": "The example from warden's own testdata: a shipment declined for two published reasons and one that never leaves the building.",
    "tiers": {
      "public": "a customer",
      "partner": "a carrier under contract",
      "internal": "your operators"
    },
    "contract": {
      "contract_version": "1",
      "ruleset": "shipping-eligibility",
      "outcomes": {
        "ALLOW": {
          "as": "eligible",
          "audience": "public"
        },
        "DENY": {
          "as": "not_eligible",
          "audience": "public"
        },
        "HOLD": {
          "as": "under_review",
          "audience": "partner"
        }
      },
      "rules": {
        "RL_DEST_OUTSIDE_ZONE": {
          "audience": "public",
          "reason_code": "DESTINATION_NOT_SERVED",
          "message": "We do not ship to this destination yet. Served zones: {served_zones}.",
          "facts": {
            "SupportedZones": {
              "as": "served_zones",
              "audience": "public"
            },
            "DestZoneCode": {
              "as": "zone",
              "audience": "internal"
            }
          }
        },
        "RL_PKG_MASS_OVER_LIMIT": {
          "audience": "public",
          "reason_code": "PACKAGE_TOO_HEAVY",
          "message": "This package is {mass} kg; the limit is {limit} kg.",
          "facts": {
            "PkgMassKg": {
              "as": "mass",
              "audience": "public"
            },
            "MaxMassKg": {
              "as": "limit",
              "audience": "public"
            }
          }
        },
        "RL_CARRIER_MARGIN_FLOOR": {
          "audience": "internal",
          "reason_code": "BELOW_MARGIN_FLOOR",
          "message": "Margin {margin} bps is under the {floor} bps floor.",
          "facts": {
            "MarginBps": {
              "as": "margin",
              "audience": "internal"
            },
            "FloorBps": {
              "as": "floor",
              "audience": "internal"
            }
          }
        }
      }
    },
    "trace": {
      "ruleset": "shipping-eligibility",
      "version": "2026.09.1",
      "outcome": "DENY",
      "firings": [
        {
          "rule": "RL_DEST_OUTSIDE_ZONE",
          "facts": {
            "DestZoneCode": "Z9",
            "SupportedZones": "Z1-Z4"
          }
        },
        {
          "rule": "RL_PKG_MASS_OVER_LIMIT",
          "facts": {
            "PkgMassKg": 34.5,
            "MaxMassKg": 30
          }
        },
        {
          "rule": "RL_CARRIER_MARGIN_FLOOR",
          "facts": {
            "MarginBps": 40,
            "FloorBps": 150
          }
        }
      ]
    },
    "unmapped": {
      "rule": "RL_SANCTIONS_HIT",
      "facts": {
        "ListId": "OFAC-SDN",
        "MatchScore": 0.94
      }
    }
  }
};
