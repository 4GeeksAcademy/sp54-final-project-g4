import React from 'react';

export const Spinner = ({ color = black }) => {
    return (
        <div class="spinner-border" style={{color: color}} role="status"/>
    );
}