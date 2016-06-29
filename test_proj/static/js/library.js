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
/*
        function updateData(new_data) {
            data_points = []
            console.log(data_points);
            for (var i = 0; i < new_data["plot"].length; i++) {
                data_points.push(new_data["plot"][i])
            };
            console.log(data_points)

        }
*/
        function getData() {
            //creates new array and pushes each value in the slider to the array
            //the array hold the data in the same order:
                //NO, NMax, Rate, Time, and M

            var input_data = [];
            input_data.push( $$('slider_input').getValues().s1); //NO
            input_data.push( $$('slider_input').getValues().s2); //NMax
            input_data.push( $$('slider_input').getValues().s3); //Rate
            input_data.push( $$('slider_input').getValues().s4); //Time
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