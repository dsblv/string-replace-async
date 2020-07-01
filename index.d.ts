/**
 * Replaces text in a string, using a regular expression or search string.
 * @param string The input string.
 * @param searchValue A string to search for.
 * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
 */
declare function replaceAsync(
  string: string,
  searchValue: string | RegExp,
  replaceValue: string
): Promise<string>;

/**
 * Replaces text in a string, using a regular expression or search string.
 * @param string The input string.
 * @param searchValue A string to search for.
 * @param replacer An async function that returns the replacement text.
 */
declare function replaceAsync(
  string: string,
  searchValue: string | RegExp,
  replacer: (substring: string, ...args: any[]) => Promise<string> | string
): Promise<string>;

export = replaceAsync;
