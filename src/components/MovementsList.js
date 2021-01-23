import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { IconButton, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MovementSummary from './MovementSummary';


function MovementsList(props) {

    // const [openDialog, setOpenDialog] = React.useState(false);

    // const [slat, setSLat] = useState(0);
    // const [slng, setSLng] = useState(0);
    // const [elat, setELat] = useState(0);
    // const [elng, setELng] = useState(0);
    // const [description, setDescription] = useState("")
    // const [id, setID] = useState(null)

    // const handleOpenDialog = (line) => {
    //     setSLng(line.coordinates[0][0])
    //     setSLat(line.coordinates[0][1])
    //     setELng(line.coordinates[1][0])
    //     setELat(line.coordinates[1][1])
    //     setDescription(line.description)
    //     setID(line.id)
    //     setOpenDialog(true);
    // };

    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // };

    // const handleSave = () => {

    //     props.editMovement(parseFloat(slat), parseFloat(slng), parseFloat(elat), parseFloat(elng), description, id)
    //     handleCloseDialog();
    // }

    // refactored 
    const getLineDetails = (line, i) => {
        return (
            <MovementSummary line={line} index={i} deleteMovement={props.deleteMovement} editMovement={props.editMovement} renderLines={props.renderLines} />
        )
    }

    return (
        <div>
            {props.movements.map((line, i) => getLineDetails(line, i))}
        </div>
    );
}

export default MovementsList;