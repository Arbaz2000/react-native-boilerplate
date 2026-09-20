# src/features

### One Job
Domain-sliced business capabilities isolated from presentation:
- `auth/`: Session slice, RTK Query endpoints, credential models
- `permissions/`: Default-off registry, `usePermission` hook, `PermissionGate` component
- `app-config/`: Remote configuration and feature flags slice
- `deep-linking/`: URL scheme routing and configuration
