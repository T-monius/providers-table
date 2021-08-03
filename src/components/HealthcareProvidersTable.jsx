import React, { Component } from 'react';
import axios from 'axios'

class HealthcareProvidersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providers: [],
    };
  };

  async componentDidMount() {
    let response;
    try {
      response = await axios.get('http://localhost:3001/api/v1/providers');
    } catch(e) {
      console.log(e);
      return;
    }
    this.setState({providers: response.data});
  };

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th colSpan="5">Healthcare Providers by NPI</th>
          </tr>
          <tr>
            <th>Name</th>
            <th>NPI</th>
            <th>Address</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {this.state.providers.map((provider) => {
            const { npi, name, address, telephone_number: telephoneNumber } = provider;
            return (
              <tr>
                <td>{npi}</td>
                <td>{name}</td>
                <td>{address}</td>
                <td>{telephoneNumber}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  };
}

export default HealthcareProvidersTable
