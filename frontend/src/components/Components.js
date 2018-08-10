import React,{Component} from 'react';
import Calendar from 'react-calendar';
import 'babel-polyfill';
import dateformat from 'dateformat';
import {CalendarComponent} from "./CalendarComponent";



// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
const host ="http://edutrip.herokuapp.com/";

class PowerStationsProvider extends Component{
    //onRendering get All Stations
    async componentDidMount(){
        try{
            const res = await fetch(host+"api/stations"); //await
            const in_stations = await res.json(); //await
            this.onRender(in_stations);
        }catch(e){
            console.log(e);
        }
    }

    onRender(stations){
        //set Parent station to stations
        this.props.onRender(stations);
    }

    render(){
        return null;
    }
}


class Trips extends Component{
    state ={
        station :{name:'Gitaru'},
    }

    async getBookedDates( station){

       try {
           //eg $host/Masinga/
           const res = await fetch(host + 'api/' + station + '/');
           const stations = await res.json();
           const booked_dates = [];
           const fully_booked_dates=[];
           const half_booked_dates = [];
           for (var s of stations) {
               booked_dates.push(s.date);
           }
           for(var s of stations ){
               if(booked_dates.filter(date => date == s.date).length == 1){
                  var obj = {day:s.date,period:s.time}
                   half_booked_dates.push(obj);
               }else{
                   fully_booked_dates.push(s.date);
               }
           }

           this.props.onRender({full:fully_booked_dates,half:half_booked_dates});
       } catch (e) {
           console.log(e);
       }
    }
   componentWillMount() {
        this.setState({station:this.props.station});
        this.getBookedDates(this.props.station.name);
   }

   componentWillUpdate(nextProps){
        if(this.props.station != nextProps.station){
            this.setState({station:this.props.station})
            this.getBookedDates(nextProps.station.name);
        }
   }


    render(){
        return null;
    }
}


