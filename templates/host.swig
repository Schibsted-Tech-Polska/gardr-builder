var gardrHost = require('gardr-host');

{% for plugin in plugins %}
var {{ plugin.camelCaseName }} = require('{{ plugin.dashName }}');
{% endfor %}

{% for plugin in plugins %}
gardrHost.plugin({{ plugin.camelCaseName }});
{% endfor %}

module.exports = gardrHost;
