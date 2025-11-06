"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you could log to an error reporting service
    // Example: logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-destructive/10 rounded-full">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle>Something went wrong</CardTitle>
                  <CardDescription className="mt-1">
                    {`We encountered an unexpected error. Don't worry, your data
                    is safe.`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">What happened?</p>
                <p className="text-sm text-muted-foreground">
                  An unexpected error occurred. This might be a temporary issue.
                  Your time entries are stored locally and are safe.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="p-3 bg-muted rounded-md border border-destructive/20">
                  <p className="text-xs font-semibold text-destructive mb-2">
                    Error Details (Development Only):
                  </p>
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        View stack trace
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-background rounded border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => this.handleReset()}
                  variant="outline"
                  className="flex-1 min-h-[44px]"
                  aria-label="Try again to recover from error"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                  className="flex-1 min-h-[44px]"
                  aria-label="Reload the page"
                >
                  Reload Page
                </Button>
              </div>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>
                  If this problem persists, please check your browser console or
                  contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
