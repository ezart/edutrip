import React,{Component} from 'react';


export class TermsandConditions extends Component {
    constructor(props){
        super(props);
        this.state ={
            is_checked: false,
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <ul>
                            (PLEASE NOTE: BOOKING IS DONE 3 MONTHS IN ADVANCE)
                            <li>You are advised that on agreeing to this visit, the Kenya Electricity
                                Generating Co. Ltd. accepts no liability for any accident or injury that might occur to any
                                member of the visiting party during the tour,
                                and you are requested therefore to exercise caution while moving within the station
                            </li>
                            <li>Visitors are advised NOT to wear high-heeled pointed and open shoes, as the floor could be
                                slippery.
                            </li>
                            <li>For safety and operational reasons,
                                you will be required to present a certified list of a maximum of 80 visitors who will be allowed
                                in
                            </li>
                            <li>Any excess visitors and children under 10(ten) years will not be allowed in</li>
                            <li>ID cards are mandatory for all adults, you will also be subjected to security checks and may be
                                required to deposit certain items with security officers. Guardians are advised to co-operate
                                with the officer leading the tour.
                            </li>
                            <li> Guardians are advised to co-operate with the officer leading the tour.</li>
                            <li>Kindly note that there’s no provision for visiting during Weekends and Public Holidays.</li>
                    </ul>
                </div>
                <div className="col-md-12">
                    <div className="checkbox-row">
                    <input name="terms_accept" type="checkbox" className="checkbox-inline"
                           onChange={() => this.setState((prevState)=>{
                               return {is_checked:!prevState.is_checked}
                           })}

                           />
                    <label className="form-check-label"> <span className="font-weight-bold text-dark">I have read and understood the Terms and conditions
                        above.</span></label>
                </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4 offset-2">
                        {this.state.is_checked &&
                        <input className="btn btn-success col-md-8 " type="button" value="Next"
                               onClick={() => this.props.onReadTerms()}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}







export class ConfirmationMessage extends Component{
    render (){
            return(

                <div className="alert-success">
                        <p>
                        Your request to book {this.props.station} on {this.props.date} at {this.props.time} has been sent. You will receive an email on {this.props.email}
                        once your request has been reviewed. Bye.<br/>
                        <a href="https://kengen.co.ke"><input type="button" value="Back" /></a>
                        </p>
                </div>
        )
    }
}






