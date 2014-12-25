var gardrExt = require('gardr-ext');

{% for plugin in plugins %}
var {{ plugin.camelCaseName }} = require('{{ plugin.dashName }}');
{% endfor %}

{% for plugin in plugins %}
gardrExt.plugin({{ plugin.camelCaseName }});
{% endfor %}

gardrExt({
    allowedDomains: [{% for domain in allowedDomains %}'{{ domain }}'{% if !loop.last %}, {% endif %}{% endfor %}]
});

module.exports = gardrExt;
