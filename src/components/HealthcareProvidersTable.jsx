import React, { Component } from 'react';
import axios from 'axios'

const PROVIDERS_URL = 'http://localhost:3001/api/v1/providers'

class HealthcareProvidersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      npi: '',
    };
  };

  componentDidMount() {
    this.getProviders();
  };

  componentDidUpdate() {
    this.getProviders();
  }

  getProviders = async () => {
    let response;
    try {
      response = await axios.get(PROVIDERS_URL);
    } catch(e) {
      console.log(e);
      return;
    }
    this.setState({providers: response.data || this.state.providers});
  }

  isProvidersContainsNPI = (npi) => {
    return this.state.providers.find((provider) => provider.npi === npi);
  }

  onSubmit = async (e) => {
    e.preventDefault();

    if (this.state.npi.length !== 10) { return }

    let response;
    if (this.isProvidersContainsNPI(this.state.npi)) {
      try {
        response = await axios.patch(`PROVIDERS_URL/${this.state.npi}`, {npi: this.state.npi});
      } catch(e) {
        console.log(e);
        return;
      };
    } else {
      try {
        response = await axios.post(PROVIDERS_URL, {npi: this.state.npi});
      } catch(e) {
        console.log(e);
        return;
      };
    }
      this.setState({providers: this.state.providers.concat(response), npi: ''});
  };

  handleNPIChange = (e) => {
    const currentNPI = e.target.value;
    this.setState({ npi: currentNPI });
  };

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th colSpan="5">Healthcare Providers by NPI</th>
            </tr>
            <tr>
              <th>NPI</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Organization</th>
              <th>Taxonomy</th>
            </tr>
          </thead>
          <tbody>
            {this.state.providers
              .sort((p1, p2) => {
                const t1 = new Date(p1.updated_at).getTime();
                const t2 = new Date(p2.updated_at).getTime();
                return t2 - t1;
              })
              .map((provider) => {
              const { npi, name, address, telephone_number: telephoneNumber, organization, taxonomy } = provider;
              return (
                <tr id={npi}>
                  <td>{npi}</td>
                  <td>{name}</td>
                  <td>{address}</td>
                  <td>{telephoneNumber}</td>
                  <td>{String(organization)}</td>
                  <td>{taxonomy}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <form onSubmit={this.onSubmit}>
          <dl>
            <dt>Enter an NPI of a provider to add:</dt>
            <dd><input onChange={this.handleNPIChange} value={this.state.npi}></input></dd>
          </dl>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };
}

export default HealthcareProvidersTable
