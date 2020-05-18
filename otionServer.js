function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var STYLE_ELEMENT_ID = "__otion";

/**
 * Creates an injector which collects style rules during server-side rendering.
 */

function VirtualInjector(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      nonce = _ref.nonce,
      _ref$target = _ref.target,
      ruleTexts = _ref$target === void 0 ? [] : _ref$target;

  return {
    nonce: nonce,
    ruleTexts: ruleTexts,
    insert: function insert(rule, index) {
      ruleTexts.splice(index, 0, rule);
      return index;
    }
  };
}

/**
 * Transforms an injector's data into `<style>` tag properties. Useful as a base to build custom server-side renderers upon.
 *
 * @param injector Server-side style rule injector.
 *
 * @returns Properties of a `<style>` tag as an object.
 */

function getStyleProps(injector) {
  return {
    id: STYLE_ELEMENT_ID,
    nonce: injector.nonce,
    textContent: injector.ruleTexts.join("")
  };
}
/**
 * Transforms an injector's data into a `<style>` tag string.
 *
 * @param injector Server-side style rule injector.
 *
 * @returns A stringified `<style>` tag containing server-renderable CSS.
 */

function getStyleTag(injector) {
  var _getStyleProps = getStyleProps(injector),
      id = _getStyleProps.id,
      nonce = _getStyleProps.nonce,
      textContent = _getStyleProps.textContent;

  var props = "id=\"" + id + "\"";
  if (nonce) props += " nonce=\"" + nonce + "\"";
  return "<style " + props + ">" + textContent + "</style>";
}
/**
 * Filters out style rules which are not statically referenced by the given HTML code.
 *
 * @param injector Server-side style rule injector.
 * @param html HTML code of the underlying page.
 *
 * @returns A copy of the given injector instance with the unused rules filtered out.
 */

function filterOutUnusedRules(injector, html) {
  var usedIdentNames = new Set();
  var re = /<[^>]+\s+class\s*=\s*("[^"]+"|'[^']+'|[^>\s]+)/gi;
  var matches; // eslint-disable-next-line no-cond-assign

  while ((matches = re.exec(html)) != null) {
    var classAttributeValue = matches[1];

    if (classAttributeValue[0] === '"' || classAttributeValue[0] === "'") {
      // Remove enclosing quotes
      classAttributeValue = classAttributeValue.slice(1, -1);
    }

    classAttributeValue.trim().split(/\s+/) // Ignore excess white space between class names
    .forEach(function (className) {
      return usedIdentNames.add(className);
    });
  }

  var ruleTextsByIdentName = injector.ruleTexts.map(function (ruleText) {
    return [// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    /_[0-9a-z]+/.exec(ruleText)[0], ruleText];
  });
  return _extends(_extends({}, injector), {}, {
    ruleTexts: ruleTextsByIdentName.filter(function (_ref) {
      var identName = _ref[0],
          ruleText = _ref[1];
      if (usedIdentNames.has(identName)) return true; // Only a `@keyframes` name can be referenced by other scoped rules

      var isReferencedByAnOtherUsedRule = ruleText[0] === "@" && ruleText[1] === "k" && ruleTextsByIdentName.some(function (_ref2) {
        var otherIdentName = _ref2[0],
            otherRuleText = _ref2[1];
        return usedIdentNames.has(otherIdentName) && otherRuleText.includes(identName);
      });
      if (isReferencedByAnOtherUsedRule) return true;
      return false;
    }).map(function (_ref3) {
      var ruleText = _ref3[1];
      return ruleText;
    })
  });
}

export { VirtualInjector, filterOutUnusedRules, getStyleProps, getStyleTag };
//# sourceMappingURL=index.mjs.map
