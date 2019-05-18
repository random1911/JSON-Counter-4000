#About this repo

Originally it was trial task from team I wanted to join during I worked for Peter-Service/Nexign and my first ever React app.
Before they give me an answer I've got some offers from outside, so now I keep it as my public code example.

A bit later I also rewrote app components with Typescript, just because "Look! I can use TypeScript"

Last update: May 2019.

## Task description

>Task: implement a single page application with React. App has to contain a form which can possible to upload JSON file (including using drag and drop).<br><br>If it is a valid JSON, the app needs to recursively count and show the number of objects inside, if not - display an error message. Will be nice to handle the maximum amount of edge cases.

## Implementation description

- During the counting, array considered as an object
- Multiple file loading available
- Loader can accept files less than 1mb and with extension .json or .txt
- Attempt to load files what are does not match the requirements above or cannot be parsed as JSON will lead to display error messages
- If one or several files were successfully loaded, the result list will be displayed. In the list can be seen the file name, objects count and keys matched to objects
## App demo

Available here: [https://random1911.github.io/JSON-Counter-4000/](https://random1911.github.io/JSON-Counter-4000/)
