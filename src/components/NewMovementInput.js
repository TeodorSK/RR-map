import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { GithubPicker } from 'react-color';



function NewMovementInput(props) {

    const [slat, setSLat] = useState(0);
    const [slng, setSLng] = useState(0);
    const [elat, setELat] = useState(0);
    const [elng, setELng] = useState(0);
    const [description, setDesc] = useState("");
    const [title, setTitle] = useState("")
    const [color, setColor] = useState('#008800')

    // const [inputFields, setInputFields] = useState({
    //     slat: 0,
    //     slng: 0,
    //     elat: 0,
    //     elng: 0,
    //     title: "",
    //     description: ""
    // })


    // Toggles state of picking Lng Lat inputs with mouseclick
    const [pickLngLat, setPickLngLat] = useState({
        start: false,
        end: false
    })

    const addMovement = (e) => {
        e.preventDefault()
        console.log(`received lnglat: ${slng} ${slat}`)
        props.addMovement(parseFloat(slat), parseFloat(slng), parseFloat(elat), parseFloat(elng), title, description, color)
        resetFields()
    }

    const resetFields = () => {
        setSLat(0)
        setSLng(0)
        setELat(0)
        setELng(0)
        setTitle("")
        setDesc("")
    }

    useEffect(() => {
        if (!props.lastClickLngLat) return;
        const { lng, lat } = props.lastClickLngLat;

        if (pickLngLat.start) {
            setSLat(lat)
            setSLng(lng)
            setPickLngLat({ start: false, end: true })
        }
        if (pickLngLat.end) {
            setELat(lat)
            setELng(lng)
            setPickLngLat({ end: false })
        }
    }, [props.lastClickLngLat])

    return (
        <div style={{ backgroundColor: color }}>
            <TextField onChange={(e) => setSLat(e.target.value)} value={slat} label="Start Lat" variant="outlined" />
            <TextField onChange={(e) => setSLng(e.target.value)} value={slng} label="Start Lng" variant="outlined" />
            <Button onClick={() => { setPickLngLat({ start: true }) }}>pick</Button>
            <br />
            <TextField onChange={(e) => setELat(e.target.value)} value={elat} label="End Lat" variant="outlined" />
            <TextField onChange={(e) => setELng(e.target.value)} value={elng} label="End Lng" variant="outlined" />
            <br />
            <TextField onChange={(e) => setDesc(e.target.value)} value={description} label="Description" variant="outlined" />
            <br />
            <TextField onChange={(e) => setTitle(e.target.value)} value={title} label="Title" variant="outlined" />
            <br />
            <GithubPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
            <br />
            <Button onClick={addMovement}>Add movement</Button>
            <Button onClick={props.computeRoute}>Compute Route</Button>
            <Button onClick={props.renderLines}>Render Movements</Button>
        </div>
    );
}

export default NewMovementInput;