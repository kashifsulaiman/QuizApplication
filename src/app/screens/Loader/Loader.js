import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function CircularUnderLoad() {
    return (
        <div style={{ height: '100vh', position: 'absolute', top: '48%', left: "48%" }}>
            <CircularProgress color="primary" size={60} thickness={6} />
        </div>
    )
}

export default CircularUnderLoad;