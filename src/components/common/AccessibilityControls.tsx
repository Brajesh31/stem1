import React from 'react';
import { Settings, Eye, Volume2, Type } from 'lucide-react';

interface AccessibilityControlsProps {
  className?: string;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);
  const [highContrast, setHighContrast] = React.useState(false);
  const [screenReader, setScreenReader] = React.useState(false);

  const toggleControls = () => {
    setIsOpen(!isOpen);
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
  };

  const toggleScreenReader = () => {
    setScreenReader(!screenReader);
    // Screen reader support logic would go here
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <button
        onClick={toggleControls}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="Open accessibility controls"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Accessibility Controls
          </h3>
          
          <div className="space-y-4">
            {/* Font Size Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Font Size</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => adjustFontSize(-2)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button
                  onClick={() => adjustFontSize(2)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">High Contrast</span>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-12 h-6 rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Screen Reader Support */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Screen Reader</span>
              </div>
              <button
                onClick={toggleScreenReader}
                className={`w-12 h-6 rounded-full transition-colors ${
                  screenReader ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`${screenReader ? 'Disable' : 'Enable'} screen reader support`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    screenReader ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={toggleControls}
            className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;