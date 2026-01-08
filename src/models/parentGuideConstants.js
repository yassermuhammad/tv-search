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

/**
 * Detailed descriptions for MPAA movie ratings
 */
export const MPAA_RATING_DESCRIPTIONS = {
  G: {
    title: 'G - General Audiences',
    description: 'All ages admitted. Nothing that would offend parents for viewing by children.',
    content: 'No content that would offend parents.',
  },
  PG: {
    title: 'PG - Parental Guidance Suggested',
    description: 'Some material may not be suitable for children. Parents urged to give parental guidance.',
    content: 'May contain some mild language, violence, or brief nudity. Parents should review content.',
  },
  'PG-13': {
    title: 'PG-13 - Parents Strongly Cautioned',
    description: 'Some material may be inappropriate for children under 13. Parents are urged to be cautious.',
    content: 'May contain violence, language, sexual content, or drug references. Not recommended for children under 13.',
  },
  R: {
    title: 'R - Restricted',
    description: 'Under 17 requires accompanying parent or adult guardian. Contains adult material.',
    content: 'Contains adult material including intense violence, strong language, sexual content, or drug use. Restricted to viewers 17 and older unless accompanied by a parent.',
  },
  'NC-17': {
    title: 'NC-17 - Adults Only',
    description: 'No one 17 and under admitted. Clearly adult content.',
    content: 'Contains explicit sexual content, extreme violence, or other adult material. Not suitable for anyone under 18.',
  },
  'NR': {
    title: 'NR - Not Rated',
    description: 'This film has not been rated by the MPAA.',
    content: 'Content rating information is not available.',
  },
}

/**
 * Detailed descriptions for TV content ratings
 */
export const TV_RATING_DESCRIPTIONS = {
  'TV-Y': {
    title: 'TV-Y - All Children',
    description: 'Designed to be appropriate for all children.',
    content: 'Content is designed for children ages 2-6. Contains no material that parents would find inappropriate.',
  },
  'TV-Y7': {
    title: 'TV-Y7 - Directed to Older Children',
    description: 'Designed for children age 7 and above.',
    content: 'May contain mild fantasy violence or comedic violence. May not be suitable for children under 7.',
  },
  'TV-Y7-FV': {
    title: 'TV-Y7-FV - Directed to Older Children (Fantasy Violence)',
    description: 'Designed for children age 7 and above, with fantasy violence.',
    content: 'Contains fantasy violence that may be more intense or combative than typical TV-Y7 content.',
  },
  'TV-G': {
    title: 'TV-G - General Audience',
    description: 'Most parents would find this program suitable for all ages.',
    content: 'Contains little or no violence, no strong language, and little or no sexual dialogue or situations.',
  },
  'TV-PG': {
    title: 'TV-PG - Parental Guidance Suggested',
    description: 'This program contains material that parents may find unsuitable for younger children.',
    content: 'May contain moderate violence, some sexual situations, infrequent coarse language, or some suggestive dialogue.',
  },
  'TV-14': {
    title: 'TV-14 - Parents Strongly Cautioned',
    description: 'This program contains some material that many parents would find unsuitable for children under 14 years of age.',
    content: 'May contain intense violence, sexual situations, strong coarse language, or intensely suggestive dialogue.',
  },
  'TV-MA': {
    title: 'TV-MA - Mature Audience Only',
    description: 'This program is specifically designed to be viewed by adults and therefore may be unsuitable for children under 17.',
    content: 'Contains graphic violence, explicit sexual content, profanity, or other mature themes. Intended for mature audiences only.',
  },
}

/**
 * Get rating description for a given rating code
 * @param {string} rating - Rating code (e.g., 'R', 'TV-MA', 'PG-13')
 * @returns {Object|null} Rating description object or null
 */
export const getRatingDescription = (rating) => {
  if (!rating) return null

  // Check TV ratings first
  if (rating.startsWith('TV-')) {
    return TV_RATING_DESCRIPTIONS[rating] || {
      title: rating,
      description: 'Content rating information',
      content: 'Rating details not available.',
    }
  }

  // Check MPAA ratings
  if (MPAA_RATING_DESCRIPTIONS[rating]) {
    return MPAA_RATING_DESCRIPTIONS[rating]
  }

  // Fallback
  return {
    title: rating,
    description: 'Content rating information',
    content: 'Rating details not available.',
  }
}

