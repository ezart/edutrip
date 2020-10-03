 import React from 'react';
import ReactDOM from 'react-dom';
//import Calendar from 'react-calendar/dist/entry.nostyle';
import Calendar from 'react-calendar';
import 'babel-polyfill';
import dateformat from 'dateformat';

const host ="http://127.0.0.1:8080/"



export class InstitutionForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name:'',
            address:'',
            city:'',
            email:'',
            no_students:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        alert(this.state.name);
    }

    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }


    render(){
        return(
         <form onSubmit={this.handleSubmit}>
             <label>
                 NAME
             </label>
             <input type="text" name="name" onChange={this.handleChange} />
             <label>
                 ADDRESS
             </label>
             <input type="text" name="address" onChange={this.handleChange} />
             <label>
                 CITY
             </label>
             <input type="text" name="city" onChange={this.handleChange} />
             <label>
                 EMAIL
             </label>
             <input type="email" name="email" onChange={this.handleChange} />
             <label>
                 NUMBER OF VISITORS
             </label>
             <input type="number" name="no_students" onChange={this.handleChange} />
             <input type="submit" name="submit" value="SUBMIT"  />

         </form>
        );
    }
}


class PowerStations extends React.Component{
    async componentWillMount(){
       try{
            const res = await fetch('http://127.0.0.1:8080/api/stations/'); //await
            const in_stations = await res.json(); //await
            this.onRender(in_stations);
        }catch(e){
            console.log(e);
        }
    }

    onRender(stations){
        this.props.onRender(stations);
    }

    render(){
        return(
            null
        );
    }
}

class CalendarComponent extends React.Component {
    state = {
        date: new Date(),
        booked_dates:[]

    }

    async getFullyBookedDays(){
        const station = this.props.station;

        try{
            const res = await fetch('http://127.0.0.1:8080/api/'+station+'/' );
            const stations  = await res.json();
            this.state.booked_dates =[];
            for(var s of stations){
                this.state.booked_dates.push(new Date(s.date));
            }

        }catch (e){
            console.log(e);
        }


}
    componentWillMount(){
        this.getFullyBookedDays();
    }


    onChange = date => {
        alert(date+ " booked days "+ this.state.booked_dates);

        this.setState({date});
        this.props.onChangeDate(dateformat(date,"yyyy-mm-dd"));
    }

    is_weekend(num){
        return num === 0 || num === 6 ;
    }

     inRange(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
         if (start == null || end == null){
             return false;
         }
      start = new Date(start);
      end = new Date(end);
      return start < d && d <  end;
    }


    tileDisabled = ({date, view }) => (
        this.is_weekend(date.getDay()) || this.inRange(date, this.props.badDates.fro, this.props.badDates.to) || this.state.booked_dates.includes(date)
);
    render(){
        return(
            <div >
                <Calendar onChange={this.onChange} value={this.state.date} tileDisabled={this.tileDisabled} calendarType="ISO 8601"/>
            </div>
        );
    }
}


class TermsandConditions extends React.Component{
    render(){
        return(
          <div>
              <div>
              (PLEASE NOTE: BOOKING IS DONE 3 MONTHS IN ADVANCE)

        You are at the same time advised that on agreeing to this visit, the Kenya Electricity Generating Co. Ltd. accepts no liability for any accident or injury that might occur to any member of the visiting party during the tour,
        and you are requested therefore to exercise caution while moving within the station.  Visitors are advised NOT to wear high-heeled pointed and open shoes, as the floor could be slippery.  For safety and operational reasons,
        you will be required to present a certified list of a maximum of   80 visitors who will be allowed in. Any excess visitors and children under 10(ten) years will not be allowed in.  Please note that while entering our premises
        ID cards are mandatory for all adults, you will also be subjected to security checks and may be required to deposit certain  items with security officers.  Guardians are advised to co-operate with the officer leading the tour.
        Kindly note that there’s no provision for visiting during Weekends and Public Holidays.
              </div>
              <span>
                  <input type="checkbox" name="checkbox" onClick={this.props.onClick}/>
              </span>
          </div>

        );
    }
}

class PowerStationsSelect extends React.Component{
    constructor(props){
        super(props);
        this.state={
            stations :[]
        }
        this.handleSelect  = this.handleSelect.bind(this);
        this.setStation = this.setStation.bind(this);
    }


    handleSelect(e) {
        const station = e.target.value;
        //this.props.onSelect(station);
    }

    setStation(stations){
        this.setState({stations:stations});
    }

    render(){
        return (
            <div>
                {this.props}
                <PowerStations onRender={this.setStation}/>
                <select onChange={this.handleSelect}>
                    {
                        this.state.stations.map(
                            station =>
                            <option key={station.name} value={JSON.stringify(station)}>{station.name}</option>
                        )
                    }
                </select>
            </div>
        );
    }
}







export class Container extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            date:'',
            station:' before'
        }

        this.changeStation = this.changeStation.bind(this);
        this.changeDate = this.changeDate.bind(this);
    }

    changeStation(station){
        station = JSON.parse(station);
        this.setState({station:station});
    }
    changeDate(date){
        this.setState({date:date})
    }

    render(){
        return (
            <div>
            <PowerStationsSelect onSelect={this.changeStation}/>
                <br />
                <br />

            <CalendarComponent onChangeDate={this.changeDate} badDates={{fro:this.state.station.unavailable_from, to:this.state.station.unavailable_until}} station={this.state.station.name}/>

            </div>
        );

    }
}

