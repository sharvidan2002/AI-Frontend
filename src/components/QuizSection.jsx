import React, { useState } from 'react';
import { QUESTION_TYPES } from '../utils/constants';

const QuizSection = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizMode, setQuizMode] = useState('practice');

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Quiz Questions Available</h3>
        <p className="text-gray-500">
          Quiz questions will appear here after your document is analyzed.
        </p>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: (correct / questions.length) * 100 };
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowAnswers(false);
    setCurrentQuestion(0);
  };

  const renderQuestion = (question, index, isFlashcard = false) => {
    const isSelected = selectedAnswers.hasOwnProperty(index);
    const selectedAnswer = selectedAnswers[index];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
      <div 
        key={index} 
        className={`${
          isFlashcard 
            ? 'bg-pure-black text-white rounded-xl p-4 shadow-lg min-w-[250px] max-w-[300px]' 
            : 'bg-white border-2 border-gray-200 rounded-lg p-6 w-full'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`${
            isFlashcard 
              ? 'bg-white text-pure-black text-xs font-bold px-2 py-1 rounded-full'
              : 'bg-pure-black text-pearl text-sm font-bold px-3 py-1 rounded-full'
          }`}>
            {isFlashcard ? `Flashcard ${index + 1}` : `Question ${index + 1}`}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {question.type?.replace('_', ' ') || 'Question'}
          </span>
        </div>

        <h4 className={`text-base font-semibold ${
          isFlashcard ? 'text-white' : 'text-pure-black'
        } mb-3`}>
          {question.question}
        </h4>

        {/* Multiple Choice Options */}
        {question.type === QUESTION_TYPES.MCQ && question.options && (
          <div className="space-y-2 mb-4">
            {question.options.map((option, optionIndex) => {
              const optionLabel = String.fromCharCode(65 + optionIndex);
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;

              return (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(index, option)}
                  disabled={showAnswers}
                  className={`w-full text-left p-2 rounded-lg border-2 transition-all duration-200 ${
                    showAnswers
                      ? isCorrectOption
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : isSelected && !isCorrectOption
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50'
                      : isSelected
                      ? 'border-pure-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{optionLabel}.</span> {option}
                  {showAnswers && isCorrectOption && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                  {showAnswers && isSelected && !isCorrectOption && (
                    <span className="ml-2 text-red-600">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Short Answer Input */}
        {question.type === QUESTION_TYPES.SHORT_ANSWER && (
          <div className="mb-4">
            <textarea
              value={selectedAnswer || ''}
              onChange={(e) => handleAnswerSelect(index, e.target.value)}
              disabled={showAnswers}
              placeholder="Type your answer here..."
              rows={3}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pure-black focus:outline-none resize-none"
            />
            {showAnswers && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">Expected Answer:</p>
                <p className="text-green-700">{question.correctAnswer}</p>
              </div>
            )}
          </div>
        )}

        {/* Flashcard */}
        {question.type === QUESTION_TYPES.FLASHCARD && (
          <div className="mb-3">
            {!isSelected ? (
              <button
                onClick={() => handleAnswerSelect(index, question.correctAnswer)}
                className="w-full mt-2 bg-white text-pure-black p-2 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-100 transition-colors duration-200 font-semibold text-sm"
              >
                Click to reveal answer
              </button>
            ) : (
              <div className="bg-white text-pure-black border border-gray-200 rounded-lg p-3">
                <p className="font-medium text-sm">{question.correctAnswer}</p>
              </div>
            )}
          </div>
        )}

        {/* Answer Status */}
        {showAnswers && isSelected && question.type !== QUESTION_TYPES.FLASHCARD && (
          <div className={`p-3 rounded-lg border ${
            isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-medium ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
          </div>
        )}

        {/* Explanation */}
        {showAnswers && question.explanation && (
          <div className={`mt-3 p-3 rounded-lg border ${
            isFlashcard 
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <p className="text-xs font-medium mb-1">Explanation:</p>
            <p className="text-xs">{question.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const score = calculateScore();
  const flashcards = questions.filter(q => q.type === QUESTION_TYPES.FLASHCARD);
  const otherQuestions = questions.filter(q => q.type !== QUESTION_TYPES.FLASHCARD);

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-pure-black">📝 Quiz Questions</h3>
          <p className="text-gray-medium mt-1">
            {questions.length} question{questions.length !== 1 ? 's' : ''} generated from your content
          </p>
        </div>

        <div className="flex gap-2">
          {showAnswers && (
            <button
              onClick={resetQuiz}
              className="btn-secondary"
            >
              Reset Quiz
            </button>
          )}
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="btn-primary"
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>
      </div>

      {/* Score Display */}
      {showAnswers && Object.keys(selectedAnswers).length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-pure-black mb-4">Quiz Results</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-pure-black">{score.correct}</div>
              <div className="text-sm text-gray-medium">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pure-black">{score.total}</div>
              <div className="text-sm text-gray-medium">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pure-black">{score.percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-medium">Score</div>
            </div>
          </div>

          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                score.percentage >= 80 ? 'bg-green-500' :
                score.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Flashcards Section */}
      {flashcards.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-pure-black">Flashcards</h4>
          <div className="flex flex-row gap-4 overflow-x-auto pb-4">
            {flashcards.map((question, index) => renderQuestion(question, index, true))}
          </div>
        </div>
      )}

      {/* Other Questions Section */}
      {otherQuestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-pure-black">Questions</h4>
          {otherQuestions.map((question, index) => renderQuestion(question, index))}
        </div>
      )}

      {/* Question Types Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-pure-black mb-3">Question Types:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-gray-700">Multiple Choice (MCQ)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-700">Short Answer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            <span className="text-gray-700">Flashcard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSection;