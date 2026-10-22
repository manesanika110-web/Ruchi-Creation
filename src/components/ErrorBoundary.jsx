import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#18060C] text-[#FAF5EB] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#240B13] border border-[#4D1B28] rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-xl text-white">Something went wrong</h2>
            <p className="text-xs text-[#D4B8C1] leading-relaxed">
              An unexpected display issue occurred. Your data has been preserved. Please refresh the page to continue.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-full bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
