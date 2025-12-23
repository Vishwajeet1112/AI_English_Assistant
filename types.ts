
export enum UserType {
  Beginner = 'Beginner',
  Advanced = 'Advanced Student',
  Professional = 'Working Professional',
}

export enum Feature {
  Chatbot = 'Interactive Chatbot',
  Pronunciation = 'Pronunciation Checker',
  Vocabulary = 'Vocabulary Builder',
  Translation = 'Translation & Definition',
  VisualLearning = 'Visual Learning',
  Grammar = 'Basic Grammar Lessons',
  Conversation = 'Real-time Conversation',
  Writing = 'Writing Assistant',
  Listening = 'Listening Exercises',
  Simulations = 'Role-Play Simulations',
  Email = 'Email Assistant',
  IndustryVocab = 'Industry Vocabulary',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}
