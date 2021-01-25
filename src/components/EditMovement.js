import React, { useEffect, useRef, useState } from 'react';
import RoomIcon from '@material-ui/icons/Room';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import { Box, Button, Card, Grid, Popover, TextField, Typography } from '@material-ui/core';
import { GithubPicker } from 'react-color';

function EditMovement(props) {

    const saveBtn = useRef(null)
    const [inputFields, setInputFields] = useState({
        slat: undefined,
        slng: undefined,
        elat: undefined,
        elng: undefined,
        title: "",
        description: "",
        color: "#303f9f",
        id: 0
    })

    const [error, setError] = useState({
        slng: false,
        slat: false,
        elng: false,
        elat: false
    })

    //0 || props.movement.slat
    const { slat, slng, elat, elng, title, description, color } = inputFields;

    // Fill edit fields
    useEffect(() => {
        if (props.movement) {
            const { id, coordinates, title, description, color } = props.movement

            setInputFields({
                slat: coordinates[0][1],
                slng: coordinates[0][0],
                elat: coordinates[1][1],
                elng: coordinates[1][0],
                title,
                description,
                color,
                id
            })
        }
    }, [])



    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const isPopoverOpen = Boolean(popoverAnchor);
    const openPopover = (event) => {
        setPopoverAnchor(event.currentTarget);
    };
    const closePopover = () => {
        setPopoverAnchor(null);
    };

    const [pickLngLat, setPickLngLat] = useState({
        start: false,
        end: false
    })

    useEffect(() => {
        if (!props.lastClickLngLat) return;
        const { lng, lat } = props.lastClickLngLat;

        if (pickLngLat.start) {
            setInputFields({ ...inputFields, slat: lat, slng: lng })
            props.drawControl.current.draw.delete(['start', 'end'])
            setTimeout(() => {
                props.drawControl.current.draw.add({
                    type: 'Feature',
                    properties: { color: color }, //Description needs to be in properties sub-object ONLY for adding to map
                    id: 'start',
                    geometry: { type: 'Point', coordinates: [lng, lat] }

                })

            }, 1)
            setPickLngLat({ start: false, end: true })
        }
        if (pickLngLat.end) {
            setInputFields({ ...inputFields, elat: lat, elng: lng })
            props.drawControl.current.draw.add({
                type: 'Feature',
                properties: { color: color }, //Description needs to be in properties sub-object ONLY for adding to map
                id: 'end',
                geometry: { type: 'Point', coordinates: [lng, lat] }

            })
            setPickLngLat({ end: false })
        }
    }, [props.lastClickLngLat])
    // Scroll to botton (saveBtn) on render
    useEffect(() => { saveBtn.current?.scrollIntoView(); }, [pickLngLat])
    const save = () => {

        // Non-zero validation
        if ([slng, slat, elng, elat].includes(undefined)) {
            setError({
                slng: !slng,
                slat: !slat,
                elng: !elng,
                elat: !elat
            })
        }
        else {
            props.setInputOpen(false)
            props.save(inputFields)
            props.renderLines()
            resetFields()
        }
    }

    const resetFields = () => {
        setInputFields({
            slat: 0,
            slng: 0,
            elat: 0,
            elng: 0,
            title: "",
            description: "",
            color: "#303f9f"
        })
    }

    const cancel = () => {
        props.setInputOpen(false)
    }

    return (
        <Card>
            <Box m={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField size="medium" fullWidth autoFocus label="Title" placeholder="Add Title" value={title} onChange={(e) => setInputFields({ ...inputFields, title: e.target.value })} />
                    </Grid>
                    <Grid container item justify="space-between" alignItems="center">
                        <Grid inputMode>
                            <Typography variant="body" align="left">Location</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Button onClick={() => { setPickLngLat({ start: true }) }} variant="contained" color="primary" startIcon={<ColorizeIcon />} >Pick location</Button> */}
                            {/* <IconButton variant="contained" color="primary" onClick={() => { setPickLngLat({ start: true }) }}>
                                <Tooltip title="Click on map to pick coordinates" >
                                    <ColorizeIcon />
                                </Tooltip>
                            </IconButton> */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    props.setSnackbarState({
                                        open: true,
                                        color: "info",
                                        vertical: 'top',

                                        horizontal: "center",
                                        text: `Click anywhere on the map to drop start/end point`
                                    })
                                    setPickLngLat({ start: true })
                                }} startIcon={<RoomIcon />}>
                                Select location
                        </Button>

                        </Grid>
                    </Grid>

                    {(pickLngLat.start || pickLngLat.end || slat || elat || error.slat || error.elat) && <Grid item container>

                        <Grid container item justify="space-between" alignItems="center">
                            <Grid item >
                                <Typography variant="body" align="left">From</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField InputLabelProps={{ shrink: true }} variant="outlined" error={error.slng} helperText={error.slng ? "Enter valid coordinate" : null} value={slng} label="Longitude" onChange={(e) => setInputFields({ ...inputFields, slng: e.target.value })} />
                                <TextField InputLabelProps={{ shrink: true }} variant="outlined" error={error.slat} helperText={error.slat ? "Enter valid coordinate" : null} value={slat} label="Latitude" onChange={(e) => setInputFields({ ...inputFields, slat: e.target.value })} />
                            </Grid>
                        </Grid>

                        <Grid container item justify="space-between" alignItems="center">
                            <Grid item >
                                <Typography variant="body" align="left">To</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField InputLabelProps={{ shrink: true }} variant="outlined" error={error.elng} helperText={error.elng ? "Enter valid coordinate" : null} value={elng} label="Longitude" onChange={(e) => setInputFields({ ...inputFields, elng: e.target.value })} />
                                <TextField InputLabelProps={{ shrink: true }} variant="outlined" error={error.elat} helperText={error.elat ? "Enter valid coordinate" : null} value={elat} label="Latitude" onChange={(e) => setInputFields({ ...inputFields, elat: e.target.value })} />
                            </Grid>
                        </Grid>
                    </Grid>}

                    <Grid container item justify="space-between" alignItems="center">
                        <Grid item >
                            <Typography variant="body" align="left">Color</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" style={{ backgroundColor: color }} color="primary" onClick={openPopover} startIcon={<ColorLensIcon />}>
                                Select color
                        </Button>
                            <Popover
                                open={isPopoverOpen}
                                anchorEl={popoverAnchor}
                                onClose={closePopover}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <GithubPicker color={color} onChangeComplete={(color) => {
                                    if (slng, elng) {

                                        props.drawControl.current.draw.delete(['start', 'end'])
                                        setTimeout(() => {
                                            props.drawControl.current.draw.add({
                                                type: 'Feature',
                                                properties: { color: color.hex },
                                                id: 'start',
                                                geometry: { type: 'Point', coordinates: [slng, slat] }

                                            })
                                            props.drawControl.current.draw.add({
                                                type: 'Feature',
                                                properties: { color: color.hex },
                                                id: 'end',
                                                geometry: { type: 'Point', coordinates: [elng, elat] }

                                            })

                                        }, 1)
                                    }
                                    setInputFields({ ...inputFields, color: color.hex })
                                    closePopover()
                                }} />

                            </Popover>
                        </Grid>
                    </Grid>

                    <Grid container item justify="space-between" alignItems="center">
                        <TextField multiline fullWidth label="Description" value={description} onChange={(e) => setInputFields({ ...inputFields, description: e.target.value })} />

                    </Grid>
                    <Grid container item justify="flex-end" alignItems="center">
                        <Button onClick={cancel} variant="contained">Cancel</Button>
                        <Button ref={saveBtn} onClick={save} variant="contained" color="primary">Save</Button>
                    </Grid>

                </Grid>
            </Box >
        </Card >
    );
}

export default EditMovement;