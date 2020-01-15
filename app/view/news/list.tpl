{% extends "../layout/layout.tpl" %}

{% block content %}
  <ul class="news-view view">
      {% for item in list %}
        <li class="item">
          <a href="{{ item.url }}">{{ item.title }}[{{ helper.relativeTime(1483203661) }}
]</a>
        </li>
      {% endfor %}
    </ul>
{% endblock %}