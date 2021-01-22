import React from 'react';

function RouteList(props) {

    const renderRoute = props.route ? props.route.map((node) => (<p>
        <h4>{node.title}</h4>
        <span>{node.type}</span>
        <span>{node.coordinates} </span>
    </p>)) : null

    return (
        <div>
            route: {renderRoute}
        </div>
    );
}

export default RouteList;