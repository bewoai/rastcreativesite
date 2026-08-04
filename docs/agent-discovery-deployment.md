# Agent discovery deployment notes

Last reviewed: 2026-08-04

## What ships with the site

- RFC 8288 discovery links on the homepage response
- RFC 9727 API catalog and OpenAPI description for the public, read-only site information API
- Agent Skills discovery index with a SHA-256-pinned `SKILL.md`
- `Accept: text/markdown` negotiation through a Netlify Edge Function
- Content Signals in `robots.txt`
- Read-only WebMCP tools
- A self-contained `auth.md` that states the public endpoints do not use authentication or registration

OAuth/OIDC metadata and an MCP Server Card are intentionally not published. The site does not currently operate an authorization server, protected API, or remote MCP transport. Publishing those documents without working endpoints would be false discovery metadata.

## DNS-AID requires a DNS provider change

The authoritative nameservers observed on 2026-08-04 are:

- `solar.dns-parking.com`
- `lunar.dns-parking.com`

No DS record is currently published for `rastcreative.com`. Hostinger's current documentation says zones using its nameservers do not support DNSSEC, and its DNS editor documentation does not list SVCB/HTTPS among the supported record types. DNS-AID therefore cannot be completed safely in the source repository or in the current DNS zone.

### Recommended production sequence

1. Export and inventory every existing DNS record, especially Netlify, MX, SPF, DKIM, DMARC, CAA, and domain-verification records.
2. Move authoritative DNS to a provider that supports SVCB/HTTPS records and DNSSEC. Keep the website hosted on Netlify; changing authoritative DNS does not require changing the web host.
3. Recreate and verify all existing records before changing nameservers.
4. Enable DNSSEC at the new DNS provider and publish the supplied DS record at the registrar.
5. After the site changes are deployed, publish this organization-index discovery record:

```dns
_index._agents.rastcreative.com. 3600 IN SVCB 1 rastcreative.com. alpn="h2,h3" port=443
```

6. Verify the SVCB response and a validated DNSSEC chain using at least two independent resolvers.

DNS-AID is still an active Internet-Draft. Re-check the current draft before publishing experimental SvcParamKeys or advertising an MCP/A2A protocol. Do not add `alpn="mcp"` or `alpn="a2a"` until a real endpoint supporting that protocol exists.
