/**
 * Created by Carlo.Sivilotti on 7/28/2016.
 */

            input_data.push( y_initial); //Y0
            input_data.push( y_max); //Ymax
            input_data.push((t_max - t_initial));//time
            input_data.push( parseFloat($$('slider_input').getValues().s1)); //Rate/mu
            
            input_data.push( parseFloat($$('slider_input').getValues().s2)); //Lag/lambda
            input_data.push( parseFloat($$('slider_input').getValues().s3));
            input_data.push( parseFloat($$('slider_input').getValues().s4));
            input_data.push( parseFloat($$('slider_input').getValues().s5));
