"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface AIOfficeErrorBoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface AIOfficeErrorBoundaryState {
  hasError: boolean;
}

export class AIOfficeErrorBoundary extends Component<
  AIOfficeErrorBoundaryProps,
  AIOfficeErrorBoundaryState
> {
  state: AIOfficeErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AIOfficeErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AI Office render failure", {
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  componentDidUpdate(previousProps: AIOfficeErrorBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  private retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section
        className="ai-office-light bg-[var(--color-background)] py-[var(--space-section)] text-[var(--color-text-inverse)]"
        aria-labelledby="ai-office-error-title"
      >
        <div className="mx-auto max-w-3xl px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]">
            <h2 id="ai-office-error-title" className="text-xl font-bold">
              Khu vực tư vấn AI tạm thời chưa thể hiển thị.
            </h2>
            <p className="mt-[var(--space-control)] text-sm leading-6 text-[var(--color-danger-text)]">
              Dữ liệu đã lưu trên thiết bị vẫn được giữ nguyên. Hãy thử tải lại khu vực tư vấn.
            </p>
            <button
              type="button"
              onClick={this.retry}
              className="mt-[var(--space-stack)] min-h-[var(--control-min-size)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-stack)] font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-dark)]"
            >
              Thử hiển thị lại
            </button>
          </div>
        </div>
      </section>
    );
  }
}
