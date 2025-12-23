
import { UserType, Feature } from './types';

export const FEATURES_BY_USER_TYPE: Record<UserType, Feature[]> = {
  [UserType.Beginner]: [
    Feature.Chatbot,
    Feature.Pronunciation,
    Feature.Vocabulary,
    Feature.Translation,
    Feature.VisualLearning,
    Feature.Grammar,
  ],
  [UserType.Advanced]: [
    Feature.Chatbot,
    Feature.Conversation,
    Feature.Pronunciation,
    Feature.Vocabulary,
    Feature.Writing,
    Feature.Listening,
    Feature.Translation,
  ],
  [UserType.Professional]: [
    Feature.Chatbot,
    Feature.Simulations,
    Feature.Email,
    Feature.Pronunciation,
    Feature.IndustryVocab,
    Feature.Writing,
    Feature.Translation,
  ],
};
