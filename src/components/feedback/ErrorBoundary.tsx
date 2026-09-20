/**
 * src/components/feedback/ErrorBoundary.tsx
 *
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a graceful fallback UI instead of crashing the app.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import env from '@/config/env';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode) | undefined;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught exception:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error!, this.handleReset);
        }
        return this.props.fallback;
      }

      return (
        <View testID="error-boundary-fallback" style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected application error occurred. The screen was safely isolated to prevent an app crash.
            </Text>

            {env.isDevelopment && this.state.error && (
              <ScrollView style={styles.debugBox}>
                <Text style={styles.debugText}>
                  {this.state.error.name}: {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text style={styles.debugStack}>{this.state.error.stack}</Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              testID="error-boundary-retry-btn"
              activeOpacity={0.8}
              onPress={this.handleReset}
              style={styles.retryBtn}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0A0E1A',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#131927',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1F293D',
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugBox: {
    maxHeight: 120,
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  debugText: {
    color: '#F87171',
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: '600',
  },
  debugStack: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier',
    marginTop: 4,
  },
  retryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
