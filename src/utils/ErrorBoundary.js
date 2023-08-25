import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Caught an error:", error, info);
    // You can also log the error to an analytics service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <p>Something went wrong.</p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
