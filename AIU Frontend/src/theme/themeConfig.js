import { obsidianNeon } from './themes/obsidianNeon';
import { midnightPurple } from './themes/midnightPurple';
import { arcticBlue } from './themes/arcticBlue';
import { emeraldMatrix } from './themes/emeraldMatrix';
import { royalIndigo } from './themes/royalIndigo';
import { crimsonCyber } from './themes/crimsonCyber';
import { solarAmber } from './themes/solarAmber';
import { oceanDeep } from './themes/oceanDeep';
import { neonLime } from './themes/neonLime';
import { platinumSilver } from './themes/platinumSilver';

import { cyanGlassLight } from './themes/cyanGlassLight';
import { indigoCloud } from './themes/indigoCloud';
import { emeraldFresh } from './themes/emeraldFresh';
import { roseStudio } from './themes/roseStudio';
import { platinumMinimal } from './themes/platinumMinimal';

import { developerFont } from './fonts/developer';
import { modernFont } from './fonts/modern';
import { techPremiumFont } from './fonts/techPremium';
import { elegantFont } from './fonts/elegant';
import { experimentalFont } from './fonts/experimental';

import { cleanProfessional } from './fonts/cleanProfessional';
import { futuristicAI } from './fonts/futuristicAI';
import { premiumModern } from './fonts/premiumModern';
import { creativeTech } from './fonts/creativeTech';
import { enterpriseTech } from './fonts/enterpriseTech';
import { modernCreative } from './fonts/modernCreative';
import { cyberFuture } from './fonts/cyberFuture';
import { smartMinimal } from './fonts/smartMinimal';

export const DARK_THEMES = [
  obsidianNeon,
  midnightPurple,
  arcticBlue,
  emeraldMatrix,
  royalIndigo,
  crimsonCyber,
  solarAmber,
  oceanDeep,
  neonLime,
  platinumSilver
];

export const LIGHT_THEMES = [
  cyanGlassLight,
  indigoCloud,
  emeraldFresh,
  roseStudio,
  platinumMinimal
];

export const COLOR_THEMES = [
  ...DARK_THEMES,
  ...LIGHT_THEMES
];

export const EXISTING_FONT_PRESETS = [
  developerFont,
  modernFont,
  techPremiumFont,
  elegantFont,
  experimentalFont
];

export const NEW_FONT_PRESETS = [
  cleanProfessional,
  futuristicAI,
  premiumModern,
  creativeTech,
  enterpriseTech,
  modernCreative,
  cyberFuture,
  smartMinimal
];

export const FONT_PRESETS = [
  ...EXISTING_FONT_PRESETS,
  ...NEW_FONT_PRESETS
];

export const DEFAULT_THEME_ID = 'obsidian-neon';
export const DEFAULT_FONT_ID = 'developer';
export const DEFAULT_APPEARANCE = 'dark';

export function getThemeById(id) {
  return COLOR_THEMES.find(t => t.id === id) || obsidianNeon;
}

export function getFontById(id) {
  return FONT_PRESETS.find(f => f.id === id) || developerFont;
}
