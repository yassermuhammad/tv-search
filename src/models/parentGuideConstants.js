/**
 * Parent Guide Content Warning Types
 * These represent different types of content that parents may want to be aware of
 */
export const CONTENT_WARNING_TYPES = {
  NUDITY: 'nudity',
  VIOLENCE: 'violence',
  PROFANITY: 'profanity',
  DRUGS_ALCOHOL: 'drugs_alcohol',
  FRIGHTENING: 'frightening',
  SEXUAL_CONTENT: 'sexual_content',
  INTENSE_SCENES: 'intense_scenes',
} // eslint-disable-line

/**
 * Content warning labels for display
 */
export const CONTENT_WARNING_LABELS = {
  [CONTENT_WARNING_TYPES.NUDITY]: 'Nudity',
  [CONTENT_WARNING_TYPES.VIOLENCE]: 'Violence',
  [CONTENT_WARNING_TYPES.PROFANITY]: 'Profanity',
  [CONTENT_WARNING_TYPES.DRUGS_ALCOHOL]: 'Drugs & Alcohol',
  [CONTENT_WARNING_TYPES.FRIGHTENING]: 'Frightening',
  [CONTENT_WARNING_TYPES.SEXUAL_CONTENT]: 'Sexual Content',
  [CONTENT_WARNING_TYPES.INTENSE_SCENES]: 'Intense Scenes',
}

/**
 * Content warning severity levels
 */
export const SEVERITY_LEVELS = {
  NONE: 'none',
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
}

/**
 * Severity level labels
 */
export const SEVERITY_LABELS = {
  [SEVERITY_LEVELS.NONE]: 'None',
  [SEVERITY_LEVELS.MILD]: 'Mild',
  [SEVERITY_LEVELS.MODERATE]: 'Moderate',
  [SEVERITY_LEVELS.SEVERE]: 'Severe',
}

/**
 * US MPAA rating system mappings
 */
export const MPAA_RATINGS = {
  G: 'G - General Audiences',
  PG: 'PG - Parental Guidance Suggested',
  'PG-13': 'PG-13 - Parents Strongly Cautioned',
  R: 'R - Restricted',
  'NC-17': 'NC-17 - Adults Only',
  'NR': 'NR - Not Rated',
}

