import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function smallLoader() {
    return <div>
        <CircularProgress color="primary" size={40} thickness={6} />;
            </div>
}

export default smallLoader;