import './ServerConfigWizard.css';

import { Button, Steps } from 'antd';
import * as React from 'react';
const Step = Steps.Step;

interface IProps {
   readonly rerender: () => void;
}

export const StepContent1 = () => {
    return <h1>STEP 1</h1>
}

export const StepContent2 = () => {
    return <h1>STEP 2</h1>
}

export const StepContent3 = () => {
    return <h1>STEP 3</h1>
}

export class ServerConfigWizard extends React.Component<IProps, any> {
    
    constructor(props: IProps) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    public next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    public prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    public render() {
        const { current } = this.state;
        const onClickPrevious = () => this.prev();
        const onClickDone = () =>  this.props.rerender();
        const onClickNext = () => this.next();
        return (
            <div className="server-config-wizard">
                <Steps current={current} >
                    <Step key="step_1" title="STEP 1" />
                    <Step key="step_2" title="STEP 2" />
                    <Step key="step_3" title="STEP 3" />
                </Steps>
                <div className="steps-content">
                { current === 0 && <StepContent1 /> }
                { current === 1 && <StepContent2 /> }
                { current === 2 && <StepContent3 /> }
                </div>
                <div className="steps-action">
                    <Button disabled={current === 0} style={{ marginLeft: 8 }} onClick={onClickPrevious}>
                        Previous
                    </Button>
                    {
                        current === 2
                        && <Button type="primary" onClick={onClickDone}>Done</Button>
                    }
                    {
                        current < 2
                        && <Button type="primary" onClick={onClickNext}>Next</Button>
                    }
                </div>
            </div>
        );
    }
}
