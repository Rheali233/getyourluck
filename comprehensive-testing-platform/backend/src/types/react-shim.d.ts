// Ambient React namespace shim for backend type-checking
// Avoids bringing React types into the Cloudflare Workers backend build

declare namespace React {
	// Minimal placeholder used by shared component interface types
	type ReactNode = unknown;
}


