﻿/*
* Copyright (C) 2012 Doubango Telecom <http://www.doubango.org>
*
* Contact: Mamadou Diop <diopmamadou(at)doubango[dot]org>
*	
* This file is part of Open Source sipML5 solution <http://www.sipml5.org>
*
* sipML5 is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as publishd by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*	
* sipML5 is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*	
* You should have received a copy of the GNU General Public License
* along with sipML5.
*/
tsip_dialog_generic.prototype.init_message = function () {
    
    this.o_fsm.set(
        /*=======================
		* === Started === 
		*/
        // Started -> (SEND MESSAGE) -> InProgress
	    tsk_fsm_entry.prototype.CreateAlways(tsip_dialog_generic_states_e.STARTED, tsip_dialog_generic_actions_e.O_MESSAGE, tsip_dialog_generic_states_e.INPROGRESS, tsip_dialog_generic_Started_2_InProgress_X_oMessage, "tsip_dialog_generic_Started_2_InProgress_X_oMessage"),
        // Started -> (RECV MESSAGE) -> Incoming
        tsk_fsm_entry.prototype.CreateAlways(tsip_dialog_generic_states_e.STARTED, tsip_dialog_generic_actions_e.I_MESSAGE, tsip_dialog_generic_states_e.INCOMING, tsip_dialog_generic_Started_2_Incoming_X_iMessage, "tsip_dialog_generic_Started_2_Incoming_X_iMessage")

    );

}

tsip_dialog_generic.prototype.send_message = function () {
    var o_request;
    var i_ret = -1;

    if ((o_request = this.request_new("MESSAGE"))) {
        /* apply action params to the request */
        if (this.get_action_curr()) {
            if ((i_ret = tsip_dialog.prototype.ApplyAction(o_request, this.get_action_curr())) == 0) {
                i_ret = this.request_send(o_request);
            }
        }
    }

    return i_ret;
}


//--------------------------------------------------------
//				== STATE MACHINE BEGIN ==
//--------------------------------------------------------

// Started -> (SEND MESSAGE) -> InProgress
function tsip_dialog_generic_Started_2_InProgress_X_oMessage(ao_args) {
    var o_dialog = ao_args[0];
    var o_action = ao_args[2];

    o_dialog.b_running = true;
    o_dialog.set_action_curr(o_action);

    return o_dialog.send_message();
}

// Started -> (RECV MESSAGE) -> Incoming
function tsip_dialog_generic_Started_2_Incoming_X_iMessage(ao_args) {
    var o_dialog = ao_args[0];
    var o_request = ao_args[1];

    o_dialog.signal_i(tsip_event_code_e.DIALOG_REQUEST_INCOMING, "Incoming Request", o_request);
	o_dialog.o_last_iMessage = o_request;
    return 0;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//				== STATE MACHINE END ==
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++