import { Scenes } from 'telegraf';

interface MyWizardSession extends Scenes.WizardSessionData {
  teamName?: string;
}

export interface MyContext extends Scenes.WizardContext<MyWizardSession> {
  
}
