export const addValidationRules = (typeId, rules) => {
  let valType = "text";
  if (typeId.toString()[0] === "1") {
    // string type
    valType = "string";
    rules.push({
      type: "string",
      params: ["Please exclude any special characters."],
    });
    switch (typeId.toString()) {
      case "100": // string
        return { valType, rules };
      case "101": // email
        rules.push({
          type: "email",
          params: ["Please enter a valid email address."],
        });
        return { valType, rules };
      case "102": // phone
        rules.push({
          type: "matches",
          params: [
            /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
            "Please enter a valid phone number in the format of ###-###-####.",
          ],
        });
        return { valType, rules };
      case "103": // address
        // rules.push({
        //   type: "matches",
        //   params: [
        //     /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/, // regex snip "?<=" does not work for safari
        //     "Please enter a valid address.",
        //   ],
        // });
        return { valType, rules };
      case "104": // city
        rules.push({
          type: "matches",
          params: [
            /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
            "Please enter a valid city name.",
          ],
        });
        return { valType, rules };
      case "105": // state
        rules.push({
          type: "matches",
          params: [
            /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
            "Please enter a valid state.",
          ],
        });
        return { valType, rules };
      case "106": // zip
        rules.push({
          type: "matches",
          params: [/^[0-9]{5}$/, "Please enter a valid zip code."],
        });
        return { valType, rules };
      case "107": // country
        rules.push({
          type: "matches",
          params: [
            /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
            "Please enter a valid country.",
          ],
        });
        return { valType, rules };
      case "108": // secret string
        rules.push({
          type: "matches",
          params: [
            /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/,
            "Please enter a valid secret string.",
          ],
        });
        return { valType, rules };
      case "109": // website
        rules.push({
          type: "matches",
          params: [
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
            "Please enter a valid website URL.",
          ],
        });
        return { valType, rules };
      case "110": // company name
        rules.push({
          type: "matches",
          params: [
            /^[A-Z]([a-zA-Z0-9]|[- .,'&])*$/,
            "Please enter a valid business name.",
          ],
        });
        rules.push({
          type: "max",
          params: [100, "Name must be less than 100 characters."],
        });
      default:
        return { valType, rules };
    }
  } else if (typeId.toString()[0] === "2") {
    // number type
    valType = "number";
    rules.push({
      type: "number",
      params: ["Please enter a valid number."],
    });
    switch (typeId.toString()) {
      case "200": // any number
        return { valType, rules };
      case "201": // whole number
        rules.push({
          type: "integer",
          params: ["Please enter a valid whole number."],
        });
        return { valType, rules };
      case "202": // positive integer
        rules.push({
          type: "min",
          params: [0, "Please enter a positive number."],
        });
        return { valType, rules };
      case "203": // negative integer
        rules.push({
          type: "max",
          params: [0, "Please enter a negative number."],
        });
        return { valType, rules };
      case "204": // decimal
        rules.push({
          type: "matches",
          params: [
            /^[0-9]+(.[0-9]{1,2})?$/,
            "Please enter a valid decimal number.",
          ],
        });
        return { valType, rules };
      case "205": // money
        rules.push({
          type: "matches",
          params: [
            /^(?!0,?\d)([0-9]{2}[0-9]{0,}(\.[0-9]{2}))$/,
            "Please enter a monetary value.",
          ],
        });
        return { valType, rules };
    }
  } else if (typeId.toString()[0] === "3") {
    // boolean type
    valType = "boolean";
    rules.push({
      type: "boolean",
      params: ["Please choose a valid option."],
    });
    switch (typeId.toString()) {
      case "300": // boolean
        valType = "text";
        return { valType, rules };
    }
  } else if (typeId.toString()[0] === "4") {
    // array type
    valType = "array";
    rules.push({
      type: "array",
      params: ["Please enter a valid array."],
    });
    switch (typeId.toString()) {
      case "400": // array
        return { valType, rules };
      case "401": // choose one
        rules.push({
          type: "required",
          params: ["Please choose an option."],
        });
        rules.slice(1, rules.length);
        valType = "text";
        return { valType, rules };
      case "402": // choose one with other
        rules.push({
          type: "required",
          params: ["Please choose an option."],
        });
        rules.slice(1, rules.length);
        valType = "text";
        return { valType, rules };
      case "403": // choose many
        rules.push({
          type: "required",
          params: ["Please choose at least one option."],
        });
        return { valType, rules };
      case "404": // choose many with other
        rules.push({
          type: "required",
          params: ["Please choose at least one option."],
        });
        return { valType, rules };
    }
  } else if (typeId.toString()[0] === "5") {
    // object type
    valType = "object";
    rules.push({
      type: "object",
      params: ["Please enter a valid object."],
    });
    switch (typeId.toString()) {
      case "500": // object
        return { valType, rules };
    }
  } else if (typeId.toString()[0] === "6") {
    // date type
    valType = "date";
    rules.push({
      type: "date",
      params: ["Please enter a valid date."],
    });
    switch (typeId.toString()) {
      case "600": // date
        return { valType, rules };
    }
  } else if (typeId.toString()[0] === "7") {
    // tuple type
    valType = "tuple";
    rules.push({
      type: "tuple",
      params: ["Please enter a valid tuple."],
    });
    switch (typeId.toString()) {
      case "700": // tuple
        return { valType, rules };
    }
  } else {
    return null;
  }
};
