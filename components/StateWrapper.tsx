// components/StateWrapper.tsx
import React from "react";

interface StateWrapperProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  children: React.ReactNode;
}

export const StateWrapper: React.FC<StateWrapperProps> = ({ loading, error, empty, children }) => {
  if (loading) {
    return <div className="flex items-center justify-center py-8">⏳ Loading...</div>;
  }
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <strong>❌ Error:</strong> {error}
      </div>
    );
  }
  if (empty) {
    return (
      <div className="p-4 text-gray-500 italic">No data to display.</div>
    );
  }
  return <>{children}</>;
};

export default StateWrapper;
