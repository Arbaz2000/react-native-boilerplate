# src/services

### One Job
Underlying platform services:
- `api/`: Axios client, request/response telemetry & auth interceptors, endpoints registry
- `storage/`: Hardware-backed Keychain storage (`secureStorage.ts`) and typed AsyncStorage (`asyncStorage.ts`)
- `encryption/`: AES-ready encryption stubs and hashing (`crypto.ts`)
- `version/`: Semver comparisons (`versionComparator.ts`)
