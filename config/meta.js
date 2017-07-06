const origin = process.env.ORIGIN || 'http://localhost:8080';

module.exports = {
  title: 'MUmeet: find meeting times',
  author: 'Marc Porciuncula',
  descriptionLong:
    "MUmeet is a meeting scheduler for busy teams. It helps you find a time using your team's calendars so you can spend time collaborating, not scheduling.",
  descriptionShort:
    'MUmeet finds meeting times for your team, so you can focus on the real work.',
  tags:
    'scheduler,scheduling tools,meeting,meeting tools,team meeting,collaboration',
  image: `${origin}/static/img/og-image-2017-06-06.jpg`,
  url: origin,
};
