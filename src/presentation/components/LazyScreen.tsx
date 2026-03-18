import React, {Suspense} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

function ScreenLoadingFallback() {
  return (
    <View style={styles.centered} testID="lazy-screen-loading">
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

class ScreenErrorBoundary extends React.Component<
  {children: React.ReactNode},
  ErrorState
> {
  state: ErrorState = {hasError: false, error: null};

  static getDerivedStateFromError(error: Error): ErrorState {
    return {hasError: true, error};
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Failed to load screen</Text>
          <Text style={styles.errorDetail}>
            {this.state.error?.message ?? 'Unknown error'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

/**
 * Wraps a dynamic import with React.lazy, Suspense, and error boundary.
 */
export function lazyScreen<P extends object>(
  factory: () => Promise<{default: React.ComponentType<P>}>,
): React.FC<P> {
  const LazyComponent = React.lazy(factory);

  function LazyScreenWrapper(props: P) {
    return (
      <ScreenErrorBoundary>
        <Suspense fallback={<ScreenLoadingFallback />}>
          <LazyComponent {...props} />
        </Suspense>
      </ScreenErrorBoundary>
    );
  }

  return LazyScreenWrapper;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
  },
  errorDetail: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
