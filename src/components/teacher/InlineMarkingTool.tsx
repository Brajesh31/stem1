import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit, 
  Save, 
  Undo, 
  Redo, 
  Type, 
  Highlighter,
  MessageSquare,
  Star,
  Download,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Annotation {
  id: string;
  type: 'comment' | 'highlight' | 'correction' | 'praise';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
  timestamp: string;
}

interface Submission {
  id: string;
  studentName: string;
  title: string;
  submittedAt: string;
  content: string;
  currentGrade?: number;
  maxGrade: number;
}

const InlineMarkingTool: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTool, setCurrentTool] = useState<'comment' | 'highlight' | 'correction'>('comment');
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const submissions: Submission[] = [
    {
      id: '1',
      studentName: 'Alex Chen',
      title: 'Physics Lab Report - Pendulum Motion',
      submittedAt: '2024-02-15 14:30',
      content: `# Pendulum Motion Experiment

## Objective
To investigate the relationship between the length of a pendulum and its period of oscillation.

## Hypothesis
I hypothesize that the period of a pendulum is directly proportional to the square root of its length.

## Materials
- String (various lengths)
- Metal bob (50g)
- Stopwatch
- Ruler
- Protractor

## Procedure
1. Set up pendulum with 1m string length
2. Release from 15° angle
3. Measure time for 10 complete oscillations
4. Repeat with different lengths: 0.5m, 0.75m, 1.25m, 1.5m
5. Calculate period for each length

## Results
| Length (m) | Time for 10 oscillations (s) | Period (s) |
|------------|------------------------------|------------|
| 0.5        | 14.2                        | 1.42       |
| 0.75       | 17.4                        | 1.74       |
| 1.0        | 20.1                        | 2.01       |
| 1.25       | 22.5                        | 2.25       |
| 1.5        | 24.6                        | 2.46       |

## Analysis
The data shows a clear relationship between pendulum length and period. When I plot period² vs length, I get a straight line, confirming that T² ∝ L.

## Conclusion
My hypothesis was correct. The period of a simple pendulum is proportional to the square root of its length, following the formula T = 2π√(L/g).`,
      maxGrade: 100
    },
    {
      id: '2',
      studentName: 'Maria Santos',
      title: 'Chemistry Assignment - Molecular Bonding',
      submittedAt: '2024-02-14 16:45',
      content: `# Molecular Bonding Assignment

## Question 1: Types of Chemical Bonds
Chemical bonds are forces that hold atoms together in compounds. There are three main types:

1. **Ionic Bonds**: Form between metals and non-metals through electron transfer
2. **Covalent Bonds**: Form between non-metals through electron sharing
3. **Metallic Bonds**: Form between metal atoms through electron delocalization

## Question 2: Lewis Structures
[Student would draw Lewis structures here]

## Question 3: Bond Polarity
Polar bonds occur when electrons are shared unequally between atoms with different electronegativities...`,
      maxGrade: 50
    }
  ];

  useEffect(() => {
    if (selectedSubmission) {
      setGrade(selectedSubmission.currentGrade || 0);
    }
  }, [selectedSubmission]);

  const handleMouseUp = () => {
    if (!isSelecting || !contentRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = contentRef.current.getBoundingClientRect();

    const annotation: Annotation = {
      id: Date.now().toString(),
      type: currentTool,
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
      content: currentTool === 'highlight' ? selection.toString() : '',
      timestamp: new Date().toISOString()
    };

    if (currentTool === 'comment' || currentTool === 'correction') {
      const comment = prompt(`Add ${currentTool}:`);
      if (comment) {
        annotation.content = comment;
        setAnnotations([...annotations, annotation]);
      }
    } else {
      setAnnotations([...annotations, annotation]);
    }

    selection.removeAllRanges();
    setIsSelecting(false);
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;

    console.log('Saving grade:', {
      submissionId: selectedSubmission.id,
      grade,
      feedback,
      annotations
    });

    // In production, this would save to backend
    alert(`Grade saved: ${grade}/${selectedSubmission.maxGrade}`);
  };

  const getAnnotationColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-500/20 border-blue-400';
      case 'highlight': return 'bg-yellow-500/20 border-yellow-400';
      case 'correction': return 'bg-red-500/20 border-red-400';
      case 'praise': return 'bg-green-500/20 border-green-400';
      default: return 'bg-gray-500/20 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Edit className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Inline Marking Tool</h1>
        </div>
        {selectedSubmission && (
          <Badge variant="info">
            Grading: {selectedSubmission.studentName}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Submissions List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Submissions</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {submissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedSubmission?.id === submission.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                <h4 className="font-medium">{submission.studentName}</h4>
                <p className="text-xs opacity-70 truncate">{submission.title}</p>
                <p className="text-xs opacity-60">{new Date(submission.submittedAt).toLocaleDateString()}</p>
              </button>
            ))}
          </CardBody>
        </Card>

        {/* Main Content Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {selectedSubmission?.title || 'Select a submission'}
              </h3>
              {selectedSubmission && (
                <div className="flex space-x-2">
                  <Button
                    variant={currentTool === 'comment' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentTool('comment')}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'highlight' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentTool('highlight')}
                  >
                    <Highlighter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'correction' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCurrentTool('correction')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody className="relative">
            {selectedSubmission ? (
              <div
                ref={contentRef}
                className="prose prose-invert max-w-none relative"
                onMouseUp={handleMouseUp}
                onMouseDown={() => setIsSelecting(true)}
              >
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                  {selectedSubmission.content}
                </div>
                
                {/* Render Annotations */}
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className={`absolute border-2 ${getAnnotationColor(annotation.type)} rounded pointer-events-none`}
                    style={{
                      left: annotation.x,
                      top: annotation.y,
                      width: annotation.width,
                      height: annotation.height
                    }}
                  >
                    {annotation.content && (
                      <div className="absolute top-full left-0 mt-1 bg-black/90 text-white p-2 rounded text-xs max-w-xs z-10">
                        {annotation.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a submission to begin marking</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Grading Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Grading</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {selectedSubmission && (
              <>
                {/* Grade Input */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Grade (out of {selectedSubmission.maxGrade})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedSubmission.maxGrade}
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Quick Grade Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'A', value: Math.round(selectedSubmission.maxGrade * 0.9) },
                    { label: 'B', value: Math.round(selectedSubmission.maxGrade * 0.8) },
                    { label: 'C', value: Math.round(selectedSubmission.maxGrade * 0.7) },
                    { label: 'D', value: Math.round(selectedSubmission.maxGrade * 0.6) }
                  ].map((gradeOption) => (
                    <Button
                      key={gradeOption.label}
                      variant="secondary"
                      size="sm"
                      onClick={() => setGrade(gradeOption.value)}
                    >
                      {gradeOption.label}
                    </Button>
                  ))}
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Overall Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    placeholder="Provide constructive feedback..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                {/* Annotations Summary */}
                <div>
                  <h4 className="font-medium text-white mb-2">Annotations ({annotations.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {annotations.map((annotation) => (
                      <div key={annotation.id} className={`p-2 rounded text-xs ${getAnnotationColor(annotation.type)}`}>
                        <div className="font-medium">{annotation.type}</div>
                        <div className="opacity-80">{annotation.content}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSaveGrade}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Grade & Feedback
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send to Student
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default InlineMarkingTool;