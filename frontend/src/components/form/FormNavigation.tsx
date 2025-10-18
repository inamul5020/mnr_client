import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FormNavigationProps {
  currentSection: number;
  totalSections: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function FormNavigation({
  currentSection,
  totalSections,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  isValid
}: FormNavigationProps) {
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentSection === 0}
        className="btn btn-outline inline-flex items-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </button>

      <div className="text-sm text-gray-500">
        Section {currentSection + 1} of {totalSections}
      </div>

      {isLastSection ? (
        <button
          type="submit"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="btn btn-primary inline-flex items-center px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Submit Form
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="btn btn-primary inline-flex items-center px-4 py-2"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      )}
    </div>
  );
}
