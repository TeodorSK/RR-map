import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactMapboxGl, { Marker, Popup, Layer, Feature, Source, GeoJSONLayer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'

import NewMovementInput from './NewMovementInput';
import MovementsList from './MovementsList';
import RouteList from './RouteList';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CityPin from './CityPin';

import { Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import ColorizeIcon from '@material-ui/icons/Colorize';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import SubjectIcon from '@material-ui/icons/Subject';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { v4 as uuidv4 } from 'uuid';
import TabMenu from './TabMenu';
import { LngLat } from 'mapbox-gl';
import EditMovement from './EditMovement';
import MovementSummary from './MovementSummary';

// import RoomIcon from '@material-ui/icons/Room';

function MapContainer(props) {

    const drawControl = useRef(null)
    const [movements, setMovements] = useState([])
    const [mapCenter, setMapCenter] = useState([19.8770, 45.2479909])
    const [lastClickLngLat, setLastClickLngLat] = useState(null)
    const [route, setRoute] = useState(null)

    // rename this shit
    const [inputOpen, setInputOpen] = useState(false)

    const [tabIndex, setTabIndex] = useState(0)

    const tabChange = (event, newValue) => {
        if (newValue === 0) renderLines();
        if (newValue === 1) computeRoute();
        setTabIndex(newValue);
    };

    const renderTabContents = (i) => {
        switch (i) {
            case 0:
                return <div style={{ maxHeight: '85vh', overflow: 'auto' }}>
                    {movements.map((e, i) => (
                        <MovementSummary
                            line={e}
                            index={i}
                            deleteMovement={deleteMovement}
                            editMovement={editMovement}
                            renderLines={renderLines}
                            lastClickLngLat={lastClickLngLat} />
                    ))}

                    {!inputOpen ?
                        <Button onClick={() => setInputOpen(true)} size="large" color="primary" startIcon={<AddCircleIcon />}>
                            Add new movement
                    </Button> :
                        <EditMovement
                            setInputOpen={setInputOpen}
                            lastClickLngLat={lastClickLngLat}
                            save={addMovement}
                            renderLines={renderLines}
                        />
                    }


                </div>
            case 1:
                return <RouteList
                    route={route}
                />
            default:
                return null
        }
    }

    // Snackbar state and aux funcs
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        text: "",
        color: "danger"
    });
    const { vertical, horizontal, open } = snackbarState

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleSnackbarClose = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    const Map = useMemo(props => ReactMapboxGl({
        accessToken:
            'pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g'
    }), [])

    // Higher sensitivity -> grid is more dense
    const GRID_SENSITIVITY = 1
    const mapClick = (map, e) => {
        const { lng, lat } = e.lngLat;

        // Grid sensitivity is 1 decimals
        const roundedLngLat = new LngLat(lng.toFixed(GRID_SENSITIVITY), lat.toFixed(GRID_SENSITIVITY))
        console.log(`Clicked at ${lng} ${lat}`);
        console.log(`Current Map Center: ${map.getCenter()}`);
        setLastClickLngLat(roundedLngLat)
    }

    // CRUD operations
    const addMovement = ({ slat, slng, elat, elng, title, description, color }) => {
        if (!isMovementUnique(slat, slng, elat, elng, description)) {
            console.log(`User tried to add a non-unique movement`)
            setSnackbarState({
                ...snackbarState,
                open: true,
                color: "error",
                horizontal: "center",
                text: `Movement must have unique start, end coordinates`
            });
        }
        else {
            const newLine = {
                type: 'LineString',
                id: uuidv4(),
                coordinates: [[parseFloat(slng), parseFloat(slat)], [parseFloat(elng), parseFloat(elat)]],
                title,
                description,
                color
            }
            setMovements([...movements, newLine])
            setSnackbarState({
                ...snackbarState,
                open: true,
                color: "success",
                horizontal: "center",
                text: `Successfully added movement`
            });

            // Fly camera to center of movement
            setMapCenter([(slng + elng) / 2, (slat + elat) / 2])
        }

    }

    const editMovement = ({ slat, slng, elat, elng, title, description, color, id }) => {
        const thisMovement = movements.find(e => e.id === id);
        if (!isMovementUnique(slat, slng, elat, elng, description, id)) {
            console.log(`User tried to edit movement, non unique`)
            setSnackbarState({
                ...snackbarState,
                open: true,
                color: "error",
                horizontal: "center",
                text: `Movement must have unique start, end coordinates`
            });
        }
        else {
            // Change the movement in place
            thisMovement.coordinates[0][0] = parseFloat(slng);
            thisMovement.coordinates[0][1] = parseFloat(slat);
            thisMovement.coordinates[1][0] = parseFloat(elng);
            thisMovement.coordinates[1][1] = parseFloat(elat);
            thisMovement.description = description;
            thisMovement.title = title;
            thisMovement.color = color;

            setMovements(movements)

            setSnackbarState({
                ...snackbarState,
                open: true,
                color: "success",
                horizontal: "center",
                text: `Successfully edited movement`
            });
        }
    }

    const deleteMovement = (id) => {
        setMovements(movements.filter((e, i) => e.id !== id))
        setSnackbarState({
            ...snackbarState,
            open: true,
            color: "success",
            horizontal: "center",
            text: `Successfully deleted movement`
        });
    }

    const isMovementUnique = (slat, slng, elat, elng, description, id = null) => {

        var isUnique = true;

        movements.forEach((e, i) => {
            const identical =
                (e.coordinates[0][0] == slat &&
                    e.coordinates[0][1] == slng &&
                    e.coordinates[1][0] == elat &&
                    e.coordinates[1][1] == elng &&
                    e.description == description &&
                    id != e.id
                )
            if (identical) {
                isUnique = false;
            }
        })

        return isUnique;
    }

    // Sets the current features to the movements array
    const renderLines = () => {
        if (drawControl.current) {
            drawControl.current.draw.set({
                type: 'FeatureCollection',
                features: movements.map((line, i) => {
                    return {
                        type: 'Feature',
                        properties: { description: line.description, lineColor: line.color, }, //Description needs to be in properties sub-object ONLY for adding to map
                        id: line.id,
                        geometry: { type: 'LineString', coordinates: line.coordinates }
                    }
                })
            })
        }
        else {
            console.log(`Tried to render lines but drawControl.current was not set`)
        }
    }

    // Call renderLines when movement list is edited
    useEffect(() => {
        renderLines()
    }, [movements, snackbarState])

    // Color each line according to it's lineColor property
    const drawStyles = [{
        'id': 'custom-line',
        'type': 'line',
        'filter': ['all',
            ['==', '$type', 'LineString'],
            ['has', 'user_lineColor']
        ],
        'paint': {
            'line-color': ['get', 'user_lineColor'],
        }
    },
    {
        'id': 'highlight-vertices',
        'type': 'circle',
        'filter': ['all',
            ['==', '$type', 'LineString'],
            ['has', 'user_lineColor']
        ],
        'paint': {
            'circle-radius': 3,
            'circle-color': ['get', 'user_lineColor']
        }
    },
    {
        'id': 'cities',
        'type': 'circle',
        'filter': ['all',
            ['==', '$type', 'Point'],
            ['has', 'user_color']
        ],
        'paint': {
            'circle-radius': 4,
            'circle-color': ['get', 'user_color']
        }
    }];

    const lineColorPalette = [
        "#f44336",
        "#9c27b0",
        "#e91e63",
        "#3f51b5",
        "#2196f3",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#cddc39",
        "#ffeb3b",
        "#ff9800",
        "#795548",
    ]

    const cartDist = (pt1, pt2) => {
        const [x1, y1] = pt1;
        const [x2, y2] = pt2;
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
    }

    const movementsEmpty = (movements) => {
        var empty = true;
        movements.forEach((e, i) => {
            if (e.coordinates.length > 0) {
                empty = false;
            }
        })
        return empty
    }

    // Visits all start/end points, prioritizing nearest. Preserves start->end of each movement
    const computeRoute = () => {
        if (drawControl.current && movements.length > 1) {
            // First point of route is start of first line created
            const startPoint = movements[0].coordinates[0]
            const routeNodes = [{
                coordinates: startPoint,
                type: 'start'
            }]

            // Only grab the coordinates
            const _movements = movements.map((e, i) => {
                return { title: e.title, coordinates: [e.coordinates[0], e.coordinates[1]] }
            })


            // Pop the start point from _movements
            _movements[0].coordinates.splice(0, 1)

            // Initialize start point
            var nextNearestPoint = {
                coordinates: [0, 0],
                type: null
            }
            var nextIndex = [-1, -1]

            while (!movementsEmpty(_movements)) {
                // Find nearest next point
                var dist = Infinity
                _movements.forEach((e, i) => {
                    var prevPoint = routeNodes[routeNodes.length - 1].coordinates

                    if (e.coordinates == []) {
                        // Popped both start and end coordinate of point e
                    }
                    else if (e.coordinates[0]) {
                        if (cartDist(prevPoint, e.coordinates[0]) < dist) {
                            dist = cartDist(prevPoint, e.coordinates[0])
                            nextNearestPoint.coordinates = e.coordinates[0]
                            // If there is a 2nd coordinate, that means this is the start coordinate, otherwise this is the end coordinate
                            nextNearestPoint.type = e.coordinates[1] ? 'start' : 'end'
                            nextNearestPoint.title = e.title
                            nextIndex = i
                        }
                    }
                })

                // Pop the point from it's corresponding movement
                // By always popping the first element, we ensure the end of a movement will never be visited before it's corresponding start
                _movements[nextIndex].coordinates.splice(0, 1);
                routeNodes.push({
                    coordinates: nextNearestPoint.coordinates,
                    type: nextNearestPoint.type,
                    title: nextNearestPoint.title
                })
            }

            // Compares subsequent points in routeCoordinates and removes duplicates
            // Prevents [T->M->M->S], instead returns [T->M->S]
            routeNodes.forEach((e, i) => {
                if (routeNodes[i + 1] != null) {
                    if (routeNodes[i].coordinates[0] == routeNodes[i + 1].coordinates[0] && routeNodes[i].coordinates[1] == routeNodes[i + 1].coordinates[1]) {
                        routeNodes.splice(i, 1)
                    }
                }
            })
            console.log(routeNodes)
            setRoute(routeNodes)

            // Draw route
            drawControl.current.draw.deleteAll()

            drawControl.current.draw.set({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { lineColor: "#fff" },
                    geometry: { type: 'LineString', coordinates: routeNodes.map((e) => e.coordinates) }
                }]
            })
        }
        else {
            setSnackbarState({
                ...snackbarState,
                open: true,
                color: "error",
                horizontal: "center",
                text: `Cannot compute route for given movements`
            });
        }
    }

    const exampleGeoJson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [0, 0]
                },
                "properties": {
                    "name": "Fred",
                    "gender": "Male",
                    "color": "#e91e63"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [1, 1]
                },
                "properties": {
                    "name": "Martha",
                    "color": "#e91e63",
                    "gender": "Female"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [2, 2]
                },
                "properties": {
                    "name": "Zelda",
                    "color": "#e91e63",
                    "gender": "Female"
                }
            }
        ]
    }

    return (
        <Box m={2} >
            <Grid container justify="space-between">
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={handleSnackbarClose}
                    key={vertical + horizontal}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarState.color}>
                        {snackbarState.text}
                    </Alert>
                </Snackbar >
                <Grid item xs={4}>
                    <Card >


                        <TabMenu tabIndex={tabIndex} tabChange={tabChange} />
                        {renderTabContents(tabIndex)}
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card>
                        <Map
                            style="mapbox://styles/mapbox/dark-v10"
                            containerStyle={{
                                height: '90vh',
                            }}
                            onClick={mapClick}
                            center={mapCenter}
                        // onRender={renderLines}
                        >
                            <DrawControl
                                modes={{ _static: StaticMode }}
                                defaultMode="_static"
                                userProperties={true}
                                styles={drawStyles}
                                ref={drawControl}
                                displayControlsDefault={false}
                                clickBuffer={10} />
                        </Map>
                    </Card>
                </Grid>
            </Grid>
        </Box>

    );
}

export default MapContainer;