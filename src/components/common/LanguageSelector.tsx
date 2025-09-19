import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { multilingualService } from '../../services/multilingualService';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';

const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(multilingualService.getCurrentLanguage());
  
  const supportedLanguages = multilingualService.getSupportedLanguages();

  const handleLanguageChange = (languageCode: string) => {
    multilingualService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsOpen(false);
    
    // Trigger re-render of the app
    window.location.reload();
  };

  const currentLangInfo = supportedLanguages[currentLanguage as keyof typeof supportedLanguages];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLangInfo?.native || 'English'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto">
            <div className="py-2">
              {Object.entries(supportedLanguages).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between ${
                    code === currentLanguage ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div>
                    <div className="font-medium">{info.native}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{info.name}</div>
                  </div>
                  {code === currentLanguage && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;