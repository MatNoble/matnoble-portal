# DNS-AID Publication Notes

DNS for AI Discovery records must be published in the public DNS zone for `matnoble.top`; they cannot be deployed from the VitePress static site repository alone.

Publish SVCB or HTTPS records under the `_agents.matnoble.top` discovery namespace after confirming the final agent endpoints. A minimal HTTPS/SVCB-style template is:

```txt
_index._agents.matnoble.top. 3600 IN HTTPS 1 matnoble.top. alpn="h2,h3" endpoint="https://matnoble.top/.well-known/agent-skills/index.json"
_a2a._agents.matnoble.top.   3600 IN HTTPS 1 matnoble.top. alpn="h2,h3" endpoint="https://matnoble.top/.well-known/mcp/server-card.json"
```

Operational requirements:

- Enable DNSSEC signing for the public `matnoble.top` zone.
- Confirm validating resolvers return authenticated data for the discovery records.
- Keep the `endpoint` values aligned with the well-known agent discovery documents served by the site.
- Re-run the agent readiness check after DNS propagation.
