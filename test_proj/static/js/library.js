        function set(){
            var data = $$('insert_input').getValues();
            $$('slider_input').setValues(data);
        }

        function get() {
            var data = $$('slider_input').getValues();
            $$('insert_input').setValues(data);
        }

        function computeData(){
            var data_set = getData();

            $.ajax({
                type: "GET",
                url: 'data/',
                dataType: "json",
                data: {
                    csrfmiddlewaretoken: '{{ csrf_token }}',
                    nO: data_set[0],
                    nmax: data_set[1],
                    rate: data_set[2],
                    time: data_set[3],
                    m: data_set[4]
                },

                success: function(json,data_points) {
                    data = json;
                    var new_points = data["plot"];
                    $$("data_chart").clearAll();
                    $$("data_chart").parse(new_points);
                    //plotData();
                }
            });
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
            input_data.push( parseFloat($$('slider_input').getValues().s3)); //Rate/mu
            input_data.push((t_max - t_initial));//time
            input_data.push( parseFloat($$('slider_input').getValues().s5)); //Lag/lambda


            return input_data
        }

        function submitModel(){
            if(!(model)){
                console.log("No model selected!")
                return null
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
                    rate: $$('slider_input').getValues().s3,
                    lag: $$('slider_input').getValues().s5
                },
                success: function(json) {
                    var data = json;
                    if( data['error'].localeCompare("successful") == 0) {
                        var text = data['text_output'];
                        console.log(text)
                        $$("output_table").parse({text_output: text})
                        //plotData();
                    }
                    else{
                        console.log("Backend analysis failed, adjust parameters for better fit")
                    }
                }
            });
        }

	//will refresh the scatter plot with the updated data passed in via the datatable
        function plotData(){
            updatedData = [];
            $$("data_chart").clearAll();
            $$('input_table').editStop();

            for(var i = 0; i < data_points.length; i++){
                //if either conc_inputs have a value and time_input is not null, we want to add it to the array
                if((data_points[i].conc_input !=  null || data_points[i].conc_input2 != null) && data_points[i].time_input != null) {
                    updatedData.push(data_points[i]);
                }
            }
            $$("data_chart").parse(updatedData);
            $$('data_chart').show();
        }

        function getTableData(){
             //creates two new arrays filled with x and y data from the input table, then pushes them to a master array
            var time_array = [];
            var conc_array = [];
            var indexed = 0;

            while($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input != null &&
                    $$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input != null){
                time_array.push(parseFloat($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input));
                conc_array.push(parseFloat($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input));
                indexed++
            }

            return [time_array, conc_array];

        }

        function printData(){
            $$('output_table').add(data_points);
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
             console.log(datas);
             var file_id = $$("open_file").files.getFirstId(); //getting the ID
             var fileobj = $$("open_file").files.getItem(file_id).file; //getting file object

             filename = fileobj.name.getValues;
             console.log(filename);
         }

        //brings a pop-up window with a counter to add rows to the input_table
         function addRows(){
             webix.ui({
 				view:"window",
 				id:"add_rows",
 				height:250,
 			    width:184,
 			    position: "center",
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


        function plotModel(type){
            //console.log(type)

            webix.ui({
                view: "window",
                id: "model_param",
                body: [
                    {view:"form", id:"slider_input", height: 160,elements:[
                                { view:"slider",  height: 20, type:"alt", min:0, max:5, label:"N0(0-5)", value:"0", name:"s1"},
                                { view:"slider", height: 20, type:"alt", min:0, max:9, label:"NMax(0-9)", value:"0", name:"s2"},
                    ]}
                ]
            })
        }

        function initialModel(model_type){
            //Runs a default simulation based off of known models sets up a user editable model
            //Inputs: model_type, the string of the type of model used
            //clearModelData();
            var model_data = [];
            var data_set = getData();
            var mu_approx = data_set[2]
            var t_max = data_set[3]
            hide(); //hides all model names
            if(model_type.localeCompare('Gompertz') == 0){
                model = "Gompertz"
                model_data = gompertzModel(data_set[0], data_set[1], mu_approx, data_set[4], t_max)
                $$('header').show(); //will show only the correct header name, not all names

                }
            else if(model_type.localeCompare('Huang') == 0){
                model = "Huang"
                model_data = huangModel(data_set[0], data_set[1], mu_approx, data_set[4], t_max);
                //clearModelData();
                $$('header2').show(); //shows Huang model only
            }
            else if(model_type.localeCompare('Baranyi') == 0){
                model = "Baranyi"
                model_data = baranyiModel(data_set[0], data_set[1], mu_approx, data_set[4], t_max)
                $$('header3').show(); //shows Baranyi model only
            }
            else if(model_type.localeCompare('Buchanan') == 0){
                model = "Buchanan"
                model_data = buchananModel(data_set[0], data_set[1], mu_approx, data_set[4], t_max)
                $$('header4').show(); //shows Baranyi model only
            }

            for(var i = 0; i < data_points.length; i++){
                //if either conc_inputs have a value and time_input is not null, we want to add it to the array
                if((data_points[i].conc_input !=  null || data_points[i].conc_input2 != null) && data_points[i].time_input != null) {
                    model_data.push(data_points[i]);

                }
            }
        $$('data_chart').parse(model_data);
        }

        //will hide all models, so we don't have more than one model displayed at a time
        function hide() {
            $$('header').hide();
            $$('header2').hide();
            $$('header3').hide();
            $$('header4').hide();
        }

        function gompertzModel(y_initial, y_max,mu_max,lag,x){
            //used to run a simulation of the gompertz model, outputs a time/conc obj array
            model = "Gompertz"
            var array = []
            for(time = 0; time <x; time+= (x/500.)) {

                array.push({time_input: time, conc_input2: y_initial + (y_max - y_initial) * Math.exp(-1 *
                        (Math.exp(-1 * (((time - lag) * mu_max * Math.exp(1)) / (y_max - y_initial) - 1.0))))})
            }
            return array
        }

        function huangModel(y_initial, y_max,mu_max,lag,x) {
            //used to run a simulation of the huang model, outputs a conc obj array

            model = "Huang";
            var array = [];
            var b;
            for(time = 0; time <x; time+= (x/500.)) {
                b = (time + (0.25 *(Math.log(1.0 + Math.exp(-4.0 * (time - lag))))) -
                (0.25 * (Math.log(1.0 + Math.exp(4.0*lag)))))
                array.push({time_input: time,
                    conc_input2: (y_initial + y_max - (Math.log( Math.exp(y_initial) +
                        ((Math.exp(y_max) - Math.exp(y_initial)) * (Math.exp(-1.0*mu_max*b))))  )) })
            }
            return array
        }

        function baranyiModel(y_initial, y_max,mu_max,lag,x) {
            //used to run a simulation of the baranyi model, outputs a time/conc obj array
            model = "Baranyi"
            var array = [];
            var a;
            for(time = 0; time <x; time+= (x/500.)) {
                a = (mu_max*time) + Math.log(Math.exp(-1*mu_max*time)+(Math.exp(-1*lag)-Math.exp((-1*mu_max*time)-lag)))
                array.push({time_input: time,
                    conc_input2: y_initial + a - Math.log(1.0 + ((Math.exp(a) - 1.0)/ Math.exp(y_max - y_initial)) )})
            }
            return array
        }

        function buchananModel(y_initial, y_max,mu_max,lag,x) {
            //used to run a simulation of the baranyi model, outputs a time/conc obj array
            model = "Buchanan"
            var array = []
            for(time = 0; time <x; time+= (x/500.)) {
                if (time<lag){
                    array.push({time_input: time, conc_input2: y_initial})
                }
                else if(time<(lag+(y_max-y_initial)/mu_max)){
                    array.push({time_input: time, conc_input2: y_initial + mu_max*(time-lag)})
                }
                else{
                    array.push({time_input: time, conc_input2: y_max})
                }
            }

            return array
        }

        function setSliders(first_name,second_name){
            $$("slider_input").define({
                elements: [
                    { view:"slider", type:"alt", min:0, max:10,step:.5, label:first_name, value:"1", name:"s3",
                                    title:webix.template("#value#")},
                    { view:"slider",type:"alt",  step: .5 ,max: 10,label:second_name, value:"1", name:"s5",
                                    title:webix.template("#value#")}
                ]

                })
            $$("rate").define("label",first_name)
            $$("m").define("label",second_name)
            $$("slider_input").refresh()
                $$("insert_input").refresh()
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
                //converts the strings to floats, if not valid floats they evaluate to NaN
                var timeValid = parseFloat(data_points[i].time_input); //x
                var conValid = parseFloat(data_points[i].conc_input); //y
                data_points[i].conc_input = conValid; //make the inputed values(strings) to floats in data_points in conc_input
                data_points[i].time_input = timeValid;//make the inputed values(strings) to floats in data_points in time_input

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
                if(data_points[i].conc_input == null && data_points[i].time_input == null){
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