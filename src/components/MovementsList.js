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


function MovementsList(props) {

    const [openDialog, setOpenDialog] = React.useState(false);

    const [slat, setSLat] = useState(0);
    const [slng, setSLng] = useState(0);
    const [elat, setELat] = useState(0);
    const [elng, setELng] = useState(0);
    const [description, setDescription] = useState("")
    const [id, setID] = useState(null)



    const handleOpenDialog = (line) => {
        setSLng(line.coordinates[0][0])
        setSLat(line.coordinates[0][1])
        setELng(line.coordinates[1][0])
        setELat(line.coordinates[1][1])
        setDescription(line.description)
        setID(line.id)
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = () => {
        props.editMovement(parseFloat(slat), parseFloat(slng), parseFloat(elat), parseFloat(elng), description, id)
        handleCloseDialog();
    }

    const getLineDetails = (line) => {
        const thisLine = props.movements.find((e) => e.id === line.id)
        return (<p key={line.id} style={{ backgroundColor: line.color }}>
            <span><b>Start:</b>{`${thisLine.coordinates[0][0].toFixed(2)},${thisLine.coordinates[0][1].toFixed(2)}`}</span>
            <br />
            <span><b>End:</b>{`${thisLine.coordinates[1][0].toFixed(2)},${thisLine.coordinates[1][1].toFixed(2)}`}</span>
            <br />
            <span><b>Description:</b> {line.description}</span>
        </p>)
    }

    return (
        <div>
            {props.movements.map((line, i) => (
                <div key={line.id}>
                    {getLineDetails(line)}
                    <Button onClick={() => props.deleteMovement(line.id)}>X</Button>
                    <Button onClick={() => handleOpenDialog(line)}>Edit</Button>
                </div>
            ))}


            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Movement</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="slat"
                        value={slat}
                        onChange={(e) => setSLat(e.target.value)}
                        type="text"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="slng"
                        value={slng}
                        onChange={(e) => setSLng(e.target.value)}
                        type="text"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="elat"
                        value={elat}
                        onChange={(e) => setELat(e.target.value)}
                        type="text"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="elng"
                        value={elng}
                        onChange={(e) => setELng(e.target.value)}
                        type="text"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MovementsList;