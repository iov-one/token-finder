import "./App.css";

import React from "react";
import { withRouter } from "react-router-dom";

import { isInteractiveDisplay, StaticDisplay } from "./displays";
import { processInput } from "./inputprocessing";

interface TestProps {
  readonly location: any;
  readonly history: any;
  readonly match: any;
}

interface TestState {
  readonly input: string;
  readonly display: readonly StaticDisplay[];
}

class App extends React.Component<TestProps, TestState> {
  // tslint:disable-next-line:readonly-array
  private readonly timeouts: NodeJS.Timeout[] = [];

  public constructor(props: TestProps) {
    super(props);
    this.state = {
      input: "",
      display: [],
    };

    this.props.history.listen((location: any) => {
      const hashQuery: string = location.hash.slice(1);
      this.handleQuery(hashQuery);
    });

    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidMount(): void {
    const hashQuery: string = this.props.location.hash.slice(1);
    const query = decodeURIComponent(hashQuery);
    console.log("Initial query", query);
    this.handleQuery(query);
  }

  public render(): JSX.Element {
    const listItems = this.state
      ? this.state.display.map(display => {
          return (
            <div key={display.id} className={"display " + (display.deprecated ? "deprecated" : "")}>
              <div className="content">
                <div className="display-title">{display.interpretedAs}</div>
                <div className="display-data">{display.data}</div>
              </div>
            </div>
          );
        })
      : [];

    return (
      <div className="App">
        <header className="App-header">
          <input
            className="maininput"
            type="text"
            placeholder="hex address, bech32 address, pubkey, mnemonic …"
            value={this.state.input}
            onChange={this.handleChange}
            autoFocus
          />
          <div className={listItems.length === 0 ? "hidden" : "display-container"}>
            <div className="pair">
              <div className="pair-key">
                <small>Direct link:&nbsp;</small>
              </div>
              <div className="pair-value">
                <input
                  type="text"
                  className="direct-link"
                  readOnly={true}
                  value={`${window.location.href.replace(/#.*/, "")}#${encodeURIComponent(
                    this.state.input.trim(),
                  )}`}
                />
              </div>
            </div>
          </div>
        </header>
        <section className="App-body">
          <div className={listItems.length === 0 ? "hidden" : "display-container"}>
            <p className="description">interpreted as</p>
            {listItems}
          </div>
        </section>
      </div>
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value;
    console.log("handle change called", newValue);
    this.handleQuery(newValue);
  }

  private updateDisplay(updatedDisplay: StaticDisplay): void {
    const list = this.state.display.map(x => x);
    const index = list.findIndex(i => i.id === updatedDisplay.id);
    // tslint:disable-next-line:no-object-mutation
    list[index] = updatedDisplay;
    this.setState({
      display: list,
    });
  }

  private async handleQuery(newValue: string): Promise<void> {
    const out = await processInput(newValue);

    const allStatic = out.map(display => {
      if (isInteractiveDisplay(display)) {
        return {
          id: display.id,
          interpretedAs: display.interpretedAs,
          priority: display.priority,
          deprecated: display.deprecated,
          data: <div>Loading ...</div>,
        };
      } else {
        return display;
      }
    });

    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    for (const interactiveDisplay of out.filter(isInteractiveDisplay)) {
      const job = (): void => {
        interactiveDisplay
          .getData()
          .then(data => {
            const rendered = interactiveDisplay.renderData(data);
            return rendered;
          })
          .catch(error => ({
            id: interactiveDisplay.id,
            interpretedAs: interactiveDisplay.interpretedAs,
            priority: interactiveDisplay.priority,
            deprecated: interactiveDisplay.deprecated,
            data: <div className="error">{error.toString()}</div>,
          }))
          .then(rendered => {
            this.updateDisplay(rendered);
          });
      };

      // delay execution
      this.timeouts.push(setTimeout(job, 500));
    }

    this.setState({
      input: newValue,
      display: allStatic,
    });
  }
}

export default withRouter(App);
