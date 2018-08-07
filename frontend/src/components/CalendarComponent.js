import React,{Component} from 'react';
import Calendar from 'react-calendar';
import 'babel-polyfill';
import dateformat from 'dateformat';


export class CalendarComponent extends Component{
    state={
        date: new Date(),
        half_booked:[],
        booked_dates:[],
    }

    componentWillMount(){
        this.setState({half_booked:this.props.half_booked, booked_dates:this.props.booked_dates});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.half_booked != this.props.half_booked){
            this.setState({half_booked:[]});
            this.setState({half_booked:nextProps.half_booked});
        }

        if(nextProps.booked_dates !=  this.props.booked_dates){
            this.setState({booked_dates:[]});
            this.setState({booked_dates:nextProps.booked_dates});
        }

    }




    //on Date change
    onChange = date => {
        this.setState({date:date});
        this.props.onDateChange(dateformat(date,"yyyy-mm-dd"));
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

    is_booked(date){
        date = dateformat(date,"yyyy-mm-dd");
        return this.state.booked_dates.includes(date);
    }

    time_booked =({date,view}) =>(
      this.getTimeBooked(date)
    );
    getTimeBooked(date) {
        date = dateformat(date,"yyyy-mm-dd");
        for(var s of this.state.half_booked){
            if(s.day == date){
                if (s.period == "10:00 a.m."){
                    return 'booked_morning';
                }else{
                    return 'booked_afternoon';
                }
            }
        }
        return null;

    }


    tileDisabled = ({date, view }) => (
        this.is_weekend(date.getDay()) || this.inRange(date, this.props.unavailable_dates.fro, this.props.unavailable_dates.to) || this.is_booked(date)
);




    render(){
        return(
            <div>
                <Calendar onChange={this.onChange} value={this.state.date}  calendarType="ISO 8601" showNeighboringMonth={false} tileClassName={this.time_booked} tileDisabled={this.tileDisabled}/>
            </div>
        );
    }

}