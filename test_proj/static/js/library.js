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

            input_data.push( y_initial); //N0
            input_data.push( y_max); //Nmax
            input_data.push( parseInt($$('slider_input').getValues().s3)); //Rate
            input_data.push((t_max - t_initial));//time
            input_data.push( parseInt($$('slider_input').getValues().s5)); //Lag

            console.log(input_data);
            return input_data
        }

        function submitModel(model_type){

            var table_data = getTableData();

            $.ajax({
                type: "GET",
                url: 'data/',
                dataType: "json",
                data: {
                    csrfmiddlewaretoken: '{{ csrf_token }}',
                    model: model_type,
                    time_array: JSON.stringify(table_data[0]),
                    conc_array: JSON.stringify(table_data[1]),
                    rate: $$('slider_input').getValues().s3,
                    lag: $$('slider_input').getValues().s5
                },
            });
        }
	
	//will refresh the scatter plot with the updated data passed in via the datatable
        function plotData(){
            updatedData = [];
            $$("data_chart").clearAll();
            $$('input_table').editStop();

            for(var i = 0; i < data_points.length; i++){
                //if inputs are both null, we don't add it to the new array, otherwise we do
                if(data_points[i].conc_input !=  null && data_points[i].time_input != null) {
                    updatedData.push(data_points[i]);
                }
            }
           // console.log(updatedData);
            $$("data_chart").parse(updatedData);
            $$('data_chart').show();
        }


        function getTableData(){
             //creates two new arrays filled with x and y data from the input table, then pushes them to a master array
            var time_array = [];
            var conc_array = [];
            var indexed = 0;

            while($$("input_table").getItem($$("input_table").getIdByIndex(indexed+1)).conc_input != null &&
                    $$("input_table").getItem($$("input_table").getIdByIndex(indexed+1)).time_input != null){
                time_array.push(parseInt($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input));
                conc_array.push(parseInt($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input));
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
                       }
                       $$('input_table').refresh();
                   }
               }
           });
        }

        function plotModel(type){
            console.log(type)

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

            model_data = [];
            data_set = getData();
            mu_approx = ((data_set[1]-data_set[0])/data_set[2]);
            var time = 0;

            if(model_type.localeCompare('Gompertz') == 0){
                for(time = 0; time <10; time++) {
                    model_data.push({
                        time_input: time,
                        conc_input: gompertzModel(data_set[0], data_set[1], mu_approx, data_set[4], time)
                    })
                }
                console.log(model_data);

                }




            else if(model_type.localeCompare('Huang') == 0){
                for(time = 0; time <10; time++){
                    model_data.push({time_input: time, conc_input:
                        huangModel(data_set[0],data_set[1],mu_approx,data_set[4],time)})
                }
                console.log(model_data);

            }
            else if(model_type.localeCompare('Baranyi') == 0){
                for(time = 0; time <10; time++){
                    model_data.push({time_input: time, conc_input:
                        baranyiModel(data_set[0],data_set[1],mu_approx,data_set[4],time)})
                }
                console.log(model_data);
            }


        $$('data_chart').parse(model_data)

        }




        function gompertzModel(y_initial, y_max,mu_max,lag,x){
            //used to run a simulation of the gompertz model, outputs a conc value
            return y_initial + (y_max-y_initial)*Math.exp(-1*
                                (Math.exp(-1*(((x - lag)*mu_max*Math.exp(1))/(y_max-y_initial) - 1.0))));

        }

        function huangModel(y_initial, y_max,mu_max,lag,x) {
            //used to run a simulation of the gompertz model, outputs a conc value
            var b = x + (0.25*(Math.log(1+Math.exp(-4.0*(x-lag))))) - (0.25*(Math.log(1+Math.exp(4.0*lag))));
            return y_initial + y_max - (Math.log((Math.exp(y_initial)) + (Math.exp(y_max)-Math.exp(y_initial)) *
                                                                                        Math.exp(-mu_max*b)))



        }

        function baranyiModel(y_initial, y_max,mu_max,lag,x) {
            //used to run a simulation of the gompertz model, outputs a conc value

            var a = mu_max*x + Math.log(Math.exp(-mu_max*x) + Math.exp(-lag) - Math.exp((-mu_max*x)-lag));
            return (y_initial + a - Math.log(1.0 + (Math.exp(a) - 1.0)/Math.exp(y_max-y_initial)))

        }