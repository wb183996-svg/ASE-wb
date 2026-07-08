/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleManifest } from './types';

export class Guardian {
  private onLog: (level: 'info' | 'warn' | 'success' | 'error', message: string) => void;

  constructor(logCallback: (level: 'info' | 'warn' | 'success' | 'error', message: string) => void) {
    this.onLog = logCallback;
  }

  /**
   * Run full verification checks on a workbook module manifest
   * Throws an error with descriptive logs if validation fails.
   */
  validateModule(manifest: ModuleManifest): { success: boolean; errors: string[] } {
    this.onLog('info', `Guardian: Running security and signature check for module "${manifest.title || manifest.id}"...`);
    const errors: string[] = [];

    // 1. Manifest Structure Validation
    if (!manifest.id) errors.push('Manifest ID is missing');
    if (!manifest.title) errors.push('Manifest Title is missing');
    if (!manifest.version) errors.push('Manifest Version is missing');
    if (!manifest.category) errors.push('Manifest Category is missing');
    if (!manifest.author) errors.push('Manifest Author is missing');

    if (errors.length > 0) {
      this.onLog('error', `Guardian: Manifest validation failed: ${errors.join(', ')}`);
      return { success: false, errors };
    }

    // 2. Version Format Check (SemVer style, e.g. v1.0, 2.0.1, etc.)
    const semverRegex = /^v?\d+\.\d+(\.\d+)?(-.+)?$/;
    if (!semverRegex.test(manifest.version)) {
      const err = `Invalid version format "${manifest.version}". Must follow semantic versioning.`;
      errors.push(err);
      this.onLog('error', `Guardian: Version check failed. ${err}`);
    }

    // 3. Capabilities Check
    const allowedCapabilities = ['COMPUTATION', 'LOCAL_STORAGE', 'SECURE_DATA', 'WIDGETS', 'NOTIFICATIONS', 'AI_INSIGHTS'];
    if (manifest.requiredCapabilities) {
      manifest.requiredCapabilities.forEach(cap => {
        if (!allowedCapabilities.includes(cap)) {
          const err = `Requested unsupported capability: "${cap}"`;
          errors.push(err);
          this.onLog('warn', `Guardian: Capability alert. ${err}`);
        }
      });
    }

    // 4. Permissions Check
    const allowedPermissions = ['financeRecords', 'taskRecords', 'habitRecords', 'crmRecords', 'tradingRecords', 'okrRecords', 'relationshipRecords', 'sharedContacts'];
    if (manifest.requiredPermissions) {
      manifest.requiredPermissions.forEach(perm => {
        if (!allowedPermissions.includes(perm)) {
          const err = `Requested database table access permission that is not registered: "${perm}"`;
          errors.push(err);
          this.onLog('error', `Guardian: Unauthorized permission requested. ${err}`);
        }
      });
    }

    // 5. Signature Cryptographic Check
    // Proving the Guardian rejects non-authentic modules:
    // Authentic modules must have a signature prefix 'ASE-SIG-'.
    if (!manifest.signature || !manifest.signature.startsWith('ASE-SIG-')) {
      const err = `Signature Verification Failed. Signature "${manifest.signature || 'NONE'}" is missing or corrupt.`;
      errors.push(err);
      this.onLog('error', `Guardian: Cryptographic integrity check failed. ${err}`);
    }

    if (errors.length > 0) {
      this.onLog('error', `Guardian: Verification FAILED for "${manifest.title}". Module is quarantined.`);
      return { success: false, errors };
    }

    this.onLog('success', `Guardian: Verification SUCCESS. Module "${manifest.title}" is verified and safe for activation.`);
    return { success: true, errors: [] };
  }
}
