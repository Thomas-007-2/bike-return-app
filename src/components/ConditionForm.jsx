import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'

const questions = [
  {
    id: 'schaltung',
    question: 'Schaltung:',
    type: 'problem_check',
    problemPlaceholder: 'Hakt, springt, sonstiges'
  },
  {
    id: 'bremsen',
    question: 'Bremsen:',
    type: 'problem_check',
    problemPlaceholder: 'Schleifgeräusche, schlechte Bremsleistung, quietschen, sonstiges'
  },
  {
    id: 'sonstige_maengel',
    question: 'Sonstige Mängel:',
    type: 'problem_check',
    problemPlaceholder: 'Klappern/Knarzen, lockere Teile, Beleuchtung, sonstiges'
  },
  {
    id: 'bemerkungen',
    question: 'Zusätzliche Bemerkungen:',
    type: 'text',
    placeholder: 'Optional: weitere Anmerkungen zum Bike oder zum Ausleihprozess'
  }
]

const ConditionForm = ({ onSubmit, loading = false }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex >= questions.length - 1

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentQuestionIndex])

  const handleAnswer = (questionId, value, problemText = '') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
      [`${questionId}_problem`]: problemText
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Submit form
      const hasProblems = ['schaltung', 'bremsen', 'sonstige_maengel'].some(
        key => answers[key] === 'probleme'
      )
      
      const status = hasProblems ? 'damage_found' : 'no_damage'
      
      const problemDetails = []
      
      if (answers.schaltung === 'probleme' && answers.schaltung_problem) {
        problemDetails.push(`Schaltung: ${answers.schaltung_problem}`)
      }
      if (answers.bremsen === 'probleme' && answers.bremsen_problem) {
        problemDetails.push(`Bremsen: ${answers.bremsen_problem}`)
      }
      if (answers.sonstige_maengel === 'probleme' && answers.sonstige_maengel_problem) {
        problemDetails.push(`Sonstige Mängel: ${answers.sonstige_maengel_problem}`)
      }
      if (answers.bemerkungen) {
        problemDetails.push(`Bemerkungen: ${answers.bemerkungen}`)
      }
      
      const description = problemDetails.join('; ')
      
      onSubmit({ status, description })
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const renderProblemCheck = (question) => {
    const currentAnswer = answers[question.id]
    const problemText = answers[`${question.id}_problem`] || ''

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            currentAnswer === 'einwandfrei'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name={question.id}
              value="einwandfrei"
              checked={currentAnswer === 'einwandfrei'}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="sr-only"
            />
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              currentAnswer === 'einwandfrei'
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {currentAnswer === 'einwandfrei' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-medium text-gray-900">Einwandfrei</span>
            </div>
          </label>

          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            currentAnswer === 'probleme'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name={question.id}
              value="probleme"
              checked={currentAnswer === 'probleme'}
              onChange={(e) => handleAnswer(question.id, e.target.value, problemText)}
              className="sr-only"
            />
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              currentAnswer === 'probleme'
                ? 'border-orange-500 bg-orange-500'
                : 'border-gray-300'
            }`}>
              {currentAnswer === 'probleme' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              <span className="font-medium text-gray-900">Probleme</span>
            </div>
          </label>
        </div>

        {currentAnswer === 'probleme' && (
          <div className="ml-8 mt-3">
            <input
              type="text"
              value={problemText}
              onChange={(e) => handleAnswer(question.id, 'probleme', e.target.value)}
              className="input-field"
              placeholder={question.problemPlaceholder}
            />
          </div>
        )}
      </div>
    )
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'problem_check':
        return renderProblemCheck(question)

      case 'text':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="input-field h-32 resize-none"
            placeholder={question.placeholder}
          />
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    if (currentQuestion.type === 'text') return true
    return answers[currentQuestion.id] !== undefined
  }

  return (
    <div className="space-y-6">
      <div className="card">
        {/* Question Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Frage {currentQuestionIndex + 1} von {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">
            {currentQuestion.question}
          </h3>

          {renderQuestion(currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="btn-primary flex items-center space-x-2"
          >
            <span>
              {isLastQuestion 
                ? (loading ? 'Wird übertragen...' : 'Meldung abschicken')
                : 'Weiter'
              }
            </span>
            {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConditionForm