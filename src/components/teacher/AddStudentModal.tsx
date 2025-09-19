import React, { useState } from 'react';
import { X, UserPlus, Save, Upload } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: (studentData: any) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: 8,
    studentId: '',
    parentEmail: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const studentData = {
        id: Date.now().toString(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        grade: formData.grade,
        studentId: formData.studentId,
        parentEmail: formData.parentEmail,
        enrolledAt: new Date().toISOString(),
        level: 1,
        experience: 0,
        status: 'active'
      };
      
      onSuccess(studentData);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Addition Failed',
        message: 'Failed to add student. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // Simulate bulk upload processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Bulk Upload Complete',
        message: 'Successfully processed student data file.'
      }));
      
      onClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to process student data file.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add New Student</h2>
              <p className="text-blue-100 mt-1">Enroll a new student in your class</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Mode Toggle */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'single'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Single Student
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'bulk'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'single' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    error={errors.firstName}
                    required
                  />

                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    error={errors.lastName}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@school.edu"
                  error={errors.email}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    placeholder="Enter student ID"
                    error={errors.studentId}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grade Level
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      {Array.from({ length: 7 }, (_, i) => i + 6).map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="Parent/Guardian Email (Optional)"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  placeholder="parent@email.com"
                  helperText="For progress updates and communication"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="flex-1"
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  Add Student
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bulk Student Upload</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Upload a CSV file with student information. The file should include columns for: 
                  First Name, Last Name, Email, Student ID, Grade, Parent Email.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleBulkUpload(file);
                    }
                  }}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload">
                  <Button
                    type="button"
                    variant="primary"
                    loading={isLoading}
                    icon={<Upload className="w-4 h-4" />}
                    className="cursor-pointer"
                  >
                    Choose File
                  </Button>
                </label>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;