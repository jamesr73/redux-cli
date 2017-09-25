module.exports = {
  <% if (description) { %>
  description: function() {
    return 'Generate from blueprint';
  },
  <% } %>
  <% if (command) { %>
  command: {
    aliases: <%- aliases %>,
    builder: yargs => yargs // can also accept blueprint as second parameter
  },
  <% } %>
  <% if (locals) { %>
  locals(options) {
    // Return custom template variables here
    return {};
  },
  <% } %>
  <% if (fileMapTokens) { %>
  fileMapTokens: function(options) {
    // Return custom tokens to be replaced in path and file names
    return {
      __token__: function(options) {
        // logic to determine value goes here
        return 'value';
      },
    };
  },
  <% } %>
  <% if (beforeInstall) { %>
  beforeInstall: function(options, locals) {},
  <% } %>
  <% if (afterInstall) { %>
  afterInstall: function(options) {},
  <% } %>
};
