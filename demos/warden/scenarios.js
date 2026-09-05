// Illustrative only. The withdrawal rule is a synthetic variation on a
// common pattern in retail finance; it is not any institution's real rule,
// and the thresholds are invented.
export const SCENARIOS = {
  "withdrawal": {
    "label": "new-account withdrawal",
    "blurb": "A new account tries to withdraw to a bank other than the one the money came from. The customer needs to know <em>why</em> and <em>what to do</em>; the associate helping them needs a little context; nobody outside needs the seasoning threshold or the velocity score, because those are the two numbers a fraudster would binary-search for.",
    "tiers": {
      "public": "the customer",
      "partner": "an associate helping them",
      "internal": "the risk team"
    },
    "contract": {
      "contract_version": "1",
      "ruleset": "withdrawal-eligibility",
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
        "RL_NEW_ACCT_EXTERNAL_MISMATCH": {
          "audience": "public",
          "reason_code": "EXTERNAL_TRANSFER_NOT_YET_AVAILABLE",
          "message": "Transfers to an account at a different institution are not available on this account yet. This will become available on {available_on}. You can withdraw to the account the funds came from at any time.",
          "facts": {
            "FirstAvailableOn": {
              "as": "available_on",
              "audience": "public"
            },
            "AccountAgeDays": {
              "as": "account_age_days",
              "audience": "partner"
            },
            "SeasoningThresholdDays": {
              "as": "threshold_days",
              "audience": "internal"
            },
            "FundingInstitutionId": {
              "as": "funding_inst",
              "audience": "internal"
            },
            "DestinationInstitutionId": {
              "as": "dest_inst",
              "audience": "internal"
            }
          }
        },
        "RL_DEST_UNVERIFIED": {
          "audience": "public",
          "reason_code": "DESTINATION_NOT_VERIFIED",
          "message": "The destination account has not finished verification. Confirm the two small deposits we sent to complete it.",
          "facts": {
            "VerificationAgeHours": {
              "as": "hours_since_started",
              "audience": "partner"
            },
            "DestVerificationState": {
              "as": "verification_state",
              "audience": "internal"
            }
          }
        },
        "RL_VELOCITY_SCORE": {
          "audience": "internal",
          "reason_code": "VELOCITY_REVIEW",
          "message": "Velocity score {score} is over the {floor} review floor (model {model}).",
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
      "ruleset": "withdrawal-eligibility",
      "version": "2026.08.3",
      "outcome": "DENY",
      "firings": [
        {
          "rule": "RL_NEW_ACCT_EXTERNAL_MISMATCH",
          "facts": {
            "AccountAgeDays": 12,
            "SeasoningThresholdDays": 45,
            "FundingInstitutionId": "INST-4471",
            "DestinationInstitutionId": "INST-9082",
            "FirstAvailableOn": "2026-10-08"
          }
        },
        {
          "rule": "RL_DEST_UNVERIFIED",
          "facts": {
            "DestVerificationState": "PENDING_MICRODEPOSIT",
            "VerificationAgeHours": 6
          }
        },
        {
          "rule": "RL_VELOCITY_SCORE",
          "facts": {
            "Score": 0.71,
            "ReviewFloor": 0.65,
            "ModelVersion": "vs-2026.07"
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
