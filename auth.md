# Rast Creative auth.md

## Agent audience

Rast Creative Studio publishes public, read-only discovery resources for AI agents and other automated clients.

## Authentication and registration

No authentication, OAuth authorization, agent registration, account provisioning, or credentials are currently required or supported. Do not send bearer tokens, API keys, identity assertions, or personal data to the public discovery endpoints.

## Public endpoints

- Site information: `GET https://rastcreative.com/api/site.json`
- Discovery status: `GET https://rastcreative.com/api/status.json`
- API catalog: `GET https://rastcreative.com/.well-known/api-catalog`
- OpenAPI description: `GET https://rastcreative.com/openapi.json`

All endpoints are read-only. Project enquiries continue through the public contact page at <https://rastcreative.com/iletisim>.
