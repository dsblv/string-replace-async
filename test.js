const replace = require("./index.js");

describe("Regression tests", () => {
  it("Issue #1 set lastIndex to 0 for regex.", async () => {
    const anchorRegex = /<a[^>]*>([^<]+)<\/a>/gi;

    const x =
      'Nunquam perdere <a href="https://a.jpg">https://a.jpg</a> olla <a href="https://b.jpg">https://b.jpg</a>.';
    anchorRegex.test(x);

    expect(
      await replace(x, anchorRegex, () => Promise.resolve("returned"))
    ).toEqual("Nunquam perdere returned olla returned.");
  });
});

describe("No arguments case", () => {
  it("Returns a Promise", () => {
    expect(replace("prototype")).toBeInstanceOf(Promise);
  });

  it("Throws async error", () => {
    return replace().catch((error) => {
      expect(error.message).toEqual(
        "String.prototype.replace called on null or undefined"
      );
    });
  });
});

describe("Single argument case", () => {
  it("Returns a Promise", () => {
    expect(replace("prototype")).toBeInstanceOf(Promise);
  });

  it("Doesn't do anything to a string", async () => {
    expect(await replace("prototype")).toEqual("prototype");
  });

  it("Converts arbitrary values to strings", async () => {
    expect(await replace(10)).toEqual("10");
    expect(await replace(0.1)).toEqual("0.1");
    expect(
      await replace({
        toString() {
          return ":)";
        },
      })
    ).toEqual(":)");
  });
});

describe("No replaceValue", () => {
  it("Returns a Promise", () => {
    expect(replace("prototype", "p")).toBeInstanceOf(Promise);
  });

  it("Replaces matches with 'undefined'", async () => {
    expect(await replace("prototype", "p")).toEqual("undefinedrototype");
    expect(await replace("prototype", /p/)).toEqual("undefinedrototype");
    expect(await replace("prototype", /p/g)).toEqual(
      "undefinedrototyundefinede"
    );
  });
});

describe("String replaceValue", () => {
  it("Returns a Promise", () => {
    expect(replace("prototype", "p", "b")).toBeInstanceOf(Promise);
  });

  it("Correctily replaces matches", async () => {
    expect(await replace("prototype", "p", "b")).toEqual("brototype");
    expect(await replace("prototype", /p/, "b")).toEqual("brototype");
    expect(await replace("prototype", /p/g, "b")).toEqual("brototybe");
  });
});

describe("Synchronous function replaceValue", () => {
  it("Returns a Promise", () => {
    expect(replace("prototype", "p", () => "b")).toBeInstanceOf(Promise);
  });

  it("Correctily replaces matches", async () => {
    expect(await replace("prototype", "p", () => "b")).toEqual("brototype");
    expect(
      await replace("prototype", /p/, (match) => "(" + match + ")")
    ).toEqual("(p)rototype");
    expect(
      await replace("prototype", /p/g, (match) => "(" + match + ")")
    ).toEqual("(p)rototy(p)e");
    expect(
      await replace(
        "prototype",
        /p(.)/g,
        (match, group) => "p" + group.toUpperCase()
      )
    ).toEqual("pRototypE");
  });

  it("Passes expected arguments to replaceValue", async () => {
    await replace("prototype", "p", (a, b, c) => {
      expect(a).toEqual("p");
      expect(b).toEqual(0);
      expect(c).toEqual("prototype");
    });

    await replace("prototype", /p/, (a, b, c) => {
      expect(a).toEqual("p");
      expect(b).toEqual(0);
      expect(c).toEqual("prototype");
    });

    let nextExpectedIndex = 0;
    await replace("prototype", /p/g, (a, b, c) => {
      expect(a).toEqual("p");
      expect(b).toEqual(nextExpectedIndex);
      expect(c).toEqual("prototype");
      nextExpectedIndex = 7;
    });

    let nextExpectedMatch = "pr";
    let nextExpectedGroup = "r";
    await replace("prototype", /p(.)/g, (a, b, c, d) => {
      expect(a).toEqual(nextExpectedMatch);
      expect(b).toEqual(nextExpectedGroup);
      expect(d).toEqual("prototype");
      nextExpectedMatch = "pe";
      nextExpectedGroup = "e";
    });
  });
});

describe("Asynchronous function replaceValue", () => {
  it("Returns a Promise", () => {
    expect(replace("prototype", "p", async () => "b")).toBeInstanceOf(Promise);
  });

  it("Correctily replaces matches", async () => {
    expect(await replace("prototype", "p", async () => "b")).toEqual(
      "brototype"
    );
    expect(
      await replace("prototype", /p/, async (match) => "(" + match + ")")
    ).toEqual("(p)rototype");
    expect(
      await replace("prototype", /p/g, async (match) => "(" + match + ")")
    ).toEqual("(p)rototy(p)e");
    expect(
      await replace(
        "prototype",
        /p(.)/g,
        async (match, group) => "p" + group.toUpperCase()
      )
    ).toEqual("pRototypE");
  });

  it("Passes expected arguments to replaceValue", async () => {
    await replace("prototype", "p", async (a, b, c) => {
      expect(a).toEqual("p");
      expect(b).toEqual(0);
      expect(c).toEqual("prototype");
    });

    await replace("prototype", /p/, async (a, b, c) => {
      expect(a).toEqual("p");
      expect(b).toEqual(0);
      expect(c).toEqual("prototype");
    });

    let nextExpectedIndex = 0;
    await replace("prototype", /p/g, async (a, b, c) => {
      expect(a).toEqual("p");
      expect(b).toEqual(nextExpectedIndex);
      expect(c).toEqual("prototype");
      nextExpectedIndex = 7;
    });

    let nextExpectedMatch = "pr";
    let nextExpectedGroup = "r";
    await replace("prototype", /p(.)/g, async (a, b, c, d) => {
      expect(a).toEqual(nextExpectedMatch);
      expect(b).toEqual(nextExpectedGroup);
      expect(d).toEqual("prototype");
      nextExpectedMatch = "pe";
      nextExpectedGroup = "e";
    });
  });
});

describe("Concurrency", () => {
  it("Runs replaceValue concurrently", async () => {
    let finised = [];
    await replace(
      `          Horse race!
				F |  	🏇                 | 1
				I	|	🏇                   | 2
				N	|	    🏇               | 3
				I	|	        🏇           | 4
				S	|🏇                    | 5
				H	|	    🏇               | 6
				`,
      /\|(\s*)🏇\s*\| (\d*)/gi,
      (horsey, distance, number) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            finised.push(number);
            resolve();
          }, distance.length * 100);
        });
      }
    );

    expect(finised).toEqual(["5", "2", "1", "3", "6", "4"]);
  });
});
