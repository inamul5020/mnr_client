interface Section {
  id: string;
  title: string;
  description: string;
}

interface FormProgressProps {
  sections: Section[];
  currentSection: number;
}

export function FormProgress({ sections, currentSection }: FormProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentSection
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900">
                  {section.title}
                </p>
                <p className="text-xs text-gray-500">
                  {section.description}
                </p>
              </div>
            </div>
            {index < sections.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  index < currentSection ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
