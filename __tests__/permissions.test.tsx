import React from 'react';
import { Text, Platform, Linking, PermissionsAndroid } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import {
  PERMISSION_REGISTRY,
  usePermissionStore,
  checkPermission,
  requestPermission,
  openAppSettings,
  type PermissionKey,
} from '../src/features/permissions/permission-registry';
import { PermissionGate } from '../src/features/permissions/PermissionGate';
import { AppProviders } from '../src/app/providers';

describe('Phase G Permissions Unit Tests', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  beforeEach(() => {
    ReactTestRenderer.act(() => {
      usePermissionStore.getState().resetAll();
    });
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (renderer) {
      await ReactTestRenderer.act(async () => {
        renderer?.unmount();
      });
      renderer = undefined;
    }
  });

  describe('Permission Registry Defaults (Spec §3)', () => {
    const keys: PermissionKey[] = [
      'CAMERA',
      'LOCATION',
      'CONTACTS',
      'STORAGE',
      'NOTIFICATIONS',
    ];

    it('has all 5 core permissions registered', () => {
      keys.forEach((key) => {
        expect(PERMISSION_REGISTRY[key]).toBeDefined();
        expect(PERMISSION_REGISTRY[key].title).toBeTruthy();
        expect(PERMISSION_REGISTRY[key].rationale).toBeTruthy();
        expect(PERMISSION_REGISTRY[key].icon).toBeTruthy();
      });
    });

    it('defaults all permissions to "undetermined" (never auto-requested)', () => {
      const state = usePermissionStore.getState();
      keys.forEach((key) => {
        expect(state.statuses[key]).toBe('undetermined');
      });
    });

    it('updates status and resets properly', () => {
      ReactTestRenderer.act(() => {
        usePermissionStore.getState().setStatus('CAMERA', 'granted');
      });
      expect(usePermissionStore.getState().statuses.CAMERA).toBe('granted');

      ReactTestRenderer.act(() => {
        usePermissionStore.getState().resetAll();
      });
      expect(usePermissionStore.getState().statuses.CAMERA).toBe('undetermined');
    });
  });

  describe('openAppSettings', () => {
    it('calls Linking.openSettings', async () => {
      const spy = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined);
      await openAppSettings();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('checkPermission and requestPermission logic', () => {
    it('manages native check and request transitions on Android', async () => {
      const origOS = Platform.OS;
      Platform.OS = 'android';
      try {
        const checkSpy = jest
          .spyOn(PermissionsAndroid, 'check')
          .mockResolvedValue(false);

        const status = await checkPermission('CAMERA');
        expect(status).toBe('undetermined');

        const reqSpy = jest
          .spyOn(PermissionsAndroid, 'request')
          .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

        const requestResult = await requestPermission('CAMERA');
        expect(requestResult).toBe('granted');
        expect(usePermissionStore.getState().statuses.CAMERA).toBe('granted');

        checkSpy.mockRestore();
        reqSpy.mockRestore();
      } finally {
        Platform.OS = origOS;
      }
    });

    it('maps NEVER_ASK_AGAIN to blocked status on Android', async () => {
      const origOS = Platform.OS;
      Platform.OS = 'android';
      try {
        const reqSpy = jest
          .spyOn(PermissionsAndroid, 'request')
          .mockResolvedValue(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);

        const requestResult = await requestPermission('LOCATION');
        expect(requestResult).toBe('blocked');
        expect(usePermissionStore.getState().statuses.LOCATION).toBe('blocked');

        reqSpy.mockRestore();
      } finally {
        Platform.OS = origOS;
      }
    });
  });

  describe('PermissionGate Component', () => {
    it('renders rationale UI when permission is undetermined', async () => {
      ReactTestRenderer.act(() => {
        usePermissionStore.getState().setStatus('CAMERA', 'undetermined');
      });

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <PermissionGate permission="CAMERA">
              <Text testID="protected-content">Camera Scanner Active</Text>
            </PermissionGate>
          </AppProviders>,
        );
      });

      const root = renderer?.root;
      // Protected content should NOT be rendered
      expect(root?.findAllByProps({ testID: 'protected-content' })).toHaveLength(0);

      // Rationale card and allow button should be rendered
      const gate = root?.findByProps({ testID: 'permission-gate-camera' });
      expect(gate).toBeDefined();

      const requestBtn = root?.findByProps({
        testID: 'permission-gate-request-camera',
      });
      expect(requestBtn).toBeDefined();
    });

    it('renders protected child directly when permission is granted', async () => {
      ReactTestRenderer.act(() => {
        usePermissionStore.getState().setStatus('CAMERA', 'granted');
      });

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <PermissionGate permission="CAMERA">
              <Text testID="protected-content">Camera Scanner Active</Text>
            </PermissionGate>
          </AppProviders>,
        );
      });

      const root = renderer?.root;
      // Protected content SHOULD be rendered
      const content = root?.findByProps({ testID: 'protected-content' });
      expect(content).toBeDefined();

      // Rationale UI should NOT be rendered
      expect(root?.findAllByProps({ testID: 'permission-gate-camera' })).toHaveLength(0);
    });

    it('renders open settings button when permission is blocked', async () => {
      ReactTestRenderer.act(() => {
        usePermissionStore.getState().setStatus('LOCATION', 'blocked');
      });

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <PermissionGate permission="LOCATION">
              <Text testID="protected-content">Map Coordinates Active</Text>
            </PermissionGate>
          </AppProviders>,
        );
      });

      const root = renderer?.root;
      const settingsBtn = root?.findByProps({
        testID: 'permission-gate-open-settings-location',
      });
      expect(settingsBtn).toBeDefined();
    });

    it('supports custom fallback render prop', async () => {
      ReactTestRenderer.act(() => {
        usePermissionStore.getState().setStatus('CONTACTS', 'denied');
      });

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <PermissionGate
              permission="CONTACTS"
              fallback={({ status }) => (
                <Text testID="custom-fallback">Custom Status: {status}</Text>
              )}
            >
              <Text testID="protected-content">Contacts List</Text>
            </PermissionGate>
          </AppProviders>,
        );
      });

      const root = renderer?.root;
      const fallback = root?.findByProps({ testID: 'custom-fallback' });
      expect(fallback).toBeDefined();
      expect(fallback.props.children).toEqual(['Custom Status: ', 'denied']);
    });
  });
});
