/// src/components/ConversationAnalyzer.js
import React, { useState } from 'react';

// Simple grammar check function to identify common errors
const checkGrammar = (text) => {
  const errors = [];
  const words = text.split(' ');

  // Check for repeated words
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].toLowerCase() === words[i + 1].toLowerCase()) {
      errors.push(`Repeated word: "${words[i]}".`);
    }
  }

  // Example: Check for common grammar issues (could be expanded with a library)
  if (text.includes('was were')) {
    errors.push('Incorrect use of "was" and "were".');
  }

  return errors;
};

// Simulated feedback function to generate results based on user input
const analyzeConversation = (text) => {
  const negativeWords = ['um', 'uh', 'like'];
  let confidenceLevel = 5; // Default confidence level
  let suggestions = [];
  let lectureSuggestions = [];
  let assignmentSuggestions = [];

  // Check for negative keywords
  negativeWords.forEach((word) => {
    if (text.toLowerCase().includes(word)) {
      confidenceLevel -= 1;
      suggestions.push(`Try to avoid saying "${word}".`);
      lectureSuggestions.push({
        title: 'Improving Speech Fluency',
        description: 'Techniques to reduce filler words and improve speech flow.',
        link: '#',
      });
      assignmentSuggestions.push({
        title: 'Speech Practice Assignment',
        description: 'Record a 2-minute speech avoiding common filler words.',
        link: '#',
      });
    }
  });

  // Adjust confidence based on length of conversation
  const wordCount = text.split(' ').length;
  if (wordCount < 20) {
    confidenceLevel -= 1; // Decrease confidence for short responses
  } else if (wordCount > 100) {
    confidenceLevel += 1; // Increase confidence for long responses
  }

  // Additional suggestions based on confidence level
  if (confidenceLevel < 4) {
    lectureSuggestions.push({
      title: 'Building Confidence in Public Speaking',
      description: 'Strategies to build self-confidence while speaking.',
      link: '#',
    });
    assignmentSuggestions.push({
      title: 'Confidence Building Exercise',
      description: 'Practice speaking in front of a mirror daily.',
      link: '#',
    });
  } else {
    lectureSuggestions.push({
      title: 'Advanced Speaking Techniques',
      description: 'Mastering voice modulation and engaging the audience.',
      link: '#',
    });
  }

  const feedback = `Confidence Level: ${Math.max(0, Math.min(10, confidenceLevel))}/10`;
  const tips =
    suggestions.length > 0
      ? suggestions.join(' ')
      : 'Great job! Your speaking is clear and concise.';

  const grammarErrors = checkGrammar(text);
  
  return { feedback, tips, lectureSuggestions, assignmentSuggestions, grammarErrors };
};

const ConversationAnalyzer = () => {
  const [conversation, setConversation] = useState('');
  const [result, setResult] = useState({
    feedback: '',
    tips: '',
    lectureSuggestions: [],
    assignmentSuggestions: [],
    grammarErrors: [],
  });
  const [isListening, setIsListening] = useState(false);

  // Speech recognition setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  // Start listening to the user's speech
  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  // Stop listening
  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  // Handle the result of speech recognition
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    setConversation(transcript); // Update the conversation text area with the transcript
  };

  // Handle any errors in speech recognition
  recognition.onerror = (event) => {
    console.error('Speech Recognition Error:', event.error);
    setIsListening(false);
  };

  // Analyze the text when the button is clicked
  const handleAnalyze = (e) => {
    e.preventDefault();
    const analysisResult = analyzeConversation(conversation);
    setResult(analysisResult);
    console.log('Analysis Result:', analysisResult); // Debug log
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Conversation Analyzer</h2>
      <form onSubmit={handleAnalyze}>
        <textarea
          rows="8"
          placeholder="Type your conversation here or use the microphone..."
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        ></textarea>

        <div style={{ marginBottom: '10px' }}>
          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            style={{ padding: '10px 20px', marginRight: '10px' }}
          >
            Start Listening
          </button>
          <button
            type="button"
            onClick={stopListening}
            disabled={!isListening}
            style={{ padding: '10px 20px' }}
          >
            Stop Listening
          </button>
        </div>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Analyze
        </button>
      </form>

      {result.feedback && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'grey', borderRadius: '5px' }}>
          <h3>Feedback</h3>
          <p>{result.feedback}</p>
          <h3>Tips</h3>
          <p>{result.tips}</p>
          {result.grammarErrors.length > 0 && (
            <>
              <h3>Grammar Errors</h3>
              <ul>
                {result.grammarErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {result.lectureSuggestions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Suggested Lectures</h3>
          <ul>
            {result.lectureSuggestions.map((lecture, index) => (
              <li key={index}>
                <strong>{lecture.title}</strong>: {lecture.description}
                <a href={lecture.link} target="_blank" rel="noopener noreferrer">
                  {' '}
                  View Lecture
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.assignmentSuggestions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Suggested Assignments</h3>
          <ul>
            {result.assignmentSuggestions.map((assignment, index) => (
              <li key={index}>
                <strong>{assignment.title}</strong>: {assignment.description}
                <a href={assignment.link} target="_blank" rel="noopener noreferrer">
                  {' '}
                  View Assignment
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConversationAnalyzer;
