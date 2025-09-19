import React, { useState } from 'react';
import { ChevronDown, BookOpen, Check, AlertCircle } from 'lucide-react';
import { curriculumService } from '../../services/curriculumService';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import type { Class } from '../../types/curriculum';

interface ClassSelectorProps {
  currentClass: Class;
  onClassChange: (newClass: Class) => void;
  className?: string;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ 
  currentClass, 
  onClassChange,
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allClasses = curriculumService.getAllClasses();

  const handleClassSelect = (selectedClass: Class) => {
    if (selectedClass.id === currentClass.id) {
      setIsOpen(false);
      return;
    }

    setShowConfirmation(selectedClass);
    setIsOpen(false);
  };

  const confirmClassChange = async () => {
    if (!showConfirmation) return;

    setIsLoading(true);
    try {
      // Update the curriculum service
      curriculumService.setCurrentClass(showConfirmation.id);
      
      // Notify parent component
      onClassChange(showConfirmation);
      
      dispatch(addNotification({ 
        type: 'success', 
        title: 'Class Changed Successfully', 
        message: `Switched to ${showConfirmation.displayName}. Your dashboard is updating...` 
      }));
      
      setShowConfirmation(null);
    } catch (error) {
      dispatch(addNotification({ 
        type: 'error', 
        title: 'Class Change Failed', 
        message: 'Failed to change class. Please try again.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStreamColor = (stream?: string) => {
    switch (stream) {
      case 'PCM': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'PCB': return 'text-green-600 bg-green-50 border-green-200';
      case 'Commerce': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Humanities': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-secondary border border-primary rounded-lg hover:bg-tertiary focus:outline-none focus-visible:ring-accent transition-all disabled:opacity-50 text-primary min-w-[160px] interactive-glow"
        >
          <BookOpen className="w-4 h-4" />
          <div className="flex-1 text-left">
            <div className="font-medium text-sm">{currentClass.name}</div>
            {currentClass.stream && (
              <div className="text-xs opacity-70">{currentClass.stream}</div>
            )}
          </div>
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-muted border-t-accent-interactive rounded-full animate-spin" />
          ) : (
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-elevated border border-secondary rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto backdrop-blur-lg">
            <div className="py-2">
              {/* Group by grade */}
              {[6, 7, 8, 9, 10, 11, 12].map(grade => {
                const gradeClasses = allClasses.filter(c => c.grade === grade);
                if (gradeClasses.length === 0) return null;

                return (
                  <div key={grade}>
                    <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wide bg-tertiary">
                      Class {grade}
                    </div>
                    {gradeClasses.map((classItem) => (
                      <button
                        key={classItem.id}
                        onClick={() => handleClassSelect(classItem)}
                        className={`w-full text-left px-4 py-3 hover:bg-tertiary transition-colors flex items-center justify-between rounded-lg mx-2 ${
                          classItem.id === currentClass.id ? 'bg-accent-interactive/20 text-accent-interactive border border-accent-interactive' : 'text-primary'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{classItem.displayName}</div>
                          <div className="text-xs text-muted">
                            {classItem.subjects.length} subjects
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {classItem.stream && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium border border-primary bg-secondary text-primary">
                              {classItem.stream}
                            </span>
                          )}
                          {classItem.id === currentClass.id && (
                            <Check className="w-4 h-4 text-accent-interactive" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-secondary rounded-2xl max-w-md w-full p-6 shadow-xl border border-primary">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center border border-info/30">
                <BookOpen className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">Confirm Class Change</h3>
                <p className="text-sm text-secondary">This will update your entire curriculum</p>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-warning font-semibold mb-1">
                    Switch to {showConfirmation.displayName}?
                  </p>
                  <p className="text-xs text-warning/80">
                    Your dashboard, quests, and knowledge trees will be updated to match the new curriculum.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Current:</span>
                <span className="font-medium text-primary">{currentClass.displayName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">New:</span>
                <span className="font-medium text-accent-interactive">{showConfirmation.displayName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subjects:</span>
                <span className="font-medium text-primary">{showConfirmation.subjects.length} subjects</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(null)}
                className="flex-1 px-4 py-2 btn-secondary rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClassChange}
                disabled={isLoading}
                className="flex-1 px-4 py-2 btn-primary rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Confirm Change'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassSelector;