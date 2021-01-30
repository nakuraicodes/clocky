# Clocky

Welcome! Clocky is an experiment. The goal was to play around with web component, while still creating a tool taht I coudld use daily.

The live version is available here: [Clocky](https://clocky.ca).

### How to reuse the clock Web component

It's the first time I am playing around with web components, so there may be issues. However, in theroy, you could just copy the `src/js/clock-planner` folder and include it in your own website. Assuming you provide the right format for the event list, it's going to display the clock and your events around it.

### Deploy note

This website is hosted on Firebase. The script `deploy:prod` in the package.json file assumes that:

- you have the firebase cli installed on your computer
- you created a `.firebaserc` file with a prod nickname.
- you created a firebae.json file
