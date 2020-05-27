module.exports = function stringReplaceAsync(
  string,
  searchValue,
  replaceValue
) {
  try {
    if (typeof replaceValue === "function") {
      // Step 1: Call native `replace` one time to acquire arguments for
      // `replaceValue` function
      // Step 2: Collect all return values in an array
      // Step 3: Run `Promise.all` on collected values to resolve them
      // Step 4: Call native `replace` the second time, replacing substrings
      // with resolved values in order of occurance!
      var promises = [];
      String.prototype.replace.call(string, searchValue, function () {
        promises.push(replaceValue.apply(undefined, arguments));
        return "";
      });
      return Promise.all(promises).then(function (values) {
        return String.prototype.replace.call(string, searchValue, function () {
          return values.shift();
        });
      });
    } else {
      return Promise.resolve(
        String.prototype.replace.call(string, searchValue, replaceValue)
      );
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
