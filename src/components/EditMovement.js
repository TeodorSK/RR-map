import React, { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ColorizeIcon from '@material-ui/icons/Colorize';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import SubjectIcon from '@material-ui/icons/Subject';
import { Box, Button, Card, Divider, Grid, Popover, TextField, Typography } from '@material-ui/core';
import { GithubPicker } from 'react-color';

function EditMovement(props) {

    const [inputFields, setInputFields] = useState({
        slat: 0,
        slng: 0,
        elat: 0,
        elng: 0,
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
            setPickLngLat({ start: false, end: true })
        }
        if (pickLngLat.end) {
            setInputFields({ ...inputFields, elat: lat, elng: lng })
            setPickLngLat({ end: false })
        }
    }, [props.lastClickLngLat])

    const save = () => {

        // Non-zero validation
        if ([slng, slat, elng, elat].includes(0)) {
            setError({
                slng: slng === 0,
                slat: slat === 0,
                elng: elng === 0,
                elat: elat === 0
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
                        <TextField fullWidth autoFocus label="Title" placeholder="Add Title" value={title} onChange={(e) => setInputFields({ ...inputFields, title: e.target.value })} />
                    </Grid>
                    <Grid container item justify="space-between" alignItems="center">
                        <Grid inputMode>
                            <Typography variant="body" align="left">Location</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button onClick={() => { setPickLngLat({ start: true }) }} variant="contained" color="primary" startIcon={<ColorizeIcon />} >Pick location</Button>
                        </Grid>
                    </Grid>

                    <Grid container item justify="space-between" alignItems="center">
                        <Grid item >
                            <Typography variant="body" align="left">From</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField error={error.slng} helperText={error.slng ? "Enter valid coordinate" : null} value={slng} label="Longitude" onChange={(e) => setInputFields({ ...inputFields, slng: e.target.value })} />
                            <TextField error={error.slat} helperText={error.slat ? "Enter valid coordinate" : null} value={slat} label="Latitude" onChange={(e) => setInputFields({ ...inputFields, slat: e.target.value })} />
                        </Grid>
                    </Grid>

                    <Grid container item justify="space-between" alignItems="center">
                        <Grid item >
                            <Typography variant="body" align="left">To</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField error={error.elng} helperText={error.elng ? "Enter valid coordinate" : null} value={elng} label="Longitude" onChange={(e) => setInputFields({ ...inputFields, elng: e.target.value })} />
                            <TextField error={error.elat} helperText={error.elat ? "Enter valid coordinate" : null} value={elat} label="Latitude" onChange={(e) => setInputFields({ ...inputFields, elat: e.target.value })} />
                        </Grid>
                    </Grid>

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
                        <Button onClick={save} variant="contained" color="primary">Save</Button>
                    </Grid>

                </Grid>
            </Box >
        </Card >
    );
}

export default EditMovement;