import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
