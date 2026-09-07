// Generated from testdata/*/in.json in Grace/genai-interlingua.
// These are spans captured from the real libraries, not written for the demo.
const SAMPLES = {
  "openllmetry": {
    "label": "OpenLLMetry (current)",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "2cec90cb-b604-4252-aa04-6e23db22089c"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "opentelemetry.instrumentation.openai.v1",
                "version": "0.62.3"
              },
              "spans": [
                {
                  "traceId": "5f90e0fae91e2682e8f9c444b888ab2b",
                  "spanId": "8ed2ac9258fd12cf",
                  "parentSpanId": "e0d3487f0a1b761d",
                  "name": "openai.chat",
                  "kind": "SPAN_KIND_CLIENT",
                  "startTimeUnixNano": "1788795791003811000",
                  "endTimeUnixNano": "1788795791027364000",
                  "attributes": [
                    {
                      "key": "gen_ai.operation.name",
                      "value": {
                        "stringValue": "chat"
                      }
                    },
                    {
                      "key": "traceloop.workflow.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "gen_ai.provider.name",
                      "value": {
                        "stringValue": "openai"
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.request.max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "gen_ai.request.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "gen_ai.request.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "gen_ai.is_streaming",
                      "value": {
                        "boolValue": false
                      }
                    },
                    {
                      "key": "gen_ai.openai.api_base",
                      "value": {
                        "stringValue": "http://127.0.0.1:8080/v1/"
                      }
                    },
                    {
                      "key": "gen_ai.input.messages",
                      "value": {
                        "stringValue": "[{\"role\": \"system\", \"parts\": [{\"content\": \"You are a support agent. Use the tools you are given.\", \"type\": \"text\"}]}, {\"role\": \"user\", \"parts\": [{\"content\": \"Where is order A-1187?\", \"type\": \"text\"}]}]"
                      }
                    },
                    {
                      "key": "gen_ai.tool.definitions",
                      "value": {
                        "stringValue": "[{\"type\": \"function\", \"name\": \"lookup_order\", \"description\": \"Look up an order by its identifier.\", \"parameters\": {\"type\": \"object\", \"properties\": {\"order_id\": {\"type\": \"string\"}}, \"required\": [\"order_id\"]}}]"
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "gen_ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "gen_ai.response.finish_reasons",
                      "value": {
                        "arrayValue": {
                          "values": [
                            {
                              "stringValue": "tool_call"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "key": "gen_ai.openai.response.system_fingerprint",
                      "value": {
                        "stringValue": "fp_capture0"
                      }
                    },
                    {
                      "key": "gen_ai.usage.total_tokens",
                      "value": {
                        "intValue": "439"
                      }
                    },
                    {
                      "key": "gen_ai.usage.output_tokens",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "gen_ai.usage.input_tokens",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "gen_ai.usage.cache_read.input_tokens",
                      "value": {
                        "intValue": "256"
                      }
                    },
                    {
                      "key": "gen_ai.usage.reasoning_tokens",
                      "value": {
                        "intValue": "8"
                      }
                    },
                    {
                      "key": "gen_ai.output.messages",
                      "value": {
                        "stringValue": "[{\"role\": \"assistant\", \"parts\": [{\"type\": \"tool_call\", \"name\": \"lookup_order\", \"id\": \"call_9RtYbK2mXqLp\", \"arguments\": {\"order_id\": \"A-1187\"}}], \"finish_reason\": \"tool_call\"}]"
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        },
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "2cec90cb-b604-4252-aa04-6e23db22089c"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "traceloop.tracer"
              },
              "spans": [
                {
                  "traceId": "5f90e0fae91e2682e8f9c444b888ab2b",
                  "spanId": "e0d3487f0a1b761d",
                  "name": "support_triage.workflow",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788795791003727000",
                  "endTimeUnixNano": "1788795791031764000",
                  "attributes": [
                    {
                      "key": "traceloop.workflow.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "traceloop.span.kind",
                      "value": {
                        "stringValue": "workflow"
                      }
                    },
                    {
                      "key": "traceloop.entity.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "traceloop.entity.input",
                      "value": {
                        "stringValue": "{\"args\": [], \"kwargs\": {}}"
                      }
                    },
                    {
                      "key": "traceloop.entity.output",
                      "value": {
                        "stringValue": "\"{\\n  \\\"id\\\": \\\"chatcmpl-CD8yqQ2y3kZs1o0Wm7bT\\\",\\n  \\\"choices\\\": [\\n    {\\n      \\\"finish_reason\\\": \\\"tool_calls\\\",\\n      \\\"index\\\": 0,\\n      \\\"logprobs\\\": null,\\n      \\\"message\\\": {\\n        \\\"content\\\": null,\\n        \\\"role\\\": \\\"assistant\\\",\\n        \\\"tool_calls\\\": [\\n          {\\n            \\\"id\\\": \\\"call_9RtYbK2mXqLp\\\",\\n            \\\"function\\\": {\\n              \\\"arguments\\\": \\\"{\\\\\\\"order_id\\\\\\\": \\\\\\\"A-1187\\\\\\\"}\\\",\\n              \\\"name\\\": \\\"lookup_order\\\"\\n            },\\n            \\\"type\\\": \\\"function\\\"\\n          }\\n        ]\\n      }\\n    }\\n  ],\\n  \\\"created\\\": 1789000000,\\n  \\\"model\\\": \\\"gpt-4o-mini-2024-07-18\\\",\\n  \\\"object\\\": \\\"chat.completion\\\",\\n  \\\"system_fingerprint\\\": \\\"fp_capture0\\\",\\n  \\\"usage\\\": {\\n    \\\"completion_tokens\\\": 27,\\n    \\\"prompt_tokens\\\": 412,\\n    \\\"total_tokens\\\": 439,\\n    \\\"completion_tokens_details\\\": {\\n      \\\"accepted_prediction_tokens\\\": 0,\\n      \\\"audio_tokens\\\": 0,\\n      \\\"reasoning_tokens\\\": 8,\\n      \\\"rejected_prediction_tokens\\\": 0\\n    },\\n    \\\"prompt_tokens_details\\\": {\\n      \\\"audio_tokens\\\": 0,\\n      \\\"cached_tokens\\\": 256\\n    }\\n  }\\n}\""
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "openllmetry-legacy": {
    "label": "OpenLLMetry (pre-migration)",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "service.name",
                "value": {
                  "stringValue": "support-triage"
                }
              },
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "opentelemetry.instrumentation.openai",
                "version": "0.48.2"
              },
              "spans": [
                {
                  "traceId": "5b8efff798038103d269b633813fc60c",
                  "spanId": "eee19b7ec3c1b174",
                  "parentSpanId": "eee19b7ec3c1b173",
                  "name": "openai.chat",
                  "kind": 3,
                  "startTimeUnixNano": "1749823200000000000",
                  "endTimeUnixNano": "1749823201482000000",
                  "attributes": [
                    {
                      "key": "gen_ai.system",
                      "value": {
                        "stringValue": "OpenAI"
                      }
                    },
                    {
                      "key": "llm.request.type",
                      "value": {
                        "stringValue": "chat"
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.request.max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "gen_ai.request.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "gen_ai.request.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "llm.is_streaming",
                      "value": {
                        "boolValue": false
                      }
                    },
                    {
                      "key": "llm.chat.stop_sequences",
                      "value": {
                        "arrayValue": {
                          "values": [
                            {
                              "stringValue": "\n\nObservation:"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "key": "llm.request.functions.0.name",
                      "value": {
                        "stringValue": "lookup_order"
                      }
                    },
                    {
                      "key": "llm.request.functions.0.description",
                      "value": {
                        "stringValue": "Look up an order by its identifier."
                      }
                    },
                    {
                      "key": "llm.request.functions.0.parameters",
                      "value": {
                        "stringValue": "{\"type\": \"object\", \"properties\": {\"order_id\": {\"type\": \"string\"}}, \"required\": [\"order_id\"]}"
                      }
                    },
                    {
                      "key": "gen_ai.prompt.0.role",
                      "value": {
                        "stringValue": "system"
                      }
                    },
                    {
                      "key": "gen_ai.prompt.0.content",
                      "value": {
                        "stringValue": "You are a support agent. Use the tools you are given."
                      }
                    },
                    {
                      "key": "gen_ai.prompt.1.role",
                      "value": {
                        "stringValue": "user"
                      }
                    },
                    {
                      "key": "gen_ai.prompt.1.content",
                      "value": {
                        "stringValue": "Where is order A-1187?"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.role",
                      "value": {
                        "stringValue": "assistant"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.finish_reason",
                      "value": {
                        "stringValue": "tool_calls"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.tool_calls.0.id",
                      "value": {
                        "stringValue": "call_9RtYbK2mXqLp"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.tool_calls.0.name",
                      "value": {
                        "stringValue": "lookup_order"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.tool_calls.0.arguments",
                      "value": {
                        "stringValue": "{\"order_id\": \"A-1187\"}"
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "gen_ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "gen_ai.usage.prompt_tokens",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "gen_ai.usage.completion_tokens",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "gen_ai.usage.cache_creation_input_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "gen_ai.usage.total_tokens",
                      "value": {
                        "intValue": "439"
                      }
                    },
                    {
                      "key": "traceloop.workflow.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "traceloop.prompt.key",
                      "value": {
                        "stringValue": "order_status"
                      }
                    },
                    {
                      "key": "traceloop.prompt.version",
                      "value": {
                        "intValue": "3"
                      }
                    },
                    {
                      "key": "traceloop.association.properties.user_id",
                      "value": {
                        "stringValue": "u-7741"
                      }
                    }
                  ],
                  "status": {}
                },
                {
                  "traceId": "5b8efff798038103d269b633813fc60c",
                  "spanId": "eee19b7ec3c1b175",
                  "parentSpanId": "eee19b7ec3c1b174",
                  "name": "POST",
                  "kind": 3,
                  "startTimeUnixNano": "1749823200004000000",
                  "endTimeUnixNano": "1749823201480000000",
                  "attributes": [
                    {
                      "key": "http.request.method",
                      "value": {
                        "stringValue": "POST"
                      }
                    },
                    {
                      "key": "server.address",
                      "value": {
                        "stringValue": "api.openai.com"
                      }
                    },
                    {
                      "key": "http.response.status_code",
                      "value": {
                        "intValue": "200"
                      }
                    }
                  ],
                  "status": {}
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "openinference": {
    "label": "OpenInference",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "8e35ee45-6f9c-47a3-9990-bc16a3eb173c"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "openinference.instrumentation.openai",
                "version": "0.1.58"
              },
              "spans": [
                {
                  "traceId": "4ef5a9b88a7c82785a2eeb77335c6561",
                  "spanId": "9056eab4bb9651fa",
                  "name": "ChatCompletion",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788788051417410000",
                  "endTimeUnixNano": "1788788051436957000",
                  "attributes": [
                    {
                      "key": "llm.system",
                      "value": {
                        "stringValue": "openai"
                      }
                    },
                    {
                      "key": "input.value",
                      "value": {
                        "stringValue": "{\"messages\": [{\"role\": \"system\", \"content\": \"You are a support agent. Use the tools you are given.\"}, {\"role\": \"user\", \"content\": \"Where is order A-1187?\"}], \"model\": \"gpt-4o-mini\", \"max_tokens\": 1024, \"temperature\": 0.7, \"tools\": [{\"type\": \"function\", \"function\": {\"name\": \"lookup_order\", \"description\": \"Look up an order by its identifier.\", \"parameters\": {\"type\": \"object\", \"properties\": {\"order_id\": {\"type\": \"string\"}}, \"required\": [\"order_id\"]}}}], \"top_p\": 0.95}"
                      }
                    },
                    {
                      "key": "input.mime_type",
                      "value": {
                        "stringValue": "application/json"
                      }
                    },
                    {
                      "key": "output.value",
                      "value": {
                        "stringValue": "{\"id\":\"chatcmpl-CD8yqQ2y3kZs1o0Wm7bT\",\"choices\":[{\"finish_reason\":\"tool_calls\",\"index\":0,\"logprobs\":null,\"message\":{\"content\":null,\"role\":\"assistant\",\"tool_calls\":[{\"id\":\"call_9RtYbK2mXqLp\",\"function\":{\"arguments\":\"{\\\"order_id\\\": \\\"A-1187\\\"}\",\"name\":\"lookup_order\"},\"type\":\"function\"}]}}],\"created\":1789000000,\"model\":\"gpt-4o-mini-2024-07-18\",\"object\":\"chat.completion\",\"system_fingerprint\":\"fp_capture0\",\"usage\":{\"completion_tokens\":27,\"prompt_tokens\":412,\"total_tokens\":439,\"completion_tokens_details\":{\"accepted_prediction_tokens\":0,\"audio_tokens\":0,\"reasoning_tokens\":8,\"rejected_prediction_tokens\":0},\"prompt_tokens_details\":{\"audio_tokens\":0,\"cached_tokens\":256}}}"
                      }
                    },
                    {
                      "key": "output.mime_type",
                      "value": {
                        "stringValue": "application/json"
                      }
                    },
                    {
                      "key": "llm.tools.0.tool.json_schema",
                      "value": {
                        "stringValue": "{\"type\": \"function\", \"function\": {\"name\": \"lookup_order\", \"description\": \"Look up an order by its identifier.\", \"parameters\": {\"type\": \"object\", \"properties\": {\"order_id\": {\"type\": \"string\"}}, \"required\": [\"order_id\"]}}}"
                      }
                    },
                    {
                      "key": "llm.invocation_parameters",
                      "value": {
                        "stringValue": "{\"model\": \"gpt-4o-mini\", \"max_tokens\": 1024, \"temperature\": 0.7, \"top_p\": 0.95}"
                      }
                    },
                    {
                      "key": "llm.input_messages.0.message.role",
                      "value": {
                        "stringValue": "system"
                      }
                    },
                    {
                      "key": "llm.input_messages.0.message.content",
                      "value": {
                        "stringValue": "You are a support agent. Use the tools you are given."
                      }
                    },
                    {
                      "key": "llm.input_messages.1.message.role",
                      "value": {
                        "stringValue": "user"
                      }
                    },
                    {
                      "key": "llm.input_messages.1.message.content",
                      "value": {
                        "stringValue": "Where is order A-1187?"
                      }
                    },
                    {
                      "key": "llm.model_name",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "llm.token_count.total",
                      "value": {
                        "intValue": "439"
                      }
                    },
                    {
                      "key": "llm.token_count.prompt",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "llm.token_count.completion",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "llm.token_count.prompt_details.cache_read",
                      "value": {
                        "intValue": "256"
                      }
                    },
                    {
                      "key": "llm.token_count.prompt_details.audio",
                      "value": {
                        "intValue": "0"
                      }
                    },
                    {
                      "key": "llm.token_count.completion_details.reasoning",
                      "value": {
                        "intValue": "8"
                      }
                    },
                    {
                      "key": "llm.token_count.completion_details.audio",
                      "value": {
                        "intValue": "0"
                      }
                    },
                    {
                      "key": "llm.output_messages.0.message.role",
                      "value": {
                        "stringValue": "assistant"
                      }
                    },
                    {
                      "key": "llm.output_messages.0.message.tool_calls.0.tool_call.id",
                      "value": {
                        "stringValue": "call_9RtYbK2mXqLp"
                      }
                    },
                    {
                      "key": "llm.output_messages.0.message.tool_calls.0.tool_call.function.name",
                      "value": {
                        "stringValue": "lookup_order"
                      }
                    },
                    {
                      "key": "llm.output_messages.0.message.tool_calls.0.tool_call.function.arguments",
                      "value": {
                        "stringValue": "{\"order_id\": \"A-1187\"}"
                      }
                    },
                    {
                      "key": "llm.finish_reason",
                      "value": {
                        "stringValue": "tool_calls"
                      }
                    },
                    {
                      "key": "openinference.span.kind",
                      "value": {
                        "stringValue": "LLM"
                      }
                    }
                  ],
                  "status": {
                    "code": "STATUS_CODE_OK"
                  },
                  "flags": 256
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "vercel": {
    "label": "Vercel AI SDK",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ],
            "droppedAttributesCount": 0
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "ai"
              },
              "spans": [
                {
                  "traceId": "85ebdb4d13864fa11366570a33194c67",
                  "spanId": "ac8b47bbdc82ad55",
                  "parentSpanId": "65c9090446d31433",
                  "name": "ai.toolCall",
                  "kind": 1,
                  "startTimeUnixNano": "1788788016873000000",
                  "endTimeUnixNano": "1788788016873241417",
                  "attributes": [
                    {
                      "key": "operation.name",
                      "value": {
                        "stringValue": "ai.toolCall support_triage"
                      }
                    },
                    {
                      "key": "resource.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "ai.operationId",
                      "value": {
                        "stringValue": "ai.toolCall"
                      }
                    },
                    {
                      "key": "ai.telemetry.functionId",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "ai.toolCall.name",
                      "value": {
                        "stringValue": "lookup_order"
                      }
                    },
                    {
                      "key": "ai.toolCall.id",
                      "value": {
                        "stringValue": "call_9RtYbK2mXqLp"
                      }
                    },
                    {
                      "key": "ai.toolCall.args",
                      "value": {
                        "stringValue": "{\"order_id\":\"A-1187\"}"
                      }
                    },
                    {
                      "key": "ai.toolCall.result",
                      "value": {
                        "stringValue": "{\"order_id\":\"A-1187\",\"status\":\"in transit\"}"
                      }
                    }
                  ],
                  "droppedAttributesCount": 0,
                  "events": [],
                  "droppedEventsCount": 0,
                  "status": {
                    "code": 0
                  },
                  "links": [],
                  "droppedLinksCount": 0,
                  "flags": 257
                }
              ]
            }
          ]
        },
        {
          "resource": {
            "attributes": [
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ],
            "droppedAttributesCount": 0
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "ai"
              },
              "spans": [
                {
                  "traceId": "85ebdb4d13864fa11366570a33194c67",
                  "spanId": "abfee917dad68884",
                  "parentSpanId": "65c9090446d31433",
                  "name": "ai.generateText.doGenerate",
                  "kind": 1,
                  "startTimeUnixNano": "1788788016851000000",
                  "endTimeUnixNano": "1788788016870754458",
                  "attributes": [
                    {
                      "key": "operation.name",
                      "value": {
                        "stringValue": "ai.generateText.doGenerate support_triage"
                      }
                    },
                    {
                      "key": "resource.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "ai.operationId",
                      "value": {
                        "stringValue": "ai.generateText.doGenerate"
                      }
                    },
                    {
                      "key": "ai.telemetry.functionId",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "ai.model.provider",
                      "value": {
                        "stringValue": "openai.chat"
                      }
                    },
                    {
                      "key": "ai.model.id",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "ai.settings.maxOutputTokens",
                      "value": {
                        "intValue": 1024
                      }
                    },
                    {
                      "key": "ai.settings.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "ai.settings.topP",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "ai.settings.maxRetries",
                      "value": {
                        "intValue": 2
                      }
                    },
                    {
                      "key": "ai.request.headers.user-agent",
                      "value": {
                        "stringValue": "ai/5.0.253"
                      }
                    },
                    {
                      "key": "ai.prompt.messages",
                      "value": {
                        "stringValue": "[{\"role\":\"system\",\"content\":\"You are a support agent. Use the tools you are given.\"},{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"Where is order A-1187?\"}]}]"
                      }
                    },
                    {
                      "key": "ai.prompt.tools",
                      "value": {
                        "arrayValue": {
                          "values": [
                            {
                              "stringValue": "{\"type\":\"function\",\"name\":\"lookup_order\",\"description\":\"Look up an order by its identifier.\",\"inputSchema\":{\"$schema\":\"http://json-schema.org/draft-07/schema#\",\"type\":\"object\",\"properties\":{\"order_id\":{\"type\":\"string\"}},\"required\":[\"order_id\"],\"additionalProperties\":false}}"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "key": "ai.prompt.toolChoice",
                      "value": {
                        "stringValue": "{\"type\":\"auto\"}"
                      }
                    },
                    {
                      "key": "gen_ai.system",
                      "value": {
                        "stringValue": "openai.chat"
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.request.max_tokens",
                      "value": {
                        "intValue": 1024
                      }
                    },
                    {
                      "key": "gen_ai.request.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "gen_ai.request.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "ai.response.finishReason",
                      "value": {
                        "stringValue": "tool-calls"
                      }
                    },
                    {
                      "key": "ai.response.toolCalls",
                      "value": {
                        "stringValue": "[{\"toolCallId\":\"call_9RtYbK2mXqLp\",\"toolName\":\"lookup_order\",\"input\":\"{\\\"order_id\\\": \\\"A-1187\\\"}\"}]"
                      }
                    },
                    {
                      "key": "ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "ai.response.timestamp",
                      "value": {
                        "stringValue": "2026-09-10T00:26:40.000Z"
                      }
                    },
                    {
                      "key": "ai.response.providerMetadata",
                      "value": {
                        "stringValue": "{\"openai\":{\"acceptedPredictionTokens\":0,\"rejectedPredictionTokens\":0}}"
                      }
                    },
                    {
                      "key": "ai.usage.promptTokens",
                      "value": {
                        "intValue": 412
                      }
                    },
                    {
                      "key": "ai.usage.completionTokens",
                      "value": {
                        "intValue": 27
                      }
                    },
                    {
                      "key": "gen_ai.response.finish_reasons",
                      "value": {
                        "arrayValue": {
                          "values": [
                            {
                              "stringValue": "tool-calls"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "key": "gen_ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "gen_ai.usage.input_tokens",
                      "value": {
                        "intValue": 412
                      }
                    },
                    {
                      "key": "gen_ai.usage.output_tokens",
                      "value": {
                        "intValue": 27
                      }
                    }
                  ],
                  "droppedAttributesCount": 0,
                  "events": [],
                  "droppedEventsCount": 0,
                  "status": {
                    "code": 0
                  },
                  "links": [],
                  "droppedLinksCount": 0,
                  "flags": 257
                }
              ]
            }
          ]
        },
        {
          "resource": {
            "attributes": [
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ],
            "droppedAttributesCount": 0
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "ai"
              },
              "spans": [
                {
                  "traceId": "85ebdb4d13864fa11366570a33194c67",
                  "spanId": "65c9090446d31433",
                  "name": "ai.generateText",
                  "kind": 1,
                  "startTimeUnixNano": "1788788016849000000",
                  "endTimeUnixNano": "1788788016874767334",
                  "attributes": [
                    {
                      "key": "operation.name",
                      "value": {
                        "stringValue": "ai.generateText support_triage"
                      }
                    },
                    {
                      "key": "resource.name",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "ai.operationId",
                      "value": {
                        "stringValue": "ai.generateText"
                      }
                    },
                    {
                      "key": "ai.telemetry.functionId",
                      "value": {
                        "stringValue": "support_triage"
                      }
                    },
                    {
                      "key": "ai.model.provider",
                      "value": {
                        "stringValue": "openai.chat"
                      }
                    },
                    {
                      "key": "ai.model.id",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "ai.settings.maxOutputTokens",
                      "value": {
                        "intValue": 1024
                      }
                    },
                    {
                      "key": "ai.settings.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "ai.settings.topP",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "ai.settings.maxRetries",
                      "value": {
                        "intValue": 2
                      }
                    },
                    {
                      "key": "ai.request.headers.user-agent",
                      "value": {
                        "stringValue": "ai/5.0.253"
                      }
                    },
                    {
                      "key": "ai.prompt",
                      "value": {
                        "stringValue": "{\"system\":\"You are a support agent. Use the tools you are given.\",\"prompt\":\"Where is order A-1187?\"}"
                      }
                    },
                    {
                      "key": "ai.response.finishReason",
                      "value": {
                        "stringValue": "tool-calls"
                      }
                    },
                    {
                      "key": "ai.response.toolCalls",
                      "value": {
                        "stringValue": "[{\"toolCallId\":\"call_9RtYbK2mXqLp\",\"toolName\":\"lookup_order\",\"input\":\"{\\\"order_id\\\": \\\"A-1187\\\"}\"}]"
                      }
                    },
                    {
                      "key": "ai.response.providerMetadata",
                      "value": {
                        "stringValue": "{\"openai\":{\"acceptedPredictionTokens\":0,\"rejectedPredictionTokens\":0}}"
                      }
                    },
                    {
                      "key": "ai.usage.promptTokens",
                      "value": {
                        "intValue": 412
                      }
                    },
                    {
                      "key": "ai.usage.completionTokens",
                      "value": {
                        "intValue": 27
                      }
                    }
                  ],
                  "droppedAttributesCount": 0,
                  "events": [],
                  "droppedEventsCount": 0,
                  "status": {
                    "code": 0
                  },
                  "links": [],
                  "droppedLinksCount": 0,
                  "flags": 257
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "litellm": {
    "label": "LiteLLM",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "cbfd16f3-481d-4971-ae79-70314a498771"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              },
              {
                "key": "deployment.environment",
                "value": {
                  "stringValue": "production"
                }
              },
              {
                "key": "model_id",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "litellm"
              },
              "spans": [
                {
                  "traceId": "89443148be1f25c7347a6825210c17cd",
                  "spanId": "ba48e2429fb1cf09",
                  "name": "litellm_request",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788788054134155008",
                  "endTimeUnixNano": "1788788054408071168",
                  "attributes": [
                    {
                      "key": "metadata.user_api_key_hash",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_alias",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_spend",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_max_budget",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_budget_reset_at",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_user_spend",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_user_max_budget",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_team_spend",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_team_max_budget",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_team_id",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_org_id",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_org_alias",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_project_id",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_project_alias",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_user_id",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_team_alias",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_user_email",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_end_user_id",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_request_route",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.spend_logs_metadata",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.requester_ip_address",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_agent",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.requester_metadata",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.prompt_management_metadata",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.applied_guardrails",
                      "value": {
                        "stringValue": "[]"
                      }
                    },
                    {
                      "key": "metadata.mcp_tool_call_metadata",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.vector_store_request_metadata",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.routing_decision",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.usage_object",
                      "value": {
                        "stringValue": "{'completion_tokens': 27, 'prompt_tokens': 412, 'total_tokens': 439, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 8, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 256}}"
                      }
                    },
                    {
                      "key": "metadata.requester_custom_headers",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.cold_storage_object_key",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.user_api_key_auth_metadata",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.team_alias",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "metadata.team_id",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "hidden_params",
                      "value": {
                        "stringValue": "{\"model_id\": null, \"cache_key\": null, \"api_base\": null, \"response_cost\": 5.88e-05, \"additional_headers\": {\"llm_provider-server\": \"BaseHTTP/0.6 Python/3.13.15\", \"llm_provider-date\": \"Mon, 07 Sep 2026 13:34:14 GMT\", \"llm_provider-content-type\": \"application/json\", \"llm_provider-content-length\": \"722\"}, \"litellm_overhead_time_ms\": null, \"batch_models\": null, \"batch_successful_requests\": null, \"batch_failed_requests\": null, \"litellm_model_name\": null, \"usage_object\": null}"
                      }
                    },
                    {
                      "key": "litellm.provider.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.cost.input_cost",
                      "value": {
                        "doubleValue": 4.26e-05
                      }
                    },
                    {
                      "key": "gen_ai.cost.output_cost",
                      "value": {
                        "doubleValue": 1.62e-05
                      }
                    },
                    {
                      "key": "gen_ai.cost.total_cost",
                      "value": {
                        "doubleValue": 5.88e-05
                      }
                    },
                    {
                      "key": "gen_ai.cost.tool_usage_cost",
                      "value": {
                        "doubleValue": 0.0
                      }
                    },
                    {
                      "key": "gen_ai.cost.cache_read_cost",
                      "value": {
                        "doubleValue": 1.92e-05
                      }
                    },
                    {
                      "key": "gen_ai.cost.reasoning_cost",
                      "value": {
                        "doubleValue": 4.8e-06
                      }
                    },
                    {
                      "key": "gen_ai.cost.original_cost",
                      "value": {
                        "doubleValue": 5.88e-05
                      }
                    },
                    {
                      "key": "gen_ai.cost.discount_percent",
                      "value": {
                        "doubleValue": 0.0
                      }
                    },
                    {
                      "key": "gen_ai.cost.discount_amount",
                      "value": {
                        "doubleValue": 0.0
                      }
                    },
                    {
                      "key": "gen_ai.cost.margin_percent",
                      "value": {
                        "doubleValue": 0.0
                      }
                    },
                    {
                      "key": "gen_ai.cost.margin_fixed_amount",
                      "value": {
                        "doubleValue": 0.0
                      }
                    },
                    {
                      "key": "gen_ai.cost.margin_total_amount",
                      "value": {
                        "doubleValue": 0.0
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "llm.request.type",
                      "value": {
                        "stringValue": "completion"
                      }
                    },
                    {
                      "key": "gen_ai.system",
                      "value": {
                        "stringValue": "openai"
                      }
                    },
                    {
                      "key": "gen_ai.request.max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "gen_ai.request.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "gen_ai.request.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "llm.is_streaming",
                      "value": {
                        "stringValue": "False"
                      }
                    },
                    {
                      "key": "gen_ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "litellm.call_id",
                      "value": {
                        "stringValue": "0d3f323c-bd38-4075-90ca-66a91b89c95e"
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "gen_ai.usage.total_tokens",
                      "value": {
                        "intValue": "439"
                      }
                    },
                    {
                      "key": "gen_ai.usage.output_tokens",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "gen_ai.usage.input_tokens",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "llm.request.functions.0.name",
                      "value": {
                        "stringValue": "lookup_order"
                      }
                    },
                    {
                      "key": "llm.request.functions.0.description",
                      "value": {
                        "stringValue": "Look up an order by its identifier."
                      }
                    },
                    {
                      "key": "llm.request.functions.0.parameters",
                      "value": {
                        "stringValue": "{\"type\": \"object\", \"properties\": {\"order_id\": {\"type\": \"string\"}}, \"required\": [\"order_id\"]}"
                      }
                    },
                    {
                      "key": "gen_ai.input.messages",
                      "value": {
                        "stringValue": "[{\"role\": \"system\", \"parts\": [{\"type\": \"text\", \"content\": \"You are a support agent. Use the tools you are given.\"}]}, {\"role\": \"user\", \"parts\": [{\"type\": \"text\", \"content\": \"Where is order A-1187?\"}]}]"
                      }
                    },
                    {
                      "key": "gen_ai.operation.name",
                      "value": {
                        "stringValue": "chat"
                      }
                    },
                    {
                      "key": "gen_ai.output.messages",
                      "value": {
                        "stringValue": "[{\"role\": \"assistant\", \"parts\": [], \"finish_reason\": \"tool_calls\"}]"
                      }
                    },
                    {
                      "key": "gen_ai.response.finish_reasons",
                      "value": {
                        "stringValue": "[\"tool_calls\"]"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.function_call.arguments",
                      "value": {
                        "stringValue": "{\"order_id\": \"A-1187\"}"
                      }
                    },
                    {
                      "key": "gen_ai.completion.0.function_call.name",
                      "value": {
                        "stringValue": "lookup_order"
                      }
                    }
                  ],
                  "status": {
                    "code": "STATUS_CODE_OK"
                  },
                  "flags": 256
                },
                {
                  "traceId": "89443148be1f25c7347a6825210c17cd",
                  "spanId": "78c663565622603e",
                  "parentSpanId": "ba48e2429fb1cf09",
                  "name": "raw_gen_ai_request",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788788054134155008",
                  "endTimeUnixNano": "1788788054408071168",
                  "attributes": [
                    {
                      "key": "llm.openai.messages",
                      "value": {
                        "stringValue": "[{'role': 'system', 'content': 'You are a support agent. Use the tools you are given.'}, {'role': 'user', 'content': 'Where is order A-1187?'}]"
                      }
                    },
                    {
                      "key": "llm.openai.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "llm.openai.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "llm.openai.max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "llm.openai.tools",
                      "value": {
                        "stringValue": "[{'type': 'function', 'function': {'name': 'lookup_order', 'description': 'Look up an order by its identifier.', 'parameters': {'type': 'object', 'properties': {'order_id': {'type': 'string'}}, 'required': ['order_id']}}}]"
                      }
                    },
                    {
                      "key": "llm.openai.extra_body",
                      "value": {
                        "stringValue": "{}"
                      }
                    },
                    {
                      "key": "llm.openai.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "llm.openai.choices",
                      "value": {
                        "stringValue": "[{'finish_reason': 'tool_calls', 'index': 0, 'logprobs': None, 'message': {'content': None, 'refusal': None, 'role': 'assistant', 'annotations': None, 'audio': None, 'function_call': None, 'tool_calls': [{'id': 'call_9RtYbK2mXqLp', 'function': {'arguments': '{\"order_id\": \"A-1187\"}', 'name': 'lookup_order'}, 'type': 'function'}]}}]"
                      }
                    },
                    {
                      "key": "llm.openai.created",
                      "value": {
                        "intValue": "1789000000"
                      }
                    },
                    {
                      "key": "llm.openai.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "llm.openai.object",
                      "value": {
                        "stringValue": "chat.completion"
                      }
                    },
                    {
                      "key": "llm.openai.moderation",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "llm.openai.service_tier",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "llm.openai.system_fingerprint",
                      "value": {
                        "stringValue": "fp_capture0"
                      }
                    },
                    {
                      "key": "llm.openai.usage",
                      "value": {
                        "stringValue": "{'completion_tokens': 27, 'prompt_tokens': 412, 'total_tokens': 439, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 8, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cache_write_tokens': None, 'cached_tokens': 256}}"
                      }
                    }
                  ],
                  "status": {
                    "code": "STATUS_CODE_OK"
                  },
                  "flags": 256
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "braintrust": {
    "label": "Braintrust",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "f8c23f0f-9de0-4af9-a80e-b8ae33c09e8b"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "capture"
              },
              "spans": [
                {
                  "traceId": "6d063eab821e3b0554ca3f58087069cd",
                  "spanId": "39f8243faea70e00",
                  "name": "support_triage",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788791462011552000",
                  "endTimeUnixNano": "1788791462234235000",
                  "attributes": [
                    {
                      "key": "braintrust.input_json",
                      "value": {
                        "stringValue": "[{\"role\": \"system\", \"content\": \"You are a support agent. Use the tools you are given.\"}, {\"role\": \"user\", \"content\": \"Where is order A-1187?\"}]"
                      }
                    },
                    {
                      "key": "braintrust.output_json",
                      "value": {
                        "stringValue": "[{\"content\": null, \"refusal\": null, \"role\": \"assistant\", \"annotations\": null, \"audio\": null, \"function_call\": null, \"tool_calls\": [{\"id\": \"call_9RtYbK2mXqLp\", \"function\": {\"arguments\": \"{\\\"order_id\\\": \\\"A-1187\\\"}\", \"name\": \"lookup_order\"}, \"type\": \"function\"}]}]"
                      }
                    },
                    {
                      "key": "braintrust.expected_json",
                      "value": {
                        "stringValue": "{\"tool\": \"lookup_order\"}"
                      }
                    },
                    {
                      "key": "braintrust.metrics",
                      "value": {
                        "stringValue": "{\"prompt_tokens\": 412, \"completion_tokens\": 27, \"tokens\": 439}"
                      }
                    },
                    {
                      "key": "braintrust.scores",
                      "value": {
                        "stringValue": "{\"correctness\": 1.0}"
                      }
                    },
                    {
                      "key": "braintrust.metadata",
                      "value": {
                        "stringValue": "{\"model\": \"gpt-4o-mini-2024-07-18\"}"
                      }
                    },
                    {
                      "key": "braintrust.tags",
                      "value": {
                        "stringValue": "[\"support\", \"triage\"]"
                      }
                    },
                    {
                      "key": "braintrust.span_attributes",
                      "value": {
                        "stringValue": "{\"type\": \"llm\", \"name\": \"support_triage\"}"
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "braintrust.context_json",
                      "value": {
                        "stringValue": "{\"span_origin\": {\"name\": \"braintrust.sdk.python\", \"version\": \"0.37.0\", \"instrumentation\": {\"name\": \"braintrust-python-otel\"}}}"
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        },
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "f8c23f0f-9de0-4af9-a80e-b8ae33c09e8b"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "capture"
              },
              "spans": [
                {
                  "traceId": "d7e0b60abf31dd5459358df206e2eca9",
                  "spanId": "223a2b562e226a6e",
                  "name": "grade",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788791462238186000",
                  "endTimeUnixNano": "1788791462238223000",
                  "attributes": [
                    {
                      "key": "braintrust.scores",
                      "value": {
                        "stringValue": "{\"correctness\": 1.0, \"helpfulness\": 0.8, \"tone\": 0.9}"
                      }
                    },
                    {
                      "key": "braintrust.span_attributes",
                      "value": {
                        "stringValue": "{\"type\": \"score\", \"name\": \"grade\"}"
                      }
                    },
                    {
                      "key": "braintrust.context_json",
                      "value": {
                        "stringValue": "{\"span_origin\": {\"name\": \"braintrust.sdk.python\", \"version\": \"0.37.0\", \"instrumentation\": {\"name\": \"braintrust-python-otel\"}}}"
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "langchain": {
    "label": "LangChain (via OpenLLMetry)",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "ed4b7cb9-d709-421a-8376-1b10b6290f8f"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "opentelemetry.instrumentation.langchain",
                "version": "0.62.3"
              },
              "spans": [
                {
                  "traceId": "6f90f87ed5d0f8a0c4b41963e9b38196",
                  "spanId": "3a3a344bfda68a2b",
                  "parentSpanId": "752dc54771fab224",
                  "name": "execute_task ChatPromptTemplate",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788793002974209000",
                  "endTimeUnixNano": "1788793002974475000",
                  "attributes": [
                    {
                      "key": "traceloop.workflow.name",
                      "value": {
                        "stringValue": "RunnableSequence"
                      }
                    },
                    {
                      "key": "traceloop.entity.path",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "traceloop.span.kind",
                      "value": {
                        "stringValue": "task"
                      }
                    },
                    {
                      "key": "traceloop.entity.name",
                      "value": {
                        "stringValue": "ChatPromptTemplate"
                      }
                    },
                    {
                      "key": "gen_ai.provider.name",
                      "value": {
                        "stringValue": "langchain"
                      }
                    },
                    {
                      "key": "gen_ai.operation.name",
                      "value": {
                        "stringValue": "execute_task"
                      }
                    },
                    {
                      "key": "gen_ai.task.name",
                      "value": {
                        "stringValue": "ChatPromptTemplate"
                      }
                    },
                    {
                      "key": "gen_ai.task.id",
                      "value": {
                        "stringValue": "01a07c5f-1bde-7b92-88bc-93c94048143e"
                      }
                    },
                    {
                      "key": "gen_ai.task.parent.id",
                      "value": {
                        "stringValue": "01a07c5f-1bdd-7281-94cd-8b69edc35287"
                      }
                    },
                    {
                      "key": "traceloop.entity.input",
                      "value": {
                        "stringValue": "{\"inputs\": {\"question\": \"Where is order A-1187?\"}, \"tags\": [\"seq:step:1\"], \"metadata\": {}, \"kwargs\": {\"run_type\": \"prompt\", \"name\": \"ChatPromptTemplate\"}}"
                      }
                    },
                    {
                      "key": "gen_ai.task.input",
                      "value": {
                        "stringValue": "{\"inputs\": {\"question\": \"Where is order A-1187?\"}, \"tags\": [\"seq:step:1\"], \"metadata\": {}, \"kwargs\": {\"run_type\": \"prompt\", \"name\": \"ChatPromptTemplate\"}}"
                      }
                    },
                    {
                      "key": "gen_ai.task.status",
                      "value": {
                        "stringValue": "success"
                      }
                    },
                    {
                      "key": "traceloop.entity.output",
                      "value": {
                        "stringValue": "{\"outputs\": {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"prompts\", \"chat\", \"ChatPromptValue\"], \"kwargs\": {\"messages\": [{\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"SystemMessage\"], \"kwargs\": {\"content\": \"You are a support agent. Use the tools you are given.\", \"type\": \"system\"}}, {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"HumanMessage\"], \"kwargs\": {\"content\": \"Where is order A-1187?\", \"type\": \"human\"}}]}}, \"kwargs\": {\"tags\": [\"seq:step:1\"]}}"
                      }
                    },
                    {
                      "key": "gen_ai.task.output",
                      "value": {
                        "stringValue": "{\"outputs\": {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"prompts\", \"chat\", \"ChatPromptValue\"], \"kwargs\": {\"messages\": [{\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"SystemMessage\"], \"kwargs\": {\"content\": \"You are a support agent. Use the tools you are given.\", \"type\": \"system\"}}, {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"HumanMessage\"], \"kwargs\": {\"content\": \"Where is order A-1187?\", \"type\": \"human\"}}]}}, \"kwargs\": {\"tags\": [\"seq:step:1\"]}}"
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        },
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "ed4b7cb9-d709-421a-8376-1b10b6290f8f"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "opentelemetry.instrumentation.langchain",
                "version": "0.62.3"
              },
              "spans": [
                {
                  "traceId": "6f90f87ed5d0f8a0c4b41963e9b38196",
                  "spanId": "ce8aa43dd4ccb4a2",
                  "parentSpanId": "752dc54771fab224",
                  "name": "ChatOpenAI.chat",
                  "kind": "SPAN_KIND_CLIENT",
                  "startTimeUnixNano": "1788793002978280000",
                  "endTimeUnixNano": "1788793003005671000",
                  "attributes": [
                    {
                      "key": "traceloop.workflow.name",
                      "value": {
                        "stringValue": "RunnableSequence"
                      }
                    },
                    {
                      "key": "traceloop.entity.path",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "traceloop.association.properties.ls_provider",
                      "value": {
                        "stringValue": "openai"
                      }
                    },
                    {
                      "key": "traceloop.association.properties.ls_model_name",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "traceloop.association.properties.ls_model_type",
                      "value": {
                        "stringValue": "chat"
                      }
                    },
                    {
                      "key": "traceloop.association.properties.ls_temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "traceloop.association.properties.ls_max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "traceloop.association.properties.ls_integration",
                      "value": {
                        "stringValue": "langchain_chat_model"
                      }
                    },
                    {
                      "key": "traceloop.association.properties.lc_versions",
                      "value": {
                        "stringValue": "{'langchain-core': '1.6.2', 'langchain': '1.4.0', 'langchain-openai': '1.6.0'}"
                      }
                    },
                    {
                      "key": "gen_ai.provider.name",
                      "value": {
                        "stringValue": "openai"
                      }
                    },
                    {
                      "key": "gen_ai.operation.name",
                      "value": {
                        "stringValue": "chat"
                      }
                    },
                    {
                      "key": "gen_ai.tool.definitions",
                      "value": {
                        "stringValue": "[{\"name\": \"lookup_order\", \"description\": \"Look up an order by its identifier.\", \"parameters\": {\"type\": \"object\", \"properties\": {\"order_id\": {\"type\": \"string\"}}, \"required\": [\"order_id\"]}}]"
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.request.max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "gen_ai.request.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "gen_ai.request.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "gen_ai.system_instructions",
                      "value": {
                        "stringValue": "[{\"type\": \"text\", \"content\": \"You are a support agent. Use the tools you are given.\"}]"
                      }
                    },
                    {
                      "key": "gen_ai.input.messages",
                      "value": {
                        "stringValue": "[{\"role\": \"user\", \"parts\": [{\"type\": \"text\", \"content\": \"Where is order A-1187?\"}]}]"
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "gen_ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "gen_ai.usage.input_tokens",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "gen_ai.usage.output_tokens",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "gen_ai.usage.total_tokens",
                      "value": {
                        "intValue": "439"
                      }
                    },
                    {
                      "key": "gen_ai.usage.cache_read.input_tokens",
                      "value": {
                        "intValue": "256"
                      }
                    },
                    {
                      "key": "gen_ai.output.messages",
                      "value": {
                        "stringValue": "[{\"role\": \"assistant\", \"parts\": [{\"type\": \"tool_call\", \"id\": \"call_9RtYbK2mXqLp\", \"name\": \"lookup_order\", \"arguments\": {\"order_id\": \"A-1187\"}}], \"finish_reason\": \"tool_call\"}]"
                      }
                    },
                    {
                      "key": "gen_ai.response.finish_reasons",
                      "value": {
                        "arrayValue": {
                          "values": [
                            {
                              "stringValue": "tool_call"
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        },
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "ed4b7cb9-d709-421a-8376-1b10b6290f8f"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "opentelemetry.instrumentation.langchain",
                "version": "0.62.3"
              },
              "spans": [
                {
                  "traceId": "6f90f87ed5d0f8a0c4b41963e9b38196",
                  "spanId": "752dc54771fab224",
                  "name": "RunnableSequence.workflow",
                  "kind": "SPAN_KIND_INTERNAL",
                  "startTimeUnixNano": "1788793002973880000",
                  "endTimeUnixNano": "1788793003008018000",
                  "attributes": [
                    {
                      "key": "traceloop.workflow.name",
                      "value": {
                        "stringValue": "RunnableSequence"
                      }
                    },
                    {
                      "key": "traceloop.entity.path",
                      "value": {
                        "stringValue": ""
                      }
                    },
                    {
                      "key": "traceloop.span.kind",
                      "value": {
                        "stringValue": "workflow"
                      }
                    },
                    {
                      "key": "traceloop.entity.name",
                      "value": {
                        "stringValue": "RunnableSequence"
                      }
                    },
                    {
                      "key": "gen_ai.provider.name",
                      "value": {
                        "stringValue": "langchain"
                      }
                    },
                    {
                      "key": "gen_ai.operation.name",
                      "value": {
                        "stringValue": "invoke_agent"
                      }
                    },
                    {
                      "key": "gen_ai.agent.name",
                      "value": {
                        "stringValue": "RunnableSequence"
                      }
                    },
                    {
                      "key": "gen_ai.agent.id",
                      "value": {
                        "stringValue": "01a07c5f-1bdd-7281-94cd-8b69edc35287"
                      }
                    },
                    {
                      "key": "traceloop.entity.input",
                      "value": {
                        "stringValue": "{\"inputs\": {\"question\": \"Where is order A-1187?\"}, \"tags\": [], \"metadata\": {}, \"kwargs\": {\"name\": \"RunnableSequence\"}}"
                      }
                    },
                    {
                      "key": "gen_ai.task.input",
                      "value": {
                        "stringValue": "{\"inputs\": {\"question\": \"Where is order A-1187?\"}, \"tags\": [], \"metadata\": {}, \"kwargs\": {\"name\": \"RunnableSequence\"}}"
                      }
                    },
                    {
                      "key": "gen_ai.task.status",
                      "value": {
                        "stringValue": "success"
                      }
                    },
                    {
                      "key": "traceloop.entity.output",
                      "value": {
                        "stringValue": "{\"outputs\": {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"AIMessage\"], \"kwargs\": {\"content\": \"\", \"additional_kwargs\": {\"refusal\": null}, \"response_metadata\": {\"token_usage\": {\"completion_tokens\": 27, \"prompt_tokens\": 412, \"total_tokens\": 439, \"completion_tokens_details\": {\"accepted_prediction_tokens\": 0, \"audio_tokens\": 0, \"reasoning_tokens\": 8, \"rejected_prediction_tokens\": 0, \"text_tokens\": null}, \"prompt_tokens_details\": {\"audio_tokens\": 0, \"cache_write_tokens\": null, \"cached_tokens\": 256, \"image_tokens\": null, \"text_tokens\": null}}, \"model_provider\": \"openai\", \"model_name\": \"gpt-4o-mini-2024-07-18\", \"system_fingerprint\": \"fp_capture0\", \"id\": \"chatcmpl-CD8yqQ2y3kZs1o0Wm7bT\", \"finish_reason\": \"tool_calls\", \"logprobs\": null}, \"type\": \"ai\", \"id\": \"lc_run--01a07c5f-1be2-73d3-ae58-78305d22ab95-0\", \"tool_calls\": [{\"name\": \"lookup_order\", \"args\": {\"order_id\": \"A-1187\"}, \"id\": \"call_9RtYbK2mXqLp\", \"type\": \"tool_call\"}], \"usage_metadata\": {\"input_tokens\": 412, \"output_tokens\": 27, \"total_tokens\": 439, \"input_token_details\": {\"audio\": 0, \"cache_read\": 256}, \"output_token_details\": {\"audio\": 0, \"reasoning\": 8}}, \"invalid_tool_calls\": []}}, \"kwargs\": {\"tags\": []}}"
                      }
                    },
                    {
                      "key": "gen_ai.task.output",
                      "value": {
                        "stringValue": "{\"outputs\": {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"AIMessage\"], \"kwargs\": {\"content\": \"\", \"additional_kwargs\": {\"refusal\": null}, \"response_metadata\": {\"token_usage\": {\"completion_tokens\": 27, \"prompt_tokens\": 412, \"total_tokens\": 439, \"completion_tokens_details\": {\"accepted_prediction_tokens\": 0, \"audio_tokens\": 0, \"reasoning_tokens\": 8, \"rejected_prediction_tokens\": 0, \"text_tokens\": null}, \"prompt_tokens_details\": {\"audio_tokens\": 0, \"cache_write_tokens\": null, \"cached_tokens\": 256, \"image_tokens\": null, \"text_tokens\": null}}, \"model_provider\": \"openai\", \"model_name\": \"gpt-4o-mini-2024-07-18\", \"system_fingerprint\": \"fp_capture0\", \"id\": \"chatcmpl-CD8yqQ2y3kZs1o0Wm7bT\", \"finish_reason\": \"tool_calls\", \"logprobs\": null}, \"type\": \"ai\", \"id\": \"lc_run--01a07c5f-1be2-73d3-ae58-78305d22ab95-0\", \"tool_calls\": [{\"name\": \"lookup_order\", \"args\": {\"order_id\": \"A-1187\"}, \"id\": \"call_9RtYbK2mXqLp\", \"type\": \"tool_call\"}], \"usage_metadata\": {\"input_tokens\": 412, \"output_tokens\": 27, \"total_tokens\": 439, \"input_token_details\": {\"audio\": 0, \"cache_read\": 256}, \"output_token_details\": {\"audio\": 0, \"reasoning\": 8}}, \"invalid_tool_calls\": []}}, \"kwargs\": {\"tags\": []}}"
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "raw": {
    "label": "OpenTelemetry's own instrumentation",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "telemetry.sdk.language",
                "value": {
                  "stringValue": "python"
                }
              },
              {
                "key": "telemetry.sdk.name",
                "value": {
                  "stringValue": "opentelemetry"
                }
              },
              {
                "key": "telemetry.sdk.version",
                "value": {
                  "stringValue": "1.44.0"
                }
              },
              {
                "key": "service.instance.id",
                "value": {
                  "stringValue": "613a5879-7753-4813-96a4-4148d45b49c4"
                }
              },
              {
                "key": "service.name",
                "value": {
                  "stringValue": "capture"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "opentelemetry.util.genai.handler",
                "version": "1.1b0"
              },
              "spans": [
                {
                  "traceId": "053074667b1113278073667614bb3e19",
                  "spanId": "03491beea3cb073d",
                  "name": "chat gpt-4o-mini",
                  "kind": "SPAN_KIND_CLIENT",
                  "startTimeUnixNano": "1788792074027616000",
                  "endTimeUnixNano": "1788792074047335000",
                  "attributes": [
                    {
                      "key": "gen_ai.operation.name",
                      "value": {
                        "stringValue": "chat"
                      }
                    },
                    {
                      "key": "gen_ai.request.model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "gen_ai.provider.name",
                      "value": {
                        "stringValue": "openai"
                      }
                    },
                    {
                      "key": "gen_ai.request.temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "gen_ai.request.top_p",
                      "value": {
                        "doubleValue": 0.95
                      }
                    },
                    {
                      "key": "gen_ai.request.max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "gen_ai.response.finish_reasons",
                      "value": {
                        "arrayValue": {
                          "values": [
                            {
                              "stringValue": "tool_calls"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "key": "gen_ai.response.model",
                      "value": {
                        "stringValue": "gpt-4o-mini-2024-07-18"
                      }
                    },
                    {
                      "key": "gen_ai.response.id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "gen_ai.usage.input_tokens",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "gen_ai.usage.output_tokens",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "gen_ai.input.messages",
                      "value": {
                        "stringValue": "[{\"role\":\"system\",\"parts\":[{\"content\":\"You are a support agent. Use the tools you are given.\",\"type\":\"text\"}]},{\"role\":\"user\",\"parts\":[{\"content\":\"Where is order A-1187?\",\"type\":\"text\"}]}]"
                      }
                    },
                    {
                      "key": "gen_ai.output.messages",
                      "value": {
                        "stringValue": "[{\"role\":\"assistant\",\"parts\":[{\"arguments\":{\"order_id\":\"A-1187\"},\"name\":\"lookup_order\",\"id\":\"call_9RtYbK2mXqLp\",\"type\":\"tool_call\"}],\"finish_reason\":\"tool_calls\"}]"
                      }
                    },
                    {
                      "key": "openai.response.system_fingerprint",
                      "value": {
                        "stringValue": "fp_capture0"
                      }
                    }
                  ],
                  "status": {},
                  "flags": 256
                }
              ],
              "schemaUrl": "https://opentelemetry.io/schemas/1.37.0"
            }
          ]
        }
      ]
    }
  },
  "raw-folk": {
    "label": "Hand-rolled attribute names",
    "payload": {
      "resourceSpans": [
        {
          "resource": {
            "attributes": [
              {
                "key": "service.name",
                "value": {
                  "stringValue": "internal-tools"
                }
              }
            ]
          },
          "scopeSpans": [
            {
              "scope": {
                "name": "internal-tools/llm",
                "version": ""
              },
              "spans": [
                {
                  "traceId": "0d1e2f3a4b5c6d7e8f90a1b2c3d4e5f6",
                  "spanId": "a1b2c3d4e5f60718",
                  "name": "call_model",
                  "kind": 3,
                  "startTimeUnixNano": "1749841200000000000",
                  "endTimeUnixNano": "1749841201740000000",
                  "attributes": [
                    {
                      "key": "model",
                      "value": {
                        "stringValue": "gpt-4o-mini"
                      }
                    },
                    {
                      "key": "provider",
                      "value": {
                        "stringValue": "OpenAI"
                      }
                    },
                    {
                      "key": "temperature",
                      "value": {
                        "doubleValue": 0.7
                      }
                    },
                    {
                      "key": "max_tokens",
                      "value": {
                        "intValue": "1024"
                      }
                    },
                    {
                      "key": "prompt_tokens",
                      "value": {
                        "intValue": "412"
                      }
                    },
                    {
                      "key": "completion_tokens",
                      "value": {
                        "intValue": "27"
                      }
                    },
                    {
                      "key": "total_tokens",
                      "value": {
                        "intValue": "439"
                      }
                    },
                    {
                      "key": "finish_reason",
                      "value": {
                        "stringValue": "stop"
                      }
                    },
                    {
                      "key": "request_id",
                      "value": {
                        "stringValue": "chatcmpl-CD8yqQ2y3kZs1o0Wm7bT"
                      }
                    },
                    {
                      "key": "prompt",
                      "value": {
                        "stringValue": "Where is order A-1187?"
                      }
                    },
                    {
                      "key": "completion",
                      "value": {
                        "stringValue": "Let me check that for you."
                      }
                    },
                    {
                      "key": "gen_ai.retry_count",
                      "value": {
                        "intValue": "1"
                      }
                    },
                    {
                      "key": "llm.cache_hit",
                      "value": {
                        "boolValue": false
                      }
                    },
                    {
                      "key": "user_id",
                      "value": {
                        "stringValue": "u-7741"
                      }
                    }
                  ],
                  "status": {}
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