class Institution extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'',
            pobox:'',
            city:'',
            number:'',
            email:'',
        }

        this.onSubmit = this.onSubmit.bind(this);
    }


    onSubmit(e){

        const endpoint = host+'api/add_institution/';
        try {

            fetch(endpoint,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        name: this.state.name,
                        po_box: this.state.pobox,
                        city: this.state.city,
                        number_of_visitors: this.state.number,
                        email: this.state.email
                    })

                }
            ).then(response => response.json())
                .then(json=> {
                    const institution = {
                id:json.id,
                 name:this.state.name,
                po_box:this.state.pobox,
                city:this.state.city,
                number:this.state.number,
                email:this.state.email
                 }
                 this.props.onSubmit(institution);

                })
        }

        catch(e){
            console.log(e);
        }
    }

    render(){
        return(
            <div>
                <form>

                    <div className="form-group">
                        <label htmlFor="name">Institution  </label>
                        <input id="name" type="text" name="name" onChange={(e)=>this.setState({name:e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pobox"> P.O. BOX  </label>
                        <input id="pobox" type="text" name="" onChange={(e)=>this.setState({pobox:e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City </label>
                         <input id="city" type="text" name="" onChange={(e)=>this.setState({city:e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="number"> number of visitors </label>
                        <input id="number" type="number" name="" onChange={(e)=>this.setState({number:e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email </label>
                        <input id="email" type="email" name="" onChange={(e)=>this.setState({email:e.target.value})} />
                    </div>
                    <div className="form-group">
                        <input type="button" value="Submit" onClick={this.onSubmit} className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        );
    }

}

const key = (
    <div className>
        <div className="row">
            <span className="morning_key col-sm-2">

            </span>
            <span className="col-sm-10" >
                Booked in the morning
            </span>
        </div>
        <div className="row">
            <span className="afternoon_key col-sm-2">
            </span>
            <span className="col-sm-10">
                Booked in the afternoon
            </span>
        </div>
        <div className="row">
            <span className="not_available col-sm-2">

            </span>
            <span className="col-sm-10">
                Date not available for booking
            </span>
        </div>
    </div>

);

class PowerStation extends Component{
    constructor(props){
        super(props);
        this.state={
            all_stations :[],
            station:{name:"Gitaru"},
            booked_dates:[],
            half_booked:[],
            date:'',
            time:'',
        }
        this.getStations = this.getStations.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.getBookedDates = this.getBookedDates.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.submitStation = this.submitStation.bind(this);
    }

    getStations(stations){
        //stations from the PowerstationsProvider
        this.setState({all_stations:stations});
    }

    handleSelect(e){
        let station;
        station = e.target.value;
        station = JSON.parse(station);
        //set date = ' ' and time '' till reselected
        this.setState({station:station,date:'',time:''});
    }

    getBookedDates(dates){
        var half_dates = dates.half;
        this.setState({booked_dates:dates.full,half_booked:half_dates});


    }

    changeDate(date){
        this.setState({date:date});
    }

    submitStation(e){
        const station = this.state.station;
        const date = dateformat(this.state.date,"yyyy-mm-dd");
        const time = this.state.time;
        //Gotta change the time here and include a way to change time

        this.props.onSubmit({station:station,date:date,time:time});
    }



    render(){

        const form = (
            <div className="form-group">
                <label htmlFor="powerstationselect"> Select Power station </label>
                <select onChange={this.handleSelect} className="form-control form-control-md" id="powerstationselect">
                    {
                          this.state.all_stations.map(
                              station =>
                              <option key={station.name} value={JSON.stringify(station)}>{station.name}</option>
                          )
                    }
                </select>
          </div>);


        const display = (
            <div>
                <p> Book {this.state.station.name} on <i>{this.state.date}</i> at <i>{this.state.time}</i> </p>
            </div>
        );

        const half_booked_days =[];
        let timeForm;
        for(var obj of this.state.half_booked ){
            //Get all halfbooked dates
            half_booked_days.push(obj.day);
        }
        //if selected dates is among halfBooked days.
        if(half_booked_days.includes(this.state.date)){
            this.state.half_booked.filter(obj =>{
                if(obj.day == this.state.date){

                    if(obj.period == "2:00 p.m."){
                        timeForm =(
                            <form className="timeForm">
                                <label htmlFor="morning">
                                    10:00 a.m.
                                </label>
                                <input type="checkbox" name="time" id="morning" value="10:00 a.m." onChange={(e)=> this.setState({time:e.target.value})}/>
                            </form>
                        );
                    }else if(obj.period =="10:00 a.m."){

                        timeForm=(
                            <form className="timeForm">
                                <label htmlFor="afternoon">
                                    2:00 p.m.
                                </label>
                                <input id="afternoon" name="time" type="checkbox" value="2:00 p.m." onChange={(e)=> this.setState({time:e.target.value})}/>
                            </form>
                        );
                    }
                }
            })
        }else{
            timeForm = (
              <div>
                  <form className="timeForm">
                      <div className="row">
                          <label htmlFor="morning">10:00 a.m.</label>
                          <input type="radio" id="morning" name="time" value="10:00 a.m." onChange={(e)=> this.setState({time:e.target.value})}/>
                      </div>
                      <div row>
                           <label htmlFor="afternoon">2:00 p.m.</label>
                           <input type="radio" id="afternoon" name="time" value="2:00 p.m." onChange={(e)=> this.setState({time:e.target.value})}/>
                      </div>

                  </form>
              </div>
            );
        }


        return(
          <div>
              <Trips station={this.state.station} onRender={this.getBookedDates}/>
              <PowerStationsProvider onRender={this.getStations} />

                  <div className="row">
                      <div className="col-md-7">
                        {form}
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-md-12">
                          <h3>Book {this.state.station.name} {this.state.date != '' && <span>on {this.state.date} </span>} {this.state.time != '' && <span> at {this.state.time}</span>}</h3>
                      </div>
                      <div className="col-md-7">
                            <CalendarComponent className="calendar" booked_dates={this.state.booked_dates} half_booked={this.state.half_booked} onDateChange ={this.changeDate} station={this.state.station} unavailable_dates={{fro:this.state.station.unavailable_from, to:this.state.station.unavailable_until}} />
                      </div>
                      <div className="col-md-5">
                          {key}
                      </div>
                  </div>

              <div  className="row">
                    {this.state.date != '' && timeForm}
              </div>
              <input type="button" value="Select Station and Date" onClick={this.submitStation} className="btn btn-primary"/>
          </div>
        );
    }
}



class BookTrip extends Component{
    constructor(props){
        super(props);
        this.state={
            station:'',
            date: '',
            time:'',
            institution:''
        }
        //bind functions
        this.getStation = this.getStation.bind(this);
        this.getDate = this.getDate.bind(this);
        this.getInstitution = this.getInstitution.bind(this);
        this.sendBookingRequest = this.sendBookingRequest.bind(this);
        this.getTime = this.getTime.bind(this);
    }

    componentDidMount(){
        this.getStation();
        this.getDate();
        this.getInstitution();
        this.getTime();
    }
    getStation(){
        const station = this.props.station;
        this.setState({station:station});
    }
    getDate(){
        const date = this.props.date;
        this.setState({date:date});
    }
    getTime(){
        this.setState({time:this.props.time});
    }
    getInstitution(){
        const institution = this.props.institution;
        this.setState({institution:institution});
    }

    sendBookingRequest(e){
        const endpoint = host+'api/create_trip/';
        const institution = this.state.institution.id;
        const station = this.state.station.id;
        fetch( endpoint,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                        institution: institution,
                        station: station,
                        date: this.state.date,
                        time: this.state.time,
                    }
                )
            }

        );

    }


    render(){
        const statement = (
            <div>
                <h3>Book  {this.state.station.name } on  {this.state.date} at  {this.state.time} </h3>
                <h3>School: {this.state.institution.name}  </h3>
                <h3>Email: {this.state.institution.email}</h3>
            </div>
        );
        return(
            <div>
                <h2>{statement}</h2>
                <input type="button" value="Book Trip" onClick={this.sendBookingRequest} />
            </div>
        );
    }
}





export class Container extends Component{
    constructor(props){
        super(props);
        this.state={
            station:{},
            date:{},
            time:'',
            institution:{},
            station_is_selected:false,
            institution_is_set: false,
        }
        this.getFromInstitution = this.getFromInstitution.bind(this);
        this.getFromPowerStation = this.getFromPowerStation.bind(this);
    }
    getFromPowerStation(args){
        //get Station, date, time
        const station = args.station;
        const date = args.date;
        const time = args.time;
        this.setState({station:station,date:date,time:time,station_is_selected:true});


    }
    getFromInstitution(institution){
     //get institution
        this.setState({institution:institution,institution_is_set:true});
    }
    render(){
        const station = this.state.station;
        const date = this.state.date;
        const time = this.state.time;
        const institution = this.state.institution;
        return(
            <div>
                <PowerStation onSubmit={this.getFromPowerStation} />
                {this.state.station_is_selected &&
                <Institution onSubmit={this.getFromInstitution}/>
                }
                { this.state.station_is_selected && this.state.institution_is_set &&
                <BookTrip station={station} date={date} time={time} institution={institution}/>
                }

            </div>
        );
    }
}

export default Container;