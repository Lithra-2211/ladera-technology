# Twenty Frontend Setup Guide

This guide explains how to set up and run the `twenty-frontend` standalone monorepo from scratch on a new machine.

---

## 1. Prerequisites

- **Node.js**: Version `20.x` or `24.x` (recommended). Verify with:
  ```bash
  node -v
  ```
- **Yarn Berry (v4)**: Enable Corepack (comes bundled with Node.js):
  ```bash
  corepack enable
  ```
- **Twenty Backend Server**: Running on `http://localhost:3000` (required for authentication, metadata, and API data).

---

## 2. Quick Setup (Automated)

### Windows (PowerShell):
```powershell
yarn install
Copy-Item packages/twenty-front/.env.example packages/twenty-front/.env
yarn workspace twenty-shared run build
Set-Content -Path "packages/twenty-front-component-renderer/src/remote/sandbox/generated/frontComponentSandboxDocument.ts" -Value 'export const FRONT_COMPONENT_SANDBOX_DOCUMENT = `<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>`;'
yarn dev
```

### macOS / Linux (Bash):
```bash
yarn install
cp packages/twenty-front/.env.example packages/twenty-front/.env
yarn workspace twenty-shared run build
mkdir -p packages/twenty-front-component-renderer/src/remote/sandbox/generated
echo 'export const FRONT_COMPONENT_SANDBOX_DOCUMENT = `<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>`;' > packages/twenty-front-component-renderer/src/remote/sandbox/generated/frontComponentSandboxDocument.ts
yarn dev
```

---

## 3. Detailed Step-by-Step Setup

### Step 1: Install Dependencies
Run Yarn from the repository root to install all workspace dependencies:
```bash
yarn install
```

---

### Step 2: Configure Environment Variables (`.env`)
The frontend loads environment settings from `packages/twenty-front/.env`. Create it from `.env.example`:

- **Windows PowerShell**:
  ```powershell
  Copy-Item packages/twenty-front/.env.example packages/twenty-front/.env
  ```
- **macOS / Linux**:
  ```bash
  cp packages/twenty-front/.env.example packages/twenty-front/.env
  ```

Default configuration in `packages/twenty-front/.env`:
```env
REACT_APP_SERVER_BASE_URL=http://localhost:3000
VITE_BUILD_SOURCEMAP=false
```
> If your backend server runs on a different port or host, update `REACT_APP_SERVER_BASE_URL` accordingly.

---

### Step 3: Build the `twenty-shared` Package
`packages/twenty-front/vite.config.ts` imports plugins and modules from `twenty-shared/vite` and `twenty-shared/types`. Since `dist/` is gitignored, Node cannot resolve them until the package is compiled:

```bash
yarn workspace twenty-shared run build
```

---

### Step 4: Ensure Generated & Stub Files Exist
Vite’s dependency scanner analyzes the entire application tree at startup. If these three files are missing, Vite prints pre-bundling resolution errors:

#### A. Front Component Sandbox Document
Path: `packages/twenty-front-component-renderer/src/remote/sandbox/generated/frontComponentSandboxDocument.ts`  
*(Note: This path is excluded by `.gitignore` so it must be generated locally)*:
- **PowerShell**:
  ```powershell
  Set-Content -Path "packages/twenty-front-component-renderer/src/remote/sandbox/generated/frontComponentSandboxDocument.ts" -Value 'export const FRONT_COMPONENT_SANDBOX_DOCUMENT = `<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>`;'
  ```
- **Bash**:
  ```bash
  mkdir -p packages/twenty-front-component-renderer/src/remote/sandbox/generated
  echo 'export const FRONT_COMPONENT_SANDBOX_DOCUMENT = `<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>`;' > packages/twenty-front-component-renderer/src/remote/sandbox/generated/frontComponentSandboxDocument.ts
  ```

#### B. Enterprise Record Level Filter Builder Component Stub
Path: `packages/twenty-front/src/modules/settings/roles/role-permissions/object-level-permissions/record-level-permissions/components/SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilder.tsx`

File contents:
```tsx
import { EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

export type SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilderProps = {
  roleId: string;
  objectMetadataItem: EnrichedObjectMetadataItem;
};

export const SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilder = ({
  roleId: _roleId,
  objectMetadataItem: _objectMetadataItem,
}: SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilderProps) => {
  return null;
};
```

#### C. Field Permissions Header Row Component Stub
Path: `packages/twenty-front/src/modules/settings/roles/role-permissions/object-level-permissions/field-permissions/components/SettingsRolePermissionsObjectLevelObjectFieldPermissionTableAllHeaderRow.tsx`

File contents:
```tsx
import { EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

export type SettingsRolePermissionsObjectLevelObjectFieldPermissionTableAllHeaderRowProps = {
  roleId: string;
  objectMetadataItem: EnrichedObjectMetadataItem;
};

export const SettingsRolePermissionsObjectLevelObjectFieldPermissionTableAllHeaderRow = ({
  roleId: _roleId,
  objectMetadataItem: _objectMetadataItem,
}: SettingsRolePermissionsObjectLevelObjectFieldPermissionTableAllHeaderRowProps) => {
  return null;
};
```

> **Note**: Stubs B and C can be committed to Git so teammates do not need to create them manually.

---

### Step 5: Check Port 3001 Availability
If an existing Vite or Node process is occupying port 3001, Vite will automatically move to 3002. To clear port 3001:

- **Windows (PowerShell)**:
  ```powershell
  # Find PID:
  Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object OwningProcess

  # Kill PID:
  Stop-Process -Id <PID> -Force
  ```
- **macOS / Linux**:
  ```bash
  lsof -ti :3001 | xargs kill -9
  ```

---

### Step 6: Start the Development Server
```bash
yarn dev
```

Output:
```text
  VITE v8.2.2  ready in ... ms

  ?  Local:   http://localhost:3001/
  ?  Network: use --host to expose
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 4. Troubleshooting & FAQ

### Issue: `Cannot find module '.../node_modules/twenty-shared/dist/vite.mjs'`
- **Cause**: `twenty-shared` has not been compiled yet.
- **Fix**: Run `yarn workspace twenty-shared run build`.

### Issue: `(!) Failed to run dependency scan. Skipping dependency pre-bundling. Error: The following dependencies are imported but could not be resolved...`
- **Cause**: One or more of the 3 stub/generated files in Step 4 are missing.
- **Fix**: Follow Step 4 to create the missing files.

### Issue: Blank page or `Failed to fetch client config / ECONNREFUSED`
- **Cause**: The frontend proxy is attempting to reach the Twenty backend on `http://localhost:3000`, but the backend is not running.
- **Fix**: Make sure your Twenty backend server is started and listening on port 3000.

### Issue: `Port 3001 is in use, trying another one...`
- **Cause**: Another terminal or background process is already running Vite on port 3001.
- **Fix**: Terminate the previous process using the commands in Step 5, or navigate to the new port displayed in the console (e.g., `http://localhost:3002`).

---

## 5. (Recommended) Automating in `package.json`
To avoid having to run `yarn workspace twenty-shared run build` manually every time, update the `dev` script in root `package.json`:

```json
"scripts": {
    "dev": "yarn workspace twenty-shared run build && yarn workspace twenty-front run dev",
    "build": "yarn workspaces foreach -A -t run build"
}
```
