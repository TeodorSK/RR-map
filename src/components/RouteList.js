import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import { Box, Grid, Typography } from '@material-ui/core';


function RouteList(props) {

    const renderRoute = props.route ? props.route.map((node, i) => (
        <Box m={2} key={i}>
            <Grid container >
                <Grid container item alignItems="baseline">
                    <Grid item xs={3}>
                        {node.type === "start" ? <CallMadeIcon fontSize="large" style={{ color: '#F78914' }} /> : <CallReceivedIcon fontSize="large" style={{ color: '#92CD28' }} />}
                    </Grid>
                    <Grid item >
                        <Typography align="left" variant="h6" >{node.type === "start" ? "Pickup: " : "Dropoff: "}</Typography>
                    </Grid>
                    <Grid item>

                        <Typography align="left" variant="h6" >{node.title || `Movement #${i}`}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography align="left" variant="subtitle2">
                            {`(${node.coordinates[0]},${node.coordinates[1]})`}
                        </Typography>
                    </Grid>
                </Grid>
                {(i !== props.route.length - 1) && <Grid container item>
                    <Grid item xs={3}>
                        <MoreVertIcon fontSize="large" style={{ color: '#ADADAD' }} />
                    </Grid>
                </Grid>}


            </Grid>
        </Box>
    )) : null

    return (
        <div>
            {renderRoute}
        </div>
    );
}

export default RouteList;