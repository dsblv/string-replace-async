module.exports = function stringReplaceAsync(
  string,
  searchValue,
  replaceValue
) {
  try {
    if (typeof replaceValue === "function") {
      // 1. Run fake pass of `replace`, collect values from `replaceValue` calls
      // 2. Resolve them with `Promise.all`
      // 3. Run `replace` with resolved values
      var values = [];
      String.prototype.replace.call(string, searchValue, function () {
        values.push(replaceValue.apply(undefined, arguments));
        return "";
      });
      return Promise.all(values).then(function (resolvedValues) {
        return String.prototype.replace.call(string, searchValue, function () {
          return resolvedValues.shift();
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
