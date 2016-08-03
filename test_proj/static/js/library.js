        function set(){
            var data = $$('insert_input').getValues();
            $$('slider_input').setValues(data);
        }

        function get() {
            var data = $$('slider_input').getValues();
            $$('insert_input').setValues(data);
        }

        //swaps two indices of an array
        function swap(array,ind1,ind2) {
            var temp = array[ind1]
            array[ind1] = array[ind2]
            array[ind2] = temp
        }


        function getData() {
            //creates new array and pushes each value in the slider to the array
            //the array hold the data in the same order:
                //NO, NMax, Rate, Time, and Lag

            var input_data = [];

            var y_initial = parseInt($$("input_table").getItem($$("input_table").getIdByIndex(0)).conc_input);
            var t_initial = parseInt($$("input_table").getItem($$("input_table").getIdByIndex(0)).time_input);

            //finds last valid data point
            var indexed = 0;
            while($$("input_table").getItem($$("input_table").getIdByIndex(indexed+1)).conc_input != null &&
                    $$("input_table").getItem($$("input_table").getIdByIndex(indexed+1)).time_input != null){
                indexed++
            }
            var y_max = parseInt($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input);
            var t_max = parseInt($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input);


            input_data.push( y_initial); //Y0
            input_data.push( y_max); //Ymax
            input_data.push(t_max); //time
            input_data.push( parseFloat($$('slider_input').getValues().s1)); //Rate/mu
            input_data.push( parseFloat($$('slider_input').getValues().s2)); //Lag/lambda
            input_data.push( parseFloat($$('slider_input').getValues().s3));
            input_data.push( parseFloat($$('slider_input').getValues().s4));
            input_data.push( parseFloat($$('slider_input').getValues().s5));

            return input_data
        }

        function submitModel(){
        // submits model parameters and data to the backend, recieves json object through ajax, displays in browser
            if(model.localeCompare("None")==0){
                console.log("No model selected!");
                return null;
            }
            var table_data = getTableData();

            $.ajax({
                type: "GET",
                url: 'data/',
                dataType: "json",
                data: {
                    csrfmiddlewaretoken: '{{ csrf_token }}',
                    model: model,
                    time_array: JSON.stringify(table_data[0]),
                    conc_array: JSON.stringify(table_data[1]),
                    params: JSON.stringify(getData().slice(3))

                },
                success: function(json) {
                    var data = json;
                    if( data['error'].localeCompare("successful") == 0) {
                        var text = data['text_output'];
                        var params = data['params'];
                        if(model.slice(0,1).localeCompare("S") == 0 || model.slice(0,1).localeCompare("D") == 0 ||
                                    model.slice(0,1).localeCompare("R") == 0){
                            swap(params, 0, 1)
                        }
                        graphCon(params);
                        $$("output_table").parse(data);
                        $$("export_table").setValue(text); //outputs info received to the user

                        //118 length until first add
                        //var end = "" + text.slice(116);
                        //text += end;
                        console.log(text);
                    }
                    else{
                        $$("output_table").parse({text_output: "Backend analysis failed, adjust parameters for better fit"});
                        $$("export_table").setValue("Backend analysis failed, adjust parameters for better fit.");
                    }
                },

            });
        }

	//will refresh the scatter plot with the updated data passed in via the datatable
        function plotData(){
            updatedData = [];
            $$("data_chart").clearAll();
            $$('input_table').editStop();

            for(var i = 0; i < data_points.length; i++){
                //if either conc_inputs have a value and time_input is not null, we want to add it to the array
                if((data_points[i].conc_input !=  null ||
                                    data_points[i].conc_input2 != null) && data_points[i].time_input != null) {
                    updatedData.push(data_points[i]);
                }
            }
            $$("data_chart").parse(updatedData);
            $$('data_chart').show();
        }

        function getTableData(){
             //creates two new arrays filled with x and y data from the input table, then returns them in a master array
            var time_array = [];
            var conc_array = [];
            var indexed = 0;

            while($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input != null &&
                    $$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input != null){
                time_array.push(parseFloat($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input));
                conc_array.push(parseFloat($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input));
                indexed++;
            }

            return [time_array, conc_array];

        }

        function printData(){
            $$('output_table').add(data_points);
        }



        function graphCon(dub_array){
            $$('data_chart').clearAll()
            data_set = getData();
            time = data_set[2];
            model_data = [];
            var i = 0;
            if(model.localeCompare('Gompertz') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(gompertzModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));

                }
            }
            else if(model.localeCompare('Huang') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(huangModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }
            else if(model.localeCompare('Baranyi') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(baranyiModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }
            else if(model.localeCompare('Buchanan') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(buchananModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }
            else if(model.localeCompare('No_lag') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(noLagModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('R_huang') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(redHuangModel(dub_array[0], dub_array[1], dub_array[2], time));

            }
            }
            else if(model.localeCompare('R_baranyi') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(redBaranyiModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('R2_buchanan') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(twoBuchananModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('S_linear') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sLinearModel(dub_array[0], dub_array[1], time));
                }
            }
            else if(model.localeCompare('S_linshoulder') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sLinearShoulderModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('S_gompertz') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sGompertzModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('S_weibull') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sWeibullModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('S_mafart') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sMafartModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }
            else if(model.localeCompare('SR2_buchanan') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sTwoBuchananModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }

            else if(model.localeCompare('S3_buchanan') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(sThreeBuchananModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }

            else if(model.localeCompare('D_Arrhenius_full') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(arrheniusFullModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], dub_array[4], time));
                }
            }

            else if(model.localeCompare('D_Arrhenius_sub') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(arrheniusSubModel(dub_array[0], dub_array[1], dub_array[2], time));
                }
            }

            else if(model.localeCompare('D_Cardinal_full') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(cardinalFullModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }

            else if(model.localeCompare('D_Huang_full_temp') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(huangFullModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }
            else if(model.localeCompare('D_Huang_sub_temp') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(huangSubModel(dub_array[0], dub_array[1], time));
                }
            }

            else if(model.localeCompare('D_Ratkowsky_full') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(ratkowskyFullModel(dub_array[0], dub_array[1], dub_array[2], dub_array[3], time));
                }
            }

            else if(model.localeCompare('D_Ratkowsky_sub') == 0){
                for(i = 0; i < 1; i++){
                    model_data = model_data.concat(ratkowskySubModel(dub_array[0], dub_array[1],time));
                }
            }

        for(var i = 0; i < data_points.length; i++){
                //if either conc_inputs have a value and time_input is not null, we want to add it to the array
                if((data_points[i].conc_input !=  null || data_points[i].conc_input2 != null) && data_points[i].time_input != null) {
                    model_data.push(data_points[i]);
                }
            }
        //console.log(model_data);
        $$('data_chart').parse(model_data);

        }

        function clearData(){
            //$$('input_table').clearAll()
            webix.confirm({
               ok: "Yes",
               cancel: "No",
               type: "alert-warning",
               text: "Are you sure you want to clear all data?",
               callback: function(result){
                   //if they clicked ok ("yes")
                   if(result === true){
                       for(var i = 0; i < data_points.length; i++){
                           data_points[i].conc_input = null;
                           data_points[i].time_input = null;
                           data_points[i].conc_input2 = null;
                       }
                       $$('input_table').refresh();
                   }
               }
           });
        }

        function printValue() {
             var datas =  $$('open_file').files.data.pull;
             var file_id = $$("open_file").files.getFirstId(); //getting the ID
             var fileobj = $$("open_file").files.getItem(file_id).file; //getting file object
             filename = fileobj.name.getValues;
         }

        //brings a pop-up window with a counter to add rows to the input_table
        function addRows(){
            webix.ui({
 				view:"window",
 				id:"add_rows",
 				height:250,
 			    width:184,
                left: 210,
                top: 60,
 			    //position: "center",
 			    head:{
 					view:"toolbar", cols:[
 						{view:"button", label: 'Confirm', width: 87, align: 'center', click:"updateRows();"},
                         {view: "button", label: "Cancel", width: 87, click: "$$('add_rows').close();"}
 						]
 				},
 				body:{
 				    view: "counter",
                     label: "Add rows",
                     id: "counter",
                     align: "center",
                     value: 1,
                     min: 0

                 }
 			}).show();
         }



        //updates number of rows the user wants to update
        function updateRows(){
            var count = $$('counter').getValue(); //number of rows the user wants to add to the table

            for(var i=0; i < count; i++){
             var obj = {id: data_points.length + 1, time_input: null, conc_input: null, conc_input2: null};
             data_points.push(obj); //add obj to data_points
             $$('input_table').add(obj); //add obj (the blank row) to the input table
            }
            //refresh the data table and close the popup window
            $$('input_table').refresh();
            $$('add_rows').close();
            }


        function initialModel(model_type){
            //Runs a default simulation based off of known models sets up a user editable model
            //Inputs: model_type, the string of the type of model used
            //Returns: none, but loads the default model curve into the data_chart
            var model_data = [];
            var data_set = getData();
            var t_max = data_set[2];
            hide(); //hides all model names
            if(model_type.localeCompare('Gompertz') == 0){
                model = "Gompertz";
                changeSliders(2,["\u03BC max","\u03BB (Lag)"]);
                model_data = gompertzModel(data_set[0], data_set[1], data_set[3], data_set[4], t_max);
                $$('header').show();
                }
            else if(model_type.localeCompare('Huang') == 0){
                model = "Huang";
                changeSliders(2,["\u03BC max","\u03BB (Lag)"]);
                model_data = huangModel(data_set[0], data_set[1], data_set[3], data_set[4], t_max);
                $$('header2').show();
            }
            else if(model_type.localeCompare('Baranyi') == 0){
                model = "Baranyi";
                changeSliders(2,["\u03BC max","H0"]);
                model_data = baranyiModel(data_set[0], data_set[1], data_set[3], data_set[4], t_max);
                $$('header3').show();
            }
            else if(model_type.localeCompare('Buchanan') == 0){
                model = "Buchanan";
                changeSliders(2,["\u03BC max","\u03BB (Lag)"]);
                model_data = buchananModel(data_set[0], data_set[1], data_set[3], data_set[4], t_max);
                $$('header4').show();
            }
            if(model_type.localeCompare('No_lag') == 0){
                model = "No_lag";
                changeSliders(1,["\u03BC max"]);
                model_data = noLagModel(data_set[0], data_set[1], data_set[3], t_max);
                $$('header5').show();
                }
            else if(model_type.localeCompare('R_huang') == 0){
                model = "R_huang";
                changeSliders(2,["\u03BC max","\u03BB (Lag)"]);
                model_data = redHuangModel(data_set[0], data_set[3], data_set[4], t_max);
                $$('header6').show();
            }
            else if(model_type.localeCompare('R_baranyi') == 0){
                model = "R_baranyi";
                changeSliders(2,["\u03BC max","H0"])
                model_data = redBaranyiModel(data_set[0], data_set[3], data_set[4], t_max);
                $$('header7').show();
            }
            else if(model_type.localeCompare('R2_buchanan') == 0){
                model = "R2_buchanan";
                changeSliders(2,["\u03BC max","\u03BB (Lag)"])
                model_data = twoBuchananModel(data_set[0], data_set[3], data_set[4], t_max);
                $$('header8').show();
            }
            else if(model_type.localeCompare('S_gompertz') == 0){
                model = "S_gompertz";
                changeSliders(2,["\u03BC max","\u03BB (Lag)"])
                model_data = sGompertzModel(data_set[0], data_set[3], data_set[4], t_max);
                $$('header11').show();
            }
            else if(model_type.localeCompare('S_weibull') == 0){
                model = "S_weibull";
                changeSliders(3,["Y0","K","alpha"])
                model_data = sWeibullModel(data_set[3], data_set[4], data_set[5], t_max);
                $$('header12').show();
            }
            else if(model_type.localeCompare('S_mafart') == 0){
                model = "S_mafart";
                changeSliders(3,["Y0","D","alpha"])
                model_data = sMafartModel(data_set[3], data_set[4], data_set[5], t_max);
                $$('header13').show();
            }
            else if(model_type.localeCompare('SR2_buchanan') == 0){
                model = "SR2_buchanan";
                changeSliders(3,['Y0','k',"\u03BB (Lag)"])
                model_data = sTwoBuchananModel(data_set[3], data_set[4], data_set[5], t_max);
                $$('header14').show();
            }
            else if(model_type.localeCompare('S3_buchanan') == 0){
                model = "S3_buchanan";
                changeSliders(4,['Y0',"YTail",'k',"\u03BB (Lag)"])
                model_data = sThreeBuchananModel(data_set[3], data_set[4], data_set[5], data_set[6], t_max);
                $$('header15').show();
            }
            else if(model_type.localeCompare('D_Arrhenius_full') == 0){
                if(!(model.localeCompare('D_Arrhenius_full')) == 0){
                    model = "D_Arrhenius_full";
                    changeSliders(5,["Ea", "alpha", 'A', 'b', 'Tmax'])
                    setSlider('s1', ["2500", '2000', '3000', '100'])
                    setAxes("Temp", "\u221A\u03BC" )
                }

                model_data = arrheniusFullModel(data_set[3], data_set[4],data_set[5], data_set[6],data_set[7],t_max);
                $$('header16').show();
            }
            else if(model_type.localeCompare('D_Arrhenius_sub') == 0){
                model = "D_Arrhenius_sub";
                changeSliders(3,["Ea", "alpha", 'A' ])
                model_data = arrheniusSubModel(data_set[3], data_set[4], data_set[5], t_max);
                $$('header17').show();
            }
            else if(model_type.localeCompare('D_Cardinal_full') == 0){
                model = "D_Cardinal_full";
                changeSliders(4,["Tmin", "Topt", 'Tmax', "\u03BC max"])
                model_data = cardinalFullModel(data_set[3], data_set[4], data_set[5],  data_set[6], t_max);
                $$('header18').show();
            }
            else if(model_type.localeCompare('D_Huang_full_temp') == 0){
                model = "D_Huang_full_temp";
                changeSliders(4,["T0", "Tmax", 'a', "b"])
                model_data = huangFullModel(data_set[3], data_set[4], data_set[5],  data_set[6],t_max);
                $$('header19').show();
            }
            else if(model_type.localeCompare('D_Huang_sub_temp') == 0){
                model = "D_Huang_sub_temp";
                changeSliders(2,["T0","a"])
                model_data = huangSubModel(data_set[3], data_set[4], t_max);
                $$('header20').show();
            }
            else if(model_type.localeCompare('D_Ratkowsky_full') == 0){
                model = "D_Ratkowsky_full";
                changeSliders(4,["T0", "Tmax", 'a', "b"])
                model_data = ratkowskyFullModel(data_set[3], data_set[4], data_set[5],  data_set[6],t_max);
                $$('header21').show();
            }
            else if(model_type.localeCompare('D_Ratkowsky_sub') == 0){
                model = "D_Ratkowsky_sub";
                changeSliders(2,["T0","a"])
                model_data = ratkowskySubModel(data_set[3], data_set[4], t_max);
                $$('header22').show();
            }

            //loading data points from user's data
            for(var i = 0; i < data_points.length; i++){
                //if either conc_inputs have a value and time_input is not null, we want to add it to the array
                if((data_points[i].conc_input !=  null || data_points[i].conc_input2 != null) && data_points[i].time_input != null) {
                    model_data.push(data_points[i]);
                }
            }

        $$('data_chart').parse(model_data);
        }

        //Hides all model headers
        function hide() {
            $$('header').hide();
            $$('header2').hide();
            $$('header3').hide();
            $$('header4').hide();
            $$('header5').hide();
            $$('header6').hide();
            $$('header7').hide();
            $$('header8').hide();
            $$('header9').hide();
            $$('header10').hide();
            $$('header11').hide();
            $$('header12').hide();
            $$('header13').hide();
            $$('header14').hide();
            $$('header15').hide();
            $$('header16').hide();
            $$('header17').hide();
            $$('header18').hide();
            $$('header19').hide();
            $$('header20').hide();
            $$('header21').hide();
            $$('header22').hide();
        }

        function gompertzModel(y_initial, y_max,mu_max,lag,x){
            /* used to run a simulation of the gompertz model
             Inputs: y_initial (float)- the y value of the first data point
                     y_max (float)- the y value of the last data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {

                array.push({time_input: time, conc_input2: y_initial + (y_max - y_initial) * Math.exp(-1 *
                        (Math.exp(-1 * (((time - lag) * mu_max * Math.exp(1)) / (y_max - y_initial) - 1.0))))});
            }
            return array;
        }

        function huangModel(y_initial, y_max,mu_max,lag,x) {
            /*used to run a simulation of the hu ang model
             Inputs: y_initial (float)- the y value of the first data point
                     y_max (float)- the y value of the last data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var b;
            for(time = 0; time <x; time+= (x/500.)) {
                b = (time + (0.25 *(Math.log(1.0 + Math.exp(-4.0 * (time - lag))))) -
                (0.25 * (Math.log(1.0 + Math.exp(4.0*lag)))));
                array.push({time_input: time,
                    conc_input2: (y_initial + y_max - (Math.log( Math.exp(y_initial) +
                        ((Math.exp(y_max) - Math.exp(y_initial)) * (Math.exp(-1.0*mu_max*b))))  )) });
            }
            return array;
        }

        function baranyiModel(y_initial, y_max,mu_max,h0,x) {
            /*used to run a simulation of the baranyi model
             Inputs: y_initial (float)- the y value of the first data point
                     y_max (float)- the y value of the last data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var a;
            for(time = 0; time <x; time+= (x/500.)) {
                a = (mu_max*time) + Math.log(Math.exp(-1*mu_max*time)+(Math.exp(-1*h0)-Math.exp((-1*mu_max*time)-h0)));
                array.push({time_input: time,
                    conc_input2: y_initial + a - Math.log(1.0 + ((Math.exp(a) - 1.0)/ Math.exp(y_max - y_initial)) )});
            }
            return array;
        }

        function buchananModel(y_initial, y_max,mu_max,lag,x) {
            /*used to run a simulation of the buchanan model
            Inputs: y_initial (float)- the y value of the first data point
                     y_max (float)- the y value of the last data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {
                if (time<lag){
                    array.push({time_input: time, conc_input2: y_initial});
                }
                else if(time<(lag+(y_max-y_initial)/mu_max)){
                    array.push({time_input: time, conc_input2: y_initial + mu_max*(time-lag)});
                }
                else{
                    array.push({time_input: time, conc_input2: y_max});
                }
            }

            return array;
        }

        function noLagModel(y_initial, y_max,mu_max,x){
            /*used to run a simulation of the gompertz model
            Inputs: y_initial (float)- the y value of the first data point
                     y_max (float)- the y value of the last data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {
                array.push({time_input: time, conc_input2: y_max + mu_max*time -
                                            Math.log(Math.exp(mu_max*time) + Math.exp(y_max-y_initial) -1)});
            }
            return array;
        }

        function redHuangModel(y_initial, mu_max,lag,x) {
            /*used to run a simulation of the reduced huang model
            Inputs: y_initial (float)- the y value of the first data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */


            var array = [];

            for(time = 0; time <x; time+= (x/500.)) {
                array.push({time_input: time,
                    conc_input2: y_initial+ mu_max*(time + 0.25*
                                            Math.log((1.0 + Math.exp(-4.0*(time-lag)))/(1.0 + Math.exp(4.0*lag))))
                });
            }
            return array;
        }

        function redBaranyiModel(y_initial,mu_max,h0,x) {
            /*used to run a simulation of the reduced baranyi model
            Inputs: y_initial (float)- the y value of the first data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var a;
            for(time = 0; time <x; time+= (x/500.)) {
                array.push({time_input: time,
                    conc_input2: y_initial + (mu_max*time) + Math.log(Math.exp(-1*mu_max*time) +
                                                                    Math.exp(-h0) - Math.exp(-1*mu_max*time*h0))});
            }
            return array;
        }

        function twoBuchananModel(y_initial,mu_max,lag,x) {
            /*used to run a simulation of the two phase Buchanan model
            Inputs: y_initial (float)- the y value of the first data point
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {
                    if(time< lag){
                        array.push({ time_input: time, conc_input2:y_initial

                        });
                    }
                    else if ( time >= lag) {
                        array.push({time_input: time, conc_input2: y_initial + mu_max * (time - lag)});
                    }
            }

            return array;
        }

        function sLinearModel(y_initial, D,x) {
            /*used to run a simulation of the survival gompertz model
             Inputs: y_initial (float)- the y value of the first data points
             D -
             x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
             */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {

                array.push({
                    time_input: time,conc_input2: y_initial - (time/D)
                });
            }
            return array;

        }

        function sLinearShoulderModel(y_initial, D, y_tail,x) {
            /*used to run a simulation of the survival gompertz model
             Inputs: y_initial (float)- the y value of the first data points
             D -
             y_tail (float) - the y value of the tail of the growth curve
             x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
             */
            var array = [];
            t_crit = D* (y_initial - y_tail)
            for(time = 0; time <x; time+= (x/500.)) {
                if (time < t_crit) {
                    array.push({
                        time_input: time, conc_input2: y_initial - (time/D)
                    });
                }
                else{
                    array.push({
                        time_input: time, conc_input2: y_tail
                    });
                }
            }
            return array;



        }


        function sGompertzModel(y_initial, mu_max,lag,x){
            /*used to run a simulation of the survival gompertz model
            Inputs: y_initial (float)- the y value of the first data points
                     mu_max (float)- growth coefficient, determines rate of bacteria growth
                     lag (float)- time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {

                array.push({
                    time_input: time,conc_input2: y_initial *
                                        (1.0 - Math.exp(-Math.exp(-(mu_max*Math.exp(1.0)*(time-lag)/y_initial - 1.0 ))))
                });
            }
            return array;
        }

         function sWeibullModel(y_initial, k,alpha,x){
            /*used to run a simulation of the gompertz model
             Inputs: y_initial (float)- the y value of the first data points
                     k -
                     alpha -
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {

                array.push({time_input: time, conc_input2: y_initial - ( k * (Math.pow(time, alpha)))})

            }
            return array;
        }
        
         function sMafartModel(y_initial, D, alpha,x){
            /*used to run a simulation of the gompertz model
             Inputs: y_initial (float)- the y value of the first data points
                     d -
                     alpha -
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {

                array.push({time_input: time, conc_input2: y_initial - (Math.pow((time/D),alpha))});
            }
            return array;
        }
        
         function sTwoBuchananModel(y_initial,k,lag,x){
            /*used to run a simulation of the gompertz model
             Inputs: y_initial (float)- the y value of the first data points
                     k -
                     lag (float) - time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(time = 0; time <x; time+= (x/500.)) {
                    if(time< lag){
                        array.push({ time_input: time, conc_input2:y_initial

                        });
                    }
                    else if ( time >= lag) {
                        array.push({time_input: time, conc_input2: y_initial  - ((time-lag)/k)});
                    }
            }
            return array;
        }
        
         function sThreeBuchananModel(y_initial, y_tail,k,lag,x){
            /*used to run a simulation of the gompertz model
             Inputs: y_initial (float)- the y value of the first data points
                     y_tail -
                     k -
                     lag (float) - time value before growth begins
                     x (float) - dt of the entire dataset
             Returns: array - a list of time/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var tc = ((y_initial-y_tail)*k) + lag
            for(time = 0; time <x; time+= (x/500.)) {
                if (time < lag) {
                    array.push({
                        time_input: time, conc_input2: y_initial});
                }
                else if (time >= tc){
                    array.push({time_input: time, conc_input2: y_tail})
                }
                else if (time >= lag) {
                    array.push({time_input: time, conc_input2: y_initial  - ((time-lag)/k)});
                }

            }
            return array;
        }

         function arrheniusFullModel(Ea, alpha, A, b, Tmax, x) {
            /*used to run a simulation of the Arrhenius Full Range Secondary model
            Inputs: Ea (float)-
                    alpha -
                    A
                    b
                    x (float) - dt of the entire dataset
             Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var m,c;
            for(temp = 0; temp <x; temp+= (x/500.)) {
                m = Math.pow((Ea/(temp+273.15)/8.314),alpha)
                c = 1.0 - Math.exp(b*(temp-Tmax))
                array.push({time_input: temp,
                    conc_input2: (A*(temp + 273.15)*Math.exp(-m)*c)});
            }
            return array;
        }

        function arrheniusSubModel(Ea, alpha, A, x) {
            /*used to run a simulation of the Arrhenius Sub Range Secondary model
            Inputs: Ea - Activation energy, set 2000-3000
                    alpha - coefficient, set 15-30
                    A -
                    x (float) - dt of the entire dataset
             Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var m;
            for(temp = 0; temp <x; temp+= (x/500.)) {
                m = Math.pow((Ea/(temp+273.15)/8.314),alpha)
                array.push({time_input: temp,
                    conc_input2: (A*(temp + 273.15)*Math.exp(-m))});
            }
            return array;
        }

        function cardinalFullModel(t_min,t_opt, t_max, mu_max,x) {
            /*used to run a simulation of the Cardinal Full Range Secondary model
            Inputs: t_min -
                    t_opt -
                    x (float) - dt of the entire dataset
                    mu_max (float)- growth coefficient, determines rate of bacteria growth
             Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            var c;
            for(var temp = 0; temp <x; temp+= (x/500.)) {
                c = ((t_opt - t_min)*(temp - t_opt) - (t_opt-t_max)*(t_opt + t_min - (2.0*temp))) * (t_opt - t_min)
                array.push({time_input: temp, conc_input2: mu_max * (temp - t_max) * (Math.pow((temp - t_min),(2.0/c)))})
            }

            return array;
        }

        function huangSubModel(T0,a,x) {
            /*used to run a simulation of the Huang Sub Range Secondary model
            Inputs: T0 -
                    a -
                    x (float)- growth coefficient, determines rate of bacteria growth
            Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(temp = 0; temp <x; temp+= (x/500.)) {
                array.push({time_input: temp,
                    conc_input2: Math.pow((a*(temp-T0)), .75)});
            }
            return array;

        }

        function huangFullModel(T0,t_max,a,b,x) {
            /*used to run a simulation of the Huang Full Range Secondary model
            Inputs: T0 -
                    x (float)- growth coefficient, determines rate of bacteria growth
                    a -
                    b -
            Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(temp = 0; temp <x; temp+= (x/500.)) {
                array.push({time_input: temp,
                    conc_input2: Math.pow(a*(temp-T0),(0.75*(1.0 - Math.exp(b*(temp-t_max)))))});
            }
            return array;
        }

        function ratkowskyFullModel(T0,Tmax,a,b,x) {
            /*used to run a simulation of the Ratkowsky Full Range Secondary model
            Inputs: T0 -
                    x (float)- growth coefficient, determines rate of bacteria growth
                    a -
                    b -
            Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(temp = 0; temp <x; temp+= (x/500.)) {
                array.push({time_input: temp,
                    conc_input2: (a*(temp-T0)*(1.0 - Math.exp(b*(temp-Tmax))))});
            }
            return array;
        }

        function ratkowskySubModel(T0,a,x) {
            /*used to run a simulation of the Ratkowsky Sub Range Secondary model
            Inputs: T0 -
                    a -
                    x (float)- growth coefficient, determines rate of bacteria growth
            Returns: array - a list of temp/conc_input2 objects represting the calculated growth curve
            */

            var array = [];
            for(temp = 0; temp <x; temp+= (x/500.)) {
                array.push({time_input: temp,
                    conc_input2: (a*(temp-T0))});
            }
            return array;
        }

        function changeSliders(num,name_array){
            if (num == 0){
                $$('s1').hide();
                $$('s2').hide();
                $$('s3').hide();
                $$('s4').hide();
                $$('s5').hide();
                
                $$('f1').hide();
                $$('f2').hide();
                $$('f3').hide();
                $$('f4').hide();
                $$('f5').hide();
            }
            if( num  == 1){
                $$('s1').show();
                $$('s2').hide();
                $$('s3').hide();
                $$('s4').hide();
                $$('s5').hide();
                $$('s1').define('label',name_array[0]);
                $$('s1').render();


                $$('f1').show();
                $$('f2').hide();
                $$('f3').hide();
                $$('f4').hide();
                $$('f5').hide();
                $$('f1').define('label',name_array[0]);
                $$('f1').render();

            }
            else if( num  == 2){
                $$('s1').show();
                $$('s2').show();
                $$('s3').hide();
                $$('s4').hide();
                $$('s5').hide();
                $$('s1').define('label',name_array[0]);
                $$('s2').define('label',name_array[1]);
                $$('s1').render();
                $$('s2').render();
                
                $$('f1').show();
                $$('f2').show();
                $$('f3').hide();
                $$('f4').hide();
                $$('f5').hide();
                $$('f1').define('label',name_array[0]);
                $$('f2').define('label',name_array[1]);
                $$('f1').render();
                $$('f2').render();
            }
            else if(num == 3){
                $$('s1').show();
                $$('s2').show();
                $$('s3').show();
                $$('s4').hide();
                $$('s5').hide();
                $$('s1').define('label',name_array[0]);
                $$('s2').define('label',name_array[1]);
                $$('s3').define('label',name_array[2]);
                $$('s1').render();
                $$('s2').render();
                $$('s3').render();
                
                $$('f1').show();
                $$('f2').show();
                $$('f3').show();
                $$('f4').hide();
                $$('f5').hide();
                $$('f1').define('label',name_array[0]);
                $$('f2').define('label',name_array[1]);
                $$('f3').define('label',name_array[2]);
                $$('f1').render();
                $$('f2').render();
                $$('f3').render();
            }
            else if(num == 4){
                $$('s1').show();
                $$('s2').show();
                $$('s3').show();
                $$('s4').show();
                $$('s5').hide();
                $$('s1').define('label',name_array[0]);
                $$('s2').define('label',name_array[1]);
                $$('s3').define('label',name_array[2]);
                $$('s4').define('label',name_array[3]);
                $$('s1').render();
                $$('s2').render();
                $$('s3').render();
                $$('s4').render();
                
                $$('f1').show();
                $$('f2').show();
                $$('f3').show();
                $$('f4').show();
                $$('f5').hide();
                $$('f1').define('label',name_array[0]);
                $$('f2').define('label',name_array[1]);
                $$('f3').define('label',name_array[2]);
                $$('f4').define('label',name_array[3]);
                $$('f1').render();
                $$('f2').render();
                $$('f3').render();
                $$('f4').render();
            }
            else if(num == 5){
                $$('s1').show();
                $$('s2').show();
                $$('s3').show();
                $$('s4').show();
                $$('s5').show();
                $$('s1').define('label',name_array[0]);
                $$('s2').define('label',name_array[1]);
                $$('s3').define('label',name_array[2]);
                $$('s4').define('label',name_array[3]);
                $$('s5').define('label',name_array[4]);
                $$('s1').render();
                $$('s2').render();
                $$('s3').render();
                $$('s4').render();
                $$('s5').render();

                $$('f1').show();
                $$('f2').show();
                $$('f3').show();
                $$('f4').show();
                $$('f5').show();
                $$('f1').define('label',name_array[0]);
                $$('f2').define('label',name_array[1]);
                $$('f3').define('label',name_array[2]);
                $$('f4').define('label',name_array[3]);
                $$('f5').define('label',name_array[4]);
                $$('f1').render();
                $$('f2').render();
                $$('f3').render();
                $$('f4').render();
                $$('f5').render();
            }
        }

        //sets the upper limit, lower limit, current value, and step of a given slider
        function setSlider(slider,num_set){
            $$(slider).define('value',num_set[0]);
            $$(slider).define('min',num_set[1]);
            $$(slider).define('max',num_set[2]);
            $$(slider).define('step',num_set[3]);
            $$(slider).render()
        }
        
        function setAxes(x_name,y_name){
            $$('data_chart').define({
                xAxis:{
                    title: x_name,
                    start: 0,
                    stop: 10,
                    step: 1
                },
                yAxis:{
                    title: y_name
                }
            });
            $$('data_chart').refresh()
        }

         //checks to see if you data points has valid input
        function dataIsValid(){
            var min = data_points[0].conc_input;
            var popBox = true;
            var max = data_points[data_points.length - 1].conc_input;
            $$('input_table').editStop(); //makes editing stop so the last value is properly put in data_points

            for(var i = 0; i < data_points.length; i++){
                //if both inputs are null, we assume user doesnt want to add it to the list of data
                if(data_points[i].conc_input == null && data_points[i].time_input == null){
                    continue;
                }
                //if user accidently hit one of the empty cells, it would change values from null to ""
                //so account for that by setting them back to null
                else if(data_points[i].time_input == "" || data_points[i].conc_input == ""){
                    //console.log("here");
                    data_points[i].conc_input == null;
                    data_points[i].time_input == null;
                    continue;
                }

                //converts the strings to floats, if not valid floats they evaluate to NaN
                var timeValid = parseFloat(data_points[i].time_input); //x
                var conValid = parseFloat(data_points[i].conc_input); //y
                data_points[i].conc_input = conValid; //make the inputed values(strings) to floats in data_points in conc_input
                data_points[i].time_input = timeValid;//make the inputed values(strings) to floats in data_points in time_input


                //console.log(data_points);

                if(!isInt(timeValid)){ //if timeValid is not valid input
                    webix.alert({
                            type: "alert-warning",
                            text: "Warning! The data contains at least one non-numeric entry. Please verify!"
                    });
                    popBox = false;
                    $$('input_table').addCellCss(data_points[i].id, "time_input", "my_style");
                    break;
                }
                else if(!isInt(conValid)){ //if conc input isnt valid, have them verify

                    webix.alert({
                            type: "alert-warning",
                            text: "Warning! The data contains at least one non-numeric entry. Please verify!"
                    });
                    popBox = false;
                    $$('input_table').addCellCss(data_points[i].id, "conc_input", "my_style");
                    break;

                } else{ //if there are no issues, clear the background error color
                    $$('input_table').addCellCss(data_points[i].id, "time_input", "no_style");
                    $$('input_table').addCellCss(data_points[i].id, "conc_input", "no_style");
                }

                //determines the min and max values to be used later to determine if y values are in log or ln
                if(conValid < min){
                    min = conValid;
                }
                if(conValid > max){
                    max = conValid;
                }
            }
            //we only want to alert one box at a time
            //if true, we want to display the following warning and convert if necessary
            if(popBox == true){
                //check if the Y value is within the correct range and alert if it isn't
                if(min < 6.0 && max < 10.0){
                    webix.confirm({
                        ok: "Yes",
                        cancel: "No",
                        type: "confirm-error",
                        text: "Warning!- The colony counts appear to be in log CFU. They must be converted to ln " +
                            "CFU for data analysis. Do you want to convert data to ln CFU?",
                        callback: function(result){
                            //if they clicked ok ("yes")
                            if(result === true){
                                convert(); //converts data to ln
                                plotData();//plots the data
                            }
                        }
                    });
                }
            }

        }

        //if it is an int or null or float value, return true, otherwise false
        function isInt(n){
            //if it evaluates to NaN, it must have been a string
            if(isNaN(n) || n == null){
                return false;
            }
           //was not a string, if it's correct input, return true
            else if(typeof n == 'number' && Math.round(n) % 1 == 0 ) {
                return true;
            }
            //default is false
            return false;
        }

        //will convert from log to ln
        function convert(){
            for(var i = 0; i < data_points.length; i++){
                if((data_points[i].conc_input == null && data_points[i].time_input == null) ||
                    data_points[i].conc_input == "" || data_points[i].time_input == ""){
                    continue;
                }
                data_points[i].conc_input *= 2.303; //multiply by 2.303 puts the data into ln form
            }
            $$('input_table').refresh();
        }

        function clearModelData(){
            for(var i = 0; i < data_points.length; i++){
                data_points[i].conc_input2 = null;
                data_points[i].time_input = null;

            }
            $$('data_chart').refresh();
        }

        //Starts the tutorial
        function tutorial(){
            webix.alert({
                        ok: "Continue",
                        id: "win0",
                        cancel: "Close",
                        //type: "alert-warning",
                        text: "We will begin a quick tutorial of the IPMP page. To exit at any point, hit close.",
                        callback: function(result){
                            //if they clicked ok ("Continue")
                            if(result === true){
                                window1();
                            }
                        }
                    });
        }

        //Explains how to input data and check to make sure the inputed data is valid
        function window1(){
            webix.modalbox({
                title:"Datatable",
                buttons:["Continue", "Close"],
                text: "You can input data in the datatable to the left by copying and pasting from an excel spreadsheet, " +
                "entering them individually or by opening a file (.csv or .txt)." +
                "After entering the data, hit 'Submit Data' to verify that the data is valid.",
                width:425,
                top: 90,
                left: 205,
                callback: function(result){
                    switch(result){
                        case "0":
                            window2();
                            break;
                        case "1":
                            break;
                    }
                }
            });
        }

        //Shows how to plot the inputed points and select which model they would like to use
        function window2() {
            webix.modalbox({
                title:"Plot and Model Selection",
                buttons:["Continue", "Close"],
                text:'You can then plot your points using the "Plot" button above. Then select which model you would like '+
                        'to use from the "Models" menu above.',
                width:350,
                top: 50,
                left: 405,
                callback: function(result){
                    switch(result){
                        case "0":
                            window3();
                            break;
                        case "1":
                            break;
                    }
                }
            });
        }

        //Explains how to use the sliders and what the "Model Submit" button does
        function window3(){
            webix.modalbox({
                title: "Submitting Your Model",
                buttons: ["Continue", "Close"],
                text: 'Use the sliders, that will appear after selecting a model, below to adjust the model curve you previously selected to make a better fit for your inputed data.' +
                ' Then click "Model Submit" to submit your model.',
                width: 120,
                top: 145,
                left: 3,
                callback: function(result){
                    switch(result){
                        case "0":
                            window4();
                            break;
                        case "1":
                            break;
                    }
                }
            });
        }

        //Shows the reports and what you can do with them
        function window4(){
            webix.modalbox({
                title: "Managing Reports",
                buttons: ["Close"],
                text: 'After your reports are generated, they will be shown below. ' +
                'You can then choose to export them as a PDF and save them, or you can clear them.',
                width: 120,
                top: 163,
                left: 255,
                callback: function(result){
                    switch(result){
                        case "0":
                            break;
                    }
                }
            });
        }

        function importData(file_struct) {
            var type = file_struct.type;

            //Check to see if the file type is valid, if it is not, alert the user that it is not a valid type
            if(type == "csv" || type == "txt"){
                webix.alert({
                    ok: "Add",
                    cancel: "Replace",
                    //type: "alert-warning",
                    text: "Do you want to add the file to the current data or replace the current data?",
                    callback: function(result){
                        //if they clicked ok ("Continue")
                        if(result === true){
                            addDataSet(file_struct);
                        }
                        else {
                            replaceDataSet(file_struct);
                        }
                   }
                });
            } else {
                webix.alert({
                   type: "alert-error",
                   title: "Error- File Type Not Supported",
                   ok: "Close",
                   text: "Only .txt or .csv files are supported"
               });
            }
        }

        //replace current data with the file data
        function replaceDataSet(file_struct){
            var reader = new FileReader();
            reader.onload = function(e){
                var text = reader.result;

                 //resets the arrays values
                for(var i = 0; i < data_points.length; i++){
                           data_points[i].conc_input = null;
                           data_points[i].time_input = null;
                           data_points[i].conc_input2 = null;
                       }

                var float_list =[]
                var start = 0;
                var end = 1;
                var dataIndex = 1;

                //adds each individual float in the input text to an array, then to a time/conc array
                while(end < text.length){
                    if(text.charCodeAt(end) != 44 && text.charCodeAt(end) != 13 && text.charCodeAt(end) != 9){
                        end++;
                    }
                    else {
                        float_list.push(parseFloat(text.slice(start, end)))
                        start = end + 1
                        while (text.charCodeAt(start) == 32 || text.charCodeAt(start) == 9) {
                            start++
                        }
                        end = start + 1
                    }
                }
                for(var item = 0; item < float_list.length; item += 2){
                    data_points.push({id: dataIndex, time_input: float_list[item],
                        conc_input: float_list[item + 1], conc_input2: null})
                    dataIndex++;
                }
                webix.alert({
                        ok: "Close",
                        text: "You have replaced the data with the uploaded data."
                });

                  //parse new data to the input_table
                  $$('input_table').parse({
                     pos: 0, //number of records will be right the last index +1
                    data: data_points
                    });
                    plotData();
                    $$("data_chart").render();
             };
            reader.readAsText(file_struct.file, "utf-8");
        }

        //Will add the selected file's data to the current data
        function addDataSet(file_struct){
            var reader = new FileReader();
            var time = 0, conc = 0, value= 0, char = 0, parsed = 0, arrayIndex = 0;
            reader.onload = function(e){
                var text = reader.result;
                var float_list =[]
                var start = 0;
                var end = 1;
                var dataIndex = 1;

                //reads the numbers in the input file into a array of floats, then an array of conc/time objects
                while(end < text.length){
                    if(text.charCodeAt(end) != 44 && text.charCodeAt(end) != 13 && text.charCodeAt(end) != 9){
                        end++;
                    }
                    else {
                        float_list.push(parseFloat(text.slice(start, end)))
                        start = end + 1
                        while (text.charCodeAt(start) == 32|| text.charCodeAt(start) == 9) {
                            start++
                        }
                        end = start + 1
                    }
                }

                //find out where in the array we want to place the imported data
                for(var r = 0; r < data_points.length; r++){
                    //once we find the first null object in the array, get the index for later and break
                    if(data_points[r].time_input == null && data_points[r].conc_input == null){
                        arrayIndex = r;
                        dataIndex = r + 1;
                         //console.log("this is dataIndex" + dataIndex);
                        //console.log("arrayIndex" + arrayIndex);
                        break;
                    }
                }

                //if the array was completly full, the indexs are still 0,
                //set the indexs equal to the array length so we can "push" the new data onto the array
                if(arrayIndex == 0 || dataIndex == 0) {
                    arrayIndex = data_points.length;
                    dataIndex = data_points.length + 1;
                }

                for(var item = 0; item < float_list.length; item += 2) {
                     if (arrayIndex < data_points.length) { //set the correct index to the correct data
                        data_points[arrayIndex] = ({id: dataIndex, time_input: float_list[item],
                                                            conc_input: float_list[item + 1], conc_input2: null})
                        dataIndex++;
                        arrayIndex++;
                    }
                    else {//Push the new data_point to the end of the array
                        data_points.data_points.push({
                        id: dataIndex, time_input: float_list[item],
                        conc_input: float_list[item + 1], conc_input2: null})
                        dataIndex++;
                    }

                }
                //parse new data to the input_table
                $$('input_table').parse(data_points);//{
                    // pos: arrayIndex, //number of records will be right the last index +1
                    //data: data_points
                //});
                webix.alert({
                        ok: "Close",
                        text: "You have added the file to the inputed data."
                });

            };
            reader.readAsText(file_struct.file, "utf-8");
        }



