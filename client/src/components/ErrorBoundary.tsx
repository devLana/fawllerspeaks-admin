import * as React from "react";

interface Props {
  fallback: React.ReactElement;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // componentDidCatch(error: Error, info: React.ErrorInfo) {
  componentDidCatch() {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    // console.log({ error, info: info.componentStack });
  }

  render() {
    if (this.state.hasError) return this.props.fallback;

    return this.props.children;
  }
}
