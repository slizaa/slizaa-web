import * as React from 'react';

const mainDivStyle: React.CSSProperties = { position: 'relative', height: '20px', width: '20px' };
const centeredImageStyle: React.CSSProperties = { padding: '2px', height: '16px', width: '16px', objectFit: 'cover' };
const topLeftImageStyle: React.CSSProperties = { top: '0px', left: '0px', height: '8px', width: '8px', position: 'absolute', objectFit: 'cover' };
const topRightImageStyle: React.CSSProperties = { top: '0px', right: '0px', height: '8px', width: '8px', position: 'absolute', objectFit: 'cover' };
const bottomLeftImageStyle: React.CSSProperties = { bottom: '0px', left: '0px', height: '8px', width: '8px', position: 'absolute', objectFit: 'cover' };
const bottomRightImageStyle: React.CSSProperties = { bottom: '0px', right: '0px', height: '8px', width: '8px', position: 'absolute', objectFit: 'cover' };

interface INodeIconProps {
    centerImageSrc: string;
    topLeftImageSrc?: string;
    topRightImageSrc?: string;
    bottomLeftImageSrc?: string;
    bottomRightImageSrc?: string;
}

export function NodeIcon(props: INodeIconProps) {

    let topLeftImage;
    let topRightImage;
    let bottomLeftImage;
    let bottomRightImage;

    if (props.topLeftImageSrc !== undefined) {
        topLeftImage = <img style={topLeftImageStyle} src={props.topLeftImageSrc} />
    }
    if (props.topRightImageSrc !== undefined) {
        topRightImage = <img style={topRightImageStyle} src={props.topRightImageSrc} />
    }
    if (props.bottomLeftImageSrc !== undefined) {
        bottomLeftImage = <img style={bottomLeftImageStyle} src={props.bottomLeftImageSrc} />
    }
    if (props.bottomRightImageSrc !== undefined) {
        bottomRightImage = <img style={bottomRightImageStyle} src={props.bottomRightImageSrc} />
    }

    return (

        <div className="slizaaNodeIcon" style={mainDivStyle}>
           <img style={centeredImageStyle} src={props.centerImageSrc} />
           {topLeftImage}
           {topRightImage}
           {bottomLeftImage}
           {bottomRightImage}
        </div>
    )
}

export default NodeIcon;