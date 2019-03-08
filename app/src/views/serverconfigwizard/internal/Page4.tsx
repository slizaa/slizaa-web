import * as React from 'react';
import { IServerExtension } from './ServerConfigWizard';

/**
 * Defines the properties for the react component Page4
 */
interface IProps {
    selectedExtensions: IServerExtension[] 
}

export const Page4 = ( props: IProps ) => {
    
    const listItems = props.selectedExtensions.map((extension, key) =>
        <li key={extension.symbolicName}>{extension.symbolicName}</li>);

    return <React.Fragment>
        <h1>STEP 4</h1>
        <ul>
            {listItems}
        </ul>
    </React.Fragment>
}