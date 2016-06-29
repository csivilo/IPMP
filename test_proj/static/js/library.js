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
                //NO, NMax, Rate, Time, and M

            var input_data = [];




            


            input_data.push( $$('slider_input').getValues().s3); //Rate

            input_data.push( $$('slider_input').getValues().s5); //M


            return input_data
        }

        function initialModel(model_type){

            var table_data = getTableData()

            $.ajax({
                type: "GET",
                url: 'model/',
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




        function getTableData(){
             //creates two new arrays filled with x and y data from the input table, then pushes them to a master array
            var time_array = []
            var conc_array = []
            var indexed = 0;

            while($$("input_table").getIdByIndex(indexed)){
                time_array.push(parseInt($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).time_input))
                conc_array.push(parseInt($$("input_table").getItem($$("input_table").getIdByIndex(indexed)).conc_input))
                indexed++
            }

            var master_array = [time_array, conc_array]

            return master_array
        }


        //will refresh the scatter plot with the updated data passed in via the datatable
        function plotData(){
            $$("data_chart").clearAll();
            $$("data_chart").parse(data_points);
            $$('data_chart').show();

            console.log(data_points);
        }

        function printData(){
            $$('output_table').add(data_points);
        }

        
         function clearData(){
            $$('input_table').clearAll()
            
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



        function gompertzModel(y_max,y_initial,mu_max,lag,x){
            //used to run a simulation of the gompertz model, outputs an array of conc values
            y_array = y_initial + (y_max-y_initial)*math.exp(-math.exp(-((x - lag)*mu_max*math.exp(1)/(y_max-y_initial) - 1.0)));
            return y_array;
        }

