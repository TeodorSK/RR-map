
# Features and notes

This document will consist of a list of specifications outlined in the coding challenge overview, and the list of features and bugs for the app

## Problem specification and corresponding features

### Part A requirements: Dispatcher/Driver Movement Map
 1. As a dispatcher, I should be able to create new movements for arbitrary goods that should be picked up at a Start Location and dropped off at the End Location. 
 2. Dispatchers should be able to see the list of movements and the description of freight. 
 3. Every movement should be represented on the map with 2 points connected with a line. (for simplicity purposes you could represent it as a straight line)
 4.  The app should not allow dispatchers to create identical movements (Start Location, End Location, and Freight Description) in a user-friendly manner. 
5.  Dispatchers should be able to update existing movements’ Start Location, End Location, and Freight Description. The app should confirm with a dispatcher If the updated movement is identical to an existing one. 
 6. Dispatchers should be able to delete movements. 
 7. As a dispatcher, I should be able to make a clear connection between the list of the available movements and their visual representation on the map

### Part A implemented features
- The app allows the user to perform validated CRUD operations and keeps track of elements (referred to as movements) in a single object stored in the MapContainer.js component state 
- The app displays the data in two ways: An entry in the list in the **Movements** tab, as well as a color-coded line on the map
- Each movement is an object with a Title, Description, Color, Start LngLat, End LngLat
- Distance travelled in each movement is displayed using the [haversine](https://www.movable-type.co.uk/scripts/latlong.html) calculation 

### Part B requirements
1. As a dispatcher, I want to be able to generate a Driver Route that consists of all available locations that need to be visited.
	- Please Note: that it does not make sense for a driver to visit End Location prior to Start Location for a particular freight.
2. It is OK if a Driver Route starts and ends in the same city

### Part B implemented features
- The **Route** tab computes and displays the route that visits all the nodes currently on the map. This route is displayed as a list of points that are visited, as well as a black line on the map
- The routing algorithm preserves the order of **Pickup->Dropoff** for every movement. 
	- Note: the routing algorithm assumes the start point of the first movement entered into the system is the start point of the route. A potential improvement opportunity would be to let the user select the start point of the route

### Bonus requirements
1. Make UI more user-friendly for dispatchers by expanding the movement model and allowing dispatchers to enter City Name along with Lat/Lng for movement Start and End Locations. 
2. Ability to see Driver Route on the map (either alongside with the movements or ability to toggle between Movements or Driver Route views) 
3. We want to be sure that the Driver Route is optimized. We do not want to see 2 or more same locations in a row if it could be optimized. ○ Example: If there are available movements that visit the same city: [Toronto -> Montreal] and [Montreal -> Ottawa] then the Driver Route should be [Toronto -> Montreal -> Ottawa] instead of [Toronto -> Montreal -> Montreal -> Ottawa]. 
4. We want to be sure that the Driver Route has some logic to optimize for visiting the nearest cities first. ○ Example: If there are just 2 available movements: [Toronto -> Montreal] and [Scarborough -> Ottawa] then the driver route should start with [Toronto -> Scarborough -> …] or [Scarborough -> Toronto -> …] any other route would result in a Driver Route that would be highly unoptimized. 
5. Being able to visualize routes as polylines that follow the road network, instead of simple straight lines. 
6. Design code and project in such a way that it is easy for developers to make modifications on the routing algorithm or replace it completely with different implementation on demand. 
7. Making the page aesthetically pleasing and user-friendly 
8. Any extra ideas or improvements you can think of. Please document these in the FEATURES.md

### Bonus implemented features
-  The routing algorithm is optimized by computing the shortest cartesian distance to the next eligible point (preserving the **Pickup->Dropoff** order)
- According to **Bonus requirement 3**, subsequent nodes in the route with the same coordinates are deleted from the route. This creates an issue in the **Route** tab, where a certain movement's Dropoff point doesn't show up in the route list.
	- For example: [Toronto -> Montreal] and [Montreal -> Ottawa] gets condensed into [Toronto -> Montreal -> Ottawa]

### Unimplemented features
- Bonus requirement 1 - I wasn't able to implement a way for the user to select the city as a location due to difficulties in working with certain Mapbox components using the `react-mapbox-gl` library. Ultimately I decided to focus on the other core features and improve the user experience in a different way. Given another iteration, I would implement this feature by using the MaterialUI Autocomplete component to communicate with an api that returns logitude/latitude for a given city name.
- Bonus requirement 5 - I wasn't able to get the Mapbox Directions API to work with the current system without affecting performance and code complexity. Given another iteration, I would make sure to research the Directions API more and implement the polyline directions in a more concise and robust way.
- Bonus requirement 6 - Given another iteration, I would structure the codebase better by separating the utility functions (Routing algorithm, cartesian distance, rendering functions),  into their own folders and components, rather than keeping them within the MapContainer.js component. Given another chance at the project, I would put more emphasis on code consistency as well.
- Known bug: Changing color on a line and clicking cancel doesn't remove the two newly colored vertices until the next re-render happens

