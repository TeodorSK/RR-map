import React, { useState } from 'react';
import { Box, Button, Card, Dialog, DialogActions, DialogTitle, Divider, Grid, IconButton, Popover, TextField, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditMovement from './EditMovement';
import RoomIcon from '@material-ui/icons/Room';
import SubjectIcon from '@material-ui/icons/Subject';


function MovementSummary(props) {

    const line = props.line;
    const [hover, setHover] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const save = (inputFields) => {
        props.editMovement(inputFields)
        setEditOpen(false);
    }

    return (<div>

        {!editOpen ? <Card key={line.id} onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <Box m={2}>
                <Grid container spacing={2}>
                    <Grid container item justify="space-between">
                        <Grid item>
                            <Typography variant="h4" style={{ color: line.color, marginLeft: 20 }}  >{line.title || `Movement #${props.index}`}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton size="small" style={{ display: hover ? "inline" : "none" }} color="primary" onClick={() => setEditOpen(true)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="small" style={{ display: hover ? "inline" : "none" }} color="primary" onClick={() => setDeleteOpen(true)}>
                                <DeleteIcon />
                            </IconButton>
                            <Dialog
                                open={deleteOpen}
                                onClose={() => setDeleteOpen(false)}
                            >
                                <DialogTitle >{"Delete movement?"}</DialogTitle>
                                <DialogActions>
                                    <Button onClick={() => setDeleteOpen(false)} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={() => {
                                        props.deleteMovement(line.id)
                                        setDeleteOpen(false)
                                    }} color="primary" autoFocus>
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>


                    </Grid>
                    <Grid container item alignItems="center">
                        <Grid item>
                            <RoomIcon />
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">
                                {`(${line.coordinates[0][0]},${line.coordinates[0][1]})`}
                                <ArrowRightAltIcon />
                                {`(${line.coordinates[1][0]},${line.coordinates[1][1]})`}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item>
                        <Grid item>
                            <SubjectIcon />
                        </Grid>
                        <Grid item xs={11}>
                            <Typography align="left" variant="body1">{line.description || "No description given"}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Card> : <EditMovement
                save={save}
                setInputOpen={setEditOpen}
                lastClickLngLat={props.lastClickLngLat}
                drawControl={props.drawControl}
                renderLines={props.renderLines}
                movement={line}
                setSnackbarState={props.setSnackbarState} />
        }


    </div >)
}

export default MovementSummary;