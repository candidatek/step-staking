import React from 'react';

const CustomIcon = () => {
    const containerStyle = {
        borderRadius: '50px',
        overflow: 'hidden',
        padding: '0px',
        margin: '0px',
        width: '28px',
        height: '28px',
        display: 'inline-block',
        background: 'rgb(3, 94, 88)'
    };

    return (
        <div style={containerStyle}>
            <svg x="0" y="0" width="28" height="28">
                <rect x="0" y="0" width="28" height="28" transform="translate(6.1036427966346665 -6.966250051115898) rotate(411.5 14 14)" fill="#018E74" />
                <rect x="0" y="0" width="28" height="28" transform="translate(-9.812762687197946 0.534701775006908) rotate(202.0 14 14)" fill="#C81474" />
                <rect x="0" y="0" width="28" height="28" transform="translate(-22.305930313837003 -9.480726151868955) rotate(323.3 14 14)" fill="#F26A02" />
            </svg>
            <svg x="0" y="0" width="28" height="28">
                <rect x="0" y="0" width="28" height="28" transform="translate(6.1036427966346665 -6.966250051115898) rotate(411.5 14 14)" fill="#018E74" />
                <rect x="0" y="0" width="28" height="28" transform="translate(-9.812762687197946 0.534701775006908) rotate(202.0 14 14)" fill="#C81474" />
                <rect x="0" y="0" width="28" height="28" transform="translate(-22.305930313837003 -9.480726151868955) rotate(323.3 14 14)" fill="#F26A02" />
            </svg>
        </div>
    );
};

export default CustomIcon;