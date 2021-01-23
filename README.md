# Rose Rocket Coding Challenge February 2021

Refactoring: i passed some parameters around as arrays, but then i wanted to also pass
some other parameters other than numbers so objects would be better than arrays (more descriptive). If I were to refactor the project, one of my priorities would be to use objects and arrays more wisely to make data more readable

i couldve kept state as one object instead of having 4 seperate setters

i shouldve put all utils into seperate files

i got rid of unecessary wrapper components that only render multiple other components

known bugs:
sometimes the lines fail to render on mount. Clicking the movements tab forces a re-render and fixes the issue.

editing only color, description or title doesnt update the map
i suspect the map only listens for changes in the "geometry" property in each object, and doesn't look at the "properties" property