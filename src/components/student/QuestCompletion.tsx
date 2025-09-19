import React, { useState } from 'react';
import { 
  CheckCircle, 
  Star, 
  Trophy, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  Sparkles,
  Target,
  BookOpen
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';

interface QuestCompletionProps {
  quest: {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    rewards: {
      experience: number;
      crystals: number;
      sparks: number;
    };
  };
  onClose: () => void;
  onContinue: () => void;
}

const QuestCompletion: React.FC<QuestCompletionProps> = ({ quest, onClose, onContinue }) => {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number>(0);
  const [needsHelp, setNeedsHelp] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send feedback to the backend
      const feedbackData = {
        questId: quest.id,
        rating,
        needsHelp,
        feedback: feedback.trim(),
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting feedback:', feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(addNotification({ type: 'success', title: 'Feedback Submitted', message: 'Thank you for your feedback! This helps us improve the learning experience.' }));
      
      // Close the modal after a brief delay
      setTimeout(() => {
        onContinue();
      }, 1500);
      
    } catch (error) {
      dispatch(addNotification({ type: 'error', title: 'Submission Failed', message: 'Failed to submit feedback. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-red-400 bg-red-500/20';
      case 'Epic': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/10">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Quest Completed!</h2>
          <p className="text-green-300 text-lg">Congratulations on conquering this challenge!</p>
        </div>

        {/* Quest Info */}
        <div className="bg-black/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{quest.title}</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quest.difficulty)}`}>
              {quest.difficulty}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-white/60" />
            <span className="text-white/80">{quest.subject}</span>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-500/20 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">+{quest.rewards.experience}</div>
              <div className="text-green-300 text-sm">Experience</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-xl font-bold text-white">+{quest.rewards.crystals}</div>
              <div className="text-blue-300 text-sm">Crystals</div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xl font-bold text-white">+{quest.rewards.sparks}</div>
              <div className="text-yellow-300 text-sm">Sparks</div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-black/20 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
            Help Us Improve
          </h4>

          {/* Quest Rating */}
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-3">
              How would you rate this quest?
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    star <= rating
                      ? 'text-yellow-400 bg-yellow-500/20'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Need Help Toggle */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={needsHelp}
                onChange={(e) => setNeedsHelp(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                needsHelp
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-white/40 hover:border-white/60'
              }`}>
                {needsHelp && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <span className="text-white/80">I'd like more practice on this topic</span>
            </label>
          </div>

          {/* Additional Feedback */}
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Additional feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about this quest..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-200 border border-white/20"
          >
            Skip Feedback
          </button>
          <button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || rating === 0}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit & Continue</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {rating === 0 && (
          <p className="text-center text-white/60 text-sm mt-3">
            Please rate the quest to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestCompletion;