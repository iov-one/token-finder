import React from 'react';
import { withRouter } from 'react-router-dom';

import { processInput, StaticDisplay, isInteractiveDisplay } from './inputprocessing';
import './App.css';

interface TestProps {
  readonly location: any;
  readonly history: any;
  readonly match: any;
}

interface TestState {
  readonly input: string;
  readonly display: ReadonlyArray<StaticDisplay>;
}

class App extends React.Component<TestProps, TestState> {

  private readonly timeouts: NodeJS.Timeout[] = [];

  constructor (props: TestProps){
    super(props);
    this.state = {
      input: '',
      display: [],
    };

    this.props.history.listen((location: any, action: any) => {
      const hashQuery: string = location.hash.slice(1);
      this.handleQuery(hashQuery);
    });

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const hashQuery: string = this.props.location.hash.slice(1);
    const query = decodeURIComponent(hashQuery);
    console.log("Initial query", query);
    this.handleQuery(query);
  }

  updateDisplay(updatedDisplay: StaticDisplay) {
    const list = this.state.display.map(x => x);
    const index = list.findIndex(i => i.id == updatedDisplay.id);
    list[index] = updatedDisplay;
    this.setState({
      display: list,
    })
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    console.log('handle change called', newValue);
    this.handleQuery(newValue);
  }

  async handleQuery(newValue: string) {
    const out = await processInput(newValue);

    const allStatic = out.map(display => {
      if (isInteractiveDisplay(display)) {
        return {
          id: display.id,
          interpretedAs: display.interpretedAs,
          priority: display.priority,
          data: <div>Loading ...</div>,
        }
      } else {
        return display;
      }
    });

    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    for (const interactiveDisplay of out.filter(isInteractiveDisplay)) {
      const job = () => {
        interactiveDisplay.getData()
          .then(data => {
            const rendered = interactiveDisplay.renderData(data);
            return rendered;
          })
          .catch(error => ({
            id: interactiveDisplay.id,
            interpretedAs: interactiveDisplay.interpretedAs,
            priority: interactiveDisplay.priority,
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
  render() {

    const listItems = this.state ?
      this.state.display.map((display) =>
        <div key={display.id} className="display">
          <div className="display-title">{display.interpretedAs}</div>
          <div className="display-data">{display.data}</div>
        </div>
        )
      : [];

    return (
      <div className="App">
        <header className="App-header">
          <input className="maininput" type="text"
            placeholder="hex address, bech32 address, pubkey, mnemonic …"
            value={this.state.input}
            onChange={this.handleChange}
            autoFocus />
          <div className={listItems.length === 0 ? "hidden" : "display-container"}>
            <div className="pair">
              <div className="pair-key"><small>Direct link:&nbsp;</small></div>
              <div className="pair-value">
                <input type="text"
                  className="direct-link"
                  readOnly={true}
                  value={`${window.location.href.replace(/#.*/, '')}#${encodeURIComponent(this.state.input.trim())}`}
                  />
              </div>
            </div>
          </div>
        </header>
        <section className="App-body">
          <div className={listItems.length === 0 ? "hidden" : "display-container"}>
            <p className="description">interpreted as</p>
            { listItems }
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(App);
