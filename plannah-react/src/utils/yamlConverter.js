import * as yaml from 'js-yaml';

/**
 * Convert YAML string to JSON object
 * @param {string} yamlStr - YAML string to convert
 * @returns {Object} Parsed JSON object
 * @throws {Error} If YAML format is invalid
 */
export const simpleYamlToJson = (yamlStr) => {
  try {
    return yaml.load(yamlStr);
  } catch (e) {
    throw new Error('Invalid YAML format');
  }
};

/**
 * Convert JSON object to YAML string
 * @param {Object} obj - Object to convert
 * @returns {string} YAML string
 */
export const jsonToYaml = (obj) => {
  return yaml.dump(obj, { indent: 2 });
};