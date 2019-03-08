import * as React from 'react';
import { IServerExtension } from './ServerConfigWizard';

interface IProps {
    selectedExtensions: IServerExtension[] 
}

export const Page3 = ( props: IProps ) => {
    
    const listItems = props.selectedExtensions.map((extension, key) =>
        <li key={extension.symbolicName}>{extension.symbolicName}</li>);

    return <React.Fragment>
        <h1>STEP 3</h1>
        <ul>
            {listItems}
        </ul>
    </React.Fragment>
}