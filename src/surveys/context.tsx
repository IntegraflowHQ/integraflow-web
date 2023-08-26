import { createContext } from 'preact';
import { SurveyLogic } from './logic';
import { Theme } from '../types';

export interface SurveyContext {
  surveyLogic: SurveyLogic;
  theme?: Theme;
}

export const SurveyContext = createContext<SurveyContext | undefined>(undefined);
