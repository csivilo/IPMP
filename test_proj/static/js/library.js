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