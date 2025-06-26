
/**
 * Error boundary that prevents sensitive information leakage
 */

import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logSecurityViolation } from '@/utils/securityLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class SecureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for tracking
    const errorId = Math.random().toString(36).substring(2, 15);
    
    // Log the error securely (without exposing sensitive data)
    logSecurityViolation('', 'application_error', {
      error_id: errorId,
      error_type: error.name,
      // Don't log the full error message or stack trace to prevent info leakage
      has_stack: !!error.stack
    });

    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In production, this would send error details to a secure logging service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-400 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Error ID: {this.state.errorId}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
