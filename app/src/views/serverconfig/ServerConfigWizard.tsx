import './ServerConfigWizard.css';

import { Button, Steps } from 'antd';
import * as React from 'react';
import { Page1 } from './Page1';
import { Page2 } from './Page2';
import { Page3 } from './Page3';
const Step = Steps.Step;

interface IProps {
    readonly rerender: () => void;
}

interface IState {
    selectedItems: string[];
    currentPage: number;
}

export class ServerConfigWizard extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            currentPage: 0,
            selectedItems: []
        };
    }

    public next() {
        const current = this.state.currentPage + 1;
        this.setState({ ...this.state, currentPage: current });
    }

    public prev() {
        const current = this.state.currentPage - 1;
        this.setState({ ...this.state, currentPage: current });
    }

    public render() {
        const { currentPage } = this.state;
        const onClickPrevious = () => this.prev();
        const onClickDone = () => this.props.rerender();
        const onClickNext = () => this.next();
        return (
            <div className="server-config-wizard">
                <Steps current={currentPage} >
                    <Step key="step_1" title="STEP 1" />
                    <Step key="step_2" title="STEP 2" />
                    <Step key="step_3" title="STEP 3" />
                </Steps>
                <div className="steps-content">
                    {currentPage === 0 && <Page1 />}
                    {currentPage === 1 && <Page2 />}
                    {currentPage === 2 && <Page3 />}
                </div>
                <div className="steps-action">
                    <Button disabled={currentPage === 0} style={{ marginLeft: 8 }} onClick={onClickPrevious}>
                        Previous
                    </Button>
                    {
                        currentPage === 2
                        && <Button type="primary" onClick={onClickDone}>Install</Button>
                    }
                    {
                        currentPage < 2
                        && <Button type="primary" onClick={onClickNext}>Next</Button>
                    }
                </div>
            </div>
        );
    }
}
