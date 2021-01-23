import React, { useState } from 'react';
import { Box, Button, Card, Divider, Grid, IconButton, Popover, TextField, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditMovement from './EditMovement';

function MovementSummary(props) {

    const line = props.line;
    const [hover, setHover] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

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
                            <Typography variant="h4" style={{ color: line.color }}  >{line.title || `Movement #${props.index}`}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton size="small" style={{ display: hover ? "inline" : "none" }} color="primary" onClick={() => setEditOpen(true)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="small" style={{ display: hover ? "inline" : "none" }} color="primary" onClick={() => props.deleteMovement(line.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>


                    </Grid>
                    <Grid container item>
                        {`(${line.coordinates[0][0]},${line.coordinates[0][1]})`}
                        <ArrowRightAltIcon />
                        {`(${line.coordinates[1][0]},${line.coordinates[1][1]})`}
                    </Grid>
                    <Grid container item>
                        <TextField variant="outlined" multiline disabled fullWidth value={line.description || "No description given"} />
                    </Grid>
                </Grid>
            </Box>
        </Card> : <EditMovement
                save={save}
                setInputOpen={setEditOpen}
                lastClickLngLat={props.lastClickLngLat}

                renderLines={props.renderLines}
                movement={line} />}


    </div>)
}

export default MovementSummary;