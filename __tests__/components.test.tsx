import React from 'react';
import { Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { Card } from '../src/components/ui/Card';
import { SafeScreen } from '../src/components/layout/SafeScreen';
import { TabBarIcon } from '../src/components/layout/TabBarIcon';
import { Toast } from '../src/components/feedback/Toast';
import { Skeleton } from '../src/components/feedback/Skeleton';
import { ErrorBoundary } from '../src/components/feedback/ErrorBoundary';
import { AppProviders } from '../src/app/providers';
import { useUIStore } from '../src/store/zustand/useUIStore';
import { server } from '../src/mocks/server';

// Setup MSW for tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Phase H Components & MSW Unit Tests', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  afterEach(async () => {
    if (renderer) {
      await ReactTestRenderer.act(async () => {
        renderer?.unmount();
      });
      renderer = undefined;
    }
    useUIStore.getState().hideToast();
  });

  describe('Button Component', () => {
    it('renders label and handles press event', async () => {
      const onPressMock = jest.fn();

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Button testID="test-btn" label="Click Me" onPress={onPressMock} />
          </AppProviders>,
        );
      });

      const btn = renderer?.root.findByProps({ testID: 'test-btn' });
      expect(btn).toBeDefined();

      await ReactTestRenderer.act(async () => {
        btn?.props.onPress();
      });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('shows loading indicator and prevents press when loading', async () => {
      const onPressMock = jest.fn();

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Button
              testID="test-btn-loading"
              label="Submit"
              onPress={onPressMock}
              loading={true}
            />
          </AppProviders>,
        );
      });

      const touchable = renderer?.root.findByType(TouchableOpacity);
      expect(touchable?.props.disabled).toBe(true);

      const indicator = renderer?.root.findByType(ActivityIndicator);
      expect(indicator).toBeDefined();
    });
  });

  describe('Input Component', () => {
    it('renders with label and updates text', async () => {
      const onChangeMock = jest.fn();

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Input
              testID="test-input"
              label="Username"
              placeholder="Enter name"
              value="Arbaz"
              onChangeText={onChangeMock}
            />
          </AppProviders>,
        );
      });

      const input = renderer?.root.findByProps({ testID: 'test-input' });
      expect(input.props.value).toBe('Arbaz');

      await ReactTestRenderer.act(async () => {
        input.props.onChangeText('NewName');
      });
      expect(onChangeMock).toHaveBeenCalledWith('NewName');
    });

    it('displays error message when provided', async () => {
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Input label="Email" error="Invalid email address format" />
          </AppProviders>,
        );
      });

      const texts = renderer?.root.findAllByType(Text);
      const hasError = texts?.some(
        (t) => t.props.children === 'Invalid email address format',
      );
      expect(hasError).toBe(true);
    });
  });

  describe('Card Component', () => {
    it('renders children and handles optional onPress', async () => {
      const onPressMock = jest.fn();

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Card testID="test-card" onPress={onPressMock}>
              <Text>Card Content Inside</Text>
            </Card>
          </AppProviders>,
        );
      });

      const card = renderer?.root.findByProps({ testID: 'test-card' });
      expect(card).toBeDefined();

      await ReactTestRenderer.act(async () => {
        card?.props.onPress();
      });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout Components', () => {
    it('renders SafeScreen container', async () => {
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <SafeScreen testID="safe-screen">
              <Text>Safe Content</Text>
            </SafeScreen>
          </AppProviders>,
        );
      });

      const screen = renderer?.root.findByProps({ testID: 'safe-screen' });
      expect(screen).toBeDefined();
    });

    it('renders TabBarIcon with focus and badge count', async () => {
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <TabBarIcon
              name="Home"
              focused={true}
              color="#000"
              badgeCount={3}
            />
          </AppProviders>,
        );
      });

      const texts = renderer?.root.findAllByType(Text);
      const hasBadge = texts?.some((t) => t.props.children === 3);
      expect(hasBadge).toBe(true);
    });
  });

  describe('Feedback Components', () => {
    it('renders active Toast when triggered in store', async () => {
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Text>App Container View</Text>
          </AppProviders>,
        );
      });

      // Initially no toast
      expect(renderer?.root.findAllByProps({ testID: 'global-toast' })).toHaveLength(0);

      // Trigger toast
      await ReactTestRenderer.act(async () => {
        useUIStore.getState().showToast('Profile updated successfully!', 'success');
      });

      const toast = renderer?.root.findByProps({ testID: 'global-toast' });
      expect(toast).toBeDefined();
    });

    it('renders Skeleton loader placeholder', async () => {
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <AppProviders>
            <Skeleton testID="skeleton-card" width={200} height={24} />
          </AppProviders>,
        );
      });

      const skeleton = renderer?.root.findByProps({ testID: 'skeleton-card' });
      expect(skeleton).toBeDefined();
    });

    it('catches render errors gracefully with ErrorBoundary', async () => {
      const BadComponent = () => {
        throw new Error('Explosion in child component');
      };

      // Suppress console.error during expected throw test
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <ErrorBoundary>
            <BadComponent />
          </ErrorBoundary>,
        );
      });

      const fallback = renderer?.root.findByProps({
        testID: 'error-boundary-fallback',
      });
      expect(fallback).toBeDefined();

      const retryBtn = renderer?.root.findByProps({
        testID: 'error-boundary-retry-btn',
      });
      expect(retryBtn).toBeDefined();

      spy.mockRestore();
    });
  });

  describe('MSW Mock Server Handlers', () => {
    it('intercepts login requests with mock user and tokens', async () => {
      const response = await fetch('https://api.dev.example.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@example.com',
          password: 'Password123!',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user.email).toBe('demo@example.com');
      expect(data.tokens.accessToken).toBe('mock_jwt_access_token_xyz');
    });

    it('intercepts remote config endpoint', async () => {
      const response = await fetch('https://api.dev.example.com/config/app');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.minSupportedVersion).toBe('1.0.0');
      expect(data.featureFlags.enableBiometrics).toBe(true);
    });
  });
});
